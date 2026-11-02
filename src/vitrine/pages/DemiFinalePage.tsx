import { useTranslation } from 'react-i18next';
import { useAuth } from '@/core/auth/useAuth';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { LienBouton } from '@/shared/ui/Button';
import { Fiche } from '@/shared/ui/Fiche';
import { NoteManuscrite } from '@/shared/ui/NoteManuscrite';

interface RecetteEvenement {
  moment: string;
  titre: string;
  description: string;
  portions: string;
  temps: string;
  ingredients: string[];
  etapes: string[];
}

function tableau<T>(valeur: unknown): T[] {
  return Array.isArray(valeur) ? (valeur as T[]) : [];
}

function FicheRecette({ recette, index }: { recette: RecetteEvenement; index: number }) {
  const { t } = useTranslation('vitrine');
  const idTitre = `recette-match-${index}`;

  return (
    <Fiche aria-labelledby={idTitre} className="flex flex-col gap-5 p-6 sm:p-8">
      <header className="flex flex-col gap-2">
        <NoteManuscrite>{recette.moment}</NoteManuscrite>
        <h2 id={idTitre} className="text-3xl">
          {recette.titre}
        </h2>
        <p className="text-encre-douce dark:text-seyes">{recette.description}</p>
      </header>

      <dl className="grid grid-cols-2 gap-3">
        <div className="rounded-fiche bg-papier-fonce px-3 py-2 dark:bg-nuit">
          <dt className="text-sm text-encre-douce dark:text-seyes">{t('evenement.pour')}</dt>
          <dd className="font-semibold">{recette.portions}</dd>
        </div>
        <div className="rounded-fiche bg-papier-fonce px-3 py-2 dark:bg-nuit">
          <dt className="text-sm text-encre-douce dark:text-seyes">{t('evenement.temps')}</dt>
          <dd className="font-semibold">{recette.temps}</dd>
        </div>
      </dl>

      <section aria-labelledby={`${idTitre}-ingredients`}>
        <h3 id={`${idTitre}-ingredients`} className="mb-2 text-xl">
          {t('evenement.ingredients')}
        </h3>
        <ul className="divide-y divide-seyes border-y border-seyes dark:divide-nuit-ligne dark:border-nuit-ligne">
          {recette.ingredients.map((ingredient) => (
            <li key={ingredient} className="py-2">
              {ingredient}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby={`${idTitre}-etapes`}>
        <h3 id={`${idTitre}-etapes`} className="mb-2 text-xl">
          {t('evenement.etapes')}
        </h3>
        <ol className="flex flex-col gap-4">
          {recette.etapes.map((etape, numero) => (
            <li key={etape} className="flex gap-4">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-vichy font-titre text-vichy"
              >
                {numero + 1}
              </span>
              <p className="max-w-lecture pt-0.5">{etape}</p>
            </li>
          ))}
        </ol>
      </section>
    </Fiche>
  );
}

export default function DemiFinalePage() {
  const { t } = useTranslation('vitrine');
  const { session } = useAuth();
  useTitrePage(t('evenement.titre'));

  const recettes = tableau<RecetteEvenement>(t('evenement.recettes', { returnObjects: true }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <header className="max-w-lecture">
        <p className="font-semibold text-vichy-fonce dark:text-beurre">{t('evenement.date')}</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">{t('evenement.titre')}</h1>
        <p className="mt-4 text-lg">{t('evenement.intro')}</p>
      </header>

      <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
        {recettes.map((recette, index) => (
          <FicheRecette key={recette.titre} recette={recette} index={index} />
        ))}
      </div>

      <p className="mt-10 max-w-lecture text-sm italic text-encre-douce dark:text-seyes">
        {t('evenement.avertissement')}
      </p>

      <div className="mt-12 flex flex-col items-start gap-5 rounded-fiche bg-white p-8 shadow-fiche dark:bg-nuit-carte">
        <h2 className="text-3xl">{t('evenement.finTitre')}</h2>
        <p className="max-w-lecture text-lg">{t('evenement.finTexte')}</p>
        <LienBouton to={session ? '/app' : '/inscription'}>
          {session ? t('common:nav.ouvrirCarnet') : t('evenement.cta')}
        </LienBouton>
      </div>
    </div>
  );
}
