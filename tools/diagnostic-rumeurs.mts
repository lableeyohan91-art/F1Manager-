/**
 * Audit des phases 10–11 — crédibilité des médias : rumeurs répétées (même média, même personne, même saison), personnes données
 * partantes vers plusieurs écuries, articles sans source, vérité des rumeurs selon la fiabilité du média.
 * Usage : npx tsx tools/diagnostic-rumeurs.mts <graines> <saisons>
 */
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const N = Number(process.argv[2] ?? 4), S = Number(process.argv[3] ?? 3);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
let rumeurs = 0, repetees = 0, plusieursEcuries = 0, sansSource = 0, articles = 0;
const parMedia = new Map<string, { vraies: number; total: number }>();
for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g); const mo = sc.creerMoteur(); const vus = new Set<string>();
  const parSaison = new Map<string, number>(); const destinations = new Map<string, Set<string>>();
  for (let k = 0; k < 52 * S; k++) {
    mo.avancerUneSemaine(m);
    for (const a of eng.articles(m) as any[]) {
      if (vus.has(a.id)) continue; vus.add(a.id); articles++;
      if (!m.evenements[a.source]) sansSource++;
      if (a.genre !== 'rumeur') continue;
      rumeurs++;
      const st = parMedia.get(a.media) ?? { vraies: 0, total: 0 }; st.total++; if (a.vraie) st.vraies++; parMedia.set(a.media, st);
      const p = a.sujets.find((x: string) => x.startsWith('per')); const e = a.sujets.find((x: string) => x.startsWith('eq'));
      if (!p) continue;
      const cle = `${a.media}|${p}|${a.date.annee}`; parSaison.set(cle, (parSaison.get(cle) ?? 0) + 1); if (parSaison.get(cle) === 2) repetees++;
      if (e) { const d = `${p}|${a.date.annee}`; const s = destinations.get(d) ?? new Set(); s.add(e); destinations.set(d, s); if (s.size === 3) plusieursEcuries++; }
    }
  }
}
const fiab = Object.fromEntries([...parMedia].map(([k, v]) => [k, `${v.vraies}/${v.total} vraies`]));
console.log(JSON.stringify({ graines: N, saisons: S, articles, articlesSansSourceAuMomentDeLaPublication: sansSource, rumeurs, rumeursRepeteesMemeMediaMemePersonneMemeSaison: repetees, personnesDonneesVers3EcuriesOuPlusLaMemeSaison: plusieursEcuries, veriteParMedia: fiab }, null, 1));
