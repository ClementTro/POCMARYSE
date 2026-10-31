# Mise en place de Supabase

Ce guide relie Maryse & Co à son backend (ADR 0003). Compter une quinzaine de minutes.
Tant qu'il n'est pas suivi, la vitrine fonctionne mais `/app` affiche « Le carnet n'est pas encore relié ».

## 1. Créer le projet

1. Se connecter sur [supabase.com](https://supabase.com) et créer un projet (offre gratuite).
2. **Région** : choisir une région de l'Union européenne (Paris `eu-west-3` ou Francfort `eu-central-1`), voir ADR 0011.
3. Noter le mot de passe de la base dans un gestionnaire de mots de passe. **Il ne sert pas au front** et ne doit
   jamais être commité.

## 2. Créer le schéma

Dans **SQL Editor** > **New query** :

1. Coller le contenu de [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql), puis **Run**.
2. Nouvelle requête : coller [`supabase/seed.sql`](../supabase/seed.sql) (20 recettes de démo), puis **Run**.
3. Nouvelle requête : coller [`supabase/migrations/0002_ping.sql`](../supabase/migrations/0002_ping.sql)
   (fonction `ping()` utilisée par la tâche qui empêche la mise en pause, voir « Points d'attention »), puis **Run**.

Les scripts sont rejouables sans erreur. Vérifier dans **Table Editor** que les tables `profiles`, `recipes`,
`meal_plan_entries` et `shopping_items` existent, avec le badge « RLS enabled ».

## 3. Configurer l'authentification

Dans **Authentication** > **URL Configuration** :

| Champ | Valeur |
|---|---|
| Site URL | `https://<propriétaire>.github.io/POCMARYSE/` |
| Redirect URLs | `https://<propriétaire>.github.io/POCMARYSE/**` |
| | `http://localhost:5173/POCMARYSE/**` |

Dans **Authentication** > **Sign In / Providers** > **Email** : laisser « Confirm email » activé (recommandé).
L'utilisatrice reçoit un lien qui la ramène sur `/app` une fois son adresse confirmée.

Facultatif : dans **Authentication** > **Emails**, traduire les modèles d'e-mails en français.

> Le flux PKCE est utilisé (ADR 0006) : les liens de confirmation et de réinitialisation doivent être ouverts
> **dans le même navigateur** que celui qui a fait la demande.

## 4. Récupérer les clés publiques

Dans **Project Settings** > **API** (ou **API Keys**) :

- **Project URL** → `VITE_SUPABASE_URL`
- **anon / publishable key** → `VITE_SUPABASE_ANON_KEY`

Ces deux valeurs sont publiques par nature (ADR 0009). **Ne jamais utiliser la clé `service_role` / `secret`.**

## 5. Brancher le site en ligne (GitHub Pages)

Depuis un terminal authentifié avec `gh`, dans le dossier du projet :

```bash
gh variable set VITE_SUPABASE_URL --body "https://xxxx.supabase.co"
gh variable set VITE_SUPABASE_ANON_KEY --body "eyJ..."
gh workflow run deploy.yml --ref main
```

Ou via GitHub : **Settings** > **Secrets and variables** > **Actions** > onglet **Variables**.

## 6. Brancher l'environnement local

```bash
cp .env.example .env.local
# renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm run dev
```

## 7. Vérifier

1. Ouvrir le site, **Créer mon carnet**, confirmer l'adresse via l'e-mail reçu.
2. Dans Supabase > **Table Editor** > `profiles` : une ligne doit avoir été créée automatiquement.
3. Dans l'application, l'onglet Recettes doit afficher les 20 recettes de Maryse.

## Points d'attention

- **Mise en pause** : un projet gratuit inactif pendant ~7 jours est mis en pause. Le workflow
  `garder-actif.yml` appelle `ping()` chaque lundi pour l'éviter ; il échoue (et GitHub envoie un e-mail) si le
  projet ne répond plus. Si le projet est tout de même en pause, le relancer depuis le tableau de bord Supabase.
  GitHub désactive les tâches planifiées après 60 jours sans activité dans le dépôt : les relancer dans
  l'onglet **Actions** si besoin.
- **Limite d'e-mails** : le service d'e-mails intégré est limité à quelques envois par heure. Pour une démo à
  plusieurs, configurer un SMTP (**Authentication** > **Emails** > **SMTP Settings**) ou désactiver
  temporairement « Confirm email ».
- **Nouvelle migration** : créer `supabase/migrations/000N_description.sql`, l'exécuter dans le SQL Editor,
  mettre à jour `src/core/database.types.ts` et ce document.

## Historique des migrations

| Fichier | Contenu |
|---|---|
| `0001_init.sql` | tables `profiles`, `recipes`, `meal_plan_entries`, `shopping_items`, RLS, trigger de profil |
| `0002_ping.sql` | fonction `ping()` (réveil hebdomadaire, sans accès aux données) |
| `seed.sql` | 20 recettes de démo (rejouable) |
