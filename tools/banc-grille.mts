/**
 * Phase 12 — banc de la grille (demande du porteur, 25/11/2026) : « personne ne gagne partout ». Sans hasard.
 * Construit la grille de départ à partir d'un fichier de notes de voitures (par défaut data/grille-2026/voitures.csv, ou une proposition)
 * et classe les 11 voitures sur chacun des 30 circuits du jeu (temps au tour physique sur le tracé réel, moteurs compris), avant toute course.
 * Sorties : les 3 premières voitures par circuit, le nombre de circuits gagnés par voiture, le meilleur et le pire rang de chaque voiture,
 * l'écart moyen entre la 1re et la 2e, et les circuits où une voiture « moins bonne en moyenne » bat une voiture meilleure en moyenne.
 * Usage : npx tsx tools/banc-grille.mts [fichier de notes]
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const fichiers = lireDonneesGrille2026(racine);
const notes = process.argv[2];
if (notes) fichiers['voitures.csv'] = readFileSync(notes, 'utf8');
const m = eng.creerScenarioGrille2026(fichiers).creerMonde(1);
const eq = eng.ecuriesActives(m) as { id: string }[];
const nom = (id: string) => id.replace('eq_', '');
const circuits = (Object.values(m.tables['circuits']) as { id: string; nom: string }[]).sort((a, b) => a.id.localeCompare(b.id));
const rangs: Record<string, number[]> = {}, victoires: Record<string, string[]> = {}, ecarts: number[] = [];
const indices: Record<string, Record<string, number>> = {};
console.log(`Notes : ${notes ?? 'data/grille-2026/voitures.csv'} — ${circuits.length} circuits, ${eq.length} voitures\n`);
console.log('| Circuit | 1re | 2e | 3e | Écart 1re–2e (points) |\n| --- | --- | --- | --- | --- |');
for (const c of circuits) {
  const v = eq.map((e) => ({ id: e.id, v: eng.indiceSurCircuit(m, e, c) as number })).sort((a, b) => b.v - a.v);
  indices[c.id] = Object.fromEntries(v.map((x) => [x.id, x.v]));
  v.forEach((x, i) => (rangs[x.id] ??= []).push(i + 1));
  (victoires[v[0]!.id] ??= []).push(c.nom);
  ecarts.push(v[0]!.v - v[1]!.v);
  console.log(`| ${c.nom} | ${v.slice(0, 3).map((x) => `${nom(x.id)} ${x.v.toFixed(2)}`).join(' | ')} | ${(v[0]!.v - v[1]!.v).toFixed(2)} |`);
}
const moy = (x: number[]) => x.reduce((a, b) => a + b, 0) / x.length;
const parMoyenne = [...eq].sort((a, b) => eng.indiceMoyen(m, b) - eng.indiceMoyen(m, a));
console.log(`\nVoitures les plus rapides sur au moins un circuit : ${Object.keys(victoires).length} ; écart moyen 1re–2e : ${moy(ecarts).toFixed(2)} point (1 point ≈ 0,28 % du temps au tour)\n`);
console.log('| Voiture | Indice moyen | Circuits gagnés | Meilleur rang | Pire rang | Rang moyen | Où elle gagne |\n| --- | --- | --- | --- | --- | --- | --- |');
for (const e of parMoyenne) {
  const r = rangs[e.id]!;
  console.log(`| ${nom(e.id)} | ${eng.indiceMoyen(m, e).toFixed(2)} | ${victoires[e.id]?.length ?? 0} | ${Math.min(...r)} | ${Math.max(...r)} | ${moy(r).toFixed(1)} | ${(victoires[e.id] ?? []).join(', ')} |`);
}
// Inversions : paires (A meilleure en moyenne que B) où B bat A sur au moins un circuit.
let paires = 0, inversees = 0;
for (let i = 0; i < parMoyenne.length; i++) for (let j = i + 1; j < parMoyenne.length; j++) {
  paires++;
  if (circuits.some((c) => indices[c.id]![parMoyenne[j]!.id]! > indices[c.id]![parMoyenne[i]!.id]!)) inversees++;
}
console.log(`\nPaires de voitures dont l'ordre s'inverse sur au moins un circuit : ${inversees} sur ${paires}`);
