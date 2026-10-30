import type { Case, Creneau, DateIso, RecettePlanifiable, Repas } from './types';

// Dates locales uniquement : `toISOString()` passerait en UTC et décalerait d'un jour le soir.

export function versIso(date: Date): DateIso {
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const jour = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${mois}-${jour}`;
}

/** `AAAA-MM-JJ` → Date locale à minuit ; `null` si la chaîne n'est pas une date réelle. */
export function depuisIso(iso: string): Date | null {
  const morceaux = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!morceaux) return null;
  const [annee, mois, jour] = morceaux.slice(1).map(Number) as [number, number, number];
  const date = new Date(annee, mois - 1, jour);
  return date.getMonth() === mois - 1 && date.getDate() === jour ? date : null;
}

export function ajouterJours(date: Date, jours: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + jours);
}

/** Lundi de la semaine de `date` (semaine du lundi au dimanche). */
export function lundiDe(date: Date): Date {
  const decalage = (date.getDay() + 6) % 7;
  return ajouterJours(date, -decalage);
}

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
