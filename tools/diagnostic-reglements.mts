/**
 * Phase 8 — diagnostic des règlements et de la recherche (mesures indicatives, D-120).
 * Usage : npx tsx tools/diagnostic-reglements.mts <graines> <saisons>
 * Mesure (8c aussi) : fuites, rumeurs, révélations ; réformes et prolongations, votes, rebattage de la hiérarchie les années de réforme (contre les autres années),
 * maintien du champion à travers une réforme, découvertes, parts et horizons de recherche, savoir moyen.
 */
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const N = Number(process.argv[2] ?? 20), S = Number(process.argv[3] ?? 20);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));

const moy = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
/** Corrélation de rang de Spearman entre deux classements (listes d'identifiants). */
function spearman(a: string[], b: string[]): number {
  const ids = a.filter((x) => b.includes(x));
  const n = ids.length;
  if (n < 3) return NaN;
  const ra = new Map(ids.map((x) => [x, a.indexOf(x)])), rb = new Map(ids.map((x) => [x, b.indexOf(x)]));
  const ordA = [...ids].sort((x, y) => ra.get(x)! - ra.get(y)!), ordB = [...ids].sort((x, y) => rb.get(x)! - rb.get(y)!);
  const d2 = ids.reduce((s, x) => s + (ordA.indexOf(x) - ordB.indexOf(x)) ** 2, 0);
  return 1 - (6 * d2) / (n * (n * n - 1));
}

let reformes = 0, prolongations = 0, entrees = 0, mineures = 0, decouvertes = 0, revelations = 0, revelationsPresse = 0, fuitesReglement = 0;
const connaisseurs: number[] = [], ouiDire: number[] = [], rumeurs: number[] = [];
const pourChangement: number[] = [];
const rhoReforme: number[] = [], rhoAutres: number[] = [];
let championGardeReforme = 0, championReforme = 0, championGardeAutres = 0, championAutres = 0;
const orientations = new Map<string, number>();
const parts: number[] = [];
const horizons = new Map<string, number>();
const domaines = new Map<string, number>();
const t0 = performance.now();
for (let g = 1; g <= N; g++) {
  const m = sc.creerMonde(g);
  const mo = sc.creerMoteur();
  let precedent: string[] | undefined;
  const vus = new Set<string>();
  for (let s = 0; s < S; s++) {
    let entreeCetteAnnee = false;
    for (let k = 0; k < 52; k++) {
      mo.avancer(m, 1);
      for (const e of Object.values(m.evenements) as any[]) {
        if (vus.has(e.id)) continue;
        if (!e.type.startsWith('reglement.') && e.type !== 'recherche.decouverte' && e.type !== 'information.revelee') continue;
        vus.add(e.id);
        if (e.type === 'reglement.annonce') { reformes++; orientations.set(e.contexte.orientation, (orientations.get(e.contexte.orientation) ?? 0) + 1); pourChangement.push(e.contexte.tour1.reforme / (e.contexte.tour1.reforme + e.contexte.tour1.prolongation)); }
        if (e.type === 'reglement.vote') { prolongations++; pourChangement.push(e.contexte.tour1.reforme / (e.contexte.tour1.reforme + e.contexte.tour1.prolongation)); }
        if (e.type === 'reglement.entree_en_vigueur') { entrees++; entreeCetteAnnee = true; }
        if (e.type === 'reglement.evolution_mineure') mineures++;
        if (e.type === 'recherche.decouverte') decouvertes++;
        if (e.type === 'reglement.fuite') fuitesReglement++;
        if (e.type === 'information.revelee') { revelations++; if (e.contexte.motif === 'presse') revelationsPresse++; }
      }
      if (m.date.semaine === 3) for (const p of eng.programmes(m) as any[]) {
        if (p.statut !== 'actif') continue;
        parts.push(p.part);
        const h = p.horizon === 'actuelle' || p.horizon === 'suivante' ? p.horizon : 'futur règlement';
        horizons.set(h, (horizons.get(h) ?? 0) + 1);
        domaines.set(p.domaine, (domaines.get(p.domaine) ?? 0) + 1);
      }
    }
    for (const f of Object.values(m.tables['faitsSuivis'] ?? {}) as any[]) {
      const e = m.evenements[f.id];
      if (!e) continue;
      connaisseurs.push(e.connuPar.length); ouiDire.push(Object.keys(f.perception).length); rumeurs.push(f.rumeur.length);
    }
    const saison = (Object.values(m.tables['saisons']) as any[]).find((x) => x.annee === m.date.annee - 1);
    const classement: string[] = saison?.constructeurs.map((c: any) => c.ecurie) ?? [];
    if (precedent && classement.length) {
      const rho = spearman(precedent, classement);
      (entreeCetteAnnee ? rhoReforme : rhoAutres).push(rho);
      const garde = precedent[0] === classement[0] ? 1 : 0;
      if (entreeCetteAnnee) { championReforme++; championGardeReforme += garde; } else { championAutres++; championGardeAutres += garde; }
    }
    precedent = classement;
  }
}
const pc = (x: number) => `${(100 * x).toFixed(0)} %`;
console.log(`# Diagnostic règlements et recherche — ${N} graines × ${S} saisons (${((performance.now() - t0) / 1000).toFixed(0)} s)\n`);
console.log('| Indicateur | Valeur |\n| --- | --- |');
console.log(`| Réformes adoptées pour 10 saisons | ${((10 * reformes) / (N * S)).toFixed(2)} |`);
console.log(`| Prolongations votées pour 10 saisons | ${((10 * prolongations) / (N * S)).toFixed(2)} |`);
console.log(`| Entrées en vigueur pour 10 saisons | ${((10 * entrees) / (N * S)).toFixed(2)} |`);
console.log(`| Évolutions mineures par saison | ${(mineures / (N * S)).toFixed(2)} |`);
console.log(`| Part moyenne des voix pour un changement | ${pc(moy(pourChangement))} |`);
console.log(`| Orientations adoptées | ${[...orientations].map(([o, n]) => `${o} ${n}`).join(', ')} |`);
console.log(`| Stabilité du classement d'une saison à l'autre (Spearman), année d'entrée en vigueur | ${moy(rhoReforme).toFixed(2)} (${rhoReforme.length} cas) |`);
console.log(`| Même indicateur, autres années | ${moy(rhoAutres).toFixed(2)} (${rhoAutres.length} cas) |`);
console.log(`| Le champion constructeurs garde son titre, année d'entrée en vigueur | ${pc(championGardeReforme / Math.max(1, championReforme))} |`);
console.log(`| Même indicateur, autres années | ${pc(championGardeAutres / Math.max(1, championAutres))} |`);
console.log(`| Découvertes par saison (toutes écuries) | ${(decouvertes / (N * S)).toFixed(2)} |`);
console.log(`| Avant-projets : écuries qui en ont vent, par réforme préparée | ${(fuitesReglement / Math.max(1, reformes + prolongations)).toFixed(1)} sur 11 |`);
console.log(`| Faits révélés publiquement par saison (dont par la presse) | ${(revelations / (N * S)).toFixed(2)} (${(revelationsPresse / (N * S)).toFixed(2)}) |`);
console.log(`| Faits privés suivis : personnes au courant (moyenne, fin de saison) | ${moy(connaisseurs).toFixed(1)} |`);
console.log(`| … dont informées par ouï-dire / par une rumeur | ${moy(ouiDire).toFixed(1)} / ${moy(rumeurs).toFixed(1)} |`);
console.log(`| Part moyenne d'un programme actif | ${pc(moy(parts))} |`);
console.log(`| Horizons des programmes | ${[...horizons].map(([h, n]) => `${h} ${pc(n / parts.length)}`).join(', ')} |`);
console.log(`| Domaines les plus étudiés | ${[...domaines].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([d, n]) => `${d} ${pc(n / parts.length)}`).join(', ')} |`);
console.log(`| Domaines les moins étudiés | ${[...domaines].sort((a, b) => a[1] - b[1]).slice(0, 3).map(([d, n]) => `${d} ${pc(n / parts.length)}`).join(', ')} |`);
