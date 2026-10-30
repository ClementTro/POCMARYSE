import { useContext } from 'react';
import { AuthContexte, type AuthContexteValeur } from './authContext';

export function useAuth(): AuthContexteValeur {
  const contexte = useContext(AuthContexte);
  if (!contexte) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return contexte;
}
