import { useTranslation } from 'react-i18next';
import { useTitrePage } from '@/shared/hooks/useTitrePage';

export default function AccueilPage() {
  const { t } = useTranslation();
  useTitrePage();
  return (
    <section className="papier-seyes px-6 py-20">
      <h1 className="mx-auto max-w-6xl text-5xl">{t('marque')}</h1>
    </section>
  );
}
