/**
 * Jalon A — chaînes de causes (« Pourquoi ? ») : outils communs pour relier un fait aux faits qui l'expliquent.
 * Liens directs seulement (une décision explique la suivante) ; les causes diffuses (résultats, développement) viendront avec une note de conception.
 */

import type { Monde } from '../../core/monde';
import type { Evenement } from '../../core/evenements';
import type { Personne } from '../../model/types';

/** Garde les identifiants de causes encore présents au journal (un fait effacé ne peut plus être cité). */
export function causesConnues(monde: Monde, ...ids: (string | undefined)[]): string[] {
  return [...new Set(ids.filter((id): id is string => !!id && !!monde.evenements[id]))];
}

/** Retient le dernier fait qui explique qu'une personne veuille partir (nouveau défi, demande de départ, refus, suivre un leader). */
export function noterFaitDepart(p: Personne, idEvenement: string): void {
  p.dernierFaitDepart = idEvenement;
}

/** Dernier fait du journal (le plus récent) qui satisfait le filtre, en remontant au plus `anneesMax` saisons. */
export function dernierFait(monde: Monde, filtre: (e: Evenement) => boolean, anneesMax = 1): string | undefined {
  // Performance : les identifiants sont créés dans l'ordre (evt_000001, evt_000002…) et le journal les garde dans cet ordre ;
  // pas besoin de trier, on remonte depuis la fin.
  const ids = Object.keys(monde.evenements);
  for (let i = ids.length - 1; i >= 0; i--) {
    const e = monde.evenements[ids[i]!]!;
    if (e.date.annee < monde.date.annee - anneesMax) break;
    if (filtre(e)) return e.id;
  }
  return undefined;
}
