import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContexte } from '@/core/auth/authContext';
import i18n from '@/i18n';
import vitrineEn from '@/i18n/locales/en/vitrine.json';
import vitrineEs from '@/i18n/locales/es/vitrine.json';
import vitrineFr from '@/i18n/locales/fr/vitrine.json';
import DemiFinalePage from './DemiFinalePage';

function rendre() {
  render(
    <AuthContexte.Provider
      value={{
        configure: true,
        session: null,
        utilisateur: null,
        chargement: false,
        dernierEvenement: null,
        deconnecter: async () => {},
      }}
    >
      <MemoryRouter>
        <DemiFinalePage />
      </MemoryRouter>
    </AuthContexte.Provider>,
  );
}

describe('DemiFinalePage', () => {
  afterEach(() => {
    void i18n.changeLanguage('fr');
  });

  it('affiche les cinq recettes du match, chacune avec ses ingrédients et ses étapes', () => {
    rendre();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Spécial demi-finale' }),
    ).toBeInTheDocument();
    const fiches = screen.getAllByRole('article');
    expect(fiches).toHaveLength(5);
    fiches.forEach((fiche) => {
      const listes = within(fiche).getAllByRole('list');
      expect(listes).toHaveLength(2);
      listes.forEach((liste) => {
        expect(within(liste).getAllByRole('listitem').length).toBeGreaterThan(0);
      });
    });
    expect(screen.getByRole('link', { name: 'Créer mon carnet' })).toHaveAttribute(
      'href',
      '/inscription',
    );
  });

  it.each([
    ['en', vitrineEn],
    ['es', vitrineEs],
  ])('propose les mêmes recettes en %s, avec autant d’ingrédients et d’étapes', (_, traduction) => {
    const mesure = (recettes: typeof vitrineFr.evenement.recettes) =>
      recettes.map((r) => [r.ingredients.length, r.etapes.length]);
    expect(mesure(traduction.evenement.recettes)).toEqual(mesure(vitrineFr.evenement.recettes));
  });

  it('s’affiche en espagnol', async () => {
    await i18n.changeLanguage('es');
    rendre();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Especial semifinal' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
  });
});
