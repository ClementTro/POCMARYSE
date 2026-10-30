import { lazy } from 'react';
import { BookOpen } from 'lucide-react';
import type { AppModule } from '@/core/types';
import en from './i18n/en.json';
import fr from './i18n/fr.json';

const ListeRecettesPage = lazy(() => import('./pages/ListeRecettesPage'));
const FicheRecettePage = lazy(() => import('./pages/FicheRecettePage'));
const EditionRecettePage = lazy(() => import('./pages/EditionRecettePage'));

export const recettesModule: AppModule = {
  id: 'recettes',
  basePath: 'recettes',
  routes: [
    { index: true, element: <ListeRecettesPage /> },
    { path: 'nouvelle', element: <EditionRecettePage /> },
    { path: ':id', element: <FicheRecettePage /> },
    { path: ':id/modifier', element: <EditionRecettePage /> },
  ],
  navItem: { labelKey: 'recettes:nav', icon: BookOpen },
  i18n: { fr, en },
};
