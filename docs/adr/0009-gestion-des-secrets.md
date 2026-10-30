# ADR 0009 — Gestion des secrets et variables d'environnement

- **Statut** : accepté
- **Date** : 2026-10-30

## Contexte

Le code front est entièrement public (repo public + bundle servi par GitHub Pages).
Le front a pourtant besoin de connaître l'URL du projet Supabase et sa clé publique.

## Décision

- Deux variables seulement, toutes deux **publiques par nature** :
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY` (clé `anon` / `publishable`)
- En local : fichier `.env.local` (ignoré par git). Modèle commité : `.env.example`.
- En CI : **variables** de dépôt GitHub (`gh variable set VITE_SUPABASE_URL --body ...`), lues par `deploy.yml`.
- La clé `service_role` et le mot de passe de la base ne sont **jamais** utilisés par le front,
  jamais commités, jamais placés dans la CI.
- Si les variables sont absentes, l'application affiche l'écran « Backend non configuré » au lieu de planter.

## Alternatives envisagées

- **Secrets GitHub** : inutile pour des valeurs publiques, et masquerait faussement leur nature.
- **Valeurs en dur dans le code** : rendrait le changement de projet Supabase pénible.

## Conséquences

- La sécurité des données repose sur les politiques RLS (ADR 0003), pas sur le secret de la clé.
- Toute PR qui introduit un `.env` ou une clé `service_role` doit être annulée immédiatement.
