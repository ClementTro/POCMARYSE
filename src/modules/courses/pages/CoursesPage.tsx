import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Eraser, Printer } from 'lucide-react';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { Button } from '@/shared/ui/Button';
import { Chargement } from '@/shared/ui/Chargement';
import { ErreurChargement } from '@/shared/ui/ErreurChargement';
import { Fiche } from '@/shared/ui/Fiche';
import { Message } from '@/shared/ui/Message';
import {
  useAjouterArticle,
  useArticles,
  useCocherArticle,
  useSupprimerArticle,
  useViderCoches,
} from '../api';
import { FormulaireAjout } from '../components/FormulaireAjout';
import { GenerateurPlanning } from '../components/GenerateurPlanning';
import { LigneArticle } from '../components/LigneArticle';
import { compterRestants } from '../liste';

/** Marge rouge du bloc-notes, entre la case à cocher (1,5 rem) et le texte (gap de 0,75 rem). */
const MARGE_BLOC_NOTES = { '--marge': '1.875rem' } as CSSProperties;

export default function CoursesPage() {
  const { t, i18n } = useTranslation('courses');
  useTitrePage(t('page.titre'));
  const langue = i18n.resolvedLanguage ?? 'fr';

  const articles = useArticles();
  const ajouter = useAjouterArticle();
  const cocher = useCocherArticle();
  const supprimer = useSupprimerArticle();
  const vider = useViderCoches();

  const liste = articles.data;
  const restants = compterRestants(liste ?? []);
  const coches = (liste?.length ?? 0) - restants;
  const enErreur = ajouter.isError || cocher.isError || supprimer.isError || vider.isError;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-4xl">{t('page.titre')}</h1>
        <p className="no-print mt-2 max-w-lecture text-encre-douce dark:text-seyes">
          {t('page.intro')}
        </p>
      </header>

      {enErreur && <Message ton="erreur">{t('erreurs.serveur')}</Message>}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Fiche
          as="section"
          aria-labelledby="titre-liste"
          className="flex flex-col gap-4 p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 id="titre-liste" className="text-2xl">
              {t('page.liste')}
            </h2>
            {liste && liste.length > 0 && (
              <p aria-live="polite" className="text-encre-douce dark:text-seyes">
                {restants ? t('page.restants', { count: restants }) : t('page.toutCoche')}
              </p>
            )}
          </div>

          <FormulaireAjout onAjouter={(article) => ajouter.mutate(article)} />

          {!liste ? (
            articles.isError ? (
              <ErreurChargement onReessayer={() => void articles.refetch()} />
            ) : (
              <Chargement />
            )
          ) : liste.length ? (
            <ul
              style={MARGE_BLOC_NOTES}
              className="marge-cahier divide-y divide-seyes border-y border-seyes dark:divide-nuit-ligne dark:border-nuit-ligne"
            >
              {liste.map((article) => (
                <LigneArticle
                  key={article.id}
                  article={article}
                  langue={langue}
                  onCocher={(checked) => cocher.mutate({ id: article.id, checked })}
                  onRetirer={() => supprimer.mutate(article.id)}
                />
              ))}
            </ul>
          ) : (
            <div className="rounded-fiche border-2 border-dashed border-seyes px-5 py-6 dark:border-nuit-ligne">
              <p className="font-titre text-xl text-faience dark:text-seyes-clair">
                {t('vide.titre')}
              </p>
              <p className="mt-1 max-w-lecture text-encre-douce dark:text-seyes">
                {t('vide.texte')}
              </p>
            </div>
          )}

          {liste && liste.length > 0 && (
            <div className="no-print flex flex-wrap gap-2">
              <Button variante="discret" onClick={() => window.print()}>
                <Printer aria-hidden="true" className="h-5 w-5" />
                {t('page.imprimer')}
              </Button>
              <Button
                variante="discret"
                onClick={() => vider.mutate()}
                disabled={coches === 0 || vider.isPending}
              >
                <Eraser aria-hidden="true" className="h-5 w-5" />
                {t('page.vider')}
              </Button>
            </div>
          )}
        </Fiche>

        <GenerateurPlanning
          dejaGeneree={!!liste?.some((article) => article.source === 'planning')}
        />
      </div>
    </div>
  );
}
