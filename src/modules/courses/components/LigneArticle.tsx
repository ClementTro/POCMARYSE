import { useTranslation } from 'react-i18next';
import { CalendarDays, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';
import { PREFIXE_PROVISOIRE } from '../api';
import { formaterQuantite } from '../liste';
import type { Article } from '../types';

interface LigneArticleProps {
  article: Article;
  langue: string;
  onCocher: (checked: boolean) => void;
  onRetirer: () => void;
}

/**
 * Une ligne du bloc-notes : la case est dans la marge, l'article est barré une fois coché.
 * Les `{' '}` entre les morceaux du libellé séparent les mots du nom accessible de la case.
 */
export function LigneArticle({ article, langue, onCocher, onRetirer }: LigneArticleProps) {
  const { t } = useTranslation('courses');
  const provisoire = article.id.startsWith(PREFIXE_PROVISOIRE);
  const quantite = formaterQuantite(article, langue);
  const id = `article-${article.id}`;

  return (
    <li className={cn('flex items-center gap-3', article.checked && 'print:hidden')}>
      <input
        id={id}
        type="checkbox"
        checked={article.checked}
        disabled={provisoire}
        onChange={(evenement) => onCocher(evenement.target.checked)}
        className="h-6 w-6 shrink-0 cursor-pointer accent-faience disabled:cursor-wait dark:accent-beurre"
      />
      <label
        htmlFor={id}
        className="flex min-h-11 min-w-0 flex-1 cursor-pointer flex-wrap items-baseline gap-x-3 py-1"
      >
        <span
          className={cn(
            'break-words font-main text-xl leading-snug first-letter:uppercase',
            article.checked &&
              'text-encre-douce line-through decoration-vichy decoration-2 dark:text-seyes',
          )}
        >
          {article.name}
        </span>{' '}
        {quantite && (
          <span
            className={cn(
              'text-sm font-semibold text-encre-douce dark:text-seyes',
              article.checked && 'line-through',
            )}
          >
            {quantite}
          </span>
        )}{' '}
        {article.source === 'planning' && (
          <span
            title={t('article.planning')}
            className="self-center text-sauge-fonce dark:text-sauge"
          >
            <CalendarDays aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">{t('article.planning')}</span>
          </span>
        )}
      </label>
      <Button
        variante="icone"
        onClick={onRetirer}
        disabled={provisoire}
        aria-label={t('article.retirer', { nom: article.name })}
        className="no-print"
      >
        <X aria-hidden="true" className="h-5 w-5" />
      </Button>
    </li>
  );
}
