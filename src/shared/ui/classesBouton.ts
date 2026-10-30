import { cn } from '@/shared/lib/cn';

export type VarianteBouton = 'primaire' | 'secondaire' | 'discret' | 'danger' | 'icone';

const BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-bouton font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const DISCRET =
  'text-faience hover:bg-faience-clair dark:text-seyes-clair dark:hover:bg-nuit-carte';

const VARIANTES: Record<VarianteBouton, string> = {
  primaire:
    'px-5 bg-faience text-papier hover:bg-faience-fonce dark:bg-beurre dark:text-nuit dark:hover:bg-beurre-clair',
  secondaire:
    'px-5 border-2 border-faience text-faience hover:bg-faience-clair dark:border-seyes dark:text-seyes-clair dark:hover:bg-nuit-carte',
  discret: `px-3 ${DISCRET}`,
  danger: 'px-5 bg-vichy text-papier hover:bg-vichy-fonce',
  icone: `w-11 shrink-0 ${DISCRET}`,
};

export function classesBouton(variante: VarianteBouton = 'primaire', className?: string): string {
  return cn(BASE, VARIANTES[variante], className);
}
