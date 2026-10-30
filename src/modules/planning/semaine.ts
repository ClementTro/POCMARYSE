import { ajouterJours, depuisIso, lundiDe } from '@/shared/lib/dates';
import type { Case, Creneau, RecettePlanifiable, Repas } from './types';

export { ajouterJours, depuisIso, lundiDe, versIso } from '@/shared/lib/dates';

export function joursDeLaSemaine(lundi: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => ajouterJours(lundi, i));
}

/** Semaine demandée dans l'URL (`?semaine=AAAA-MM-JJ`), ramenée à son lundi ; sinon la semaine courante. */
export function lundiDepuisUrl(valeur: string | null, aujourdhui = new Date()): Date {
  const date = valeur ? depuisIso(valeur) : null;
  return lundiDe(date ?? aujourdhui);
}

export function cleCase({ date, creneau }: Case): string {
  return `${date}|${creneau}`;
}

export function lireCleCase(cle: string): Case | null {
  const [date, creneau] = cle.split('|');
  if (!date || !depuisIso(date) || (creneau !== 'midi' && creneau !== 'soir')) return null;
  return { date, creneau };
}

export function repasDansCase(repas: Repas[], { date, creneau }: Case): Repas | undefined {
  return repas.find((r) => r.plan_date === date && r.slot === creneau);
}

// Opérations sur la liste des repas de la semaine. Utilisées pour la mise à jour optimiste
// du cache pendant le glisser-déposer ; la base applique ensuite la même chose.

export function placer(repas: Repas[], cible: Case, recette: RecettePlanifiable): Repas[] {
  const sansOccupant = repas.filter(
    (r) => !(r.plan_date === cible.date && r.slot === cible.creneau),
  );
  return [
    ...sansOccupant,
    {
      id: `provisoire-${cleCase(cible)}`,
      plan_date: cible.date,
      slot: cible.creneau,
      recipe_id: recette.id,
      recette,
    },
  ];
}

/** Déplace un repas ; si la case est occupée, les deux repas échangent leur place. */
export function deplacer(repas: Repas[], id: string, cible: Case): Repas[] {
  const source = repas.find((r) => r.id === id);
  if (!source) return repas;
  const occupant = repasDansCase(repas, cible);
  return repas.map((r) => {
    if (r.id === source.id) return { ...r, plan_date: cible.date, slot: cible.creneau };
    if (occupant && r.id === occupant.id) {
      return { ...r, plan_date: source.plan_date, slot: source.slot };
    }
    return r;
  });
}

export function retirer(repas: Repas[], id: string): Repas[] {
  return repas.filter((r) => r.id !== id);
}

export function trierRepas(repas: Repas[]): Repas[] {
  const ordre: Record<Creneau, number> = { midi: 0, soir: 1 };
  return [...repas].sort(
    (a, b) => a.plan_date.localeCompare(b.plan_date) || ordre[a.slot] - ordre[b.slot],
  );
}
