import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/core/auth/useAuth';
import { clientSupabase } from '@/core/supabase';
import { ajouterJours, deplacer, depuisIso, placer, retirer, trierRepas, versIso } from './semaine';
import type { Case, DateIso, RecettePlanifiable, Repas } from './types';

const cleSemaine = (lundi: DateIso) => ['planning', 'semaine', lundi] as const;
const CLE_RECETTES = ['planning', 'recettes'] as const;

const COLONNES_REPAS =
  'id, plan_date, slot, recipe_id, recette:recipes(id, title, prep_minutes, cook_minutes)';

export function useSemaine(lundi: DateIso) {
  return useQuery({
    queryKey: cleSemaine(lundi),
    // Une recette supprimée retire ses repas (cascade) : on relit à chaque affichage.
    staleTime: 0,
    queryFn: async (): Promise<Repas[]> => {
      const debut = depuisIso(lundi);
      if (!debut) return [];
      const { data, error } = await clientSupabase()
        .from('meal_plan_entries')
        .select(COLONNES_REPAS)
        .gte('plan_date', lundi)
        .lte('plan_date', versIso(ajouterJours(debut, 6)));
      if (error) throw error;
      return trierRepas(data);
    },
  });
}

/** Recettes visibles (les siennes et celles de Maryse), lues directement : pas d'import du module Recettes. */
export function useRecettesPlanifiables() {
  return useQuery({
    queryKey: CLE_RECETTES,
    staleTime: 0,
    queryFn: async (): Promise<RecettePlanifiable[]> => {
      const { data, error } = await clientSupabase()
        .from('recipes')
        .select('id, title, prep_minutes, cook_minutes')
        .order('title');
      if (error) throw error;
      return data;
    },
  });
}

/** Mutation de la semaine affichée, avec mise à jour optimiste du cache (glisser-déposer fluide). */
function useMutationSemaine<V>(
  lundi: DateIso,
  appliquer: (repas: Repas[], variables: V) => Repas[],
  executer: (variables: V, utilisateur: string) => Promise<void>,
) {
  const queryClient = useQueryClient();
  const { utilisateur } = useAuth();
  const cle = cleSemaine(lundi);
  return useMutation({
    mutationFn: async (variables: V) => {
      if (!utilisateur) throw new Error('Session absente');
      await executer(variables, utilisateur.id);
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: cle });
      const avant = queryClient.getQueryData<Repas[]>(cle);
      queryClient.setQueryData<Repas[]>(cle, (repas = []) =>
        trierRepas(appliquer(repas, variables)),
      );
      return { avant };
    },
    onError: (_erreur, _variables, resultat) => {
      if (resultat?.avant) queryClient.setQueryData(cle, resultat.avant);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: cle }),
  });
}

async function verifier(requete: PromiseLike<{ error: unknown }>) {
  const { error } = await requete;
  if (error) throw error;
}

export function usePlacerRecette(lundi: DateIso) {
  return useMutationSemaine<{ cible: Case; recette: RecettePlanifiable }>(
    lundi,
    (repas, { cible, recette }) => placer(repas, cible, recette),
    ({ cible, recette }, utilisateur) =>
      verifier(
        clientSupabase().from('meal_plan_entries').upsert(
          {
            user_id: utilisateur,
            plan_date: cible.date,
            slot: cible.creneau,
            recipe_id: recette.id,
          },
          { onConflict: 'user_id,plan_date,slot' },
        ),
      ),
  );
}

/** Déplace un repas ; `occupant` (repas déjà dans la case cible) prend alors la place libérée. */
export function useDeplacerRepas(lundi: DateIso) {
  return useMutationSemaine<{ repas: Repas; cible: Case; occupant?: Repas }>(
    lundi,
    (liste, { repas, cible }) => deplacer(liste, repas.id, cible),
    async ({ repas, cible, occupant }, utilisateur) => {
      const table = () => clientSupabase().from('meal_plan_entries');
      if (!occupant) {
        await verifier(
          table().update({ plan_date: cible.date, slot: cible.creneau }).eq('id', repas.id),
        );
        return;
      }
      // La contrainte unique (jour, créneau) interdit un échange par deux mises à jour successives.
      await verifier(table().delete().in('id', [repas.id, occupant.id]));
      await verifier(
        table().insert([
          {
            user_id: utilisateur,
            plan_date: cible.date,
            slot: cible.creneau,
            recipe_id: repas.recipe_id,
          },
          {
            user_id: utilisateur,
            plan_date: repas.plan_date,
            slot: repas.slot,
            recipe_id: occupant.recipe_id,
          },
        ]),
      );
    },
  );
}

export function useRetirerRepas(lundi: DateIso) {
  return useMutationSemaine<Repas>(
    lundi,
    (liste, repas) => retirer(liste, repas.id),
    (repas) => verifier(clientSupabase().from('meal_plan_entries').delete().eq('id', repas.id)),
  );
}
