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
 */
export const PIECES = {
  chassis: {
    libelle: 'Châssis', conceptionJours: 33, coutProjetMEUR: 1.0, fabricationJours: 10, coutUnitaireMEUR: 0.55, pole: 'conception',
    domaines: ['chassis', 'masse', 'fiabilite'], conceptMoins: 'plateforme aérodynamique', conceptPlus: 'agilité mécanique',
    gain: { masseKg: -0.1, muMeca: 0.12 }, compromis: { muMeca: 1.2, cla: -0.9 },
  },
  aileron_avant: {
    libelle: 'Aileron avant', conceptionJours: 44, coutProjetMEUR: 1.8, fabricationJours: 3, coutUnitaireMEUR: 0.225, pole: 'aero',
    domaines: ['aero_avant'], conceptMoins: 'faible traînée', conceptPlus: 'fort appui',
    gain: { cla: 0.3, cda: -0.05 }, compromis: { cla: 1.5, cda: 0.7 },
  },
  aileron_arriere: {
    libelle: 'Aileron arrière', conceptionJours: 44, coutProjetMEUR: 1.8, fabricationJours: 3, coutUnitaireMEUR: 0.275, pole: 'aero',
    domaines: ['aero_arriere'], conceptMoins: 'faible traînée', conceptPlus: 'fort appui',
    gain: { cla: 0.25, cda: -0.12 }, compromis: { cla: 2.5, cda: 1.8 },
  },
  pontons: {
    libelle: 'Pontons', conceptionJours: 33, coutProjetMEUR: 1.0, fabricationJours: 8, coutUnitaireMEUR: 0.45, pole: 'aero',
    domaines: ['refroidissement', 'gestion_thermique'], conceptMoins: 'carrosserie serrée', conceptPlus: 'refroidissement généreux',
    gain: { cda: -0.18, refroidissement: 0.3 }, compromis: { cda: 1.2, refroidissement: 8 },
  },
  fond_plat: {
    libelle: 'Fond plat', conceptionJours: 33, coutProjetMEUR: 1.0, fabricationJours: 8, coutUnitaireMEUR: 0.4, pole: 'aero',
    domaines: ['fond_plat'], conceptMoins: 'plateforme tolérante', conceptPlus: 'effet de sol maximal',
    gain: { cla: 0.4, cda: -0.03 }, compromis: { cla: 1.6, cda: 0.3, muMeca: -0.6 },
  },
  suspensions: {
    libelle: 'Suspensions', conceptionJours: 33, coutProjetMEUR: 1.0, fabricationJours: 8, coutUnitaireMEUR: 0.3, pole: 'conception',
    domaines: ['suspensions', 'interface_pneus'], conceptMoins: 'plateforme raide', conceptPlus: 'souplesse et motricité',
    gain: { muMeca: 0.12, muMotricite: 0.2, muFreinage: 0.1 }, compromis: { muMotricite: 1.0, muFreinage: 0.4, cla: -0.7 },
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
  noteReference: 14, parPoint: 0.9, conceptParPoint: 0.25, conceptMax: 0.6,
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
