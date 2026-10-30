import type { Difficulte, Ligne } from '@/core/database.types';

export type { Difficulte };

export const DIFFICULTES = [
  'facile',
  'moyen',
  'difficile',
] as const satisfies readonly Difficulte[];

/** Ingrédient stocké dans `recipes.ingredients` (jsonb). `quantity` nul = « selon le goût ». */
export type Ingredient = {
  name: string;
  quantity: number | null;
  unit: string;
};

export type Recette = Omit<Ligne<'recipes'>, 'ingredients' | 'steps'> & {
  ingredients: Ingredient[];
  steps: string[];
};

export const ORIGINES = ['toutes', 'miennes', 'demo'] as const;
export type Origine = (typeof ORIGINES)[number];

export interface FiltresRecettes {
  texte: string;
  tag: string;
  /** Temps total maximal (préparation + cuisson) en minutes ; `null` = sans limite. */
  tempsMax: number | null;
  difficulte: Difficulte | '';
  origine: Origine;
}

export const FILTRES_VIDES: FiltresRecettes = {
  texte: '',
  tag: '',
  tempsMax: null,
  difficulte: '',
  origine: 'toutes',
};

/** État de navigation vers la fiche : clé du message de confirmation à afficher. */
export interface EtatNavigationRecette {
  message?: string;
}

export const TEMPS_MAX_PROPOSES = [20, 30, 45, 60, 90] as const;
