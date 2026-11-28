/**
 * Audit de la phase 13 (prompt maître, partie II, banc obligatoire) — sept philosophies techniques sur les 30 circuits, à « budget »
 * comparable (écarts de paramètres physiques choisis à la main, voir PROTOS), avec la physique du jeu (sensibilités du profil de vitesse,
 * refroidissement selon le mois du Grand Prix). Lecture seule.
 * Usage : npx tsx tools/banc-philosophies.mts
 */
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const m = sc.creerMonde(1);
const zero = { cla: 0, cda: 0, masseKg: 0, muMeca: 0, muMotricite: 0, muFreinage: 0, puissance: 0, refroidissement: 0 };
const PROTOS: Record<string, Partial<typeof zero>> = {
  'fort appui': { cla: 4, cda: 2 }, 'faible traînée': { cda: -4, cla: -2 }, puissance: { puissance: 2 }, motricité: { muMotricite: 4 },
  freinage: { muFreinage: 4 }, 'adhérence mécanique': { muMeca: 3 }, polyvalente: { cla: 1, cda: -0.5, puissance: 0.5, muMotricite: 1, muFreinage: 1, muMeca: 0.75 },
};
const circuits = (Object.values(m.tables['circuits']) as { id: string; nom: string; sensibilites?: unknown; vivier?: { jourHabituel: number } }[]).filter((c) => c.sensibilites);
const gagne: Record<string, number> = {}, rangs: Record<string, number[]> = {};
const temoins: Record<string, string> = { cir_monaco: 'Monaco', cir_monza: 'Monza', cir_suzuka: 'Suzuka', cir_singapour: 'Singapour', cir_mexico: 'Mexico' };
const lignesTemoins: string[] = [];
for (const c of circuits) {
  const mois = c.vivier ? Math.min(12, Math.max(1, Math.ceil(c.vivier.jourHabituel / 30.5))) : undefined;
  const t = Object.entries(PROTOS).map(([n, d]) => ({ n, dt: eng.ecartTempsPct({ ...zero, ...d } as never, c as never, mois) })).sort((a, b) => a.dt - b.dt);
  gagne[t[0]!.n] = (gagne[t[0]!.n] ?? 0) + 1;
  t.forEach((x, i) => (rangs[x.n] ??= []).push(i + 1));
  if (temoins[c.id]) lignesTemoins.push(`| ${temoins[c.id]} | ${t.map((x) => `${x.n} ${x.dt.toFixed(2)}`).join(' · ')} |`);
}
console.log(`| Philosophie | Circuits où elle est la plus rapide (sur ${circuits.length}) | Rang moyen | Meilleur / pire rang |\n| --- | --- | --- | --- |`);
for (const n of Object.keys(PROTOS)) { const r = rangs[n] ?? []; console.log(`| ${n} | ${gagne[n] ?? 0} | ${(r.reduce((a, b) => a + b, 0) / r.length).toFixed(1)} | ${Math.min(...r)} / ${Math.max(...r)} |`); }
console.log('\nCircuits témoins (écart au tour en %, négatif = plus rapide que la référence ; du plus rapide au plus lent) :\n| Circuit | Classement |\n| --- | --- |');
console.log(lignesTemoins.join('\n'));
// Valeur d'un point (+1 %, ou −1 % pour la traînée et la masse) de chaque paramètre, en % du tour, sur les témoins et en moyenne.
const unites: Record<string, Partial<typeof zero>> = { appui: { cla: 1 }, 'traînée −1 %': { cda: -1 }, puissance: { puissance: 1 }, motricité: { muMotricite: 1 }, freinage: { muFreinage: 1 }, 'adhérence méca.': { muMeca: 1 }, 'masse −1 %': { masseKg: -1 } };
console.log('\nGain au tour (%) pour 1 % de mieux sur un seul paramètre :\n| Circuit | ' + Object.keys(unites).join(' | ') + ' |\n|' + ' --- |'.repeat(Object.keys(unites).length + 1));
const moy: Record<string, number> = {};
for (const c of circuits) {
  const v = Object.entries(unites).map(([n, d]) => { const g = eng.ecartTempsPct(zero as never, c as never) - eng.ecartTempsPct({ ...zero, ...d } as never, c as never); moy[n] = (moy[n] ?? 0) + g / circuits.length; return g; });
  if (temoins[c.id]) console.log(`| ${temoins[c.id]} | ${v.map((x) => x.toFixed(3)).join(' | ')} |`);
}
console.log(`| Moyenne des 30 | ${Object.values(moy).map((x) => x.toFixed(3)).join(' | ')} |`);
