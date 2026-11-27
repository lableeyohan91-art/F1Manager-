/**
 * Évolution PROVISOIRE des voitures (phase 3), en attendant le vrai développement des pièces (phase 12).
 *
 * Principe : chaque mois de saison, chaque caractéristique progresse selon la capacité de l'écurie
 * (compétences du personnel technique, installations, budget), avec des RENDEMENTS DÉCROISSANTS
 * à l'approche du plafond technique, et un aléa (bonne ou mauvaise intuition).
 * Aucun rappel artificiel vers la moyenne (D-040) : seuls les rendements décroissants rapprochent les écuries.
 */

/** Progression de référence, en points d'indice par mois, pour une écurie de capacité 1 loin du plafond. */
export const TAUX_DEVELOPPEMENT_MENSUEL = 0.35;

/** Plafond technique de la réglementation : une caractéristique ne peut pas l'atteindre (rendements décroissants). */
export const PLAFOND_TECHNIQUE = 25;

/** Aléa mensuel (écart type, en points). */
export const ALEA_DEVELOPPEMENT_MENSUEL = 0.25;

/** À l'intersaison : nouvelle voiture = l'équivalent de N mois de travail, avec un aléa plus fort (concept). */
export const MOIS_EQUIVALENTS_INTERSAISON = 3;
/** Réglé le 22/11/2026 : 1,3 (au lieu de 0,8) pour mieux refléter le risque d'un nouveau concept. */
export const ALEA_INTERSAISON = 1.3;

/** Poids des facteurs dans la capacité de développement d'une écurie (somme = 1). */
export const POIDS_CAPACITE = { competences: 0.4, installations: 0.3, budget: 0.3 };

/** Budget de référence (M€) et bornes du facteur budget. */
export const BUDGET_REFERENCE_MEUR = 400;
export const FACTEUR_BUDGET = { min: 0.5, max: 1.3 };

/** Motoristes : progression annuelle moyenne et aléa (points), avec rendements décroissants. */
export const MOTORISTE_PROGRESSION_ANNUELLE = 0.6;
export const MOTORISTE_ALEA_ANNUEL = 0.6;

/** Bornes des caractéristiques (décimales en interne). */
export const BORNES_CARACTERISTIQUE = { min: 1, max: 24 };

/**
 * Fiabilité et gestion des pneus (développement abstrait, hors pièces) — rapport du 27/11 : sans plafond sur l'échelle des notes ni
 * rattrapage, elles divergeaient sans fin (Ferrari à 24 en pneus, Haas à 12 en 2031) et creusaient la hiérarchie. Plafond `plafond`
 * (rendement décroissant vers `plafond` + 1 : `plafondRendement`) ; chaque mois, une écurie reprend la part `rattrapageMensuel` de l'écart à
 * la meilleure (solutions connues et copiées, comme les pièces).
 */
export const CARACS_ABSTRAITES = { plafond: 20, plafondRendement: 21, rattrapageMensuel: 0.02 };
