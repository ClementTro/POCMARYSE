import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientSupabase } from '@/core/supabase';
import type { ValeursRecette } from './formulaire';
import { versDonneesRecette } from './formulaire';
import { trierRecettes, versRecette } from './recettes';
import type { Recette } from './types';

const CLE_RECETTES = ['recettes'] as const;

export function useRecettes() {
  return useQuery({
    queryKey: CLE_RECETTES,
    queryFn: async (): Promise<Recette[]> => {
      const { data, error } = await clientSupabase().from('recipes').select('*');
      if (error) throw error;
      return trierRecettes(data.map(versRecette));
    },
  });
}

export function useRecette(id: string | undefined) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [...CLE_RECETTES, id],
    enabled: Boolean(id),
    queryFn: async (): Promise<Recette | null> => {
      const { data, error } = await clientSupabase()
        .from('recipes')
        .select('*')
        .eq('id', id ?? '')
        .maybeSingle();
      if (error) throw error;
      return data ? versRecette(data) : null;
    },
    placeholderData: () =>
      queryClient.getQueryData<Recette[]>(CLE_RECETTES)?.find((recette) => recette.id === id),
  });
}

function useInvaliderRecettes() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: CLE_RECETTES });
}

/** Crée la recette (sans `id`) ou la met à jour. Renvoie la recette enregistrée. */
export function useEnregistrerRecette() {
  const invalider = useInvaliderRecettes();
  return useMutation({
    mutationFn: async ({ id, valeurs }: { id?: string; valeurs: ValeursRecette }) => {
      const donnees = versDonneesRecette(valeurs);
      const requete = id
        ? clientSupabase().from('recipes').update(donnees).eq('id', id)
        : clientSupabase().from('recipes').insert(donnees);
      const { data, error } = await requete.select('*').single();
      if (error) throw error;
      return versRecette(data);
    },
    onSuccess: invalider,
  });
}

/** Copie une recette de démo dans son carnet, pour pouvoir la modifier. */
export function useCopierRecette() {
  const invalider = useInvaliderRecettes();
  return useMutation({
    mutationFn: async (recette: Recette) => {
      const { data, error } = await clientSupabase()
        .from('recipes')
        .insert({
          title: recette.title,
          description: recette.description,
          servings: recette.servings,
          prep_minutes: recette.prep_minutes,
          cook_minutes: recette.cook_minutes,
          difficulty: recette.difficulty,
          tags: recette.tags,
          ingredients: recette.ingredients,
          steps: recette.steps,
          image_url: recette.image_url,
        })
        .select('*')
        .single();
      if (error) throw error;
      return versRecette(data);
    },
    onSuccess: invalider,
  });
}

export function useSupprimerRecette() {
  const invalider = useInvaliderRecettes();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await clientSupabase().from('recipes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalider,
  });
}
