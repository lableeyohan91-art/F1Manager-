/**
 * Phase 11b — étude de la normalisation des points essentiels (audit APEX Lab, point 3).
 * Pour chaque tracé réel (5 circuits test + 21 de validation), gain de temps au tour pour +2 % de chaque paramètre physique,
 * puis classement selon quatre lectures :
 *   brut       : gain en secondes (ce que rapporte l'amélioration sur ce circuit) ;
 *   relatif    : gain en % du temps au tour (neutralise la longueur du circuit) ;
 *   norm5      : gain rapporté à la moyenne des 5 circuits test (lecture utilisée jusqu'ici) ;
 *   normCal    : gain rapporté à la moyenne des 24 circuits du calendrier (lecture visée par la conception).
 * Le seuil « négligeable » (POINTS_ESSENTIELS) s'applique aux quatre lectures.
 * Usage : npx tsx tools/circuits/etude-normalisation.mts [sortie JSON]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { appuiNaturel, avecAilerons, courbures, sensibilites, PARAMETRES, type Trace, type ParametrePhysique } from '../../src/engine/circuits/profil';
import { POINTS_ESSENTIELS, VOITURE_REFERENCE } from '../../src/engine/balance/profil';

const TEST = ['cir_monza', 'cir_monaco', 'cir_suzuka', 'cir_singapour', 'cir_mexico'];
const calendrier = readFileSync('data/grille-2026/circuits.csv', 'utf8').trim().split('\n').slice(1).map((l) => l.split(';')[0]!);
const fichier = (id: string) => (existsSync(`data/circuits/${id}.json`) ? `data/circuits/${id}.json` : `data/circuits/validation/${id}.json`);
const ids = [...new Set([...TEST, ...calendrier, 'cir_madrid', 'cir_imola'])].filter((id) => existsSync(fichier(id)));
const cles = Object.keys(PARAMETRES) as ParametrePhysique[];

const gains: Record<string, Record<ParametrePhysique, number>> = {}, temps: Record<string, number> = {};
for (const id of ids) {
  const t = JSON.parse(readFileSync(fichier(id), 'utf8')) as Trace & { altitudeM: number };
  const c = { altitudeM: t.altitudeM ?? 0 }, k = courbures(t);
  const { niveau, profil } = appuiNaturel(t, VOITURE_REFERENCE, c, k);
  gains[id] = sensibilites(t, avecAilerons(VOITURE_REFERENCE, niveau), c);
  temps[id] = profil.tempsS;
}
const moyenne = (liste: string[]) => Object.fromEntries(cles.map((p) => [p, liste.reduce((a, i) => a + Math.max(0, gains[i]![p]), 0) / liste.length])) as Record<ParametrePhysique, number>;
const m5 = moyenne(TEST), mCal = moyenne(calendrier.filter((i) => gains[i]));

type Lecture = 'brut' | 'relatif' | 'norm5' | 'normCal';
function classement(id: string, l: Lecture): ParametrePhysique[] {
  const g = gains[id]!, max = Math.max(...cles.map((p) => g[p]));
  const score = (p: ParametrePhysique) => {
    const x = Math.max(0, g[p]);
    return l === 'brut' ? x : l === 'relatif' ? x / temps[id]! : l === 'norm5' ? x / m5[p] : x / mCal[p];
  };
  const significatif = (p: ParametrePhysique) => g[p] >= POINTS_ESSENTIELS.gainNegligeableS && g[p] >= POINTS_ESSENTIELS.partNegligeable * max;
  return [...cles].sort((a, b) => Number(significatif(b)) - Number(significatif(a)) || score(b) - score(a));
}
const res: Record<string, unknown> = {};
for (const id of ids) {
  const r = Object.fromEntries((['brut', 'relatif', 'norm5', 'normCal'] as Lecture[]).map((l) => [l, classement(id, l).slice(0, 2)]));
  const negligeables = cles.filter((p) => gains[id]![p] < POINTS_ESSENTIELS.gainNegligeableS);
  res[id] = { test: TEST.includes(id), calendrier: calendrier.includes(id), tempsS: +temps[id]!.toFixed(2), gainsS: Object.fromEntries(cles.map((p) => [p, +gains[id]![p].toFixed(3)])), essentiels: r, negligeables };
  console.log(id.padEnd(16), TEST.includes(id) ? 'T' : ' ', (['brut', 'norm5', 'normCal'] as Lecture[]).map((l) => `${l}=${r[l]!.join('+')}`).join('  '), negligeables.length ? `négligeables: ${negligeables.join(',')}` : '');
}
console.log('moyennes 5 circuits test', Object.fromEntries(cles.map((p) => [p, +m5[p].toFixed(3)])));
console.log('moyennes calendrier     ', Object.fromEntries(cles.map((p) => [p, +mCal[p].toFixed(3)])));
const sortie = process.argv[2];
if (sortie) writeFileSync(sortie, JSON.stringify({ moyennes5: m5, moyennesCalendrier: mCal, seuil: POINTS_ESSENTIELS, circuits: res }, null, 1));
