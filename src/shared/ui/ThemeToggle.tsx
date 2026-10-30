import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/theme/useTheme';
import { classesBouton } from './classesBouton';

export function ThemeToggle() {
  const { t } = useTranslation();
  const { sombre, basculer } = useTheme();
  const libelle = sombre ? t('theme.passerClair') : t('theme.passerSombre');

  return (
    <button
      type="button"
      onClick={basculer}
      aria-label={libelle}
      title={libelle}
      className={classesBouton('icone')}
    >
      {sombre ? (
        <Sun aria-hidden="true" className="h-5 w-5" />
      ) : (
        <Moon aria-hidden="true" className="h-5 w-5" />
      )}
    </button>
  );
}
