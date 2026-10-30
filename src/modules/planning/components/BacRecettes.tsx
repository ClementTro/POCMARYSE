import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import { ChampTexte } from '@/shared/ui/Champ';
import { Fiche } from '@/shared/ui/Fiche';
import { filtrerParTitre } from '../recherche';
import type { Glisse, RecettePlanifiable } from '../types';
import { Aimant } from './Aimant';

function RecetteDeplacable({ recette }: { recette: RecettePlanifiable }) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: `recette:${recette.id}`,
    data: { type: 'recette', recette, titre: recette.title } satisfies Glisse,
  });
  return (
    <li>
      <Aimant
        ref={setNodeRef}
        recetteId={recette.id}
        titre={recette.title}
        fantome={isDragging}
        className="max-w-56"
        {...attributes}
        {...listeners}
      />
    </li>
  );
}

export function BacRecettes({ recettes }: { recettes: RecettePlanifiable[] }) {
  const { t } = useTranslation('planning');
  const [recherche, setRecherche] = useState('');
  const visibles = filtrerParTitre(recettes, recherche);

  return (
    <Fiche as="section" aria-labelledby="titre-bac" className="flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="titre-bac" className="text-2xl">
            {t('bac.titre')}
          </h2>
          <p className="text-sm text-encre-douce dark:text-seyes">{t('bac.aide')}</p>
        </div>
        <ChampTexte
          label={t('bac.recherche')}
          masquerLabel
          type="search"
          placeholder={t('bac.recherche')}
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          classeCadre="w-full sm:w-72"
        />
      </div>
      {recettes.length === 0 ? (
        <p className="text-encre-douce dark:text-seyes">{t('bac.vide')}</p>
      ) : visibles.length === 0 ? (
        <p className="text-encre-douce dark:text-seyes">{t('bac.aucune')}</p>
      ) : (
        <ul className="flex max-h-64 flex-wrap gap-x-3 gap-y-4 overflow-y-auto pt-2">
          {visibles.map((recette) => (
            <RecetteDeplacable key={recette.id} recette={recette} />
          ))}
        </ul>
      )}
    </Fiche>
  );
}
