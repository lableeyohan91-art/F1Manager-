/**
 * Phase 12 — tendances des voitures sur la durée (demande du porteur : « pas des voitures à 500 km/h en 10 ans ; des régressions »).
 * Indice moyen de la grille (points équivalents : 1 point = ECART_VOITURE_PAR_POINT % de temps au tour) au début de chaque saison, et
 * variation moyenne l'année d'une grande réforme contre une année normale.
 * Usage : npx tsx tools/tendances-voitures.mts [graines=4] [saisons=30]
 */
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const N = Number(process.argv[2] ?? 4), S = Number(process.argv[3] ?? 30);
const parAnnee: number[][] = [];
const variationsReforme: number[] = [], variationsNormales: number[] = [];
for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g), mo = sc.creerMoteur();
  let avant = NaN;
  for (let s = 0; s < S; s++) {
    mo.avancer(m, 52);
    const moy = eng.ecuriesActives(m).reduce((a: number, e: unknown) => a + eng.indiceMoyen(m, e), 0) / eng.ecuriesActives(m).length;
    (parAnnee[s] ??= []).push(moy);
    const reforme = Object.values(m.evenements).some((ev: { type: string; date: { annee: number } }) => ev.type === 'reglement.entree_en_vigueur' && ev.date.annee === m.date.annee);
    if (Number.isFinite(avant)) (reforme ? variationsReforme : variationsNormales).push(moy - avant);
    avant = moy;
  }
}
const moyenne = (v: number[]) => v.reduce((a, b) => a + b, 0) / Math.max(1, v.length);
console.log(`${N} graines × ${S} saisons — indice moyen de la grille au début de la saison (points ; ${eng.ECART_VOITURE_PAR_POINT ?? 0.28} % par point)`);
console.log(parAnnee.map((v, i) => `${2028 + i}: ${moyenne(v).toFixed(2)}`).join(' · '));
console.log(`Variation moyenne : année de grande réforme ${moyenne(variationsReforme).toFixed(2)} points (${variationsReforme.length} cas) ; année normale ${moyenne(variationsNormales).toFixed(2)} points`);
