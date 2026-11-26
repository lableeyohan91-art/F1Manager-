/**
 * D-180, levier B — précision du tableau de bord prévisionnel. Pour chaque écurie et chaque saison, prévision faite aux semaines 2, 14, 27
 * et 40 (trésorerie de fin d'année avant dividendes, dividendes), comparée au bilan réel. Imprévus compris dans l'écart (retrait du
 * propriétaire, emprunts, primes de sponsors). Aucun réglage modifié.
 * Usage : npx tsx tools/precision-previsions.mts <graine de départ> <nombre de graines> <saisons> <sortie.json>
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const [g0, ng, S, sortie] = [Number(process.argv[2] ?? 1), Number(process.argv[3] ?? 1), Number(process.argv[4] ?? 10), process.argv[5] ?? 'prev.json'];
const SEMAINES = [2, 14, 27, 40];
const lignes: unknown[] = [];
for (let g = g0; g < g0 + ng; g++) {
  const m = sc.creerMonde(g), mo = sc.creerMoteur();
  mo.avancer(m, 1); // semaine 1 de la première année
  for (let s = 0; s < S; s++) {
    const annee = m.date.annee;
    const prev: Record<string, Record<number, { fin: number; div: number; plafonne: number; nonDep: number; retrait: boolean; devRestant: number; devDeja: number }>> = {};
    for (const w of SEMAINES) {
      while (m.date.semaine < w) mo.avancer(m, 1);
      for (const e of eng.ecuriesActives(m) as { id: string }[]) {
        const p = eng.previsionFinances(m, e.id);
        if (!p) continue;
        const fi = eng.financesDe(m, e.id);
        (prev[e.id] ??= {})[w] = { fin: p.tresorerie.finAvantDividendes, div: p.dividendes.montant, plafonne: p.plafond.depense + p.plafond.aVenir, nonDep: p.developpement.nonDepensable, devRestant: p.depenses.developpement, devDeja: fi.comptes.developpement, retrait: !!(fi.chocApport && fi.chocApport.annee === annee) };
      }
    }
    while (m.date.annee === annee) mo.avancer(m, 1);
    mo.avancer(m, 1); // clôture (semaine 1)
    for (const e of eng.ecuriesActives(m) as { id: string }[]) {
      const fi = eng.financesDe(m, e.id);
      const h = fi.historique.find((x: { annee: number }) => x.annee === annee);
      if (!h || !prev[e.id]) continue;
      lignes.push({ graine: g, annee, ecurie: e.id, reel: { fin: h.tresorerieFin + h.dividendes, div: h.dividendes, plafonne: h.plafonnees, dev: h.developpement }, prev: prev[e.id] });
    }
  }
  console.log(`graine ${g} terminée`);
}
writeFileSync(sortie, JSON.stringify(lignes));
