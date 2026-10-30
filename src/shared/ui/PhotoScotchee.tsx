import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CookingPot } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface PhotoScotcheeProps {
  src: string;
  alt: string;
  legende?: string;
  inclinaison?: 'gauche' | 'droite';
  className?: string;
}

function Scotch({ position }: { position: 'gauche' | 'droite' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'absolute -top-3 z-10 h-7 w-24 bg-beurre/70 shadow-scotch dark:bg-beurre/60',
        position === 'gauche' ? '-left-4 -rotate-12' : '-right-4 rotate-12',
      )}
    />
  );
}

/** Photo tirée sur papier et scotchée dans le cahier : l'élément signature de la vitrine. */
export function PhotoScotchee({
  src,
  alt,
  legende,
  inclinaison = 'gauche',
  className,
}: PhotoScotcheeProps) {
  const { t } = useTranslation();
  const [indisponible, setIndisponible] = useState(false);

  return (
    <figure
      className={cn(
        'relative bg-white p-3 pb-4 shadow-fiche dark:bg-papier-fonce',
        inclinaison === 'gauche' ? '-rotate-2' : 'rotate-2',
        className,
      )}
    >
      <Scotch position="gauche" />
      <Scotch position="droite" />
      {indisponible ? (
        <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 bg-faience-clair text-faience">
          <CookingPot aria-hidden="true" className="h-12 w-12" />
          <span className="font-main text-lg">{t('photo.aVenir')}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setIndisponible(true)}
          className="aspect-[4/3] w-full object-cover"
          loading="eager"
          decoding="async"
        />
      )}
      {legende && (
        <figcaption className="mt-3 text-center font-main text-lg text-encre">{legende}</figcaption>
      )}
    </figure>
  );
}
