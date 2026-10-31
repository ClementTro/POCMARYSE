import { describe, expect, it, vi } from 'vitest';
import { extraireRessources, verifierSite } from './verification.mjs';

const SITE = 'https://asso.github.io/POCMARYSE/';
const SUPABASE = 'https://abcdefghij.supabase.co';

const HTML = `<!doctype html><html><head>
<script type="module" crossorigin src="/POCMARYSE/assets/index-abc.js"></script>
<link rel="modulepreload" crossorigin href="/POCMARYSE/assets/supabase-def.js">
<link rel="stylesheet" crossorigin href="/POCMARYSE/assets/index-xyz.css">
<link rel="icon" href="/POCMARYSE/favicon.svg">
</head><body><div id="root"></div></body></html>`;

/** Faux fetch : une table adresse -> { status, corps }. Toute autre adresse répond 404. */
function fauxFetch(pages) {
  return vi.fn(async (adresse, options = {}) => {
    const cle = `${options.method ?? 'GET'} ${adresse}`;
    const page = pages[cle] ?? pages[adresse];
    const status = page?.status ?? 404;
    const corps = page?.corps ?? '';
    return { status, text: async () => corps };
  });
}

function pagesSaines(surcharge = {}) {
  return {
    [SITE]: { status: 200, corps: HTML },
    'https://asso.github.io/POCMARYSE/assets/index-abc.js': {
      status: 200,
      corps: 'console.log(1)',
    },
    'https://asso.github.io/POCMARYSE/assets/supabase-def.js': {
      status: 200,
      corps: `const u="${SUPABASE}";`,
    },
    'https://asso.github.io/POCMARYSE/assets/index-xyz.css': { status: 200, corps: 'body{}' },
    'https://asso.github.io/POCMARYSE/connexion': { status: 404, corps: HTML },
    [`${SUPABASE}/auth/v1/settings`]: { status: 200, corps: '{}' },
    [`POST ${SUPABASE}/rest/v1/rpc/ping`]: { status: 200, corps: '1' },
    ...surcharge,
  };
}

const options = (pages, extra = {}) => ({
  siteUrl: SITE,
  supabaseUrl: SUPABASE,
  anonKey: 'cle-anon',
  fetchFn: fauxFetch(pages),
  dormir: async () => {},
  ...extra,
});

describe('extraireRessources', () => {
  it('garde les scripts, préchargements et feuilles de style, pas les icônes', () => {
    expect(extraireRessources(HTML, SITE)).toEqual([
      'https://asso.github.io/POCMARYSE/assets/index-abc.js',
      'https://asso.github.io/POCMARYSE/assets/supabase-def.js',
      'https://asso.github.io/POCMARYSE/assets/index-xyz.css',
    ]);
  });
});

describe('verifierSite', () => {
  it('valide un site sain', async () => {
    const { ok, resultats } = await verifierSite(options(pagesSaines()));
    expect(ok).toBe(true);
    expect(resultats.every((r) => r.ok)).toBe(true);
  });

  it("échoue quand l'adresse Supabase est absente du site publié", async () => {
    const pages = pagesSaines({
      'https://asso.github.io/POCMARYSE/assets/supabase-def.js': { status: 200, corps: 'rien' },
    });
    const { ok, resultats } = await verifierSite(options(pages));
    expect(ok).toBe(false);
    expect(resultats.find((r) => r.nom === 'Site relié à Supabase')?.ok).toBe(false);
  });

  it('échoue quand la variable VITE_SUPABASE_URL est absente du dépôt', async () => {
    const { ok, resultats } = await verifierSite(options(pagesSaines(), { supabaseUrl: '' }));
    expect(ok).toBe(false);
    expect(resultats.find((r) => r.nom === 'Site relié à Supabase')?.detail).toMatch(/absente/);
  });

  it('échoue quand un fichier du site manque', async () => {
    const pages = pagesSaines({
      'https://asso.github.io/POCMARYSE/assets/index-abc.js': { status: 404, corps: '' },
    });
    const { ok } = await verifierSite(options(pages));
    expect(ok).toBe(false);
  });

  it('ne bloque pas quand Supabase ne répond pas (projet en pause)', async () => {
    const pages = pagesSaines({
      [`${SUPABASE}/auth/v1/settings`]: { status: 503, corps: '' },
      [`POST ${SUPABASE}/rest/v1/rpc/ping`]: { status: 404, corps: '' },
    });
    const { ok, resultats } = await verifierSite(options(pages));
    expect(ok).toBe(true);
    expect(resultats.filter((r) => !r.ok).map((r) => r.bloquant)).toEqual([false, false]);
  });

  it("réessaie tant qu'un contrôle bloquant échoue, puis réussit", async () => {
    const pages = pagesSaines();
    const fetchFn = fauxFetch(pages);
    let appels = 0;
    const fetchInstable = vi.fn(async (adresse, opts) => {
      appels += 1;
      // La première passe voit l'ancienne page d'accueil (propagation de GitHub Pages).
      if (adresse === SITE && appels < 3) return { status: 404, text: async () => '' };
      return fetchFn(adresse, opts);
    });
    const dormir = vi.fn(async () => {});
    const { ok } = await verifierSite(
      options(pages, { fetchFn: fetchInstable, tentatives: 3, dormir }),
    );
    expect(ok).toBe(true);
    expect(dormir).toHaveBeenCalledTimes(1);
  });

  it('échoue après toutes les tentatives', async () => {
    const dormir = vi.fn(async () => {});
    const { ok } = await verifierSite(options({}, { tentatives: 3, dormir }));
    expect(ok).toBe(false);
    expect(dormir).toHaveBeenCalledTimes(2);
  });

  it('simule un échec immédiatement, sans réessayer', async () => {
    const dormir = vi.fn(async () => {});
    const { ok, resultats } = await verifierSite(
      options(pagesSaines(), { simulerEchec: true, tentatives: 5, dormir }),
    );
    expect(ok).toBe(false);
    expect(resultats.find((r) => r.nom === 'Échec simulé')).toBeTruthy();
    expect(dormir).not.toHaveBeenCalled();
  });
});
