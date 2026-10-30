# ADR 0008 — Thème clair/sombre et charte « cahier de cuisine »

- **Statut** : accepté
- **Date** : 2026-10-30

## Contexte

Le porteur du projet veut un design très « mère au foyer » : chaleureux, familial, rassurant.
Il faut éviter le rendu générique des applications SaaS (cartes grises identiques, dégradés, libellés en capitales).

## Décision

Direction **« cahier de cuisine familial français »** : page de cahier à grands carreaux (Seyès), vaisselle en
faïence bleue, nappe vichy, annotations manuscrites.

### Couleurs (tokens Tailwind)

| Token | Hex | Usage |
|---|---|---|
| `papier` | `#FDFCF7` | fond |
| `seyes` | `#B9CBE4` | lignes du cahier, bordures |
| `faience` | `#2F5D8C` | titres, boutons principaux, liens |
| `vichy` | `#C9463D` | marge du cahier, accents ponctuels, erreurs |
| `beurre` | `#F2D16B` | surlignage, badges |
| `sauge` | `#7E9C7A` | validations, éléments cochés |
| `encre` | `#23324A` | texte courant |

Thème sombre (« cuisine le soir ») : fond bleu nuit `#16233A`, cartes crème atténuées, lignes Seyès assombries.
Activé par la classe `dark` sur `<html>` ; préférence système par défaut, choix manuel mémorisé.

### Typographie

- **Young Serif** : titres.
- **Nunito** : texte courant et interface.
- **Kalam** : annotations manuscrites uniquement (notes de Maryse, petites mentions), jamais pour un paragraphe.

### Principes

- **Un seul élément signature par page.** Sur l'accueil : la photo de Maryse scotchée sur une page Seyès,
  avec une note manuscrite.
- Les recettes sont des **fiches cartonnées**, le planning un **tableau de frigo**, les courses un **bloc-notes**
  (articles barrés quand ils sont cochés).
- Pas de dégradés décoratifs, pas de libellés en capitales, pas d'animations d'apparition sur chaque section.
- Rayons d'arrondi différenciés selon la hiérarchie (fiches légèrement arrondies, boutons plus ronds).
- Accessibilité : focus visible (anneau `faience`), contrastes AA, `prefers-reduced-motion` respecté, responsive mobile.

## Alternatives envisagées

- **Crème + terracotta + serif** : déjà vu partout, ne raconte pas l'univers du cahier de famille.
- **Kit de composants générique** : contraire à l'objectif de démo mémorable.

## Conséquences

- Les composants partagés (`src/shared/ui/`) encodent la charte ; les modules ne définissent pas de couleurs en dur.
- Toute nouvelle couleur passe par un token et une mise à jour de cet ADR.
