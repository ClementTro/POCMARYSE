import { useTranslation } from 'react-i18next';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { LienBouton } from '@/shared/ui/Button';

export function BackendNonConfigurePage() {
  const { t } = useTranslation();
  useTitrePage(t('backend.titre'));
  return (
    <main className="papier-seyes flex min-h-screen items-center px-6">
      <div className="mx-auto flex max-w-lecture flex-col items-start gap-4 rounded-fiche bg-papier/90 p-8 shadow-fiche dark:bg-nuit-carte/95">
        <h1 className="text-3xl">{t('backend.titre')}</h1>
        <p>{t('backend.texte')}</p>
        <LienBouton to="/">{t('backend.retour')}</LienBouton>
      </div>
    </main>
  );
}
