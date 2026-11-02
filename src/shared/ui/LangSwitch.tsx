import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/cn';

const LANGUES_PAR_DEFAUT = ['fr', 'en'] as const;

export function LangSwitch({
  surChangement,
  langues = LANGUES_PAR_DEFAUT,
}: {
  surChangement?: (langue: string) => void;
  langues?: readonly string[];
}) {
  const { t, i18n } = useTranslation();
  const active = i18n.resolvedLanguage ?? 'fr';

  return (
    <div role="group" aria-label={t('langue.choisir')} className="flex items-center">
      {langues.map((langue) => (
        <button
          key={langue}
          type="button"
          lang={langue}
          aria-pressed={active === langue}
          title={t(`langue.${langue}`)}
          onClick={() => {
            void i18n.changeLanguage(langue);
            surChangement?.(langue);
          }}
          className={cn(
            'min-h-11 min-w-11 rounded-bouton px-2 text-sm font-bold',
            active === langue
              ? 'text-faience underline decoration-vichy decoration-2 underline-offset-4 dark:text-beurre'
              : 'text-encre-douce hover:text-faience dark:text-seyes dark:hover:text-seyes-clair',
          )}
        >
          {langue.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
