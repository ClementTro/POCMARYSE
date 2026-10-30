import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/cn';

export function Chargement({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <div role="status" className={cn('flex items-center justify-center gap-3 py-12', className)}>
      <span
        aria-hidden="true"
        className="h-6 w-6 rounded-full border-2 border-seyes border-t-faience motion-safe:animate-spin dark:border-nuit-ligne dark:border-t-beurre"
      />
      <span className="font-main text-lg text-faience dark:text-seyes-clair">
        {t('etat.chargement')}
      </span>
    </div>
  );
}
