/**
 * Phase 11c — ce qu'un sponsor croit savoir d'une écurie (docs/systemes/phase-11c-sponsoring.md §2).
 *
 * Tout part du rang attendu PUBLIC (classements constructeurs passés) et des tables de fréquences mesurées (balance/sponsoring.ts).
 * Aucune information cachée : la probabilité estimée par un sponsor n'est pas la « vraie » probabilité de la simulation.
 */

import {
  ARRIVEES_POINTS, PART_RANG_PUBLIC_GP, PROBA_GP, PROBA_PODIUM_SAISON, PROBA_RANG_SAISON, PROBA_VICTOIRE_SAISON, RANG_ATTENDU, SEUILS_GP,
} from '../../balance/sponsoring';
import { table, type Monde } from '../../core/monde';
import { TABLES, type Circuit, type ClauseSponsor, type Ecurie, type GrandPrix, type Saison } from '../../model/types';
import { ecuriesActives, indiceMoyen, indiceSurCircuit } from '../saison/performance';

const borner = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const LIGNES = PROBA_GP.length; // rangs attendus tabulés (1 à 11)

/** Ramène un rang attendu sur un plateau de n écuries à l'échelle des tables (1 à 11). */
function echelle(r: number, n: number): number {
  return n > 1 ? 1 + ((borner(r, 1, n) - 1) * (LIGNES - 1)) / (n - 1) : 1;
}
/** Interpolation linéaire d'une valeur tabulée par rang attendu (1 à 11). */
function parRang(valeurs: readonly number[], r: number): number {
  const x = borner(r, 1, valeurs.length) - 1;
  const i = Math.floor(x), f = x - i;
  return i + 1 < valeurs.length ? valeurs[i]! * (1 - f) + valeurs[i + 1]! * f : valeurs[i]!;
}
const colonne = (t: readonly (readonly number[])[], j: number) => t.map((l) => l[j]!);

/** Loi normale : fonction de répartition (approximation d'Abramowitz et Stegun, erreur < 1e-7). */
export function repartitionNormale(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

/* ---------------------------------------------------------------- Rang attendu public */

/**
 * Rang attendu public d'une écurie (réel, 1 = favorite) : moyenne pondérée de ses deux derniers classements constructeurs
 * terminés ; sans saison terminée (début de partie), le rang de l'indice de sa voiture, que la presse connaît au lancement.
 */
export function rangAttenduPublic(monde: Monde, idEcurie: string): number {
  const saisons = (Object.values(table(monde, TABLES.saisons)) as unknown as Saison[]).filter((s) => s.termine).sort((a, b) => b.annee - a.annee);
  const rangs: number[] = [];
  for (const s of saisons) {
    const i = s.constructeurs.findIndex((c) => c.ecurie === idEcurie);
    if (i >= 0) rangs.push(i + 1);
    if (rangs.length === 2) break;
  }
  if (rangs.length === 2) return (RANG_ATTENDU.poidsDerniere * rangs[0]! + RANG_ATTENDU.poidsAvantDerniere * rangs[1]!) / (RANG_ATTENDU.poidsDerniere + RANG_ATTENDU.poidsAvantDerniere);
  if (rangs.length === 1) return rangs[0]!;
  return rangVoiture(monde, idEcurie);
}

/** Rang de la voiture de l'écurie sur le plateau (indice moyen) : ce que l'écurie sait d'elle-même. */
export function rangVoiture(monde: Monde, idEcurie: string): number {
  const cl = ecuriesActives(monde).map((e) => [e.id, indiceMoyen(monde, e)] as const).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
  return Math.max(1, cl.findIndex(([id]) => id === idEcurie) + 1);
}

/** Rang attendu sur un circuit (objectifs de course) : rang attendu public et rang de la voiture sur ce circuit. */
export function rangAttenduGP(monde: Monde, e: Ecurie, gp: GrandPrix): number {
  const c = table(monde, TABLES.circuits)[gp.circuit] as unknown as Circuit | undefined;
  const pub = rangAttenduPublic(monde, e.id);
  if (!c) return pub;
  const cl = ecuriesActives(monde).map((x) => [x.id, indiceSurCircuit(monde, x, c)] as const).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
  const rc = Math.max(1, cl.findIndex(([id]) => id === e.id) + 1);
  return PART_RANG_PUBLIC_GP * pub + (1 - PART_RANG_PUBLIC_GP) * rc;
}

/* ---------------------------------------------------------------- Probabilités vues par le sponsor */

/** Probabilité que le meilleur pilote finisse dans les k premiers d'un Grand Prix. */
export function probaGP(r: number, n: number, k: number): number {
  const x = echelle(r, n);
  const cols = SEUILS_GP as readonly number[];
  if (k < cols[0]!) return 0;
  let j = cols.findIndex((c) => c >= k);
  if (j < 0) return parRang(colonne(PROBA_GP, cols.length - 1), x);
  const pj = parRang(colonne(PROBA_GP, j), x);
  if (cols[j] === k || j === 0) return pj;
  const pi = parRang(colonne(PROBA_GP, j - 1), x);
  return pi + ((k - cols[j - 1]!) / (cols[j]! - cols[j - 1]!)) * (pj - pi);
}

/** Probabilité de finir dans les k premiers du classement constructeurs. */
export function probaRangSaison(r: number, n: number, k: number): number {
  if (k >= n) return 1;
  if (k < 1) return 0;
  const xk = n === LIGNES ? k : 1 + ((k - 1) * (LIGNES - 1)) / (n - 1);
  const j = Math.min(9, Math.floor(xk) - 1), f = xk - Math.floor(xk);
  const x = echelle(r, n);
  const a = parRang(colonne(PROBA_RANG_SAISON, j), x);
  if (f === 0 || j >= 9) return a;
  return a + f * (parRang(colonne(PROBA_RANG_SAISON, j + 1), x) - a);
}

/** Probabilité d'au moins m arrivées dans les points (meilleur pilote) sur nGP Grands Prix. */
export function probaArriveesPoints(r: number, n: number, nGP: number, m: number): number {
  const x = echelle(r, n);
  const mu = nGP * parRang(ARRIVEES_POINTS.moyenne, x), sd = Math.max(0.5, nGP * parRang(ARRIVEES_POINTS.ecartType, x));
  return 1 - repartitionNormale((m - 0.5 - mu) / sd);
}

/** Probabilité d'une clause annuelle, vue par le sponsor (le seuil d'une progression est un rang à atteindre). */
export function probaClause(type: ClauseSponsor['type'], seuil: number, r: number, n: number, nGP: number): number {
  switch (type) {
    case 'rang': case 'progression': return probaRangSaison(r, n, seuil);
    case 'podium': return parRang(PROBA_PODIUM_SAISON, echelle(r, n));
    case 'victoire': return parRang(PROBA_VICTOIRE_SAISON, echelle(r, n));
    case 'arrivees_points': return probaArriveesPoints(r, n, nGP, seuil);
  }
}

/* ---------------------------------------------------------------- Bilan réel d'une saison */

export interface BilanSaisonEcurie { rang?: number; podiums: number; victoires: number; arriveesPoints: number }

/** Résultats réellement simulés d'une écurie sur une saison (meilleur pilote à chaque Grand Prix). */
export function bilanSaison(monde: Monde, annee: number, idEcurie: string): BilanSaisonEcurie {
  const s = table(monde, TABLES.saisons)[`ssn_${annee}`] as unknown as Saison | undefined;
  const res: BilanSaisonEcurie = { podiums: 0, victoires: 0, arriveesPoints: 0 };
  if (!s) return res;
  const i = s.constructeurs.findIndex((c) => c.ecurie === idEcurie);
  if (s.termine && i >= 0) res.rang = i + 1;
  for (const idGp of s.calendrier) {
    const best = meilleurePosition(table(monde, TABLES.grandsPrix)[idGp] as unknown as GrandPrix | undefined, idEcurie);
    if (best === undefined) continue;
    if (best <= 3) res.podiums++;
    if (best === 1) res.victoires++;
    if (best <= 10) res.arriveesPoints++;
  }
  return res;
}

/** Meilleure position d'arrivée de l'écurie à un Grand Prix terminé (undefined : abandon des deux, ou course non courue). */
export function meilleurePosition(gp: GrandPrix | undefined, idEcurie: string): number | undefined {
  if (!gp?.termine) return undefined;
  let best: number | undefined;
  for (const r of gp.resultats) if (r.ecurie === idEcurie && r.position !== null && (best === undefined || r.position < best)) best = r.position;
  return best;
}

/** Une clause annuelle est-elle tenue ? */
export function clauseTenue(c: ClauseSponsor, b: BilanSaisonEcurie): boolean {
  switch (c.type) {
    case 'rang': case 'progression': return b.rang !== undefined && b.rang <= c.seuil;
    case 'podium': return b.podiums >= c.seuil;
    case 'victoire': return b.victoires >= c.seuil;
    case 'arrivees_points': return b.arriveesPoints >= c.seuil;
  }
}
