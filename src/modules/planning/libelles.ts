import type { TFunction } from 'i18next';
import { depuisIso } from './semaine';
import type { Case } from './types';

/** En-tête de colonne sur deux lignes de hauteur fixe : « mercredi » puis « 28 oct. ». */
export function libelleJour(date: Date, langue: string) {
  return {
    jour: new Intl.DateTimeFormat(langue, { weekday: 'long' }).format(date),
    date: new Intl.DateTimeFormat(langue, { day: 'numeric', month: 'short' }).format(date),
  };
}

/** « lundi 26 octobre, Midi » : nom accessible d'une case et texte des annonces. */
export function libelleCase(t: TFunction<'planning'>, { date, creneau }: Case, langue: string) {
  const jour = depuisIso(date);
  const texteJour = jour
    ? new Intl.DateTimeFormat(langue, { weekday: 'long', day: 'numeric', month: 'long' }).format(
        jour,
      )
    : date;
  return t('case.libelle', { jour: texteJour, creneau: t(`creneaux.${creneau}`) });
}

/** « 26 oct. – 1 nov. 2026 » */
export function libelleSemaine(lundi: Date, dimanche: Date, langue: string): string {
  return new Intl.DateTimeFormat(langue, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).formatRange(lundi, dimanche);
}
