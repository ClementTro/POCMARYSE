import { lazy } from 'react';
import { ShoppingBasket } from 'lucide-react';
import type { AppModule } from '@/core/types';
import { WidgetCourses } from './components/WidgetCourses';
import en from './i18n/en.json';
import fr from './i18n/fr.json';

const CoursesPage = lazy(() => import('./pages/CoursesPage'));

export const coursesModule: AppModule = {
  id: 'courses',
  basePath: 'courses',
  routes: [{ index: true, element: <CoursesPage /> }],
  navItem: { labelKey: 'courses:nav', icon: ShoppingBasket },
  i18n: { fr, en },
  dashboardWidget: WidgetCourses,
};
