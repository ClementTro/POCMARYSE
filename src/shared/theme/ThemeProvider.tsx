import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CLE_THEME, ThemeContext, type PreferenceTheme } from './themeContext';

const REQUETE_SOMBRE = '(prefers-color-scheme: dark)';

function lirePreference(): PreferenceTheme {
  const valeur = window.localStorage.getItem(CLE_THEME);
  return valeur === 'clair' || valeur === 'sombre' ? valeur : 'systeme';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceEtat] = useState<PreferenceTheme>(lirePreference);
  const [systemeSombre, setSystemeSombre] = useState(
    () => window.matchMedia(REQUETE_SOMBRE).matches,
  );

  useEffect(() => {
    const requete = window.matchMedia(REQUETE_SOMBRE);
    const surChangement = (evenement: MediaQueryListEvent) => setSystemeSombre(evenement.matches);
    requete.addEventListener('change', surChangement);
    return () => requete.removeEventListener('change', surChangement);
  }, []);

  const sombre = preference === 'sombre' || (preference === 'systeme' && systemeSombre);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', sombre);
  }, [sombre]);

  const setPreference = useCallback((nouvelle: PreferenceTheme) => {
    setPreferenceEtat(nouvelle);
    if (nouvelle === 'systeme') window.localStorage.removeItem(CLE_THEME);
    else window.localStorage.setItem(CLE_THEME, nouvelle);
  }, []);

  const valeur = useMemo(
    () => ({
      preference,
      sombre,
      setPreference,
      basculer: () => setPreference(sombre ? 'clair' : 'sombre'),
    }),
    [preference, sombre, setPreference],
  );

  return <ThemeContext.Provider value={valeur}>{children}</ThemeContext.Provider>;
}
