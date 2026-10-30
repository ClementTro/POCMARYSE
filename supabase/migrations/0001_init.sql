-- Maryse & Co — schéma initial (ADR 0003)
-- À exécuter une fois dans Supabase > SQL Editor. Le script est rejouable sans erreur.

-- ---------------------------------------------------------------------------
-- Utilitaire : mise à jour automatique de updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles : une ligne par compte, créée à l'inscription
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 60),
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  theme text not null default 'systeme' check (theme in ('clair', 'sombre', 'systeme')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles : lecture de son profil" on public.profiles;
create policy "profiles : lecture de son profil" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "profiles : modification de son profil" on public.profiles;
create policy "profiles : modification de son profil" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, locale)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 60),
    case when new.raw_user_meta_data ->> 'locale' = 'en' then 'en' else 'fr' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- recipes : user_id nul = recette de démo partagée, en lecture seule
-- ---------------------------------------------------------------------------
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  servings integer not null default 4 check (servings between 1 and 30),
  prep_minutes integer not null default 0 check (prep_minutes between 0 and 1440),
  cook_minutes integer not null default 0 check (cook_minutes between 0 and 1440),
  difficulty text not null default 'facile' check (difficulty in ('facile', 'moyen', 'difficile')),
  tags text[] not null default '{}',
  ingredients jsonb not null default '[]' check (jsonb_typeof(ingredients) = 'array'),
  steps jsonb not null default '[]' check (jsonb_typeof(steps) = 'array'),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recipes_user_id_idx on public.recipes (user_id);

alter table public.recipes enable row level security;

drop policy if exists "recipes : lecture des siennes et des recettes de démo" on public.recipes;
create policy "recipes : lecture des siennes et des recettes de démo" on public.recipes
  for select to authenticated
  using (user_id is null or (select auth.uid()) = user_id);

drop policy if exists "recipes : création des siennes" on public.recipes;
create policy "recipes : création des siennes" on public.recipes
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "recipes : modification des siennes" on public.recipes;
create policy "recipes : modification des siennes" on public.recipes
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "recipes : suppression des siennes" on public.recipes;
create policy "recipes : suppression des siennes" on public.recipes
  for delete to authenticated
  using ((select auth.uid()) = user_id);

drop trigger if exists recipes_updated_at on public.recipes;
create trigger recipes_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- meal_plan_entries : une recette posée sur un jour et un créneau
-- ---------------------------------------------------------------------------
create table if not exists public.meal_plan_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  plan_date date not null,
  slot text not null check (slot in ('midi', 'soir')),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, plan_date, slot)
);

create index if not exists meal_plan_entries_user_date_idx
  on public.meal_plan_entries (user_id, plan_date);

alter table public.meal_plan_entries enable row level security;

drop policy if exists "planning : lecture du sien" on public.meal_plan_entries;
create policy "planning : lecture du sien" on public.meal_plan_entries
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- La sous-requête sur recipes respecte la RLS : on ne peut planifier qu'une recette visible.
drop policy if exists "planning : création du sien" on public.meal_plan_entries;
create policy "planning : création du sien" on public.meal_plan_entries
  for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.recipes r where r.id = recipe_id)
  );

drop policy if exists "planning : modification du sien" on public.meal_plan_entries;
create policy "planning : modification du sien" on public.meal_plan_entries
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.recipes r where r.id = recipe_id)
  );

drop policy if exists "planning : suppression du sien" on public.meal_plan_entries;
create policy "planning : suppression du sien" on public.meal_plan_entries
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- shopping_items : la liste de courses
-- ---------------------------------------------------------------------------
create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  quantity numeric check (quantity is null or quantity >= 0),
  unit text not null default '' check (char_length(unit) <= 20),
  checked boolean not null default false,
  source text not null default 'manuel' check (source in ('planning', 'manuel')),
  created_at timestamptz not null default now()
);

create index if not exists shopping_items_user_id_idx on public.shopping_items (user_id);

alter table public.shopping_items enable row level security;

drop policy if exists "courses : lecture des siennes" on public.shopping_items;
create policy "courses : lecture des siennes" on public.shopping_items
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "courses : création des siennes" on public.shopping_items;
create policy "courses : création des siennes" on public.shopping_items
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "courses : modification des siennes" on public.shopping_items;
create policy "courses : modification des siennes" on public.shopping_items
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "courses : suppression des siennes" on public.shopping_items;
create policy "courses : suppression des siennes" on public.shopping_items
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Droits d'accès via l'API (la RLS filtre ensuite ligne par ligne)
-- ---------------------------------------------------------------------------
revoke all on public.profiles, public.recipes, public.meal_plan_entries, public.shopping_items from anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.recipes to authenticated;
grant select, insert, update, delete on public.meal_plan_entries to authenticated;
grant select, insert, update, delete on public.shopping_items to authenticated;
