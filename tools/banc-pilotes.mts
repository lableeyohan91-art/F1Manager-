/**
 * Phase 13 (audit du prompt maître, campagne B, version 1) — les 22 pilotes dans une VOITURE IDENTIQUE, sur les 30 circuits, sec et pluie.
 * Reprend les termes « pilote » de la course (niveau sur le circuit, affinité, nouveauté, forme ; ressources de la 13a pour la gestion des
 * pneus) et l'aléa de course ; la voiture et la pression sont neutralisées. Aucune donnée du monde n'est modifiée.
 * Usage : npx tsx tools/banc-pilotes.mts [courses par circuit] [graine]
 */
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const { ALEA_SIGMA, MULTIPLICATEUR_ALEA_PLUIE, ECART_PILOTE_PAR_POINT, DIFFICULTE_CIRCUIT, EFFET_FORME_MAX, CONFIANCE_REFERENCE } = await import(`${racine}/src/engine/balance/course.ts`);
const { modificateurNiveau } = await import(`${racine}/src/engine/systems/carriere/performance.ts`);

const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const [N, graine] = [Number(process.argv[2] ?? 20), Number(process.argv[3] ?? 1)];
const m = sc.creerMonde(graine); sc.creerMoteur().avancer(m, 2);
const pilotes = eng.pilotesTitulaires(m) as { id: string; nom: string; competences: Record<string, number>; etat: { confiance: number } }[];
const circuits = (Object.values(m.tables['circuits']) as { id: string; nom: string; exigences: Record<string, number>; sensibilites?: { tempsS: number } }[]);
const f = eng.tirageLocal(m, 'banc.pilotes', graine);
for (const pluie of [false, true]) {
  const vict: Record<string, number> = {}, top3: Record<string, number> = {}, ptsMoy: Record<string, number> = {};
  let courses = 0;
  for (const c of circuits) {
    const tours = eng.toursCourse(c), tempsS = eng.tempsTourS(c);
    const base = pilotes.map((p) => {
      const ecart = ECART_PILOTE_PAR_POINT * (DIFFICULTE_CIRCUIT.min + DIFFICULTE_CIRCUIT.parPoint * c.exigences['difficulte']!);
      const mod = modificateurNiveau(m, p as never, c as never);
      const pilote = (eng.niveauPilote(p, pluie, c.exigences) + mod.affinite + mod.nouveaute) * ecart;
      const forme = EFFET_FORME_MAX * Math.max(-1, Math.min(1, (p.etat.confiance - CONFIANCE_REFERENCE) / (100 - CONFIANCE_REFERENCE)));
      const fu = eng.facteurUsure(c, p.competences['gestionPneus'] ?? 10, 16, eng.CONSIGNES_NEUTRES);
      const st = eng.meilleureStrategie(tours, fu, ((21 + 2.5) / tempsS) * 100, pluie);
      const res = eng.courirTours(tours, st, fu, eng.CONSIGNES_NEUTRES, tempsS, undefined, () => false);
      return { p, t: -(pilote + forme) + res.total };
    });
    const sigma = ALEA_SIGMA * (pluie ? MULTIPLICATEUR_ALEA_PLUIE : 1);
    for (let k = 0; k < N; k++) {
      const cl = base.map((b) => ({ id: b.p.id, t: b.t + f.normale(0, sigma) })).sort((a, b) => a.t - b.t);
      vict[cl[0]!.id] = (vict[cl[0]!.id] ?? 0) + 1;
      for (let i = 0; i < 3; i++) top3[cl[i]!.id] = (top3[cl[i]!.id] ?? 0) + 1;
      courses++;
    }
  }
  const tri = pilotes.map((p) => ({ nom: p.nom, v: vict[p.id] ?? 0, t3: top3[p.id] ?? 0 })).sort((a, b) => b.v - a.v);
  console.log(`\n## ${pluie ? 'Pluie' : 'Sec'} — ${courses} courses (30 circuits × ${N}), voiture identique`);
  console.log('| Pilote | Victoires | % | Podiums |\n| --- | --- | --- | --- |');
  for (const x of tri.slice(0, 10)) console.log(`| ${x.nom} | ${x.v} | ${(100 * x.v / courses).toFixed(1)} % | ${x.t3} |`);
  console.log(`Vainqueurs différents : ${tri.filter((x) => x.v > 0).length}`);
}
