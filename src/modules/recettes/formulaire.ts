import { z } from 'zod';
import type { Insertion } from '@/core/database.types';
import { DIFFICULTES, type Recette } from './types';

// Les messages sont des clés de traduction du namespace `recettes`.
// Les nombres sont saisis en texte pour accepter la virgule décimale (« 1,5 »).

function versNombre(texte: string): number {
  return Number(texte.trim().replace(',', '.'));
}

const entier = (min: number, max: number, message: string) =>
  z
    .string()
    .trim()
    .regex(/^\d+$/, message)
    .refine((v) => versNombre(v) >= min && versNombre(v) <= max, message);

const quantite = z
  .string()
  .trim()
  .refine((v) => v === '' || (Number.isFinite(versNombre(v)) && versNombre(v) >= 0), {
    message: 'erreurs.quantite',
  });

export const schemaRecette = z.object({
  titre: z.string().trim().min(1, 'erreurs.titreRequis').max(120, 'erreurs.titreTropLong'),
  description: z.string().trim().max(1000, 'erreurs.descriptionTropLongue'),
  portions: entier(1, 30, 'erreurs.portions'),
  preparation: entier(0, 1440, 'erreurs.minutes'),
  cuisson: entier(0, 1440, 'erreurs.minutes'),
  difficulte: z.enum(DIFFICULTES),
  etiquettes: z.string().max(200, 'erreurs.etiquettesTropLongues'),
  ingredients: z
    .array(
      z.object({
        nom: z.string().trim().max(120, 'erreurs.ingredientTropLong'),
        quantite,
        unite: z.string().trim().max(20, 'erreurs.uniteTropLongue'),
      }),
    )
    .refine((liste) => liste.some((i) => i.nom !== ''), { message: 'erreurs.ingredientRequis' }),
  etapes: z
    .array(z.object({ texte: z.string().trim().max(1000, 'erreurs.etapeTropLongue') }))
    .refine((liste) => liste.some((e) => e.texte !== ''), { message: 'erreurs.etapeRequise' }),
});

export type ValeursRecette = z.infer<typeof schemaRecette>;

export const INGREDIENT_VIDE = { nom: '', quantite: '', unite: '' };
export const ETAPE_VIDE = { texte: '' };

export const VALEURS_NOUVELLE_RECETTE: ValeursRecette = {
  titre: '',
  description: '',
  portions: '4',
  preparation: '15',
  cuisson: '0',
  difficulte: 'facile',
  etiquettes: '',
  ingredients: [INGREDIENT_VIDE, INGREDIENT_VIDE, INGREDIENT_VIDE],
  etapes: [ETAPE_VIDE, ETAPE_VIDE],
};

/** « plat, Four, , four » → ['plat', 'four'] : minuscules, sans doublon ni vide. */
export function lireEtiquettes(texte: string): string[] {
  const etiquettes = texte
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set(etiquettes)];
}

/** Sans séparateur de milliers, pour que la saisie relue redonne le même nombre. */
function quantiteSaisie(quantite: number, langue: string): string {
  const texte = String(quantite);
  return langue.startsWith('fr') ? texte.replace('.', ',') : texte;
}

export function versValeursFormulaire(recette: Recette, langue: string): ValeursRecette {
  return {
    titre: recette.title,
    description: recette.description,
    portions: String(recette.servings),
    preparation: String(recette.prep_minutes),
    cuisson: String(recette.cook_minutes),
    difficulte: recette.difficulty,
    etiquettes: recette.tags.join(', '),
    ingredients: recette.ingredients.length
      ? recette.ingredients.map((i) => ({
          nom: i.name,
          quantite: i.quantity === null ? '' : quantiteSaisie(i.quantity, langue),
          unite: i.unit,
        }))
      : [INGREDIENT_VIDE],
    etapes: recette.steps.length ? recette.steps.map((texte) => ({ texte })) : [ETAPE_VIDE],
  };
}

/** Valeurs validées par `schemaRecette` → ligne à écrire dans `recipes`. */
export function versDonneesRecette(valeurs: ValeursRecette): Omit<Insertion<'recipes'>, 'user_id'> {
  return {
    title: valeurs.titre,
    description: valeurs.description,
    servings: versNombre(valeurs.portions),
    prep_minutes: versNombre(valeurs.preparation),
    cook_minutes: versNombre(valeurs.cuisson),
    difficulty: valeurs.difficulte,
    tags: lireEtiquettes(valeurs.etiquettes),
    ingredients: valeurs.ingredients
      .filter((i) => i.nom !== '')
      .map((i) => ({
        name: i.nom,
        quantity: i.quantite === '' ? null : versNombre(i.quantite),
        unit: i.unite,
      })),
    steps: valeurs.etapes.map((e) => e.texte).filter(Boolean),
  };
}
