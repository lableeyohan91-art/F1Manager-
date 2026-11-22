/** Systèmes humains (phase 4) : mémoire, promesses, contrats, interactions, état émotionnel. */

import type { Moteur } from '../../core/moteur';
import { evenementsProteges, systemeOubli } from '../memoire';
import { installerContrats } from './contrats';
import { systemeEtat } from './etat';
import { installerInteractions } from './interactions';
import { systemePromesses } from './promesses';

/**
 * Ordre dans la semaine (après les systèmes de la saison) : promesses, négociations, fins de contrat et recrutements,
 * réservoir, vie du personnel, bilan de saison, état émotionnel, oubli.
 */
export function installerHumain(moteur: Moteur): Moteur {
  moteur.ajouterSysteme(systemePromesses);
  installerContrats(moteur);
  installerInteractions(moteur);
  moteur.ajouterSysteme(systemeEtat).ajouterSysteme(systemeOubli);
  moteur.ajouterProtecteur(evenementsProteges);
  return moteur;
}

export * from './contrats';
export * from './decision';
export * from './etat';
export * from './interactions';
export * from './promesses';
