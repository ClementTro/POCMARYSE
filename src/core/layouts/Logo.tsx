import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Logo({ vers = '/' }: { vers?: string }) {
  const { t } = useTranslation();
  return (
    <Link
      to={vers}
      className="flex min-h-11 items-center gap-2 rounded-fiche font-titre text-xl text-faience dark:text-seyes-clair"
    >
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-8 w-8 shrink-0">
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="10"
          className="fill-papier stroke-faience dark:fill-nuit-carte dark:stroke-seyes-clair"
          strokeWidth="4"
        />
        <line x1="18" y1="4" x2="18" y2="60" className="stroke-vichy" strokeWidth="3" />
        <path
          d="M26 44V22l8 12 8-12v22"
          fill="none"
          className="stroke-faience dark:stroke-seyes-clair"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {t('marque')}
    </Link>
  );
}
