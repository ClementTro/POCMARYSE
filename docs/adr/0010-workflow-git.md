# ADR 0010 — Workflow git develop / main sans validation humaine

- **Statut** : accepté
- **Date** : 2026-10-30

## Contexte

Le développement est réalisé par un agent IA, sans relecture humaine obligatoire.
Il faut malgré tout un historique lisible et une production protégée des erreurs grossières.

## Décision

- Deux branches longues : **`main`** (production, déployée) et **`develop`** (travail). Pas de branches de fonctionnalité.
- Tout le développement se fait **directement sur `develop`**, en commits atomiques au format
  **Conventional Commits** en français (types et portées listés dans `AGENTS.md`).
- La **CI** (`ci.yml`) tourne sur chaque push sur `develop` et sur chaque PR vers `main` :
  lint, typecheck, tests, build.
- **Release** à la fin de chaque jalon de la roadmap : l'agent crée une PR `develop → main`, attend la CI verte,
  merge (merge commit), pose un tag `vX.Y.Z` et met à jour `CHANGELOG.md`. Le push sur `main` déclenche `deploy.yml`.
- Versionnage **SemVer** : `0.x.0` pendant le POC, `1.0.0` quand les trois modules sont finis.

## Alternatives envisagées

- **GitHub Flow (branche par fonctionnalité + PR)** : plus de cérémonie, sans relecteur pour en profiter.
- **Push direct sur `main`** : aucune barrière entre le travail en cours et la production.

## Conséquences

- La CI est la seule barrière de qualité : elle ne doit jamais être désactivée ni contournée.
- Interdits : `push --force` sur `main`/`develop`, réécriture d'historique publié, suppression de `develop` au merge.
- Si la CI échoue sur la PR de release, on corrige sur `develop` ; on ne merge jamais une PR rouge.
