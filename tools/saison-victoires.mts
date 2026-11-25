/**
 * Phase 12c — victoires de la première saison (2027) selon les notes de départ des voitures : la course complète (pilotes, aléa, pluie,
 * abandons), sur plusieurs graines. Complète tools/banc-grille.mts (rythme pur de la voiture, sans hasard).
 * Usage : npx tsx tools/saison-victoires.mts [graines=10] [fichier de notes] [fichier de motoristes]
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const fichiers = lireDonneesGrille2026(racine);
if (process.argv[3]) fichiers['voitures.csv'] = readFileSync(process.argv[3], 'utf8');
if (process.argv[4]) fichiers['motoristes.csv'] = readFileSync(process.argv[4], 'utf8');
const sc = eng.creerScenarioGrille2026(fichiers);
const N = Number(process.argv[2] ?? 10);
const victoires: Record<string, number> = {}, poles: Record<string, number> = {}, titres: Record<string, number> = {};
let courses = 0;
for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g);
  sc.creerMoteur().avancer(m, 53);
  const s = m.tables['saisons']['ssn_2027'] as { calendrier: string[]; constructeurs: { ecurie: string }[] };
  titres[s.constructeurs[0]!.ecurie] = (titres[s.constructeurs[0]!.ecurie] ?? 0) + 1;
  for (const id of s.calendrier) {
    const gp = m.tables['grandsprix'][id] as { resultats: { ecurie: string; position: number | null; rangVoiture: number }[] };
    const v = gp.resultats.find((r) => r.position === 1);
    if (v) { victoires[v.ecurie] = (victoires[v.ecurie] ?? 0) + 1; courses++; }
    const p = gp.resultats.find((r) => r.rangVoiture === 1);
    if (p) poles[p.ecurie] = (poles[p.ecurie] ?? 0) + 1;
  }
}
const tri = (o: Record<string, number>) => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k.replace('eq_', '')} ${n}`).join(' · ');
console.log(`${N} saisons 2027 (${courses} courses) — notes : ${process.argv[3] ?? 'data/grille-2026/voitures.csv'}`);
console.log(`Victoires : ${tri(victoires)}`);
console.log(`Voiture la plus rapide du circuit : ${tri(poles)}`);
console.log(`Titres constructeurs : ${tri(titres)}`);
