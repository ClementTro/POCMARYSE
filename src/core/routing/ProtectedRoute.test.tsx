import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { AuthContexte, type AuthContexteValeur } from '@/core/auth/authContext';
import { ProtectedRoute } from './ProtectedRoute';

function rendre(valeur: Partial<AuthContexteValeur>) {
  const contexte: AuthContexteValeur = {
    configure: true,
    session: null,
    utilisateur: null,
    chargement: false,
    dernierEvenement: null,
    deconnecter: async () => {},
    ...valeur,
  };
  render(
    <AuthContexte.Provider value={contexte}>
      <MemoryRouter initialEntries={['/app/recettes']}>
        <Routes>
          <Route path="/connexion" element={<p>page de connexion</p>} />
          <Route path="/app" element={<ProtectedRoute />}>
            <Route path="recettes" element={<p>contenu protégé</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContexte.Provider>,
  );
}

describe('ProtectedRoute', () => {
  it('redirige vers la connexion sans session', () => {
    rendre({ session: null });
    expect(screen.getByText('page de connexion')).toBeInTheDocument();
  });

  it('affiche le contenu avec une session', () => {
    rendre({ session: { access_token: 'x' } as Session });
    expect(screen.getByText('contenu protégé')).toBeInTheDocument();
  });

  it('affiche un chargement tant que la session est inconnue', () => {
    rendre({ chargement: true });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('signale un backend non configuré', () => {
    rendre({ configure: false });
    expect(screen.getByRole('heading', { name: /pas encore relié/ })).toBeInTheDocument();
  });
});
