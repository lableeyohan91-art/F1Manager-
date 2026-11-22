/**
 * Cycle de vie des personnages — phase 6a (docs/systemes/phase-6a-cycle-de-vie.md, D-100, D-101).
 * Toutes les valeurs sont provisoires (méthode D-095 : mesurer avant de recalibrer).
 */

/* ---------------------------------------------------------------- Profil de carrière */

/**
 * Archétypes de carrière (D-100). Pour chacun :
 * - poids : fréquence relative au tirage ;
 * - decalageApogee : années ajoutées à l'âge moyen de début d'apogée du métier ;
 * - dureeApogee : multiplicateur de la durée moyenne du plateau du métier ;
 * - progression : multiplicateur de la vitesse de progression ;
 * - declin : multiplicateur de la vitesse de déclin ;
 * - declic : multiplicateur de la probabilité de déclics et de stagnations.
 */
export const ARCHETYPES: Record<string, { poids: number; decalageApogee: number; dureeApogee: number; progression: number; declin: number; declic: number }> = {
  precoce: { poids: 15, decalageApogee: -3, dureeApogee: 0.8, progression: 1.4, declin: 1.3, declic: 1 },
  tardif: { poids: 15, decalageApogee: 3, dureeApogee: 0.9, progression: 0.7, declin: 0.9, declic: 1 },
  regulier: { poids: 40, decalageApogee: 0, dureeApogee: 1, progression: 1, declin: 1, declic: 1 },
  longevite: { poids: 12, decalageApogee: 1, dureeApogee: 1.8, progression: 0.9, declin: 0.5, declic: 0.8 },
  meteore: { poids: 6, decalageApogee: -2, dureeApogee: 0.35, progression: 1.7, declin: 2, declic: 1.5 },
  irregulier: { poids: 12, decalageApogee: 0, dureeApogee: 1, progression: 1, declin: 1.1, declic: 3 },
};
/** Variation individuelle (écart type, années) de l'âge de début d'apogée et de la durée du plateau. */
export const VARIATION_AGES = { apogee: 1.5, plateau: 1.5 };
/** Écart type des points forts / faibles par compétence autour du potentiel global (D-051), en points. */
export const ECART_COMPETENCES = 1.5;
/**
 * Style (D-104) : les quatre compétences de rythme partagent une composante commune (écart type, points),
 * pour des profils cohérents ; leur écart individuel est alors réduit à `individuelRythme`.
 */
export const STYLE_RYTHME = { commun: 1.2, individuelRythme: 0.8 };
/** Une personne issue des données encore au sommet garde au moins ce nombre d'années de plateau (§3.4). */
export const PLATEAU_MINIMAL_DONNEES = 1;

/* ---------------------------------------------------------------- Progression et déclin */

/** Part de l'écart au plafond comblée par période de 4 semaines, avant l'apogée (environnement et travail = 1). */
export const TAUX_PROGRESSION = 0.02;
/** Pendant le plateau, la progression continue au ralenti (part du taux). */
export const PROGRESSION_PLATEAU = 0.25;
/** Déclin : points perdus par période, de base, accéléré par année de déclin (× (1 + acceleration × années)). */
export const DECLIN = { pointsParPeriode: 0.035, acceleration: 0.15 };
/** Petite variation aléatoire par période (écart type, points). */
export const ALEA_PROGRESSION = 0.04;

/**
 * Nature des compétences (§4.2.3) : décalage de l'apogée (années) et multiplicateur du déclin.
 * Les compétences absentes du tableau sont « techniques ».
 */
export const NATURES: Record<string, { decalage: number; declin: number }> = {
  physique: { decalage: -2, declin: 1.5 },
  technique: { decalage: 0, declin: 1 },
  experience: { decalage: 3, declin: 0.5 },
  transversale: { decalage: 5, declin: 0.4 },
};
export const NATURE_COMPETENCE: Record<string, string> = {
  viragesRapides: 'physique', departs: 'physique', condition: 'physique',
  freinage: 'technique', viragesLents: 'technique', motricite: 'technique',
  depassement: 'technique', defense: 'technique', pluie: 'technique',
  regularite: 'experience', gestionPneus: 'experience', retourTechnique: 'experience', intelligenceCourse: 'experience',
  strategie: 'experience', reglement: 'experience', gestionProjet: 'experience', negociation: 'experience', politique: 'experience',
  relationConseil: 'experience', organisationStands: 'experience', gestionPilotes: 'experience', gestionBudgetaire: 'experience', maitrisePlafond: 'experience',
  leadership: 'transversale', communication: 'transversale', adaptabilite: 'transversale', gestionHumaine: 'transversale',
};

/** Temps de jeu (§4.2.4) : multiplicateur selon la situation. */
export const TEMPS_DE_JEU: Record<string, number> = {
  pilote_titulaire: 1, pilote_reserve: 0.55, junior: 0.6, pilote_libre: 0.3, personnel_actif: 1, personnel_libre: 0.4,
};
/** Encadrement : multiplicateur = min + amplitude × qualité (0 à 1), à rendements décroissants (racine). */
export const ENCADREMENT = { min: 0.85, amplitude: 0.3 };
/** Mentor : bonus si un aîné plus fort de l'écurie, du même métier, est en bonne relation (affinité ≥ seuil). */
export const MENTOR = { bonus: 0.12, seuilAffinite: 0.2, ecartNiveau: 1.5 };
/** Motivation (0–100) : multiplicateur = min + amplitude × motivation / 100. */
export const MOTIVATION_PROGRESSION = { min: 0.6, amplitude: 0.8 };
/** Travail personnel : professionnalisme et remise en question (1–20). Progression × (min + amplitude × moyenne/20) ; déclin × (frein − amplitude × professionnalisme/20). */
export const TRAVAIL = { min: 0.8, amplitude: 0.4, freinDeclin: 1.2, amplitudeDeclin: 0.4 };

/** Déclics et stagnations (avant la fin du plateau) : probabilité annuelle, durée (périodes), multiplicateur ; révision rare du potentiel (D-100). */
export const DECLIC = { probabiliteAnnuelle: 0.04, periodes: 6, multiplicateur: 2.5, revisionPotentiel: 0.3 };
export const STAGNATION = { probabiliteAnnuelle: 0.03, periodes: 6, multiplicateur: 0, revisionPotentiel: 0.3 };

/* ---------------------------------------------------------------- Potentiel estimé */

/**
 * Estimation du potentiel par une écurie (§6) : demi-largeur de la fourchette (points) =
 * base selon la jeunesse × (max − amplitude × niveau du département recrutement / 20) / (1 + observation × saisons observées).
 */
export const ESTIMATION = { demiLargeurJeune: 3, demiLargeurVeteran: 0.8, ageVeteran: 30, ageJeune: 16, max: 1.3, amplitude: 0.6, observation: 0.4, biaisDepartement: 0.8 };

/* ---------------------------------------------------------------- Fin de carrière */

/**
 * Retraite (§7) : probabilité annuelle, décision en fin de saison =
 * base + parAnneeApresPlateau × années après la fin du plateau + declinRessenti × (perte relative depuis le meilleur niveau)
 * + parSaisonLibre × saisons sans contrat − ambition (centrée) × ambition − envie de titre.
 */
export const RETRAITE = {
  base: 0.01, parAnneeApresPlateau: 0.07, declinRessenti: 2, parSaisonLibre: 0.25, ambition: 0.01, envieTitre: 0.08,
  ageMinimalPilote: 30, ageMinimalPersonnel: 52, ageMaximal: 75, facteurSousContrat: 0.3,
};
/** Retour après une retraite (D-072) : années maximales, ambition et niveau minimaux, probabilité annuelle. */
export const RETOUR = { anneesMax: 2, ambitionMin: 14, niveauMin: 14, probabilite: 0.15 };
/** Abandon des jeunes pilotes qui n'ont jamais eu de baquet en F1 (D-101) : probabilité annuelle par âge. */
export const ABANDON_JEUNES: Record<number, number> = { 23: 0.2, 24: 0.35, 25: 0.5, 26: 0.7 };
export const ABANDON_AGE_QUASI_CERTAIN = 27;
export const ABANDON_PROBABILITE_MAX = 0.95;
/** Reconversion à la retraite (§8) : âge maximal, leadership minimal, probabilité de base (+ aspirations). */
export const RECONVERSION = { ageMaxPilote: 48, ageMaxPersonnel: 64, leadershipMin: 12, probabilite: 0.3, bonusAspiration: 0.3, ecartNiveau: 2 };

/* ---------------------------------------------------------------- Générations */

/**
 * Cohortes annuelles (§9, D-100). Potentiel des jeunes : loi normale + rare queue de pépites.
 * D-102 : environ **deux pilotes d’exception (potentiel ≥ 18) par décennie** (premier réglage : ≈ un par an, jugé beaucoup trop).
 * Distribution resserrée (moyenne plus haute, écart plus faible) : autant de bons pilotes (≈ 2 par an à 16 ou plus),
 * beaucoup moins de pilotes d’exception, sans faire baisser le niveau de la grille au fil des décennies.
 */
export const COHORTE = {
  pilotes: 15, agePilotes: 14, potentielPilotes: { moyenne: 14, ecartType: 1.45 }, pepite: { probabilite: 0.015, bonusMax: 2.5 },
  /** Écart initial au plafond à 14 ans (points), et sa variation. */
  ecartInitial: { moyenne: 7.5, ecartType: 1 },
  personnel: 10, agePersonnel: { min: 24, max: 30 }, potentielPersonnel: { moyenne: 13, ecartType: 2 }, ecartInitialPersonnel: { moyenne: 3, ecartType: 1 },
};
/** Âge minimal pour être candidat à un baquet en F1 (D-100, en attendant les filières de la 6b). */
export const AGE_MINIMAL_F1 = 18;
/** Monde de départ : jeunes pilotes générés par âge, de 14 à 22 ans, avec un passé de progression calculé. */
export const POPULATION_JEUNE_INITIALE = { ageMin: 14, ageMax: 22 };

/* ---------------------------------------------------------------- Expérience réelle (D-106) */

/**
 * Facteur d'expérience des compétences d'« expérience » : min + amplitude × (1 − e^(−GP / echelle)).
 * Il remplace l'âge comme moteur de leur progression (pour le personnel : saisons d'activité).
 */
export const FACTEUR_EXPERIENCE = { min: 0.6, amplitude: 0.8, echelleGP: 60, echelleSaisons: 8 };
/** Circuit découvert : handicap (points de niveau) × e^(−visites / echelle) × (1,3 − adaptabilité / 20). */
export const NOUVEAU_CIRCUIT = { handicap: 0.4, echelle: 1.5 };
/** Nouvelle écurie : handicap (points) × e^(−GP avec l'écurie / echelle) × (1,3 − adaptabilité / 20). */
export const NOUVELLE_ECURIE = { handicap: 0.3, echelle: 6 };
/** Apprentissage de la pluie : après une course sous la pluie, part de l'écart au plafond comblée × e^(−courses / echelle). */
export const APPRENTISSAGE_PLUIE = { part: 0.04, echelle: 15 };

/* ---------------------------------------------------------------- Pression (D-105) */

/**
 * Erreur sous pression dans une course décisive (4 dernières manches, pilote encore en course pour le titre) :
 * probabilité = base × (1,5 − sang-froid / 20) × (1 − experience × (1 − e^(−luttes / echelleLuttes))) ; coût en % du temps au tour.
 */
export const PRESSION = { manchesDecisives: 4, base: 0.12, experience: 0.6, echelleLuttes: 2, pertePct: 0.6 };

/* ---------------------------------------------------------------- Affinités (D-108) */

/** Effet par cran d'affinité (points de niveau effectif), bornes de l'échelle. */
export const AFFINITE = { parCran: 0.15, min: -2, max: 2 };
/** Affinité naturelle, tirée à la première visite : Grand Prix à domicile (+1 ou +2), ailleurs un cran rare. */
export const AFFINITE_NATURELLE = { domicileUn: 0.5, domicileDeux: 0.15, ailleurs: 0.04 };
/** Évolution après un événement : probabilité d'un cran (modulée par la personnalité). */
export const AFFINITE_EVENEMENTS = { victoire: 0.35, podium: 0.15, titre: 0.5, incident: 0.25 };

/** Modulation par un trait de personnalité (1–20) : multiplicateur = min + amplitude × trait / 20. */
export const MODULATION_TRAIT = { min: 0.6, amplitude: 0.8 };
/** Adaptabilité (1–20) : les handicaps de nouveauté sont multipliés par reference − adaptabilité / 20. */
export const ADAPTABILITE_REFERENCE = 1.3;
/** Expérience historique des pilotes des données (provisoire avant la phase 9) : par saison de titulaire. */
export const EXPERIENCE_HISTORIQUE = { gpParSaison: 22, pluieParSaison: 2 };


/**
 * D-121 — archivage : une personne retirée depuis au moins `anneesApresRetraite` saisons (au-delà de la fenêtre de retour)
 * devient une fiche légère ; ses relations, souvenirs, contrats terminés et repérages sont effacés (volumes bornés).
 */
export const ARCHIVAGE = { anneesApresRetraite: 5 };
