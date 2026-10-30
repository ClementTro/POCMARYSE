import { useTranslation } from 'react-i18next';
import { ShoppingBasket } from 'lucide-react';
import { LienBouton } from '@/shared/ui/Button';
import { Fiche } from '@/shared/ui/Fiche';
import { useArticles } from '../api';

const APERCU = 4;

/** Tableau de bord : ce qui reste à acheter. */
export function WidgetCourses() {
  const { t } = useTranslation('courses');
  const { data: articles, isPending } = useArticles();
  const restants = (articles ?? []).filter((article) => !article.checked);

  return (
    <Fiche as="section" aria-labelledby="widget-courses" className="flex flex-col gap-4 p-5">
      <h2 id="widget-courses" className="flex items-center gap-2 text-2xl">
        <ShoppingBasket aria-hidden="true" className="h-6 w-6 text-vichy" />
        {t('widget.titre')}
      </h2>
      {isPending ? (
        <p className="text-encre-douce dark:text-seyes">…</p>
      ) : restants.length ? (
        <div className="flex flex-col gap-2">
          <p className="font-semibold">{t('page.restants', { count: restants.length })}</p>
          <ul className="font-main text-xl leading-snug">
            {restants.slice(0, APERCU).map((article) => (
              <li key={article.id} className="first-letter:uppercase">
                {article.name}
              </li>
            ))}
          </ul>
          {restants.length > APERCU && (
            <p className="text-sm text-encre-douce dark:text-seyes">
              {t('widget.etAutres', { count: restants.length - APERCU })}
            </p>
          )}
        </div>
      ) : (
        <p className="text-encre-douce dark:text-seyes">{t('widget.vide')}</p>
      )}
      <LienBouton to="/app/courses" variante="secondaire" className="self-start">
        {t('widget.ouvrir')}
      </LienBouton>
    </Fiche>
  );
}
