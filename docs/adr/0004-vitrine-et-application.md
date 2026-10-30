# ADR 0004 — Séparation site vitrine public / application protégée

- **Statut** : accepté
- **Date** : 2026-10-30

## Contexte

Le produit doit être présenté (storytelling de Maryse, fonctionnalités) avant de demander un compte.
L'application elle-même n'a de sens qu'avec des données personnelles.

## Décision

Une seule application React, deux zones :

| Zone | Routes | Layout |
|---|---|---|
| Vitrine (publique) | `/`, `/histoire`, `/fonctionnalites`, `/connexion`, `/inscription`, `/mot-de-passe-oublie`, `/nouveau-mot-de-passe`, `/mentions-legales`, `/confidentialite` | `PublicLayout` |
| Application (protégée) | `/app`, `/app/profil`, `/app/<module>/...` | `AppLayout` derrière `ProtectedRoute` |

- `ProtectedRoute` redirige vers `/connexion` (en mémorisant la page demandée) si aucune session n'existe.
- Une utilisatrice connectée qui ouvre `/connexion` ou `/inscription` est redirigée vers `/app`.

## Alternatives envisagées

- **Deux sites séparés** (vitrine statique + app) : double build, double déploiement, sans bénéfice ici.

## Conséquences

- Les pages vitrine et l'app partagent le design system et l'i18n.
- Les pages de l'app sont chargées en différé (`React.lazy`) pour garder la vitrine légère.
