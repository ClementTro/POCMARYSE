-- 0002 : fonction de réveil (ADR 0014)
-- Un appel hebdomadaire à public.ping() (workflow garder-actif.yml) empêche la mise en pause du projet
-- Supabase gratuit. La fonction renvoie 1 et ne lit aucune donnée : l'appeler anonymement est sans risque.
-- Rejouable sans erreur.

create or replace function public.ping()
returns integer
language sql
stable
set search_path = ''
as $$
  select 1;
$$;

revoke all on function public.ping() from public;
grant execute on function public.ping() to anon, authenticated;
