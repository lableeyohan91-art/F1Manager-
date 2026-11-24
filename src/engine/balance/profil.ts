/**
 * Phase 11b — profil de vitesse (modèle physique simplifié, docs/systemes/phase-11b-circuits.md §3.3).
 * Toutes les valeurs sont des hypothèses de conception (H) calées sur des tours réels de 2026 (R), pas des données d'écurie.
 * Unités SI sauf mention.
 */

/** Gravité (m/s²). */
export const G = 9.81;
/** Densité de l'air au niveau de la mer à 15 °C (kg/m³) ; hauteur d'échelle de l'atmosphère (m). */
export const AIR = { densiteMer: 1.225, hauteurEchelleM: 8500, temperatureReferenceC: 15 };

/**
 * Voiture de référence (une monoplace moyenne du plateau 2026, valeurs de travail H calées sur les tours réels) :
 * - masseKg : voiture, pilote et essence moyenne ;
 * - puissanceThermiqueW : moteur thermique ; puissanceElectriqueW : déploiement électrique maximal ;
 * - deploiement : le règlement 2026 réduit le déploiement électrique avec la vitesse, de `pleinJusquaKmh` jusqu'à zéro à `nulAKmh` (H, ordre de grandeur) ;
 * - cla, cda : appui et traînée (coefficient × surface, m²) ;
 * - muMeca : adhérence mécanique latérale (sans appui) ; muAero : part de l'appui transformée en adhérence ;
 * - muMotricite : adhérence longitudinale disponible à l'accélération ; muFreinage : au freinage ;
 * - vitesseMaxMs : butée numérique (jamais atteinte en pratique).
 */
export const VOITURE_REFERENCE = {
  masseKg: 850,
  puissanceThermiqueW: 400_000,
  puissanceElectriqueW: 350_000,
  deploiement: { pleinJusquaKmh: 290, nulAKmh: 355 },
  // Calés le 24/11/2026 (tools/calage-profil.mts) sur 25 tours de qualification 2026 de 5 circuits, dans des bornes plausibles.
  cla: 3.49,
  cda: 0.61,
  muMeca: 1.25,
  muAero: 2.18,
  muMotricite: 1.0,
  muFreinage: 1.42,
  vitesseMaxMs: 110,
  /** Énergie électrique déployable par tour (J) : le déploiement est réparti au prorata quand le besoin dépasse le budget (H, ordre de grandeur du règlement 2026). */
  energieElectriqueTourJ: 6_210_000,
};

/**
 * Réglage d'ailerons du week-end (D-160) : niveau a de −`min` à +`max`, appui × (1 + a) et traînée × (1 + `trainee` × a).
 * Le profil de vitesse choisit le niveau qui donne le meilleur tour : c'est le « niveau d'appui naturel » du circuit (H).
 * `trainee` : un aileron ajoute environ 4 fois plus d'appui que de traînée, la voiture entière environ 5,4 fois plus (CLA / CDA) ;
 * en relatif, ΔCDA / CDA ≈ (CLA / CDA) / 4 × ΔCLA / CLA ≈ 1,35 × a (ordre de grandeur, H). Avec 0,7 (premier essai), l'aileron
 * maximal gagnait partout, même à Monza : physiquement faux.
 */
export const NIVEAUX_AILERONS = { min: -0.35, max: 0.45, pas: 0.05, trainee: 1.35 };

/**
 * Moteur turbo en altitude : la puissance thermique baisse moins vite que la densité de l'air (le turbo compense en partie).
 * puissance × (densité relative)^exposant (H).
 */
export const PUISSANCE_ALTITUDE_EXPOSANT = 0.35;

/** Calcul du profil : lissage de la courbure (points de chaque côté) et nombre de tours de calcul pour boucler. */
export const PROFIL = { demiFenetreCourbure: 3, lissageCourbure: 3, passes: 2, iterationsEnergie: 3 };
/** Pas de la trace (m) pour lequel la fenêtre de courbure est réglée (traces construites tous les 5 m). */
export const PAS_TRACE_M = 5;

/** Classes de virages selon la vitesse minimale (km/h), comme la presse spécialisée : lent < 130 ≤ moyen < 200 ≤ rapide. */
export const CLASSES_VIRAGES = { lentMaxKmh: 130, moyenMaxKmh: 200 };
/** Détection d'un virage : courbure minimale (1/m) et angle total minimal (degrés). */
export const DETECTION_VIRAGE = { courbureMin: 1 / 600, angleMinDeg: 12 };

/**
 * Sensibilités : perturbation relative appliquée à chaque paramètre physique pour mesurer son influence sur le temps au tour.
 * La même perturbation (2 %) pour tous : on compare des effets, pas des coûts (les coûts de développement viennent en phase 12).
 */
export const PERTURBATION_SENSIBILITE = 0.02;
