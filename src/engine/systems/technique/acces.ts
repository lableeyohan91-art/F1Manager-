/** Phase 8 — accès aux règlements, au savoir et aux programmes (sans dépendance vers les autres systèmes). */

import { FUITES_REGLEMENT } from '../../balance/information';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal } from '../../core/moteur';
import { TABLES, type ProgrammeRecherche, type Reglement, type Savoir } from '../../model/types';

const liste = <T>(m: Monde, t: string) => idsTries(table(m, t)).map((id) => table(m, t)[id] as unknown as T);

export const reglements = (m: Monde) => liste<Reglement>(m, TABLES.reglements);
export const reglementEnVigueur = (m: Monde) => reglements(m).find((r) => r.statut === 'en_vigueur');
export const reglementAnnonce = (m: Monde) => reglements(m).find((r) => r.statut === 'annonce');
export const propositions = (m: Monde) => reglements(m).filter((r) => r.statut === 'propose');
/** Phase 8c : avant-projets (réformes préparées par la fédération, pas encore publiées). */
export const avantProjets = (m: Monde) => reglements(m).filter((r) => r.statut === 'brouillon');
/** Une écurie sait-elle qu'un règlement existe ? (avant-projet : seulement si elle en a eu vent) */
export const reglementConnu = (r: Reglement, idEcurie: string) => r.statut !== 'brouillon' || (r.connuPar ?? []).includes(idEcurie);

/**
 * Intensité d'un domaine telle qu'une écurie la perçoit (phase 8c) : exacte une fois le règlement publié ; approximative pour un
 * avant-projet (écart propre à l'écurie, borné entre 0 et 1) ; nulle si l'écurie l'ignore.
 */
export function intensitePercue(monde: Monde, idEcurie: string, r: Reglement, domaine: string): number {
  const vraie = r.intensites[domaine] ?? 0;
  if (r.statut !== 'brouillon') return vraie;
  if (!reglementConnu(r, idEcurie)) return 0;
  const ecart = tirageLocal(monde, 'information.perception', idEcurie, r.id, domaine).normale(0, FUITES_REGLEMENT.bruitIntensite);
  return Math.min(1, Math.max(0, vraie + ecart));
}
export const programmes = (m: Monde, idEcurie?: string) => liste<ProgrammeRecherche>(m, TABLES.programmes).filter((p) => !idEcurie || p.ecurie === idEcurie);

/** Savoir d'une écurie dans un domaine (créé vide au besoin). */
export function savoir(monde: Monde, idEcurie: string, domaine: string): Savoir {
  const t = table(monde, TABLES.savoirs);
  const id = `${idEcurie}|${domaine}`;
  if (!t[id]) t[id] = { id, ecurie: idEcurie, domaine, fondamental: 0, parReglement: {}, pourSaisonSuivante: 0 } satisfies Savoir as unknown as Entite;
  return t[id] as unknown as Savoir;
}

/** Lecture sans création (pour les calculs fréquents). */
export function savoirExistant(monde: Monde, idEcurie: string, domaine: string): Savoir | undefined {
  return table(monde, TABLES.savoirs)[`${idEcurie}|${domaine}`] as unknown as Savoir | undefined;
}

/**
 * Savoir applicable à un règlement : savoir propre à ce règlement, plus le savoir fondamental (entièrement transférable, D-128 :
 * « ce qui est appris n'est jamais perdu en totalité »). Sans règlement : fondamental seul.
 */
export function savoirApplicable(monde: Monde, idEcurie: string, domaine: string, idReglement: string | undefined): number {
  const s = savoirExistant(monde, idEcurie, domaine);
  if (!s) return 0;
  return (idReglement ? s.parReglement[idReglement] ?? 0 : 0) + s.fondamental;
}

/** Part totale des moyens de développement consacrée à la recherche (programmes actifs). Lue par le développement de la saison. */
export function partRecherche(monde: Monde, idEcurie: string): number {
  return programmes(monde, idEcurie).filter((p) => p.statut === 'actif').reduce((a, p) => a + p.part, 0);
}
