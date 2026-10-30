import type { Creneau } from '@/core/database.types';
import type { DateIso } from '@/shared/lib/dates';

export type { Creneau, DateIso };

export const CRENEAUX = ['midi', 'soir'] as const satisfies readonly Creneau[];

/** Ce que le planning a besoin de savoir d'une recette (requête dédiée, ADR 0005). */
export interface RecettePlanifiable {
  id: string;
  title: string;
  prep_minutes: number;
  cook_minutes: number;
}

export interface Repas {
  id: string;
  plan_date: DateIso;
  slot: Creneau;
  recipe_id: string;
  recette: RecettePlanifiable | null;
}

export interface Case {
  date: DateIso;
  creneau: Creneau;
}

/** Données transportées pendant un glisser : soit un repas déjà posé, soit une recette du bac. */
export type Glisse =
  | { type: 'repas'; repas: Repas; titre: string }
  | { type: 'recette'; recette: RecettePlanifiable; titre: string };
