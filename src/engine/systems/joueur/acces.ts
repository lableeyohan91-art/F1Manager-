/** Phase 10 — délégations du joueur (module sans dépendance vers les autres systèmes). */

import type { DELEGATIONS_DEFAUT } from '../../balance/joueur';
import type { Monde } from '../../core/monde';
import type { Ecurie, Poste } from '../../model/types';

export type DomaineDelegue = keyof typeof DELEGATIONS_DEFAUT;

/**
 * L'IA décide-t-elle de ce domaine pour cette écurie ? Toujours pour une écurie de l'IA ; pour l'écurie du joueur,
 * seulement si le domaine est délégué (mêmes règles que l'IA, D-012).
 */
export function iaDecide(e: Ecurie, domaine: DomaineDelegue): boolean {
  if (!e.pilotee) return true;
  // Sans choix explicite (écurie pilotée avant la phase 10, bac à sable), le joueur décide lui-même ; la prise de fonction
  // inscrit les délégations par défaut (DELEGATIONS_DEFAUT).
  return e.delegations?.[domaine] ?? false;
}

/** Domaine de délégation d'un poste : les pilotes, ou le personnel. */
export function domainePoste(poste: Poste | string): DomaineDelegue {
  return poste.startsWith('pilote') ? 'pilotes' : 'personnel';
}

/** Identifiant de l'écurie du joueur, s'il en dirige une. */
export function ecurieDuJoueur(monde: Monde): string | undefined {
  return monde.joueur?.etat === 'actif' ? monde.joueur.ecurie : undefined;
}
