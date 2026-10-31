// Contrôle le site publié (appelé par deploy.yml après chaque déploiement).
// Variables d'environnement : SITE_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY,
// SIMULER_ECHEC ("true" pour tester le retour arrière), TENTATIVES (8 par défaut, 15 s entre chaque).
// Code de sortie : 0 si le site est sain, 1 si un contrôle bloquant échoue.
import { verifierSite } from './lib/verification.mjs';

const siteUrl = process.env.SITE_URL;
if (!siteUrl) {
  console.error('SITE_URL est obligatoire.');
  process.exit(2);
}

const surGitHub = process.env.GITHUB_ACTIONS === 'true';

const { ok, resultats } = await verifierSite({
  siteUrl,
  supabaseUrl: process.env.VITE_SUPABASE_URL ?? '',
  anonKey: process.env.VITE_SUPABASE_ANON_KEY ?? '',
  simulerEchec: process.env.SIMULER_ECHEC === 'true',
  tentatives: Number(process.env.TENTATIVES ?? 8),
  surTentative: (essai, maximum) =>
    console.log(
      `Contrôle ${essai}/${maximum} insuffisant : nouvelle tentative dans 15 secondes...`,
    ),
});

for (const r of resultats) {
  const etat = r.ok ? 'OK       ' : r.bloquant ? 'ÉCHEC    ' : 'ATTENTION';
  console.log(`[${etat}] ${r.nom} : ${r.detail}`);
  if (surGitHub && !r.ok) {
    console.log(`::${r.bloquant ? 'error' : 'warning'} title=${r.nom}::${r.detail}`);
  }
}

console.log(ok ? '\nLe site est sain.' : '\nLe site ne passe pas le contrôle.');
process.exit(ok ? 0 : 1);
