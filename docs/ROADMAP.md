# Roadmap

Chaque jalon se termine par une release `develop → main` (voir ADR 0010).

## Jalon 1 — v0.1.0 : socle et déploiement (publié)

- [x] Connexion au repo, branches `main` et `develop`, GitHub Pages en mode Actions
- [x] `AGENTS.md`, ADR 0001 à 0011, README, CONTRIBUTING, ROADMAP, MODULES_A_VENIR, CHANGELOG, règles Cursor
- [x] Squelette Vite + React + TypeScript + Tailwind, ESLint, Prettier, Vitest
- [x] CI (`ci.yml`) et déploiement (`deploy.yml`)
- [x] Première page publiée

## Jalon 2 — v0.2.0 : vitrine et comptes (publié)

- [x] Design system « cahier de cuisine », thème clair/sombre
- [x] i18n FR/EN
- [x] Registre des modules, layouts, routes protégées
- [x] Schéma Supabase, RLS, recettes de démo
- [x] Inscription, connexion, mot de passe oublié, déconnexion
- [x] Pages vitrine : accueil, histoire de Maryse, fonctionnalités, mentions légales, confidentialité

## Jalon 3 — v0.3.0 : les trois modules (publié)

- [x] Recettes : liste, filtres, fiche, création / modification / suppression, copie des recettes de démo
- [x] Planning : semaine midi / soir, glisser-déposer
- [x] Courses : génération depuis le planning, regroupement, cases à cocher

## Jalon 4 — v1.0.0 : finitions

- [ ] Tableau de bord et profil
- [ ] Tests unitaires de la logique métier
- [ ] Passe accessibilité et responsive
- [ ] Documentation finale

## En attente côté porteur du projet

- [ ] Déposer les photos de Maryse dans `public/images/maryse/` (`medaille.jpg`, et la seconde photo)
- [ ] Créer le projet Supabase et renseigner les variables du repo (voir `docs/SUPABASE_SETUP.md`)
- [ ] Faire valider le texte de la page « Histoire » par Maryse
