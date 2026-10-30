import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

interface FicheProps extends HTMLAttributes<HTMLElement> {
  /** Réglure de fiche bristol (lignes bleues). */
  lignee?: boolean;
  as?: 'article' | 'section' | 'div' | 'li';
}

/** Fiche cartonnée : support des recettes et des encarts de l'application. */
export function Fiche({ lignee = false, as: Balise = 'article', className, ...props }: FicheProps) {
  return (
    <Balise
      className={cn(
        'rounded-fiche border-t-[3px] border-vichy bg-white shadow-fiche dark:bg-nuit-carte',
        lignee && 'fiche-lignee',
        className,
      )}
      {...props}
    />
  );
}
