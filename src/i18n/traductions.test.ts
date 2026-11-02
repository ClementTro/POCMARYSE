import authEs from './locales/es/auth.json';
import commonEs from './locales/es/common.json';
import vitrineEs from './locales/es/vitrine.json';
import authFr from './locales/fr/auth.json';
import commonFr from './locales/fr/common.json';
import vitrineFr from './locales/fr/vitrine.json';

function cles(valeur: unknown, prefixe = ''): string[] {
  if (Array.isArray(valeur)) {
    return [
      `${prefixe}[${valeur.length}]`,
      ...valeur.flatMap((v, i) => cles(v, `${prefixe}[${i}]`)),
    ];
  }
  if (valeur && typeof valeur === 'object') {
    return Object.entries(valeur).flatMap(([cle, v]) =>
      cles(v, prefixe ? `${prefixe}.${cle}` : cle),
    );
  }
  return [prefixe];
}

describe('traductions espagnoles des pages publiques', () => {
  it.each([
    ['common', commonFr, commonEs],
    ['auth', authFr, authEs],
    ['vitrine', vitrineFr, vitrineEs],
  ])('%s contient exactement les mêmes textes qu’en français', (_, fr, es) => {
    expect(cles(es)).toEqual(cles(fr));
  });
});
