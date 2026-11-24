/**
 * Phase 11b — calendrier par vivier (D-145, décisions du porteur) : 10 circuits permanents, et les places restantes partagées par
 * les circuits en rotation selon une règle connue de tous, sans tirage :
 *   1. un circuit sous contrat (finContrat ≥ saison) garde sa place ; s'il y en a trop, les contrats les plus longs passent devant ;
 *   2. les places libres vont aux circuits absents depuis le plus longtemps (dernière édition la plus ancienne, jamais = en premier),
 *      à égalité dans l'ordre du fichier ; chacun reçoit un contrat de VIVIER.contratRotationAns saisons ;
 *   3. les Grands Prix suivent la date habituelle de chaque circuit.
 * Un circuit qui sort du calendrier garde son historique (Grands Prix et archives ne sont jamais supprimés).
 */
import { table, type Monde } from '../../core/monde';
import { TABLES } from '../../model/types';
import { ajouterEvenement } from '../../core/evenements';
import { VIVIER } from '../../balance/circuits';
import type { Circuit } from '../../model/types';

/** La partie utilise-t-elle le vivier (format 29 et données à vivier) ? Sinon, ancien calendrier. */
export function avecVivier(monde: Monde): boolean {
  return (Object.values(table(monde, TABLES.circuits)) as unknown as Circuit[]).some((c) => c.vivier);
}

const ordre = (a: Circuit, b: Circuit) => (a.ordre ?? 0) - (b.ordre ?? 0) || (a.id < b.id ? -1 : 1);

/** Circuits de la saison, dans l'ordre des Grands Prix ; met à jour contrats et dernières éditions, et annonce les changements. */
export function circuitsDeLaSaison(monde: Monde, annee: number, nombre: number): Circuit[] {
  const tous = (Object.values(table(monde, TABLES.circuits)) as unknown as Circuit[]).filter((c) => c.vivier).sort(ordre);
  const permanents = tous.filter((c) => c.vivier!.statut === 'permanent');
  const rotation = tous.filter((c) => c.vivier!.statut === 'rotation');
  const places = Math.max(0, nombre - permanents.length);
  const precedents = new Set(tous.filter((c) => c.vivier!.derniereEdition === annee - 1).map((c) => c.id));

  const sousContrat = rotation.filter((c) => (c.vivier!.finContrat ?? -Infinity) >= annee)
    .sort((a, b) => (b.vivier!.finContrat ?? 0) - (a.vivier!.finContrat ?? 0) || ordre(a, b));
  const retenus = sousContrat.slice(0, places);
  const libres = rotation.filter((c) => !retenus.includes(c))
    .sort((a, b) => (a.vivier!.derniereEdition ?? -Infinity) - (b.vivier!.derniereEdition ?? -Infinity) || ordre(a, b));
  for (const c of libres) {
    if (retenus.length >= places) break;
    if ((c.vivier!.finContrat ?? -Infinity) < annee) c.vivier!.finContrat = annee + VIVIER.contratRotationAns - 1;
    retenus.push(c);
  }
  const saison = [...permanents, ...retenus].slice(0, nombre).sort((a, b) => a.vivier!.jourHabituel - b.vivier!.jourHabituel || ordre(a, b));
  for (const c of saison) c.vivier!.derniereEdition = annee;

  // Annonce publique des entrées et des sorties (rien la première saison sans précédent connu).
  if (precedents.size) {
    const ids = new Set(saison.map((c) => c.id));
    const entrees = saison.filter((c) => !precedents.has(c.id)).map((c) => c.id);
    const sorties = [...precedents].filter((id) => !ids.has(id)).sort();
    if (entrees.length || sorties.length) {
      ajouterEvenement(monde, {
        type: 'calendrier.rotation',
        acteurs: [...entrees.map((id) => ({ id, role: 'entree' })), ...sorties.map((id) => ({ id, role: 'sortie' }))],
        importance: 2,
        contexte: { annee, entrees, sorties, regle: 'contrats en cours, puis circuits absents depuis le plus longtemps' },
      });
    }
  }
  return saison;
}

/** Mois (1–12) d'une semaine de jeu, pour le climat. */
export function moisDeSemaine(semaine: number): number {
  return Math.min(12, Math.max(1, 1 + Math.floor((semaine - 1) / VIVIER.semainesParMois)));
}
