/**
 * Phase 11c — mesure indicative (D-120) des revenus de sponsoring, par catégorie d'écurie (classement constructeurs de la
 * saison précédente : tête 1–3, milieu 4–7, fond 8–11). Lancer sur deux copies du dépôt (avant / après) avec les mêmes graines.
 * Usage : npx tsx tools/diagnostic-sponsors.mts <racine du dépôt> <graines> <saisons> [fichier JSON de sortie] [réglage=valeur …]
 *   réglages d'expérience (phase 11c) : experience.sponsoring.variante (1 prudente, 2 audacieuse), .objectif (1 prudent, 2 audacieux, 3 aucun),
 *   .operations (1 tout accepter, 2 tout refuser).
 *
 * Revenu fixe = somme des montants annuels des contrats qui couvrent l'année ; total = comptes clôturés de l'année (historique) ;
 * variable = total − fixe (primes d'objectif, de course, opérations).
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const racine = resolve(process.argv[2] ?? '.');
const N = Number(process.argv[3] ?? 10), S = Number(process.argv[4] ?? 10);
const sortie = process.argv[5] && !process.argv[5].includes('=') ? process.argv[5] : undefined;
const reglages = Object.fromEntries(process.argv.slice(5).filter((a) => a.includes('=')).map((a) => [a.split('=')[0]!, Number(a.split('=')[1])]));
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const moy = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const ect = (a: number[]) => { const m = moy(a); return a.length > 1 ? Math.sqrt(moy(a.map((x) => (x - m) ** 2))) : 0; };
const res: Record<string, number[]> = {};
const noter = (k: string, v: number) => { if (Number.isFinite(v)) (res[k] ??= []).push(v); };
const categorie = (rang: number) => (rang <= 3 ? 'tête' : rang <= 7 ? 'milieu' : 'fond');
for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g);
  Object.assign(m.parametres, reglages);
  const mo = sc.creerMoteur();
  const vus = new Set<string>();
  const compte = new Map<string, number>();
  const parEcurie = new Map<string, number[]>();
  for (let s = 0; s < S; s++) {
    const annee = m.date.annee;
    // Catégorie : classement de la saison précédente (au départ : rang de l'indice voiture).
    const cat = new Map<string, string>();
    for (const e of eng.ecuriesActives(m) as any[]) cat.set(e.id, categorie(eng.rangPrecedent(m, e.id).rang));
    let fixes = new Map<string, number>();
    for (let k = 0; k < 52; k++) {
      mo.avancerUneSemaine(m);
      if (k === 2) fixes = new Map((eng.ecuriesActives(m) as any[]).map((e) => [e.id, eng.revenusSponsors(m, e.id, annee)]));
      for (const e of Object.values(m.evenements) as any[]) {
        if (vus.has(e.id)) continue;
        vus.add(e.id);
        compte.set(e.type, (compte.get(e.type) ?? 0) + 1);
        if (e.type === 'sponsor.operation_proposee') { const id = e.acteurs.find((a: any) => a.role === 'cible')?.id; const c = cat.get(id); if (c) compte.set(`op ${c}`, (compte.get(`op ${c}`) ?? 0) + 1); }
      }
    }
    // La semaine 1 de l'année suivante verse les primes annuelles et clôture les comptes : on avance d'une semaine.
    mo.avancerUneSemaine(m);
    const totaux: number[] = [];
    for (const e of eng.ecuriesActives(m) as any[]) {
      const h = (eng.financesDe(m, e.id)?.historique ?? []).find((x: any) => x.annee === annee);
      if (!h || !cat.has(e.id)) continue;
      const total = h.sponsors ?? 0, fixe = fixes.get(e.id) ?? 0;
      const c = cat.get(e.id)!;
      noter(`total ${c} (M€)`, total);
      noter(`fixe ${c} (M€)`, fixe);
      noter(`variable ${c} (M€)`, total - fixe);
      totaux.push(total);
      (parEcurie.get(e.id) ?? parEcurie.set(e.id, []).get(e.id)!).push(total);
    }
    totaux.sort((a, b) => b - a);
    if (totaux.length) { noter('sponsors premier (M€)', totaux[0]!); noter('sponsors dernier (M€)', totaux.at(-1)!); noter('rapport premier / dernier', totaux[0]! / Math.max(1, totaux.at(-1)!)); noter('sponsoring total du plateau (M€)', totaux.reduce((a, b) => a + b, 0)); }
    const sat = (Object.values(m.tables.contratsSponsoring) as any[]).filter((c) => c.statut === 'actif');
    noter('satisfaction moyenne des contrats actifs', moy(sat.map((c) => c.satisfaction)));
  }
  for (const v of parEcurie.values()) noter('variabilité d’une saison à l’autre (écart type, M€)', ect(v));
  const par = (t: string) => (compte.get(t) ?? 0) / S;
  noter('ruptures de sponsors / saison', par('sponsor.depart'));
  noter('signatures / saison', par('sponsor.signature'));
  noter('renouvellements / saison', par('sponsor.renouvellement'));
  noter('opérations exceptionnelles proposées / saison', par('sponsor.operation_proposee'));
  noter('opérations exceptionnelles acceptées / saison', par('sponsor.operation'));
  noter('versements de primes annuelles (événements) / saison', par('sponsor.prime'));
  for (const c of ['tête', 'milieu', 'fond']) noter(`opérations proposées ${c} / saison`, par(`op ${c}`));
  const variantes: Record<string, number> = {};
  for (const c of Object.values(m.tables.contratsSponsoring) as any[]) if (c.rang !== 'secondaire' && c.variante) variantes[c.variante] = (variantes[c.variante] ?? 0) + 1;
  const tot = Object.values(variantes).reduce((a, b) => a + b, 0) || 1;
  for (const v of ['prudente', 'equilibree', 'audacieuse']) noter(`part des contrats titre/principaux ${v}`, (variantes[v] ?? 0) / tot);
  console.error(`graine ${g} terminée`);
}
const moyennes = Object.fromEntries(Object.entries(res).sort().map(([k, v]) => [k, Math.round(moy(v) * 100) / 100]));
console.log(JSON.stringify(moyennes, null, 1));
if (sortie) writeFileSync(sortie, JSON.stringify(moyennes, null, 1));
