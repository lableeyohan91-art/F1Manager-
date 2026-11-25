/** Phase 12a — monoplaces : physique, pièces, conception (D-170). */

import type { Moteur, Systeme } from '../../core/moteur';
import { avancerProjetsConception, commandeAnnulerProjet, commandeArchitecture, commandeLancerProjet, commandeSoufflerie, decisionsConception } from './conception';

export * from './physique';
export * from './pieces';
export * from './conception';
export * from './soufflerie';

/** Chaque semaine : avancement des projets (conception, fabrication, installation), puis décisions de l'IA et des DT délégués. */
export const systemeMonoplaces: Systeme = {
  nom: 'monoplaces.conception',
  executer({ monde, commanderIA }) {
    avancerProjetsConception(monde);
    decisionsConception(monde, (c) => commanderIA(c));
  },
};

export function installerMonoplaces(moteur: Moteur): Moteur {
  moteur.ajouterSysteme(systemeMonoplaces);
  moteur.commandes.enregistrer(commandeLancerProjet).enregistrer(commandeAnnulerProjet).enregistrer(commandeArchitecture).enregistrer(commandeSoufflerie);
  return moteur;
}
