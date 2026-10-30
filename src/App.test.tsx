import { render, screen } from '@testing-library/react';
import { App } from '@/App';

describe('App', () => {
  it('affiche la vitrine avec le nom du produit', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Navigation principale' })).toBeInTheDocument();
  });
});
