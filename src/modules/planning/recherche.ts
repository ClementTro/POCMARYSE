import { normaliser } from '@/shared/lib/texte';
import type { RecettePlanifiable } from './types';

export function filtrerParTitre(recettes: RecettePlanifiable[], recherche: string) {
  const texte = normaliser(recherche);
  return texte ? recettes.filter((r) => normaliser(r.title).includes(texte)) : recettes;
}
