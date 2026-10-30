import { cn } from '@/shared/lib/cn';

export type VarianteBouton = 'primaire' | 'secondaire' | 'discret' | 'danger';

const BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-bouton px-5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTES: Record<VarianteBouton, string> = {
  primaire:
    'bg-faience text-papier hover:bg-faience-fonce dark:bg-beurre dark:text-nuit dark:hover:bg-beurre-clair',
  secondaire:
    'border-2 border-faience text-faience hover:bg-faience-clair dark:border-seyes dark:text-seyes-clair dark:hover:bg-nuit-carte',
  discret:
    'px-3 text-faience hover:bg-faience-clair dark:text-seyes-clair dark:hover:bg-nuit-carte',
  danger: 'bg-vichy text-papier hover:bg-vichy-fonce',
};

export function classesBouton(variante: VarianteBouton = 'primaire', className?: string): string {
  return cn(BASE, VARIANTES[variante], className);
}
