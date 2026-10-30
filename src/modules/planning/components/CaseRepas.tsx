import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';
import { cleCase } from '../semaine';
import type { Case, Glisse, Repas } from '../types';
import { Aimant } from './Aimant';

function RepasDeplacable({ repas }: { repas: Repas }) {
  const titre = repas.recette?.title ?? '';
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: `repas:${repas.id}`,
    data: { type: 'repas', repas, titre } satisfies Glisse,
    // Un repas pas encore confirmé par la base n'a pas d'identifiant définitif.
    disabled: repas.id.startsWith('provisoire-'),
  });
  return (
    <Aimant
      ref={setNodeRef}
      recetteId={repas.recipe_id}
      titre={titre}
      fantome={isDragging}
      compact
      className="min-w-0 flex-1 pl-2 pr-4"
      {...attributes}
      {...listeners}
    />
  );
}

interface CaseRepasProps {
  laCase: Case;
  libelle: string;
  repas?: Repas;
  onChoisir: () => void;
  onRetirer: (repas: Repas) => void;
}

export function CaseRepas({ laCase, libelle, repas, onChoisir, onRetirer }: CaseRepasProps) {
  const { t } = useTranslation('planning');
  const { setNodeRef, isOver } = useDroppable({ id: cleCase(laCase), data: { libelle } });

  return (
    <section
      ref={setNodeRef}
      aria-label={libelle}
      className={cn(
        'flex min-h-28 flex-col gap-2 rounded-fiche border-2 border-dashed p-2 transition-colors',
        isOver
          ? 'border-faience bg-faience-clair dark:border-beurre dark:bg-nuit'
          : 'border-seyes dark:border-nuit-ligne',
      )}
    >
      <h3 className="font-texte text-sm font-bold text-encre-douce dark:text-seyes">
        {t(`creneaux.${laCase.creneau}`)}
      </h3>
      {repas ? (
        <div className="relative flex">
          <RepasDeplacable repas={repas} />
          <button
            type="button"
            onClick={() => onRetirer(repas)}
            aria-label={t('case.retirer', { titre: repas.recette?.title ?? '' })}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-seyes bg-white text-encre-douce shadow-sm hover:border-vichy hover:text-vichy dark:border-nuit-ligne dark:bg-nuit dark:text-seyes"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <Button
          variante="discret"
          onClick={onChoisir}
          aria-label={t('case.choisirPour', { case: libelle })}
          className="flex-1 border border-transparent text-sm hover:border-seyes"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          {t('case.choisir')}
        </Button>
      )}
    </section>
  );
}
