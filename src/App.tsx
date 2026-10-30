import { BrowserRouter } from 'react-router-dom';
import { Providers } from '@/core/Providers';
import { AppRoutes } from '@/core/router';
import { RemonterEnHaut } from '@/core/routing/RemonterEnHaut';

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Providers>
        <RemonterEnHaut />
        <AppRoutes />
      </Providers>
    </BrowserRouter>
  );
}
