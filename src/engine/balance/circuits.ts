/**
 * Exigences des circuits selon leur type (D-056) : poids de chaque caractéristique de la voiture
 * dans l'indice de performance sur ce circuit. Chaque profil somme à 1.
 * La fiabilité n'y figure pas : elle agit sur les abandons, pas sur la vitesse.
 * La motorisation de la voiture est celle de son motoriste.
 */

export const CARACTERISTIQUES_VITESSE = ['viragesLents', 'viragesRapides', 'vitessePointe', 'efficaciteAero', 'motorisation', 'gestionPneus'] as const;
export type CaracteristiqueVitesse = (typeof CARACTERISTIQUES_VITESSE)[number];

/**
 * D-107 : chaque circuit a ses propres exigences (1–5). Le poids de chaque caractéristique de la voiture en découle :
 * poids ∝ somme (exigence × coefficient) ci-dessous, puis normalisation à 1 (influence totale de la voiture inchangée).
 * La motorisation pèse davantage en altitude (air raréfié) : × (1 + altitude / altitudeReference).
 */
export const POIDS_VOITURE_PAR_EXIGENCE: Record<CaracteristiqueVitesse, Partial<Record<string, number>>> = {
  viragesLents: { lents: 1 },
  viragesRapides: { rapides: 1 },
  vitessePointe: { lignesDroites: 0.8 },
  efficaciteAero: { rapides: 0.4, lignesDroites: 0.4 },
  motorisation: { lignesDroites: 0.6, motricite: 0.2 },
  gestionPneus: { degradationPneus: 0.8 },
};
export const ALTITUDE_REFERENCE_M = 3000;
/** Exigences par défaut selon l'ancien type de circuit (sauvegardes antérieures au format 8). */
export const EXIGENCES_PAR_TYPE: Record<string, Record<string, number>> = {
  rapide: { lents: 2, rapides: 5, freinage: 3, motricite: 3, lignesDroites: 4, degradationPneus: 3, exigencePhysique: 4, difficulte: 3, risqueAccident: 3 },
  'lent et sinueux': { lents: 5, rapides: 2, freinage: 3, motricite: 4, lignesDroites: 1, degradationPneus: 3, exigencePhysique: 4, difficulte: 4, risqueAccident: 2 },
  mixte: { lents: 3, rapides: 3, freinage: 3, motricite: 3, lignesDroites: 3, degradationPneus: 3, exigencePhysique: 3, difficulte: 3, risqueAccident: 3 },
  urbain: { lents: 4, rapides: 2, freinage: 4, motricite: 4, lignesDroites: 3, degradationPneus: 2, exigencePhysique: 4, difficulte: 4, risqueAccident: 5 },
  altitude: { lents: 3, rapides: 2, freinage: 4, motricite: 4, lignesDroites: 4, degradationPneus: 2, exigencePhysique: 3, difficulte: 3, risqueAccident: 2 },
};

/** Probabilité de pluie pendant un Grand Prix, selon le climat du circuit. */
export const PROBABILITE_PLUIE: Record<string, number> = {
  'très faible': 0.03,
  faible: 0.08,
  moyen: 0.15,
  élevé: 0.25,
};
