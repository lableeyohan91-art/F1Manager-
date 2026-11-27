/**
 * Phase 8d — équipe des stands (D-129, D-132 questions 13 à 16 ; fiche phase 8 §9 bis).
 * Phase 13a (D-192) : rapidité, précision et fatigue sont lues par les arrêts aux stands (balance/course.ts, ARRETS) ; la cohésion
 * le sera en 13c (l'exception temporaire de D-132, question 13, est levée pour les trois premières).
 * Échelles : rapidité, précision, cohésion, fatigue et expérience collective de 0 à 100 ; valeurs PROVISOIRES (D-120).
 */

/**
 * Création d'une équipe (à partir du département « stands » existant, dont l'effectif et le niveau fixent déjà le coût) :
 * plafond = parPointNiveau × niveau du département (sur 20) + aléa ; niveau actuel = plafond × [actuelMin ; actuelMax].
 */
export const CREATION_STANDS = { parPointNiveau: 5, ecartPlafond: 4, plafondMin: 30, plafondMax: 98, actuelMin: 0.85, actuelMax: 0.95, cohesion: 60, ecartCohesion: 10, fatigue: 20, partExperimentes: 0.6, experience: 50 };

/**
 * Encadrement (0 à 1, environ) : poids du chef d'équipe (organisation des stands, leadership, gestion humaine) et du directeur
 * sportif (organisation des stands), notes sur 20 ; `noteAbsent` si le poste est vacant ; effet de la relation chef → directeur
 * sportif (affinité, −1 à 1). Efficacité de l'entraînement = efficaciteBase + encadrement.
 * Installations utiles (centre de formation, installations du personnel) : facteur = installationsBase + installationsParNiveau × niveau moyen.
 */
export const ENCADREMENT_STANDS = { poidsChef: 0.6, poidsDirecteurSportif: 0.4, noteAbsent: 8, effetRelation: 0.1, efficaciteBase: 0.5, installationsBase: 0.7, installationsParNiveau: 0.06 };

/**
 * Entraînement (D-129 ; plan modifiable à tout moment, D-132 question 16) :
 * - taux : part de l'écart au plafond comblée par semaine (rapidité, précision), selon l'intensité ;
 * - cohesion : points de cohésion par semaine d'entraînement « coordination », selon l'intensité (rendements décroissants) ;
 * - charge : fatigue ajoutée par semaine selon l'intensité (rien en « récupération ») ;
 * - recuperation : fatigue retirée en plus par semaine de « récupération », selon l'intensité ;
 * - effetFatigue : un entraînement progresse de (1 − fatigue / effetFatigue) ;
 * - rigueurPrecision : l'entraînement à la précision est modulé par la rigueur du chef, × (rigueurBase + rigueurPente × rigueur / 20).
 */
export const ENTRAINEMENT_STANDS = {
  taux: { legere: 0.01, normale: 0.02, intensive: 0.03 },
  cohesion: { legere: 1, normale: 2, intensive: 3 },
  charge: { legere: 1.5, normale: 3, intensive: 5 },
  recuperation: { legere: 4, normale: 6, intensive: 8 },
  effetFatigue: 200,
  rigueurBase: 0.8,
  rigueurPente: 0.4,
} as const;
export type IntensiteStands = keyof typeof ENTRAINEMENT_STANDS.taux;
export const ORIENTATIONS_STANDS = ['rapidite', 'precision', 'coordination', 'recuperation'] as const;
export type OrientationStands = (typeof ORIENTATIONS_STANDS)[number];

/**
 * Cohésion (D-129 : elle libère le potentiel sans le dépasser ; l'ancienneté seule ne suffit pas) :
 * - plafond = plafondBase + plafondEncadrement × encadrement ;
 * - parGrandPrix : gain par Grand Prix disputé (expérience des arrêts en course), avec rendements décroissants ;
 * - stabilite : gain hebdomadaire d'une équipe stable, plafonné à partStabilite × plafond (stagnation sans entraînement ni course) ;
 * - changementChef : part de la cohésion perdue au départ du chef d'équipe.
 */
export const COHESION_STANDS = { plafondBase: 60, plafondEncadrement: 40, parGrandPrix: 1, stabilite: 0.1, partStabilite: 0.6, changementChef: 0.15 };

/** Fatigue liée au calendrier : par Grand Prix, en plus si deux week-ends se suivent ; récupération de base, et en plus sans course. */
export const FATIGUE_STANDS = { parGrandPrix: 4, enchainement: 3, recuperationBase: 1.5, recuperationSansCourse: 1.5 };

/** Expérience collective : gain par Grand Prix (rendements décroissants vers 100). */
export const EXPERIENCE_STANDS = { parGrandPrix: 1.5 };

/**
 * Renouvellement de fin de saison (départs naturels) : part = base + climat × (seuilMotivation − motivation du chef) / seuilMotivation
 * (si positif) + fatigue (si fatigue > seuilFatigue). Les remplaçants arrivent à `niveauArrivee` × plafond.
 * Perte de cohésion = part × (1 + poidsExperimentes × part d'expérimentés) : perdre le noyau expérimenté coûte davantage.
 * Les mécaniciens restants gagnent en expérience : part d'expérimentés += progressionExperimentes × (1 − part).
 */
export const RENOUVELLEMENT_STANDS = { base: 0.08, climat: 0.1, seuilMotivation: 50, fatigue: 0.05, seuilFatigue: 70, niveauArrivee: 0.85, poidsExperimentes: 0.5, progressionExperimentes: 0.15 };

/**
 * Recrutement par vagues (commande `stands.recrutement`, même règle pour le joueur et l'IA) : nombre de mécaniciens remplacés
 * (au plus `partMax` de l'effectif), niveau visé (1 à 20, celui du département). Coût unique = nombre × coutParMecanicien × niveau / 10
 * (M€, sous le plafond, compte « opérations ») ; le coût annuel suit le niveau du département (finances existantes).
 */
export const RECRUTEMENT_STANDS = { partMax: 0.5, coutParMecanicien: 0.02 };

/**
 * IA (mêmes commandes) : plan revu toutes les `periodeSemaines` ; « récupération » si la fatigue dépasse `fatigueRecuperation`, ou
 * `fatigueAvantEnchainement` quand au moins `grandsPrixCharges` GP tombent dans les `horizonSemaines` à venir ; sinon la caractéristique
 * la plus en retard sur son plafond (ratio × un jugement propre au directeur sportif, ± `jugement`), en « intensive » si le directeur
 * sportif aime le risque (> seuilRisque sur 20) et que le calendrier est léger, en « légère » avant un enchaînement.
 * Recrutement d'hiver si le niveau du département est au moins `ecartMin` sous la cible = cibleBase + ciblePrestige × (prestige − 10),
 * et la trésorerie au-dessus de `tresorerieMin` : une vague de `partVague` de l'effectif au niveau cible.
 */
export const IA_STANDS = { periodeSemaines: 4, horizonSemaines: 4, fatigueRecuperation: 60, fatigueAvantEnchainement: 30, grandsPrixCharges: 3, seuilRisque: 12, jugement: 0.05, cibleBase: 13, ciblePrestige: 0.4, ecartMin: 1, tresorerieMin: 20, partVague: 0.2, semaineRecrutement: 2 };

/** Historique conservé (saisons). */
export const HISTORIQUE_STANDS = { saisons: 10 };
