# AGENTS.md — Maryse & Co

Ce fichier est la mémoire du projet pour tout agent IA (et tout humain) qui travaille dessus.
**Lis-le en entier avant toute modification.** Si une décision change, mets à jour ce fichier
et l'ADR concerné dans le même commit.

## 1. Le projet en bref

- **Nom** : Maryse & Co.
- **Nature** : POC / démo technique d'une application fictive, pensée pour accueillir de nouvelles fonctionnalités.
- **Concept** : le carnet de cuisine familial de Maryse, en application web. Un site vitrine public
  raconte la success story de Maryse ; après connexion, l'utilisatrice accède à l'application.
- **Modules V1** : Recettes, Planning (repas de la semaine), Courses (liste générée depuis le planning).
- **Modules futurs** : listés dans [`docs/MODULES_A_VENIR.md`](docs/MODULES_A_VENIR.md), jamais codés sans décision explicite.
- **Langue** : documentation, commits et textes en français. L'interface est bilingue FR (défaut) / EN.
- **Démo en ligne** : https://clementtro.github.io/POCMARYSE/
- **Repo** : https://github.com/ClementTro/POCMARYSE

## 2. Contraintes non négociables

1. **Hébergement GitHub Pages** : le front est 100 % statique. Pas de SSR, pas de serveur Node, pas d'API maison.
2. **Backend = Supabase** (authentification, PostgreSQL, Row Level Security). Rien d'autre.
3. **Aucun secret dans le repo.** Seules `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` (clé publique) sont
   utilisées par le front. La clé `service_role` ne doit **jamais** apparaître dans le code, la CI ou la doc.
4. **Toute donnée utilisateur est protégée par RLS** : chaque table porte un `user_id` et des politiques
   `auth.uid() = user_id`. Pas de table sans RLS.
5. **Le site est servi sous `/POCMARYSE/`** : toujours passer par `import.meta.env.BASE_URL` pour les chemins
   d'assets et le `basename` du routeur. Ne jamais écrire de chemin absolu `/images/...` en dur.
6. **Une fonctionnalité métier = un module** dans `src/modules/<id>/`, déclaré dans `src/core/moduleRegistry.ts`.
7. **Polices auto-hébergées** (`@fontsource`), pas de CDN Google (RGPD).
8. **Photos de Maryse** : utilisées avec le consentement déclaré des personnes et de l'entreprise (ADR 0011).
   Ne pas les modifier, les recadrer ou les réutiliser ailleurs sans nouvelle décision.

## 3. Stack

| Besoin | Choix |
|---|---|
| Runtime | Node.js 22 (`.nvmrc`) |
| Build | Vite 8 |
| UI | React 18 + TypeScript 5.9 strict |
| Style | Tailwind CSS 3.4 (tokens de la charte dans `tailwind.config.ts`) |
| Routing | `react-router-dom` (`BrowserRouter` + `404.html` de repli) |
| Données serveur | `@supabase/supabase-js` + `@tanstack/react-query` |
| Formulaires | `react-hook-form` + `zod` |
| i18n | `i18next` + `react-i18next` |
| Glisser-déposer | `@dnd-kit/core` |
| Icônes | `lucide-react` |
| Tests | Vitest 5 + Testing Library |
| Qualité | ESLint 9 + Prettier 3 |

Les raisons de chaque choix sont dans [`docs/adr/`](docs/adr/).

## 4. Architecture

```
src/
  core/        shell de l'app : router, layouts, auth, client Supabase, registre des modules,
               profil et préférences (ADR 0013), pages système (tableau de bord, profil, 404)
  shared/      composants UI réutilisables, thème, hooks, utilitaires (aucune logique métier)
  vitrine/     pages publiques (accueil, histoire, fonctionnalités, auth, pages légales)
  modules/     un dossier par module métier (recettes, planning, courses)
  i18n/        initialisation i18next et traductions communes
  styles/      CSS global (Tailwind)
supabase/      migrations SQL et seed
docs/          ADR, roadmap, modules à venir, setup Supabase
```

Règles de dépendance :

- `shared/` n'importe rien de `core/`, `vitrine/` ni `modules/`.
- Un module n'importe jamais un autre module. S'il a besoin de données d'un autre domaine, il passe par
  Supabase (requête dédiée) ou par un utilitaire de `shared/` (ex. dates locales dans `shared/lib/dates.ts`).
- `core/` ne connaît les modules que via `moduleRegistry.ts`.
- Un module peut importer de `core/` uniquement : `@/core/types`, `@/core/supabase` (`clientSupabase()`),
  `@/core/database.types` (types des tables) et `@/core/auth/useAuth`. Ses imports internes sont relatifs.
- Ces règles sont vérifiées par ESLint (`no-restricted-imports`) : un import interdit fait échouer la CI.

Contrat d'un module (voir ADR 0005 et `CONTRIBUTING.md`) :

```ts
export interface AppModule {
  id: string;
  basePath: string;
  routes: RouteObject[];
  navItem: { labelKey: string; icon: LucideIcon };
  i18n: { fr: Record<string, unknown>; en: Record<string, unknown> };
  dashboardWidget?: React.ComponentType;
}
```

## 5. Workflow git (sans validation humaine)

- **Branches** : `main` = production (déployée sur Pages) ; `develop` = travail quotidien. Pas d'autre branche.
- **On travaille toujours sur `develop`.** Jamais de commit direct sur `main`.
- **Commits** : [Conventional Commits](https://www.conventionalcommits.org/fr/), en français, à l'impératif présent,
  **une modification logique par commit** (un commit doit pouvoir être relu et annulé seul).
  - Types : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`.
  - Portées : `core`, `ui`, `auth`, `vitrine`, `recettes`, `planning`, `courses`, `i18n`, `theme`, `db`, `ci`, `docs`, `adr`.
  - Exemples : `feat(recettes): ajoute la fiche détaillée`, `fix(auth): corrige la redirection après connexion`.
- **Avant chaque commit** : `npm run lint && npm run typecheck && npm run test` doivent passer.
- **Release** (fin de jalon, voir `docs/ROADMAP.md`) :
  1. mettre à jour `CHANGELOG.md` et la version de `package.json` sur `develop`, commit `chore(release): vX.Y.Z` ;
  2. `gh pr create --base main --head develop --title "release: vX.Y.Z" --body "<résumé>"` ;
  3. `gh pr checks <n> --watch` jusqu'à CI verte (sinon : commits `fix` sur `develop`, puis on recommence) ;
  4. `gh pr merge <n> --merge` (merge commit, **pas** de squash ni de suppression de `develop`) ;
  5. `git fetch && git tag -a vX.Y.Z origin/main -m "vX.Y.Z : <résumé>" && git push origin vX.Y.Z` ;
  6. resynchroniser `develop` sur le merge commit : `git merge --ff-only origin/main && git push` ;
  7. vérifier le déploiement (`gh run list --workflow deploy.yml`, puis `gh run watch <id>`).
- Si `gh pr create` échoue sur une erreur GraphQL transitoire, passer par l'API REST :
  `gh api -X POST repos/ClementTro/POCMARYSE/pulls -f title=... -f head=develop -f base=main -f body=...`,
  et pour merger : `gh api -X PUT repos/ClementTro/POCMARYSE/pulls/<n>/merge -f merge_method=merge`.
- **Interdits** : `push --force` sur `main` ou `develop`, réécriture d'historique publié, commit de `.env*`
  (sauf `.env.example`), suppression des branches `main` / `develop`.

## 6. Commandes

```bash
npm install          # dépendances
npm run dev          # serveur local (http://localhost:5173/POCMARYSE/)
npm run build        # build de production + copie 404.html
npm run preview      # prévisualise le build
npm run lint         # ESLint + vérification UTF-8 (fichiers valides, pas de texte encodé deux fois)
npm run typecheck    # tsc --noEmit
npm run test         # Vitest (une passe)
npm run format       # Prettier
npm run typo:fr      # espaces insécables FR (avant ? ! : ; et dans « ») — à lancer après toute modif d'un fr.json
```

Sous Windows, ne jamais écrire un fichier avec `Set-Content`, `Out-File` ou `>` de PowerShell 5 :
ils réécrivent les accents en ANSI et cassent le build. Utiliser les outils d'édition, ou Node (`fs.writeFileSync`).

Configuration locale : copier `.env.example` en `.env.local` et renseigner les deux variables Supabase.
Sans elles, l'app affiche un écran « Backend non configuré » au lieu de planter.

## 7. Design (résumé de l'ADR 0008)

Direction « cahier de cuisine familial » : papier Seyès, faïence bleue, nappe vichy, notes manuscrites.

- Couleurs : `papier #FDFCF7`, `seyes #B9CBE4`, `faience #2F5D8C`, `vichy #C9463D`, `beurre #F2D16B`, `sauge #7E9C7A`.
- Polices : Young Serif (titres), Nunito (texte), Kalam (annotations manuscrites uniquement, jamais pour du texte long).
- Un seul élément signature par page ; le reste reste sobre. Pas de dégradés décoratifs, pas de libellés en capitales.
- Accessibilité : focus visible, contrastes AA, `prefers-reduced-motion` respecté, responsive mobile.
- Ton des textes : chaleureux, simple, tutoiement côté app (« Ajoute ta première recette »), phrases courtes.

## 8. Obligations documentaires

À chaque changement significatif, dans le même commit ou le commit suivant :

- **Nouvelle décision ou décision modifiée** → nouvel ADR dans `docs/adr/` (copier `0000-template.md`), et mise à jour de ce fichier.
- **Fonctionnalité livrée** → `CHANGELOG.md` (section « Non publié ») et `docs/ROADMAP.md`.
- **Nouvelle idée de module** → `docs/MODULES_A_VENIR.md`, pas de code.
- **Changement de schéma** → nouvelle migration numérotée dans `supabase/migrations/` (ne jamais modifier une migration déjà appliquée) et mise à jour de `docs/SUPABASE_SETUP.md`.

## 9. Index des ADR

| N° | Titre |
|---|---|
| [0001](docs/adr/0001-hebergement-github-pages.md) | Hébergement du front sur GitHub Pages |
| [0002](docs/adr/0002-stack-front.md) | Stack front : Vite, React, TypeScript, Tailwind |
| [0003](docs/adr/0003-backend-supabase.md) | Backend Supabase (auth, PostgreSQL, RLS) |
| [0004](docs/adr/0004-vitrine-et-application.md) | Séparation site vitrine public / application protégée |
| [0005](docs/adr/0005-architecture-modulaire.md) | Architecture modulaire et contrat `AppModule` |
| [0006](docs/adr/0006-routing.md) | Routing : URL classiques et `404.html` de repli |
| [0007](docs/adr/0007-i18n.md) | Internationalisation FR/EN |
| [0008](docs/adr/0008-charte-graphique.md) | Thème clair/sombre et charte « cahier de cuisine » |
| [0009](docs/adr/0009-gestion-des-secrets.md) | Gestion des secrets et variables d'environnement |
| [0010](docs/adr/0010-workflow-git.md) | Workflow git develop / main sans validation humaine |
| [0011](docs/adr/0011-donnees-personnelles.md) | Données personnelles, RGPD et photos |
| [0012](docs/adr/0012-generation-liste-de-courses.md) | Génération de la liste de courses depuis le planning |
| [0013](docs/adr/0013-preferences-du-profil.md) | Langue et thème synchronisés avec le profil |
