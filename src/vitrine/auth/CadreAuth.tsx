import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/core/auth/useAuth';
import { Message } from '@/shared/ui/Message';
import { NoteManuscrite } from '@/shared/ui/NoteManuscrite';

export function CadreAuth({
  titre,
  note,
  children,
  pied,
}: {
  titre: string;
  note?: string;
  children: ReactNode;
  pied?: ReactNode;
}) {
  const { t } = useTranslation();
  const { configure } = useAuth();

  return (
    <div className="papier-seyes px-4 py-12 sm:py-20">
      <div className="mx-auto flex max-w-md flex-col gap-6 rounded-fiche border-t-[3px] border-vichy bg-white p-6 shadow-fiche sm:p-8 dark:bg-nuit-carte">
        <div>
          <h1 className="text-3xl">{titre}</h1>
          {note && <NoteManuscrite className="mt-2 -rotate-1">{note}</NoteManuscrite>}
        </div>
        {configure ? children : <Message>{t('backend.texte')}</Message>}
        {pied && (
          <div className="border-t border-seyes pt-4 text-sm dark:border-nuit-ligne">{pied}</div>
        )}
      </div>
    </div>
  );
}
