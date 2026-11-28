/**
 * Phase 13b — banc des 22 pilotes SUR LA PISTE (qualifications Q1/Q2/Q3, départ, dépassements), voiture identique, 30 circuits, sec.
 * (1) Victoires, poles, places gagnées en course. (2) Compétences en situation : le même pilote (médian) avec +5 en dépassement, défense
 * ou départs (et freinage, compétence de rythme, pour l'échelle), mêmes tirages (comparaison appariée) → places gagnées à l'arrivée. Aucune donnée du monde n'est modifiée.
 * Usage : npx tsx tools/banc-pilotes-piste.mts [courses par circuit] [graine]
 */
import { resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const { ALEA_SIGMA, ECART_PILOTE_PAR_POINT, DIFFICULTE_CIRCUIT, EFFET_FORME_MAX, CONFIANCE_REFERENCE, QUALIFS, PISTE, ARRETS } = await import(`${racine}/src/engine/balance/course.ts`);
const { modificateurNiveau } = await import(`${racine}/src/engine/systems/carriere/performance.ts`);
const { qualifier, courirSurPiste } = await import(`${racine}/src/engine/systems/saison/course-piste.ts`);
const { Flux, etatInitialFlux } = await import(`${racine}/src/engine/core/hasard.ts`);

// Exploration seulement : PISTE_COMPETENCE=x remplace PISTE.parPointCompetence le temps du banc.
if (process.env.PISTE_COMPETENCE) (PISTE as any).parPointCompetence = Number(process.env.PISTE_COMPETENCE);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const [N, graine] = [Number(process.argv[2] ?? 10), Number(process.argv[3] ?? 1)];
const m = sc.creerMonde(graine); sc.creerMoteur().avancer(m, 2);
type P = { id: string; nom: string; competences: Record<string, number>; etat: { confiance: number } };
const pilotes = eng.pilotesTitulaires(m) as P[];
const circuits = Object.values(m.tables['circuits']) as any[];
const tir = (cle0: string) => (cle: string) => new Flux(etatInitialFlux(graine, `${cle0}|${cle}`));

function course(c: any, k: number, modif?: { id: string; comp: string; plus: number }, dernier?: string) {
  const tours = eng.toursCourse(c), tempsS = eng.tempsTourS(c);
  const fa = tir(`${c.id}|${k}`)('alea');
  const base = pilotes.map((p0) => {
    const p = modif && modif.id === p0.id ? { ...p0, competences: { ...p0.competences, [modif.comp]: (p0.competences[modif.comp] ?? 10) + modif.plus } } : p0;
    const ecart = ECART_PILOTE_PAR_POINT * (DIFFICULTE_CIRCUIT.min + DIFFICULTE_CIRCUIT.parPoint * c.exigences['difficulte']!);
    const mod = modificateurNiveau(m, p as never, c as never);
    const pilote = (eng.niveauPilote(p, false, c.exigences) + mod.affinite + mod.nouveaute) * ecart;
    const forme = EFFET_FORME_MAX * Math.max(-1, Math.min(1, (p.etat.confiance - CONFIANCE_REFERENCE) / (100 - CONFIANCE_REFERENCE)));
    const alea = fa.normale(0, ALEA_SIGMA);
    const fu = eng.facteurUsure(c, p.competences['gestionPneus'] ?? 10, 16, eng.CONSIGNES_NEUTRES);
    const perte = c.course ? c.course.perteVoieS + ARRETS.perteEntreeSortieS : ARRETS.perteVoieS;
    const strategie = eng.meilleureStrategie(tours, fu, ((perte + 2.5) / tempsS) * 100, false);
    const comp = (x: string) => p.competences[x] ?? 10;
    return { p, rythme: pilote + forme - QUALIFS.partFormeWeekend * alea, partant: {
      id: p.id, base: -(pilote + forme) + alea, strategie, fReel: fu, consignes: eng.CONSIGNES_NEUTRES, depart: comp('departs'), depassement: comp('depassement'), defense: comp('defense'), abandonTour: null,
    }, perte };
  });
  const q = qualifier(base.map((b) => ({ id: b.p.id, rythme: b.rythme, regularite: b.p.competences['regularite'] ?? 10 })), QUALIFS.sigma, tir(`${c.id}|${k}|q`));
  if (dernier) q.grille = [...q.grille.filter((x: string) => x !== dernier), dernier];
  const facilite = c.course ? PISTE.faciliteParDifficulte[c.course.difficulteDepassement - 1] : 0.5;
  const e = courirSurPiste(q.grille, base.map((b) => b.partant), tours, tempsS, { facilite, airPerturbe: PISTE.airPerturbeS * (c.exigences.rapides ?? 3) / 3, perteVoieS: base[0]!.perte },
    c.sensibilites?.d1['masseKg'] ?? 0, tir(`${c.id}|${k}|c`));
  return { grille: q.grille, ordre: e.ordre, e };
}

const vict: Record<string, number> = {}, poles: Record<string, number> = {}, gain: Record<string, number> = {};
let n = 0;
for (const c of circuits) for (let k = 0; k < N; k++) {
  const r = course(c, k);
  vict[r.ordre[0]!] = (vict[r.ordre[0]!] ?? 0) + 1; poles[r.grille[0]!] = (poles[r.grille[0]!] ?? 0) + 1;
  for (const p of pilotes) gain[p.id] = (gain[p.id] ?? 0) + (r.grille.indexOf(p.id) - r.ordre.indexOf(p.id));
  n++;
}
const tri = pilotes.map((p) => ({ p, v: vict[p.id] ?? 0, po: poles[p.id] ?? 0, g: (gain[p.id] ?? 0) / n })).sort((a, b) => b.v - a.v);
console.log(`## Sur la piste — ${n} courses (30 circuits × ${N}), voiture identique, sec\n`);
console.log('| Pilote | Victoires | Poles | Places gagnées en course (moy.) | Dépassement | Défense | Départs |\n| --- | --- | --- | --- | --- | --- | --- |');
for (const x of tri) console.log(`| ${x.p.nom} | ${x.v} | ${x.po} | ${x.g.toFixed(2)} | ${x.p.competences['depassement']} | ${x.p.competences['defense']} | ${x.p.competences['departs']} |`);
console.log(`\nVainqueurs différents : ${tri.filter((x) => x.v > 0).length}`);

// Compétences en situation : pilote médian (au classement des victoires/places), +5 points, mêmes tirages.
const median = [...pilotes].sort((a, b) => (gain[a.id] ?? 0) - (gain[b.id] ?? 0))[11]!;
console.log(`\n## Compétences en situation : ${median.nom} avec +5 points (mêmes tirages)\n`);
console.log('| Compétence | Place moyenne à l\'arrivée (base) | Avec +5 | Gain (places) |\n| --- | --- | --- | --- |');
for (const comp of ['depassement', 'defense', 'departs', 'freinage']) {
  let a = 0, b = 0, nn = 0;
  for (const c of circuits) for (let k = 0; k < N; k++) {
    a += course(c, k).ordre.indexOf(median.id) + 1; b += course(c, k, { id: median.id, comp, plus: 5 }).ordre.indexOf(median.id) + 1; nn++;
  }
  console.log(`| ${comp} | ${(a / nn).toFixed(2)} | ${(b / nn).toFixed(2)} | ${((a - b) / nn).toFixed(2)} |`);
}

console.log(`\n## En situation : ${median.nom} part DERNIER (mêmes tirages)\n`);
console.log('| Compétence | Place moyenne à l\'arrivée (base) | Avec +5 | Gain (places) |\n| --- | --- | --- | --- |');
for (const comp of ['depassement', 'defense', 'departs', 'freinage']) {
  let a = 0, b = 0, nn = 0;
  for (const c of circuits) for (let k = 0; k < N; k++) {
    a += course(c, k, undefined, median.id).ordre.indexOf(median.id) + 1; b += course(c, k, { id: median.id, comp, plus: 5 }, median.id).ordre.indexOf(median.id) + 1; nn++;
  }
  console.log(`| ${comp} | ${(a / nn).toFixed(2)} | ${(b / nn).toFixed(2)} | ${((a - b) / nn).toFixed(2)} |`);
}
