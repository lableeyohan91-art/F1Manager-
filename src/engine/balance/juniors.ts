/**
 * Filières juniors — phase 6b-1 (docs/systemes/phase-6b-filieres-juniors.md, D-112). Valeurs provisoires (D-095).
 */

/** Catégories simulées : écuries, pilotes par écurie, manches, âges d'admission, prix moyen d'un baquet (M€ par an). */
export const CATEGORIES_JUNIORS = {
  apex3: { libelle: 'Apex 3', ecuries: 10, pilotesParEcurie: 3, manches: 10, ageMin: 16, ageMax: 21, prixBaquetMEUR: 1, rangCategorie: 1 },
  apex2: { libelle: 'Apex 2', ecuries: 11, pilotesParEcurie: 2, manches: 12, ageMin: 18, ageMax: 24, prixBaquetMEUR: 2.5, rangCategorie: 2 },
} as const;
export type CategorieJunior = keyof typeof CATEGORIES_JUNIORS;

/** Écuries juniors générées : qualité (1–20), écart de prix autour du prix moyen (part), part ayant une écurie de F1 partenaire. */
export const ECURIES_JUNIORS = { qualite: { moyenne: 11, ecartType: 2.5 }, variationPrix: 0.3, partPartenaires: 0.35 };

/** Course junior : influence de la qualité de l'écurie (% de temps au tour par point), aléa (écart type, %), incidents. */
export const COURSE_JUNIOR = { ecartEquipeParPoint: 0.04, aleaSigma: 0.45, multiplicateurPluie: 1.6, incidentBase: 0.03, incidentParPoint: 0.004, incidentPluie: 1.5 };
/** Barème des points juniors (10 premiers). */
export const BAREME_JUNIOR = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

/** Expérience : une course junior vaut cette part d'un Grand Prix pour le facteur d'expérience (D-106), mais compte pleinement pour la connaissance du circuit. */
export const POIDS_COURSE_JUNIOR = 0.5;
/** Progression : temps de jeu d'un pilote qui a un baquet junior (6a §4.2). */
export const TEMPS_DE_JEU_BAQUET_JUNIOR = 0.9;

/**
 * Marché des baquets : score d'un candidat = talent (niveau visible + potentiel estimé + réputation) + argent apporté,
 * l'argent pesant plus pour une écurie de faible qualité (pauvre). Remise sur le prix pour les grands talents.
 */
export const MARCHE_BAQUETS = {
  poidsNiveau: 1, poidsPotentiel: 0.5, poidsReputation: 0.03, poidsArgent: 2.5, poidsArgentQualiteRef: 10,
  remiseSeuil: 13, remiseParPoint: 0.25, continuite: 0.6, semaine: 3, alea: 0.2, ageApex2SansApex3: 19, reputationApex2SansApex3: 50,
};

/** Budget familial annuel des jeunes (M€) : loi log-normale (médiane, dispersion), plafond. */
export const BUDGET_FAMILLE = { mediane: 0.8, sigma: 1, max: 15 };

/** Réputation sportive (0–100) : valeur d'un classement final selon la catégorie ; inertie (part de l'ancienne valeur conservée). */
/** Le dernier d'un classement garde (1 − etendue) de la valeur du champion. */
export const REPUTATION = { champion: { apex2: 100, apex3: 80, apex4: 55, karting: 40 }, inertie: 0.5, aleaClassementAbstrait: 1, etendue: 0.9 };
/** Âges des classements abstraits : karting puis Apex 4 (D-071). */
export const CLASSEMENTS_ABSTRAITS = { kartingAgeMax: 15, apex4AgeMax: 17 };
/** Écuries juniors : évolution de la réputation (inertie) et de la qualité (pas annuel maximal vers la qualité visée). */
export const EVOLUTION_ECURIE_JUNIOR = { inertie: 0.7, pasQualite: 0.5 };
/** Qualité visée d'une écurie junior = base + parPointReputation × réputation ; bornes de la qualité ; réputation de départ = base + parPointQualite × (qualité − moyenne). */
export const QUALITE_ECURIE_JUNIOR = { base: 6, parPointReputation: 0.12, min: 4, max: 19, reputationBase: 30, reputationParPointQualite: 4 };
/** Passé simulé : probabilité de pluie d'une manche. */
export const PLUIE_PASSE_JUNIOR = 0.12;

/** Rivalité : deux prétendants au titre junior séparés par au plus ce nombre de points gardent un souvenir « rivalité ». */
export const RIVALITE_JUNIOR_POINTS = 25;
/** Mémoire : résumés de saisons juniors conservés par pilote ; saisons dont le détail course par course est conservé. */
export const RESUMES_JUNIORS_MAX = 10;
export const DETAIL_JUNIORS_SAISONS = 1;
/** Passé simulé au départ (D-112 §9) : années simulées avant 2027. */
export const PASSE_JUNIOR_ANNEES = 3;
/** Recrutement F1 : poids de la réputation junior dans le score d'un candidat (par point de réputation sur 100). */
export const REPUTATION_RECRUTEMENT_F1 = 0.0015;

/* =================================================================== Phase 6b-2 : académies, mécènes, repérage */

/**
 * Académies (une par écurie de F1, D-112) : places de base selon le budget de l'écurie, bonus pour une politique « filière jeunes ».
 * places = borne(min + parTranche × budget / trancheBudget + bonusFiliere, min, max).
 */
export const ACADEMIE = { min: 2, max: 8, parTranche: 1, trancheBudgetMEUR: 120, bonusFiliere: 2, semaine: 2, semaineMiSaison: 26, reputationBase: 30, reputationParPointPrestige: 3 };
/** Recrutement d'affiliés : âges, durée du contrat, financement annuel (part du prix moyen d'un baquet de sa catégorie visée). */
export const AFFILIATION = { ageMin: 14, ageMax: 21, dureeMin: 2, dureeMax: 3, partFinancement: 1, poidsReputation: 0.03, penaliteAge: 0.15, potentielMinimal: 14.5, gratitude: 0.6 };
/** Renouvellement : l'académie garde un affilié si son potentiel estimé reste au-dessus de ce seuil et qu'il a au plus cet âge. */
export const RENOUVELLEMENT_AFFILIATION = { potentielMin: 15.5, ageMax: 22 };
/** Promesse de titularisation : faite à un affilié de grand potentiel estimé, d'au moins cet âge, à tenir sous ce délai (années). */
export const PROMESSE_ACADEMIE = { potentielMin: 17.5, ageMin: 18, delaiAnnees: 2, probabilite: 0.5 };
/** Placement : préférence d'une écurie junior partenaire pour les affiliés de son écurie de F1 (points de score). */
export const PLACEMENT_PARTENAIRE = 1.5;
/** Recrutement F1 : préférence pour un affilié de sa propre académie / de l'académie de l'écurie partenaire ; promesse à tenir cette année. */
export const PROMOTION_AFFILIE = { propre: 0.12, partenaire: 0.06, promesseEchue: 0.25 };
/** Réputation de l'académie (0–100) : part d'anciens affiliés arrivés en F1, titres ; inertie. */
export const REPUTATION_ACADEMIE = { parPromu: 100, parTitre: 10, inertie: 0.7 };
/** Volume borné : anciens affiliés mémorisés par académie ; contrats d'affiliation terminés conservés pendant ce nombre d'années. */
export const MEMOIRE_ACADEMIE = { anciensMax: 60, conservationContratsAnnees: 2 };

/** Mécènes : un jeune talentueux sans moyens peut trouver un mécène (probabilité annuelle, conditions, montant, durée). */
export const MECENE = { probabilite: 0.15, reputationMin: 55, potentielMin: 16, budgetFamilleMax: 0.5, montantMin: 0.5, montantMax: 2, dureeAnnees: 3 };

/**
 * Missions de repérage (commande commune au joueur et à l'IA) : durée (semaines), coût (M€), effet sur l'estimation
 * (demi-largeur × facteur, observation ajoutée), missions simultanées = min + niveau du département recrutement / parPoints.
 */
/** IA : vivier examiné (nombre), poids de la réputation dans son classement, probabilité de retenir une cible (priorités propres à chaque écurie). */
export const REPERAGE = { dureeSemaines: 26, coutMEUR: 0.05, facteurLargeur: 0.5, observationAjoutee: 2, missionsMin: 2, niveauParMission: 4, ciblesIA: 3, vivierIA: 12, poidsReputationIA: 0.02, probabiliteIA: 0.6 };

