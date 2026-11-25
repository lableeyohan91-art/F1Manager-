/** Phase 12a — dépenses techniques (projets, fabrication, vérifications), sous le plafond, payées à la prochaine écriture comptable. */

import { table, type Monde } from '../../core/monde';
import { TABLES, type Finances } from '../../model/types';
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
  return fi.budget.developpementMEUR * (1 - recherche) - depenses(fi, monde.date.annee).projetsMEUR;
}

/** Engage une dépense technique (comptée à la prochaine écriture comptable, sous le plafond). */
export function depenser(monde: Monde, idEcurie: string, montant: number): void {
  const fi = financesDe(monde, idEcurie);
  if (!fi) return;
  const d = depenses(fi, monde.date.annee);
  d.projetsMEUR = r2(d.projetsMEUR + montant);
  d.aPayerMEUR = r2(d.aPayerMEUR + montant);
}

