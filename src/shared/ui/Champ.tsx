import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/shared/lib/cn';

const CLASSES_SAISIE =
  'w-full rounded-fiche border border-seyes bg-white px-3 py-2 text-encre placeholder:text-encre-douce/70 focus-visible:border-faience dark:border-nuit-ligne dark:bg-nuit dark:text-papier dark:placeholder:text-seyes/60';

interface CadreProps {
  id: string;
  label: string;
  aide?: string;
  erreur?: string;
  children: ReactNode;
  className?: string;
  masquerLabel?: boolean;
}

function Cadre({ id, label, aide, erreur, children, className, masquerLabel }: CadreProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={id} className={masquerLabel ? 'sr-only' : 'font-semibold'}>
        {label}
      </label>
      {children}
      {aide && !erreur && (
        <p id={`${id}-aide`} className="text-sm text-encre-douce dark:text-seyes">
          {aide}
        </p>
      )}
      {erreur && (
        <p id={`${id}-erreur`} className="text-sm font-semibold text-vichy">
          {erreur}
        </p>
      )}
    </div>
  );
}

function decrit(id: string, aide?: string, erreur?: string): string | undefined {
  if (erreur) return `${id}-erreur`;
  if (aide) return `${id}-aide`;
  return undefined;
}

interface ChampCommun {
  label: string;
  aide?: string;
  erreur?: string;
  classeCadre?: string;
  /** Libellé lu par les lecteurs d'écran mais non affiché (lignes répétées d'un tableau). */
  masquerLabel?: boolean;
}

export const ChampTexte = forwardRef<
  HTMLInputElement,
  ChampCommun & InputHTMLAttributes<HTMLInputElement>
>(function ChampTexte(
  { label, aide, erreur, classeCadre, masquerLabel, className, id, ...props },
  ref,
) {
  const idAuto = useId();
  const idChamp = id ?? idAuto;
  return (
    <Cadre
      id={idChamp}
      label={label}
      aide={aide}
      erreur={erreur}
      className={classeCadre}
      masquerLabel={masquerLabel}
    >
      <input
        ref={ref}
        id={idChamp}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={decrit(idChamp, aide, erreur)}
        className={cn(CLASSES_SAISIE, 'min-h-11', erreur && 'border-vichy', className)}
        {...props}
      />
    </Cadre>
  );
});

export const ChampZone = forwardRef<
  HTMLTextAreaElement,
  ChampCommun & TextareaHTMLAttributes<HTMLTextAreaElement>
>(function ChampZone(
  { label, aide, erreur, classeCadre, masquerLabel, className, id, ...props },
  ref,
) {
  const idAuto = useId();
  const idChamp = id ?? idAuto;
  return (
    <Cadre
      id={idChamp}
      label={label}
      aide={aide}
      erreur={erreur}
      className={classeCadre}
      masquerLabel={masquerLabel}
    >
      <textarea
        ref={ref}
        id={idChamp}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={decrit(idChamp, aide, erreur)}
        className={cn(CLASSES_SAISIE, 'min-h-24', erreur && 'border-vichy', className)}
        {...props}
      />
    </Cadre>
  );
});

export const ChampListe = forwardRef<
  HTMLSelectElement,
  ChampCommun & SelectHTMLAttributes<HTMLSelectElement>
>(function ChampListe(
  { label, aide, erreur, classeCadre, masquerLabel, className, id, children, ...props },
  ref,
) {
  const idAuto = useId();
  const idChamp = id ?? idAuto;
  return (
    <Cadre
      id={idChamp}
      label={label}
      aide={aide}
      erreur={erreur}
      className={classeCadre}
      masquerLabel={masquerLabel}
    >
      <select
        ref={ref}
        id={idChamp}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={decrit(idChamp, aide, erreur)}
        className={cn(CLASSES_SAISIE, 'min-h-11', erreur && 'border-vichy', className)}
        {...props}
      >
        {children}
      </select>
    </Cadre>
  );
});
