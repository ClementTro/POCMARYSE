import { normaliser } from './texte';

describe('normaliser', () => {
  it('retire accents, casse et espaces de bord', () => {
    expect(normaliser('  Œufs à la NEIGE ')).toBe('œufs a la neige');
    expect(normaliser('Crème brûlée')).toBe('creme brulee');
  });
});
