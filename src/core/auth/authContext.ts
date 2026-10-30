import { createContext } from 'react';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

export interface AuthContexteValeur {
  /** Le backend Supabase est-il configuré pour ce site ? */
  configure: boolean;
  session: Session | null;
  utilisateur: User | null;
  /** Vrai tant que la session initiale n'est pas connue. */
  chargement: boolean;
  dernierEvenement: AuthChangeEvent | null;
  deconnecter: () => Promise<void>;
}

export const AuthContexte = createContext<AuthContexteValeur | null>(null);
