import { useTranslation } from 'react-i18next';
import { useTitrePage } from '@/shared/hooks/useTitrePage';
import { LienBouton } from '@/shared/ui/Button';

export function PageIntrouvable() {
  const { t } = useTranslation();
  useTitrePage(t('introuvable.titre'));
  return (
    <div className="mx-auto flex max-w-lecture flex-col items-start gap-4 px-6 py-20">
      <h1 className="text-4xl">{t('introuvable.titre')}</h1>
      <p>{t('introuvable.texte')}</p>
      <LienBouton to="/">{t('introuvable.retour')}</LienBouton>
    </div>
  );
}
