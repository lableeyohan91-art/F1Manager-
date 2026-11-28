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

/* ===================================================================== Phase 13a — course tour par tour (D-192) */

/**
 * Durée et tours (fiche phase-13a §2) : nombre de tours = `dureeCibleS` / temps au tour de référence du circuit (s), borné à
 * [`toursMin`, `toursMax`] ; `tempsTourDefautS` si le circuit n'a pas de profil de vitesse. Valeurs PROVISOIRES (D-120).
 */
export const COURSE_TOURS = { dureeCibleS: 5000, toursMin: 40, toursMax: 80, tempsTourDefautS: 90 };

/**
 * Composés (fiche §3), en % du temps au tour : `ecart` = retard à neuf sur le tendre ; `usure` = perte par tour de relais ; `vie` = tours
 * avant la falaise ; `falaise` = perte supplémentaire par tour au-delà. L'usure est multipliée par degradationPneus / `degradationReference`.
 * Le composé « pluie » sert sur piste mouillée (pas d'arrêt obligatoire).
 */
// 13a bis (audit du 28/11 : 0 % de stratégies à deux arrêts, 67 % de « moyen → dur ») : usures plus fortes et plus contrastées,
// vies plus courtes, mise en température (`chauffe` : perte des premiers tours d'un train neuf, en % du tour, tour 1, 2, 3).
export const COMPOSES = {
  tendre: { ecart: 0, usure: 0.14, vie: 14, chauffe: [0.35, 0.1] },
  moyen: { ecart: 0.6, usure: 0.08, vie: 24, chauffe: [0.6, 0.2] },
  dur: { ecart: 1.1, usure: 0.045, vie: 36, chauffe: [0.9, 0.35, 0.1] },
  pluie: { ecart: 0, usure: 0.04, vie: 60, chauffe: [0.5, 0.15] },
} as const;
/**
 * `exposantDegradation` : l'usure suit (dégradation du circuit / référence) ^ exposant (circuits peu et très dégradants plus contrastés) ;
 * `chaleur` : usure × (1 + parDegre × (température de l'air du mois − seuilC)) au-dessus du seuil (°C).
 */
export const PNEUS_COURSE = {
  /** `facteurVieMin` : plancher du facteur d'usure pour allonger la vie d'un pneu (vie ÷ √facteur). */
  falaise: 0.4, degradationReference: 3, exposantDegradation: 1.5, facteurVieMin: 0.3, chaleur: { seuilC: 25, parDegre: 0.015 },
  /** Gestion des pneus : usure × (1 − parPoint × (note − référence)), pour le pilote (compétence /20) et la voiture (caractéristique). */
  parPointPilote: 0.03, referencePilote: 12, parPointVoiture: 0.03, referenceVoiture: 16, facteurMin: 0.6,
};

/**
 * Consignes (fiche §5) : `rythme` = gain (négatif = plus rapide) en % du tour ; `usure` = multiplicateur d'usure des pneus ;
 * `incident` = multiplicateur du risque d'incident ; `conso` = multiplicateur de consommation ; `batterie` = énergie dépensée par tour
 * (unités de la réserve ; négatif = recharge).
 */
export const CONSIGNES = {
  // Banc du 27/11 (tools/banc-consignes.mts, 8 saisons × 2 écuries) : avec les premières valeurs, « pneus conservateurs » gagnait partout
  // (+25 à +30 % de points), puis « conduite agressive » (+5 %) au 2e banc ; 13a bis (pneus plus usants) : revu à nouveau avec le
  // balayage des 30 circuits (aucune consigne gagnante en moyenne ; chacune gagne sur certains circuits).
  conduite: { agressive: { rythme: -0.22, usure: 1.25, incident: 1.5 }, neutre: { rythme: 0, usure: 1, incident: 1 }, conservatrice: { rythme: 0.16, usure: 0.85, incident: 0.7 } },
  pneus: { agressive: { rythme: -0.27, usure: 1.3 }, neutre: { rythme: 0, usure: 1 }, conservatrice: { rythme: 0.25, usure: 0.78 } },
  carburant: { agressive: { rythme: -0.12, conso: 1.04 }, neutre: { rythme: 0, conso: 1 }, conservatrice: { rythme: 0.1, conso: 0.97 } },
  batterie: { agressive: { rythme: -0.1, energie: 1 }, neutre: { rythme: 0, energie: 0 }, conservatrice: { rythme: 0.03, energie: -0.5 } },
} as const;

/**
 * Carburant et batterie (fiche §4) : marge de carburant (part de la course) ; perte par tour de carburant manquant (économie forcée,
 * % du tour · tour) ; réserve de batterie (unités) et perte par tour quand elle est vide (recharge forcée, % du tour).
 */
export const RESSOURCES = { margeCarburant: 0.01, economieParTourManquant: 5, reserveBatterie: 4, rechargeForcee: 0.12 };
/**
 * 13a bis — charge de carburant au départ (décision de préparation, fiche d'intention §10) : part de la charge « neutre » en plus ou en moins
 * (`charge`), masse de la charge neutre (`masseNeutreKg`, kg : la masse moyenne en course est déjà dans les sensibilités de course) ; une
 * voiture plus légère gagne selon la sensibilité du circuit à la masse ; si le carburant manque de plus de `panneSeuil` (part de la course)
 * malgré l'économie, c'est la panne sèche.
 */
export const CARBURANT = { charge: { reduite: -0.05, neutre: 0, reserve: 0.03 }, masseNeutreKg: 100, panneSeuil: 0.06 };

/**
 * Arrêts (fiche §6) : perte dans la voie des stands (s) ; immobilisation = `immobilisationMinS` + (100 − rapidité) × `parPointRapidite`
 * + fatigue × `parPointFatigue` (s, équipe des stands de la phase 8d, échelles 0–100) ; erreur avec la probabilité
 * (100 − précision) × `erreurParPoint`, qui coûte `perteErreurS` ; équipe absente : `defaut`. Stratégie : au plus `arretsMax` arrêts ;
 * l'ingénieur estime l'usure avec une erreur relative d'écart type `erreurEstimation`.
 */
export const ARRETS = { perteVoieS: 21, immobilisationMinS: 2, parPointRapidite: 0.015, parPointFatigue: 0.005, erreurParPoint: 0.002, perteErreurS: 4, defaut: 70, arretsMax: 3, erreurEstimation: 0.1 };
