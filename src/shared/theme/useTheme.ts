import { useContext } from 'react';
import { ThemeContext, type ThemeContextValeur } from './themeContext';

export function useTheme(): ThemeContextValeur {
  const contexte = useContext(ThemeContext);
  if (!contexte) throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  return contexte;
}
