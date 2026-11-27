/**
 * Phase 7a — marché des transferts des pilotes (fiche docs/systemes/phase-7-marche-du-travail.md, D-116, D-117).
 * Estimations de game design, provisoires : elles seront mesurées (D-095) puis calibrées lors de la campagne d'après la phase 8.
 */

/**
 * Fenêtre principale : tours d'offres de la semaine `debut` à la semaine `fin`, tous les `pas` semaines.
 * Audit n°4 : séance de clôture en semaine `cloture` (réponses définitives, sans contre-offre ; offres restantes expirées et notifiées).
 * Les contrats prennent effet en semaine 50.
 */
export const FENETRE = { debut: 26, fin: 48, pas: 2, cloture: 49 };

/** Nombre de tours de négociation d'une offre (offre, contre-offre, offre finale). */
export const TOURS_MARCHE = 3;

/**
 * Plan de personnel de l'IA (pilotes titulaires).
 * - vivier : nombre de candidats examinés à chaque tour (présélection sur l'opinion du paddock, pour borner le calcul) ;
 * - approchesBase / approchesParNiveau : nombre d'offres simultanées en attente pour une écurie (département recrutement, niveau /20) ;
 * - ecartDebauchage : avance de score (unités de score de recrutement, ≈ 1/20 de point de niveau) exigée pour payer une indemnité plutôt que de prendre le meilleur candidat libre ;
 * - preAccordSemaineMin : un pré-accord à deux saisons n'est envisagé qu'à partir de cette semaine, seulement pour un candidat d'exception
 *   (parmi les `preAccordRang` premiers du vivier selon l'opinion du paddock), et au plus `preAccordsParSaison` par écurie et par saison.
 */
export const PLAN_MARCHE = { vivier: 40, approchesBase: 1, approchesParNiveau: 2, ecartDebauchage: 0.06, preAccordSemaineMin: 40, preAccordRang: 5, preAccordsParSaison: 1 };

/**
 * Pari sur l'avenir (levier contre les débutants trop âgés) : l'écurie ajoute au score la progression qu'elle estime possible
 * pendant le contrat = min(potentiel estimé − niveau, progressionParAn × durée), en points de niveau, multipliée par `poids` (/20 comme le niveau).
 */
export const HORIZON = { progressionParAn: 0.9, poids: 0.6 };

/** Salaire offert par l'IA = valeur de marché × [min ; max] selon l'audace du team principal et le budget ; plafond de surenchère en contre-offre. */
export const OFFRE_MARCHE = { min: 0.9, max: 1.2, plafondBase: 1.15, plafondAudace: 0.3 };

/**
 * Clause de rachat inscrite dans un nouveau contrat de pilote titulaire : salaire × années restantes × multiple.
 * Indemnité exigée par une écurie (sans clause) : salaire × années restantes × multipleIndemnite, + majorations si c'est son meilleur pilote
 * ou si l'acheteur est réputé prédateur. Affilié d'académie : financement annuel × multipleAffiliation.
 */
export const RACHAT = { multiple: 1.5, multipleIndemnite: 2.0, majorationMeilleur: 0.5, majorationParPointPredateur: 0.1, multipleAffiliation: 3, minimumMEUR: 1 };

/** Un pilote sous contrat ne part que si l'offre le séduit nettement plus que rester (unités d'utilité). */
export const INERTIE_CONTRAT = 0.12;

/** Contre-attaque de l'employeur : il prolonge et augmente un pilote courtisé qu'il veut garder, jusqu'à ce multiple de la meilleure offre extérieure. */
export const CONTRE_ATTAQUE = { surenchere: 1.05, plafondValeur: 1.4 };

/**
 * Lassitude des pilotes (D-117 §15.1) : calculée, non stockée. À partir de `anneesMin` saisons dans la même écurie, chaque saison
 * (parAnnee) et chaque titre avec elle (parTitre) augmentent l'envie d'un nouveau défi ; modulée par le goût du défi et l'ambition, freinée par la loyauté.
 * Bonus d'utilité pour une offre d'une autre écurie, malus de moitié pour une prolongation ; plafonné à `max`.
 */
export const LASSITUDE_PILOTE = { anneesMin: 5, parAnnee: 0.02, parTitre: 0.05, max: 0.2 };

/**
 * Réputation de prédatrice (D-117 §15.4) : + parDebauchage à chaque rachat d'un pilote sous contrat ; multipliée chaque année par `inertie`.
 * Malus d'utilité des offres de cette écurie : parPoint × réputation, plafonné ; jamais une interdiction.
 */
export const PREDATEUR = { parDebauchage: 1, inertie: 0.6, malusParPoint: 0.04, malusMax: 0.15 };

/**
 * Phase 7b — marché du personnel technique et dirigeant (D-116, D-117).
 * - postes : postes ouverts au marché (le team principal reste nommé par le conseil) ;
 * - nonConcurrenceSemaines : période de non-concurrence d'une personne débauchée (D-117 : 6 mois), pendant laquelle elle travaille
 *   à efficacité réduite (efficaciteNonConcurrence, D-127) ;
 * - partBudgetPoste : part du budget de l'écurie qui sert de référence de coût pour un poste de personnel (score de recrutement).
 */
export const PERSONNEL_MARCHE = {
  postes: ['directeur_technique', 'responsable_aero', 'responsable_conception', 'directeur_sportif', 'directeur_financier', 'chef_stands'] as const,
  nonConcurrenceSemaines: 26,
  /**
   * D-127 (choix du porteur, option 3) : pendant sa non-concurrence, la recrue travaille déjà, mais à cette fraction de son efficacité
   * (adaptation, sans pouvoir s'appuyer sur ce qu'elle savait de son ancienne écurie). Les secrets transférables viendront en phase 12.
   */
  efficaciteNonConcurrence: 0.5,
  partBudgetPoste: 0.015,
};

/** Rang hiérarchique des postes (pour l'attrait d'un poste plus élevé, la lassitude et les candidatures spontanées). */
export const RANG_POSTE: Record<string, number> = {
  pilote_junior: 0, pilote_reserve: 0, pilote_titulaire: 0, ingenieur: 0, chef_stands: 0.5,
  responsable_aero: 1, responsable_conception: 1, directeur_sportif: 1, directeur_financier: 1,
  directeur_technique: 2, team_principal: 3,
};

/**
 * Lassitude du personnel (D-117 §15.1), calculée et non stockée : saisons au même poste dans la même écurie au-delà de `anneesMin`,
 * titres constructeurs de l'écurie pendant ce temps, poste supérieur bloqué par quelqu'un de moins bon. Modulée comme pour les pilotes.
 */
export const LASSITUDE_PERSONNEL = { anneesMin: 4, parAnnee: 0.02, parTitre: 0.04, blocage: 0.05, max: 0.2 };

/**
 * D-140 — USURE DU SUCCÈS (équilibrage volontaire, décidé par le porteur : « on se l'autorise, il le faut »).
 * Une personne (personnel ou pilote titulaire) qui gagne longtemps avec la même écurie finit par vouloir un nouveau défi, à son rythme :
 * - titres vécus : titres constructeurs de l'écurie pendant sa présence (pour un pilote, le plus grand de ce nombre et de ses titres
 *   pilotes avec elle) ;
 * - seuil personnel = seuilMin + (seuilMax − seuilMin) × patience, où patience (0 à 1) = moyenne de la loyauté, de la valeur
 *   « stabilité », et de l'inverse du goût du défi et de l'ambition (notes sur 20) : certains se lassent après 3 titres, d'autres après 5 ;
 * - les très loyaux (trait loyauté ≥ loyauteImmunite, environ 3 % des gens) ne se lassent jamais du succès ;
 * - signal précurseur : à `anticipation` titre du seuil, la personne vient dire à son supérieur qu'elle a besoin d'un nouveau défi ;
 * - usure = parTitre × (titres − (seuil − anticipation)), ajoutée à la lassitude ordinaire, plafonnée à `max` ;
 * - effets : la motivation visée baisse de motivationParPoint × usure (points sur 100) ; pour un pilote, une motivation basse
 *   retire jusqu'à effetCourse (même échelle que la forme) ; l'envie de partir, les candidatures et les offres font le reste.
 * - le développement de la voiture est multiplié par (1 − effetDeveloppement × usure moyenne des cadres techniques en place :
 *   directeur technique, responsables aéro et conception).
 */
/**
 * Piste 3 du rapport « diffusion et ères » : usure du succès renforcée (exception D-140, décidée par le porteur). Avec le paramètre
 * `usure.renforcee` à 1, l'usure par titre est multipliée par `facteur` et son maximum porté à `maxAbsolu` (part, sans unité). 0 = désactivé.
 */
export const USURE_SUCCES_RENFORCEE = { facteur: 1.7, maxAbsolu: 0.9 };
export const USURE_SUCCES = { seuilMin: 3, seuilMax: 5, loyauteImmunite: 17, anticipation: 1, parTitre: 0.15, max: 0.6, motivationParPoint: 50, effetCourse: 0.1, motivationReference: 60, effetDeveloppement: 0.7 };

/** Attrait d'une offre pour un poste plus élevé (utilité × ambition/20). */
export const ATTRAIT_POSTE_SUPERIEUR = 0.3;

/**
 * Candidatures spontanées (D-117 §15.2) : une personne ambitieuse (ambition ≥ ambitionMin) et lassée (≥ lassitudeMin) propose ses services
 * à au plus `parSaison` écuries, pour un poste égal ou supérieur où une place s'ouvre. Bonus de score pour l'écurie qui la reçoit.
 */
export const CANDIDATURES = { semaine: 28, ambitionMin: 13, lassitudeMin: 0.06, parSaison: 2, bonusScore: 0.04 };

/**
 * Départs en groupe (D-077) : un directeur technique ou un responsable débauché, influent (leadership et gestion humaine), entraîne une partie
 * de son département : son ancien département perd jusqu'à `niveauMax` points de niveau moyen, le nouveau en gagne la moitié.
 */
export const DEPART_GROUPE = { niveauMax: 1, seuilInfluence: 0.6 };

/**
 * Remplacement d'une personne en place (phase 7b, décision coût/bénéfice demandée par le porteur le 23/11/2026, à la place de seuils fixes).
 * Une fois par saison, l'IA compare, en unités du score de recrutement (≈ niveau/20) :
 * - gain : score de la recrue − score de la personne en place (même grille : niveau, potentiel, âge, salaire, entente avec le team principal) ;
 * - coûts : indemnité de licenciement (poidsIndemnite × montant / référence de coût du poste sur la durée) ; non-concurrence d'une recrue débauchée
 *   (efficacité réduite : niveau de la recrue/20 × (1 − efficacité) × semaines/52, réparti sur la durée) ; perte de continuité (continuite) ;
 *   instabilité (instabiliteParRemplacement × remplacements déjà décidés cette saison dans l'écurie).
 * Remplacement si gain − coûts > seuil − audace × (risque du team principal − 10)/10 + aléa de jugement (écart type alea).
 */
export const REMPLACEMENT = { poidsIndemnite: 0.4, continuite: 0.075, instabiliteParRemplacement: 0.04, seuil: 0.03, audace: 0.02, alea: 0.015 };
