/**
 * Phase 8d-3 — groupes sociaux émergents (docs/systemes/memoire.md §4 ; fiche phase 8 §9). Valeurs PROVISOIRES (D-120).
 * Aucun groupe n'est créé à la main : ils naissent des relations (mémoire v1) et disparaissent avec elles.
 */

/**
 * Détection (une fois par saison, semaine `semaineDetection`) :
 * - deux personnes sont liées si elles se connaissent (familiarité ≥ familiariteMin dans les deux sens, ce qui suppose d'avoir travaillé
 *   ensemble) et s'apprécient (affinité moyenne ≥ affiniteMin) ou s'estiment (respect moyen ≥ respectMin) ;
 * - le leader est la personne qui reçoit le plus de respect de ses liens ; son groupe réunit ses liens encore sans groupe ;
 * - taille : au moins `membresMin` membres en plus du leader, au plus `membresMax` (les plus proches de lui).
 */
export const DETECTION_GROUPES = { semaineDetection: 30, familiariteMin: 0.3, affiniteMin: 0.3, respectMin: 0.35, membresMin: 2, membresMax: 10 };

/**
 * Lien social (utilisé par la détection des groupes et l'envie de suivre un leader seulement ; D-137) : la mémoire v1 ne produit
 * d'affinité et de respect qu'à partir d'événements marquants, presque jamais entre simples collègues. Le lien ajoute donc, en
 * proportion de la familiarité (avoir travaillé ensemble) :
 * - une affinité naturelle = poidsAffinite × (compatibilité des valeurs − compatibiliteNeutre) × (sociabiliteBase + sociabilité moyenne / 20),
 *   la compatibilité valant 1 − écart moyen des valeurs / 20 ;
 * - un respect professionnel envers l'autre = (niveau métier de l'autre − niveauNeutre) / echelleNiveau, borné entre −1 et 1.
 */
export const LIEN_SOCIAL = { poidsAffinite: 2, compatibiliteNeutre: 0.75, sociabiliteBase: 0.5, niveauNeutre: 12, echelleNiveau: 8 };

/**
 * Type d'un groupe (déduit, jamais imposé) :
 * - clan : le leader est un pilote titulaire ;
 * - opposants : au moins `partOpposants` des membres se méfient de leur team principal (confiance < seuilMefiance), qui n'en fait pas partie ;
 * - mentor : le leader a au moins `ecartAgeMentor` ans de plus que la moyenne des membres, qui l'estiment plus qu'ils ne l'apprécient ;
 * - anciens collaborateurs : la plupart des membres ne travaillent plus dans l'écurie du leader ;
 * - collègues : les autres cas.
 */
export const TYPES_GROUPES = { partOpposants: 0.5, seuilMefiance: -0.2, ecartAgeMentor: 10 };

/**
 * Suivre le leader (semaine `semaine`, pendant la fenêtre du marché) : quand le leader a changé d'écurie depuis la dernière détection,
 * chaque membre du personnel resté dans l'ancienne écurie pèse l'envie de le suivre :
 *   poidsAffinite × affinité envers le leader + poidsRespect × respect envers lui − poidsLoyaute × loyauté / 20
 *   − poidsConfianceTP × confiance envers son team principal actuel ;
 * au-delà de `seuil`, il propose ses services à la nouvelle écurie du leader (candidature spontanée, mêmes règles que la phase 7b).
 */
export const SUIVRE_LEADER = { semaine: 29, poidsAffinite: 0.6, poidsRespect: 0.4, poidsLoyaute: 0.3, poidsConfianceTP: 0.3, seuil: 0.2 };

/**
 * Opposants à la direction (chaque mois) : les membres perdent `motivationMembres` points de motivation, et leurs collègues de la même
 * écurie `motivationEquipe` (le climat se dégrade) ; la motivation pèse sur le développement et l'envie de partir.
 */
export const OPPOSANTS = { motivationMembres: 2, motivationEquipe: 0.5 };
