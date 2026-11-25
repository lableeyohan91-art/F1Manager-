/**
 * Phase 8 — conversion PROVISOIRE du savoir en performance (D-132, question 1).
 *
 * Phase 12a : la vitesse des voitures vient désormais de leurs pièces (systems/monoplaces). Il ne reste ici que le bonus du savoir au
 * développement des deux notes que le profil de vitesse ne couvre pas encore (fiabilité, gestion des pneus), jusqu'aux phases 12c et 13.
 */

import { CONCEPTION_PROVISOIRE, DOMAINES, LISTE_DOMAINES, type CaracVoiture } from '../../balance/technique';
import type { Monde } from '../../core/monde';
import { reglementEnVigueur, savoirApplicable } from './acces';

/** Phase 12a : seules ces deux notes restent développées de façon abstraite (hors profil de vitesse). */
export const CARACS: readonly CaracVoiture[] = ['fiabilite', 'gestionPneus'];


/** Poids d'un domaine sur une caractéristique (0 si sans lien). */
const poids = (d: (typeof LISTE_DOMAINES)[number], c: CaracVoiture) => (DOMAINES[d].caracs as Partial<Record<CaracVoiture, number>>)[c] ?? 0;

/** Moyenne pondérée, sur les domaines liés à la caractéristique, d'une valeur par domaine. */
export function parCaracteristique(c: CaracVoiture, valeur: (d: (typeof LISTE_DOMAINES)[number]) => number): number {
  let total = 0, somme = 0;
  for (const d of LISTE_DOMAINES) {
    const w = poids(d, c);
    if (!w) continue;
    total += w;
    somme += w * valeur(d);
  }
  return total ? somme / total : 0;
}

/**
 * Bonus du savoir au développement de la saison (multiplicateur ≥ 1) pour une caractéristique :
 * savoir applicable au règlement en vigueur, dans les domaines liés.
 */
export function bonusSavoirDeveloppement(monde: Monde, idEcurie: string, c: CaracVoiture): number {
  const idR = reglementEnVigueur(monde)?.id;
  const s = parCaracteristique(c, (d) => savoirApplicable(monde, idEcurie, d, idR));
  return 1 + (CONCEPTION_PROVISOIRE.bonusDeveloppement * s) / CONCEPTION_PROVISOIRE.echelle;
}
