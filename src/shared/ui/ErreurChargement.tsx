import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { Message } from './Message';

/** Erreur de chargement d'une requête, avec possibilité de relancer. */
export function ErreurChargement({ onReessayer }: { onReessayer?: () => void }) {
  const { t } = useTranslation();
  return (
    <Message ton="erreur" className="flex flex-wrap items-center justify-between gap-3">
      <span>{t('etat.erreur')}</span>
      {onReessayer && (
        <Button variante="secondaire" onClick={onReessayer}>
          {t('etat.reessayer')}
        </Button>
      )}
    </Message>
  );
}
