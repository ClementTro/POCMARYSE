import type { Ligne, SourceArticle } from '@/core/database.types';

export type { SourceArticle };

export type Article = Ligne<'shopping_items'>;

/** Ce qu'il faut pour écrire un article : un ingrédient de recette ou une saisie à la main. */
export interface ArticleSaisi {
  name: string;
  quantity: number | null;
  unit: string;
}

/** Repas du planning tel que lu par ce module (jointure sur `recipes`). */
export interface RepasACuisiner {
  recette: { ingredients: unknown } | null;
}

export interface ResultatGeneration {
  articles: number;
  repas: number;
}

export const LONGUEUR_MAX_NOM = 120;
