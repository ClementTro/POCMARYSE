import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { versRecette } from '../recettes';
import ListeRecettesPage from './ListeRecettesPage';

const recettes = [
  versRecette({
    id: 'demo-1',
    user_id: null,
    title: 'Gratin dauphinois',
    description: '',
    servings: 6,
    prep_minutes: 20,
    cook_minutes: 60,
    difficulty: 'facile',
    tags: ['four'],
    ingredients: [{ name: 'pomme de terre', quantity: 1.2, unit: 'kg' }],
    steps: ['Cuire.'],
    image_url: null,
    created_at: '',
    updated_at: '',
  }),
  versRecette({
    id: 'mienne-1',
    user_id: 'u1',
    title: 'Crème renversée',
    description: 'Celle de mamie',
    servings: 4,
    prep_minutes: 15,
    cook_minutes: 10,
    difficulty: 'moyen',
    tags: ['dessert'],
    ingredients: [],
    steps: [],
    image_url: null,
    created_at: '',
    updated_at: '',
  }),
];

const etatRequete = vi.hoisted(() => ({ valeur: {} as Record<string, unknown> }));

vi.mock('../api', () => ({ useRecettes: () => etatRequete.valeur }));

function rendre(url = '/') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <ListeRecettesPage />
    </MemoryRouter>,
  );
}

describe('ListeRecettesPage', () => {
  beforeEach(() => {
    etatRequete.valeur = { data: recettes, isPending: false, isError: false, refetch: vi.fn() };
  });

  it('affiche toutes les recettes et signale celles de Maryse', () => {
    rendre();
    expect(screen.getByText('2 recettes')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Gratin dauphinois' })).toHaveAttribute(
      'href',
      '/demo-1',
    );
    expect(screen.getAllByText('Recette de Maryse')).toHaveLength(1);
  });

  it('filtre en tapant, sans tenir compte des accents', async () => {
    rendre();
    await userEvent.type(screen.getByRole('searchbox', { name: 'Chercher' }), 'creme');
    expect(screen.getByText('1 recette')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Gratin dauphinois' })).not.toBeInTheDocument();
  });

  it('lit les filtres depuis l’URL et permet de les effacer', async () => {
    rendre('/?difficulte=difficile');
    expect(screen.getByText('Aucune recette ne correspond')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Effacer les filtres' }));
    expect(screen.getByText('2 recettes')).toBeInTheDocument();
  });

  it('propose de réessayer en cas d’erreur', async () => {
    const refetch = vi.fn();
    etatRequete.valeur = { data: undefined, isPending: false, isError: true, refetch };
    rendre();
    await userEvent.click(screen.getByRole('button', { name: 'Réessayer' }));
    expect(refetch).toHaveBeenCalledOnce();
  });
});
