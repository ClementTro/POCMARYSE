# Contribuer à Maryse & Co

Avant tout : lire [`AGENTS.md`](AGENTS.md). Ce document détaille les conventions et la procédure
d'ajout d'un module.

## Branches et commits

- On travaille sur `develop`, jamais sur `main` (voir ADR 0010).
- Format [Conventional Commits](https://www.conventionalcommits.org/fr/) en français, impératif présent :

```
<type>(<portée>): <description courte>

[corps facultatif : le pourquoi, pas le comment]
```

- Une modification logique par commit. Si la description contient « et », c'est souvent deux commits.
- Avant de commiter : `npm run lint && npm run typecheck && npm run test`.

## Conventions de code

- TypeScript strict, pas de `any` (utiliser `unknown` puis affiner).
- Composants en `PascalCase.tsx`, hooks en `useQuelqueChose.ts`, utilitaires en `camelCase.ts`.
- Import via l'alias `@/` (`@/shared/ui/Button`), pas de chemins relatifs remontant de plus d'un niveau.
- Aucun texte d'interface en dur : `t('cle')` avec la clé dans le namespace du module.
- Aucune couleur en dur : tokens Tailwind de la charte (`bg-papier`, `text-faience`…).
- Accès aux données uniquement dans le fichier `api.ts` du module, via des hooks React Query.

## Ajouter un module

Exemple avec un module fictif `favoris`.

1. **Décider** : l'idée doit figurer dans [`docs/MODULES_A_VENIR.md`](docs/MODULES_A_VENIR.md).
   Si le module introduit un choix structurant, écrire un ADR.
2. **Données** : si besoin, créer `supabase/migrations/000N_favoris.sql` avec la table, `user_id`,
   **RLS activée** et ses politiques. Mettre à jour `docs/SUPABASE_SETUP.md`.
3. **Créer le dossier** `src/modules/favoris/` :

```
src/modules/favoris/
  index.tsx
  api.ts                      hooks React Query (seul fichier qui parle à Supabase)
  types.ts
  favoris.ts                  logique pure, testée dans favoris.test.ts
  pages/FavorisPage.tsx       export default (chargée à la demande)
  components/WidgetFavoris.tsx
  i18n/fr.json
  i18n/en.json
```

4. **Déclarer le module** dans `index.tsx` :

```ts
import { lazy } from 'react';
import { Heart } from 'lucide-react';
import type { AppModule } from '@/core/types';
import { WidgetFavoris } from './components/WidgetFavoris';
import en from './i18n/en.json';
import fr from './i18n/fr.json';

const FavorisPage = lazy(() => import('./pages/FavorisPage'));

export const favorisModule: AppModule = {
  id: 'favoris',
  basePath: 'favoris',
  routes: [{ index: true, element: <FavorisPage /> }],
  navItem: { labelKey: 'favoris:nav', icon: Heart },
  i18n: { fr, en },
  dashboardWidget: WidgetFavoris, // facultatif
};
```

   Le module n'importe de `core/` que `@/core/types`, `@/core/supabase`, `@/core/database.types` et
   `@/core/auth/useAuth`, et n'importe **jamais** un autre module : s'il a besoin des recettes, il les lit
   dans Supabase (comme Courses lit le planning). ESLint fait échouer la CI sinon.
   Dans l'interface, les liens internes sont relatifs (`..`, `nouvelle`) et les filtres vivent dans l'URL.

5. **L'enregistrer** dans `src/core/moduleRegistry.ts` :

```ts
export const modules: AppModule[] = [recettesModule, planningModule, coursesModule, favorisModule];
```

   Le menu, les routes `/app/favoris/*`, les traductions et l'éventuel widget du tableau de bord sont alors
   générés automatiquement.
6. **Tester** : au moins un test unitaire sur la logique métier du module. Après avoir écrit le `fr.json`,
   lancer `npm run typo:fr` (espaces insécables).
7. **Documenter** : retirer l'idée de `MODULES_A_VENIR.md`, l'ajouter à `ROADMAP.md` et au `CHANGELOG.md`.

## Ajouter une décision (ADR)

Copier `docs/adr/0000-template.md` en `docs/adr/NNNN-titre-court.md` (numéro suivant), le remplir,
l'ajouter à l'index de `AGENTS.md`. Une décision remplacée n'est pas supprimée : son statut devient
« remplacé par ADR NNNN ».
