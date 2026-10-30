// Dates locales uniquement : `toISOString()` passerait en UTC et décalerait d'un jour le soir.

/** Date locale au format `AAAA-MM-JJ` (colonnes `date` de Postgres). */
export type DateIso = string;

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

/** « 26 oct. – 1 nov. 2026 » */
export function formaterPeriode(
  debut: Date,
  fin: Date,
  langue: string,
  mois: 'long' | 'short' = 'long',
) {
  return new Intl.DateTimeFormat(langue, {
    day: 'numeric',
    month: mois,
    year: 'numeric',
  }).formatRange(debut, fin);
}
