import { useTranslation } from 'react-i18next';
import { useAuth } from '@/core/auth/useAuth';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { cn } from '@/shared/lib/cn';
import { LienBouton } from '@/shared/ui/Button';
import { NoteManuscrite } from '@/shared/ui/NoteManuscrite';
import { PhotoScotchee } from '@/shared/ui/PhotoScotchee';
import { PHOTOS } from '@/vitrine/photos';

interface Etape {
  quand: string;
  titre: string;
  texte: string;
}

export default function HistoirePage() {
  const { t } = useTranslation('vitrine');
  const { session } = useAuth();
  useTitrePage(t('histoire.titre'));
  const brutes = t('histoire.etapes', { returnObjects: true });
  const etapes = Array.isArray(brutes) ? (brutes as Etape[]) : [];

  const photos: Record<number, { src: string; alt: string }> = {
    1: { src: PHOTOS.seconde, alt: t('photos.secondeAlt') },
    2: { src: PHOTOS.medaille, alt: t('photos.medailleAlt') },
  };

  return (
    <div className="papier-seyes">
      <div className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <header className="max-w-lecture">
          <h1 className="text-4xl sm:text-5xl">{t('histoire.titre')}</h1>
          <p className="mt-5 text-lg">{t('histoire.intro')}</p>
          <p className="mt-3 text-sm italic text-encre-douce dark:text-seyes">
            {t('histoire.fiction')}
          </p>
        </header>

        <ol className="relative mt-14 flex flex-col gap-16 border-l-2 border-vichy/60 pl-8 sm:pl-12">
          {etapes.map((etape, index) => {
            const photo = photos[index];
            return (
              <li key={etape.titre} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[2.6rem] top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-vichy bg-papier font-titre text-vichy sm:-left-[3.6rem] dark:bg-nuit"
                >
                  {index + 1}
                </span>
                <div className={cn('grid items-start gap-8', photo && 'md:grid-cols-[3fr_2fr]')}>
                  <div className="rounded-fiche bg-papier/85 p-1 dark:bg-nuit/85">
                    <NoteManuscrite>{etape.quand}</NoteManuscrite>
                    <h2 className="mt-1 text-3xl">{etape.titre}</h2>
                    <p className="mt-3 max-w-lecture text-lg">{etape.texte}</p>
                  </div>
                  {photo && (
                    <PhotoScotchee
                      src={photo.src}
                      alt={photo.alt}
                      inclinaison={index % 2 === 0 ? 'gauche' : 'droite'}
                      className="mx-auto w-full max-w-sm"
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-20 flex flex-col items-start gap-5 rounded-fiche bg-white p-8 shadow-fiche dark:bg-nuit-carte">
          <h2 className="text-3xl">{t('histoire.fin')}</h2>
          <LienBouton to={session ? '/app' : '/inscription'}>
            {session ? t('common:nav.ouvrirCarnet') : t('histoire.cta')}
          </LienBouton>
        </div>
      </div>
    </div>
  );
}
