/**
 * Compétitivité à toutes les positions (D-113) : le laboratoire ne mesure plus seulement la lutte pour le titre.
 * Pour les pilotes et pour les constructeurs, à partir des résultats Grand Prix par Grand Prix d'une saison terminée :
 * - mobilité du classement (corrélation entre le classement après 25 / 50 / 75 % de la saison et le classement final) ;
 * - écarts de points entre positions voisines, par étage (haut, milieu, bas) ;
 * - changements de position en cours de saison ;
 * - positions encore disputées (mathématiquement, raisonnablement) à N manches de la fin ;
 * - positions acquises prématurément ;
 * - gains ou pertes d'au moins 2 places en seconde moitié de saison ;
 * - positions stables mais disputées, et positions isolées sans enjeu.
 * Outil de mesure seulement : aucune formule du jeu ne lit ces indicateurs (D-040).
 */

import { table, type Monde } from '../core/monde';
import { TABLES, type GrandPrix, type Saison } from '../model/types';
import { spearman } from './indicateurs';

/** Paramètres de mesure (définitions du laboratoire, pas des coefficients d'équilibrage du jeu). */
export const MESURE_POSITIONS = {
  /** Manches avant la fin auxquelles on regarde ce qui reste disputé ou déjà acquis. */
  manchesAvantFin: 3,
  /** Un écart est « raisonnablement » rattrapable s'il vaut au plus cette part des points encore disponibles pour un concurrent. */
  partRaisonnable: 0.25,
  /**
   * Une position finale est disputée si l'écart avec un voisin vaut au plus les points d'une victoire (pilotes) ou d'un doublé
   * (constructeurs) ; elle est isolée si l'écart avec ses deux voisins dépasse ce nombre de « victoires ».
   */
  isolementVictoires: 3,
  /** Gain ou perte de places en seconde moitié de saison considéré comme notable. */
  placesNotables: 2,
};

export interface MesurePositions {
  mobilite25: number;
  mobilite50: number;
  mobilite75: number;
  /** Déplacement moyen (places) entre la mi-saison et la fin. */
  deplacementSecondeMoitie: number;
  /** Part des concurrents qui gagnent ou perdent au moins 2 places en seconde moitié. */
  partGainPerte2: number;
  /** Changements de position par concurrent sur la saison (Grand Prix après Grand Prix). */
  changementsParConcurrent: number;
  /** Écart moyen de points entre positions voisines au classement final, par étage. */
  ecartVoisins: { haut: number; milieu: number; bas: number };
  /** Part des frontières entre positions voisines encore mathématiquement / raisonnablement disputées à N manches de la fin, par étage. */
  disputeesMath: { tout: number; haut: number; milieu: number; bas: number };
  disputeesRaisonnables: { tout: number; haut: number; milieu: number; bas: number };
  /** Part des positions déjà acquises (ni rattrapables par le suivant, ni capables de rattraper le précédent) à N manches de la fin. */
  acquisesPrematurement: { tout: number; haut: number; milieu: number; bas: number };
  /** Positions stables (même occupant à 75 % et à la fin) mais disputées (voisin à moins d'une victoire) / isolées (voisins à plus de 3 victoires). */
  stablesDisputees: number;
  isolees: number;
}

export interface IndicateursPositions { pilotes: MesurePositions; constructeurs: MesurePositions }

type Etage = 'haut' | 'milieu' | 'bas';

/** Classements (points cumulés) après chaque Grand Prix : liste de [concurrent, points] triée, pour chaque manche. */
function classementsSuccessifs(gps: GrandPrix[], cle: 'pilote' | 'ecurie'): [string, number][][] {
  const points = new Map<string, number>();
  const res: [string, number][][] = [];
  for (const g of gps) {
    for (const r of g.resultats) points.set(r[cle], (points.get(r[cle]) ?? 0) + r.points);
    res.push([...points.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)));
  }
  return res;
}

function mesurer(gps: GrandPrix[], cle: 'pilote' | 'ecurie', maxParCourse: number, etage: (rang: number, n: number) => Etage): MesurePositions {
  const succ = classementsSuccessifs(gps, cle);
  const final = succ.at(-1) ?? [];
  const n = final.length;
  const rangs = (cl: [string, number][]) => new Map(cl.map(([id], i) => [id, i + 1]));
  const rFinal = rangs(final);
  const ids = final.map(([id]) => id);
  const mobilite = (part: number) => {
    const cl = succ[Math.max(0, Math.round(part * succ.length) - 1)] ?? final;
    const r = rangs(cl);
    return spearman(ids.map((id) => -(r.get(id) ?? n)), ids.map((id) => -(rFinal.get(id) ?? n)));
  };
  const r50 = rangs(succ[Math.max(0, Math.round(0.5 * succ.length) - 1)] ?? final);
  const r75 = rangs(succ[Math.max(0, Math.round(0.75 * succ.length) - 1)] ?? final);
  const deplacements = ids.map((id) => Math.abs((r50.get(id) ?? n) - (rFinal.get(id) ?? n)));
  let changements = 0;
  for (let k = 1; k < succ.length; k++) {
    const avant = rangs(succ[k - 1]!), apres = rangs(succ[k]!);
    for (const id of ids) if (avant.get(id) !== undefined && avant.get(id) !== apres.get(id)) changements++;
  }
  const ecarts = (cl: [string, number][]) => cl.slice(0, -1).map(([, p], i) => p - cl[i + 1]![1]);
  const parEtage = (valeurs: number[], frontieres = true) => {
    const acc: Record<Etage, number[]> = { haut: [], milieu: [], bas: [] };
    valeurs.forEach((v, i) => acc[etage(i + 1, frontieres ? n - 1 : n)].push(v));
    return acc;
  };
  const moy = (v: number[]) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN);
  const ef = parEtage(ecarts(final));
  // Situation à N manches de la fin.
  const k = succ.length - MESURE_POSITIONS.manchesAvantFin;
  const cl = succ[k - 1] ?? final;
  const restant = MESURE_POSITIONS.manchesAvantFin * maxParCourse;
  const ec = ecarts(cl);
  const math = ec.map((e) => (e <= restant ? 1 : 0));
  const raison = ec.map((e) => (e <= MESURE_POSITIONS.partRaisonnable * restant ? 1 : 0));
  const acquise = cl.map((_, i) => ((i === 0 || ec[i - 1]! > restant) && (i === cl.length - 1 || ec[i]! > restant) ? 1 : 0));
  const pm = parEtage(math), pr = parEtage(raison), pa = parEtage(acquise, false);
  const eFinal = ecarts(final);
  let stablesDisputees = 0, isolees = 0;
  final.forEach(([id], i) => {
    const voisins = [i > 0 ? eFinal[i - 1]! : Infinity, i < n - 1 ? eFinal[i]! : Infinity];
    const stable = r75.get(id) === i + 1;
    if (stable && Math.min(...voisins) <= maxParCourse) stablesDisputees++;
    if (Math.min(...voisins) > MESURE_POSITIONS.isolementVictoires * maxParCourse) isolees++;
  });
  return {
    mobilite25: mobilite(0.25), mobilite50: mobilite(0.5), mobilite75: mobilite(0.75),
    deplacementSecondeMoitie: moy(deplacements),
    partGainPerte2: deplacements.filter((d) => d >= MESURE_POSITIONS.placesNotables).length / Math.max(1, n),
    changementsParConcurrent: changements / Math.max(1, n),
    ecartVoisins: { haut: moy(ef.haut), milieu: moy(ef.milieu), bas: moy(ef.bas) },
    disputeesMath: { tout: moy(math), haut: moy(pm.haut), milieu: moy(pm.milieu), bas: moy(pm.bas) },
    disputeesRaisonnables: { tout: moy(raison), haut: moy(pr.haut), milieu: moy(pr.milieu), bas: moy(pr.bas) },
    acquisesPrematurement: { tout: moy(acquise), haut: moy(pa.haut), milieu: moy(pa.milieu), bas: moy(pa.bas) },
    stablesDisputees: stablesDisputees / Math.max(1, n),
    isolees: isolees / Math.max(1, n),
  };
}

/** Étages : pilotes 1–5 / 6–12 / 13+ ; constructeurs 1–4 / 5–8 / 9+ (D-088). */
const etagePilotes = (rang: number): Etage => (rang <= 5 ? 'haut' : rang <= 12 ? 'milieu' : 'bas');
const etageConstructeurs = (rang: number): Etage => (rang <= 4 ? 'haut' : rang <= 8 ? 'milieu' : 'bas');

export function indicateursPositions(monde: Monde, s: Saison): IndicateursPositions | null {
  const gps = s.calendrier.map((id) => table(monde, TABLES.grandsPrix)[id] as unknown as GrandPrix).filter((g) => g?.termine && g.resultats.length);
  if (gps.length < 2 * MESURE_POSITIONS.manchesAvantFin) return null;
  const max = s.bareme[0] ?? 25;
  const maxConstructeur = max + (s.bareme[1] ?? 18);
  return { pilotes: mesurer(gps, 'pilote', max, etagePilotes), constructeurs: mesurer(gps, 'ecurie', maxConstructeur, etageConstructeurs) };
}
