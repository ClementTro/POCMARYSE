import { lazy } from 'react';
import { CalendarDays } from 'lucide-react';
import type { AppModule } from '@/core/types';
import { WidgetPlanning } from './components/WidgetPlanning';
import en from './i18n/en.json';
import fr from './i18n/fr.json';

const PlanningPage = lazy(() => import('./pages/PlanningPage'));

export const planningModule: AppModule = {
  id: 'planning',
  basePath: 'planning',
  routes: [{ index: true, element: <PlanningPage /> }],
  navItem: { labelKey: 'planning:nav', icon: CalendarDays },
  i18n: { fr, en },
  dashboardWidget: WidgetPlanning,
};
