# ADR 0005 — Architecture modulaire et contrat `AppModule`

- **Statut** : accepté
- **Date** : 2026-10-30

## Contexte

Le POC doit démontrer qu'on peut **ajouter des fonctionnalités** sans toucher au reste de l'application.

## Décision

Chaque fonctionnalité métier est un **module** autonome dans `src/modules/<id>/` :

```
src/modules/<id>/
  index.ts          export du module (contrat AppModule)
  api.ts            accès Supabase + hooks React Query du module
  types.ts          types du domaine
  pages/            pages routées
  components/       composants propres au module
  i18n/fr.json      traductions (namespace = id du module)
  i18n/en.json
```

Contrat (défini dans `src/core/types.ts`) :

```ts
export interface AppModule {
  id: string;                     // identifiant et namespace i18n
  basePath: string;               // ex. 'recettes' (relatif à /app)
  routes: RouteObject[];          // routes relatives à basePath
  navItem: { labelKey: string; icon: LucideIcon };
  i18n: { fr: Record<string, unknown>; en: Record<string, unknown> };
  dashboardWidget?: React.ComponentType;
}
```

`src/core/moduleRegistry.ts` exporte `modules: AppModule[]`. À partir de ce tableau sont générés :
les routes de `/app`, le menu de navigation, l'enregistrement des traductions et les widgets du tableau de bord.

## Alternatives envisagées

- **Découpage par type de fichier** (`pages/`, `components/`, `services/` globaux) : simple au début,
  mais l'ajout d'une fonctionnalité touche partout.
- **Micro-frontends / chargement dynamique de plugins** : surdimensionné pour un POC.

## Conséquences

- Ajouter un module = créer son dossier + une ligne dans le registre (procédure dans `CONTRIBUTING.md`).
- Un module n'importe jamais un autre module ; le code partagé va dans `src/shared/`.
- Les idées de modules sont tenues dans `docs/MODULES_A_VENIR.md`.
