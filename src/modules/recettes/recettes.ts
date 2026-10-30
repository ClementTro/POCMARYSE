import type { Json, Ligne } from '@/core/database.types';
import { normaliser } from '@/shared/lib/texte';
import {
  DIFFICULTES,
  ORIGINES,
  type Difficulte,
  type FiltresRecettes,
  type Ingredient,
  type Origine,
  type Recette,
} from './types';

function estObjet(valeur: Json): valeur is { [cle: string]: Json | undefined } {
  return typeof valeur === 'object' && valeur !== null && !Array.isArray(valeur);
}

/** Lit la colonne jsonb `ingredients` en ignorant les entrées mal formées. */
export function lireIngredients(json: Json): Ingredient[] {
  if (!Array.isArray(json)) return [];
  return json.flatMap((entree) => {
    if (!estObjet(entree) || typeof entree.name !== 'string' || !entree.name.trim()) return [];
    const quantite = entree.quantity;
    return [
      {
        name: entree.name.trim(),
        quantity: typeof quantite === 'number' && Number.isFinite(quantite) ? quantite : null,
        unit: typeof entree.unit === 'string' ? entree.unit.trim() : '',
      },
    ];
  });
}

/** Lit la colonne jsonb `steps` (tableau de chaînes). */
export function lireEtapes(json: Json): string[] {
  if (!Array.isArray(json)) return [];
  return json.flatMap((etape) => (typeof etape === 'string' && etape.trim() ? [etape.trim()] : []));
}

export function versRecette(ligne: Ligne<'recipes'>): Recette {
  return {
    ...ligne,
    difficulty: DIFFICULTES.includes(ligne.difficulty) ? ligne.difficulty : 'facile',
    ingredients: lireIngredients(ligne.ingredients),
    steps: lireEtapes(ligne.steps),
  };
}

/** Recette de démo : partagée, en lecture seule, copiable dans son carnet. */
export function estDemo(recette: Pick<Recette, 'user_id'>): boolean {
  return recette.user_id === null;
}

export function tempsTotal(recette: Pick<Recette, 'prep_minutes' | 'cook_minutes'>): number {
  return recette.prep_minutes + recette.cook_minutes;
}

export function filtrerRecettes(recettes: Recette[], filtres: FiltresRecettes): Recette[] {
  const recherche = normaliser(filtres.texte);
  return recettes.filter((recette) => {
    if (filtres.origine === 'miennes' && estDemo(recette)) return false;
    if (filtres.origine === 'demo' && !estDemo(recette)) return false;
    if (filtres.difficulte && recette.difficulty !== filtres.difficulte) return false;
    if (filtres.tempsMax !== null && tempsTotal(recette) > filtres.tempsMax) return false;
    if (filtres.tag && !recette.tags.includes(filtres.tag)) return false;
    if (!recherche) return true;
    const cible = [recette.title, recette.description, ...recette.ingredients.map((i) => i.name)]
      .map(normaliser)
      .join(' ');
    return cible.includes(recherche);
  });
}

export function tagsDisponibles(recettes: Recette[]): string[] {
  const tags = new Set(recettes.flatMap((recette) => recette.tags));
  return [...tags].sort((a, b) => a.localeCompare(b, 'fr'));
}

/** Tri d'affichage : ses propres recettes d'abord, puis ordre alphabétique. */
export function trierRecettes(recettes: Recette[]): Recette[] {
  return [...recettes].sort(
    (a, b) => Number(estDemo(a)) - Number(estDemo(b)) || a.title.localeCompare(b.title, 'fr'),
  );
}

/** Filtres lus depuis l'URL (`?q=&tag=&temps=&difficulte=&origine=`) ; valeurs inconnues ignorées. */
export function lireFiltres(params: URLSearchParams): FiltresRecettes {
  const temps = Number(params.get('temps'));
  const difficulte = params.get('difficulte') ?? '';
  const origine = params.get('origine') ?? '';
  return {
    texte: params.get('q') ?? '',
    tag: params.get('tag') ?? '',
    tempsMax: Number.isInteger(temps) && temps > 0 ? temps : null,
    difficulte: (DIFFICULTES as readonly string[]).includes(difficulte)
      ? (difficulte as Difficulte)
      : '',
    origine: (ORIGINES as readonly string[]).includes(origine) ? (origine as Origine) : 'toutes',
  };
}

/** Inverse de `lireFiltres` : seuls les filtres actifs apparaissent dans l'URL. */
export function ecrireFiltres(filtres: FiltresRecettes): URLSearchParams {
  const params = new URLSearchParams();
  if (filtres.texte) params.set('q', filtres.texte);
  if (filtres.tag) params.set('tag', filtres.tag);
  if (filtres.tempsMax !== null) params.set('temps', String(filtres.tempsMax));
  if (filtres.difficulte) params.set('difficulte', filtres.difficulte);
  if (filtres.origine !== 'toutes') params.set('origine', filtres.origine);
  return params;
}

/** Suggestion du tableau de bord : la même toute la journée, une autre le lendemain. */
export function recetteDuJour<T extends { id: string }>(
  recettes: T[],
  jour: string,
): T | undefined {
  if (!recettes.length) return undefined;
  const stables = [...recettes].sort((a, b) => a.id.localeCompare(b.id));
  const graine = [...jour].reduce((somme, car) => (somme * 31 + car.charCodeAt(0)) % 100_003, 7);
  return stables[graine % stables.length];
}

export function formaterQuantite(quantite: number, langue: string): string {
  return new Intl.NumberFormat(langue, { maximumFractionDigits: 2 }).format(quantite);
}
