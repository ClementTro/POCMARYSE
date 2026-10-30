import type { AuthError } from '@supabase/supabase-js';

const CODES: Record<string, string> = {
  invalid_credentials: 'erreurs.identifiants',
  email_not_confirmed: 'erreurs.nonConfirme',
  user_already_exists: 'erreurs.dejaInscrit',
  email_exists: 'erreurs.dejaInscrit',
  weak_password: 'erreurs.motDePasseFaible',
  over_email_send_rate_limit: 'erreurs.tropDeDemandes',
  over_request_rate_limit: 'erreurs.tropDeDemandes',
  same_password: 'erreurs.memeMotDePasse',
};

/** Clé de traduction (namespace `auth`) correspondant à une erreur Supabase. */
export function cleErreurAuth(erreur: Pick<AuthError, 'code'> | null | undefined): string {
  return (erreur?.code && CODES[erreur.code]) || 'erreurs.inconnue';
}
