import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { Button, LienBouton } from '@/shared/ui/Button';
import { Chargement } from '@/shared/ui/Chargement';
import { ErreurChargement } from '@/shared/ui/ErreurChargement';
import { EtatVide } from '@/shared/ui/EtatVide';
import { useRecettes } from '../api';
import { BarreFiltres } from '../components/BarreFiltres';
import { CarteRecette } from '../components/CarteRecette';
import { ecrireFiltres, filtrerRecettes, lireFiltres, tagsDisponibles } from '../recettes';
import { FILTRES_VIDES, type FiltresRecettes } from '../types';

export default function ListeRecettesPage() {
  const { t } = useTranslation('recettes');
  useTitrePage(t('liste.titre'));
  const { data: recettes, isPending, isError, refetch } = useRecettes();
  const [params, setParams] = useSearchParams();
  const filtres = lireFiltres(params);

  const changerFiltres = (nouveaux: FiltresRecettes) =>
    setParams(ecrireFiltres(nouveaux), { replace: true });

  const tags = useMemo(() => tagsDisponibles(recettes ?? []), [recettes]);
  const resultats = filtrerRecettes(recettes ?? [], filtres);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">{t('liste.titre')}</h1>
          <p className="mt-2 text-encre-douce dark:text-seyes">{t('liste.intro')}</p>
        </div>
        <LienBouton to="nouvelle">
          <Plus aria-hidden="true" className="h-5 w-5" />
          {t('liste.nouvelle')}
        </LienBouton>
      </header>

      {isPending ? (
        <Chargement />
      ) : isError ? (
        <ErreurChargement onReessayer={() => void refetch()} />
      ) : recettes.length === 0 ? (
        <EtatVide titre={t('liste.videTitre')} texte={t('liste.videTexte')} />
      ) : (
        <>
          <BarreFiltres filtres={filtres} tags={tags} onChange={changerFiltres} />
          <p aria-live="polite" className="font-main text-lg text-faience dark:text-seyes-clair">
            {t('liste.resultats', { count: resultats.length })}
          </p>
          {resultats.length === 0 ? (
            <EtatVide
              titre={t('liste.aucunResultatTitre')}
              texte={t('liste.aucunResultatTexte')}
              action={
                <Button variante="secondaire" onClick={() => changerFiltres(FILTRES_VIDES)}>
                  {t('liste.reinitialiser')}
                </Button>
              }
            />
          ) : (
            <ul className="grid gap-6 pt-2 sm:grid-cols-2 lg:grid-cols-3">
              {resultats.map((recette) => (
                <CarteRecette key={recette.id} recette={recette} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
