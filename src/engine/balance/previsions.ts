/**
 * Tableau de bord prévisionnel (D-180, levier B). Seuils d'affichage seulement : aucun effet sur le jeu.
 */
export const PREVISIONS = {
  /** Écritures comptables écoulées (sur 13) avant de juger le rythme des projets ; avant, la prévision suit le budget. */
  periodesMinRythme: 3,
  /** Dépassement du plafond prévu en dessous duquel on n'alerte pas (M€ ; bruit d'arrondi). */
  toleranceMEUR: 0.1,
  /** Budget de développement non dépensable signalé au-delà de ce montant (M€). */
  nonDepensableSignale: 3,
  /**
   * Prime maximale d'un objectif de course, en multiple de la part du Grand Prix (objectif audacieux : prime = part × 0,9 / 0,15 ≈ 6).
   * Sert seulement au « maximum possible » affiché.
   */
  primeMaxObjectifGP: 6,
  /**
   * Part des projets de l'année qui reste à payer = (Grands Prix restants / calendrier)^exposant (sans unité). Mesuré sur 3 graines ×
   * 4 saisons (profil des dépenses de projets par mois : 39 %, 11 %, 7 %, 9 %, 8 %, 6 %, 5 %, 4 %, 4 %, 3 %, 2 %, 1 %, 1 %).
   */
  exposantFinDeSaison: 2,
  /** Borne de cette part (évite une division par presque zéro en tout début de saison). */
  partRestanteMax: 0.9,
};
