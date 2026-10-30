import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigure } from '@/core/supabase';
import { AuthContexte } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [chargement, setChargement] = useState(supabaseConfigure);
  const [dernierEvenement, setDernierEvenement] = useState<AuthChangeEvent | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let actif = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!actif) return;
      setSession(data.session);
      setChargement(false);
    });

    const { data } = supabase.auth.onAuthStateChange((evenement, nouvelleSession) => {
      setSession(nouvelleSession);
      setDernierEvenement(evenement);
      setChargement(false);
    });

    return () => {
      actif = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const deconnecter = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    queryClient.clear();
  }, [queryClient]);

  const valeur = useMemo(
    () => ({
      configure: supabaseConfigure,
      session,
      utilisateur: session?.user ?? null,
      chargement,
      dernierEvenement,
      deconnecter,
    }),
    [session, chargement, dernierEvenement, deconnecter],
  );

  return <AuthContexte.Provider value={valeur}>{children}</AuthContexte.Provider>;
}
