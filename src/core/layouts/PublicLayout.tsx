import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/core/auth/useAuth';
import { cn } from '@/shared/lib/cn';
import { LienBouton } from '@/shared/ui/Button';
import { Chargement } from '@/shared/ui/Chargement';
import { LangSwitch } from '@/shared/ui/LangSwitch';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { ID_CONTENU, LienEvitement } from './LienEvitement';
import { Logo } from './Logo';
import { PiedDePage } from './PiedDePage';

function lienNav({ isActive }: { isActive: boolean }) {
  return cn(
    'flex min-h-11 items-center rounded-fiche px-2 font-semibold underline-offset-8',
    isActive
      ? 'text-faience underline decoration-vichy decoration-2 dark:text-beurre'
      : 'text-encre hover:text-faience dark:text-papier dark:hover:text-seyes-clair',
  );
}

export function PublicLayout() {
  const { t } = useTranslation();
  const { session } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <LienEvitement />
      <header className="no-print border-b border-seyes bg-papier/95 dark:border-nuit-ligne dark:bg-nuit/95">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <Logo />
          <nav
            aria-label={t('nav.principale')}
            className="order-last flex w-full gap-4 sm:order-none sm:w-auto"
          >
            <NavLink to="/histoire" className={lienNav}>
              {t('nav.histoire')}
            </NavLink>
            <NavLink to="/fonctionnalites" className={lienNav}>
              {t('nav.fonctionnalites')}
            </NavLink>
          </nav>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-1">
            <LangSwitch />
            <ThemeToggle />
            {session ? (
              <LienBouton to="/app" className="ml-2 whitespace-nowrap">
                {t('nav.ouvrirCarnet')}
              </LienBouton>
            ) : (
              <>
                <LienBouton to="/connexion" variante="discret" className="hidden lg:inline-flex">
                  {t('nav.connexion')}
                </LienBouton>
                <LienBouton to="/inscription" className="ml-1 whitespace-nowrap">
                  {t('nav.inscription')}
                </LienBouton>
              </>
            )}
          </div>
        </div>
      </header>
      <main id={ID_CONTENU} tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense fallback={<Chargement />}>
          <Outlet />
        </Suspense>
      </main>
      <PiedDePage />
    </div>
  );
}
