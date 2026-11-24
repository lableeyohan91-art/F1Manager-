/** Règlement sportif et financier de départ (modifiable plus tard par vote, D-012). */

/** Points attribués aux 10 premiers (D-031). */
export const BAREME_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

/* Nombre de Grands Prix par saison (D-030b, D-141) : voir VIVIER dans balance/circuits.ts (phase 11b : 20 au départ, 24 pour les
   parties antérieures au vivier). Si moins de circuits sont disponibles, on les prend tous. */

/** Enveloppe totale des primes de fin de saison, en M€. Estimation de game design. */
export const ENVELOPPE_PRIMES_MEUR = 1100;

/**
 * Part de l'enveloppe par place au classement constructeurs, en % (la somme vaut 100 pour 11 écuries).
 * Pour un autre nombre d'écuries, les parts sont renormalisées.
 */
export const PARTS_PRIMES = [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 5];

/** Plafond budgétaire (M€). Documenté seulement en phase 3 (D-055), appliqué en phase 5. */
export const PLAFOND_BUDGETAIRE_MEUR = 215;
