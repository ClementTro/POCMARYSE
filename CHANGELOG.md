# Changelog

Toutes les évolutions notables du projet sont consignées ici.
Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versionnage [SemVer](https://semver.org/lang/fr/).

## [Non publié]

### Ajouté

- Module Recettes : liste avec recherche sans accents et filtres (étiquette, temps, difficulté,
  origine) conservés dans l'URL, fiche cartonnée, création / modification / suppression,
  copie des recettes de Maryse dans son carnet, impression.
- Module Planning : semaine du lundi au dimanche, midi et soir, recettes posées comme des aimants
  par glisser-déposer (souris, toucher, clavier case par case avec annonces pour lecteurs d'écran),
  échange de deux repas, choix dans une liste en alternative, navigation entre semaines,
  mises à jour optimistes. Widget « Au menu aujourd'hui » pour le tableau de bord.
- Champs à libellé masqué et message d'erreur de chargement avec « Réessayer » dans `shared/ui`.
- Règles de dépendance entre couches vérifiées par ESLint.
- Vérification de l'encodage UTF-8 de tous les fichiers dans `npm run lint`.

### Corrigé

- En-tête de l'application sur mobile (logo sur une ligne, bouton de déconnexion visible).
- Les listes gardent leurs données affichées quand une relecture échoue.

## [0.2.0] - 2026-10-30

### Ajouté

- Design system « cahier de cuisine » : papier Seyès, bleu faïence, vichy, fiches bristol,
  photos scotchées, notes manuscrites ; thème clair, sombre ou système, appliqué avant le premier rendu.
- Interface en français et en anglais, langue détectée puis mémorisée.
- Registre des modules (`AppModule`), layouts public et application, routes protégées.
- Client Supabase typé (PKCE), fournisseur de session, écran « Backend non configuré ».
- Migration SQL : profils, recettes, planning, courses, RLS sur chaque table ; 20 recettes de démo.
- Inscription, connexion, mot de passe oublié, nouveau mot de passe, déconnexion.
- Pages vitrine : accueil, histoire de Maryse, fonctionnalités, mentions légales, confidentialité.
- Script `npm run typo:fr` pour les espaces insécables de la typographie française.

### Corrigé

- Fond du thème sombre appliqué sur `body`.
- Largeur du bouton de changement de thème.

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
