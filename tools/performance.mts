/**
 * Audit n°4 — mesure des performances du moteur (avant toute optimisation) :
 * coût d'une semaine, d'une saison et de N saisons ; évolution avec l'âge de la partie ; coût par système ;
 * volumes (personnes, contrats, événements, souvenirs, relations) ; taille de la sauvegarde.
 * Usage : npm run performance -- <saisons> <graine>
 */
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const S = Number(process.argv[2] ?? 50), G = Number(process.argv[3] ?? 1);

const t0 = performance.now();
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const m = sc.creerMonde(G);
const tCreation = performance.now() - t0;
const mo = sc.creerMoteur();
const parSysteme = new Map<string, number>();
for (const s of (mo as unknown as { systemes: { nom: string; executer: (c: unknown) => void }[] }).systemes) {
  const f = s.executer.bind(s);
  s.executer = (c) => { const d = performance.now(); f(c); parSysteme.set(s.nom, (parSysteme.get(s.nom) ?? 0) + performance.now() - d); };
}
const n = (t: string) => Object.keys(m.tables[t] ?? {}).length;
console.log(`Création du monde : ${tCreation.toFixed(0)} ms`);
console.log('saison | durée (s) | semaine max (ms) | personnes | contrats | événements | souvenirs | relations | sauvegarde (Mo brut / gz)');
let semaineMax = 0, total = 0;
for (let s = 1; s <= S; s++) {
  const d = performance.now();
  let max = 0;
  for (let w = 0; w < 52; w++) { const a = performance.now(); mo.avancerUneSemaine(m); max = Math.max(max, performance.now() - a); }
  const duree = (performance.now() - d) / 1000;
  total += duree; semaineMax = Math.max(semaineMax, max);
  if (s === 1 || s % 5 === 0) {
    const texte = eng.serialiser(m);
    console.log(`${String(2026 + s).padEnd(6)} | ${duree.toFixed(2).padStart(9)} | ${max.toFixed(0).padStart(16)} | ${String(n('personnes')).padStart(9)} | ${String(n('contrats')).padStart(8)} | ${String(Object.keys(m.evenements).length).padStart(10)} | ${String(n('souvenirs')).padStart(9)} | ${String(n('relations')).padStart(9)} | ${(texte.length / 1e6).toFixed(2)} / ${(gzipSync(texte).length / 1e6).toFixed(2)}`);
  }
}
console.log(`\nTotal ${S} saisons : ${total.toFixed(1)} s (${(total / S).toFixed(2)} s par saison, ${((total / S / 52) * 1000).toFixed(1)} ms par semaine en moyenne ; semaine la plus longue ${semaineMax.toFixed(0)} ms)`);
console.log('\nCoût par système (cumul, ms) :');
const somme = [...parSysteme.values()].reduce((a, b) => a + b, 0);
for (const [nom, ms] of [...parSysteme.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${nom.padEnd(28)} ${ms.toFixed(0).padStart(8)} ms  ${((100 * ms) / somme).toFixed(1).padStart(5)} %`);
const td = performance.now(); const texte = eng.serialiser(m); const ts = performance.now() - td;
const tl = performance.now(); eng.deserialiser(texte); const tlec = performance.now() - tl;
console.log(`\nSauvegarde : écriture ${ts.toFixed(0)} ms, lecture et validation ${tlec.toFixed(0)} ms`);
