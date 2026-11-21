/**
 * Paramètres du calendrier (D-028 : 1 pas = 1 semaine).
 * Tous les nombres sont des numéros de semaine (1 à 52), bornes incluses.
 */

/** Nombre de semaines dans une année de jeu. Constante de structure, ne pas modifier en cours de partie. */
export const SEMAINES_PAR_AN = 52;

/** Découpage de l'année en phases de saison. */
export const PHASES_SAISON = {
  /** Intersaison : règlement, budgets, contrats qui expirent, recrutements. */
  intersaison: { debut: 1, fin: 8 },
  /** Présaison : essais, derniers ajustements. */
  presaison: { debut: 9, fin: 10 },
  /** Saison : les Grands Prix ont lieu dans cette fenêtre. */
  saison: { debut: 11, fin: 48 },
  /** Fin de saison : classements, trophées, retraites, bilan. */
  finDeSaison: { debut: 49, fin: 52 },
} as const;
