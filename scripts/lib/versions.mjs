// Fonctions pures sur les versions et le journal des changements (CHANGELOG.md).
// Aucune entrée-sortie ici : tout est testé dans versions.test.mjs.

const FORMAT_VERSION = /^(\d+)\.(\d+)\.(\d+)$/;

/** Découpe « 1.2.3 » (ou « v1.2.3 ») en [1, 2, 3]. */
export function decouperVersion(version) {
  const m = FORMAT_VERSION.exec(String(version).trim().replace(/^v/, ''));
  if (!m) throw new Error(`Version illisible : « ${version} »`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** Calcule la version suivante. Les montées majeures sont réservées à une personne technique. */
export function incrementerVersion(version, type) {
  const [majeure, mineure, correctif] = decouperVersion(version);
  if (type === 'patch') return `${majeure}.${mineure}.${correctif + 1}`;
  if (type === 'minor') return `${majeure}.${mineure + 1}.0`;
  throw new Error(`Type de version inconnu : « ${type} » (attendu : patch ou minor)`);
}

/** Compare deux versions : négatif si a < b, positif si a > b, 0 si égales. */
export function comparerVersions(a, b) {
  const x = decouperVersion(a);
  const y = decouperVersion(b);
  for (let i = 0; i < 3; i += 1) {
    if (x[i] !== y[i]) return x[i] - y[i];
  }
  return 0;
}

/** Garde les tags « vX.Y.Z » et les trie du plus récent au plus ancien. */
export function trierTags(tags) {
  return tags
    .map((t) => t.trim())
    .filter((t) => /^v\d+\.\d+\.\d+$/.test(t))
    .sort((a, b) => comparerVersions(b, a));
}

/** Le tag le plus récent strictement inférieur à `version` (la « version précédente »), ou null. */
export function tagPrecedent(version, tags) {
  return trierTags(tags).find((t) => comparerVersions(t, version) < 0) ?? null;
}

const SECTION_NON_PUBLIE = /(## \[Non publié\]\n)([\s\S]*?)(?=\n## \[|$)/;

function normaliser(texte) {
  return texte.replace(/\r\n/g, '\n');
}

/** Contenu de la section « Non publié » (sans le titre). */
export function extraireNonPublie(changelog) {
  const m = SECTION_NON_PUBLIE.exec(normaliser(changelog));
  return m ? m[2].trim() : '';
}

/** Vrai s'il n'y a aucune ligne de liste dans le texte donné. */
export function changelogVide(corps) {
  return !/^\s*-\s+\S/m.test(corps);
}

/** Range le contenu de « Non publié » sous une nouvelle version datée et laisse « Non publié » vide. */
export function publierChangelog(changelog, version, dateIso) {
  const texte = normaliser(changelog);
  const m = SECTION_NON_PUBLIE.exec(texte);
  if (!m) throw new Error('Section « Non publié » introuvable dans CHANGELOG.md');
  const corps = m[2].trim();
  if (changelogVide(corps)) throw new Error('Rien à publier : la section « Non publié » est vide');
  const nouveau = `## [Non publié]\n\n## [${version}] - ${dateIso}\n\n${corps}\n`;
  return texte.replace(SECTION_NON_PUBLIE, () => nouveau);
}

/** Ajoute une ligne à la section « Non publié » (sous « ### Corrigé », créé au besoin). */
export function ajouterNote(changelog, note, rubrique = 'Corrigé') {
  const texte = normaliser(changelog);
  const m = SECTION_NON_PUBLIE.exec(texte);
  if (!m) throw new Error('Section « Non publié » introuvable dans CHANGELOG.md');
  const corps = m[2].trim();
  const titre = `### ${rubrique}`;
  let nouveauCorps;
  if (corps.includes(`${titre}\n\n`)) {
    nouveauCorps = corps.replace(`${titre}\n\n`, () => `${titre}\n\n- ${note}\n`);
  } else {
    nouveauCorps = `${corps ? `${corps}\n\n` : ''}${titre}\n\n- ${note}`;
  }
  return texte.replace(SECTION_NON_PUBLIE, () => `## [Non publié]\n\n${nouveauCorps}\n`);
}

/** Date du jour au format AAAA-MM-JJ (heure locale). */
export function dateDuJour(date = new Date()) {
  const deux = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${deux(date.getMonth() + 1)}-${deux(date.getDate())}`;
}
