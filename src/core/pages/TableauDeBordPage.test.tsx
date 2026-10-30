import { render, screen } from '@testing-library/react';
import type { User } from '@supabase/supabase-js';
import { AuthContexte } from '@/core/auth/authContext';
import type { AppModule } from '@/core/types';
import { TableauDeBordPage } from './TableauDeBordPage';

const etat = vi.hoisted(() => ({
  modules: [] as Pick<AppModule, 'id' | 'dashboardWidget'>[],
  nomProfil: undefined as string | undefined,
}));

vi.mock('@/core/moduleRegistry', () => ({
  get modules() {
    return etat.modules;
  },
}));

vi.mock('@/core/profil/api', () => ({
  useProfil: () => ({
    data:
      etat.nomProfil === undefined
        ? undefined
        : { id: 'u1', display_name: etat.nomProfil, locale: 'fr', theme: 'systeme' },
  }),
}));

function rendre() {
  const utilisateur = { id: 'u1', user_metadata: { display_name: 'Maryse' } } as unknown as User;
  render(
    <AuthContexte.Provider
      value={{
        configure: true,
        session: null,
        utilisateur,
        chargement: false,
        dernierEvenement: null,
        deconnecter: async () => {},
      }}
    >
      <TableauDeBordPage />
    </AuthContexte.Provider>,
  );
}

describe('TableauDeBordPage', () => {
  beforeEach(() => {
    etat.modules = [
      { id: 'a', dashboardWidget: () => <section aria-label="Widget A" /> },
      { id: 'b' },
      { id: 'c', dashboardWidget: () => <section aria-label="Widget C" /> },
    ];
    etat.nomProfil = 'Mamie';
  });

  it('salue avec le prénom du profil et affiche les widgets des modules qui en ont', () => {
    rendre();
    expect(screen.getByRole('heading', { level: 1, name: 'Bonjour Mamie' })).toBeInTheDocument();
    expect(screen.getAllByRole('region').map((r) => r.getAttribute('aria-label'))).toEqual([
      'Widget A',
      'Widget C',
    ]);
  });

  it('se rabat sur le nom de l’inscription tant que le profil charge', () => {
    etat.nomProfil = undefined;
    rendre();
    expect(screen.getByRole('heading', { level: 1, name: 'Bonjour Maryse' })).toBeInTheDocument();
  });

  it('salue sans prénom quand il a été effacé, et signale l’absence de module', () => {
    etat.nomProfil = '';
    etat.modules = [];
    rendre();
    expect(screen.getByRole('heading', { level: 1, name: 'Bonjour' })).toBeInTheDocument();
    expect(screen.getByText('Les pages du carnet arrivent bientôt.')).toBeInTheDocument();
  });
});
