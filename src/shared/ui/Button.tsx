import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { classesBouton, type VarianteBouton } from './classesBouton';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBouton;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variante = 'primaire', className, type = 'button', ...props },
  ref,
) {
  return <button ref={ref} type={type} className={classesBouton(variante, className)} {...props} />;
});

interface LienBoutonProps extends LinkProps {
  variante?: VarianteBouton;
}

export function LienBouton({ variante = 'primaire', className, ...props }: LienBoutonProps) {
  return <Link className={classesBouton(variante, className as string | undefined)} {...props} />;
}
