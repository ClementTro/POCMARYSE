import { useTranslation } from 'react-i18next';
import { useAuth } from '@/core/auth/useAuth';
import { modules } from '@/core/moduleRegistry';
import { useProfil } from '@/core/profil/api';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { EtatVide } from '@/shared/ui/EtatVide';

export function TableauDeBordPage() {
  const { t } = useTranslation('app');
  const { utilisateur } = useAuth();
  const { data: profil } = useProfil();
  const nom = (
    profil?.display_name ?? (utilisateur?.user_metadata?.display_name as string | undefined)
  )?.trim();
  useTitrePage(t('common:nav.tableauDeBord'));

  const widgets = modules.flatMap((module) =>
    module.dashboardWidget ? [{ id: module.id, Widget: module.dashboardWidget }] : [],
  );

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl">
          {nom ? t('tableauDeBord.titre', { nom }) : t('tableauDeBord.titreSansNom')}
        </h1>
        <p className="mt-2 text-encre-douce dark:text-seyes">{t('tableauDeBord.intro')}</p>
      </header>
      {widgets.length === 0 ? (
        <EtatVide titre={t('tableauDeBord.aucunModule')} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {widgets.map(({ id, Widget }) => (
            <Widget key={id} />
          ))}
        </div>
      )}
    </div>
  );
}
