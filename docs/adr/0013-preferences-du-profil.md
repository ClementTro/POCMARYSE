# ADR 0013 — Langue et thème synchronisés avec le profil

- **Statut** : accepté
- **Date** : 2026-10-30

## Contexte

La langue (ADR 0007) et le thème (ADR 0008) sont mémorisés dans le `localStorage` pour s'appliquer avant le
premier rendu, y compris sur la vitrine sans compte. La table `profiles` (ADR 0003) prévoit aussi
`locale` et `theme`, pour que l'utilisatrice retrouve ses réglages sur un autre appareil. Il faut décider
quelle source l'emporte, et quand on écrit dans le profil.

## Décision

- Le `localStorage` reste la source immédiate : il évite le flash de thème et sert hors connexion.
- Dans l'application connectée, un composant `SynchroPreferences` (monté par `AppLayout`) relie les deux :
  - **à l'ouverture**, dès que le profil est lu, ses valeurs **l'emportent** sur celles de l'appareil ;
  - **ensuite**, chaque changement de langue ou de thème, depuis l'en-tête ou la page Profil, est
    enregistré dans le profil (mise à jour optimiste).
- Un changement n'est enregistré que s'il diffère de la valeur précédente **et** du profil : appliquer
  le profil à l'ouverture ne déclenche donc aucune écriture, même si `changeLanguage` est asynchrone.
- Le prénom affiché sur le tableau de bord vient de `profiles.display_name` ; tant que le profil charge, on
  se rabat sur le nom donné à l'inscription (`user_metadata.display_name`). Un prénom effacé n'est pas
  remplacé par ce repli.
- La page Profil (`/app/profil`) fait partie du `core` : ce n'est pas un module métier.

## Alternatives envisagées

- **Profil seul, sans `localStorage`** : flash de thème au chargement et vitrine sans préférence.
- **Appareil prioritaire** : un nouvel appareil écraserait les réglages du compte à la première visite.
- **Enregistrer uniquement depuis la page Profil** : les boutons de l'en-tête deviendraient des réglages
  « temporaires » annulés à la connexion suivante, ce qui serait déroutant.

## Conséquences

- Les préférences suivent l'utilisatrice d'un appareil à l'autre sans écran de réglage obligatoire.
- Si une préférence est changée avant la lecture du profil, le profil l'emporte : c'est assumé.
- Toute nouvelle préférence (taille de texte, etc.) suit le même schéma : colonne dans `profiles`
  (nouvelle migration), valeur locale, puis branchement dans `SynchroPreferences`.
