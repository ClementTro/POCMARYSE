import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/core/auth/useAuth';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { LienBouton } from '@/shared/ui/Button';
import { NoteManuscrite } from '@/shared/ui/NoteManuscrite';
import { PhotoScotchee } from '@/shared/ui/PhotoScotchee';
import { MiniBlocNotes, MiniFiche, MiniFrigo } from '@/vitrine/components/Illustrations';
import { PHOTOS } from '@/vitrine/photos';

function PageDuCarnet({
  titre,
  texte,
  illustration,
}: {
  titre: string;
  texte: string;
  illustration: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex min-h-56 items-center justify-center">{illustration}</div>
      <h3 className="text-2xl">{titre}</h3>
      <p className="text-encre-douce dark:text-seyes">{texte}</p>
    </div>
  );
}

export default function AccueilPage() {
  const { t } = useTranslation('vitrine');
  const { session } = useAuth();
  useTitrePage();
  const destination = session ? '/app' : '/inscription';

  return (
    <>
      <section className="papier-seyes marge-cahier overflow-hidden [--marge:1.5rem] sm:[--marge:3rem]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 py-14 pl-10 pr-6 sm:pl-20 md:py-20 lg:grid-cols-[7fr_5fr]">
          <div className="flex flex-col items-start gap-6">
            <h1 className="max-w-[16ch] text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {t('accueil.titre')}
            </h1>
            <p className="max-w-lecture text-lg">{t('accueil.intro')}</p>
            <div className="flex flex-wrap gap-3">
              <LienBouton to={destination}>
                {session ? t('common:nav.ouvrirCarnet') : t('accueil.ctaPrincipal')}
              </LienBouton>
              <LienBouton to="/histoire" variante="secondaire">
                {t('accueil.ctaSecondaire')}
              </LienBouton>
            </div>
            <p className="text-sm text-encre-douce dark:text-seyes">{t('accueil.gratuit')}</p>
          </div>
          <div className="relative mx-auto w-full max-w-md pb-8">
            <PhotoScotchee
              src={PHOTOS.medaille}
              alt={t('photos.medailleAlt')}
              inclinaison="droite"
            />
            <NoteManuscrite className="mt-6 max-w-sm -rotate-2 pl-4 text-2xl">
              {t('accueil.photoNote')}
            </NoteManuscrite>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h2 className="text-3xl sm:text-4xl">{t('accueil.contenuTitre')}</h2>
        <div className="mt-12 grid gap-14 md:grid-cols-3 md:gap-10">
          <PageDuCarnet
            titre={t('accueil.recettesTitre')}
            texte={t('accueil.recettesTexte')}
            illustration={<MiniFiche />}
          />
          <PageDuCarnet
            titre={t('accueil.planningTitre')}
            texte={t('accueil.planningTexte')}
            illustration={<MiniFrigo />}
          />
          <PageDuCarnet
            titre={t('accueil.coursesTitre')}
            texte={t('accueil.coursesTexte')}
            illustration={<MiniBlocNotes />}
          />
        </div>
      </section>

      <section className="border-y border-seyes bg-faience text-papier dark:border-nuit-ligne dark:bg-nuit-carte">
        <figure className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-16">
          <blockquote className="font-titre text-3xl leading-snug sm:text-4xl">
            {t('accueil.citation')}
          </blockquote>
          <figcaption className="font-main text-2xl text-beurre">
            {t('accueil.citationAuteur')}
          </figcaption>
        </figure>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-6 py-16 md:py-20">
        <h2 className="text-3xl sm:text-4xl">{t('accueil.finTitre')}</h2>
        <p className="max-w-lecture text-lg">{t('accueil.finTexte')}</p>
        <LienBouton to={destination}>
          {session ? t('common:nav.ouvrirCarnet') : t('accueil.ctaPrincipal')}
        </LienBouton>
      </section>
    </>
  );
}
