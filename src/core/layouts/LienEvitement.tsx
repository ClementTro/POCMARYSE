import { useTranslation } from 'react-i18next';

export const ID_CONTENU = 'contenu';

export function LienEvitement() {
  const { t } = useTranslation();
  return (
    <a
      href={`#${ID_CONTENU}`}
      className="sr-only rounded-fiche bg-faience px-4 py-2 text-papier focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
    >
      {t('nav.allerAuContenu')}
    </a>
  );
}
