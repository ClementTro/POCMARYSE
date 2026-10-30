import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

const COULEURS = ['bg-vichy', 'bg-beurre', 'bg-sauge', 'bg-faience'] as const;

/** Même recette, même couleur d'aimant, d'une semaine à l'autre. */
function couleurDe(id: string): string {
  let somme = 0;
  for (const caractere of id) somme = (somme + caractere.charCodeAt(0)) % COULEURS.length;
  return COULEURS[somme] ?? COULEURS[0];
}

interface AimantProps extends HTMLAttributes<HTMLDivElement> {
  recetteId: string;
  titre: string;
  enMain?: boolean;
  fantome?: boolean;
  /** Dans une case de la grille : plus petit, sur trois lignes. */
  compact?: boolean;
}

/** Étiquette aimantée posée sur le tableau du frigo. */
export const Aimant = forwardRef<HTMLDivElement, AimantProps>(function Aimant(
  { recetteId, titre, enMain, fantome, compact, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex min-h-11 cursor-grab touch-none select-none items-center rounded-sm bg-white px-3 pb-2 pt-3 shadow-fiche dark:bg-papier dark:text-encre',
        enMain && 'rotate-2 cursor-grabbing shadow-lg',
        fantome && 'opacity-40',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full shadow-scotch',
          couleurDe(recetteId),
        )}
      />
      <span
        className={cn(
          'font-main leading-tight [hyphens:auto]',
          compact ? 'line-clamp-3 text-sm xl:text-base' : 'line-clamp-2 text-base',
        )}
      >
        {titre}
      </span>
    </div>
  );
});
