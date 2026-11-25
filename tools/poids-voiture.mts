/**
 * Phase 12c — « les voitures et leurs pièces servent-elles ? » (demande du porteur, 26/11/2026).
 * 1. En course : écart-type, entre les partants d'un même Grand Prix, de chaque terme du temps de course (voiture, pilote, forme, aléa),
 *    en % du temps au tour ; part des victoires de la voiture la plus rapide du circuit ; corrélation de rang voiture ↔ arrivée.
 * 2. En développement : gain d'indice de chaque nouvelle pièce montée (points ; 1 point ≈ 0,28 % du temps au tour).
 * Usage : npx tsx tools/poids-voiture.mts [graines=3] [saisons=2]
 */
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const N = Number(process.argv[2] ?? 3), S = Number(process.argv[3] ?? 2);
const et = (v: number[]) => { const m = v.reduce((a, b) => a + b, 0) / v.length; return Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length); };
const moy = (v: number[]) => v.reduce((a, b) => a + b, 0) / Math.max(1, v.length);
const termes: Record<string, number[]> = { voiture: [], pilote: [], forme: [], alea: [] };
let gpN = 0, gpVoitureGagne = 0; const spearman: number[] = []; const gains: number[] = [];
const progres: number[] = [], ecartFin: number[] = [], ecartDebut: number[] = [];
const grille = (m: unknown) => (eng.ecuriesActives(m) as unknown[]).map((e) => eng.indiceMoyen(m, e) as number);
for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g), mo = sc.creerMoteur();
  const vus = new Set(Object.keys(m.evenements));
  const i0 = grille(m); ecartDebut.push(Math.max(...i0) - Math.min(...i0));
  for (let w = 0; w < 52 * S; w++) {
    const avant = new Map(eng.ecuriesActives(m).map((e: { id: string }) => [e.id, eng.indiceMoyen(m, e) as number]));
    mo.avancer(m, 1);
    for (const id of Object.keys(m.evenements)) {
      if (vus.has(id)) continue; vus.add(id);
      const ev = m.evenements[id] as { type: string; contexte: Record<string, unknown>; acteurs: { id: string }[] };
      if (ev.type === 'conception.terminee' && ev.contexte['installee']) {
        const e = eng.ecuriesActives(m).find((x: { id: string }) => x.id === ev.acteurs[0]!.id);
        if (e && m.date.semaine > 2) gains.push(eng.indiceMoyen(m, e) - avant.get(e.id)!);
      }
    }
  }
  const i1 = grille(m); ecartFin.push(Math.max(...i1) - Math.min(...i1)); progres.push((moy(i1) - moy(i0)) / S);
  for (const gp of Object.values(m.tables['grandsprix']) as { termine: boolean; resultats: { position: number | null; rangVoiture: number; explication: Record<string, number> }[] }[]) {
    if (!gp.termine) continue;
    const arr = gp.resultats.filter((r) => r.position);
    for (const k of Object.keys(termes)) termes[k]!.push(et(arr.map((r) => r.explication[k] ?? 0)));
    gpN++; if (arr.find((r) => r.position === 1)?.rangVoiture === 1) gpVoitureGagne++;
    // Spearman simple : rang voiture (meilleur pilote de l'écurie) contre position.
    const n = arr.length, d2 = arr.reduce((a, r) => a + (r.rangVoiture * 2 - 1 - r.position!) ** 2, 0);
    spearman.push(1 - (6 * d2) / (n * (n * n - 1)));
  }
}
console.log(`${N} graines × ${S} saisons, ${gpN} Grands Prix`);
console.log(`Écart-type entre partants (% du temps au tour) : ${Object.entries(termes).map(([k, v]) => `${k} ${moy(v).toFixed(3)}`).join(' · ')}`);
console.log(`Victoires de la voiture la plus rapide du circuit : ${(100 * gpVoitureGagne / gpN).toFixed(0)} %`);
console.log(`Corrélation approchée rang voiture ↔ arrivée : ${moy(spearman).toFixed(2)}`);
const gs = [...gains].sort((a, b) => a - b);
console.log(`Pièces montées : ${gains.length} ; gain d'indice par pièce : moyenne ${moy(gains).toFixed(3)} point (${(moy(gains) * 0.28).toFixed(3)} %), médiane ${gs[Math.floor(gs.length / 2)]?.toFixed(3)}, 90e centile ${gs[Math.floor(gs.length * 0.9)]?.toFixed(3)}`);
console.log(`Progression moyenne de la grille : ${moy(progres).toFixed(2)} point par saison ; écart 1re–dernière voiture : départ ${moy(ecartDebut).toFixed(2)}, fin ${moy(ecartFin).toFixed(2)} points`);
