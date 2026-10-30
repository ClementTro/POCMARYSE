import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { AuthContexte } from '@/core/auth/authContext';
import type { Profil } from '@/core/profil/api';
import i18n from '@/i18n';
import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { ProfilPage } from './ProfilPage';

const etat = vi.hoisted(() => ({
  profil: undefined as Profil | null | undefined,
  modifier: vi.fn(),
}));

vi.mock('@/core/profil/api', () => ({
  useProfil: () => ({ data: etat.profil, isError: false, refetch: vi.fn() }),
  useModifierProfil: () => ({
    mutate: etat.modifier,
    isPending: false,
    isSuccess: false,
    isError: false,
  }),
}));

const utilisateur = { id: 'u1', email: 'maryse@example.fr', user_metadata: {} } as User;

function rendre() {
  render(
    <ThemeProvider>
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
        <MemoryRouter>
          <ProfilPage />
        </MemoryRouter>
      </AuthContexte.Provider>
    </ThemeProvider>,
  );
}

describe('ProfilPage', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();
    await i18n.changeLanguage('fr');
    etat.profil = { id: 'u1', display_name: 'Maryse', locale: 'fr', theme: 'systeme' };
  });

  afterAll(async () => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    await i18n.changeLanguage('fr');
  });

  it('enregistre le prénom, sans espaces superflus', async () => {
    rendre();
    const champ = screen.getByRole('textbox', { name: 'Prénom ou surnom' });
    expect(champ).toHaveValue('Maryse');
    const bouton = screen.getByRole('button', { name: 'Enregistrer le prénom' });
    expect(bouton).toBeDisabled();
    await userEvent.clear(champ);
    await userEvent.type(champ, '  Mamie Maryse ');
    await userEvent.click(bouton);
    expect(etat.modifier).toHaveBeenCalledWith({ display_name: 'Mamie Maryse' });
  });

  it('refuse un prénom trop long', async () => {
    rendre();
    const champ = screen.getByRole('textbox', { name: 'Prénom ou surnom' });
    await userEvent.clear(champ);
    await userEvent.type(champ, 'M'.repeat(61));
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer le prénom' }));
    expect(screen.getByText('60 caractères au maximum.')).toBeInTheDocument();
    expect(etat.modifier).not.toHaveBeenCalled();
  });

  it('applique tout de suite le thème et la langue choisis', async () => {
    rendre();
    expect(screen.getByRole('radio', { name: "Comme l'appareil" })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: 'Sombre' }));
    expect(document.documentElement).toHaveClass('dark');
    await userEvent.click(screen.getByRole('radio', { name: 'English' }));
    expect(i18n.resolvedLanguage).toBe('en');
    expect(await screen.findByRole('heading', { name: 'Preferences' })).toBeInTheDocument();
  });

  it('affiche l’adresse du compte et le lien de changement de mot de passe', () => {
    rendre();
    expect(screen.getByText('maryse@example.fr')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Changer de mot de passe' })).toHaveAttribute(
      'href',
      '/mot-de-passe-oublie',
    );
  });
});
