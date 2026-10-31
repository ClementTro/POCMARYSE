# Roadmap

Chaque jalon se termine par une release vers `main`. Jusqu'à la v1.1.0, elle passait par la branche `develop`
(ADR 0010) ; ensuite, chaque demande a sa branche et sa mise en ligne (ADR 0014).

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

## Jalon 4 — v1.0.0 : finitions (publié)

- [x] Tableau de bord et profil
- [x] Tests unitaires de la logique métier
- [x] Passe accessibilité et responsive (axe-core sans violation WCAG 2.2 AA sur toutes les pages,
      thèmes clair et sombre ; aucun débordement de 320 à 1280 px)
- [x] Documentation finale

## Jalon 5 — v1.1.0 : maintenance par l'association (publié)

- [x] ADR 0014 : une branche par demande, `main` protégée, validation avant mise en ligne, mode développeur
- [x] Scripts `publier`, `annuler`, `diagnostic` et `mode-dev` / `mode-asso`
- [x] Contrôle du site après déploiement, tag de la dernière version saine, retour arrière automatique
- [x] Mises à jour automatiques des dépendances (Dependabot) et déploiement de rattrapage
- [x] Réveil hebdomadaire de Supabase (`ping()`)
- [x] Règles Cursor pour l'interlocuteur non technique, procédures par type de demande, commandes
- [x] `MAINTENANCE.md`, `GUIDE_ASSOCIATION.md`, `SCENARIOS_AGENT.md`

## Après la v1

Les prochaines évolutions sont choisies dans [`MODULES_A_VENIR.md`](MODULES_A_VENIR.md), une à la fois,
chacune avec son jalon et sa release.

## En attente côté porteur du projet

- [x] Déposer les photos de Maryse dans `public/images/maryse/` (`medaille.jpg`, et la seconde photo)
- [x] Créer le projet Supabase et renseigner les variables du repo (voir `docs/SUPABASE_SETUP.md`)
- [ ] Faire valider le texte de la page « Histoire » par Maryse
- [ ] Coller `supabase/migrations/0002_ping.sql` dans l'éditeur SQL de Supabase (sinon la tâche hebdomadaire
      « Garder Supabase actif » échoue)
- [ ] Rejouer les scénarios de `docs/SCENARIOS_AGENT.md` dans une conversation Cursor neuve
