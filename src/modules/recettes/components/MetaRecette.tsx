import { useTranslation } from 'react-i18next';
import { ChefHat, Clock, Users } from 'lucide-react';
import { formaterDuree } from '../duree';
import { tempsTotal } from '../recettes';
import type { Recette } from '../types';

/** Temps total, nombre de personnes et difficulté, sur une ligne. */
export function MetaRecette({ recette }: { recette: Recette }) {
  const { t } = useTranslation('recettes');
  const elements = [
    { icone: Clock, texte: formaterDuree(t, tempsTotal(recette)) },
    { icone: Users, texte: t('carte.portions', { count: recette.servings }) },
    { icone: ChefHat, texte: t(`difficultes.${recette.difficulty}`) },
  ];
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-encre-douce dark:text-seyes">
      {elements.map(({ icone: Icone, texte }) => (
        <li key={texte} className="flex items-center gap-1.5">
          <Icone aria-hidden="true" className="h-4 w-4 text-faience dark:text-seyes-clair" />
          {texte}
        </li>
      ))}
    </ul>
  );
}

export function Etiquettes({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full bg-faience-clair px-2.5 py-0.5 text-xs font-semibold text-faience-fonce dark:bg-nuit dark:text-seyes-clair"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

export function BadgeDemo() {
  const { t } = useTranslation('recettes');
  return (
    <span className="inline-block -rotate-2 rounded-sm bg-beurre-clair px-2 py-0.5 font-main text-sm text-encre shadow-scotch">
      {t('carte.demo')}
    </span>
  );
}
