import { ajouterJours, depuisIso, lundiDe, versIso } from './dates';

describe('dates locales', () => {
  it('formate et relit les dates sans décalage de fuseau', () => {
    expect(versIso(new Date(2026, 9, 30, 23, 30))).toBe('2026-10-30');
    expect(versIso(depuisIso('2026-03-29')!)).toBe('2026-03-29');
  });

  it('refuse les dates impossibles ou mal formées', () => {
    expect(depuisIso('2026-02-30')).toBeNull();
    expect(depuisIso('30/10/2026')).toBeNull();
    expect(depuisIso('')).toBeNull();
  });

  it('trouve le lundi, y compris depuis un dimanche', () => {
    expect(versIso(lundiDe(new Date(2026, 9, 30)))).toBe('2026-10-26');
    expect(versIso(lundiDe(new Date(2026, 10, 1)))).toBe('2026-10-26');
    expect(versIso(lundiDe(new Date(2026, 9, 26)))).toBe('2026-10-26');
  });

  it('ajoute des jours à travers le changement d’heure', () => {
    expect(versIso(ajouterJours(new Date(2026, 2, 28), 1))).toBe('2026-03-29');
    expect(versIso(ajouterJours(new Date(2026, 9, 31), 1))).toBe('2026-11-01');
  });
});
