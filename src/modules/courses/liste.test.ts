import {
  agreger,
  cleNom,
  compterRestants,
  formaterQuantite,
  lireIngredients,
  lireSaisie,
  listeDepuisRepas,
} from './liste';
import { accorderUnite, depuisBase, versBase } from './unites';

const ing = (name: string, quantity: number | null, unit = '') => ({ name, quantity, unit });

describe('unités', () => {
  it('ramène les unités métriques à leur base', () => {
    expect(versBase(1.5, 'kg')).toEqual({ famille: 'masse', valeur: 1500 });
    expect(versBase(25, 'cl')).toEqual({ famille: 'volume', valeur: 250 });
    expect(versBase(2, 'pincées')).toEqual({ famille: null, valeur: 2 });
  });

  it('accorde les unités d’un seul mot, pas les abréviations', () => {
    expect(accorderUnite('pincée', 2)).toBe('pincées');
    expect(accorderUnite('brin', 1)).toBe('brin');
    expect(accorderUnite('pots', 3)).toBe('pots');
    expect(accorderUnite('c. à soupe', 4)).toBe('c. à soupe');
    expect(accorderUnite('kg', 2)).toBe('kg');
  });

  it('choisit l’unité la plus lisible', () => {
    expect(depuisBase('masse', 1200)).toEqual({ quantity: 1.2, unit: 'kg' });
    expect(depuisBase('masse', 250)).toEqual({ quantity: 250, unit: 'g' });
    expect(depuisBase('volume', 250)).toEqual({ quantity: 25, unit: 'cl' });
    expect(depuisBase('volume', 5)).toEqual({ quantity: 5, unit: 'ml' });
    expect(depuisBase('volume', 1500)).toEqual({ quantity: 1.5, unit: 'l' });
  });
});

describe('agréger les ingrédients', () => {
  it('additionne un même ingrédient en convertissant les unités', () => {
    expect(
      agreger([
        ing('Farine', 200, 'g'),
        ing('farine', 1, 'kg'),
        ing('Lait', 50, 'cl'),
        ing('lait', 0.5, 'l'),
      ]),
    ).toEqual([ing('Farine', 1.2, 'kg'), ing('Lait', 1, 'l')]);
  });

  it('regroupe malgré les accents, la casse et le pluriel', () => {
    expect(cleNom('Pommes de terre')).toBe(cleNom('pomme de terre'));
    expect(cleNom('Œufs')).toBe(cleNom('oeuf'));
    expect(
      agreger([
        ing('Œufs', 3),
        ing('oeufs', 2),
        ing('Crème fraîche', 20, 'cl'),
        ing('creme fraiche', 10, 'cl'),
      ]),
    ).toEqual([ing('Crème fraîche', 30, 'cl'), ing('Œufs', 5)]);
  });

  it('garde séparées les unités qui ne se convertissent pas', () => {
    expect(
      agreger([
        ing('Beurre', 50, 'g'),
        ing('Beurre', 1, 'c. à soupe'),
        ing('Sel', 1, 'pincée'),
        ing('sel', 2, 'pincées'),
      ]),
    ).toEqual([ing('Beurre', 50, 'g'), ing('Beurre', 1, 'c. à soupe'), ing('Sel', 3, 'pincées')]);
  });

  it('garde un article sans quantité quand aucune n’est connue', () => {
    expect(agreger([ing('Poivre', null), ing('poivre', null)])).toEqual([ing('Poivre', null)]);
    expect(agreger([ing('Persil', null, 'g'), ing('Persil', 10, 'g')])).toEqual([
      ing('Persil', 10, 'g'),
    ]);
  });

  it('évite les erreurs d’arrondi des flottants', () => {
    expect(agreger([ing('Huile', 0.1, 'l'), ing('Huile', 0.2, 'l')])).toEqual([
      ing('Huile', 30, 'cl'),
    ]);
  });
});

describe('liste depuis le planning', () => {
  it('lit les ingrédients de chaque repas, même une recette répétée ou supprimée', () => {
    const gratin = { ingredients: [{ name: 'Pommes de terre', quantity: 1, unit: 'kg' }] };
    expect(listeDepuisRepas([{ recette: gratin }, { recette: gratin }, { recette: null }])).toEqual(
      [ing('Pommes de terre', 2, 'kg')],
    );
  });

  it('ignore les ingrédients mal formés', () => {
    expect(
      lireIngredients([
        { name: ' Sucre ', quantity: 100, unit: 'g' },
        { name: '', quantity: 1 },
        { quantity: 2 },
        { name: 'Sel', quantity: -1, unit: 3 },
        'texte',
      ]),
    ).toEqual([ing('Sucre', 100, 'g'), ing('Sel', null)]);
    expect(lireIngredients(null)).toEqual([]);
  });
});

describe('saisie rapide', () => {
  it.each([
    ['2 kg de pommes', ing('pommes', 2, 'kg')],
    ['500g farine', ing('farine', 500, 'g')],
    ['1,5 L lait', ing('lait', 1.5, 'l')],
    ['25 cl d’huile d’olive', ing('huile d’olive', 25, 'cl')],
    ['6 œufs', ing('œufs', 6)],
    ['2 gousses d’ail', ing('gousses d’ail', 2)],
    ['1/2 citron', ing('citron', 0.5)],
    ['  lait   demi-écrémé ', ing('lait demi-écrémé', null)],
    ['3 kg', ing('3 kg', null)],
  ])('lit « %s »', (saisie, attendu) => {
    expect(lireSaisie(saisie)).toEqual(attendu);
  });

  it('refuse une saisie vide', () => {
    expect(lireSaisie('   ')).toBeNull();
  });
});

describe('affichage', () => {
  it('formate la quantité selon la langue', () => {
    expect(formaterQuantite({ quantity: 1.5, unit: 'kg' }, 'fr')).toBe('1,5 kg');
    expect(formaterQuantite({ quantity: 6, unit: '' }, 'en')).toBe('6');
    expect(formaterQuantite({ quantity: null, unit: 'g' }, 'fr')).toBe('');
  });

  it('compte les articles qui restent à acheter', () => {
    expect(compterRestants([{ checked: true }, { checked: false }, { checked: false }])).toBe(2);
  });
});
