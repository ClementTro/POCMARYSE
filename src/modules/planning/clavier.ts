import type { KeyboardCoordinateGetter } from '@dnd-kit/core';

const DIRECTIONS: Record<string, { x: number; y: number }> = {
  ArrowRight: { x: 1, y: 0 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowDown: { x: 0, y: 1 },
  ArrowUp: { x: 0, y: -1 },
};

/**
 * Au clavier, chaque flèche amène l'élément sur la case la plus proche dans cette direction
 * (au lieu d'un pas fixe de 25 px), ce qui rend la grille utilisable sans souris.
 */
export const allerALaCaseVoisine: KeyboardCoordinateGetter = (
  event,
  { currentCoordinates, context: { collisionRect, droppableRects, droppableContainers } },
) => {
  const direction = DIRECTIONS[event.code];
  if (!direction || !collisionRect) return undefined;
  event.preventDefault();

  const centre = {
    x: collisionRect.left + collisionRect.width / 2,
    y: collisionRect.top + collisionRect.height / 2,
  };
  let meilleure: { x: number; y: number; distance: number } | null = null;

  for (const conteneur of droppableContainers.getEnabled()) {
    const rect = droppableRects.get(conteneur.id);
    if (!rect) continue;
    const cible = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const dx = cible.x - centre.x;
    const dy = cible.y - centre.y;
    // Seulement les cases situées dans la direction demandée (avec 1 px de tolérance).
    if (dx * direction.x + dy * direction.y <= 1) continue;
    // Pénalise l'écart perpendiculaire pour rester sur la même ligne ou colonne.
    const distance = direction.x
      ? Math.abs(dx) + 3 * Math.abs(dy)
      : Math.abs(dy) + 3 * Math.abs(dx);
    if (!meilleure || distance < meilleure.distance) {
      meilleure = {
        x: rect.left + (rect.width - collisionRect.width) / 2,
        y: rect.top + (rect.height - collisionRect.height) / 2,
        distance,
      };
    }
  }

  return meilleure ? { x: meilleure.x, y: meilleure.y } : currentCoordinates;
};
