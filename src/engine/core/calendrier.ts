/** Dates de jeu : (année, semaine 1 à 52). */

import { PHASES_SAISON, SEMAINES_PAR_AN } from '../balance/calendrier';

export interface DateJeu {
  annee: number;
  semaine: number;
}

export type PhaseSaison = 'intersaison' | 'presaison' | 'saison' | 'finDeSaison';

/** Rang absolu d'une semaine (pratique pour comparer et calculer des écarts). */
export function rangSemaine(d: DateJeu): number {
  return d.annee * SEMAINES_PAR_AN + (d.semaine - 1);
}

export function depuisRang(rang: number): DateJeu {
  return { annee: Math.floor(rang / SEMAINES_PAR_AN), semaine: (rang % SEMAINES_PAR_AN) + 1 };
}

export function ajouterSemaines(d: DateJeu, n: number): DateJeu {
  return depuisRang(rangSemaine(d) + n);
}

/** Négatif si a < b, 0 si égales, positif si a > b. */
export function comparerDates(a: DateJeu, b: DateJeu): number {
  return rangSemaine(a) - rangSemaine(b);
}

export function datesEgales(a: DateJeu, b: DateJeu): boolean {
  return a.annee === b.annee && a.semaine === b.semaine;
}

export function phaseDe(d: DateJeu): PhaseSaison {
  const s = d.semaine;
  for (const nom of Object.keys(PHASES_SAISON) as PhaseSaison[]) {
    const p = PHASES_SAISON[nom];
    if (s >= p.debut && s <= p.fin) return nom;
  }
  throw new Error(`Semaine hors calendrier : ${s}`);
}

export function formaterDate(d: DateJeu): string {
  return `${d.annee}, semaine ${d.semaine}`;
}

export function dateValide(d: DateJeu): boolean {
  return Number.isInteger(d.annee) && Number.isInteger(d.semaine) && d.semaine >= 1 && d.semaine <= SEMAINES_PAR_AN;
}
