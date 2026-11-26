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
    gain: { masseKg: -0.1, muMeca: 0.12 }, compromis: { muMeca: 1.2, cla: -1.77 },
  },
  aileron_avant: {
    libelle: 'Aileron avant', conceptionJours: 44, coutProjetMEUR: 1.8, fabricationJours: 3, coutUnitaireMEUR: 0.225, pole: 'aero',
    domaines: ['aero_avant'], conceptMoins: 'faible traînée', conceptPlus: 'fort appui',
    gain: { cla: 0.3, cda: -0.05 }, compromis: { cla: 1.5, cda: 4.15 },
  },
  aileron_arriere: {
    libelle: 'Aileron arrière', conceptionJours: 44, coutProjetMEUR: 1.8, fabricationJours: 3, coutUnitaireMEUR: 0.275, pole: 'aero',
    domaines: ['aero_arriere'], conceptMoins: 'faible traînée', conceptPlus: 'fort appui',
    gain: { cla: 0.25, cda: -0.12 }, compromis: { cla: 2.5, cda: 6.91 },
  },
  pontons: {
    libelle: 'Pontons', conceptionJours: 33, coutProjetMEUR: 1.0, fabricationJours: 8, coutUnitaireMEUR: 0.45, pole: 'aero',
    domaines: ['refroidissement', 'gestion_thermique'], conceptMoins: 'carrosserie serrée', conceptPlus: 'refroidissement généreux',
    gain: { cda: -0.18, refroidissement: 0.3 }, compromis: { cda: 1.2, refroidissement: 8 },
  },
  fond_plat: {
    libelle: 'Fond plat', conceptionJours: 33, coutProjetMEUR: 1.0, fabricationJours: 8, coutUnitaireMEUR: 0.4, pole: 'aero',
    domaines: ['fond_plat'], conceptMoins: 'plateforme tolérante', conceptPlus: 'effet de sol maximal',
    gain: { cla: 0.4, cda: -0.03 }, compromis: { cla: 1.2, cda: 0.3, muMeca: -0.74 },
  },
  suspensions: {
    libelle: 'Suspensions', conceptionJours: 33, coutProjetMEUR: 1.0, fabricationJours: 8, coutUnitaireMEUR: 0.3, pole: 'conception',
    domaines: ['suspensions', 'interface_pneus'], conceptMoins: 'plateforme raide', conceptPlus: 'souplesse et motricité',
    gain: { muMeca: 0.12, muMotricite: 0.2, muFreinage: 0.1 }, compromis: { muMotricite: 1.0, muFreinage: 0.4, cla: -0.34 },
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
 * efficacité = référence + `parPoint` × (note − `noteReference`) (notes `notes` de la pièce, moyennées) ;
 * concept = `conceptParPoint` × (moyenne des notes `conceptPlus` − moyenne des notes `conceptMoins`), borné à ± `conceptMax`.
 * La fiabilité n'entre dans aucune efficacité (décision du porteur, 25/11/2026 : une voiture fragile n'est pas plus lente) ;
 * elle fixe la fiabilité de la voiture et oriente le concept des pontons.
 * Le profil de la voiture se lit ainsi sur ses six pièces (demande du porteur, 25/11/2026 : « personne ne gagne partout ») :
 *   ailerons : fort appui si virages rapides > vitesse de pointe, faible traînée sinon ;
 *   châssis : agilité mécanique si virages lents > virages rapides, plateforme aérodynamique sinon ;
 *   fond plat : effet de sol maximal si virages rapides > virages lents ;
 *   suspensions : souplesse et motricité si motricité et pneus > virages rapides (note `motricite`, D-175 ; à défaut, virages lents) ;
 *   pontons : refroidissement généreux si fiabilité > vitesse de pointe, carrosserie serrée sinon.
 */
export const CONVERSION_DEPART = {
  noteReference: 14, parPoint: 0.7, conceptParPoint: 0.25, conceptMax: 0.6,
  notes: {
    chassis: ['viragesLents', 'viragesRapides'], aileron_avant: ['viragesRapides', 'efficaciteAero'], aileron_arriere: ['efficaciteAero', 'vitessePointe'],
    pontons: ['vitessePointe', 'efficaciteAero'], fond_plat: ['viragesRapides', 'viragesLents'], suspensions: ['motricite', 'gestionPneus'],
  } as Record<TypePiece, readonly string[]>,
  conceptPlus: {
    chassis: ['viragesLents'], aileron_avant: ['viragesRapides'], aileron_arriere: ['viragesRapides'], pontons: ['fiabilite'],
    fond_plat: ['viragesRapides'], suspensions: ['motricite', 'gestionPneus'],
  } as Record<TypePiece, readonly string[]>,
  conceptMoins: {
    chassis: ['viragesRapides'], aileron_avant: ['vitessePointe'], aileron_arriere: ['vitessePointe'], pontons: ['vitessePointe'],
    fond_plat: ['viragesLents'], suspensions: ['viragesRapides'],
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
/**
 * `partFondamentalReforme` : sous une grande réforme, part du savoir FONDAMENTAL comptée pour les pièces qu'elle touche (le reste vient
 * de la recherche menée sur ce règlement). 1 = tout le savoir de fond compte (12a d'origine) ; 0,3 adopté avec V5 (porteur, 25/11/2026).
 * `echelleSavoir` 30 → 12 (V1, adopté avec V5) : le savoir sature plus vite, l'avance des écuries qui en ont beaucoup se tasse.
 */
export const FRONTIERE = { min: 5, etendue: 14, echelleSavoir: 12, margeDepart: 1, partMaxDepart: 0.95, partFondamentalReforme: 0.3 };

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
 * Variante R2 (PROTOTYPE DE MESURE, désactivée par défaut ; paramètre d'expérience `conception.paquets` = facteur) — moins de pièces, plus
 * grosses (« paquets d'évolutions ») : durée de conception, coût de conception et coût des exemplaires × facteur ; part de l'écart à la
 * frontière comblée par un projet × facteur, bornée à `progressionMax`. Le total de l'année reste du même ordre ; chaque pièce se sent.
 */
export const PAQUETS = { facteur: 1, progressionMax: 0.6 };
/** Prototype de mesure (paramètre `conception.progression`, 1 par défaut) : multiplie la part de l'écart à la frontière comblée par un projet, sans changer leur durée ni leur coût. */

/**
 * Reconception à l'entrée d'un nouveau règlement ou d'une évolution mineure (remplace la conversion provisoire de la phase 8, qui
 * ramenait vers la moyenne de la grille) : pour une pièce touchée à l'intensité I,
 * efficacité = min + (1 − I) × (efficacité − min) + I × qualité × (frontière − min) (min : FRONTIERE.min),
 * qualité = `qualiteBase` + `qualiteSavoir` × (1 − exp(−S / FRONTIERE.echelleSavoir)) + exécution incertaine. Absolu, jamais relatif à la grille.
 */
export const RECONCEPTION = { qualiteBase: 0.35, qualiteSavoir: 0.45, coupeReforme: 3 };
/*
 * `coupeReforme` (points d'efficacité, D-175, chantier 3) : une GRANDE réforme retire en plus I × coupeReforme à chaque pièce touchée
 * (l'équivalent d'une coupe d'appui ou d'une nouvelle motorisation imposée par le règlement) ; jamais sous FRONTIERE.min. La frontière, elle,
 * ne bouge pas : l'écart à combler grandit, et les écuries qui ont préparé le règlement (savoir propre, bonne architecture) remontent plus
 * vite. Les évolutions mineures n'ont pas de coupe. Réglable pour les expériences : paramètre `reglement.coupeReforme`.
 */

/**
 * Paris de concept (fiche §10.2, D-170 Q7) : chaque grande réforme cache 2 ou 3 familles d'architecture ; la meilleure n'a aucune
 * pénalité, les autres réduisent la frontière des pièces touchées de `penaliteMin` à `penaliteMax` (part de la marge au-dessus de la
 * référence). Personne ne connaît la vérité : une écurie perçoit chaque pénalité avec un bruit d'écart type
 * `bruitBase` × exp(−savoir préparé / `echelleSavoirIndice`) × (`visionBase` − vision technique du DT / 20).
 * Une pièce est touchée si l'intensité de la réforme dans l'un de ses domaines atteint `intensiteTouchee`.
 */
export const PAYSAGE = { famillesMin: 2, famillesMax: 3, penaliteMin: 0.2, penaliteMax: 0.5, bruitBase: 0.5, echelleSavoirIndice: 40, visionBase: 1.4, intensiteTouchee: 0.3 };

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
/**
 * Erreurs de développement de l'IA (PROTOTYPE DE MESURE, paramètre d'expérience `ia.erreurs` : 0 = désactivé, 1 = actif ; demande du
 * porteur : « l'IA DOIT faire des erreurs de développement »). Selon la compétence de conception du pôle (sur 20), facteur d'erreur
 * f = (competenceSansErreur − compétence) / etendue, borné à [0, 1] : une équipe très compétente ne se trompe presque jamais.
 * - mauvaise estimation des gains (choix de la pièce) : bruit d'écart type `ecartGain` × f (même unité que le gain, % du temps au tour) ;
 * - mauvais concept : avec la probabilité `probaConcept` × f, le concept visé est décalé de ± `decalageConcept`.
 * `ecurieExemptee` : laboratoire seulement (écurie jouée « sans erreur » par une stratégie de joueur), vide en jeu.
 */
export const IA_ERREURS = { competenceSansErreur: 19, etendue: 8, ecartGain: 0.08, probaConcept: 0.8, decalageConcept: 0.75, ecurieExemptee: '', facteurUniforme: 0.7 };
/**
 * Part de la compétence dans le facteur d'erreur (paramètre `ia.erreursCompetence`, 0 à 1 ; 1 par défaut) : f = poids × f(compétence)
 * + (1 − poids) × `facteurUniforme`. Mesuré : des erreurs entièrement liées à la compétence frappent surtout les petites écuries et
 * creusent la hiérarchie ; des erreurs uniformes la laissent intacte.
 */

export const IA_CONCEPTION = { pasConcept: 0.25, gainMin: 0.005, alea: 0.01 };

/**
 * Sensibilités moyennes des 30 circuits (moyenne de data/grille-2026/sensibilites-circuits.csv, vérifiée par un test) : utilisées pour
 * un circuit sans sensibilités propres, c'est-à-dire seulement dans une partie antérieure au format 31 (migrée sans les données).
 */
export const SENSIBILITES_MOYENNES = { tempsS: 86.09, niveauAileron: 0, d1: {cla: -0.13104, cda: 0.0474, masseKg: 0.23605, muMeca: -0.19341, muMotricite: -0.03448, muFreinage: -0.0239, puissance: -0.11763}, d2: {cla: 0.002682, cda: 0.000113, masseKg: -0.001116, muMeca: 0.003939, muMotricite: 0.001348, muFreinage: 0.000653, puissance: 0.002} };

/**
 * Phase 12b — soufflerie et CFD (fiche principale §5, D-170 Q6 ; règlement réel 2026 vérifié) :
 * - allocation par période (6 par an) : `heuresParPeriode` heures de vent et `cfdParPeriode` unités de CFD pour 100 % ; barème selon le
 *   classement constructeurs (balance/finances.ts, RESTRICTIONS_AERO : 70 % au champion, +5 % par place, 115 % au plus), recalculé à
 *   la semaine `semaineMiSaison` sur le classement du moment ; `amplification` α (D-169, équilibrage déclaré) : 100 % + α × (barème − 100 %).
 *   Les heures sont réparties chaque semaine et perdues si elles ne servent pas (aucun report, aucun transfert) ;
 * - efficacité d'une heure : (`qualiteBase` + `qualiteParNiveau` × niveau de l'installation) × (`competenceBase` + `competenceAmplitude`
 *   × (aérodynamique + corrélation du responsable aéro) / 40) × fraîcheur du pôle ;
 * - part de la recherche : `partRechercheDefaut`, `partRecherchePreparation` pour une écurie qui prépare l'avenir (IA ; le joueur choisit) ;
 * - trois usages, chacun à rendement décroissant (sans double comptage) :
 *   1) expertise : savoir gagné en fin de projet = `expertiseParJour` × (jours + `joursParHeure` × H + `joursParUniteCfd` × C) / (1 + S / 40)
 *      (F1 Manager 2024 : une unité de soufflerie ≈ une journée d'expertise ; une heure de vent ≈ 4 passages, 320 passages pour 80 h :
 *      une heure ≈ 4 jours ; 2 000 simulations CFD pour 320 passages : une simulation ≈ 0,16 jour). Renforcé le 25/11/2026 (porteur :
 *      la soufflerie doit compter ; avant : 1 jour par heure, effet mesuré nul, rapport 12b) ;
 *   2) variantes (CFD) : 1 + C / `cfdParVariante` variantes (au plus `variantesMax`), la meilleure EN APPARENCE est retenue (erreur de
 *      prédiction `ecartPredictionCfd` × (1,5 − corrélation / 20)) ;
 *   3) validation (soufflerie) : erreur d'estimation ÷ √(1 + H / `heuresValidation`) ; détection des défauts (12b, fatigue) 1 − exp(−H / `heuresDetection`) ;
 * - recherche aéro (phase 8) : gain × (`rechercheMin` + `rechercheAmplitude` × (1 − exp(−H / `rechercheReference`))), H par période de 4 semaines.
 */
export const SOUFFLERIE = {
  heuresParPeriode: 80, cfdParPeriode: 2000, periodesParAn: 6, semaineMiSaison: 27, amplification: 1,
  qualiteBase: 0.6, qualiteParNiveau: 0.04, competenceBase: 0.6, competenceAmplitude: 0.4,
  partRechercheDefaut: 0.3, partRecherchePreparation: 0.6,
  expertiseParJour: 0.012, joursParHeure: 4, joursParUniteCfd: 0.16,
  cfdParVariante: 150, variantesMax: 8, ecartPredictionCfd: 0.08,
  heuresValidation: 10, heuresDetection: 15,
  rechercheMin: 0.3, rechercheAmplitude: 1.5, rechercheReference: 15,
};
/** Domaines de la phase 8 dont la recherche passe par la soufflerie et la CFD. */
export const DOMAINES_SOUFFLERIE = ['aero_avant', 'aero_arriere', 'fond_plat', 'refroidissement'] as const;

/**
 * Phase 12b — rythmes de travail et fatigue des pôles (fiche compagnon §1, D-170 Q2, Q3, Q11) :
 * - vitesse : avancement selon le rythme ; charge : ce qu'il coûte au pôle (l'intensif fatigue plus qu'il n'accélère) ;
 * - charge d'un pôle = Σ (charge du rythme des projets en conception) / équipes du pôle ; fatigue d'équilibre F* = `equilibreNormal` × c
 *   (c ≤ 1) ou `equilibreNormal` + `pente` × (c − 1) ; chaque semaine la fatigue va vers F* de `montee` (si elle monte), `descente`
 *   (si elle baisse), `descenteAllegee` sous une charge de `seuilAllege` : une équipe épuisée remise au normal redevient fraîche ;
 * - effets : productivité × (1 − max(0, F − `productiviteSeuil`) / 100) ; incident par semaine et par projet
 *   `incidentBase` + `incidentCoef` × max(0, F − `incidentSeuil`)² (difficultés normales comprises) ; efficacité des heures × (1 − F / 200) ;
 *   erreur d'estimation × (1 + F / 100) ;
 * - incident détecté (équipe : `detectionBase` + `detectionRigueur` × rigueur / 20, × (1 − F / 200) ; soufflerie : 1 − exp(−H / 15))
 *   → retard de `retardMinJours` à `retardMaxJours` ; non détecté → défaut caché : performance (gain réduit de `defautMin` à `defautMax`)
 *   ou pièce fragile (fiabilité de la voiture − `fragiliteFiabilite` tant qu'elle est montée) ; un second défaut au-delà de `echecFatigue`
 *   de fatigue → projet inutilisable ;
 * - surcoût de l'intensif (Q11, variable) : `surcout` × coût du projet × part du projet faite cette semaine × (1 + F / 100) ;
 * - stress (existant, humain/etat.ts) du responsable du pôle : + `stressIncident` par incident, + `stressIntensif` par semaine d'intensif.
 */
export const RYTHMES = {
  vitesse: { allege: 0.7, normal: 1, intensif: 1.3 },
  charge: { allege: 0.7, normal: 1, intensif: 1.35 },
};
export type Rythme = keyof typeof RYTHMES.vitesse;
export const FATIGUE = {
  equilibreNormal: 15, pente: 110, montee: 0.15, descente: 0.12, descenteAllegee: 0.2, seuilAllege: 0.7,
  productiviteSeuil: 40, incidentBase: 0.004, incidentCoef: 0.00004, incidentSeuil: 30,
  detectionBase: 0.45, detectionRigueur: 0.4, retardMinJours: 7, retardMaxJours: 14,
  defautMin: 0.2, defautMax: 0.6, partFragile: 0.35, fragiliteFiabilite: 1, echecFatigue: 70,
  surcout: 0.1, stressIncident: 3, stressIntensif: 0.5,
};

/**
 * Alertes des responsables (fiche compagnon §3) : risque réel = 0,6 si un défaut caché existe, sinon probabilité d'incident sur les
 * semaines restantes (au plus 0,6) ; perçu = réel × exp(bruit), écart type `bruitBase` − `bruitCompetence` × (corrélation + rigueur) / 40
 * + fatigue / 200 + stress / 300 ; alerte au-delà de `seuil` ; une par projet toutes les `delaiProjetSemaines`, une par pôle toutes les
 * `delaiPoleSemaines`. Vérification : `verificationMEUR` et `verificationJours`, chance de trouver un défaut `detectionVerification`
 * (+ soufflerie). Échéance d'un dilemme : `echeanceSemaines` ; sans réponse, la recommandation du responsable s'applique.
 */
export const ALERTES = {
  seuil: 0.15, bruitBase: 0.8, bruitCompetence: 0.5, delaiProjetSemaines: 6, delaiPoleSemaines: 4,
  verificationMEUR: 0.2, verificationJours: 7, detectionVerification: 0.6, echeanceSemaines: 2, stressMaintien: 5,
};

/**
 * IA (et DT délégué) : rythme selon la fatigue du pôle et l'enjeu (mêmes règles que le joueur) ; coup de collier en intensif sur les
 * `joursFinProjet` derniers jours d'un projet si la fatigue est sous `fatigueFinProjet` (l'intensif ponctuel, D-170 et porteur 25/11/2026).
 */
export const IA_RYTHME = { fatigueRepos: 55, fatigueIntensif: 30, forcePretendant: 0.75, risqueAudacieux: 14, joursFinProjet: 14, fatigueFinProjet: 40 };

/**
 * Phase 12b — événements de conception (fiche compagnon §4 ; cible du porteur : 5 à 10 % des projets) :
 * - tirage unique au lancement : probabilité `base` × (0,7 + 0,6 × innovation / 20) × (0,8 + 0,4 × nouveauté du concept), bornée
 *   [`min` ; `max`] ; moment de l'événement entre `momentMin` et `momentMax` de l'avancement ; une même famille au plus une fois
 *   toutes les `delaiFamilleSemaines` par écurie (sinon l'événement est perdu, pas reporté) ;
 * - poids des familles : piste prometteuse, contradiction CFD/soufflerie (pièces aéro), matériau expérimental (pièces mécaniques et
 *   carrosserie), réorientation du concept ;
 * - piste : vérité tirée (rien, mineure, majeure) ; majeure = `majeureBase` × (innovation / 14)², au plus `majeureMax` ; gains en
 *   points d'efficacité ; explorer coûte `exploreJours` et `exploreMEUR`, capture `captureSimple` de la valeur (avec des heures en plus :
 *   toute la valeur) ; une piste sans valeur apprend quand même `savoirRien` points de savoir ; une majeure ajoute `savoirMajeure` points ;
 * - contradiction : la CFD a raison avec la probabilité 0,4 + 0,4 × corrélation / 20 ; vérifier coûte `verifierJours` et `verifierMEUR`
 *   et révèle la vérité avec 0,6 + 0,3 × corrélation / 20 ; la prudence garde `facteurPrudence` du gain ; poursuivre sur une CFD fausse
 *   ne garde qu'une part tirée entre 0 et `facteurErreurMax` ;
 * - matériau : fragile avec la probabilité 0,45 − 0,2 × rigueur / 20 ; gain `gainMateriau` points ; essais `essaisMEUR`, `essaisJours` ;
 * - réorientation : concept décalé de `decalageConcept` vers ce qui paie sur les circuits à venir, `reorienterJours`.
 */
export const EVENEMENTS_CONCEPTION = {
  base: 0.07, min: 0.04, max: 0.12, momentMin: 0.3, momentMax: 0.7, delaiFamilleSemaines: 10,
  poids: { piste: 30, contradiction: 25, materiau: 20, reorientation: 25 },
  partRien: 0.5, majeureBase: 0.04, majeureMax: 0.08, mineureMin: 0.6, mineureMax: 1.2, majeure: 2.5,
  exploreJours: 14, exploreMEUR: 0.45, captureSimple: 0.7, savoirRien: 0.3, savoirMajeure: 6,
  verifierJours: 7, verifierMEUR: 0.15, facteurPrudence: 0.7, facteurErreurMax: 0.5,
  gainMateriau: 0.8, essaisMEUR: 0.4, essaisJours: 7,
  decalageConcept: 0.4, reorienterJours: 7, gainReorientationMin: 0.02,
};

/**
 * ADUO (Additional Development and Upgrade Opportunities, règlement moteur 2026, vérifié) : un motoriste dont la puissance est en
 * retard sur le meilleur de `seuil1Pct` % ou plus reçoit une évolution supplémentaire dans la saison ; de `seuil2Pct` % ou plus, deux, et
 * encore deux la saison suivante. Évaluation à l'intersaison (puissance = niveau × MOTORISTE_PUISSANCE.pourcentParPoint). Équilibrage
 * déclaré (D-169) : il donne des moyens de développement à un motoriste en retard, jamais de la vitesse décidée d'avance.
 * `gainParEvolution` : points de niveau par évolution, avec le même rendement décroissant que la progression normale.
 */
export const ADUO = { actif: true, seuil1Pct: 2, seuil2Pct: 4, evolutions1: 1, evolutions2: 2, saisonsSuivantes2: 1, gainParEvolution: 0.6 };

