import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { Repas } from '../types';
import PlanningPage from './PlanningPage';

const api = vi.hoisted(() => ({
  placer: vi.fn(),
  deplacer: vi.fn(),
  retirer: vi.fn(),
  repas: [] as Repas[],
}));

vi.mock('../api', () => {
  const mutation = (mutate: () => void) => ({ mutate, isError: false });
  return {
    useSemaine: () => ({ data: api.repas, isError: false, refetch: vi.fn() }),
    useRecettesPlanifiables: () => ({
      data: [
        { id: 'r1', title: 'Gratin dauphinois', prep_minutes: 20, cook_minutes: 60 },
        { id: 'r2', title: 'Crème renversée', prep_minutes: 15, cook_minutes: 30 },
      ],
      isError: false,
    }),
    usePlacerRecette: () => mutation(api.placer),
    useDeplacerRepas: () => mutation(api.deplacer),
    useRetirerRepas: () => mutation(api.retirer),
  };
});

function rendre(url = '/?semaine=2026-10-28') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <PlanningPage />
    </MemoryRouter>,
  );
}

describe('PlanningPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.repas = [
      {
        id: 'p1',
        plan_date: '2026-10-27',
        slot: 'soir',
        recipe_id: 'r1',
        recette: { id: 'r1', title: 'Gratin dauphinois', prep_minutes: 20, cook_minutes: 60 },
      },
    ];
  });

  it('affiche la semaine demandée (ramenée au lundi) avec 14 cases', () => {
    rendre();
    expect(screen.getByText(/26.*octobre.*1.*novembre 2026/)).toBeInTheDocument();
    expect(screen.getAllByRole('region', { name: /, (Midi|Soir)$/ })).toHaveLength(14);
    const mardiSoir = screen.getByRole('region', { name: 'mardi 27 octobre, Soir' });
    expect(within(mardiSoir).getByText('Gratin dauphinois')).toBeInTheDocument();
  });

  it('choisit une recette dans la liste pour une case vide', async () => {
    rendre();
    await userEvent.click(
      screen.getByRole('button', { name: 'Choisir une recette pour jeudi 29 octobre, Midi' }),
    );
    const dialogue = screen.getByRole('dialog', { name: 'Choisir une recette' });
    await userEvent.type(within(dialogue).getByRole('searchbox'), 'creme');
    expect(within(dialogue).queryByText('Gratin dauphinois')).not.toBeInTheDocument();
    await userEvent.click(within(dialogue).getByRole('button', { name: 'Crème renversée' }));

    expect(api.placer).toHaveBeenCalledWith({
      cible: { date: '2026-10-29', creneau: 'midi' },
      recette: expect.objectContaining({ id: 'r2' }),
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('retire un repas', async () => {
    rendre();
    await userEvent.click(screen.getByRole('button', { name: 'Retirer Gratin dauphinois' }));
    expect(api.retirer).toHaveBeenCalledWith(expect.objectContaining({ id: 'p1' }));
  });

  it('passe à la semaine suivante puis revient à la semaine courante', async () => {
    rendre();
    await userEvent.click(screen.getByRole('button', { name: 'Semaine suivante' }));
    expect(screen.getByText(/^2\D+8 novembre 2026$/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cette semaine' }));
    expect(screen.queryByRole('button', { name: 'Cette semaine' })).not.toBeInTheDocument();
  });
});
