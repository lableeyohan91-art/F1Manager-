/** Phase 8c — lecture de « qui sait quoi » (module sans dépendance vers les autres systèmes, lu par la réputation perçue). */

import type { Evenement } from '../../core/evenements';
import { idsTries, table, type Monde } from '../../core/monde';
import { TABLES } from '../../model/types';

/** Un fait privé suivi : perception de ceux qui l'ont appris par ouï-dire (poids = croyance, × amplification pour une rumeur). */
export interface FaitSuivi {
  id: string;
  interet: number;
  debut: { annee: number; semaine: number };
  /** Poids de ce fait pour chaque personne qui l'a appris par un tiers (absent : participant ou fait exact, poids 1). */
  perception: Record<string, number>;
  /** Personnes qui n'en connaissent qu'une version déformée. */
  rumeur: string[];
  /** Source de chaque personne informée par un tiers (explications). */
  source: Record<string, string>;
}

export const faitsSuivis = (m: Monde) => table(m, TABLES.faitsSuivis);

/** Le fait est-il connu de cette personne ? (public : de tous) */
export function connait(e: Evenement, idPersonne: string): boolean {
  return e.visibilite === 'public' || e.connuPar.includes(idPersonne) || e.acteurs.some((a) => a.id === idPersonne);
}

/** Poids d'un fait privé pour un observateur (0 s'il l'ignore) : 1 s'il en a été témoin, croyance × amplification s'il l'a entendu dire. */
export function poidsPercu(monde: Monde, e: Evenement, observateur: string): number {
  if (!connait(e, observateur)) return 0;
  const f = faitsSuivis(monde)[e.id] as unknown as FaitSuivi | undefined;
  return f?.perception[observateur] ?? 1;
}

/** Faits privés connus d'une personne (hors ceux auxquels elle a participé), du plus récent au plus ancien. */
export function faitsConnusPar(monde: Monde, idPersonne: string): { evenement: Evenement; rumeur: boolean; source?: string }[] {
  const res: { evenement: Evenement; rumeur: boolean; source?: string }[] = [];
  for (const id of idsTries(faitsSuivis(monde)).reverse()) {
    const e = monde.evenements[id];
    const f = faitsSuivis(monde)[id] as unknown as FaitSuivi;
    if (!e || e.visibilite === 'public' || !e.connuPar.includes(idPersonne) || e.acteurs.some((a) => a.id === idPersonne)) continue;
    res.push({ evenement: e, rumeur: f.rumeur.includes(idPersonne), ...(f.source[idPersonne] ? { source: f.source[idPersonne] } : {}) });
  }
  return res;
}
