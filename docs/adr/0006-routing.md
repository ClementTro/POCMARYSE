# ADR 0006 — Routing : URL classiques et `404.html` de repli

- **Statut** : accepté
- **Date** : 2026-10-30

## Contexte

GitHub Pages ne sait pas réécrire les URL : ouvrir directement `/POCMARYSE/app/recettes` renvoie une 404.
Par ailleurs, les e-mails Supabase (confirmation, réinitialisation) redirigent vers une URL de l'application
en y ajoutant des paramètres (`?code=...` ou `#access_token=...`), ce qui entre en conflit avec un routeur en mode hash.

## Décision

- `BrowserRouter` avec `basename={import.meta.env.BASE_URL}` et `base: '/POCMARYSE/'` dans `vite.config.ts`.
- Après le build, `dist/index.html` est copié en `dist/404.html` (script `scripts/copy-404.mjs`).
  GitHub Pages sert ce fichier pour toute URL inconnue : l'application démarre et le routeur affiche la bonne page.
- Le client Supabase utilise le flux **PKCE** (`?code=` en query string) et `detectSessionInUrl: true`.

## Alternatives envisagées

- **`HashRouter`** (`/#/app`) : aucun repli nécessaire, mais URL moins propres et conflit avec les jetons
  Supabase placés dans le fragment.
- **Script de redirection `spa-github-pages`** : fonctionne aussi, mais plus complexe qu'une copie de fichier.

## Conséquences

- Les URL profondes répondent avec un statut HTTP 404 tout en affichant la bonne page : sans impact pour une démo
  (léger impact SEO, non prioritaire).
- Les chemins d'assets passent toujours par `import.meta.env.BASE_URL` (helper `asset()` dans `src/shared/lib/`).
