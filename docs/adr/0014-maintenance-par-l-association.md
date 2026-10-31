# ADR 0014 — Maintenance par l'association

- **Statut** : accepté. Remplace l'[ADR 0010](0010-workflow-git.md).
- **Date** : 2026-10-31

## Contexte

Le projet est livré à une association non technique, propriétaire de tout (dépôt GitHub, projet Supabase).
Une seule personne l'entretiendra, avec l'agent de Cursor : demandes floues, changements de texte ou
d'image, petites fonctionnalités, corrections de bugs, mises en ligne, mises à jour de sécurité.

L'ADR 0010 convenait à un agent qui construisait seul le projet : deux branches, aucune validation humaine.
Pour une maintenance par une personne non technique, il manque des garde-fous, une procédure de mise en ligne
simple et un retour arrière.

Principe directeur : les consignes écrites ne suffisent pas, un agent les suit la plupart du temps mais pas
toujours, et la personne cliquera « Accepter » sans lire. Les vrais garde-fous sont **mécaniques** (GitHub),
les consignes ne servent qu'à bien se comporter dans les cas courants.

## Décision

### Git : une branche par demande

- **`main`** est la seule branche longue : elle est déployée sur Pages. `develop` disparaît.
- Chaque demande se fait sur une branche **`demande/<sujet>`**, puis une PR vers `main`, une mise en ligne,
  un retour arrière possible. Les commits restent des Conventional Commits en français.
- `main` est **protégée, y compris pour la propriétaire** : PR obligatoire, check « Lint, types, tests, build »
  obligatoire, ni push direct, ni force push, ni suppression. Un développeur qui veut s'en affranchir
  désactive lui-même la protection dans les réglages GitHub.

### Mise en ligne : un seul script

- `npm run publier` enchaîne : vérifications locales, changelog et version, PR, attente de la CI, fusion,
  suivi du déploiement et du contrôle du site. Il s'arrête au premier problème et l'explique en français simple.
- L'agent ne l'exécute qu'après un **« oui » de la propriétaire** dans la conversation, une fois les captures
  d'écran montrées.
- `deploy.yml` vérifie le site après chaque déploiement (`scripts/verifier-site.mjs`). Si le contrôle réussit,
  le workflow pose le tag `vX.Y.Z` : **le dernier tag est donc toujours la dernière version saine**.
  S'il échoue, le workflow redéploie automatiquement ce dernier tag.
- `npm run annuler` remet en ligne la version précédente puis prépare une PR qui annule les changements.

### Mises à jour et durée de vie

- **Dependabot** propose chaque semaine les mises à jour courantes (corrections et mineures), regroupées, et
  immédiatement celles de sécurité. Elles sont fusionnées automatiquement quand la CI est verte. Les montées de
  version majeures sont ignorées : ce sont des chantiers pour une personne technique.
- Un déploiement quotidien de rattrapage publie une fusion automatique qui n'aurait pas déclenché le déploiement
  (les actions lancées avec le jeton de GitHub ne déclenchent pas d'autres workflows).
- Une tâche hebdomadaire appelle la fonction `ping()` de Supabase pour éviter la mise en pause du projet gratuit.

### Interlocuteur non technique et mode développeur

- Des règles Cursor définissent le ton (tutoiement, français simple, sans jargon), la clarification
  systématique, le tri des demandes et des procédures par type de demande (bug, lenteur, texte ou image,
  nouvelle fonction, mise en ligne, sécurité).
- Les demandes lourdes ou risquées (base de données, connexion, secrets, nouveau service externe, version
  majeure, plus d'une dizaine de fichiers) ne sont pas codées : l'agent explique, propose une version réduite,
  inscrit l'idée dans `docs/MODULES_A_VENIR.md` et renvoie vers une personne technique.
- **Mode développeur** : le fichier local `.cursor/mode-developpeur` (non versionné, `npm run mode-dev`) ou la
  phrase « je suis dev » lève le ton simplifié, les questions systématiques, les captures et le « oui » avant
  mise en ligne. Les contraintes du projet restent : secrets, RLS, ADR, chemin `/POCMARYSE/`, CI, flux par PR.

## Alternatives envisagées

- **Garder `develop` et `main`** : les modifications s'accumulent sur `develop` sans être en ligne, ce qui
  rend les demandes invisibles et l'annulation confuse.
- **Approbation sur GitHub avant déploiement** : plus sûr, mais impose à la propriétaire d'utiliser GitHub.
- **Aperçu en ligne par demande** (autre service d'hébergement) : contredit l'ADR 0001 pour une démo.
- **Sauvegardes automatiques de la base** : écarté, le projet est une démo sans donnée critique.

## Conséquences

- La CI et le contrôle du site sont les deux barrières ; elles ne doivent jamais être désactivées ni contournées
  (hors mode développeur, et jamais pour les contraintes du projet).
- Les mises à jour automatiques sont déployées sans « oui » ni nouveau tag ; en cas de souci, le retour arrière
  restaure le dernier tag.
- GitHub désactive les tâches planifiées après 60 jours sans activité dans le dépôt : la tâche anti-pause et
  le rattrapage peuvent s'arrêter si le site n'évolue plus (voir `docs/MAINTENANCE.md`).
- Toute nouvelle décision de workflow passe par un ADR, comme avant.
