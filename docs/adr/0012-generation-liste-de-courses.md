# ADR 0012 — Génération de la liste de courses depuis le planning

- **Statut** : accepté
- **Date** : 2026-10-30

## Contexte

Le module Courses doit transformer les repas d'une semaine en liste d'achats lisible. Les recettes
stockent leurs ingrédients en JSON libre (`{ name, quantity, unit }`) : la même farine peut apparaître en
`200 g` dans une recette et en `1 kg` dans une autre, avec des majuscules, des accents ou des pluriels
différents. L'utilisatrice ajoute aussi des articles à la main (« papier essuie-tout ») qui ne doivent pas
disparaître quand elle régénère sa liste. Un module ne peut pas importer un autre module (ADR 0005).

## Décision

- **Lecture directe** : le module Courses lit `meal_plan_entries` joint à `recipes(ingredients)` dans
  Supabase pour la semaine choisie (cette semaine ou la suivante). Il a son propre lecteur du JSON
  d'ingrédients ; il n'importe ni Planning ni Recettes.
- **Regroupement** : deux ingrédients sont fusionnés si leur nom est le même une fois normalisé (sans
  accents ni casse, `œ` = `oe`, « s » final des mots de plus de 3 lettres ignoré) **et** si leurs unités
  sont compatibles :
  - masses (`mg`, `g`, `kg`) et volumes (`ml`, `cl`, `dl`, `l`) sont convertis puis additionnés ;
  - les autres unités (« pincée », « c. à soupe ») ne s'additionnent qu'entre elles, à l'identique ;
  - un ingrédient sans quantité reste dans la liste, sans quantité.
- **Affichage** : le total est exprimé dans l'unité la plus naturelle (`1,2 kg` plutôt que `1200 g`,
  `25 cl` plutôt que `250 ml`), arrondi au centième. Les unités libres d'un seul mot sont accordées
  au pluriel à partir de 2 (« 2 pincées ») ; c'est une règle française, comme les recettes de démo.
- **Régénération** : préparer la liste **remplace** les articles `source = 'planning'` (cochés ou non) et
  **garde** les articles `source = 'manuel'`. Les nouveaux articles sont insérés **avant** la suppression
  des anciens : en cas d'échec réseau, on obtient au pire des doublons, jamais une liste vide. Une semaine
  sans repas ne touche à rien.
- **Pas de mise à l'échelle des portions** : les quantités sont celles des recettes. L'ajustement des
  portions est un module à venir (`docs/MODULES_A_VENIR.md`).
- **Saisie rapide** : un seul champ, lu par `lireSaisie` (« 2 kg de pommes », « 1/2 citron », « lait »).
  Seules les unités métriques sont reconnues ; le reste fait partie du nom.

## Alternatives envisagées

- **Fusionner aussi les articles manuels avec ceux du planning** : rejeté, la régénération deviendrait
  imprévisible (impossible de savoir quelle part d'un article vient d'où sans colonne supplémentaire).
- **Supprimer puis insérer** : plus simple, mais une erreur entre les deux vide la liste.
- **Vue ou fonction SQL d'agrégation** : rejeté pour la démo, la logique reste testable en TypeScript pur
  et ne demande pas de migration.
- **Table d'unités ou dictionnaire de pluriels** : disproportionné pour un POC.

## Conséquences

- La logique de regroupement est pure (`src/modules/courses/liste.ts`, `unites.ts`) et couverte par des tests.
- Les noms proches mais différents (« pomme de terre » et « pomme de terre grenaille ») restent séparés :
  c'est voulu, l'utilisatrice achète deux produits.
- Un futur module « Ajustement des portions » devra fournir les quantités ajustées à la génération,
  par exemple via une colonne de portions sur `meal_plan_entries` (nouvelle migration).
