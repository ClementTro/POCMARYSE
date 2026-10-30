# Maryse & Co

Le carnet de cuisine familial de Maryse, en application web : des recettes, le planning des repas de la
semaine et la liste de courses qui se fait toute seule.

- **Démo** : https://clementtro.github.io/POCMARYSE/
- **Statut** : POC / démo technique (voir [`docs/ROADMAP.md`](docs/ROADMAP.md))

## Ce que fait l'application

- **Site vitrine** : l'histoire de Maryse, les fonctionnalités, la création de compte.
- **Recettes** : un carnet personnel, des recettes de démo à copier, recherche et filtres.
- **Planning** : la semaine en grille midi / soir, on y glisse ses recettes.
- **Courses** : la liste est générée à partir du planning, ingrédients regroupés, à cocher au magasin.
- Interface en **français** et en **anglais**, thème **clair** ou **sombre**.

## Stack

Vite, React, TypeScript, Tailwind CSS, Supabase (auth + PostgreSQL), hébergé sur GitHub Pages.
Les choix sont expliqués dans [`docs/adr/`](docs/adr/).

## Démarrer en local

Prérequis : Node.js 20 ou plus.

```bash
npm install
cp .env.example .env.local   # puis renseigner les variables Supabase
npm run dev                  # http://localhost:5173/POCMARYSE/
```

Sans variables Supabase, la vitrine fonctionne mais l'application affiche « Backend non configuré ».
La mise en place du backend est décrite dans [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md).

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | build de production (avec `404.html` pour GitHub Pages) |
| `npm run preview` | prévisualise le build |
| `npm run lint` | ESLint |
| `npm run typecheck` | vérification TypeScript |
| `npm run test` | tests Vitest |
| `npm run format` | formatage Prettier |

## Documentation

- [`AGENTS.md`](AGENTS.md) : règles du projet (à lire en premier, humain ou IA).
- [`CONTRIBUTING.md`](CONTRIBUTING.md) : conventions et ajout d'un module.
- [`docs/adr/`](docs/adr/) : registre des décisions d'architecture.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) : jalons et avancement.
- [`docs/MODULES_A_VENIR.md`](docs/MODULES_A_VENIR.md) : idées de modules.
- [`CHANGELOG.md`](CHANGELOG.md) : historique des versions.

## Déploiement

Chaque push sur `main` publie le site via GitHub Actions. Le travail se fait sur `develop` ;
les releases sont des PR `develop → main` (voir ADR 0010).
