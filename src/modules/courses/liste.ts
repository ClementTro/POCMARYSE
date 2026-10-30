import { normaliser } from '@/shared/lib/texte';
import type { Article, ArticleSaisi, RepasACuisiner } from './types';
import { LONGUEUR_MAX_NOM } from './types';
import {
  accorderUnite,
  arrondir,
  cleUnite,
  depuisBase,
  UNITES_METRIQUES,
  versBase,
} from './unites';

function estObjet(valeur: unknown): valeur is Record<string, unknown> {
  return typeof valeur === 'object' && valeur !== null && !Array.isArray(valeur);
}

/**
 * Lit la colonne jsonb `recipes.ingredients` en ignorant les entrées mal formées.
 * Lecture propre au module : il ne dépend pas du module Recettes.
 */
export function lireIngredients(json: unknown): ArticleSaisi[] {
  if (!Array.isArray(json)) return [];
  return json.flatMap((entree: unknown) => {
    if (!estObjet(entree) || typeof entree.name !== 'string' || !entree.name.trim()) return [];
    const { quantity, unit } = entree;
    return [
      {
        name: entree.name.trim().slice(0, LONGUEUR_MAX_NOM),
        quantity:
          typeof quantity === 'number' && Number.isFinite(quantity) && quantity >= 0
            ? quantity
            : null,
        unit: typeof unit === 'string' ? unit.trim() : '',
      },
    ];
  });
}

/** Forme comparable d'un nom : « Pommes de terre » et « pomme de terre » se regroupent. */
export function cleNom(nom: string): string {
  return normaliser(nom.replace(/œ/gi, 'oe').replace(/æ/gi, 'ae'))
    .split(/\s+/)
    .map((mot) => (mot.length > 3 ? mot.replace(/s$/, '') : mot))
    .join(' ');
}

interface Groupe {
  name: string;
  famille: 'masse' | 'volume' | null;
  unit: string;
  total: number | null;
}

/**
 * Additionne les ingrédients identiques. Deux lignes se regroupent si leur nom est le même et
 * si leurs unités sont convertibles (g et kg, cl et l) ou identiques (« pincée »).
 */
export function agreger(ingredients: ArticleSaisi[]): ArticleSaisi[] {
  const groupes = new Map<string, Groupe>();
  for (const { name, quantity, unit } of ingredients) {
    const base = quantity === null ? null : versBase(quantity, unit);
    const famille = base?.famille ?? versBase(0, unit).famille;
    const cle = `${cleNom(name)}|${famille ?? cleUnite(unit)}`;
    const groupe = groupes.get(cle);
    if (!groupe) {
      groupes.set(cle, { name, famille, unit, total: base ? base.valeur : null });
    } else if (base) {
      groupe.total = (groupe.total ?? 0) + base.valeur;
    }
  }
  return trierParNom(
    [...groupes.values()].map(({ name, famille, unit, total }) => {
      if (total === null) return { name, quantity: null, unit: famille ? '' : unit };
      if (famille) return { name, ...depuisBase(famille, total) };
      const quantity = arrondir(total);
      return { name, quantity, unit: accorderUnite(unit, quantity) };
    }),
  );
}

export function listeDepuisRepas(repas: RepasACuisiner[]): ArticleSaisi[] {
  return agreger(repas.flatMap((r) => lireIngredients(r.recette?.ingredients)));
}

export function trierParNom<T extends { name: string }>(articles: T[]): T[] {
  return [...articles].sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
}

const SAISIE = new RegExp(
  `^(\\d+\\/[1-9]\\d*|\\d+(?:[.,]\\d+)?)\\s*(?:(${UNITES_METRIQUES.join('|')})\\.?(?=\\s|$))?\\s*(.*)$`,
  'i',
);

/** Saisie rapide : « 2 kg de pommes », « 500g farine », « 6 œufs » ou simplement « lait ». */
export function lireSaisie(texte: string): ArticleSaisi | null {
  const propre = texte.trim().replace(/\s+/g, ' ');
  if (!propre) return null;
  const morceaux = SAISIE.exec(propre);
  if (!morceaux) return { name: propre.slice(0, LONGUEUR_MAX_NOM), quantity: null, unit: '' };
  const [, nombre = '', unite = '', reste = ''] = morceaux;
  const name = reste.replace(/^(de |d['’]\s?)/i, '').trim();
  // « 2 » seul ou « 3 kg » seul : pas de nom, on garde le texte tel quel.
  if (!name) return { name: propre.slice(0, LONGUEUR_MAX_NOM), quantity: null, unit: '' };
  return {
    name: name.slice(0, LONGUEUR_MAX_NOM),
    quantity: lireNombre(nombre),
    unit: unite.toLowerCase(),
  };
}

function lireNombre(nombre: string): number {
  const [numerateur, denominateur] = nombre.split('/').map(Number);
  if (denominateur) return arrondir((numerateur ?? 0) / denominateur);
  return Number(nombre.replace(',', '.'));
}

export function compterRestants(articles: Pick<Article, 'checked'>[]): number {
  return articles.filter((article) => !article.checked).length;
}

export function formaterQuantite(article: Pick<Article, 'quantity' | 'unit'>, langue: string) {
  if (article.quantity === null) return '';
  const nombre = new Intl.NumberFormat(langue, { maximumFractionDigits: 2 }).format(
    article.quantity,
  );
  return [nombre, article.unit].filter(Boolean).join(' ');
}
