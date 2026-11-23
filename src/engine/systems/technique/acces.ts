/** Phase 8 — accès aux règlements, au savoir et aux programmes (sans dépendance vers les autres systèmes). */

import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { TABLES, type ProgrammeRecherche, type Reglement, type Savoir } from '../../model/types';

const liste = <T>(m: Monde, t: string) => idsTries(table(m, t)).map((id) => table(m, t)[id] as unknown as T);

export const reglements = (m: Monde) => liste<Reglement>(m, TABLES.reglements);
export const reglementEnVigueur = (m: Monde) => reglements(m).find((r) => r.statut === 'en_vigueur');
export const reglementAnnonce = (m: Monde) => reglements(m).find((r) => r.statut === 'annonce');
export const propositions = (m: Monde) => reglements(m).filter((r) => r.statut === 'propose');
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
