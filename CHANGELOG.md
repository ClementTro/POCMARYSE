# Changelog

Toutes les évolutions notables du projet sont consignées ici.
Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versionnage [SemVer](https://semver.org/lang/fr/).

## [Non publié]

### Modifié

- L'assistant de Cursor suit des consignes plus courtes, avec les mêmes précautions : il pose des questions,
  analyse avant de corriger et demande ton accord avant de mettre en ligne, pour tout le monde.
- Seuls les correctifs de sécurité sont appliqués automatiquement ; les autres mises à jour se font à la demande.
- Le guide pour l'association tient sur une page.

### Retiré

- Le mode développeur et les commandes `/publier`, `/annuler`, `/diagnostic` : il suffit d'écrire sa demande
  avec ses mots.

## [1.1.1] - 2026-10-31

### Modifié

- Essai du nouveau circuit de mise en ligne (aucun changement visible sur le site).

## [1.1.0] - 2026-10-31

### Ajouté

- Mise en ligne en une seule commande (`npm run publier`) : vérifications, fusion, déploiement, contrôle du site
  et numéro de version, avec un message simple à la moindre difficulté.
- Contrôle automatique du site après chaque mise en ligne. S'il détecte un problème, la dernière version
  saine est remise en ligne toute seule.
- `npm run annuler` (retour à la version précédente) et `npm run diagnostic` (état du site, en lecture seule).
- Mises à jour automatiques des dépendances (Dependabot), regroupées et fusionnées quand tout est vert.
- Réveil hebdomadaire du projet Supabase pour éviter sa mise en pause (migration `0002_ping.sql` à appliquer).
- Règles pour l'assistant de Cursor : il tutoie, parle simplement, pose des questions avant d'agir, trie les demandes
  et suit une procédure par type de demande ; mode développeur pour tout lever.
- Documentation : `docs/MAINTENANCE.md`, `docs/GUIDE_ASSOCIATION.md`, `docs/SCENARIOS_AGENT.md`, ADR 0014.

### Modifié

- Une branche par demande (`demande/<sujet>`) à la place de `develop` ; `main` est protégée (ADR 0014, qui remplace l'ADR 0010).
- Les mentions légales et la documentation ne citent plus le nom du dépôt.

## [1.0.1] - 2026-10-31

### Ajouté

- Photos de Maryse sur l'accueil et la page « Histoire » (publiées avec consentement, ADR 0011).
- Site en ligne relié au projet Supabase : inscription, connexion et modules utilisables.

## [1.0.0] - 2026-10-30

### Ajouté

- Page Profil : prénom affiché, langue, thème (clair, sombre ou celui de l'appareil), adresse du compte
  et lien de changement de mot de passe.
- Langue et thème synchronisés avec le profil Supabase : retrouvés sur tous les appareils, et chaque
  changement fait depuis l'en-tête est enregistré (ADR 0013).
- Tableau de bord complet : widget « L'idée du jour » (une recette du carnet par jour), menu du jour
  et courses restantes ; salutation avec le prénom du profil.
- Tests du tableau de bord, de la page Profil et de la synchronisation des préférences.
- README avec captures d'écran ; guide de contribution aligné sur les conventions du code.

### Corrigé

- Contraste AA du repère « Aujourd'hui » du planning en thème clair.
- En-têtes sans débordement horizontal jusqu'à 320 px de large (monogramme seul dans l'application
  sous 380 px, boutons de la vitrine qui passent à la ligne d'un bloc).

## [0.3.0] - 2026-10-30

### Ajouté

- Module Recettes : liste avec recherche sans accents et filtres (étiquette, temps, difficulté,
  origine) conservés dans l'URL, fiche cartonnée, création / modification / suppression,
  copie des recettes de Maryse dans son carnet, impression.
- Module Planning : semaine du lundi au dimanche, midi et soir, recettes posées comme des aimants
  par glisser-déposer (souris, toucher, clavier case par case avec annonces pour lecteurs d'écran),
  échange de deux repas, choix dans une liste en alternative, navigation entre semaines,
  mises à jour optimistes. Widget « Au menu aujourd'hui » pour le tableau de bord.
- Module Courses : liste en bloc-notes préparée depuis les repas de cette semaine ou de la suivante,
  ingrédients regroupés et additionnés (g/kg, ml/cl/l convertis), articles ajoutés à la main conservés,
  saisie rapide en une ligne (« 2 kg de pommes »), articles barrés une fois cochés, retrait des articles
  cochés, impression de ce qui reste à acheter. Widget « Les courses » pour le tableau de bord (ADR 0012).
- Champs à libellé masqué et message d'erreur de chargement avec « Réessayer » dans `shared/ui`.
- Utilitaires de dates locales partagés (`shared/lib/dates.ts`).
- Règles de dépendance entre couches vérifiées par ESLint.
- Vérification de l'encodage UTF-8 de tous les fichiers dans `npm run lint`, y compris le texte
  encodé deux fois (accents remplacés par deux caractères parasites).

### Corrigé

- En-tête de l'application sur mobile (logo sur une ligne, bouton de déconnexion visible).
- Les listes gardent leurs données affichées quand une relecture échoue.
- Créneaux « Midi » et « Soir » du planning sans capitales, conformément à la charte.

## [0.2.0] - 2026-10-30

### Ajouté

- Design system « cahier de cuisine » : papier Seyès, bleu faïence, vichy, fiches bristol,
  photos scotchées, notes manuscrites ; thème clair, sombre ou système, appliqué avant le premier rendu.
- Interface en français et en anglais, langue détectée puis mémorisée.
- Registre des modules (`AppModule`), layouts public et application, routes protégées.
- Client Supabase typé (PKCE), fournisseur de session, écran « Backend non configuré ».
- Migration SQL : profils, recettes, planning, courses, RLS sur chaque table ; 20 recettes de démo.
- Inscription, connexion, mot de passe oublié, nouveau mot de passe, déconnexion.
- Pages vitrine : accueil, histoire de Maryse, fonctionnalités, mentions légales, confidentialité.
- Script `npm run typo:fr` pour les espaces insécables de la typographie française.

### Corrigé

- Fond du thème sombre appliqué sur `body`.
- Largeur du bouton de changement de thème.

## [0.1.0] - 2026-10-30

### Ajouté

- Initialisation du dépôt, branches `main` et `develop`, GitHub Pages en mode Actions.
- `AGENTS.md`, registre des décisions d'architecture (ADR 0001 à 0011), README, guide de contribution,
  roadmap, liste des modules à venir, règles Cursor.
- Squelette Vite 8 + React 18 + TypeScript strict + Tailwind 3.4 avec les tokens de la charte.
- ESLint, Prettier, Vitest et Testing Library.
- Copie de `index.html` en `404.html` au build pour les routes profondes.
- CI (formatage, lint, types, tests, build) sur `develop` et les PR vers `main`.
- Déploiement automatique sur GitHub Pages depuis `main`.
