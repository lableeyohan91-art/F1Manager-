/**
 * Phase 11 — mesure indicative (D-120) : sponsors (concentration, rotation), conseil (team principals renvoyés) et, si les médias existent,
 * image publique, articles, rumeurs, scandales, conférences. Lancer sur deux copies du dépôt (avant / après) avec les mêmes graines.
 * Usage : npx tsx tools/diagnostic-medias.mts <racine du dépôt> <graines> <saisons> [fichier JSON de sortie]
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const racine = resolve(process.argv[2] ?? '.');
const N = Number(process.argv[3] ?? 10), S = Number(process.argv[4] ?? 10);
const sortie = process.argv[5];
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const moy = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const res: Record<string, number[]> = {};
const noter = (k: string, v: number) => (res[k] ??= []).push(v);
for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g);
  const mo = sc.creerMoteur();
  const vus = new Set<string>();
  const compte = new Map<string, number>();
  for (let s = 0; s < S; s++) {
    for (let k = 0; k < 52; k++) {
      mo.avancerUneSemaine(m);
      for (const e of Object.values(m.evenements) as any[]) {
        if (vus.has(e.id)) continue;
        vus.add(e.id);
        compte.set(e.type, (compte.get(e.type) ?? 0) + 1);
        if (e.type === 'media.rumeur') compte.set(e.contexte?.vraie ? 'rumeur.vraie' : 'rumeur.fausse', (compte.get(e.contexte?.vraie ? 'rumeur.vraie' : 'rumeur.fausse') ?? 0) + 1);
      }
    }
    // Revenus de sponsoring de l'année écoulée, par écurie (comptes clôturés dans l'historique).
    const revenus = eng.ecuriesActives(m).map((e: any) => eng.financesDe(m, e.id)?.historique.at(-1)?.sponsors ?? 0).sort((a: number, b: number) => b - a);
    if (revenus[0]) { noter('sponsors premier (M€)', revenus[0]); noter('sponsors dernier (M€)', revenus.at(-1)!); noter('rapport premier / dernier', revenus[0] / Math.max(1, revenus.at(-1)!)); }
    const images = eng.ecuriesActives(m).map((e: any) => e.image ?? 0);
    noter('image écurie max', Math.max(...images));
    noter('image écurie min', Math.min(...images));
    const pers = (Object.values(m.tables.personnes) as any[]).filter((p) => p.statut === 'actif');
    noter('personnes à image < −10', pers.filter((p) => (p.image ?? 0) < -10).length);
  }
  const par = (t: string) => (compte.get(t) ?? 0) / S;
  noter('ruptures de sponsors / saison', par('sponsor.depart') + par('sponsor.rupture'));
  noter('team principals renvoyés / saison', par('conseil.licenciement_tp'));
  noter('scandales / saison', par('media.scandale'));
  noter('déclarations de presse / saison', par('media.declaration'));
  noter('rumeurs vraies / saison', par('rumeur.vraie'));
  noter('rumeurs fausses / saison', par('rumeur.fausse'));
  noter('records battus / saison', par('record.battu'));
  noter('révélations de presse / saison', par('information.revelee'));
  noter('articles conservés en fin de partie', Object.keys(m.tables.articles ?? {}).length);
  noter('sauvegarde (Mo, brute)', eng.serialiser(m).length / 1e6);
  console.error(`graine ${g} terminée`);
}
const moyennes = Object.fromEntries(Object.entries(res).map(([k, v]) => [k, Math.round(moy(v) * 100) / 100]));
console.log(JSON.stringify(moyennes, null, 1));
if (sortie) writeFileSync(sortie, JSON.stringify(moyennes, null, 1));
