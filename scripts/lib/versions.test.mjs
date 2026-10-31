import { describe, expect, it } from 'vitest';
import {
  ajouterNote,
  changelogVide,
  comparerVersions,
  dateDuJour,
  extraireNonPublie,
  incrementerVersion,
  publierChangelog,
  tagPrecedent,
  trierTags,
} from './versions.mjs';

const CHANGELOG = `# Changelog

Intro.

## [Non publié]

### Ajouté

- Une nouvelle chose.

## [1.0.1] - 2026-10-31

### Ajouté

- Les photos.

## [1.0.0] - 2026-10-30

- Première version.
`;

describe('incrementerVersion', () => {
  it('incrémente le correctif', () => {
    expect(incrementerVersion('1.0.1', 'patch')).toBe('1.0.2');
  });

  it('incrémente la mineure et remet le correctif à zéro', () => {
    expect(incrementerVersion('1.4.7', 'minor')).toBe('1.5.0');
  });

  it('refuse les montées majeures et les types inconnus', () => {
    expect(() => incrementerVersion('1.0.0', 'major')).toThrow(/inconnu/);
  });

  it('refuse une version illisible', () => {
    expect(() => incrementerVersion('1.0', 'patch')).toThrow(/illisible/);
  });
});

describe('comparerVersions et tags', () => {
  it('compare numériquement', () => {
    expect(comparerVersions('1.10.0', '1.9.0')).toBeGreaterThan(0);
    expect(comparerVersions('v1.0.0', '1.0.0')).toBe(0);
  });

  it('trie les tags du plus récent au plus ancien en ignorant le reste', () => {
    expect(trierTags(['v1.0.0', 'v1.10.0', 'v1.2.0', 'essai', 'v2.0.0-rc1'])).toEqual([
      'v1.10.0',
      'v1.2.0',
      'v1.0.0',
    ]);
  });

  it('trouve la version précédente', () => {
    const tags = ['v1.0.0', 'v1.0.1', 'v1.1.0'];
    expect(tagPrecedent('1.1.0', tags)).toBe('v1.0.1');
    expect(tagPrecedent('1.1.1', tags)).toBe('v1.1.0');
    expect(tagPrecedent('1.0.0', tags)).toBeNull();
  });
});

describe('journal des changements', () => {
  it('extrait la section Non publié', () => {
    expect(extraireNonPublie(CHANGELOG)).toBe('### Ajouté\n\n- Une nouvelle chose.');
  });

  it('détecte une section vide ou sans liste', () => {
    expect(changelogVide('')).toBe(true);
    expect(changelogVide('### Ajouté')).toBe(true);
    expect(changelogVide('### Ajouté\n\n- Une chose.')).toBe(false);
  });

  it('range le contenu sous la nouvelle version', () => {
    const resultat = publierChangelog(CHANGELOG, '1.1.0', '2026-11-02');
    expect(resultat).toContain(
      '## [Non publié]\n\n## [1.1.0] - 2026-11-02\n\n### Ajouté\n\n- Une nouvelle chose.\n',
    );
    expect(resultat).toContain('\n## [1.0.1] - 2026-10-31');
    expect(extraireNonPublie(resultat)).toBe('');
  });

  it('refuse de publier sans rien dans Non publié', () => {
    const vide = CHANGELOG.replace('### Ajouté\n\n- Une nouvelle chose.\n\n', '');
    expect(() => publierChangelog(vide, '1.1.0', '2026-11-02')).toThrow(/vide/);
  });

  it('accepte les fins de ligne Windows', () => {
    const resultat = publierChangelog(CHANGELOG.replace(/\n/g, '\r\n'), '1.1.0', '2026-11-02');
    expect(resultat).not.toContain('\r');
    expect(resultat).toContain('## [1.1.0] - 2026-11-02');
  });

  it('ajoute une note dans une rubrique existante ou nouvelle', () => {
    const vide = '## [Non publié]\n\n## [1.0.0] - 2026-10-30\n\n- Première version.\n';
    const avecNote = ajouterNote(vide, 'Annulation de v1.1.0.');
    expect(extraireNonPublie(avecNote)).toBe('### Corrigé\n\n- Annulation de v1.1.0.');
    expect(avecNote).toContain('\n## [1.0.0] - 2026-10-30');

    const dansExistant = ajouterNote(avecNote, 'Autre.');
    expect(extraireNonPublie(dansExistant)).toBe(
      '### Corrigé\n\n- Autre.\n- Annulation de v1.1.0.',
    );
  });
});

describe('dateDuJour', () => {
  it('formate en AAAA-MM-JJ', () => {
    expect(dateDuJour(new Date(2026, 10, 2))).toBe('2026-11-02');
  });
});
