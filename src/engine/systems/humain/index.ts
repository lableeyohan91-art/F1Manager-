/** Systèmes humains (phase 4) : mémoire, promesses, contrats, interactions, état émotionnel. */

import type { Moteur } from '../../core/moteur';
import { evenementsProteges, systemeOubli } from '../memoire';
import { installerContrats } from './contrats';
import { installerMarche } from '../marche';
import { systemeEtat } from './etat';
import { installerInteractions } from './interactions';
import { systemePromesses } from './promesses';
import { commandeRepondreDepart, commandeRuptureNegociee, systemeDeparts } from './departs';
import { systemeGroupes } from './groupes';

/**
 * Ordre dans la semaine (après les systèmes de la saison) : promesses, négociations, fins de contrat et recrutements,
 * réservoir, vie du personnel, bilan de saison, état émotionnel, oubli.
 */
export function installerHumain(moteur: Moteur): Moteur {
  moteur.ajouterSysteme(systemePromesses);
  installerContrats(moteur);
  installerMarche(moteur); // phase 7a : marché des transferts des pilotes
  installerInteractions(moteur);
  // Phase 8d-2 : demandes de départ, démissions, ruptures négociées.
  moteur.ajouterSysteme(systemeDeparts);
  // Phase 8d-3 : groupes sociaux émergents.
  moteur.ajouterSysteme(systemeGroupes);
  moteur.commandes.enregistrer(commandeRuptureNegociee).enregistrer(commandeRepondreDepart);
  moteur.ajouterSysteme(systemeEtat).ajouterSysteme(systemeOubli);
  moteur.ajouterProtecteur(evenementsProteges);
  return moteur;
}

export * from './contrats';
export * from './decision';
export * from './etat';
export * from './interactions';
export * from './promesses';
export * from './effectifs';
export * from './departs';
export * from './groupes';
