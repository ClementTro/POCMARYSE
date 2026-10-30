import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { versIso } from '@/shared/lib/dates';
import { LienBouton } from '@/shared/ui/Button';
import { Fiche } from '@/shared/ui/Fiche';
import { useRecettes } from '../api';
import { formaterDuree } from '../duree';
import { recetteDuJour, tempsTotal } from '../recettes';

/** Tableau de bord : une idée de recette par jour, tirée du carnet. */
export function WidgetRecettes() {
  const { t } = useTranslation('recettes');
  const { data: recettes, isPending } = useRecettes();
  const idee = recetteDuJour(recettes ?? [], versIso(new Date()));

  return (
    <Fiche as="section" aria-labelledby="widget-recettes" className="flex flex-col gap-4 p-5">
      <h2 id="widget-recettes" className="flex items-center gap-2 text-2xl">
        <BookOpen aria-hidden="true" className="h-6 w-6 text-vichy" />
        {t('widget.titre')}
      </h2>
      {isPending ? (
        <p className="text-encre-douce dark:text-seyes">…</p>
      ) : idee ? (
        <div className="flex flex-col gap-1">
          <Link
            to={`/app/recettes/${idee.id}`}
            className="font-main text-xl leading-snug text-faience underline-offset-4 hover:underline dark:text-beurre"
          >
            {idee.title}
          </Link>
          <p className="text-sm text-encre-douce dark:text-seyes">
            {formaterDuree(t, tempsTotal(idee))} · {t(`difficultes.${idee.difficulty}`)}
          </p>
          <p className="mt-2 text-sm">{t('widget.total', { count: recettes?.length ?? 0 })}</p>
        </div>
      ) : (
        <p className="text-encre-douce dark:text-seyes">{t('widget.vide')}</p>
      )}
      <LienBouton to="/app/recettes" variante="secondaire" className="self-start">
        {t('widget.ouvrir')}
      </LienBouton>
    </Fiche>
  );
}
