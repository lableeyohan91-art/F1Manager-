/**
 * Contrats, négociations et décisions humaines (phase 4). Estimations de game design, à calibrer.
 */

/** Salaire de référence (M€/an) pour un niveau métier de 15, par poste. */
export const SALAIRE_REFERENCE_MEUR: Record<string, number> = {
  pilote_titulaire: 9,
  pilote_reserve: 1,
  pilote_junior: 0.3,
  team_principal: 6,
  directeur_technique: 5,
  directeur_sportif: 1.6,
  directeur_financier: 1.6,
  responsable_aero: 2,
  responsable_conception: 2,
  ingenieur: 0.5,
};

/** Croissance du salaire par point de niveau métier au-dessus (ou en dessous) de 15. */
export const CROISSANCE_SALAIRE_PAR_POINT = 1.32;

/** Prime de palmarès sur la valeur de marché : + par titre de champion, plafonnée. */
export const PRIME_PALMARES = { parTitre: 0.15, plafond: 1.0 };

/** Baisse de salaire : pénalité d'utilité par fraction de baisse par rapport au salaire actuel (au-delà de 10 %). */
export const PENALITE_BAISSE_SALAIRE = 0.6;

/** Bornes de la valeur de marché, en M€/an. */
export const VALEUR_MARCHE = { min: 0.1, max: 70 };

/** Semaine d'ouverture des négociations de prolongation (contrats finissant à la fin de l'année). */
export const SEMAINE_NEGOCIATIONS = 30;

/** Semaine où les contrats non prolongés prennent fin et où les postes vacants sont pourvus. */
export const SEMAINE_FIN_CONTRATS = 50;

/** Nombre maximal de tours de négociation (offre, contre-offre, offre finale). */
export const TOURS_NEGOCIATION = 2;

/** Poids des composantes de l'utilité d'une offre pour le salarié (les poids des valeurs viennent de la personne). */
export const UTILITE = {
  /** Poids global des valeurs personnelles (couche 2). */
  valeurs: 1,
  /** Une conviction forte (≥ 17) compte double (D-052). */
  multiplicateurConviction: 2,
  seuilConviction: 17,
  /** Ligne rouge (D-067) : valeur ≥ 19 et remise en question ≤ 10, attachée à une situation concrète. */
  seuilLigneRouge: 19,
  remiseEnQuestionMaxLigneRouge: 10,
  /** Relations (les souvenirs n'agissent qu'à travers elles : pas de double comptage). */
  confianceDecideur: 1.0,
  affiniteDecideur: 0.4,
  confianceOrganisation: 0.5,
  /** Aspirations servies par l'offre. */
  aspiration: 0.3,
  /** Bruit de décision : écart type = base + tempérament/20 × parPoint. */
  bruitBase: 0.04,
  bruitTemperament: 0.1,
  /** Socle de poids de l'argent et de l'équité pour tous (en plus de la valeur personnelle /20). */
  socleArgentEquite: 0.5,
  /** En dessous de cette fraction de sa valeur, une offre est insultante. */
  seuilOffreInsultante: 0.6,
  penaliteOffreInsultante: -0.4,
  /** Coût de l'incertitude du départ (rester libre), en unités d'utilité. */
  coutIncertitude: 0.25,
};

/** L'écurie (IA) propose un salaire = valeur de marché × [min ; max], selon le risque du team principal et le budget. */
export const OFFRE_SALAIRE = { min: 0.85, max: 1.15 };

/** Contre-offre : le salarié demande au plus ce pourcentage de plus (selon ambition et risque). */
export const CONTRE_OFFRE_MAX = 0.25;

/**
 * Prime de continuité (en points de niveau) : connaître l'écurie, ses méthodes et ses voitures a une valeur.
 * Un team principal ne remplace pas quelqu'un pour un remplaçant à peine meilleur.
 */
export const PRIME_CONTINUITE = { pilote: 0.8, personnel: 1.5 };

/** Seuil d'intérêt (en points de niveau) en dessous duquel l'écurie ne propose pas de prolongation. */
export const SEUIL_PROLONGATION = -0.5;

/** Pénalité de recrutement par année au-delà de l'âge de déclin du métier (en points de score). */
export const PENALITE_AGE_RECRUTEMENT = 0.04;

/** Réponse de l'IA à une demande d'augmentation : seuil d'envie (niveau/20 + loyauté du TP − budget serré + aléa). */
export const SEUIL_AUGMENTATION = 0.68;

/** Demandes d'augmentation : probabilité mensuelle de base pour une personne sous-payée et performante. */
export const DEMANDE_AUGMENTATION = { probabiliteMensuelle: 0.06, seuilSousPaye: 0.8, hausseDemandee: 0.2 };

/** Interactions de l'IA team principal : probabilité mensuelle de réagir à un pilote en difficulté. */
export const REACTION_TEAM_PRINCIPAL = { probabiliteMensuelle: 0.15 };

/** Réservoir : nombre minimal de personnes libres par poste, renouvelé chaque intersaison (D-066, provisoire avant la phase 6a). */
export const RESERVOIR_MINIMUM: Record<string, number> = {
  // Phase 6a : les pilotes viennent des cohortes annuelles (balance/carriere.ts), plus de pilotes générés à la demande.
  pilote_titulaire: 0,
  pilote_reserve: 0,
  pilote_junior: 0,
  team_principal: 4,
  directeur_technique: 5,
  directeur_sportif: 5,
  directeur_financier: 5,
  responsable_aero: 6,
  responsable_conception: 6,
  ingenieur: 30,
};


/** Nombre maximal de tours d'offres pour pourvoir les postes vacants. */
export const TOURS_RECRUTEMENT = 8;

/**
 * Audit n°3 — bornes de validité d'un contrat (valeurs incohérentes refusées, décisions risquées permises) :
 * salaire après arrondi au dixième, en M€/an ; durée en années entières.
 */
export const BORNES_CONTRAT = { salaireMinMEUR: 0.1, salaireMaxMEUR: 150, dureeMin: 1, dureeMax: 5 };

/**
 * Audit n°3 — engagements salariaux des pilotes titulaires pour une saison, rapportés au budget de l'écurie :
 * jusqu'à `libre`, le team principal décide seul ; au-delà de `maximum`, le conseil refuse toujours ;
 * entre les deux, le conseil arbitre (probabilité d'accord décroissante, + goût du risque et ambition du propriétaire, /40 par point au-dessus de 10).
 */
export const ENGAGEMENTS_PILOTES = { libre: 0.2, maximum: 0.5 };

/**
 * Audit n°4 — indemnité de rupture versée par l'employeur à un licenciement (volontaire, du conseil, ou après un changement
 * de propriétaire) : la clause du contrat si elle existe, sinon cette part du salaire annuel. Dépense hors plafond (ligne « indemnités »).
 */
export const INDEMNITE_RUPTURE = { partSalaireAnnuel: 0.5 };
