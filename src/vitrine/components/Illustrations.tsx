import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

function liste(t: (cle: string, options: { returnObjects: true }) => unknown, cle: string) {
  const valeur = t(cle, { returnObjects: true });
  return Array.isArray(valeur) ? (valeur as string[]) : [];
}

/** Fiche bristol miniature : la métaphore du module Recettes. */
export function MiniFiche() {
  const { t } = useTranslation('vitrine');
  return (
    <div
      aria-hidden="true"
      className="fiche-lignee w-full max-w-xs -rotate-1 rounded-fiche border-t-[3px] border-vichy bg-white px-5 pb-5 pt-3 shadow-fiche dark:bg-papier-fonce"
    >
      <p className="font-titre text-lg leading-[3.5rem] text-faience">
        {t('accueil.exemple.ficheTitre')}
      </p>
      <ul className="text-sm leading-7 text-encre">
        {liste(t, 'accueil.exemple.ficheLignes').map((ligne) => (
          <li key={ligne}>{ligne}</li>
        ))}
      </ul>
      <p className="mt-1 rotate-[-3deg] font-main text-lg leading-7 text-vichy">
        {t('accueil.exemple.ficheNote')}
      </p>
    </div>
  );
}

const AIMANTS = ['bg-vichy', 'bg-beurre', 'bg-sauge', 'bg-faience'];

/** Tableau de frigo miniature : la métaphore du module Planning. */
export function MiniFrigo() {
  const { t } = useTranslation('vitrine');
  const jours = liste(t, 'accueil.exemple.jours');
  const plats = liste(t, 'accueil.exemple.plats');
  return (
    <div
      aria-hidden="true"
      className="grid w-full max-w-xs grid-cols-4 gap-2 rounded-[1.25rem] border-4 border-white bg-faience-clair p-3 shadow-fiche dark:border-nuit-ligne dark:bg-nuit-carte"
    >
      {jours.map((jour, index) => (
        <div key={jour} className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-faience dark:text-seyes-clair">{jour}</span>
          <div
            className={cn(
              'relative w-full bg-white px-1 pb-2 pt-3 text-center font-main text-sm text-encre shadow-scotch',
              index % 2 === 0 ? 'rotate-2' : '-rotate-2',
            )}
          >
            <span
              className={cn(
                'absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full shadow-scotch',
                AIMANTS[index % AIMANTS.length],
              )}
            />
            {plats[index]}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Bloc-notes miniature : la métaphore du module Courses. */
export function MiniBlocNotes() {
  const { t } = useTranslation('vitrine');
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-xs rotate-1 rounded-b-fiche bg-beurre-clair shadow-fiche dark:bg-papier-fonce"
    >
      <div className="flex justify-around rounded-t-fiche bg-vichy px-4 py-1.5">
        {Array.from({ length: 7 }, (_, index) => (
          <span key={index} className="h-2 w-2 rounded-full bg-papier/80" />
        ))}
      </div>
      <ul className="flex flex-col gap-1.5 px-5 py-4 font-main text-lg text-encre">
        {liste(t, 'accueil.exemple.articles').map((article, index) => {
          const coche = index % 2 === 0;
          return (
            <li key={article} className="flex items-center gap-3">
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded border-2',
                  coche ? 'border-sauge-fonce bg-sauge text-white' : 'border-encre-douce',
                )}
              >
                {coche && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
              <span className={cn(coche && 'text-encre-douce line-through decoration-2')}>
                {article}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
