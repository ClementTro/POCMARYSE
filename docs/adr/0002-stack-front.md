# ADR 0002 — Stack front : Vite, React, TypeScript, Tailwind

- **Statut** : accepté
- **Date** : 2026-10-30

## Contexte

Il faut une stack moderne, connue des agents IA, qui produise un build statique compatible GitHub Pages
et qui permette d'ajouter des fonctionnalités rapidement.

## Décision

- **Vite** pour le build et le serveur de développement.
- **React 18 + TypeScript** en mode `strict`.
- **Tailwind CSS** pour le style, avec les tokens de la charte dans `tailwind.config.ts`.
- Bibliothèques retenues :
  - `react-router-dom` (routing),
  - `@tanstack/react-query` (cache et état des données serveur),
  - `react-hook-form` + `zod` (formulaires et validation),
  - `i18next` + `react-i18next` (traductions),
  - `@dnd-kit/core` (glisser-déposer du planning),
  - `lucide-react` (icônes),
  - `@fontsource/*` (polices auto-hébergées).
- Qualité : ESLint, Prettier, Vitest + Testing Library.

## Alternatives envisagées

- **Vue 3 / Svelte** : excellents, mais React a été choisi par le porteur du projet.
- **Next.js** : surdimensionné ; son intérêt (SSR, routes API) est inutilisable sur GitHub Pages.
- **Bibliothèque de composants complète (MUI, Chakra)** : rendu trop « générique », contraire à la charte.

## Conséquences

- Composants UI maison dans `src/shared/ui/`, construits avec Tailwind.
- Pas d'état global lourd : React Query pour le serveur, contexte React pour l'auth et le thème.
