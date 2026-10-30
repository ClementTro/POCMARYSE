# Modules à venir

Idées de modules pour démontrer l'extensibilité de Maryse & Co. **Aucun n'est à coder sans décision explicite.**
Pour en réaliser un : suivre la procédure « Ajouter un module » de [`CONTRIBUTING.md`](../CONTRIBUTING.md),
puis retirer l'entrée de ce fichier.

Chaque entrée précise ce que le module apporte, ce qu'il démontre techniquement et ses dépendances.

## Ajustement des portions

- **Pour l'utilisatrice** : choisir le nombre de personnes sur une fiche recette ; les quantités sont recalculées.
- **Démontre** : logique métier pure et testable, état local.
- **Dépend de** : Recettes.

## Mode cuisine

- **Pour l'utilisatrice** : affichage étape par étape en plein écran, gros caractères, écran maintenu allumé,
  minuteurs intégrés aux étapes.
- **Démontre** : Wake Lock API, minuteurs, navigation clavier / tactile.
- **Dépend de** : Recettes.

## Favoris et notes

- **Pour l'utilisatrice** : marquer une recette en favori, y ajouter une note personnelle (« un peu moins de sel »).
- **Démontre** : nouvelle table Supabase avec RLS, mises à jour optimistes React Query.
- **Dépend de** : Recettes.

## Garde-manger

- **Pour l'utilisatrice** : noter ce qu'il y a dans les placards ; l'application propose les recettes réalisables
  et retire ces ingrédients de la liste de courses.
- **Démontre** : rapprochement de données entre domaines, algorithme de correspondance.
- **Dépend de** : Recettes, Courses.

## Import / export

- **Pour l'utilisatrice** : exporter son carnet en JSON, importer celui d'une amie.
- **Démontre** : validation `zod` de fichiers, téléchargement et lecture de fichiers côté navigateur.
- **Dépend de** : Recettes.

## Nutrition

- **Pour l'utilisatrice** : valeurs nutritionnelles estimées par recette et bilan de la semaine en graphiques.
- **Démontre** : graphiques, agrégations, éventuelle API publique (Open Food Facts).
- **Dépend de** : Recettes, Planning.

## Recette au hasard

- **Pour l'utilisatrice** : « Je ne sais pas quoi faire ce soir » → une recette tirée au sort selon des filtres
  (temps disponible, tags), ajoutable au planning en un clic.
- **Démontre** : module minimal, idéal comme exemple de création de module en démo live.
- **Dépend de** : Recettes, Planning.

## Application installable (PWA)

- **Pour l'utilisatrice** : installer Maryse & Co sur son téléphone, consulter ses recettes et sa liste de
  courses sans réseau.
- **Démontre** : service worker, cache hors ligne, manifeste.
- **Dépend de** : tous les modules (transverse, plutôt une évolution du `core`).

## Partage familial

- **Pour l'utilisatrice** : inviter les membres du foyer à partager le même planning et la même liste de courses.
- **Démontre** : modèle multi-utilisateur (table `households`), RLS par appartenance, temps réel Supabase.
- **Dépend de** : Planning, Courses.
