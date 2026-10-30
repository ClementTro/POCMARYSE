import { lazy } from 'react';
import { useRoutes, type RouteObject } from 'react-router-dom';
import { AppLayout } from '@/core/layouts/AppLayout';
import { PublicLayout } from '@/core/layouts/PublicLayout';
import { modules } from '@/core/moduleRegistry';
import { PageIntrouvable } from '@/core/pages/PageIntrouvable';
import { ProtectedRoute } from '@/core/routing/ProtectedRoute';
import { RedirigerSiConnecte } from '@/core/routing/RedirigerSiConnecte';

const AccueilPage = lazy(() => import('@/vitrine/pages/AccueilPage'));
const HistoirePage = lazy(() => import('@/vitrine/pages/HistoirePage'));
const FonctionnalitesPage = lazy(() => import('@/vitrine/pages/FonctionnalitesPage'));
const MentionsLegalesPage = lazy(() => import('@/vitrine/pages/MentionsLegalesPage'));
const ConfidentialitePage = lazy(() => import('@/vitrine/pages/ConfidentialitePage'));
const ConnexionPage = lazy(() => import('@/vitrine/pages/ConnexionPage'));
const InscriptionPage = lazy(() => import('@/vitrine/pages/InscriptionPage'));
const MotDePasseOubliePage = lazy(() => import('@/vitrine/pages/MotDePasseOubliePage'));
const NouveauMotDePassePage = lazy(() => import('@/vitrine/pages/NouveauMotDePassePage'));
const TableauDeBordPage = lazy(() =>
  import('@/core/pages/TableauDeBordPage').then((m) => ({ default: m.TableauDeBordPage })),
);
const ProfilPage = lazy(() =>
  import('@/core/pages/ProfilPage').then((m) => ({ default: m.ProfilPage })),
);

const routes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <AccueilPage /> },
      { path: 'histoire', element: <HistoirePage /> },
      { path: 'fonctionnalites', element: <FonctionnalitesPage /> },
      { path: 'mentions-legales', element: <MentionsLegalesPage /> },
      { path: 'confidentialite', element: <ConfidentialitePage /> },
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
          { path: 'profil', element: <ProfilPage /> },
          { path: '*', element: <PageIntrouvable /> },
        ],
      },
    ],
  },
];

export function AppRoutes() {
  return useRoutes(routes);
}
