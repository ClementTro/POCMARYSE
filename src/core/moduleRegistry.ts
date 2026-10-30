import { enregistrerTraductions } from '@/i18n';
import { coursesModule } from '@/modules/courses';
import { planningModule } from '@/modules/planning';
import { recettesModule } from '@/modules/recettes';
import type { AppModule } from './types';

/**
 * Modules actifs de l'application. Ajouter un module = l'importer ici (voir CONTRIBUTING.md).
 * Les routes, le menu, les traductions et les widgets du tableau de bord en sont dérivés.
 */
export const modules: AppModule[] = [recettesModule, planningModule, coursesModule];

for (const module of modules) {
  enregistrerTraductions(module.id, module.i18n.fr, module.i18n.en);
}
