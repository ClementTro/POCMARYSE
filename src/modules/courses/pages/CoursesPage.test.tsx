import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { lundiDe, versIso } from '@/shared/lib/dates';
import type { Article, ResultatGeneration } from '../types';
import CoursesPage from './CoursesPage';

const api = vi.hoisted(() => ({
  ajouter: vi.fn(),
  cocher: vi.fn(),
  supprimer: vi.fn(),
  vider: vi.fn(),
  generer: vi.fn(),
  articles: [] as Article[],
  resultat: undefined as ResultatGeneration | undefined,
}));

vi.mock('../api', () => {
  const mutation = (mutate: () => void) => ({ mutate, isError: false, isPending: false });
  return {
    PREFIXE_PROVISOIRE: 'provisoire-',
    useArticles: () => ({ data: api.articles, isError: false, refetch: vi.fn() }),
    useAjouterArticle: () => mutation(api.ajouter),
    useCocherArticle: () => mutation(api.cocher),
    useSupprimerArticle: () => mutation(api.supprimer),
    useViderCoches: () => mutation(api.vider),
    useGenererDepuisPlanning: () => ({
      ...mutation(api.generer),
      reset: vi.fn(),
      data: api.resultat,
    }),
  };
});

const article = (id: string, name: string, extra: Partial<Article> = {}): Article => ({
  id,
  user_id: 'u1',
  name,
  quantity: null,
  unit: '',
  checked: false,
  source: 'manuel',
  created_at: '2026-10-30T10:00:00Z',
  ...extra,
});

function rendre() {
  render(
    <MemoryRouter>
      <CoursesPage />
    </MemoryRouter>,
  );
}

describe('CoursesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.resultat = undefined;
    api.articles = [
      article('a1', 'Farine', { quantity: 1.2, unit: 'kg', source: 'planning' }),
      article('a2', 'Lait', { checked: true }),
      article('a3', 'Œufs', { quantity: 6 }),
    ];
  });

  it('affiche la liste avec les quantités et ce qui reste à acheter', () => {
    rendre();
    const liste = screen.getByRole('list');
    expect(within(liste).getAllByRole('checkbox')).toHaveLength(3);
    expect(
      screen.getByRole('checkbox', { name: /Farine 1,2 kg Vient du planning/ }),
    ).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Lait' })).toBeChecked();
    expect(screen.getByText('2 articles à acheter')).toBeInTheDocument();
  });

  it('ajoute un article en saisie rapide puis vide le champ', async () => {
    rendre();
    const champ = screen.getByRole('textbox', { name: 'Ajouter un article' });
    await userEvent.type(champ, '2 kg de pommes{Enter}');
    expect(api.ajouter).toHaveBeenCalledWith({ name: 'pommes', quantity: 2, unit: 'kg' });
    expect(champ).toHaveValue('');
  });

  it('signale une saisie vide sans rien envoyer', async () => {
    rendre();
    await userEvent.click(screen.getByRole('button', { name: 'Ajouter' }));
    expect(screen.getByText(/Écris le nom de l.article/)).toBeInTheDocument();
    expect(api.ajouter).not.toHaveBeenCalled();
  });

  it('coche, retire et enlève les articles cochés', async () => {
    rendre();
    await userEvent.click(screen.getByRole('checkbox', { name: /Œufs/ }));
    expect(api.cocher).toHaveBeenCalledWith({ id: 'a3', checked: true });
    await userEvent.click(screen.getByRole('button', { name: 'Retirer Lait' }));
    expect(api.supprimer).toHaveBeenCalledWith('a2');
    await userEvent.click(screen.getByRole('button', { name: 'Enlever les articles cochés' }));
    expect(api.vider).toHaveBeenCalled();
  });

  it('ne propose pas d’enlever les cochés quand rien n’est coché', () => {
    api.articles = [article('a1', 'Farine')];
    rendre();
    expect(screen.getByRole('button', { name: 'Enlever les articles cochés' })).toBeDisabled();
  });

  it('invite à ajouter un article quand la liste est vide', () => {
    api.articles = [];
    rendre();
    expect(screen.getByText('La liste est vide')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Imprimer la liste' })).not.toBeInTheDocument();
  });

  it('prépare la liste de la semaine choisie depuis le planning', async () => {
    rendre();
    const semaine = screen.getByRole('combobox', { name: 'Semaine' });
    expect(within(semaine).getAllByRole('option')).toHaveLength(2);
    await userEvent.click(screen.getByRole('button', { name: 'Préparer la liste' }));
    expect(api.generer).toHaveBeenCalledWith(versIso(lundiDe(new Date())));
  });

  it('renvoie vers le planning quand aucun repas n’est prévu', () => {
    api.resultat = { articles: 0, repas: 0 };
    rendre();
    expect(screen.getByText(/Aucun repas n.est prévu/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ouvrir le planning' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/app\/planning\?semaine=\d{4}-\d{2}-\d{2}$/),
    );
  });
});
