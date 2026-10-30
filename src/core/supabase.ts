import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const cleAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Vrai si les variables publiques Supabase sont fournies (ADR 0009). */
export const supabaseConfigure = Boolean(url && cleAnon);

/** Client unique de l'application ; `null` si le backend n'est pas configuré. */
export const supabase: SupabaseClient | null =
  url && cleAnon
    ? createClient(url, cleAnon, {
        auth: {
          flowType: 'pkce',
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null;

/** À utiliser dans les `api.ts` : les pages de l'app ne s'affichent que si le backend est configuré. */
export function clientSupabase(): SupabaseClient {
  if (!supabase) throw new Error('Supabase n’est pas configuré (VITE_SUPABASE_URL / ANON_KEY).');
  return supabase;
}

/** URL absolue d'une route de l'application, pour les redirections des e-mails Supabase. */
export function urlApplication(chemin: string): string {
  return `${window.location.origin}${import.meta.env.BASE_URL}${chemin.replace(/^\/+/, '')}`;
}
