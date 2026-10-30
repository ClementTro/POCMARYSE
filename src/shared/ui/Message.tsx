import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

type TonMessage = 'info' | 'succes' | 'erreur';

const TONS: Record<TonMessage, string> = {
  info: 'border-faience bg-faience-clair text-faience-fonce dark:bg-nuit-carte dark:text-seyes-clair',
  succes: 'border-sauge bg-sauge-clair text-sauge-fonce dark:bg-nuit-carte dark:text-sauge-clair',
  erreur: 'border-vichy bg-vichy-clair text-vichy-fonce dark:bg-nuit-carte dark:text-vichy-clair',
};

export function Message({
  ton = 'info',
  children,
  className,
}: {
  ton?: TonMessage;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={ton === 'erreur' ? 'alert' : 'status'}
      className={cn('rounded-fiche border-l-4 px-4 py-3', TONS[ton], className)}
    >
      {children}
    </div>
  );
}
