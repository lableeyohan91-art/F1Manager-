/**
 * Phase 12c — trajectoire d'une écurie sur plusieurs saisons (demande du porteur : « si je prends Cadillac, puis-je progresser ? »).
 * L'écurie est dirigée par l'IA (référence : ce que fait une direction « moyenne ») ; mêmes graines que les campagnes.
 * Par saison : place au championnat constructeurs, points, meilleur résultat en course, rang de l'indice de la voiture, budget de
 * développement. Usage : npx tsx tools/trajectoire-ecurie.mts [écurie=eq_cadillac] [graines=8] [saisons=10]
 */
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const ID = process.argv[2] ?? 'eq_cadillac', N = Number(process.argv[3] ?? 8), S = Number(process.argv[4] ?? 10);
type Ligne = { place: number; points: number; meilleur: number; rangVoiture: number; dev: number };
const parSaison: Ligne[][] = [];
for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g), mo = sc.creerMoteur();
  for (let s = 0; s < S; s++) {
    const annee = m.date.annee;
    mo.avancer(m, 52);
    const sa = m.tables['saisons'][`ssn_${annee}`] as { constructeurs: { ecurie: string; points: number }[]; calendrier: string[] } | undefined;
    if (!sa) continue;
    const place = sa.constructeurs.findIndex((c) => c.ecurie === ID) + 1;
    const points = sa.constructeurs.find((c) => c.ecurie === ID)?.points ?? 0;
    let meilleur = 99;
    for (const id of sa.calendrier) for (const r of (m.tables['grandsprix'][id] as { resultats: { ecurie: string; position: number | null }[] }).resultats) if (r.ecurie === ID && r.position) meilleur = Math.min(meilleur, r.position);
    const eq = eng.ecuriesActives(m) as { id: string }[];
    const rangVoiture = [...eq].sort((a, b) => eng.indiceMoyen(m, b) - eng.indiceMoyen(m, a)).findIndex((e) => e.id === ID) + 1;
    const fi = (Object.values(m.tables['finances']) as { ecurie: string; historique: { developpement: number }[] }[]).find((f) => f.ecurie === ID);
    (parSaison[s] ??= []).push({ place, points, meilleur, rangVoiture, dev: fi?.historique.at(-1)?.developpement ?? 0 });
  }
}
const moy = (v: number[]) => v.reduce((a, b) => a + b, 0) / Math.max(1, v.length);
console.log(`${ID} dirigée par l'IA — ${N} graines × ${S} saisons\n`);
console.log('| Saison | Place constructeurs (moy. ; min–max) | Points (moy.) | Meilleur résultat (médiane) | Saisons avec des points | Rang de la voiture | Développement payé (M€) |');
console.log('| --- | --- | --- | --- | --- | --- | --- |');
parSaison.forEach((l, i) => {
  const pl = l.map((x) => x.place), me = l.map((x) => x.meilleur).sort((a, b) => a - b);
  console.log(`| ${2027 + i} | ${moy(pl).toFixed(1)} ; ${Math.min(...pl)}–${Math.max(...pl)} | ${moy(l.map((x) => x.points)).toFixed(1)} | ${me[Math.floor(me.length / 2)]} | ${l.filter((x) => x.points > 0).length}/${l.length} | ${moy(l.map((x) => x.rangVoiture)).toFixed(1)} | ${moy(l.map((x) => x.dev)).toFixed(1)} |`);
});
