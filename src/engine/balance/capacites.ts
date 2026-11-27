/**
 * Économie, levier A (version 2 ; D-181, fiche docs/systemes/economie-capacites-et-previsions.md §E) — capacités achetables.
 * Estimations de game design, à mesurer (campagne 20 graines × 30 saisons).
 */

/** Projets de conception menés en même temps par un pôle (aéro, conception) : même nombre pour toutes les écuries. */
export const PROJETS_PAR_POLE = 3;

/**
 * Vitesse d'un projet selon les ingénieurs du pôle qui y travaillent : × (ingénieurs affectés / `reference`)^`exposant`, bornée à
 * [`vitesseMin`, `vitesseMax`] (rendement décroissant). Les ingénieurs se répartissent entre les projets en conception du pôle, un projet
 * prioritaire recevant `poidsPrioritaire` parts.
 */
export const INGENIEURS = { reference: 45, exposant: 0.6, vitesseMin: 0.5, vitesseMax: 1.8, poidsPrioritaire: 2 };

/** Essais renforcés d'un projet : coût de conception × (1 + `surcout`) ; aléa d'exécution et erreur d'estimation × `facteurIncertitude`. */
export const ESSAIS_RENFORCES = { surcout: 0.5, facteurIncertitude: 0.5 };

/**
 * Recrutement et réduction des départements (commande commune `departement.effectif`). Seuls les départements dont l'effectif agit sur le
 * jeu sont réglables. Bornes d'effectif par département ; taille d'une campagne ; délai d'arrivée ; préavis de licenciement ;
 * frais de recrutement (M€ par personne, sous le plafond ; × `fraisConfirmes` pour des profils confirmés, qui arrivent `niveauConfirmes`
 * points au-dessus) ; indemnité de licenciement (années de salaire, sous le plafond) ; pas de licenciement moins de
 * `semainesSansLicenciement` semaines après un recrutement (sauf crise).
 * Niveau des recrues : niveau du département + `niveauAttrait` si l'écurie est attirante (force sportive ≥ `forceAttirante`), − si elle
 * ne l'est pas (force < `forcePeuAttirante`).
 */
export const RECRUTEMENT_DEPARTEMENT = {
  bornes: { aero: [40, 160], conception: [40, 160], production: [120, 330], fiabilite: [20, 70] } as Record<string, [number, number]>,
  campagneMin: 5, campagneMax: 40, delaiArriveeSemaines: 8, preavisSemaines: 4,
  fraisParPersonne: 0.03, fraisConfirmes: 3, niveauConfirmes: 2, niveauAttrait: 1, forceAttirante: 0.6, forcePeuAttirante: 0.3,
  indemniteAnnees: 0.5, semainesSansLicenciement: 52,
};

/**
 * Cohésion d'un département (note sur 20) : l'arrivée de recrues la fait baisser de `perteParPartNouveaux` × (part de nouveaux), un
 * licenciement de `perteParPartLicencies` × (part licenciée) ; elle remonte de `remonteeParMois` point par mois vers sa valeur habituelle.
 * Effet : productivité × (1 + `effetParPoint` × (cohésion − cohésion habituelle)), bornée à [`facteurMin`, `facteurMax`].
 */
export const COHESION_DEPARTEMENT = { perteParPartNouveaux: 8, perteParPartLicencies: 10, remonteeParMois: 0.5, effetParPoint: 0.02, facteurMin: 0.85, facteurMax: 1.1 };

/**
 * Production : vitesse de fabrication × (effectif / `reference`)^`exposant`, bornée. Fiabilité : probabilité d'abandon mécanique
 * × (`reference` / effectif)^`exposant`, bornée ; détection des erreurs d'exécution × (effectif / `reference`)^`exposantDetection`.
 * Références : effectifs de base des données (balance/monde.ts, DEPARTEMENTS).
 */
export const PRODUCTION = { reference: 250, exposant: 0.5, min: 0.7, max: 1.4 };
export const FIABILITE_DEPARTEMENT = { reference: 40, exposant: 0.5, min: 0.75, max: 1.3, exposantDetection: 0.3, detectionMax: 0.95 };

/**
 * IA : recrute (budget de janvier et mi-saison) jusqu'à `cibleParProjet` ingénieurs par projet possible dans chaque pôle, et vers l'effectif
 * de base en production et fiabilité, si la marge sous le plafond couvre `anneesMarge` années du salaire des recrues ; réduit de
 * `partReductionCrise` de l'effectif en crise. Semaines de décision.
 */
export const IA_EFFECTIFS = { cibleParProjet: 45, anneesMarge: 1, partReductionCrise: 0.15, semaines: [2, 27] };

/**
 * Installations : entretien progressif (sous le plafond) = `entretienParNiveauCarre` × niveau² × (1 + âge/30) M€ par an (niveau 5 :
 * 1,25 M€, comme l'ancien barème linéaire ; niveau 10 : 5 M€) ; rendement décroissant au-dessus de `seuilRendement` : chaque niveau en plus
 * ne compte que pour `rendementAuDela`.
 */
export const INSTALLATIONS_COUT = { entretienParNiveauCarre: 0.05, seuilRendement: 8, rendementAuDela: 0.5, ageMaxEntretien: 15 };
/**
 * Rapport de nuit du 27/11 (S6) : l'entretien croît avec l'âge jusqu'à `INSTALLATIONS_COUT.ageMaxEntretien` ans seulement (sinon les
 * installations jamais rénovées coûtaient de plus en plus cher sous le plafond, sans limite) ; l'IA n'agrandit plus une installation
 * quand son budget de développement est déjà sous `devMinAgrandissementMEUR` (l'entretien en plus serait pris sur les pièces).
 */
export const IA_INSTALLATIONS = { devMinAgrandissementMEUR: 60 };
/**
 * Réduction d'une installation (diagnostic du 27/11, porteur : « oui, mais attention, c'est notre levier principal d'équilibrage ») : une
 * écurie peut désaffecter le niveau le plus haut de n'importe laquelle de ses installations (−1 niveau, immédiat, sans frais ni remboursement), pour
 * économiser son entretien sous le plafond. Au plus une réduction par installation et par saison (commande commune `infrastructure.reduire`).
 * L'IA ne le fait que si elle est étranglée : budget de développement sous `devMinAgrandissementMEUR`, et seulement pour les niveaux au-delà
 * du seuil de rendement (`INSTALLATIONS_COUT.seuilRendement`, ceux qui rapportent le moins), au plus `reductionsParAn` par saison. Le coût de
 * l'entretien reste donc le frein des écuries riches ; il ne devient plus une spirale de déclin.
 * Départements : dans la même situation, l'IA ramène un département au-delà de son effectif visé vers cet effectif (une campagne à la fois).
 */
export const IA_REDUCTIONS = { reductionsParAn: 2 };
