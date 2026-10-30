import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/core/auth/useAuth';
import type { Ligne, MiseAJour } from '@/core/database.types';
import { clientSupabase } from '@/core/supabase';

export type Profil = Pick<Ligne<'profiles'>, 'id' | 'display_name' | 'locale' | 'theme'>;

const cleProfil = (id: string) => ['profil', id] as const;

/** Profil de l'utilisatrice connectée ; `null` si la ligne n'existe pas (trigger non exécuté). */
export function useProfil() {
  const { utilisateur } = useAuth();
  const id = utilisateur?.id ?? '';
  return useQuery({
    queryKey: cleProfil(id),
    enabled: Boolean(id),
    queryFn: async (): Promise<Profil | null> => {
      const { data, error } = await clientSupabase()
        .from('profiles')
        .select('id, display_name, locale, theme')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useModifierProfil() {
  const queryClient = useQueryClient();
  const { utilisateur } = useAuth();
  const cle = cleProfil(utilisateur?.id ?? '');
  return useMutation({
    mutationFn: async (modification: MiseAJour<'profiles'>) => {
      if (!utilisateur) throw new Error('Session absente');
      const { error } = await clientSupabase()
        .from('profiles')
        .update(modification)
        .eq('id', utilisateur.id);
      if (error) throw error;
    },
    onMutate: async (modification) => {
      await queryClient.cancelQueries({ queryKey: cle });
      const avant = queryClient.getQueryData<Profil | null>(cle);
      if (avant) queryClient.setQueryData<Profil>(cle, { ...avant, ...modification });
      return { avant };
    },
    onError: (_erreur, _modification, resultat) => {
      if (resultat?.avant) queryClient.setQueryData(cle, resultat.avant);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: cle }),
  });
}
