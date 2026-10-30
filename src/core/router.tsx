import { lazy } from 'react';
import { useRoutes, type RouteObject } from 'react-router-dom';
import { AppLayout } from '@/core/layouts/AppLayout';
import { PublicLayout } from '@/core/layouts/PublicLayout';
import { modules } from '@/core/moduleRegistry';
import { PageIntrouvable } from '@/core/pages/PageIntrouvable';
import { ProtectedRoute } from '@/core/routing/ProtectedRoute';
import { RedirigerSiConnecte } from '@/core/routing/RedirigerSiConnecte';

const AccueilPage = lazy(() => import('@/vitrine/pages/AccueilPage'));
const ConnexionPage = lazy(() => import('@/vitrine/pages/ConnexionPage'));
const InscriptionPage = lazy(() => import('@/vitrine/pages/InscriptionPage'));
const MotDePasseOubliePage = lazy(() => import('@/vitrine/pages/MotDePasseOubliePage'));
const NouveauMotDePassePage = lazy(() => import('@/vitrine/pages/NouveauMotDePassePage'));
const TableauDeBordPage = lazy(() =>
  import('@/core/pages/TableauDeBordPage').then((m) => ({ default: m.TableauDeBordPage })),
);

const routes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <AccueilPage /> },
      {
        element: <RedirigerSiConnecte />,
        children: [
          { path: 'connexion', element: <ConnexionPage /> },
          { path: 'inscription', element: <InscriptionPage /> },
        ],
      },
      { path: 'mot-de-passe-oublie', element: <MotDePasseOubliePage /> },
      { path: 'nouveau-mot-de-passe', element: <NouveauMotDePassePage /> },
      { path: '*', element: <PageIntrouvable /> },
    ],
  },
  {
    path: 'app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <TableauDeBordPage /> },
          ...modules.map((module) => ({ path: module.basePath, children: module.routes })),
          { path: '*', element: <PageIntrouvable /> },
        ],
      },
    ],
  },
];

export function AppRoutes() {
  return useRoutes(routes);
}
