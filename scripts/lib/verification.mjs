// Contrôle du site publié. Utilisé par deploy.yml (après chaque déploiement), garder-actif.yml et
// `npm run diagnostic`. `fetchFn` et `dormir` sont injectables pour les tests.

const DELAI_REQUETE_MS = 15_000;

/** Adresses des scripts et feuilles de style référencés par une page HTML. */
export function extraireRessources(html, base) {
  const adresses = new Set();
  for (const balise of html.match(/<(?:script|link)\b[^>]*>/gi) ?? []) {
    const estScript = /^<script/i.test(balise);
    const rel = /\brel=["']([^"']+)["']/i.exec(balise)?.[1] ?? '';
    const attribut = estScript ? 'src' : 'href';
    const valeur = new RegExp(`\\b${attribut}=["']([^"']+)["']`, 'i').exec(balise)?.[1];
    if (!valeur) continue;
    if (!estScript && !/modulepreload|stylesheet/i.test(rel)) continue;
    adresses.add(new URL(valeur, base).href);
  }
  return [...adresses];
}

function sansBarreFinale(adresse) {
  return adresse.replace(/\/+$/, '');
}

async function demander(fetchFn, adresse, options = {}) {
  return fetchFn(adresse, {
    redirect: 'follow',
    signal: AbortSignal.timeout(DELAI_REQUETE_MS),
    ...options,
  });
}

/** Une passe de contrôles. Chaque résultat : { nom, ok, bloquant, detail }. */
async function unePasse({ siteUrl, supabaseUrl, anonKey, simulerEchec, fetchFn }) {
  const resultats = [];
  const ajouter = (nom, ok, detail, bloquant = true) =>
    resultats.push({ nom, ok, bloquant, detail });
  const base = `${sansBarreFinale(siteUrl)}/`;

  // 1. Page d'accueil
  let html = '';
  try {
    const reponse = await demander(fetchFn, base);
    html = await reponse.text();
    ajouter(
      "Page d'accueil",
      reponse.status === 200 && html.includes('id="root"'),
      `HTTP ${reponse.status}`,
    );
  } catch (erreur) {
    ajouter("Page d'accueil", false, `injoignable (${erreur.message})`);
  }

  // 2. Fichiers du site (scripts et styles)
  const ressources = html ? extraireRessources(html, base) : [];
  let contenuJs = '';
  const manquantes = [];
  for (const adresse of ressources) {
    try {
      const reponse = await demander(fetchFn, adresse);
      if (reponse.status !== 200) {
        manquantes.push(`${adresse} (HTTP ${reponse.status})`);
      } else if (/\.js(\?|$)/.test(adresse)) {
        contenuJs += await reponse.text();
      }
    } catch (erreur) {
      manquantes.push(`${adresse} (${erreur.message})`);
    }
  }
  ajouter(
    'Fichiers du site',
    ressources.length > 0 && manquantes.length === 0,
    manquantes.length > 0
      ? `fichiers introuvables : ${manquantes.join(', ')}`
      : `${ressources.length} fichiers chargés`,
  );

  // 3. Le site publié connaît bien l'adresse de Supabase (sinon : variables du dépôt manquantes)
  if (!supabaseUrl) {
    ajouter(
      'Site relié à Supabase',
      false,
      'la variable VITE_SUPABASE_URL est absente des variables du dépôt GitHub',
    );
  } else {
    const hote = new URL(supabaseUrl).host;
    ajouter(
      'Site relié à Supabase',
      contenuJs.includes(hote),
      contenuJs.includes(hote)
        ? 'adresse Supabase présente dans le site publié'
        : "l'adresse Supabase est absente du site publié (variables du dépôt manquantes lors du build ?)",
    );
  }

  // 4. Une adresse profonde doit ouvrir l'application (404.html de repli)
  try {
    const reponse = await demander(fetchFn, `${base}connexion`);
    const page = await reponse.text();
    ajouter(
      'Adresse directe (404.html)',
      (reponse.status === 200 || reponse.status === 404) && page.includes('id="root"'),
      `HTTP ${reponse.status}`,
    );
  } catch (erreur) {
    ajouter('Adresse directe (404.html)', false, `injoignable (${erreur.message})`);
  }

  // 5. Supabase répond (non bloquant : un projet en pause ne se répare pas par un retour arrière)
  if (supabaseUrl && anonKey) {
    const entetes = { apikey: anonKey, Authorization: `Bearer ${anonKey}` };
    const racine = sansBarreFinale(supabaseUrl);
    try {
      const reponse = await demander(fetchFn, `${racine}/auth/v1/settings`, { headers: entetes });
      ajouter(
        'Supabase répond',
        reponse.status === 200,
        reponse.status === 200
          ? 'le service de connexion répond'
          : `HTTP ${reponse.status} : le projet est peut-être en pause (à relancer dans le tableau de bord Supabase)`,
        false,
      );
    } catch (erreur) {
      ajouter(
        'Supabase répond',
        false,
        `injoignable (${erreur.message}) : projet en pause ?`,
        false,
      );
    }

    try {
      const reponse = await demander(fetchFn, `${racine}/rest/v1/rpc/ping`, {
        method: 'POST',
        headers: { ...entetes, 'Content-Type': 'application/json' },
        body: '{}',
      });
      ajouter(
        'Base de données (ping)',
        reponse.status === 200,
        reponse.status === 200
          ? 'la base répond'
          : `HTTP ${reponse.status} : la migration 0002_ping.sql est-elle appliquée dans Supabase ?`,
        false,
      );
    } catch (erreur) {
      ajouter('Base de données (ping)', false, `injoignable (${erreur.message})`, false);
    }
  }

  // 6. Échec simulé, pour tester le retour arrière automatique
  if (simulerEchec) {
    ajouter('Échec simulé', false, 'test du retour arrière : cet échec est voulu');
  }

  return resultats;
}

const dormirParDefaut = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Contrôle le site, avec plusieurs tentatives tant qu'un contrôle bloquant échoue
 * (le temps que GitHub Pages propage la nouvelle version).
 * Retourne { ok, resultats } ; `ok` est faux si un contrôle bloquant échoue.
 */
export async function verifierSite({
  siteUrl,
  supabaseUrl = '',
  anonKey = '',
  simulerEchec = false,
  fetchFn = fetch,
  tentatives = 1,
  attenteMs = 15_000,
  dormir = dormirParDefaut,
  surTentative = () => {},
}) {
  // Un échec simulé est immédiat : inutile d'attendre la propagation de GitHub Pages.
  const maximum = simulerEchec ? 1 : tentatives;
  let resultats = [];
  for (let essai = 1; essai <= maximum; essai += 1) {
    resultats = await unePasse({ siteUrl, supabaseUrl, anonKey, simulerEchec, fetchFn });
    const echecBloquant = resultats.some((r) => !r.ok && r.bloquant);
    if (!echecBloquant || essai === maximum) break;
    surTentative(essai, maximum, resultats);
    await dormir(attenteMs);
  }
  return { ok: !resultats.some((r) => !r.ok && r.bloquant), resultats };
}
