/**
 * Phase 12b — fatigue des pôles techniques (fiche compagnon §1, D-170 Q3) : une seule jauge visible par pôle (aéro, conception),
 * tirée par la charge réelle de ses projets selon leur rythme. Le normal est soutenable indéfiniment ; l'intensif est efficace quelques
 * semaines et coûteux à la longue, par ses conséquences naturelles (productivité, incidents, estimations, heures moins utiles).
 */

import { FATIGUE, PIECES, RYTHMES, type Rythme, type TypePiece } from '../../balance/monoplaces';
import { INGENIEURS } from '../../balance/capacites';
import { table, type Monde } from '../../core/monde';
import { TABLES, type Departement, type ProjetConception } from '../../model/types';

export type Pole = 'aero' | 'conception';

export function departementPole(monde: Monde, idEcurie: string, pole: Pole): Departement | undefined {
  return (Object.values(table(monde, TABLES.departements)) as unknown as Departement[]).find((d) => d.ecurie === idEcurie && d.type === pole);
}

/** Fatigue d'un pôle (0 à 100). */
export function fatiguePole(monde: Monde, idEcurie: string, pole: Pole): number {
  return departementPole(monde, idEcurie, pole)?.fatigue ?? 0;
}

export const rythmeDe = (p: ProjetConception): Rythme => p.rythme ?? 'normal';

/** Projets d'un pôle en conception (hors fabrication). */
const enConceptionPole = (projets: ProjetConception[], pole: Pole) => projets.filter((p) => p.fabricationJoursRestants === undefined && PIECES[p.type as TypePiece]?.pole === pole);
/** D-181 : poids d'un projet dans la répartition des ingénieurs du pôle (un projet prioritaire en reçoit plus). */
export const poidsIngenieurs = (p: ProjetConception) => (p.prioritaire ? INGENIEURS.poidsPrioritaire : 1);

/** D-181 : part des ingénieurs du pôle affectée à ce projet (les projets en conception du pôle se partagent l'équipe). */
export function partIngenieurs(projets: ProjetConception[], p: ProjetConception): number {
  const pole = PIECES[p.type as TypePiece]?.pole as Pole;
  const total = enConceptionPole(projets.filter((x) => x.ecurie === p.ecurie), pole).reduce((a, x) => a + poidsIngenieurs(x), 0);
  return total > 0 ? poidsIngenieurs(p) / total : 1;
}

/**
 * Charge d'un pôle. D-181 (porteur : « pas le nombre d'ingénieurs mais la façon dont on les fait travailler ») : moyenne des rythmes des
 * projets en conception, pondérée par la part d'ingénieurs de chacun ; c'est le rythme qui fatigue, pas l'effectif. Sans projet : repos (0).
 */
export function chargePole(projets: ProjetConception[], pole: Pole): number {
  const liste = enConceptionPole(projets, pole);
  const total = liste.reduce((a, p) => a + poidsIngenieurs(p), 0);
  return total > 0 ? liste.reduce((a, p) => a + poidsIngenieurs(p) * RYTHMES.charge[rythmeDe(p)], 0) / total : 0;
}

/** Fatigue vers laquelle tend un pôle sous une charge donnée. */
export function fatigueEquilibre(charge: number): number {
  return charge <= 1 ? FATIGUE.equilibreNormal * charge : FATIGUE.equilibreNormal + FATIGUE.pente * (charge - 1);
}

/** Évolution hebdomadaire de la fatigue d'un pôle (rapprochement de l'équilibre ; récupération plus rapide en allégé). */
export function evoluerFatigue(d: Departement, charge: number): void {
  const f = d.fatigue ?? 0, cible = fatigueEquilibre(charge);
  const vitesse = cible > f ? FATIGUE.montee : charge <= FATIGUE.seuilAllege ? FATIGUE.descenteAllegee : FATIGUE.descente;
  d.fatigue = Math.round(Math.min(100, Math.max(0, f + vitesse * (cible - f))) * 10) / 10;
}

/** Productivité restante d'un pôle fatigué. */
export const facteurProductivite = (f: number) => 1 - Math.max(0, f - FATIGUE.productiviteSeuil) / 100;
/** Probabilité d'incident par semaine et par projet (difficultés normales comprises). */
export const probaIncident = (f: number) => FATIGUE.incidentBase + FATIGUE.incidentCoef * Math.max(0, f - FATIGUE.incidentSeuil) ** 2;
/** Fraîcheur : efficacité des heures de soufflerie et de la détection. */
export const fraicheur = (f: number) => 1 - f / 200;
