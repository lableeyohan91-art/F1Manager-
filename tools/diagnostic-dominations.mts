/** Diagnostic des dominations (≥ 120 pts) : voiture, coéquipier, rang du champion. Usage : npm run dominations -- . <graines> <saisons> */
import { resolve } from 'node:path';
const racine = resolve(process.argv[2] ?? '.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const N = Number(process.argv[3] ?? 30), S = Number(process.argv[4] ?? 15);
let dom = 0, tot = 0, voitureN1 = 0, dauphinCoeq = 0, ecartVoit: number[] = [], ecartVoitTous: number[] = [], rangPilote: number[] = [], niveauTitul: number[] = [], niveauTop: number[] = [];
for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g); const mo = sc.creerMoteur();
  for (let s = 0; s < S; s++) {
    mo.avancer(m, 52);
    const ss = (Object.values(m.tables['saisons']) as any[]).filter((x) => x.termine).sort((a, b) => b.annee - a.annee)[0];
    if (!ss) continue;
    tot++;
    const idx = Object.entries(ss.indiceFin as Record<string, number>).sort((a, b) => b[1] - a[1]);
    const e1 = idx[0]![1] - idx[1]![1];
    ecartVoitTous.push(e1);
    const tit = (Object.values(m.tables['personnes']) as any[]).filter((p) => p.poste === 'pilote_titulaire' && p.statut === 'actif');
    const niv = tit.map((p) => eng.niveauPilote(p, false)).sort((a: number, b: number) => b - a);
    niveauTitul.push(niv.reduce((a: number, b: number) => a + b, 0) / niv.length); niveauTop.push(niv[0] - niv[5]);
    const p1 = ss.pilotes[0], p2 = ss.pilotes[1];
    if (p1.points - p2.points >= 120) {
      dom++;
      if (p1.ecurie === idx[0]![0]) voitureN1++;
      if (p1.ecurie === p2.ecurie) dauphinCoeq++;
      ecartVoit.push(e1);
      const champ = m.tables['personnes'][p1.pilote] as any;
      rangPilote.push(niv.indexOf(eng.niveauPilote(champ, false)) + 1);
    }
  }
}
const moy = (v: number[]) => v.reduce((a, b) => a + b, 0) / Math.max(1, v.length);
console.log(`Dominations : ${(100 * dom / tot).toFixed(1)} % des saisons`);
console.log(`… dont champion dans la meilleure voiture : ${(100 * voitureN1 / dom).toFixed(0)} % ; dauphin = coéquipier : ${(100 * dauphinCoeq / dom).toFixed(0)} %`);
console.log(`Écart d'indice voiture 1re–2e : saisons de domination ${moy(ecartVoit).toFixed(2)} contre toutes ${moy(ecartVoitTous).toFixed(2)}`);
console.log(`Rang de niveau du champion parmi les titulaires (dominations) : moyenne ${moy(rangPilote).toFixed(1)}`);
console.log(`Niveau moyen des titulaires ${moy(niveauTitul).toFixed(2)} ; écart 1er–6e pilote ${moy(niveauTop).toFixed(2)}`);
