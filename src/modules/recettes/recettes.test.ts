import type { Ligne } from '@/core/database.types';
import {
  lireEtiquettes,
  schemaRecette,
  versDonneesRecette,
  versValeursFormulaire,
  VALEURS_NOUVELLE_RECETTE,
} from './formulaire';
import {
  ecrireFiltres,
  filtrerRecettes,
  lireEtapes,
  lireFiltres,
  lireIngredients,
  normaliser,
  tagsDisponibles,
  trierRecettes,
  versRecette,
} from './recettes';
import { FILTRES_VIDES, type Recette } from './types';

function ligne(surcharge: Partial<Ligne<'recipes'>> = {}): Ligne<'recipes'> {
  return {
    id: 'r1',
    user_id: 'u1',
    title: 'Crêpes',
    description: 'Pour la Chandeleur',
    servings: 4,
    prep_minutes: 10,
    cook_minutes: 20,
    difficulty: 'facile',
    tags: ['dessert'],
    ingredients: [{ name: 'farine', quantity: 250, unit: 'g' }],
    steps: ['Mélanger.', 'Cuire.'],
    image_url: null,
    created_at: '2026-10-30T00:00:00Z',
    updated_at: '2026-10-30T00:00:00Z',
    ...surcharge,
  };
}

const recette = (surcharge: Partial<Ligne<'recipes'>> = {}): Recette =>
  versRecette(ligne(surcharge));

describe('lecture des colonnes jsonb', () => {
  it('garde les ingrédients valides et normalise la quantité', () => {
    expect(
      lireIngredients([
        { name: ' sel ', quantity: null, unit: 'pincée' },
        { name: 'lait', quantity: 50, unit: 'cl' },
        { name: '', quantity: 1, unit: '' },
        { quantity: 2 },
        'farine',
        { name: 'œuf', quantity: 'deux' },
      ]),
    ).toEqual([
      { name: 'sel', quantity: null, unit: 'pincée' },
      { name: 'lait', quantity: 50, unit: 'cl' },
      { name: 'œuf', quantity: null, unit: '' },
    ]);
  });

  it('renvoie une liste vide si le JSON n’est pas un tableau', () => {
    expect(lireIngredients({ name: 'farine' })).toEqual([]);
    expect(lireEtapes('Cuire')).toEqual([]);
  });

  it('ne garde que les étapes textuelles non vides', () => {
    expect(lireEtapes(['Cuire.', '  ', 3, ' Servir. '])).toEqual(['Cuire.', 'Servir.']);
  });
});

describe('filtrerRecettes', () => {
  const recettes = [
    recette({ id: 'a', title: 'Crème brûlée', difficulty: 'moyen', tags: ['dessert'] }),
    recette({
      id: 'b',
      user_id: null,
      title: 'Gratin dauphinois',
      prep_minutes: 20,
      cook_minutes: 60,
      tags: ['four'],
      ingredients: [{ name: 'pomme de terre', quantity: 1, unit: 'kg' }],
    }),
  ];

  it('ignore les accents et la casse, et cherche aussi dans les ingrédients', () => {
    expect(
      filtrerRecettes(recettes, { ...FILTRES_VIDES, texte: 'CREME' }).map((r) => r.id),
    ).toEqual(['a']);
    expect(
      filtrerRecettes(recettes, { ...FILTRES_VIDES, texte: 'pomme' }).map((r) => r.id),
    ).toEqual(['b']);
  });

  it('filtre par étiquette, difficulté, temps total et origine', () => {
    const ids = (f: Partial<typeof FILTRES_VIDES>) =>
      filtrerRecettes(recettes, { ...FILTRES_VIDES, ...f }).map((r) => r.id);
    expect(ids({ tag: 'four' })).toEqual(['b']);
    expect(ids({ difficulte: 'moyen' })).toEqual(['a']);
    expect(ids({ tempsMax: 30 })).toEqual(['a']);
    expect(ids({ origine: 'demo' })).toEqual(['b']);
    expect(ids({ origine: 'miennes' })).toEqual(['a']);
    expect(ids({})).toEqual(['a', 'b']);
  });

  it('liste les étiquettes sans doublon, triées', () => {
    expect(tagsDisponibles([...recettes, recette({ tags: ['dessert', 'été'] })])).toEqual([
      'dessert',
      'été',
      'four',
    ]);
  });

  it('place ses propres recettes avant les recettes de démo', () => {
    const triees = trierRecettes([
      recette({ id: 'demo', user_id: null, title: 'Ail' }),
      recette({ id: 'z', title: 'Zeste' }),
      recette({ id: 'b', title: 'Brioche' }),
    ]);
    expect(triees.map((r) => r.id)).toEqual(['b', 'z', 'demo']);
  });

  it('normalise les textes', () => {
    expect(normaliser('  Œufs à la NEIGE ')).toBe('œufs a la neige');
  });
});

describe('filtres dans l’URL', () => {
  it('fait l’aller-retour filtres → URL → filtres', () => {
    const filtres = {
      texte: 'crème',
      tag: 'four',
      tempsMax: 30,
      difficulte: 'moyen' as const,
      origine: 'demo' as const,
    };
    expect(lireFiltres(ecrireFiltres(filtres))).toEqual(filtres);
  });

  it('n’écrit que les filtres actifs et ignore les valeurs inconnues', () => {
    expect(ecrireFiltres(FILTRES_VIDES).toString()).toBe('');
    expect(lireFiltres(new URLSearchParams('temps=-5&difficulte=extreme&origine=voisin'))).toEqual(
      FILTRES_VIDES,
    );
  });
});

describe('formulaire de recette', () => {
  it('nettoie les étiquettes saisies', () => {
    expect(lireEtiquettes('plat, Four, , four ,été')).toEqual(['plat', 'four', 'été']);
  });

  it('refuse un formulaire sans titre, sans ingrédient ni étape', () => {
    const resultat = schemaRecette.safeParse(VALEURS_NOUVELLE_RECETTE);
    expect(resultat.success).toBe(false);
    const messages = resultat.error?.issues.map((i) => i.message) ?? [];
    expect(messages).toEqual(
      expect.arrayContaining([
        'erreurs.titreRequis',
        'erreurs.ingredientRequis',
        'erreurs.etapeRequise',
      ]),
    );
  });

  it('refuse des portions hors limites et une quantité invalide', () => {
    const valeurs = versValeursFormulaire(recette(), 'fr');
    const resultat = schemaRecette.safeParse({
      ...valeurs,
      portions: '0',
      ingredients: [{ nom: 'farine', quantite: 'beaucoup', unite: '' }],
    });
    const messages = resultat.error?.issues.map((i) => i.message) ?? [];
    expect(messages).toEqual(expect.arrayContaining(['erreurs.portions', 'erreurs.quantite']));
  });

  it('fait l’aller-retour recette → formulaire → données sans perte', () => {
    const origine = recette({
      ingredients: [
        { name: 'farine', quantity: 1.5, unit: 'kg' },
        { name: 'sel', quantity: null, unit: '' },
        { name: 'lait', quantity: 1000, unit: 'ml' },
      ],
    });
    for (const langue of ['fr', 'en']) {
      const valeurs = schemaRecette.parse(versValeursFormulaire(origine, langue));
      expect(versDonneesRecette(valeurs)).toEqual({
        title: origine.title,
        description: origine.description,
        servings: 4,
        prep_minutes: 10,
        cook_minutes: 20,
        difficulty: 'facile',
        tags: ['dessert'],
        ingredients: origine.ingredients,
        steps: origine.steps,
      });
    }
  });

  it('accepte la virgule décimale et ignore les lignes vides', () => {
    const valeurs = schemaRecette.parse({
      ...VALEURS_NOUVELLE_RECETTE,
      titre: '  Pain perdu ',
      ingredients: [
        { nom: 'lait', quantite: '0,5', unite: 'l' },
        { nom: '', quantite: '', unite: '' },
      ],
      etapes: [{ texte: 'Tremper le pain.' }, { texte: ' ' }],
    });
    const donnees = versDonneesRecette(valeurs);
    expect(donnees.title).toBe('Pain perdu');
    expect(donnees.ingredients).toEqual([{ name: 'lait', quantity: 0.5, unit: 'l' }]);
    expect(donnees.steps).toEqual(['Tremper le pain.']);
  });
});
