import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function PiedDePage() {
  const { t } = useTranslation();
  return (
    <footer className="no-print border-t border-seyes bg-papier-fonce dark:border-nuit-ligne dark:bg-nuit-carte">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-encre-douce sm:flex-row sm:items-center sm:justify-between dark:text-seyes">
        <p>{t('pied.demo')}</p>
        <nav className="flex gap-4">
          <Link to="/mentions-legales" className="underline-offset-4 hover:underline">
            {t('pied.mentions')}
          </Link>
          <Link to="/confidentialite" className="underline-offset-4 hover:underline">
            {t('pied.confidentialite')}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
