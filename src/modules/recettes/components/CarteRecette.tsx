import { Link } from 'react-router-dom';
import { Fiche } from '@/shared/ui/Fiche';
import { estDemo } from '../recettes';
import type { Recette } from '../types';
import { BadgeDemo, Etiquettes, MetaRecette } from './MetaRecette';

export function CarteRecette({ recette }: { recette: Recette }) {
  return (
    <Fiche
      as="li"
      className="relative flex flex-col gap-3 p-5 transition-shadow focus-within:shadow-lg hover:shadow-lg"
    >
      {estDemo(recette) && (
        <div className="absolute -top-3 right-4">
          <BadgeDemo />
        </div>
      )}
      <h2 className="text-xl leading-snug">
        {/* Le lien couvre toute la carte (after:inset-0) tout en gardant un intitulé court. */}
        <Link
          to={recette.id}
          className="text-faience after:absolute after:inset-0 after:rounded-fiche hover:underline dark:text-beurre"
        >
          {recette.title}
        </Link>
      </h2>
      {recette.description && (
        <p className="line-clamp-2 text-encre-douce dark:text-seyes">{recette.description}</p>
      )}
      <div className="mt-auto flex flex-col gap-3">
        <MetaRecette recette={recette} />
        <Etiquettes tags={recette.tags} />
      </div>
    </Fiche>
  );
}
