import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '@/i18n';
import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { LangSwitch } from '@/shared/ui/LangSwitch';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import type { Profil } from './api';
import { SynchroPreferences } from './SynchroPreferences';

const etat = vi.hoisted(() => ({
  profil: undefined as Profil | null | undefined,
  modifier: vi.fn(),
}));

vi.mock('./api', () => ({
  useProfil: () => ({ data: etat.profil }),
  useModifierProfil: () => ({ mutate: etat.modifier }),
}));

function rendre() {
  return render(
    <ThemeProvider>
      <SynchroPreferences />
      <ThemeToggle />
      <LangSwitch />
    </ThemeProvider>,
  );
}

describe('SynchroPreferences', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    await i18n.changeLanguage('fr');
    etat.profil = { id: 'u1', display_name: 'Maryse', locale: 'en', theme: 'sombre' };
  });

  afterAll(async () => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    await i18n.changeLanguage('fr');
  });

  it('applique les préférences du compte à l’ouverture sans les réenregistrer', async () => {
    rendre();
    await screen.findByRole('button', { name: 'Switch to light theme' });
    expect(document.documentElement).toHaveClass('dark');
    expect(i18n.resolvedLanguage).toBe('en');
    expect(etat.modifier).not.toHaveBeenCalled();
  });

  it('enregistre ensuite chaque changement fait depuis l’en-tête', async () => {
    rendre();
    await userEvent.click(await screen.findByRole('button', { name: 'Switch to light theme' }));
    expect(etat.modifier).toHaveBeenLastCalledWith({ theme: 'clair' });
    await userEvent.click(screen.getByRole('button', { name: 'FR' }));
    expect(etat.modifier).toHaveBeenLastCalledWith({ locale: 'fr' });
    expect(etat.modifier).toHaveBeenCalledTimes(2);
  });

  it('attend le profil avant de synchroniser', async () => {
    etat.profil = undefined;
    const { rerender } = rendre();
    await userEvent.click(screen.getByRole('button', { name: 'Passer en thème sombre' }));
    expect(etat.modifier).not.toHaveBeenCalled();

    etat.profil = { id: 'u1', display_name: '', locale: 'fr', theme: 'clair' };
    await act(async () => {
      rerender(
        <ThemeProvider>
          <SynchroPreferences />
          <ThemeToggle />
          <LangSwitch />
        </ThemeProvider>,
      );
    });
    expect(document.documentElement).not.toHaveClass('dark');
    expect(etat.modifier).not.toHaveBeenCalled();
  });
});
