/**
 * Audit n°3 — règles communes d'effectif et de validité des contrats, pour toutes les commandes et décisions de l'IA
 * (offres du marché, prolongations, contre-attaques, titularisations, recrutements de secours, pré-accords).
 *
 * Une place est occupée pour une saison par : un contrat actif qui la couvre (sauf si la personne a signé ailleurs pour cette saison),
 * ou un contrat signé (pré-accord) qui la couvre.
 */

import { BORNES_CONTRAT, ENGAGEMENTS_PILOTES } from '../../balance/contrats';
import { POSTES_INDIVIDUALISES } from '../../balance/monde';
import { idsTries, table, type Monde } from '../../core/monde';
import { tirageLocal } from '../../core/moteur';
import { TABLES, type Contrat, type Ecurie, type Poste, type Proprietaire } from '../../model/types';

const contrats = (m: Monde) => idsTries(table(m, TABLES.contrats)).map((id) => table(m, TABLES.contrats)[id] as unknown as Contrat);

/** Nombre de places d'un poste dans une écurie (postes individualisés) ; sans limite pour les autres. */
export function nombrePlaces(poste: Poste): number {
  return POSTES_INDIVIDUALISES.find((x) => x.poste === poste)?.nombre ?? Infinity;
}

/** Personnes qui occupent une place de ce poste dans l'écurie pour la saison donnée. */
export function occupantsPour(monde: Monde, idEcurie: string, poste: Poste, annee: number): string[] {
  const tous = contrats(monde).filter((c) => c.type === 'emploi');
  const signes = tous.filter((c) => c.statut === 'signe');
  const res = new Set<string>();
  for (const c of tous) {
    if (c.organisation !== idEcurie || c.poste !== poste) continue;
    if (c.statut === 'actif' && c.debut <= annee && c.fin >= annee && !signes.some((s) => s.personne === c.personne && s.id !== c.id && s.debut <= annee && s.fin >= annee)) res.add(c.personne);
    if (c.statut === 'signe' && c.debut <= annee && c.fin >= annee) res.add(c.personne);
  }
  return [...res].sort();
}

/** Places encore libres pour une saison, sans compter `sauf` (la personne dont on examine le contrat). */
export function placesLibres(monde: Monde, idEcurie: string, poste: Poste, annee: number, sauf?: string): number {
  return nombrePlaces(poste) - occupantsPour(monde, idEcurie, poste, annee).filter((id) => id !== sauf).length;
}

/** Une personne peut-elle occuper ce poste dans l'écurie de la saison `de` à la saison `a` sans dépasser l'effectif ? */
export function motifRefusEffectif(monde: Monde, idEcurie: string, personne: string, poste: Poste, de: number, a: number): string | null {
  for (let y = de; y <= a; y++) {
    if (placesLibres(monde, idEcurie, poste, y, personne) <= 0) return `Effectif complet : aucune place de ${poste.replace(/_/g, ' ')} libre en ${y}.`;
  }
  return null;
}

/** Nombre maximal de saisons consécutives après `depuis` pendant lesquelles la personne peut occuper ce poste. */
export function dureeMaxEffectif(monde: Monde, idEcurie: string, personne: string, poste: Poste, depuis: number, max = BORNES_CONTRAT.dureeMax): number {
  let n = 0;
  while (n < max && placesLibres(monde, idEcurie, poste, depuis + n + 1, personne) > 0) n++;
  return n;
}

/** Valeur numérique finie (refuse NaN, Infinity, chaînes non numériques). */
export function fini(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x);
}

/** Lit et valide salaire et durée d'un contrat : valeurs finies, durée entière, salaire validé APRÈS arrondi au dixième. */
export function lireConditions(salaireBrut: unknown, dureeBrute: unknown): { salaire: number; duree: number } | string {
  const s = typeof salaireBrut === 'string' ? Number(salaireBrut) : salaireBrut;
  const d = typeof dureeBrute === 'string' ? Number(dureeBrute) : dureeBrute;
  if (!fini(s) || !fini(d)) return 'Salaire et durée doivent être des nombres finis.';
  if (!Number.isInteger(d) || d < BORNES_CONTRAT.dureeMin || d > BORNES_CONTRAT.dureeMax) return `Durée en années entières, de ${BORNES_CONTRAT.dureeMin} à ${BORNES_CONTRAT.dureeMax}.`;
  const salaire = Math.round(s * 10) / 10;
  if (salaire < BORNES_CONTRAT.salaireMinMEUR || salaire > BORNES_CONTRAT.salaireMaxMEUR) return `Salaire (arrondi au dixième) entre ${BORNES_CONTRAT.salaireMinMEUR} et ${BORNES_CONTRAT.salaireMaxMEUR} M€ par an.`;
  return { salaire, duree: d };
}

/** Masse salariale des pilotes titulaires engagée pour une saison (contrats actifs et signés qui la couvrent), hors `sauf`. */
export function engagementsPilotes(monde: Monde, idEcurie: string, annee: number, sauf?: string): number {
  const occ = new Set(occupantsPour(monde, idEcurie, 'pilote_titulaire', annee));
  return contrats(monde)
    .filter((c) => c.type === 'emploi' && c.organisation === idEcurie && c.poste === 'pilote_titulaire' && (c.statut === 'actif' || c.statut === 'signe') && c.debut <= annee && c.fin >= annee && occ.has(c.personne) && c.personne !== sauf)
    .reduce((a, c) => a + c.salaireMEUR, 0);
}

/**
 * Arbitrage du conseil d'administration pour un engagement salarial de pilote titulaire (même règle pour le joueur et l'IA) :
 * libre sous le seuil, toujours refusé au-delà du maximum, arbitré entre les deux. Décision déterministe (tirage local par dossier).
 */
export function motifRefusConseil(monde: Monde, e: Ecurie, personne: string, salaire: number, de: number, a: number): string | null {
  let pire = 0;
  for (let y = de; y <= a; y++) pire = Math.max(pire, (engagementsPilotes(monde, e.id, y, personne) + salaire) / Math.max(1, e.budgetMEUR));
  if (pire <= ENGAGEMENTS_PILOTES.libre) return null;
  if (pire > ENGAGEMENTS_PILOTES.maximum) return `Le conseil refuse : les salaires des pilotes atteindraient ${Math.round(pire * 100)} % du budget.`;
  const pro = (Object.values(table(monde, TABLES.proprietaires)) as unknown as Proprietaire[]).find((x) => x.ecurie === e.id && x.actif !== false);
  const accord = 1 - (pire - ENGAGEMENTS_PILOTES.libre) / (ENGAGEMENTS_PILOTES.maximum - ENGAGEMENTS_PILOTES.libre)
    + ((pro?.risque ?? 10) - 10) / 40 + ((pro?.ambition ?? 10) - 10) / 40;
  const ok = tirageLocal(monde, 'conseil.engagement', e.id, personne, de, Math.round(salaire * 10)).chance(Math.min(1, Math.max(0, accord)));
  return ok ? null : `Le conseil refuse cet engagement (salaires des pilotes à ${Math.round(pire * 100)} % du budget).`;
}
