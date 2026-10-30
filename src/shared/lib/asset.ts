/** Chemin d'un fichier de `public/`, préfixé par le sous-chemin GitHub Pages (ADR 0006). */
export function asset(chemin: string): string {
  return `${import.meta.env.BASE_URL}${chemin.replace(/^\/+/, '')}`;
}
