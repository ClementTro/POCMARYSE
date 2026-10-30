/** Minuscules sans accents, pour une recherche tolérante (« creme » trouve « Crème »). */
export function normaliser(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}
