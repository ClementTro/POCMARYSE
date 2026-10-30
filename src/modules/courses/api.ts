import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientSupabase } from '@/core/supabase';
import { ajouterJours, depuisIso, versIso, type DateIso } from '@/shared/lib/dates';
import { listeDepuisRepas, trierParNom } from './liste';
import type { Article, ArticleSaisi, ResultatGeneration } from './types';

const CLE_ARTICLES = ['courses', 'articles'] as const;

/** Article affiché avant la réponse du serveur : non cochable ni supprimable tant qu'il n'a pas d'id. */
export const PREFIXE_PROVISOIRE = 'provisoire-';

async function verifier(requete: PromiseLike<{ error: unknown }>) {
  const { error } = await requete;
  if (error) throw error;
}

export function useArticles() {
  return useQuery({
    queryKey: CLE_ARTICLES,
    queryFn: async (): Promise<Article[]> => {
      const { data, error } = await clientSupabase()
        .from('shopping_items')
        .select('*')
        .order('created_at');
      if (error) throw error;
      return trierParNom(data);
    },
  });
}

/** Mutation de la liste avec mise à jour optimiste : cocher un article doit être instantané. */
function useMutationArticles<V>(
  appliquer: (articles: Article[], variables: V) => Article[],
  executer: (variables: V) => Promise<void>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: executer,
    onMutate: async (variables: V) => {
      await queryClient.cancelQueries({ queryKey: CLE_ARTICLES });
      const avant = queryClient.getQueryData<Article[]>(CLE_ARTICLES);
      queryClient.setQueryData<Article[]>(CLE_ARTICLES, (articles = []) =>
        appliquer(articles, variables),
      );
      return { avant };
    },
    onError: (_erreur, _variables, resultat) => {
      if (resultat?.avant) queryClient.setQueryData(CLE_ARTICLES, resultat.avant);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CLE_ARTICLES }),
  });
}

export function useAjouterArticle() {
  return useMutationArticles<ArticleSaisi>(
    (articles, saisi) =>
      trierParNom([
        ...articles,
        {
          ...saisi,
          id: `${PREFIXE_PROVISOIRE}${Date.now()}`,
          user_id: '',
          checked: false,
          source: 'manuel',
          created_at: new Date().toISOString(),
        },
      ]),
    (saisi) =>
      verifier(
        clientSupabase()
          .from('shopping_items')
          .insert({ ...saisi, source: 'manuel' }),
      ),
  );
}

export function useCocherArticle() {
  return useMutationArticles<{ id: string; checked: boolean }>(
    (articles, { id, checked }) => articles.map((a) => (a.id === id ? { ...a, checked } : a)),
    ({ id, checked }) =>
      verifier(clientSupabase().from('shopping_items').update({ checked }).eq('id', id)),
  );
}

export function useSupprimerArticle() {
  return useMutationArticles<string>(
    (articles, id) => articles.filter((a) => a.id !== id),
    (id) => verifier(clientSupabase().from('shopping_items').delete().eq('id', id)),
  );
}

export function useViderCoches() {
  return useMutationArticles<void>(
    (articles) => articles.filter((a) => !a.checked),
    () => verifier(clientSupabase().from('shopping_items').delete().eq('checked', true)),
  );
}

/**
 * Remplace les articles venus du planning par les ingrédients des repas de la semaine.
 * Les repas sont lus directement dans Supabase : pas d'import du module Planning.
 * Les nouveaux articles sont écrits avant de retirer les anciens : un échec ne vide pas la liste.
 */
export function useGenererDepuisPlanning() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lundi: DateIso): Promise<ResultatGeneration> => {
      const debut = depuisIso(lundi);
      if (!debut) throw new Error(`Semaine invalide : ${lundi}`);
      const client = clientSupabase();
      const [repas, anciens] = await Promise.all([
        client
          .from('meal_plan_entries')
          .select('recette:recipes(ingredients)')
          .gte('plan_date', lundi)
          .lte('plan_date', versIso(ajouterJours(debut, 6))),
        client.from('shopping_items').select('id').eq('source', 'planning'),
      ]);
      if (repas.error) throw repas.error;
      if (anciens.error) throw anciens.error;

      const articles = listeDepuisRepas(repas.data);
      if (!repas.data.length) return { articles: 0, repas: 0 };
      if (articles.length) {
        await verifier(
          client
            .from('shopping_items')
            .insert(articles.map((article) => ({ ...article, source: 'planning' as const }))),
        );
      }
      const ids = anciens.data.map(({ id }) => id);
      if (ids.length) await verifier(client.from('shopping_items').delete().in('id', ids));
      return { articles: articles.length, repas: repas.data.length };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CLE_ARTICLES }),
  });
}
