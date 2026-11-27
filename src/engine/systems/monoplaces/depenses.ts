/** Phase 12a — dépenses techniques (projets, fabrication, vérifications), sous le plafond, payées à la prochaine écriture comptable. */

import { table, type Monde } from '../../core/monde';
import { TABLES, type Ecurie, type Finances } from '../../model/types';
import { totalPlafonne } from '../../model/finances';
import { MARGE_SECURITE_PLAFOND, PERIODES_PAR_AN } from '../../balance/finances';
import { depensesFixes } from '../economie/index';
import { programmes } from '../technique/acces';

const r2 = (x: number) => Math.round(x * 100) / 100;
const financesDe = (m: Monde, id: string) => (Object.values(table(m, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === id);

/** Dépenses techniques de l'année (créées au besoin). */
function depenses(fi: Finances, annee: number): NonNullable<Finances['depensesTechniques']> {
  if (!fi.depensesTechniques || fi.depensesTechniques.annee !== annee) fi.depensesTechniques = { annee, projetsMEUR: 0, aPayerMEUR: fi.depensesTechniques?.aPayerMEUR ?? 0 };
  return fi.depensesTechniques;
}

/** Enveloppe encore disponible pour les projets cette année (budget de développement hors part de la recherche, moins le déjà dépensé). */
export function enveloppeRestante(monde: Monde, idEcurie: string): number {
  const fi = financesDe(monde, idEcurie);
  if (!fi) return Infinity;
  const recherche = programmes(monde, idEcurie).filter((p) => p.statut === 'actif').reduce((a, p) => a + p.part, 0);
  const budget = fi.budget.developpementMEUR * (1 - recherche) - depenses(fi, monde.date.annee).projetsMEUR;
  // Place réellement restante sous le plafond visé : déjà payé cette année + frais plafonnés des périodes restantes (au niveau actuel,
  // embauches de l'année comprises) + recherche + dépenses engagées non encore payées. Sans cette borne, une écurie qui consomme toute son
  // enveloppe dépasse le plafond quand ses frais fixes ont augmenté depuis le budget (test « aucun dépassement involontaire »).
  const e = table(monde, TABLES.ecuries)[idEcurie] as unknown as Ecurie | undefined;
  if (!e || fi.comptes.annee !== monde.date.annee) return budget;
  const n = PERIODES_PAR_AN;
  // Écritures encore à passer cette année (même décompte que les prévisions, `periodesRestantes`) : avant, l'arrondi comptait 0 écriture
  // en semaines 49 à 52 alors qu'il en restait une, et le plafond pouvait être dépassé de quelques centaines de milliers d'euros.
  const restantes = Math.max(0, n - Math.floor((monde.date.semaine - 1) / 4));
  const f = depensesFixes(monde, e);
  const aVenir = restantes * ((f.personnelPlafonne + f.departements + f.operations + f.entretien) / n + (fi.budget.developpementMEUR * recherche) / n);
  const place = fi.budget.plafondVise * (1 - MARGE_SECURITE_PLAFOND) - totalPlafonne(fi.comptes) - aVenir - (fi.depensesTechniques?.aPayerMEUR ?? 0);
  return Math.min(budget, place);
}

/** Engage une dépense technique (comptée à la prochaine écriture comptable, sous le plafond). */
export function depenser(monde: Monde, idEcurie: string, montant: number): void {
  const fi = financesDe(monde, idEcurie);
  if (!fi) return;
  const d = depenses(fi, monde.date.annee);
  d.projetsMEUR = r2(d.projetsMEUR + montant);
  d.aPayerMEUR = r2(d.aPayerMEUR + montant);
}

