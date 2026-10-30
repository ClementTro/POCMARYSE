import { createContext } from 'react';

export type PreferenceTheme = 'clair' | 'sombre' | 'systeme';

export interface ThemeContextValeur {
  preference: PreferenceTheme;
  sombre: boolean;
  setPreference: (preference: PreferenceTheme) => void;
  basculer: () => void;
}

export const ThemeContext = createContext<ThemeContextValeur | null>(null);

export const CLE_THEME = 'maryse-theme';
