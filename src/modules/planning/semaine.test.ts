import {
  ajouterJours,
  cleCase,
  deplacer,
  depuisIso,
  joursDeLaSemaine,
  lireCleCase,
  lundiDe,
  lundiDepuisUrl,
  placer,
  repasDansCase,
  retirer,
  trierRepas,
  versIso,
} from './semaine';
import type { Repas } from './types';

const recette = (id: string) => ({ id, title: id, prep_minutes: 10, cook_minutes: 10 });

const repas = (id: string, plan_date: string, slot: 'midi' | 'soir'): Repas => ({
  id,
  plan_date,
  slot,
  recipe_id: `r-${id}`,
  recette: recette(`r-${id}`),
});

describe('dates de la semaine', () => {
  it('formate et relit les dates locales sans décalage de fuseau', () => {
    const tard = new Date(2026, 9, 30, 23, 30);
    expect(versIso(tard)).toBe('2026-10-30');
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

  it('liste 7 jours en traversant le changement de mois et d’heure', () => {
    const jours = joursDeLaSemaine(new Date(2026, 9, 26)).map(versIso);
    expect(jours).toEqual([
      '2026-10-26',
      '2026-10-27',
      '2026-10-28',
      '2026-10-29',
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
    ]);
    expect(versIso(ajouterJours(new Date(2026, 2, 28), 1))).toBe('2026-03-29');
  });

  it('lit la semaine dans l’URL, ou prend la semaine courante', () => {
    const aujourdhui = new Date(2026, 9, 30);
    expect(versIso(lundiDepuisUrl('2026-11-04', aujourdhui))).toBe('2026-11-02');
    expect(versIso(lundiDepuisUrl('n-importe-quoi', aujourdhui))).toBe('2026-10-26');
    expect(versIso(lundiDepuisUrl(null, aujourdhui))).toBe('2026-10-26');
  });

  it('encode et décode une case', () => {
    const c = { date: '2026-10-30', creneau: 'soir' as const };
    expect(lireCleCase(cleCase(c))).toEqual(c);
    expect(lireCleCase('2026-10-30|gouter')).toBeNull();
    expect(lireCleCase('recette:abc')).toBeNull();
  });
});

describe('opérations sur les repas', () => {
  const semaine = [repas('a', '2026-10-26', 'midi'), repas('b', '2026-10-27', 'soir')];

  it('place une recette dans une case vide ou remplace l’occupant', () => {
    const ajout = placer(semaine, { date: '2026-10-28', creneau: 'midi' }, recette('x'));
    expect(ajout).toHaveLength(3);
    const remplace = placer(semaine, { date: '2026-10-26', creneau: 'midi' }, recette('x'));
    expect(remplace).toHaveLength(2);
    expect(repasDansCase(remplace, { date: '2026-10-26', creneau: 'midi' })?.recipe_id).toBe('x');
  });

  it('déplace vers une case vide', () => {
    const resultat = deplacer(semaine, 'a', { date: '2026-10-29', creneau: 'soir' });
    expect(repasDansCase(resultat, { date: '2026-10-29', creneau: 'soir' })?.id).toBe('a');
    expect(repasDansCase(resultat, { date: '2026-10-26', creneau: 'midi' })).toBeUndefined();
  });

  it('échange deux repas quand la case est occupée', () => {
    const resultat = deplacer(semaine, 'a', { date: '2026-10-27', creneau: 'soir' });
    expect(repasDansCase(resultat, { date: '2026-10-27', creneau: 'soir' })?.id).toBe('a');
    expect(repasDansCase(resultat, { date: '2026-10-26', creneau: 'midi' })?.id).toBe('b');
  });

  it('retire un repas et trie par jour puis midi avant soir', () => {
    expect(retirer(semaine, 'a').map((r) => r.id)).toEqual(['b']);
    const desordre = [
      repas('c', '2026-10-27', 'soir'),
      repas('d', '2026-10-27', 'midi'),
      repas('e', '2026-10-26', 'soir'),
    ];
    expect(trierRepas(desordre).map((r) => r.id)).toEqual(['e', 'd', 'c']);
  });
});
