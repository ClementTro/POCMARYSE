import { Suspense } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Sun, UserRound, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/core/auth/useAuth';
import { modules } from '@/core/moduleRegistry';
import { SynchroPreferences } from '@/core/profil/SynchroPreferences';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';
import { Chargement } from '@/shared/ui/Chargement';
import { LangSwitch } from '@/shared/ui/LangSwitch';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { ID_CONTENU, LienEvitement } from './LienEvitement';
import { Logo } from './Logo';
import { PiedDePage } from './PiedDePage';

interface EntreeNav {
  vers: string;
  libelle: string;
  icone: LucideIcon;
  exact?: boolean;
}

function OngletNav({ vers, libelle, icone: Icone, exact }: EntreeNav) {
  return (
    <NavLink
      to={vers}
      end={exact}
      className={({ isActive }) =>
        cn(
          'flex min-h-11 shrink-0 items-center gap-2 rounded-t-fiche border-b-[3px] px-4 font-semibold',
          isActive
            ? 'border-vichy bg-white text-faience dark:bg-nuit-carte dark:text-beurre'
            : 'border-transparent text-encre-douce hover:text-faience dark:text-seyes dark:hover:text-seyes-clair',
        )
      }
    >
      <Icone aria-hidden="true" className="h-5 w-5" />
      {libelle}
    </NavLink>
  );
}

export function AppLayout() {
  const { t } = useTranslation();
  const { deconnecter } = useAuth();
  const navigate = useNavigate();

  const entrees: EntreeNav[] = [
    { vers: '/app', libelle: t('nav.tableauDeBord'), icone: Sun, exact: true },
    ...modules.map((module) => ({
      vers: `/app/${module.basePath}`,
      libelle: t(module.navItem.labelKey),
      icone: module.navItem.icon,
    })),
    { vers: '/app/profil', libelle: t('nav.profil'), icone: UserRound },
  ];

  const surDeconnexion = async () => {
    await deconnecter();
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SynchroPreferences />
      <LienEvitement />
      <header className="no-print border-b border-seyes bg-papier-fonce dark:border-nuit-ligne dark:bg-nuit">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 pt-3 sm:gap-4 sm:px-6">
          <Logo vers="/app" compact />
          <div className="ml-auto flex items-center gap-1">
            <LangSwitch />
            <ThemeToggle />
            <Button variante="discret" onClick={() => void surDeconnexion()}>
              <LogOut aria-hidden="true" className="h-5 w-5" />
              <span className="hidden sm:inline">{t('nav.deconnexion')}</span>
              <span className="sr-only sm:hidden">{t('nav.deconnexion')}</span>
            </Button>
          </div>
        </div>
        <nav
          aria-label={t('nav.application')}
          className="mx-auto mt-2 flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6"
        >
          {entrees.map((entree) => (
            <OngletNav key={entree.vers} {...entree} />
          ))}
        </nav>
      </header>
      <main id={ID_CONTENU} tabIndex={-1} className="flex-1 focus:outline-none">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Suspense fallback={<Chargement />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <PiedDePage />
    </div>
  );
}
