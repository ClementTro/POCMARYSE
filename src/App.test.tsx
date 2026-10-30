import { render, screen } from '@testing-library/react';
import { App } from '@/App';
import { ThemeProvider } from '@/shared/theme/ThemeProvider';

describe('App', () => {
  it('affiche le nom du produit', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Maryse & Co' })).toBeInTheDocument();
  });
});
