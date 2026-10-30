import { useEffect } from 'react';

const MARQUE = 'Maryse & Co';

export function useTitrePage(titre?: string) {
  useEffect(() => {
    document.title = titre ? `${titre} | ${MARQUE}` : MARQUE;
  }, [titre]);
}
