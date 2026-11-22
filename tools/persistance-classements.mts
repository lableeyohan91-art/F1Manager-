/** Critères 4 et 5 de la fiche de la phase 5 — mesure du « cercle vertueux » : persistance des classements et trajectoires des petites écuries. Usage : tsx ecart.ts <racine du dépôt> <graines> <saisons> */
import { resolve } from 'node:path';
const racine = resolve(process.argv[2] ?? '.');
const N = Number(process.argv[3] ?? 30), S = Number(process.argv[4] ?? 20);
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
let rho3 = 0, nrho = 0, basTop3 = 0, basTop5 = 0, hautBas = 0, series = 0;
const ecartPts: number[] = [];
const sousPlafondParRang: number[][] = Array.from({ length: 11 }, () => []);
for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g); sc.creerMoteur().avancer(m, S * 52 + 1);
  const ss = Object.values(m.tables['saisons']).filter((s: any) => s.termine).sort((a: any, b: any) => a.annee - b.annee) as any[];
  const rangs = ss.map((s) => Object.fromEntries(s.constructeurs.map((c: any, i: number) => [c.ecurie, i + 1])));
  for (let i = 0; i + 3 < rangs.length; i++) { rho3 += eng.spearman(Object.keys(rangs[i]).map((e) => -rangs[i][e]), Object.keys(rangs[i]).map((e) => -rangs[i + 3][e])); nrho++; }
  const bas = Object.keys(rangs[0]).filter((e) => rangs[0][e] >= 9);
  const haut = Object.keys(rangs[0]).filter((e) => rangs[0][e] <= 3);
  for (const e of bas) { series++; if (rangs.slice(1).some((r) => r[e] <= 3)) basTop3++; if (rangs.slice(1).some((r) => r[e] <= 5)) basTop5++; }
  for (const e of haut) if (rangs.slice(1).some((r) => r[e] >= 9)) hautBas++;
  const fins = Object.values(m.tables['finances']) as any[];
  for (const fi of fins) for (const h of fi.historique) {
    const s = ss.find((x) => x.annee === h.annee); if (!s) continue;
    const r = s.constructeurs.findIndex((c: any) => c.ecurie === fi.ecurie);
    sousPlafondParRang[r]!.push(h.plafonnees < 0.97 * 215 ? 1 : 0);
  }
}
const moy = (v: number[]) => v.reduce((a, b) => a + b, 0) / Math.max(1, v.length);
console.log(`Corrélation classement N ↔ N+3 (Spearman) : ${(rho3 / nrho).toFixed(3)}`);
console.log(`Écuries du dernier tiers en 2027 qui atteignent un jour le top 3 : ${(100 * basTop3 / series).toFixed(1)} % ; le top 5 : ${(100 * basTop5 / series).toFixed(1)} %`);
console.log(`Écuries du top 3 en 2027 qui tombent un jour dans le dernier tiers : ${(100 * hautBas / (3 * N)).toFixed(1)} %`);
console.log('Part des années sous le plafond selon le rang : ' + sousPlafondParRang.map((v, i) => `${i + 1}e ${(100 * moy(v)).toFixed(0)}%`).join(' · '));
