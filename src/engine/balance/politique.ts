/**
 * Phase 8d-4 — politique : fédération et président élu, lobbying, autres votes, alliances (fiche phase 8 §9 ; D-132 questions 11 et 12).
 * Valeurs PROVISOIRES (D-120). Le lobbying pèse sur les propositions de la fédération, jamais sur le décompte des voix.
 */

/**
 * Président de la fédération, élu tous les `dureeMandat` ans (D-132, question 12) ; élection en semaine `semaineElection` de la
 * dernière année du mandat, prise de fonction la saison suivante.
 * Candidats : `candidats` personnalités hors poste (libres, ou retirées depuis au plus `retraiteMax` ans) qui ont dirigé une écurie,
 * sa technique ou son sport, de `ageMin` à `ageMax` ans, classées par notoriété (niveau métier + leadership + politique) et un aléa.
 * Profil du président :
 * - orientation préférée : celle de sa compétence la plus forte si elle atteint `competenceOrientation` (aéro : aérodynamique,
 *   châssis : conception, motorisation : vision technique, refonte : innovation), sinon tirée au sort ;
 * - rigueur budgétaire (−1 à 1) = (équité − argent) / 20 : un président rigoureux propose de baisser le plafond ;
 * - sensibilité au lobbying (0 à 1) = 1 − professionnalisme / 20.
 */
export const FEDERATION = { dureeMandat: 4, semaineElection: 40, candidats: 3, retraiteMax: 3, ageMin: 45, ageMax: 78, competenceOrientation: 12, aleaNotoriete: 1.5 };

/**
 * Propositions de réforme (lien 8a) : poids de tirage de chaque orientation = 1 + bonusPresident (orientation préférée du président)
 * + somme des pressions de lobbying. Pression d'un lobbying = montant (M€) × efficaciteParMEUR × (politique du team principal / 20)
 * × sensibilité du président.
 */
export const INFLUENCE = { bonusPresident: 1, efficaciteParMEUR: 0.15 };

/**
 * Lobbying (commande `politique.lobbying`, joueur et IA) : montant de 0,5 à `montantMax` M€, hors plafond (compte « marketing »),
 * possible l'année des propositions avant leur préparation (semaines 1 et 2) ; une fois par écurie et par réforme.
 * IA : une écurie qui a une avance de savoir dans une orientation (≥ avanceMin, en points, sur la moyenne de ses domaines) et
 * de la trésorerie (> tresorerieMin) consacre partTresorerie de sa trésorerie (au plus montantMax) à la défendre.
 */
export const LOBBYING = { montantMin: 0.5, montantMax: 5, avanceMin: 3, tresorerieMin: 30, partTresorerie: 0.03 };

/**
 * Autres votes (D-132, question 11), en semaine `semaine` une saison sur deux (années paires), pour la saison suivante :
 * - plafond budgétaire : ± pasPlafond (fraction) selon la rigueur du président, borné à [plafondMin ; plafondMax] × la valeur de départ
 *   (porteur, 23/11/2026 : jamais au-dessus de la valeur de départ, variable d'ajustement de l'équilibrage) ;
 *   une écurie plus riche que la moyenne (budget au-delà du plafond, rapporté au plafond) vote pour une hausse, une plus pauvre pour une baisse ;
 * - restrictions aérodynamiques : écart entre la première et la dernière écurie élargi ou resserré de pasAero (de chaque côté),
 *   borné à [ecartAeroMin ; ecartAeroMax] ; une écurie de la seconde moitié du classement vote pour l'élargissement.
 * Sujet : le plafond avec la probabilité probaPlafond, sinon les restrictions ; sens tiré à pile ou face (probaSens) quand le
 * président n'a pas de préférence (restrictions, ou rigueur nulle).
 * Majorité simple des écuries qui votent ; égalité : le choix du président l'emporte. Le nombre de Grands Prix n'est pas encore soumis
 * au vote (le calendrier en dépend partout).
 */
export const AUTRES_VOTES = { probaPlafond: 0.5, probaSens: 0.5, semaine: 36, pasPlafond: 0.05, plafondMin: 0.8, plafondMax: 1, pasAero: 0.02, ecartAeroMin: 0.2, ecartAeroMax: 0.6, aleaVote: 0.1 };

/**
 * Alliances (détectées chaque saison, semaine `semaine`) : écuries au même motoriste, écuries partenaires, ou dont les team principals
 * s'entendent (affinité moyenne ≥ affiniteMin et confiance moyenne ≥ confianceMin, liens réciproques). Dans les votes, l'intérêt d'une
 * écurie de l'IA intègre poidsAllies × l'intérêt moyen de ses alliés (jamais un vote imposé).
 */
export const ALLIANCES = { semaine: 3, affiniteMin: 0.3, confianceMin: 0.2, poidsAllies: 0.5 };
