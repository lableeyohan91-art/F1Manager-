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

/**
 * Écart de temps par point de niveau pilote (1–20), en % du temps au tour.
 * D-074 (22/11/2026) : réglage C2 « équilibre », PROVISOIRE (avant : 0,20 réglage B ; 0,10 référence P3).
 */
export const ECART_PILOTE_PAR_POINT = 0.15;

/**
 * Poids des compétences dans le niveau d'un pilote, sur le sec, pour un circuit neutre (D-104). Somme = 1.
 * « rythme » est réparti entre freinage, virages lents, virages rapides et motricité selon les exigences du circuit ;
 * gestion des pneus et condition sont modulées par la dégradation et l'exigence physique ; puis tout est renormalisé à 1.
 */
export const POIDS_PILOTE: Record<string, number> = {
  rythme: 0.4,
  intelligenceCourse: 0.12,
  regularite: 0.12,
  depassement: 0.08,
  defense: 0.05,
  gestionPneus: 0.08,
  departs: 0.05,
  retourTechnique: 0.05,
  condition: 0.05,
};

/** Sous la pluie, cette part du poids du rythme passe à la compétence « pluie ». */
export const PART_PLUIE_DANS_RYTHME = 0.7;

/** Difficulté technique du circuit (1–5) : l'influence du pilote est multipliée par min + parPoint × difficulté (1 pour 3). */
export const DIFFICULTE_CIRCUIT = { min: 0.85, parPoint: 0.05 };

/** Forme du jour : écart maximal (en %) apporté par la confiance en soi (0–100, référence 65). */
export const EFFET_FORME_MAX = 0.1;
export const CONFIANCE_REFERENCE = 65;

/** Aléa de course (écart type, en % du temps au tour), sur le sec ; multiplié sous la pluie. */
/** D-074 : réglage C2, PROVISOIRE (avant : 0,22 réglage B ; 0,30 référence P3). */
export const ALEA_SIGMA = 0.3;
export const MULTIPLICATEUR_ALEA_PLUIE = 1.7;

/**
 * Abandon mécanique : probabilité = base + (20 − fiabilité) × parPoint, jamais sous le plancher (une voiture de fiabilité 24 casse
 * encore parfois : audit 1.5, la fiabilité peut dépasser 20 ; H : environ une panne tous les 100 départs).
 */
export const ABANDON_MECANIQUE = { base: 0.025, parPoint: 0.007, plancher: 0.01 };

/** Incident de course : probabilité = base + (20 − régularité) × parPoint, multipliée selon les conditions. */
/** Incidents : probabilité = (base + (20 − régularité) × parPoint) × pluie × (risque d'accident du circuit / référence). */
export const INCIDENT = { base: 0.018, parPoint: 0.003, multiplicateurPluie: 1.8, risqueReference: 3 };

/**
 * Résultat inattendu : le vainqueur avait une voiture en retard d'au moins ce pourcentage de temps au tour
 * sur la meilleure voiture du circuit (≈ 2 points d'indice).
 */
export const SEUIL_SURPRISE_PCT = 0.4;
