import type { TFunction } from 'i18next';

/** 45 → « 45 min » ; 150 → « 2 h 30 » ; 120 → « 2 h ». */
export function formaterDuree(t: TFunction<'recettes'>, minutes: number): string {
  const heures = Math.floor(minutes / 60);
  const reste = minutes % 60;
  if (heures === 0) return t('duree.minutes', { count: reste });
  if (reste === 0) return t('duree.heures', { heures });
  return t('duree.heuresMinutes', { heures, minutes: String(reste).padStart(2, '0') });
}
