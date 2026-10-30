import type { ReactNode } from 'react';

export function EtatVide({
  titre,
  texte,
  action,
}: {
  titre: string;
  texte?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-fiche border-2 border-dashed border-seyes px-6 py-8 dark:border-nuit-ligne">
      <h2 className="text-2xl">{titre}</h2>
      {texte && <p className="max-w-lecture text-encre-douce dark:text-seyes">{texte}</p>}
      {action}
    </div>
  );
}
