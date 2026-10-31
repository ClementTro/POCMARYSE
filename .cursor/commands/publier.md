# Mettre en ligne

Applique `procedure-mise-en-ligne.mdc` pour la demande en cours :

1. Vérifie la branche `demande/<sujet>`, que tout est enregistré et que « Non publié » du `CHANGELOG.md` est rempli.
2. Lance `npm run publier -- --a-blanc`.
3. Montre les captures d'écran, puis demande « Je mets en ligne ? ».
4. Sur un « oui » explicite seulement : `npm run publier -- --type patch` (texte, image, problème) ou `--type minor` (nouvelle fonction).
5. Rends compte en trois blocs : ce que j'ai fait, ce que tu verras, comment annuler.
