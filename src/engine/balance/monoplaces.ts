/**
 * Phase 12a — monoplaces : pièces, effets physiques, conversion de départ (docs/systemes/phase-12-conception-detaillee.md, D-170).
 * Toutes les valeurs sont PROVISOIRES (D-120), sauf les durées et coûts de F1 Manager 2024, repris tels quels (D-170, Q1 : 1 $ = 1 €).
 */

/**
 * Paramètres physiques de la voiture dont le moteur connaît l'effet sur le temps au tour (sensibilités par circuit, calculées par le
 * profil de vitesse sur les 30 tracés : tools/circuits/sensibilites-voiture.mts → data/grille-2026/sensibilites-circuits.csv).
 * « puissance » : thermique et électrique ensemble.
 */
export const PARAMETRES_SENSIBILITE = ['cla', 'cda', 'masseKg', 'muMeca', 'muMotricite', 'muFreinage', 'puissance'] as const;
export type ParametreVoiture = (typeof PARAMETRES_SENSIBILITE)[number];
/** Paramètres de la voiture qui ne passent pas par le profil de vitesse : marge de refroidissement (points). */
export type ParametreHorsProfil = 'refroidissement';
export type EffetPiece = Partial<Record<ParametreVoiture | ParametreHorsProfil, number>>;

export const TYPES_PIECES = ['chassis', 'aileron_avant', 'aileron_arriere', 'pontons', 'fond_plat', 'suspensions'] as const;
export type TypePiece = (typeof TYPES_PIECES)[number];

/**
 * Les six pièces (D-170 Q13) :
 * - conceptionJours, coutProjetMEUR, fabricationJours, coutUnitaireMEUR : valeurs de base de F1 Manager 2024 (guide technique
 *   communautaire), conservées telles quelles (D-170) ;
 * - pole : département qui conçoit la pièce ; domaines : domaines techniques de la phase 8 dont le savoir fixe la frontière ;
 * - gain : effet d'un point d'EFFICACITÉ (en % du paramètre ; pour le refroidissement, en points de marge) ;
 * - compromis : effet du CONCEPT, de −1 à +1 (en %) : le sens « + » est celui du libellé `conceptPlus`. Un concept n'est jamais
 *   gratuit : il déplace la voiture le long de la frontière (D-114), le profil de vitesse dit où il paie (H, ordres de grandeur).
 *   Le réglage d'ailerons du week-end étant déjà optimisé sur chaque circuit, un concept d'aileron qui ne ferait que déplacer l'appui
 *   dans la proportion du réglage n'apporterait rien (théorème de l'enveloppe). Le compromis des ailerons est donc réglé pour être
 *   à peu près neutre sur un circuit moyen (traînée = −d1 appui / d1 traînée × appui, sensibilités moyennes) : il gagne sur les
 *   circuits lents et chargés, il perd sur les circuits rapides (test tests/monoplaces.test.ts). Même principe pour le châssis, le
 *   fond plat et les suspensions : aucun concept n'est meilleur partout (vérifié sur les 30 circuits, rapport de la 12a).
 */
export const PIECES = {
  chassis: {
    libelle: 'Châssis', conceptionJours: 33, coutProjetMEUR: 1.0, fabricationJours: 10, coutUnitaireMEUR: 0.55, pole: 'conception',
    domaines: ['chassis', 'masse', 'fiabilite'], conceptMoins: 'plateforme aérodynamique', conceptPlus: 'agilité mécanique',
    gain: { masseKg: -0.1, muMeca: 0.12 }, compromis: { muMeca: 1.2, cla: -1.5 },
  },
  aileron_avant: {
    libelle: 'Aileron avant', conceptionJours: 44, coutProjetMEUR: 1.8, fabricationJours: 3, coutUnitaireMEUR: 0.225, pole: 'aero',
    domaines: ['aero_avant'], conceptMoins: 'faible traînée', conceptPlus: 'fort appui',
    gain: { cla: 0.3, cda: -0.05 }, compromis: { cla: 1.5, cda: 4.9 },
  },
  aileron_arriere: {
    libelle: 'Aileron arrière', conceptionJours: 44, coutProjetMEUR: 1.8, fabricationJours: 3, coutUnitaireMEUR: 0.275, pole: 'aero',
    domaines: ['aero_arriere'], conceptMoins: 'faible traînée', conceptPlus: 'fort appui',
    gain: { cla: 0.25, cda: -0.12 }, compromis: { cla: 2.5, cda: 8.2 },
  },
  pontons: {
    libelle: 'Pontons', conceptionJours: 33, coutProjetMEUR: 1.0, fabricationJours: 8, coutUnitaireMEUR: 0.45, pole: 'aero',
    domaines: ['refroidissement', 'gestion_thermique'], conceptMoins: 'carrosserie serrée', conceptPlus: 'refroidissement généreux',
    gain: { cda: -0.18, refroidissement: 0.3 }, compromis: { cda: 1.2, refroidissement: 8 },
  },
  fond_plat: {
    libelle: 'Fond plat', conceptionJours: 33, coutProjetMEUR: 1.0, fabricationJours: 8, coutUnitaireMEUR: 0.4, pole: 'aero',
    domaines: ['fond_plat'], conceptMoins: 'plateforme tolérante', conceptPlus: 'effet de sol maximal',
    gain: { cla: 0.4, cda: -0.03 }, compromis: { cla: 1.2, cda: 0.3, muMeca: -1.0 },
  },
  suspensions: {
    libelle: 'Suspensions', conceptionJours: 33, coutProjetMEUR: 1.0, fabricationJours: 8, coutUnitaireMEUR: 0.3, pole: 'conception',
    domaines: ['suspensions', 'interface_pneus'], conceptMoins: 'plateforme raide', conceptPlus: 'souplesse et motricité',
    gain: { muMeca: 0.12, muMotricite: 0.2, muFreinage: 0.1 }, compromis: { muMotricite: 1.0, muFreinage: 0.4, cla: -0.35 },
  },
} as const satisfies Record<TypePiece, {
  libelle: string; conceptionJours: number; coutProjetMEUR: number; fabricationJours: number; coutUnitaireMEUR: number; pole: 'aero' | 'conception';
  domaines: readonly string[]; conceptMoins: string; conceptPlus: string; gain: EffetPiece; compromis: EffetPiece;
}>;

/**
 * Efficacité de référence d'une pièce (points) : la voiture de référence du profil de vitesse a toutes ses pièces à ce niveau, concept
 * neutre. Une pièce plus efficace améliore ses paramètres de `gain` × (efficacité − référence).
 */
export const EFFICACITE_REFERENCE = 10;

/**
 * Refroidissement (fiche principale §4.2) : marge de la voiture de référence (points) ; besoin d'un circuit = (température de l'air
 * pendant la course − `temperatureNeutreC`) × `parDegre` + altitude / `altitudeParPoint` ; chaque point de besoin non couvert coûte
 * `perteParPoint` % de puissance (gestion thermique simple, la phase 13 la détaillera).
 */
export const REFROIDISSEMENT = { margeReference: 6, temperatureNeutreC: 22, parDegre: 0.6, altitudeParPoint: 400, perteParPoint: 0.3 };

/**
 * Conversion de départ (une seule fois, à la création du monde) des notes de `voitures.csv` (1 à 20, phase 3) en pièces :
 * efficacité = référence + `parPoint` × (note − `noteReference`) ; concept des ailerons et des pontons selon l'écart entre vitesse de
 * pointe et virages rapides (une voiture « rapide en ligne droite » part d'un concept faible traînée), borné à ± `conceptMax`.
 * Notes utilisées par pièce : moyenne des notes listées.
 */
export const CONVERSION_DEPART = {
  noteReference: 14, parPoint: 0.7, conceptParPoint: 0.25, conceptMax: 0.6,
  notes: {
    chassis: ['viragesLents', 'fiabilite'], aileron_avant: ['viragesRapides', 'efficaciteAero'], aileron_arriere: ['efficaciteAero', 'vitessePointe'],
    pontons: ['vitessePointe', 'efficaciteAero'], fond_plat: ['viragesRapides', 'viragesLents'], suspensions: ['viragesLents', 'gestionPneus'],
  } as Record<TypePiece, readonly string[]>,
};

/**
 * Motoriste : puissance relative à la référence, en % par point de niveau (1 à 20) au-dessus de `niveauReference`. Le motoriste n'est
 * pas une pièce de l'écurie (égalité de fourniture aux clients, D-114) ; son développement propre viendra plus tard (ADUO, D-170 Q9).
 */
export const MOTORISTE_PUISSANCE = { niveauReference: 15, pourcentParPoint: 0.6 };

/**
 * Passage de l'écart de temps au tour (%) au terme « voiture » de la simulation du Grand Prix : `echelle` × écart. 1 = la course
 * reçoit exactement l'écart physique ; la conversion de départ (parPoint) est réglée pour retrouver l'écart moyen de la phase 11.
 */
export const COURSE_PHYSIQUE = { echelle: 1 };

/**
 * Indice de performance en « points équivalents » (continuité avec les phases 3 à 11) : base de l'échelle (H, la voiture de référence
 * vaut 15) et note de gestion des pneus qui ne change rien (H).
 */
export const INDICE_PHYSIQUE = { base: 15, notePneusReference: 14 };


/**
 * Frontière de compromis (D-114, fiche §4.3) : efficacité maximale qu'une écurie peut atteindre sur une pièce, sous le règlement en
 * vigueur = `min` + `etendue` × (1 − exp(−S / `echelleSavoir`)) × (1 − pénalité d'architecture), S étant le savoir applicable moyen des
 * domaines de la pièce (phase 8). Rendement décroissant ; `min` + `etendue` est la borne absolue du règlement, que personne n'atteint.
 * Savoir de départ (une fois, à la création du monde) : celui qui place la frontière de chaque pièce à `margeDepart` point au-dessus de
 * son efficacité de départ (les grandes écuries ont des décennies de savoir-faire, une nouvelle écurie beaucoup moins). Versé au savoir
 * FONDAMENTAL (il survit aux réformes, D-128).
 */
export const FRONTIERE = { min: 5, etendue: 14, echelleSavoir: 30, margeDepart: 1, partMaxDepart: 0.95 };

/**
 * Projets de conception (fiche §6, conception simplifiée de la 12a : rythme normal, sans événement) :
 * - tailleEquipe : personnes d'un pôle par projet simultané ; emplacements entre `emplacementsMin` et `emplacementsMax` par pôle ;
 * - productivite : jours de conception par jour de calendrier = `productiviteBase` + `productiviteNiveau` × niveau du pôle / 20,
 *   × qualité des installations du pôle (`installationBase` + `installationParNiveau` × niveau moyen) ;
 * - progression : part de l'écart à la frontière comblée par un projet = `progressionBase` × (compétence / `competenceReference`)
 *   × restriction aérodynamique (pièces aéro, phase 5a, en attendant les heures de soufflerie de la 12b) + exécution incertaine
 *   (écart type `ecartExecution` × exp(−S / `echelleSavoirExecution`)), bornée en bas à `progressionMin` (une version peut être moins bonne) ;
 * - penaliteConcept : points d'efficacité perdus par unité de changement de concept (un concept neuf est moins abouti) ;
 * - exemplaires : pièces fabriquées à la fin de la conception (2 voitures et une de rechange), au coût unitaire de F1M ;
 * - ecartEstimation : erreur d'estimation de l'efficacité (points) par le responsable, réduite par la corrélation (sur 20).
 */
export const PROJETS = {
  tailleEquipe: 45, emplacementsMin: 1, emplacementsMax: 3,
  productiviteBase: 0.7, productiviteNiveau: 0.3, installationBase: 0.8, installationParNiveau: 0.04,
  progressionBase: 0.12, competenceReference: 14, ecartExecution: 0.15, echelleSavoirExecution: 40, progressionMin: -0.15,
  penaliteConcept: 1.5, exemplaires: 3, ecartEstimation: 1.2,
};

/**
 * Intersaison (fiche §6) : la voiture de l'année suivante comble `progression` de l'écart à la frontière sur chaque pièce (le savoir
 * préparé « pour la saison suivante » a déjà été versé au savoir du règlement, phase 8), avec la même exécution incertaine.
 */
export const INTERSAISON = { progression: 0.15 };

/**
 * Reconception à l'entrée d'un nouveau règlement ou d'une évolution mineure (remplace la conversion provisoire de la phase 8, qui
 * ramenait vers la moyenne de la grille) : pour une pièce touchée à l'intensité I,
 * efficacité = min + (1 − I) × (efficacité − min) + I × qualité × (frontière − min) (min : FRONTIERE.min),
 * qualité = `qualiteBase` + `qualiteSavoir` × (1 − exp(−S / FRONTIERE.echelleSavoir)) + exécution incertaine. Absolu, jamais relatif à la grille.
 */
export const RECONCEPTION = { qualiteBase: 0.35, qualiteSavoir: 0.45 };

/**
 * Paris de concept (fiche §10.2, D-170 Q7) : chaque grande réforme cache 2 ou 3 familles d'architecture ; la meilleure n'a aucune
 * pénalité, les autres réduisent la frontière des pièces touchées de `penaliteMin` à `penaliteMax` (part de la marge au-dessus de la
 * référence). Personne ne connaît la vérité : une écurie perçoit chaque pénalité avec un bruit d'écart type
 * `bruitBase` × exp(−savoir préparé / `echelleSavoirIndice`) × (`visionBase` − vision technique du DT / 20).
 * Une pièce est touchée si l'intensité de la réforme dans l'un de ses domaines atteint `intensiteTouchee`.
 */
export const PAYSAGE = { famillesMin: 2, famillesMax: 3, penaliteMin: 0.08, penaliteMax: 0.35, bruitBase: 0.5, echelleSavoirIndice: 40, visionBase: 1.4, intensiteTouchee: 0.3 };

/** Noms des familles d'architecture proposées par orientation de réforme (textes du jeu). */
export const FAMILLES_ARCHITECTURE: Record<string, readonly string[]> = {
  aero: ['effet de sol bas', 'pontons larges', 'canaux de flux'],
  motorisation: ['refroidissement centralisé', 'radiateurs latéraux', 'flux arrière'],
  chassis: ['empattement long', 'empattement court', 'masse centrée'],
  refonte: ['concept compact', 'concept étendu', 'concept hybride'],
};

/**
 * Décisions de l'IA (et du directeur technique en délégation), mêmes règles que le joueur : candidats de concept autour du concept
 * actuel (± `pasConcept`) ; seuil de gain minimal (% de temps au tour) pour lancer un projet ; jugement à graine (% de temps au tour).
 */
export const IA_CONCEPTION = { pasConcept: 0.25, gainMin: 0.005, alea: 0.01 };

/**
 * Sensibilités moyennes des 30 circuits (moyenne de data/grille-2026/sensibilites-circuits.csv, vérifiée par un test) : utilisées pour
 * un circuit sans sensibilités propres, c'est-à-dire seulement dans une partie antérieure au format 31 (migrée sans les données).
 */
export const SENSIBILITES_MOYENNES = { tempsS: 86.707, niveauAileron: 0, d1: {cla: -0.15521, cda: 0.04747, masseKg: 0.26084, muMeca: -0.19018, muMotricite: -0.04747, muFreinage: -0.02265, puissance: -0.11559}, d2: {cla: 0.008198, cda: 5.9e-05, masseKg: 0.003659, muMeca: 0.008279, muMotricite: 0.001675, muFreinage: 0.000657, puissance: 0.001722} };
