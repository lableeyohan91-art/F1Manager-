/**
 * Phase 8a et 8b — règlements et recherche (docs/systemes/phase-8-conception-detaillee.md, D-128, D-132).
 * Toutes les valeurs sont PROVISOIRES (D-120) : la conversion du savoir en performance est volontairement modérée et isolée,
 * elle sera remplacée par la conception de la phase 12.
 */

/** Caractéristiques actuelles des voitures (modèle abstrait de la phase 3). */
export type CaracVoiture = 'viragesLents' | 'viragesRapides' | 'vitessePointe' | 'efficaciteAero' | 'fiabilite' | 'gestionPneus';

/**
 * Les 12 domaines techniques (D-132, question 2) : identifiants stables, repris par la phase 12.
 * - voisins : interactions (une part de ce qu'on apprend profite aux voisins) ;
 * - caracs : lien PROVISOIRE avec les caractéristiques actuelles (poids relatifs), supprimé en phase 12 ;
 * - competences : compétences du personnel qui font progresser la recherche dans ce domaine ;
 * - installations : installations utiles.
 */
export const DOMAINES = {
  aero_avant: { libelle: 'Aérodynamique avant', voisins: ['aero_arriere', 'fond_plat', 'refroidissement'], caracs: { viragesRapides: 0.6, efficaciteAero: 0.4 }, competences: ['aerodynamique'], installations: ['soufflerie', 'cfd'] },
  aero_arriere: { libelle: 'Aérodynamique arrière', voisins: ['aero_avant', 'fond_plat'], caracs: { efficaciteAero: 0.6, vitessePointe: 0.4 }, competences: ['aerodynamique'], installations: ['soufflerie', 'cfd'] },
  fond_plat: { libelle: 'Fond plat et diffuseur', voisins: ['aero_avant', 'aero_arriere', 'suspensions'], caracs: { viragesRapides: 0.5, viragesLents: 0.5 }, competences: ['aerodynamique'], installations: ['soufflerie', 'cfd'] },
  chassis: { libelle: 'Châssis et structure', voisins: ['suspensions', 'masse'], caracs: { viragesLents: 0.6, fiabilite: 0.4 }, competences: ['conception'], installations: ['bureau_etudes', 'simulateur'] },
  suspensions: { libelle: 'Suspensions', voisins: ['chassis', 'interface_pneus', 'fond_plat'], caracs: { viragesLents: 0.5, gestionPneus: 0.5 }, competences: ['conception'], installations: ['simulateur', 'bureau_etudes'] },
  masse: { libelle: 'Masse et répartition', voisins: ['chassis', 'groupe_propulseur'], caracs: { viragesLents: 0.5, viragesRapides: 0.5 }, competences: ['conception'], installations: ['bureau_etudes'] },
  refroidissement: { libelle: 'Refroidissement', voisins: ['aero_avant', 'gestion_thermique'], caracs: { fiabilite: 0.6, efficaciteAero: 0.4 }, competences: ['conception', 'aerodynamique'], installations: ['cfd', 'bureau_etudes'] },
  gestion_thermique: { libelle: 'Gestion thermique', voisins: ['refroidissement', 'energie', 'interface_pneus'], caracs: { fiabilite: 0.5, gestionPneus: 0.5 }, competences: ['conception'], installations: ['simulateur', 'bureau_etudes'] },
  groupe_propulseur: { libelle: 'Architecture du groupe propulseur', voisins: ['energie', 'masse'], caracs: { vitessePointe: 0.7, fiabilite: 0.3 }, competences: ['visionTechnique', 'conception'], installations: ['bureau_etudes', 'centre_recherche'] },
  energie: { libelle: 'Récupération et déploiement d’énergie', voisins: ['groupe_propulseur', 'gestion_thermique'], caracs: { vitessePointe: 1 }, competences: ['visionTechnique', 'innovation'], installations: ['simulateur', 'centre_recherche'] },
  interface_pneus: { libelle: 'Interface pneus', voisins: ['suspensions', 'gestion_thermique'], caracs: { gestionPneus: 1 }, competences: ['conception', 'correlation'], installations: ['simulateur'] },
  fiabilite: { libelle: 'Fiabilité et matériaux', voisins: ['chassis', 'gestion_thermique', 'groupe_propulseur'], caracs: { fiabilite: 1 }, competences: ['rigueur', 'conception'], installations: ['bureau_etudes', 'usine'] },
} as const satisfies Record<string, { libelle: string; voisins: readonly string[]; caracs: Partial<Record<CaracVoiture, number>>; competences: readonly string[]; installations: readonly string[] }>;
export type Domaine = keyof typeof DOMAINES;
export const LISTE_DOMAINES = Object.keys(DOMAINES) as Domaine[];

/**
 * Orientations des grandes réformes (D-128) : intensité du changement par domaine (de 0, inchangé, à 1, entièrement nouveau),
 * tirée dans [min ; max] pour les domaines visés, et dans `autres` pour les autres. Jamais un résultat imposé.
 */
export const ORIENTATIONS = {
  aero: { libelle: 'Aérodynamique', domaines: ['aero_avant', 'aero_arriere', 'fond_plat', 'refroidissement'], min: 0.5, max: 0.9, autres: [0, 0.15] },
  motorisation: { libelle: 'Motorisation et énergie', domaines: ['groupe_propulseur', 'energie', 'gestion_thermique', 'refroidissement'], min: 0.5, max: 0.9, autres: [0, 0.15] },
  chassis: { libelle: 'Châssis et mécanique', domaines: ['chassis', 'suspensions', 'masse', 'interface_pneus'], min: 0.5, max: 0.9, autres: [0, 0.15] },
  refonte: { libelle: 'Refonte technique majeure', domaines: ['aero_avant', 'aero_arriere', 'fond_plat', 'chassis', 'suspensions', 'masse', 'groupe_propulseur', 'energie', 'refroidissement', 'gestion_thermique', 'interface_pneus', 'fiabilite'], min: 0.4, max: 0.8, autres: [0, 0] },
} as const satisfies Record<string, { libelle: string; domaines: readonly Domaine[]; min: number; max: number; autres: readonly [number, number] }>;
export type Orientation = keyof typeof ORIENTATIONS;

/**
 * Calendrier des grandes réformes :
 * - dureeMin / dureeMax : durée prévue d'un règlement (saisons), tirée à sa création ;
 * - propositions `anneesAvantFin` saisons avant la fin prévue (semaine `semaineProposition`), vote en semaine `semaineVote` ;
 *   entrée en vigueur après environ deux saisons complètes de préparation (D-128) ;
 * - 2 ou 3 réformes proposées, plus la prolongation (de 1 à `prolongationMax` saisons).
 */
export const CALENDRIER_REGLEMENT = { dureeMin: 4, dureeMax: 6, anneesAvantFin: 2, semaineProposition: 12, semaineVote: 30, propositionsMin: 2, propositionsMax: 3, prolongationMax: 2, pneusAvecReforme: 0.5 };

/** Évolutions mineures (D-132, question 4) : décidées par la fédération seule, annoncées en semaine `semaine` pour la saison suivante. */
export const EVOLUTIONS_MINEURES = { probabilite: 0.6, semaine: 44, domainesMin: 1, domainesMax: 2, intensiteMin: 0.08, intensiteMax: 0.2, conservees: 10 };

/**
 * Savoir (points sans unité, de l'ordre de 0 à 100 par domaine) :
 * - gainBase : gain par période de 4 semaines pour un programme à part 1 et une capacité de recherche de 1 ;
 * - rendementK : rendement décroissant, gain × 1 / (1 + savoir / rendementK) ;
 * - partVoisins : part du gain qui profite aux domaines voisins ;
 * - partFondamental : part du gain qui alimente le savoir fondamental (le reste est propre au règlement visé) ;
 * - partFondamentalRejet : part du savoir propre à une proposition rejetée qui reste, comme savoir fondamental (D-132, question 5) ;
 * - vieillissementAnnuel : érosion très lente, hors réforme (D-132, question 6) ;
 * - remiseEnRouteSemaines : semaines à efficacité réduite (efficaciteRemiseEnRoute) après une réorientation (D-132, question 7 : coût en temps seulement).
 */
/**
 * Phase 12d (D-178) — une vraie nouvelle ère à chaque grande réforme (porteur, 26/11/2026). Pour un domaine touché à l'intensité I :
 * - `usureFondamentale` : le savoir FONDAMENTAL est multiplié par (1 − usureFondamentale × I) (méthodes et outils d'une ère qui vieillissent) ;
 * - `transfertExposant` : le savoir propre à l'ancien règlement passe au nouveau dans la proportion (1 − I)^transfertExposant (avant : 1).
 * Mesuré : pièces touchées à 55 % du plafond juste après une réforme (73 % avant ; 54 % au début du jeu) ; dynasties 60 % → 30 % des séries.
 */
export const REFORME = { usureFondamentale: 0.5, transfertExposant: 2 };

export const SAVOIR = { gainBase: 2.2, rendementK: 40, partVoisins: 0.15, partFondamental: 0.3, partFondamentalRejet: 0.3, vieillissementAnnuel: 0.01, remiseEnRouteSemaines: 6, efficaciteRemiseEnRoute: 0.5 };

/** Programmes de recherche : deux emplacements (D-128) ; part des moyens de développement par programme, part totale maximale ; avancement toutes les `periodeSemaines` semaines. */
export const PROGRAMMES = { emplacements: 2, partMin: 0.05, partMax: 0.35, partTotaleMax: 0.5, periodeSemaines: 4 };

/**
 * Effet PROVISOIRE du savoir sur le développement abstrait des deux notes que le profil de vitesse ne couvre pas encore (fiabilité,
 * gestion des pneus) : × (1 + bonusDeveloppement × savoir lié / echelle). Phase 12a : la reconception et la préparation provisoires
 * (relatives à la moyenne de la grille) sont remplacées par la conception des pièces (balance/monoplaces.ts).
 */
export const CONCEPTION_PROVISOIRE = { echelle: 50, bonusDeveloppement: 0.25 };

/**
 * Découvertes (D-128 : rares, expliquées, sans quota) : à chaque période, probabilité = base × (savoir fondamental du domaine / echelle) ×
 * (vision technique du DT / 20) pour un programme orienté vers un règlement futur. Ampleur en points de savoir propre à ce règlement ;
 * les autres écuries copient `diffusionParSaison` de l'ampleur chaque saison après l'entrée en vigueur.
 */
export const DECOUVERTES = { base: 0.004, ampleur: 15, diffusionParSaison: 0.5, conservees: 20 };

/**
 * Décisions de l'IA (mêmes règles que le joueur) : horizon selon la force sportive (un prétendant garde la voiture actuelle, une écurie
 * distancée prépare l'avenir), le goût du risque du directeur technique et l'aléa de jugement ; part selon le budget et le risque.
 */
export const IA_RECHERCHE = { forcePretendant: 0.75, forceDistancee: 0.4, partDefaut: 0.15, partAudace: 0.15, alea: 0.15 };

/** Historique de recherche, règlements terminés ou rejetés : conservés pendant ce nombre de saisons. */
export const HISTORIQUE_RECHERCHE = { saisons: 10 };

/**
 * Facteurs propres à un domaine (rendement de la recherche) :
 * - competenceReference : note (sur 20) des compétences utiles du DT et des responsables qui donne un facteur 1 ;
 * - installationReference : niveau effectif (sur 10) des installations utiles qui donne un facteur 1 ;
 * - defaut : facteur retenu si l'écurie n'a ni personnel ni installation concernés.
 */
export const FACTEURS_RECHERCHE = { competenceReference: 14, installationReference: 6, defaut: 0.7 };

/** Changement des pneumatiques avec une réforme : intensité minimale imposée au domaine « interface pneus ». */
export const PNEUS_REFORME = { intensiteInterface: 0.5 };

/**
 * Vote d'une grande réforme (D-132, question 3 : une voix par écurie, égalités tranchées par la fédération), en deux tours :
 * 1) réforme ou prolongation, 2) choix entre les réformes proposées (sinon les partisans d'un changement se partageraient).
 * Intérêt d'une écurie de l'IA (même information que le joueur) :
 * - prolongation : poidsStatuQuo × (force sportive − 0,5) : une écurie de tête préfère garder le règlement, une écurie du fond
 *   veut rebattre les cartes ; moins usureParSaison par saison de règlement au-delà de la durée minimale (les gains de
 *   développement s'épuisent, l'envie de changement grandit) ;
 * - réforme : avance de savoir sur la moyenne de la grille, pondérée par l'intensité, divisée par `echelleAvance` ;
 * - aleaVote : écart type du jugement.
 */
export const VOTE_IA = { poidsStatuQuo: 0.4, usureParSaison: 0.1, echelleAvance: 50, aleaVote: 0.1 };

/** Découvertes : plafond du facteur de savoir fondamental, vision technique de référence (sur 20) et vision retenue sans DT. */
export const DECOUVERTES_FACTEURS = { plafondSavoir: 2, visionReference: 20, visionSansDT: 10 };

/**
 * Choix du domaine par l'IA :
 * - intensiteBase : intérêt minimal d'un domaine peu touché par le règlement visé (ajouté à son intensité) ;
 * - philosophieAero / philosophieMoteur : préférence des écuries de philosophie aérodynamique ou motoriste ;
 * - jugementMin / jugementAmplitude : facteur de jugement propre à l'écurie, dans [min ; min + amplitude] ;
 * - seuilRisque : goût du risque (0 à 1) au-delà duquel un prétendant consacre un programme à l'avenir.
 */
export const CHOIX_DOMAINE_IA = { intensiteBase: 0.3, philosophieAero: 1.3, philosophieMoteur: 1.2, jugementMin: 0.8, jugementAmplitude: 0.4, seuilRisque: 0.6 };
