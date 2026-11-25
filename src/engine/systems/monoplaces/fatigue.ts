/**
 * Phase 12b — fatigue des pôles techniques (fiche compagnon §1, D-170 Q3) : une seule jauge visible par pôle (aéro, conception),
 * tirée par la charge réelle de ses projets selon leur rythme. Le normal est soutenable indéfiniment ; l'intensif est efficace quelques
 * semaines et coûteux à la longue, par ses conséquences naturelles (productivité, incidents, estimations, heures moins utiles).
 */

import { FATIGUE, PIECES, RYTHMES, type Rythme, type TypePiece } from '../../balance/monoplaces';
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

/** Charge d'un pôle : charge des rythmes de ses projets en conception, rapportée à ses équipes. */
export function chargePole(projets: ProjetConception[], pole: Pole, equipes: number): number {
  const enConception = projets.filter((p) => p.fabricationJoursRestants === undefined && PIECES[p.type as TypePiece]?.pole === pole);
  return enConception.reduce((a, p) => a + RYTHMES.charge[rythmeDe(p)], 0) / Math.max(1, equipes);
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
