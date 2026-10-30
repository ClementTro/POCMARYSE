import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/core/auth/useAuth';
import { BackendNonConfigurePage } from '@/core/pages/BackendNonConfigurePage';
import { Chargement } from '@/shared/ui/Chargement';

/** Protège `/app` : redirige vers la connexion en mémorisant la page demandée (ADR 0004). */
export function ProtectedRoute() {
  const { configure, session, chargement } = useAuth();
  const location = useLocation();

  if (!configure) return <BackendNonConfigurePage />;
  if (chargement) return <Chargement className="min-h-screen" />;
  if (!session) {
    return <Navigate to="/connexion" replace state={{ depuis: location.pathname }} />;
  }
  return <Outlet />;
}
