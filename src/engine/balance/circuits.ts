/**
 * Exigences des circuits selon leur type (D-056) : poids de chaque caractéristique de la voiture
 * dans l'indice de performance sur ce circuit. Chaque profil somme à 1.
 * La fiabilité n'y figure pas : elle agit sur les abandons, pas sur la vitesse.
 * La motorisation de la voiture est celle de son motoriste.
 */

export const CARACTERISTIQUES_VITESSE = ['viragesLents', 'viragesRapides', 'vitessePointe', 'efficaciteAero', 'motorisation', 'gestionPneus'] as const;
export type CaracteristiqueVitesse = (typeof CARACTERISTIQUES_VITESSE)[number];

export const PROFILS_CIRCUIT: Record<string, Record<CaracteristiqueVitesse, number>> = {
  rapide: { viragesLents: 0.05, viragesRapides: 0.3, vitessePointe: 0.25, efficaciteAero: 0.15, motorisation: 0.2, gestionPneus: 0.05 },
  'lent et sinueux': { viragesLents: 0.4, viragesRapides: 0.1, vitessePointe: 0.05, efficaciteAero: 0.15, motorisation: 0.05, gestionPneus: 0.25 },
  mixte: { viragesLents: 0.2, viragesRapides: 0.2, vitessePointe: 0.15, efficaciteAero: 0.15, motorisation: 0.15, gestionPneus: 0.15 },
  urbain: { viragesLents: 0.4, viragesRapides: 0.05, vitessePointe: 0.1, efficaciteAero: 0.1, motorisation: 0.1, gestionPneus: 0.25 },
  altitude: { viragesLents: 0.15, viragesRapides: 0.2, vitessePointe: 0.15, efficaciteAero: 0.2, motorisation: 0.25, gestionPneus: 0.05 },
};

/** Probabilité de pluie pendant un Grand Prix, selon le climat du circuit. */
export const PROBABILITE_PLUIE: Record<string, number> = {
  'très faible': 0.03,
  faible: 0.08,
  moyen: 0.15,
  élevé: 0.25,
};
