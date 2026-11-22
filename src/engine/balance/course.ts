/**
 * Modèle de résultat abstrait d'un Grand Prix (docs/systemes/phase-3-saison.md, D-007).
 * Les écarts sont exprimés en POURCENTAGE DE TEMPS AU TOUR équivalent (compatibilité avec le futur moteur de course).
 * Plus le « temps » est bas, mieux la voiture est classée.
 */

/**
 * Écart de temps par point d'indice voiture (1–20), en % du temps au tour. 10 points ≈ 2,8 %.
 * Réglé le 22/11/2026 (rapport d'équilibrage) : 0,2 donnait un plateau trop resserré (1,2 % en moyenne).
 */
export const ECART_VOITURE_PAR_POINT = 0.28;

/** Écart de temps par point de niveau pilote (1–20), en % du temps au tour. */
export const ECART_PILOTE_PAR_POINT = 0.1;

/** Poids des compétences dans le niveau d'un pilote, sur le sec. Somme = 1. */
export const POIDS_PILOTE: Record<string, number> = {
  vitesse: 0.45,
  regularite: 0.15,
  depassement: 0.1,
  defense: 0.05,
  gestionPneus: 0.1,
  departs: 0.05,
  retourTechnique: 0.05,
  condition: 0.05,
};

/** Sous la pluie, cette part du poids de la vitesse passe à la compétence « pluie ». */
export const PART_PLUIE_DANS_VITESSE = 0.7;

/** Forme du jour : écart maximal (en %) apporté par la confiance en soi (0–100, référence 65). */
export const EFFET_FORME_MAX = 0.1;
export const CONFIANCE_REFERENCE = 65;

/** Aléa de course (écart type, en % du temps au tour), sur le sec ; multiplié sous la pluie. */
export const ALEA_SIGMA = 0.3;
export const MULTIPLICATEUR_ALEA_PLUIE = 1.7;

/** Abandon mécanique : probabilité = base + (20 − fiabilité) × parPoint. */
export const ABANDON_MECANIQUE = { base: 0.025, parPoint: 0.007 };

/** Incident de course : probabilité = base + (20 − régularité) × parPoint, multipliée selon les conditions. */
export const INCIDENT = { base: 0.018, parPoint: 0.003, multiplicateurPluie: 1.8, multiplicateurUrbain: 1.5 };

/**
 * Résultat inattendu : le vainqueur avait une voiture en retard d'au moins ce pourcentage de temps au tour
 * sur la meilleure voiture du circuit (≈ 2 points d'indice).
 */
export const SEUIL_SURPRISE_PCT = 0.4;
