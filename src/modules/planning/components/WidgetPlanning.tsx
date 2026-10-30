import { useTranslation } from 'react-i18next';
import { CalendarDays } from 'lucide-react';
import { LienBouton } from '@/shared/ui/Button';
import { Fiche } from '@/shared/ui/Fiche';
import { useSemaine } from '../api';
import { lundiDe, repasDansCase, versIso } from '../semaine';
import { CRENEAUX } from '../types';

/** Tableau de bord : les deux repas du jour. */
export function WidgetPlanning() {
  const { t } = useTranslation('planning');
  const maintenant = new Date();
  const aujourdhui = versIso(maintenant);
  const { data: repas = [], isPending } = useSemaine(versIso(lundiDe(maintenant)));

  return (
    <Fiche as="section" aria-labelledby="widget-planning" className="flex flex-col gap-4 p-5">
      <h2 id="widget-planning" className="flex items-center gap-2 text-2xl">
        <CalendarDays aria-hidden="true" className="h-6 w-6 text-vichy" />
        {t('widget.titre')}
      </h2>
      <dl className="grid gap-3">
        {CRENEAUX.map((creneau) => {
          const leRepas = repasDansCase(repas, { date: aujourdhui, creneau });
          return (
            <div key={creneau} className="flex items-baseline gap-3">
              <dt className="w-14 shrink-0 text-sm font-bold uppercase text-encre-douce dark:text-seyes">
                {t(`creneaux.${creneau}`)}
              </dt>
              <dd className={leRepas ? 'font-main text-xl' : 'text-encre-douce dark:text-seyes'}>
                {isPending ? '…' : (leRepas?.recette?.title ?? t('widget.rien'))}
              </dd>
            </div>
          );
        })}
      </dl>
      <LienBouton to="/app/planning" variante="secondaire" className="self-start">
        {t('widget.ouvrir')}
      </LienBouton>
    </Fiche>
  );
}
