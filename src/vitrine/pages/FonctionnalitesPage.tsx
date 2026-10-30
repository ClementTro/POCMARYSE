import { useTranslation } from 'react-i18next';
import { BookOpen, CalendarDays, Check, ShoppingBasket, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/core/auth/useAuth';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { LienBouton } from '@/shared/ui/Button';
import { Fiche } from '@/shared/ui/Fiche';

interface ModuleVitrine {
  titre: string;
  points: string[];
}

const ICONES: LucideIcon[] = [BookOpen, CalendarDays, ShoppingBasket];

function tableau<T>(valeur: unknown): T[] {
  return Array.isArray(valeur) ? (valeur as T[]) : [];
}

export default function FonctionnalitesPage() {
  const { t } = useTranslation('vitrine');
  const { session } = useAuth();
  useTitrePage(t('fonctionnalites.titre'));

  const modules = tableau<ModuleVitrine>(t('fonctionnalites.modules', { returnObjects: true }));
  const transverse = tableau<string>(t('fonctionnalites.transverse', { returnObjects: true }));
  const bientot = tableau<string>(t('fonctionnalites.bientot', { returnObjects: true }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <header className="max-w-lecture">
        <h1 className="text-4xl sm:text-5xl">{t('fonctionnalites.titre')}</h1>
        <p className="mt-4 text-lg">{t('fonctionnalites.intro')}</p>
      </header>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {modules.map((module, index) => {
          const Icone = ICONES[index] ?? BookOpen;
          return (
            <Fiche key={module.titre} className="p-6">
              <Icone aria-hidden="true" className="h-8 w-8 text-vichy" />
              <h2 className="mt-3 text-2xl">{module.titre}</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {module.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <Check
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 shrink-0 text-sauge-fonce dark:text-sauge"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Fiche>
          );
        })}
      </div>

      <section className="mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-3xl">{t('fonctionnalites.transverseTitre')}</h2>
          <ul className="mt-5 flex flex-col gap-3 text-lg">
            {transverse.map((point) => (
              <li key={point} className="flex gap-3">
                <Check
                  aria-hidden="true"
                  className="mt-1.5 h-4 w-4 shrink-0 text-sauge-fonce dark:text-sauge"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="papier-seyes rounded-fiche border border-seyes p-6 dark:border-nuit-ligne">
          <h2 className="text-3xl">{t('fonctionnalites.bientotTitre')}</h2>
          <p className="mt-3">{t('fonctionnalites.bientotTexte')}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {bientot.map((idee) => (
              <li
                key={idee}
                className="rounded-bouton bg-beurre-clair px-3 py-1 font-main text-lg text-encre dark:bg-nuit-carte dark:text-beurre"
              >
                {idee}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-16">
        <LienBouton to={session ? '/app' : '/inscription'}>
          {session ? t('common:nav.ouvrirCarnet') : t('fonctionnalites.cta')}
        </LienBouton>
      </div>
    </div>
  );
}
