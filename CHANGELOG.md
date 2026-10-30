# Changelog

Toutes les évolutions notables du projet sont consignées ici.
Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versionnage [SemVer](https://semver.org/lang/fr/).

## [Non publié]

## [0.1.0] - 2026-10-30

### Ajouté

- Initialisation du dépôt, branches `main` et `develop`, GitHub Pages en mode Actions.
- `AGENTS.md`, registre des décisions d'architecture (ADR 0001 à 0011), README, guide de contribution,
  roadmap, liste des modules à venir, règles Cursor.
- Squelette Vite 8 + React 18 + TypeScript strict + Tailwind 3.4 avec les tokens de la charte.
- ESLint, Prettier, Vitest et Testing Library.
- Copie de `index.html` en `404.html` au build pour les routes profondes.
- CI (formatage, lint, types, tests, build) sur `develop` et les PR vers `main`.
- Déploiement automatique sur GitHub Pages depuis `main`.
