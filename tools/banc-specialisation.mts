/**
 * Phase 11b — banc de spécialisation (audit APEX Lab, point 6). Reproductible, sans hasard.
 *
 * Voitures : la voiture de référence améliorée sur UNE caractéristique modélisée (registre src/engine/circuits/specialisation.ts),
 * dosée pour que toutes aient la même performance globale : même gain moyen (GAIN_CIBLE_S) sur les 24 circuits du calendrier,
 * au réglage d'ailerons de la référence. Les caractéristiques futures (refroidissement, pneus) sont listées comme NON TESTÉES.
 *
 * Deux lectures, présentées ensemble :
 *   « réglage identique » : toutes les voitures au niveau d'ailerons naturel de la référence (philosophie pure) ;
 *   « réglage optimisé »  : chaque voiture à son propre niveau d'ailerons naturel (ce que ferait une écurie).
 *
 * Sorties : temps au tour, écart à la référence et à la polyvalente, rang, gains par portion (5 circuits test), sensibilités
 * de chaque voiture, puis sur les 26 tracés : meilleur et pire circuit, inversions, fréquence de domination.
 * Usage : npx tsx tools/banc-specialisation.mts [sortie JSON]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { appuiNaturel, avecAilerons, courbures, profilVitesse, sensibilites, type Profil, type Trace } from '../src/engine/circuits/profil';
import { CLASSES_VIRAGES, VOITURE_REFERENCE } from '../src/engine/balance/profil';
import { CARACTERISTIQUES, voitureSpecialisee, type Caracteristique } from '../src/engine/circuits/specialisation';

/** Gain moyen visé sur le calendrier pour chaque voiture spécialisée (s par tour) : un écart de l'ordre d'une saison de développement. */
const GAIN_CIBLE_S = 0.5;
const TEST = ['cir_monza', 'cir_monaco', 'cir_suzuka', 'cir_singapour', 'cir_mexico'];
const calendrier = readFileSync('data/grille-2026/circuits.csv', 'utf8').trim().split('\n').slice(1).map((l) => l.split(';')[0]!);
const fichier = (id: string) => ['data/circuits', 'data/circuits/validation', 'data/circuits/reconstruits'].map((d) => `${d}/${id}.json`).find(existsSync) ?? `data/circuits/${id}.json`;
/** Vivier complet (30 circuits) : data/circuits/caracteres.csv. */
const vivier = readFileSync('data/circuits/caracteres.csv', 'utf8').trim().split('\n').slice(1).map((l) => l.split(';')[0]!);
const ids = [...new Set([...TEST, ...calendrier, ...vivier])].filter((id) => existsSync(fichier(id)));

type T = Trace & { altitudeM: number; tempsTourS: { mediane: number } };
const circ = Object.fromEntries(ids.map((id) => {
  const t = JSON.parse(readFileSync(fichier(id), 'utf8')) as T;
  const c = { altitudeM: t.altitudeM ?? 0 }, k = courbures(t);
  const { niveau, profil } = appuiNaturel(t, VOITURE_REFERENCE, c, k);
  return [id, { t, c, k, niveau, ref: profil }];
}));

const modelisees = CARACTERISTIQUES.filter((x) => x.statut === 'modelisee');
const futures = CARACTERISTIQUES.filter((x) => x.statut === 'future');
const cal = calendrier.filter((id) => circ[id]);
const tempsFixe = (id: string, v: typeof VOITURE_REFERENCE) => profilVitesse(circ[id]!.t, avecAilerons(v, circ[id]!.niveau), circ[id]!.c, circ[id]!.k);
const gainMoyen = (c: Caracteristique, x: number) => cal.reduce((a, id) => a + circ[id]!.ref.tempsS - tempsFixe(id, voitureSpecialisee(VOITURE_REFERENCE, c, x)).tempsS, 0) / cal.length;

// 1. Dosage : intensité telle que le gain moyen sur le calendrier vaille GAIN_CIBLE_S (sécante, 4 itérations).
const intensite: Record<string, number> = {};
for (const c of modelisees) {
  let x0 = 0, g0 = 0, x1 = 0.05, g1 = gainMoyen(c, x1);
  for (let i = 0; i < 4 && Math.abs(g1 - GAIN_CIBLE_S) > 0.002; i++) {
    const x2 = x1 + ((GAIN_CIBLE_S - g1) * (x1 - x0)) / (g1 - g0);
    [x0, g0, x1] = [x1, g1, Math.max(0.001, x2)];
    g1 = gainMoyen(c, x1);
  }
  intensite[c.id] = x1;
  console.error(`dosage ${c.id} : +${(x1 * 100).toFixed(1)} % → gain moyen ${g1.toFixed(3)} s`);
}
const voitures = Object.fromEntries(modelisees.map((c) => [c.id, voitureSpecialisee(VOITURE_REFERENCE, c, intensite[c.id]!)]));

// 2. Gains par portion (référence de découpage : profil de la voiture de référence).
function portion(p: Profil, i: number): string {
  const l = p.limites[i]!, v = p.vitesses[i]! * 3.6;
  if (l === 'freinage') return 'freinages';
  if (l === 'motricite') return 'sortiesDeVirage';
  if (l === 'puissance' || l === 'butee') return 'lignesDroites';
  return v < CLASSES_VIRAGES.lentMaxKmh ? 'viragesLents' : v < CLASSES_VIRAGES.moyenMaxKmh ? 'viragesMoyens' : 'viragesRapides';
}
function parPortion(id: string, p: Profil): Record<string, number> {
  const { ref, t } = circ[id]!, r: Record<string, number> = {};
  ref.vitesses.forEach((vr, i) => { const k = portion(ref, i); r[k] = (r[k] ?? 0) + t.pasM / Math.max(vr, 1) - t.pasM / Math.max(p.vitesses[i]!, 1); });
  return Object.fromEntries(Object.entries(r).map(([k, x]) => [k, +x.toFixed(3)]));
}

// 3. Mesures sur chaque circuit.
const res: Record<string, unknown> = {};
const ecarts: Record<string, Record<string, { fixe: number; optimise: number }>> = {};
for (const id of ids) {
  const { ref, t, c, k } = circ[id]!;
  const ligne: Record<string, unknown> = {};
  ecarts[id] = {};
  for (const car of modelisees) {
    const v = voitures[car.id]!;
    const pf = tempsFixe(id, v);
    const opt = appuiNaturel(t, v, c, k);
    ecarts[id]![car.id] = { fixe: ref.tempsS - pf.tempsS, optimise: ref.tempsS - opt.profil.tempsS };
    const detail: Record<string, unknown> = { tempsFixeS: +pf.tempsS.toFixed(3), tempsOptimiseS: +opt.profil.tempsS.toFixed(3), ailerons: opt.niveau, gainFixeS: +(ref.tempsS - pf.tempsS).toFixed(3), gainOptimiseS: +(ref.tempsS - opt.profil.tempsS).toFixed(3), vmaxKmh: Math.round(Math.max(...pf.vitesses) * 3.6) };
    if (TEST.includes(id)) {
      detail.gainsParPortionS = parPortion(id, pf);
      detail.sensibilites = Object.fromEntries(Object.entries(sensibilites(t, avecAilerons(v, circ[id]!.niveau), c)).map(([a, b]) => [a, +b.toFixed(3)]));
    }
    ligne[car.id] = detail;
  }
  const rangF = Object.keys(ecarts[id]!).sort((a, b) => ecarts[id]![b]!.fixe - ecarts[id]![a]!.fixe);
  const rangO = Object.keys(ecarts[id]!).sort((a, b) => ecarts[id]![b]!.optimise - ecarts[id]![a]!.optimise);
  res[id] = { test: TEST.includes(id), tempsReferenceS: +ref.tempsS.toFixed(3), aileronsReference: circ[id]!.niveau, classementFixe: rangF, classementOptimise: rangO, voitures: ligne };
}

// 4. Synthèse sur les 26 tracés.
function synthese(lecture: 'fixe' | 'optimise') {
  const domination: Record<string, number> = {}, meilleur: Record<string, string> = {}, pire: Record<string, string> = {};
  for (const id of ids) { const r = (res[id] as Record<string, string[]>)[lecture === 'fixe' ? 'classementFixe' : 'classementOptimise']!; domination[r[0]!] = (domination[r[0]!] ?? 0) + 1; }
  for (const car of modelisees) {
    // Avantage relatif : gain de la voiture moins le gain moyen des voitures sur ce circuit (indépendant de la longueur du tour).
    const rel = ids.map((id) => { const e = ecarts[id]!; const m = Object.values(e).reduce((a, x) => a + x[lecture], 0) / Object.keys(e).length; return [id, e[car.id]![lecture] - m] as const; }).sort((a, b) => b[1] - a[1]);
    meilleur[car.id] = `${rel[0]![0]} (${rel[0]![1] >= 0 ? '+' : ''}${rel[0]![1].toFixed(2)} s)`;
    pire[car.id] = `${rel[rel.length - 1]![0]} (${rel[rel.length - 1]![1].toFixed(2)} s)`;
  }
  // Inversions : paires de voitures dont l'ordre s'inverse d'un circuit à l'autre (écart > 0,02 s pour ignorer le bruit).
  const noms = modelisees.map((c) => c.id), inversions: string[] = [];
  for (let a = 0; a < noms.length; a++) for (let b = a + 1; b < noms.length; b++) {
    let devant = 0, derriere = 0;
    for (const id of ids) { const d = ecarts[id]![noms[a]!]![lecture] - ecarts[id]![noms[b]!]![lecture]; if (d > 0.02) devant++; else if (d < -0.02) derriere++; }
    if (devant > 0 && derriere > 0) inversions.push(`${noms[a]}/${noms[b]} (${devant}–${derriere})`);
  }
  const paires = (noms.length * (noms.length - 1)) / 2;
  const jamaisBattue = noms.filter((n) => ids.every((id) => (res[id] as Record<string, string[]>)[lecture === 'fixe' ? 'classementFixe' : 'classementOptimise']![0] === n));
  return { domination, meilleurCircuit: meilleur, pireCircuit: pire, inversions: `${inversions.length}/${paires}`, pairesInversees: inversions, optimaleSystematique: jamaisBattue };
}
const sortie = {
  gainCibleS: GAIN_CIBLE_S,
  dosage: Object.fromEntries(Object.entries(intensite).map(([k, x]) => [k, +(x * 100).toFixed(2)])),
  nonTestees: futures.map((f) => ({ id: f.id, phase: f.phase, raison: 'caractéristique future : aucun effet physique défini' })),
  syntheseFixe: synthese('fixe'),
  syntheseOptimise: synthese('optimise'),
  circuits: res,
};
console.log(JSON.stringify({ dosage: sortie.dosage, nonTestees: sortie.nonTestees.map((x) => x.id), fixe: sortie.syntheseFixe, optimise: sortie.syntheseOptimise }, null, 1));
for (const id of ids) {
  const r = res[id] as { classementFixe: string[]; classementOptimise: string[]; test: boolean };
  console.log(id.padEnd(16), r.test ? 'T' : ' ', 'fixe:', r.classementFixe.map((n) => `${n} ${ecarts[id]![n]!.fixe.toFixed(2)}`).join(' > '));
}
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(sortie, null, 1));
