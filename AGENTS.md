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
- **Démo en ligne et dépôt** : le propriétaire peut changer ; ne pas écrire son nom en dur. L'adresse du site
  (`https://<propriétaire>.github.io/POCMARYSE/`) et celle du dépôt s'obtiennent avec `npm run diagnostic`
  ou `gh repo view`.
- **Propriétaire** : l'association (dépôt GitHub, projet Supabase). Elle fait évoluer le site avec l'agent de
  Cursor : voir la section 10 et l'ADR 0014.

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

## 5. Workflow git (ADR 0014)

- **Branches** : `main` est la seule branche longue (production, déployée sur Pages). Chaque demande se fait sur
  une branche `demande/<sujet-en-minuscules-et-tirets>`. Il n'y a plus de `develop`.
- **`main` est protégée, y compris pour la propriétaire** : PR obligatoire, check « Lint, types, tests, build »
  obligatoire, ni push direct ni force push. Ne jamais chercher à contourner cette protection.
- **Commits** : [Conventional Commits](https://www.conventionalcommits.org/fr/), en français, à l'impératif présent,
  **une modification logique par commit** (un commit doit pouvoir être relu et annulé seul).
  - Types : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`.
  - Portées : `core`, `ui`, `auth`, `vitrine`, `recettes`, `planning`, `courses`, `i18n`, `theme`, `db`, `ci`, `docs`, `adr`.
  - Exemples : `feat(recettes): ajoute la fiche détaillée`, `fix(auth): corrige la redirection après connexion`.
- **Avant chaque commit** : `npm run lint && npm run typecheck && npm run test` doivent passer.
- **Journal des changements** : chaque demande ajoute ses lignes à la section « Non publié » de `CHANGELOG.md`,
  en phrases simples compréhensibles par l'association (« Le titre de l'accueil change »), pas en jargon.
- **Mise en ligne** : `npm run publier -- --type patch|minor` (`patch` pour un texte, une image ou un bug,
  `minor` pour une nouvelle fonction). Le script fait tout, dans l'ordre, et s'arrête au premier problème :
  prérequis, vérifications locales, version et changelog, commit `chore(release): vX.Y.Z`, push, PR, attente de
  la CI, fusion, suivi du déploiement et du contrôle du site. **Ne pas refaire ces étapes à la main.**
  - `npm run publier -- --a-blanc` fait seulement les vérifications, sans rien publier.
  - Hors mode développeur, **jamais sans un « oui » explicite** de la propriétaire après les captures d'écran.
- **Après la fusion** : `deploy.yml` déploie, contrôle le site (`scripts/verifier-site.mjs`), puis pose le tag
  `vX.Y.Z`. Si le contrôle échoue, il redéploie le dernier tag. **Le dernier tag est la dernière version saine.**
- **Annuler** : `npm run annuler` remet en ligne la version précédente puis publie une version qui annule
  les changements.
- **Mises à jour de dépendances** : Dependabot propose, la CI valide, la fusion est automatique pour les
  corrections et mises à jour mineures. Les montées de version majeures sont du ressort d'une personne technique.
- **Interdits** : `push --force`, réécriture d'historique publié, commit de `.env*` (sauf `.env.example`),
  désactivation de la CI ou de la protection de `main` (sauf demande explicite d'un développeur), suppression
  de `main`.

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
npm run publier      # met en ligne la demande en cours (voir section 5)
npm run annuler      # remet en ligne la version précédente
npm run diagnostic   # état de la CI, du déploiement, du site et de Supabase (lecture seule)
npm run mode-dev     # active le mode développeur (npm run mode-asso pour le retirer)
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
| [0010](docs/adr/0010-workflow-git.md) | Workflow git develop / main sans validation humaine (remplacé par 0014) |
| [0011](docs/adr/0011-donnees-personnelles.md) | Données personnelles, RGPD et photos |
| [0012](docs/adr/0012-generation-liste-de-courses.md) | Génération de la liste de courses depuis le planning |
| [0013](docs/adr/0013-preferences-du-profil.md) | Langue et thème synchronisés avec le profil |
| [0014](docs/adr/0014-maintenance-par-l-association.md) | Maintenance par l'association : branche par demande, mise en ligne sûre, mode développeur |

## 10. Interlocuteur et maintenance (ADR 0014)

Le site est entretenu par une personne **non technique** avec l'agent de Cursor. Les règles de comportement sont
dans `.cursor/rules/` :

- `interlocuteur.mdc` et `triage-demandes.mdc` (toujours actives) : ton, questions, tri des demandes.
- `procedure-*.mdc` (chargées selon la demande) : bug, lenteur, texte ou image, nouvelle fonction,
  mise en ligne, sécurité et versions.
- Documents : [`docs/MAINTENANCE.md`](docs/MAINTENANCE.md) (pannes, retour arrière, prérequis),
  [`docs/GUIDE_ASSOCIATION.md`](docs/GUIDE_ASSOCIATION.md) (pour la propriétaire),
  [`docs/SCENARIOS_AGENT.md`](docs/SCENARIOS_AGENT.md) (comportements à rejouer après toute modification des règles).

**Mode développeur** : si le fichier `.cursor/mode-developpeur` existe (`npm run mode-dev`, jamais versionné) ou si
la personne dit « je suis dev » / « mode développeur », l'agent lève le ton simplifié, les questions systématiques,
les captures et le « oui » avant mise en ligne. Les contraintes de la section 2, la CI et le flux par PR restent.
