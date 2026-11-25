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
  // Calés le 24/11/2026 (tools/calage-profil.mts) sur 25 tours de qualification 2026 de 5 circuits, dans des bornes plausibles,
  // avec l'aérodynamique active, le déploiement électrique par vitesse de coupure et l'adhérence propre à chaque piste.
  // Recalés le même jour après la correction de la comptabilité électrique (l'électrique utilisé en sortie de virage, limité par la
  // motricité, est désormais compté), avec la contrainte publique « moins d'appui à Monza qu'à Monaco » (tools/calage-profil.mts).
  // Valeurs précédentes et comparaison : docs/rapports/phase-11b/audit-apex-lab.md.
  cla: 4.043,
  cda: 0.8798,
  muMeca: 1.27,
  muAero: 1.805,
  muMotricite: 0.8319,
  muFreinage: 1.498,
  vitesseMaxMs: 110,
  /** Énergie électrique déployable par tour (J) : au-delà, l'écurie coupe le déploiement au-dessus d'une vitesse de coupure (H, ordre de grandeur du règlement 2026). */
  energieElectriqueTourJ: 8_413_000,
  /**
   * Aérodynamique active (règlement 2026) : sur les portions presque droites, les ailerons s'ouvrent. Traînée × (1 − reductionTraineeLigne),
   * appui × (1 − reductionAppuiLigne). En virage et au freinage, configuration normale (H, approximation géométrique des zones).
   */
  reductionTraineeLigne: 0.9226,
  reductionAppuiLigne: 0.6775,
  /**
   * Phase 12a (refonte D-163) : part de l'appui et de la traînée de la voiture (au réglage médian) due aux ailerons (H : effet de sol
   * ≈ 60 % de l'appui ; ailerons ≈ 35 % de la traînée). Le réglage d'ailerons et l'aérodynamique active n'agissent que sur cette part.
   */
  partAppuiAileron: 0.336,
  partTraineeAileron: 0.406,
  /** Niveau d'ailerons du week-end (réglage, 0 = médian) : fixé par `avecAilerons`. */
  niveauAileron: 0,
  /** Finesse incrémentale des ailerons : appui ajouté / traînée ajoutée quand on charge l'aileron (H, plage plausible 2,5 à 6 ; calée). */
  finesseIncrementale: 3.231,
};

/** Aérodynamique active : portion « ligne droite » si le rayon dépasse ce seuil (m) ; zones réelles désignées par la FIA, ici approchées par la géométrie (H). */
/** Phase 12a : une zone d'aéro active doit être une vraie ligne droite, longue d'au moins `longueurMinM` (zones désignées par la FIA, H). */
export const AERO_ACTIVE = { rayonMinLigneM: 1000, longueurMinM: 300 };

/**
 * Réglage d'ailerons du week-end (D-160), refondu en phase 12a (D-163) : niveau a de `min` à `max`, centré sur le réglage médian.
 * Seule la part « ailerons » change : appui des ailerons × (1 + a) ; leur traînée augmente de l'appui ajouté divisé par la
 * finesse incrémentale de la voiture (`VOITURE_REFERENCE.finesseIncrementale`).
 * Le profil de vitesse choisit le niveau qui donne le meilleur tour : c'est le « niveau d'appui naturel » du circuit.
 */
export const NIVEAUX_AILERONS = { min: -0.6, max: 1.4, pas: 0.05 };

/**
 * Moteur turbo en altitude : la puissance thermique baisse moins vite que la densité de l'air (le turbo compense en partie).
 * puissance × (densité relative)^exposant (H).
 */
export const PUISSANCE_ALTITUDE_EXPOSANT = 0.35;

/**
 * Calcul du profil : lissage de la courbure (points de chaque côté), nombre de tours de calcul pour boucler, étapes de la recherche
 * de la vitesse de coupure électrique (16 : précision ≈ 0,006 km/h, sinon le bruit rendait certains gains faussement négatifs),
 * lissage temporel de la courbure (s de trajet à la vitesse calculée ; 0 = désactivé ; H, corrige le biais des virages rapides,
 * voir docs/rapports/phase-11b/audit-apex-lab.md).
 */
export const PROFIL = { demiFenetreCourbure: 3, lissageCourbure: 3, passes: 2, iterationsEnergie: 16, lissageTemporelS: 0.25 };
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

/**
 * Points essentiels (D-159, normalisation validée par le porteur le 24/11/2026) :
 * - chaque gain est rapporté à la moyenne de ce paramètre sur le calendrier (« un point vaut le même gain moyen ») ;
 * - un paramètre dont le gain brut sur ce circuit est inférieur à `gainNegligeableS` (s, pour +2 %), ou à `partNegligeable` du plus fort gain
 *   du circuit, ne peut pas être déclaré essentiel : sinon de petites variations d'un paramètre presque sans effet partout seraient gonflées
 *   (motricité à 40 % à Monaco pour 0,07 s, essai du 24/11/2026).
 */
export const POINTS_ESSENTIELS = { gainNegligeableS: 0.05, partNegligeable: 0.2 };
