# ADR 0003 — Backend Supabase (auth, PostgreSQL, RLS)

- **Statut** : accepté
- **Date** : 2026-10-30

## Contexte

Les utilisatrices doivent pouvoir créer un compte, se connecter et retrouver leurs recettes, leur planning
et leurs courses sur n'importe quel appareil. GitHub Pages ne peut exécuter aucun code serveur (ADR 0001).

## Décision

Nous utilisons **Supabase** comme backend :

- **Auth** : e-mail + mot de passe, confirmation par e-mail, réinitialisation du mot de passe.
- **PostgreSQL** pour les données, accédé directement depuis le front via `@supabase/supabase-js`.
- **Row Level Security** activée sur toutes les tables ; chaque ligne utilisateur porte un `user_id`.
- Schéma versionné dans `supabase/migrations/`, données de démo dans `supabase/seed.sql`.

Schéma initial :

| Table | Rôle |
|---|---|
| `profiles` | nom affiché, langue, thème (ligne créée par trigger à l'inscription) |
| `recipes` | recettes ; `user_id` nul = recette de démo partagée, lisible par toutes les connectées |
| `meal_plan_entries` | une recette posée sur un jour et un créneau (`midi` / `soir`) |
| `shopping_items` | articles de la liste de courses (`source` : `planning` ou `manuel`) |

## Alternatives envisagées

- **Firebase** : très bon, mais NoSQL et règles de sécurité moins lisibles qu'en SQL.
- **Appwrite Cloud / PocketBase** : moins répandus, PocketBase nécessiterait un hébergement séparé.
- **Stockage local (IndexedDB)** : pas de vrai compte ni de synchronisation, contraire au besoin.

## Conséquences

- La clé `anon` est publique par nature ; la sécurité repose **entièrement sur les politiques RLS**.
  Toute nouvelle table doit être livrée avec ses politiques dans la même migration.
- Le plan gratuit met le projet en pause après ~7 jours d'inactivité : le relancer avant une démo.
- Les scripts SQL sont appliqués à la main dans l'éditeur SQL Supabase (voir `docs/SUPABASE_SETUP.md`).
