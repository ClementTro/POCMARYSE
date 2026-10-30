import { normaliser } from '@/shared/lib/texte';

type Famille = 'masse' | 'volume';

/** Facteur vers l'unité de base de la famille (gramme, millilitre). */
const MESURES: Record<string, { famille: Famille; facteur: number }> = {
  mg: { famille: 'masse', facteur: 0.001 },
  g: { famille: 'masse', facteur: 1 },
  kg: { famille: 'masse', facteur: 1000 },
  ml: { famille: 'volume', facteur: 1 },
  cl: { famille: 'volume', facteur: 10 },
  dl: { famille: 'volume', facteur: 100 },
  l: { famille: 'volume', facteur: 1000 },
};

export const UNITES_METRIQUES = Object.keys(MESURES);

export function arrondir(valeur: number): number {
  return Math.round(valeur * 100) / 100;
}

/** Forme comparable d'une unité libre : « Pincées » et « pincée » se regroupent. */
export function cleUnite(unite: string): string {
  const cle = normaliser(unite).replace(/\.$/, '');
  if (MESURES[cle]) return cle;
  return cle.length > 2 ? cle.replace(/s$/, '') : cle;
}

/** Quantité ramenée à l'unité de base quand l'unité est métrique (g, ml) ; sinon inchangée. */
export function versBase(
  quantite: number,
  unite: string,
): { famille: Famille | null; valeur: number } {
  const mesure = MESURES[cleUnite(unite)];
  return mesure
    ? { famille: mesure.famille, valeur: quantite * mesure.facteur }
    : { famille: null, valeur: quantite };
}

/**
 * Accord d'une unité libre d'un seul mot (« 2 pincées », « 3 brins ») ; « c. à soupe » reste tel quel.
 * Règle française : les recettes de démo et l'interface par défaut sont en français.
 */
export function accorderUnite(unite: string, quantite: number): string {
  if (
    quantite < 2 ||
    !/^\p{L}+$/u.test(unite) ||
    /[sxz]$/i.test(unite) ||
    MESURES[cleUnite(unite)]
  ) {
    return unite;
  }
  return `${unite}s`;
}

/** Unité de lecture naturelle en cuisine : 1,2 kg plutôt que 1200 g, 25 cl plutôt que 250 ml. */
export function depuisBase(famille: Famille, valeur: number): { quantity: number; unit: string } {
  if (famille === 'masse') {
    return valeur >= 1000
      ? { quantity: arrondir(valeur / 1000), unit: 'kg' }
      : { quantity: arrondir(valeur), unit: 'g' };
  }
  if (valeur >= 1000) return { quantity: arrondir(valeur / 1000), unit: 'l' };
  if (valeur >= 10 && Number.isInteger(arrondir(valeur) / 10)) {
    return { quantity: arrondir(valeur) / 10, unit: 'cl' };
  }
  return { quantity: arrondir(valeur), unit: 'ml' };
}
