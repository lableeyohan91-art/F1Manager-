/**
 * Phase 8d-2 — démissions et ruptures négociées (D-077 ; fiche phase 8 §9). Valeurs PROVISOIRES (D-120).
 *
 * Envie de partir (0 à 1), calculée et non stockée :
 *   poidsMotivation × (1 − motivation / 100) + poidsMefiance × méfiance envers le team principal (confiance négative)
 *   + poidsRancoeur × rancœur envers l'écurie (confiance négative) + poidsLassitude × lassitude / lassitudeMax.
 */
export const ENVIE_DE_PARTIR = { poidsMotivation: 0.35, poidsMefiance: 0.45, poidsRancoeur: 0.3, poidsLassitude: 0.3, lassitudeMax: 0.2 };

/**
 * Demandes de départ (personnel hors pilotes et team principal ; chaque mois) :
 * - seuilDemande : envie au-delà de laquelle une personne peut demander à partir (probabilité probaDemande par mois) ;
 * - partIndemniteDemandee : part de l'indemnité de rupture qu'elle demande pour partir à l'amiable ;
 * - delaiReponseSemaines : sans réponse du joueur, la demande est considérée comme refusée ;
 * - seuilDemission / probaDemission : après un refus, une envie très forte peut mener à la démission (sans indemnité) ;
 * - nonConcurrenceSemaines : une personne qui démissionne est en non-concurrence (D-127 : elle travaille ensuite à efficacité réduite).
 */
export const DEMANDES_DEPART = { seuilDemande: 0.4, probaDemande: 0.25, partIndemniteDemandee: 0.5, delaiReponseSemaines: 8, seuilDemission: 0.7, probaDemission: 0.3, nonConcurrenceSemaines: 26 };

/**
 * Réponse de l'employeur de l'IA à une demande de départ : il accepte si la personne est remplaçable (un candidat libre au moins aussi
 * bon, à `toleranceNiveau` près) ou s'il ne lui fait plus confiance (confiance < seuilMefiance), et si l'indemnité reste sous
 * `partBudgetMax` du budget de l'écurie.
 */
export const REPONSE_EMPLOYEUR = { toleranceNiveau: 1.5, seuilMefiance: -0.2, partBudgetMax: 0.02 };

/**
 * Rupture négociée proposée par l'employeur (commande `contrat.rupture_negociee`) : la personne accepte si l'indemnité proposée atteint
 * exigence × indemnité de rupture × (1 − envie de partir) ; une offre au moins égale à l'indemnité complète est reçue comme une
 * reconnaissance. Indemnité proposée : de 0 à `indemniteMax` fois l'indemnité de rupture.
 * IA employeur : propose une rupture à une personne insuffisante qui a déjà envie de partir (envie ≥ seuilIA), avec l'indemnité
 * qu'elle accepterait, au plus une fois par saison et par personne.
 */
export const RUPTURE_NEGOCIEE = { exigence: 1, indemniteMax: 2, seuilIA: 0.3, margeIA: 0.05 };

/** Souvenirs (facteurs d'intensité, D-070) : trahison ressentie par le team principal à une démission, conflit après un refus, reconnaissance d'une rupture généreuse. */
export const SOUVENIRS_DEPARTS = { trahisonDemission: 0.5, conflitRefusDepart: 0.6, conflitRuptureRefusee: 0.5, reconnaissanceRupture: 0.5 };
