import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { RouteObject } from 'react-router-dom';

type Traductions = Record<string, unknown>;

/** Contrat d'un module métier (ADR 0005). */
export interface AppModule {
  /** Identifiant unique, utilisé aussi comme namespace i18n. */
  id: string;
  /** Segment d'URL sous `/app` (ex. `recettes` pour `/app/recettes`). */
  basePath: string;
  /** Routes relatives à `basePath`. */
  routes: RouteObject[];
  navItem: { labelKey: string; icon: LucideIcon };
  i18n: { fr: Traductions; en: Traductions };
  dashboardWidget?: ComponentType;
}
