/**
 * Audit technique et circuits (demande du porteur, 27/11/2026). Sans hasard, grille de départ, 30 circuits.
 * 1. Importance de chaque caractéristique sur chaque circuit : une voiture du milieu (Haas) reçoit +3 points dans une seule
 *    caractéristique ; gain de temps au tour (%) sur chaque circuit. Repère les caractéristiques trop fortes ou inutiles.
 * 2. Spécialisation : la même voiture poussée au maximum (20) dans une seule caractéristique ; son rang sur chaque circuit
 *    (« peut-on aller chercher des top 5 sur les circuits lents ? »).
 * Usage : npx tsx tools/banc-caracteristiques.mts [écurie=eq_haas]
 */
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const base = lireDonneesGrille2026(racine);
// NEUTRE=1 : la voiture testée reçoit 14 partout (concepts neutres) : on juge les circuits, pas le profil de départ de la voiture.
if (process.env.NEUTRE) {
  const [h, ...l] = base['voitures.csv']!.trim().split('\n'); const H = h!.split(';');
  base['voitures.csv'] = [h, ...l.map((x) => { const v = x.split(';'); if (v[0] === (process.argv[2] ?? 'eq_haas')) for (const c of ['viragesLents', 'viragesRapides', 'vitessePointe', 'efficaciteAero', 'gestionPneus', 'motricite']) { const i = H.indexOf(c); if (i >= 0) v[i] = '14'; } return v.join(';'); })].join('\n') + '\n';
}
const ID = process.argv[2] ?? 'eq_haas';
const CARACS = ['viragesLents', 'viragesRapides', 'vitessePointe', 'efficaciteAero', 'motricite', 'gestionPneus'];
const LIB: Record<string, string> = { viragesLents: 'Virages lents', viragesRapides: 'Virages rapides', vitessePointe: 'Vitesse de pointe', efficaciteAero: 'Efficacité aéro', motricite: 'Motricité', gestionPneus: 'Gestion des pneus' };
const modifier = (col: string, f: (v: number) => number) => {
  const [h, ...l] = base['voitures.csv']!.trim().split('\n'); const H = h!.split(';'); const i = H.indexOf(col);
  return [h, ...l.map((x) => { const v = x.split(';'); if (v[0] === ID) v[i] = String(Math.max(1, Math.min(20, f(Number(v[i]))))); return v.join(';'); })].join('\n') + '\n';
};
const monde = (csv?: string) => { const m = eng.creerScenarioGrille2026(csv ? { ...base, 'voitures.csv': csv } : base).creerMonde(1); return m; };
const m0 = monde();
const circuits = (Object.values(m0.tables['circuits']) as { id: string; nom: string; vivier?: boolean }[]).filter((c) => c.vivier !== false).sort((a, b) => a.nom.localeCompare(b.nom));
const ecurie = (m: any) => (eng.ecuriesActives(m) as any[]).find((e) => e.id === ID);
const indice = (m: any, c: any) => eng.indiceSurCircuit(m, ecurie(m), c) as number;
const rang = (m: any, c: any) => { const L = (eng.ecuriesActives(m) as any[]).map((e) => ({ id: e.id, v: eng.indiceSurCircuit(m, e, c) as number })).sort((a, b) => b.v - a.v); return L.findIndex((x) => x.id === ID) + 1; };
const PCT = 0.28; // 1 point d'indice ≈ 0,28 % du temps au tour
const imp: Record<string, number[]> = {}, spe: Record<string, number[]> = {};
for (const col of CARACS) {
  const mPlus = monde(modifier(col, (v) => v + 3)); const mMax = monde(modifier(col, () => 20));
  imp[col] = circuits.map((c) => (indice(mPlus, c) - indice(m0, c)) * PCT);
  spe[col] = circuits.map((c) => rang(mMax, c));
}
const r0 = circuits.map((c) => rang(m0, c));
const moy = (x: number[]) => x.reduce((a, b) => a + b, 0) / x.length;
console.log(`# Audit des caractéristiques — voiture testée : ${ID.replace('eq_', '')}\n`);
console.log('## 1. Gain de temps au tour pour +3 points dans une seule caractéristique (% ; ≈ 0,85 s par % sur un tour moyen)\n');
console.log(`| Circuit | ${CARACS.map((c) => LIB[c]).join(' | ')} | La plus utile |\n| --- |${CARACS.map(() => ' --- |').join('')} --- |`);
circuits.forEach((c, k) => {
  const v = CARACS.map((col) => imp[col]![k]!); const best = CARACS[v.indexOf(Math.max(...v))]!;
  console.log(`| ${c.nom} | ${v.map((x) => x.toFixed(3)).join(' | ')} | ${LIB[best]} |`);
});
console.log(`| **Moyenne** | ${CARACS.map((col) => `**${moy(imp[col]!).toFixed(3)}**`).join(' | ')} | |`);
console.log(`| Minimum / maximum | ${CARACS.map((col) => `${Math.min(...imp[col]!).toFixed(3)} / ${Math.max(...imp[col]!).toFixed(3)}`).join(' | ')} | |`);
const nbBest = Object.fromEntries(CARACS.map((c) => [c, 0])); circuits.forEach((_, k) => { const v = CARACS.map((col) => imp[col]![k]!); nbBest[CARACS[v.indexOf(Math.max(...v))]!]++; });
console.log(`\nCaractéristique la plus utile, nombre de circuits : ${CARACS.map((c) => `${LIB[c]} ${nbBest[c]}`).join(' · ')}\n`);
console.log(`## 2. Spécialisation : la voiture poussée à 20 dans une seule caractéristique (rang sur chaque circuit ; départ : rang moyen ${moy(r0).toFixed(1)})\n`);
console.log(`| Caractéristique à 20 | Rang moyen | Meilleur rang | Circuits dans le top 5 | Circuits dans le top 3 | Où elle est dans le top 5 |\n| --- | --- | --- | --- | --- | --- |`);
for (const col of CARACS) {
  const r = spe[col]!; const top5 = circuits.filter((_, k) => r[k]! <= 5).map((c) => c.nom);
  console.log(`| ${LIB[col]} | ${moy(r).toFixed(1)} | ${Math.min(...r)} | ${top5.length} | ${r.filter((x) => x <= 3).length} | ${top5.join(', ')} |`);
}
