/**
 * Phase 11b — campagne avant/après (D-076, mêmes graines) : poids D-107 contre poids calculés par le profil de vitesse
 * (data/circuits/poids-voiture-profil.json, injectés dans les circuits au début de la partie). Le jeu par défaut n'est pas modifié.
 * Usage : npx tsx tools/campagne-circuits.mts <graines> <saisons> <avant|apres> [sortie.json]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { creerScenarioGrille2026, table, TABLES } from '../src/engine';
import { lireDonneesGrille2026 } from '../src/platform/node/donnees';

const [N, S] = [Number(process.argv[2] ?? 10), Number(process.argv[3] ?? 5)];
const mode = process.argv[4] ?? 'avant', sortie = process.argv[5];
const poids = JSON.parse(readFileSync('data/circuits/poids-voiture-profil.json', 'utf8')).poids as Record<string, Record<string, number>>;
const sc = creerScenarioGrille2026(lireDonneesGrille2026());
const moy = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
function spearman(a: string[], b: string[]): number {
  const n = Math.min(a.length, b.length); if (n < 3) return NaN;
  const rb = new Map(b.map((x, i) => [x, i])); let d2 = 0, m = 0;
  a.forEach((x, i) => { const j = rb.get(x); if (j !== undefined) { d2 += (i - j) ** 2; m++; } });
  return 1 - (6 * d2) / (m * (m * m - 1));
}
const r: Record<string, number[]> = {};
const noter = (k: string, v: number) => { if (Number.isFinite(v)) (r[k] ??= []).push(v); };
const t0 = performance.now();
for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g), mo = sc.creerMoteur();
  if (mode === 'apres') for (const c of Object.values(table(m, TABLES.circuits)) as unknown as { id: string; poidsProfil?: Record<string, number> }[]) if (poids[c.id]) c.poidsProfil = poids[c.id];
  for (let s = 0; s < S; s++) {
    const an = m.date.annee;
    mo.avancer(m, 52);
    const sa = table(m, TABLES.saisons)[`ssn_${an}`] as unknown as { calendrier: string[]; constructeurs: { ecurie: string }[] } | undefined;
    if (!sa) continue;
    const ordreSaison = sa.constructeurs.map((c) => c.ecurie);
    const vainqueurs = new Map<string, number>(); const rho: number[] = []; const ecarts: number[] = [];
    let gagneParChampion = 0;
    for (const id of sa.calendrier) {
      const gp = table(m, TABLES.grandsPrix)[id] as unknown as { resultats: { ecurie: string; position: number | null; ecartPct: number | null }[] };
      const best = new Map<string, number>();
      for (const x of gp.resultats) if (x.position !== null) best.set(x.ecurie, Math.min(best.get(x.ecurie) ?? 99, x.position));
      const ordreGP = [...best.entries()].sort((a, b) => a[1] - b[1]).map(([e]) => e);
      rho.push(spearman(ordreGP, ordreSaison));
      const v = gp.resultats.find((x) => x.position === 1); if (v) { vainqueurs.set(v.ecurie, (vainqueurs.get(v.ecurie) ?? 0) + 1); if (v.ecurie === ordreSaison[0]) gagneParChampion++; }
      const p2 = gp.resultats.find((x) => x.position === 2); if (p2?.ecartPct != null) ecarts.push(p2.ecartPct);
    }
    const nGP = sa.calendrier.length;
    noter('écuries différentes victorieuses / saison', vainqueurs.size);
    noter('part des GP gagnés par l’écurie championne (%)', (100 * gagneParChampion) / nGP);
    noter('concentration des victoires (indice 0–1)', [...vainqueurs.values()].reduce((a, x) => a + (x / nGP) ** 2, 0));
    noter('ressemblance GP / classement final (Spearman)', moy(rho.filter(Number.isFinite)));
    noter('écart vainqueur–2e (% du temps au tour)', moy(ecarts));
  }
  console.error(`graine ${g}`);
}
noter('temps de calcul par saison (s)', (performance.now() - t0) / 1000 / (N * S));
const res = Object.fromEntries(Object.entries(r).map(([k, v]) => [k, +moy(v).toFixed(3)]));
console.log(mode, JSON.stringify(res, null, 1));
if (sortie) writeFileSync(sortie, JSON.stringify(res, null, 1));
