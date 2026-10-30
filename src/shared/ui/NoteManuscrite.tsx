import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

/** Annotation à la main de Maryse : quelques mots, jamais un paragraphe (ADR 0008). */
export function NoteManuscrite({
  children,
  className,
  as: Balise = 'p',
}: {
  children: ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'figcaption';
}) {
  return (
    <Balise
      className={cn('font-main text-xl leading-snug text-faience dark:text-beurre', className)}
    >
      {children}
    </Balise>
  );
}
