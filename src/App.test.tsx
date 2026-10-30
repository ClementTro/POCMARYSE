import { render, screen } from '@testing-library/react';
import { App } from '@/App';

describe('App', () => {
  it('affiche le nom du produit', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Maryse & Co' })).toBeInTheDocument();
  });
});
