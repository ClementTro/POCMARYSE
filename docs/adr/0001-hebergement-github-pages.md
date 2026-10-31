# ADR 0001 — Hébergement du front sur GitHub Pages

- **Statut** : accepté
- **Date** : 2026-10-30

## Contexte

Maryse & Co est un POC destiné à être montré facilement, sans coût d'hébergement ni infrastructure à maintenir.
Le repo est public sur GitHub.

## Décision

Le front est publié sur **GitHub Pages** à l'adresse `https://<propriétaire>.github.io/POCMARYSE/`,
déployé par une GitHub Action (`.github/workflows/deploy.yml`) à chaque push sur `main`.
La source Pages est configurée en mode « GitHub Actions ».

## Alternatives envisagées

- **Netlify / Vercel** : plus de fonctionnalités (fonctions serverless, redirections), mais un service de plus
  à configurer et à lier ; non nécessaire pour un POC.
- **Hébergement maison** : coût et maintenance injustifiés.

## Conséquences

- Le site est **100 % statique** : pas de SSR, pas de code serveur, pas de réécriture d'URL côté serveur.
- Tout ce qui est envoyé au navigateur est public : **aucun secret** (voir ADR 0009).
- Le site est servi sous le sous-chemin `/POCMARYSE/` : `base` Vite et `basename` du routeur obligatoires.
- Le rafraîchissement d'une URL profonde nécessite un `404.html` de repli (voir ADR 0006).
- Le backend doit être un service externe (voir ADR 0003).
