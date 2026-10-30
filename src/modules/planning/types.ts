import type { Creneau } from '@/core/database.types';

export type { Creneau };

export const CRENEAUX = ['midi', 'soir'] as const satisfies readonly Creneau[];

/** Date locale au format `AAAA-MM-JJ` (colonne `plan_date`). */
export type DateIso = string;

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
