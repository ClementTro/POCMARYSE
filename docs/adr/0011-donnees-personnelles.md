# ADR 0011 — Données personnelles, RGPD et photos

- **Statut** : accepté
- **Date** : 2026-10-30

## Contexte

L'application collecte des adresses e-mail et des données saisies par les utilisatrices.
Le site vitrine utilise des photos réelles de Maryse, notamment une photo de remise de la Médaille d'honneur
du travail sur laquelle figurent trois personnes ainsi que des éléments de marque d'entreprise.

## Décision

- **Minimisation** : seules sont collectées l'adresse e-mail, le nom affiché et les données de l'application
  (recettes, planning, courses). Pas de traceur, pas d'outil d'analyse d'audience, pas de cookie publicitaire.
- Pages **Mentions légales** (`/mentions-legales`) et **Politique de confidentialité** (`/confidentialite`)
  accessibles depuis le pied de page de la vitrine et de l'application.
- Données hébergées par Supabase (région UE à choisir à la création du projet).
- **Suppression de compte** : documentée dans la politique de confidentialité (demande par e-mail pour le POC).
- **Photos** : le porteur du projet déclare avoir obtenu le consentement des trois personnes visibles et de
  l'entreprise pour une publication publique de la photo entière. Les photos sont stockées dans
  `public/images/maryse/` et ne doivent être ni modifiées ni réutilisées hors de ce projet.
- Le récit de la page « Histoire » est une **fiction inspirée de Maryse**, signalée comme telle sur la page,
  et soumise à sa validation.

## Alternatives envisagées

- **Photo recadrée / logos floutés** : proposé, écarté par le porteur du projet qui dispose des consentements.

## Conséquences

- Tout ajout de traceur ou de service tiers nécessite un nouvel ADR et une mise à jour de la politique de confidentialité.
- En cas de retrait de consentement, la photo est retirée du repo et de l'historique de déploiement au plus vite.
