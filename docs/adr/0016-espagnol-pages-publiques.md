# ADR 0016 — Espagnol sur les pages publiques

- **Statut** : accepté
- **Date** : 2026-11-02

## Contexte

L'association souhaite proposer le site en espagnol. L'ADR 0007 prévoit deux langues et mémorise le choix dans
`profiles.locale`, dont la contrainte `check` n'accepte que `fr` et `en`. Ouvrir l'espagnol à l'application
demande une migration et la traduction de tous les modules : ce travail relève d'une personne technique.

## Décision

- L'espagnol (`es`) est une langue des **pages publiques** : accueil, histoire, fonctionnalités, connexion et
  inscription, pages légales, en-tête et pied de page. Traductions dans `src/i18n/locales/es/`
  (`common.json`, `auth.json`, `vitrine.json`) ; pas de `app.json` ni de traduction de module.
- `LANGUES` (`src/i18n/index.ts`) contient `fr`, `en`, `es` ; le sélecteur de l'en-tête public affiche les trois,
  celui de l'application garde `fr` et `en` (valeur par défaut de `LangSwitch`).
- Le choix de l'espagnol est mémorisé dans le navigateur (`localStorage`) uniquement. `es` n'est jamais écrit
  dans `profiles.locale` : l'inscription et la synchronisation du profil le ramènent à `fr`.
- À l'ouverture de l'application, la langue du profil remplace l'espagnol (`SynchroPreferences`).
- Un test vérifie que les fichiers espagnols ont exactement les mêmes clés que les fichiers français.

## Alternatives envisagées

- **Espagnol sur tout le site** : migration de `profiles.locale` et traduction de tous les modules ; noté dans
  `docs/MODULES_A_VENIR.md` pour une personne technique.
- **Repli sur le français dans l'application sans changer de langue** : mélange d'espagnol (en-tête) et de
  français (pages) ; écarté.

## Conséquences

- Un navigateur réglé en espagnol ouvre désormais les pages publiques en espagnol.
- Toute modification d'un texte public se fait en français, en anglais **et** en espagnol.
- Sur téléphone, le troisième bouton de langue fait passer les boutons de l'en-tête public sur deux lignes.
- AGENTS.md (langue de l'interface, index des ADR) est mis à jour ; l'ADR 0007 reste valable pour `fr` et `en`.
