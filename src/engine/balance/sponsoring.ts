/**
 * Phase 11c — refonte du sponsoring (docs/systemes/phase-11c-sponsoring.md, D-155). Valeurs PROVISOIRES (D-120).
 *
 * Les sponsors chiffrent leurs offres d'après ce qu'ils savent PUBLIQUEMENT d'une écurie : son rang attendu (classements
 * constructeurs des deux dernières saisons). Les tables ci-dessous sont leur « connaissance du marché » : des fréquences
 * MESURÉES sur la simulation (14 graines × 8 saisons, 24 Grands Prix, outil de calibrage du 24/11/2026), lissées et rendues
 * monotones. Elles ne lisent rien de caché : elles disent seulement ce qui arrive, en moyenne, à une écurie de ce rang attendu.
 * Conséquence voulue : un pari ne rapporte en moyenne que si l'écurie fait mieux que ce que le marché attend d'elle.
 */

/** Rang attendu public : poids de la dernière saison terminée et de l'avant-dernière (moyenne pondérée). */
export const RANG_ATTENDU = { poidsDerniere: 2, poidsAvantDerniere: 1 };

/** Rang attendu sur un circuit (objectifs de course) : part du rang attendu public, le reste vient du rang de la voiture sur ce circuit. */
export const PART_RANG_PUBLIC_GP = 0.5;

/**
 * Grand Prix : probabilité que le MEILLEUR pilote de l'écurie finisse dans les k premiers, selon son rang attendu (lignes : 1 à 11)
 * et k (colonnes : SEUILS_GP). Abandons compris (ils comptent comme « hors des k premiers »).
 */
export const SEUILS_GP = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15] as const;
export const PROBA_GP: readonly (readonly number[])[] = [
  [0.632, 0.83, 0.907, 0.952, 0.973, 0.98, 0.988, 0.993, 0.995, 0.997],
  [0.321, 0.531, 0.689, 0.809, 0.878, 0.924, 0.966, 0.983, 0.989, 0.994],
  [0.152, 0.323, 0.496, 0.649, 0.762, 0.854, 0.937, 0.967, 0.983, 0.992],
  [0.072, 0.175, 0.309, 0.447, 0.578, 0.699, 0.852, 0.929, 0.967, 0.986],
  [0.029, 0.079, 0.145, 0.232, 0.325, 0.427, 0.657, 0.838, 0.922, 0.971],
  [0.012, 0.037, 0.079, 0.13, 0.195, 0.27, 0.471, 0.682, 0.834, 0.942],
  [0.006, 0.019, 0.041, 0.07, 0.11, 0.162, 0.314, 0.524, 0.72, 0.903],
  [0.002, 0.011, 0.023, 0.039, 0.062, 0.098, 0.21, 0.388, 0.584, 0.831],
  [0.0, 0.004, 0.011, 0.019, 0.035, 0.059, 0.131, 0.263, 0.435, 0.718],
  [0.0, 0.002, 0.006, 0.01, 0.019, 0.034, 0.076, 0.158, 0.283, 0.565],
  [0.0, 0.002, 0.002, 0.003, 0.005, 0.01, 0.026, 0.061, 0.137, 0.344],
];

/** Saison : probabilité de finir dans les k premiers du classement constructeurs (k = 1 à 10), selon le rang attendu (1 à 11). */
export const PROBA_RANG_SAISON: readonly (readonly number[])[] = [
  [0.77, 0.93, 0.99, 0.99, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
  [0.266, 0.668, 0.866, 0.955, 0.983, 0.998, 1.0, 1.0, 1.0, 1.0],
  [0.092, 0.324, 0.644, 0.891, 0.955, 0.986, 0.994, 0.994, 1.0, 1.0],
  [0.023, 0.098, 0.365, 0.704, 0.863, 0.93, 0.952, 0.965, 0.995, 1.0],
  [0.008, 0.027, 0.112, 0.289, 0.616, 0.76, 0.853, 0.924, 0.962, 0.993],
  [0.001, 0.015, 0.044, 0.117, 0.294, 0.52, 0.706, 0.826, 0.903, 0.963],
  [0.0, 0.003, 0.023, 0.085, 0.204, 0.412, 0.607, 0.761, 0.882, 0.955],
  [0.0, 0.0, 0.004, 0.023, 0.092, 0.218, 0.416, 0.614, 0.786, 0.947],
  [0.0, 0.0, 0.0, 0.001, 0.03, 0.137, 0.278, 0.473, 0.657, 0.864],
  [0.0, 0.0, 0.0, 0.0, 0.011, 0.041, 0.128, 0.275, 0.448, 0.704],
  [0.0, 0.0, 0.0, 0.0, 0.011, 0.023, 0.034, 0.08, 0.287, 0.46],
];
/** Saison : probabilité d'au moins un podium, d'au moins une victoire (meilleur pilote), selon le rang attendu (1 à 11). */
export const PROBA_PODIUM_SAISON = [1.0, 0.997, 0.977, 0.891, 0.65, 0.453, 0.38, 0.332, 0.253, 0.132, 0.08];
export const PROBA_VICTOIRE_SAISON = [0.99, 0.905, 0.789, 0.593, 0.269, 0.182, 0.142, 0.061, 0.035, 0.029, 0.011];
/** Saison : part des Grands Prix finis dans les points par le meilleur pilote (moyenne, écart type), selon le rang attendu (1 à 11). */
export const ARRIVEES_POINTS = {
  moyenne: [0.987, 0.968, 0.948, 0.892, 0.762, 0.572, 0.499, 0.401, 0.314, 0.199, 0.104],
  ecartType: [0.025, 0.054, 0.088, 0.146, 0.192, 0.267, 0.25, 0.238, 0.221, 0.171, 0.137],
};

/** Une clause n'est proposée que si sa probabilité (vue du sponsor) est dans cette fourchette : ni cadeau certain, ni loterie. */
export const PROBA_CLAUSE = { min: 0.04, max: 0.95 };

/**
 * Variantes d'un contrat titre ou principal. Valeur de référence E = valeur attendue du contrat prudent (celui d'avant la refonte :
 * fixe + prime d'objectif × probabilité).
 * - partVariable : part de E remplacée par des primes ;
 * - decote : marge de risque du sponsor sur la partie variable (l'audacieuse vaut un peu moins en moyenne, D-155 question 2) ;
 * - probaVisee : probabilité visée de chaque clause ; nbClauses : nombre de clauses.
 * La prudente est le contrat d'avant la refonte (fixe, et une prime de classement de 20 % du fixe).
 */
export const VARIANTES = {
  prudente: { partVariable: 0, decote: 0, probaVisee: 0.75, nbClauses: 1 },
  equilibree: { partVariable: 0.35, decote: 0.05, probaVisee: 0.45, nbClauses: 2 },
  audacieuse: { partVariable: 0.5, decote: 0.1, probaVisee: 0.12, nbClauses: 1 },
} as const;

/** Types de clauses annuelles préférés selon l'image recherchée par le sponsor (ordre = préférence). */
export const CLAUSES_PAR_IMAGE: Record<string, readonly ('rang' | 'progression' | 'podium' | 'victoire' | 'arrivees_points')[]> = {
  resultats: ['rang', 'progression', 'podium', 'victoire'],
  prestige: ['rang', 'victoire', 'podium'],
  popularite: ['podium', 'arrivees_points', 'victoire'],
  nationalite: ['arrivees_points', 'rang', 'podium'],
};
/** Progression : nombre de places gagnées demandées au plus. */
export const PROGRESSION_MAX_PLACES = 3;

/**
 * Engagement ferme : ce qu'un sponsor peut avoir à payer au plus sur une saison (fixe, toutes les primes annuelles, enveloppe
 * de course) ne dépasse pas cette part de son budget F1 (budget × conjoncture). S'il ne peut pas payer une grosse prime, il
 * propose une clause moins difficile (scénario 6 du porteur).
 */
export const ENGAGEMENT_MAX_PART_BUDGET = 1;
/**
 * Prudence du sponsor : une prime ne dépasse pas ce multiple de la valeur attendue du contrat (E). Sans elle, une écurie de fond
 * de grille se voyait proposer 67 M€ pour un contrat de 12 M€ (premier essai). Avec 3, le gain d'un pari réussi reste d'environ
 * 3,5 fois la valeur du contrat prudent (D-155 question 2 : un pari réussi doit valoir le coup).
 */
export const PRIME_MAX_MULTIPLE_VALEUR = 3;

/** Sponsor titre : part de la valeur du contrat versée en primes de course (enveloppe répartie sur les Grands Prix, D-155 question 3). */
export const ENVELOPPE_GP_TITRE = 0.2;

/**
 * Objectifs de course du sponsor titre :
 * - probaVisee : prudent, intermédiaire, audacieux ;
 * - decote : marge du sponsor sur chaque niveau (l'audacieux vaut un peu moins en moyenne) ;
 * - aucun : sans objectif, le sponsor verse cette part de la mise, sans condition ;
 * - primeMaxPartBudget : une prime de course ne dépasse pas cette part du budget F1 du sponsor.
 */
export const OBJECTIFS_GP = {
  probaVisee: { prudent: 0.75, intermediaire: 0.45, audacieux: 0.15 },
  decote: { prudent: 0, intermediaire: 0, audacieux: 0.1 },
  aucun: 0.85,
  primeMaxPartBudget: 0.08,
};

/**
 * Estimation du directeur sportif (D-155 question 5) : demi-largeur de la fourchette affichée = min + (max − min) × (1 − stratégie/20) ;
 * son centre s'écarte de la probabilité du sponsor d'un aléa d'écart type `biais` × demi-largeur. Arrondi à 5 %.
 */
export const ESTIMATION_GP = { demiLargeurMin: 0.04, demiLargeurMax: 0.2, biais: 0.5, pas: 0.05 };

/**
 * Choix de l'équipe (IA, ou joueur qui délègue le domaine commercial, ou repli à l'échéance) :
 * - objectif de course : utilité = prime × p − aversion × prime × √(p(1−p)), avec p = estimation du directeur sportif et
 *   aversion = (10 − goût du risque du team principal) / `diviseurAversion` ;
 * - variante de contrat : écart = rang attendu public − rang de sa propre voiture (ce que l'écurie sait d'elle-même) ;
 *   score = écart + (goût du risque − 10) / `diviseurRisque` ; au-delà de `seuilAudacieuse` : audacieuse, de `seuilEquilibree` : équilibrée.
 */
export const CHOIX_EQUIPE = { diviseurAversion: 15, diviseurRisque: 5, seuilAudacieuse: 1.5, seuilEquilibree: 0.5 };

/** Offres faites au joueur (domaine commercial non délégué) : délai de réponse (semaines), offres en plus des places libres. */
export const OFFRES_JOUEUR = { delaiSemaines: 3, offresEnPlus: 2 };

/**
 * Satisfaction et clauses (prolonge SATISFACTION_SPONSOR) : une clause ratée déçoit en proportion de la probabilité que le sponsor
 * lui accordait (rapportée à `probaReference`) ; une clause audacieuse ratée déçoit donc moins qu'une clause prudente ratée.
 */
export const SATISFACTION_CLAUSES = { probaReference: 0.75 };

/**
 * Opérations publicitaires exceptionnelles (sponsors principaux), règle du porteur (D-157) :
 * - déclencheur : PREMIER top 5, premier podium ou première victoire de l'écurie depuis `anneesSansExploit` saisons
 *   (meilleur pilote ; les grandes écuries, qui en font chaque année, en sont exclues d'elles-mêmes) ;
 * - tant que ces saisons ne sont pas toutes simulées (début de partie : pas de résultats d'avant 2027 dans les données), règle de
 *   repli : podium d'une écurie attendue au-delà de `rangMinPodium`, victoire au-delà de `rangMinVictoire`, jamais dans les
 *   `rangMaxJamais` premières ;
 * - non cumulable : au plus une proposition par écurie et par saison, la première (acceptée, refusée ou délaissée) ;
 * - montant = budget F1 du sponsor × (partMin + (partMax − partMin) × petitesse) × multiplicateur de l'exploit × multiplicateur du format,
 *   petitesse = (rang attendu − 1) / (nombre d'écuries − 1) ; plafonné par ce qu'il reste au sponsor après son contrat (ses moyens).
 *   Relevé pour le fond de grille (D-157 : « des choses qui changent la donne ») ;
 * - formats : multiplicateur du montant, sollicitation du pilote (1 légère à 3 lourde), exposition et image gagnées ;
 * - satisfaction gagnée par le sponsor qui finance ; perte du sponsor titre si la visibilité empiète sur son emplacement ;
 * - ciblage du pilote demandé (poids) : l'auteur de l'exploit, le plus populaire, le n° 1 au championnat, au choix de l'écurie.
 */
export const OPERATIONS = {
  anneesSansExploit: 3,
  rangMinPodium: 7, rangMinVictoire: 4, rangMaxJamais: 3,
  partMin: 0.05, partMax: 0.35,
  exploits: { top5: 0.6, podium: 1, victoire: 1.5 },
  formats: {
    tenues: { multiplicateur: 0.5, sollicitation: 1, exposition: 2, image: 1 },
    visibilite: { multiplicateur: 0.75, sollicitation: 1, exposition: 3, image: 1 },
    interview: { multiplicateur: 1, sollicitation: 2, exposition: 6, image: 2 },
    campagne: { multiplicateur: 1.5, sollicitation: 3, exposition: 10, image: 3 },
  },
  satisfactionSponsor: 8, perteSponsorTitre: 6,
  ciblage: { exploit: 0.4, populaire: 0.25, numero1: 0.15, libre: 0.2 },
  /** Souvenir laissé au pilote : facteur d'intensité par point de sollicitation ; surcroît par opération lourde récente de l'écurie. */
  souvenirParSollicitation: 0.5, surcroitParOperationLourde: 0.3,
  /** Choix de l'équipe : un pilote très discret ou très professionnel (≥ ce seuil) n'est pas envoyé en campagne. */
  seuilReserve: 14,
};
