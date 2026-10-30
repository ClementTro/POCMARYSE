import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/core/auth/useAuth';
import { Chargement } from '@/shared/ui/Chargement';

/** Pages de connexion / inscription : une utilisatrice déjà connectée va directement à l'app. */
export function RedirigerSiConnecte() {
  const { session, chargement } = useAuth();
  if (chargement) return <Chargement />;
  if (session) return <Navigate to="/app" replace />;
  return <Outlet />;
}
