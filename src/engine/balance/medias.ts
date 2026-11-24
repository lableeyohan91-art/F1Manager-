/**
 * Phase 11 — médias et archives (docs/systemes/phase-11-medias-archives.md, D-149). Valeurs PROVISOIRES (D-120).
 */

/**
 * Choix des articles : chaque semaine, chaque média retient au plus `parSemaine` faits dont le score ≥ `seuil`.
 * score = importance + bonus de ligne éditoriale (par type de fait) + popularité des sujets / `diviseurPopularite`.
 * Titre : la phrase du fait jusqu'à `longueurTitre` caractères.
 * Hors de sa ligne éditoriale (aucun bonus), un média autre que le quotidien de référence ne reprend qu'un fait d'importance ≥ `importanceHorsLigne`.
 * Volumes : les articles d'importance < `importanceArchive` sont effacés après `saisonsConservees` saisons ; les autres restent,
 * au plus `archiveParSaison` par saison (les plus importants).
 */
export const ARTICLES = { parSemaine: 3, seuil: 3, diviseurPopularite: 40, saisonsConservees: 1, importanceArchive: 4, archiveParSaison: 20, importanceHorsLigne: 5, longueurTitre: 120 };

/** Faits jamais repris par la presse : la construction du passé, la vie interne sans intérêt public. */
export const TYPES_IGNORES = ['histoire.', 'saison.', 'demo.', 'dev.', 'recrutement.genere', 'generation.'];

/**
 * Ligne éditoriale : bonus de score par préfixe de type de fait (le premier préfixe qui correspond).
 * Le tabloïd aime les conflits ; la revue technique, le règlement et la recherche ; le quotidien, le sport et le marché.
 */
export const LIGNES_EDITORIALES: Record<string, Record<string, number>> = {
  reference: { 'gp.': 1, 'titre.': 2, 'media.lassitude_public': 1, 'marche.signature': 1, 'conseil.': 1, 'federation.': 1, 'reglement.annonce': 1, 'record.': 2, 'media.declaration': 0.5 },
  tabloid: { 'media.lassitude_public': 2, 'media.scandale': 3, 'information.revelee': 2, 'personnel.critique': 2, 'contrat.demission': 2, 'conseil.licenciement': 2, 'media.declaration': 1.5, 'media.rumeur': 2, 'groupe.suit_leader': 1, 'contrat.demande_depart': 1, 'gp.victoire_surprise': 1 },
  technique: { 'reglement.': 2, 'recherche.': 2, 'politique.lobbying': 1, 'stands.': 1, 'infrastructure.': 1, 'federation.': 1 },
  national: { 'gp.': 1, 'titre.': 2, 'marche.signature': 1, 'recrutement': 0.5, 'record.': 1 },
};

/**
 * Image publique (−100 à 100) :
 * - variation par fait (sujet principal / écurie) ; `retourMensuel` : part de l'écart à la neutralité effacée chaque mois ;
 * - lue par : la valeur commerciale (× (1 + valeurCommerciale × image/100)), l'attrait pour les sponsors (+ attraitSponsor × image/100),
 *   la patience du conseil (+ patienceConseil × image/100 points), le choix des candidats (+ utiliteCandidat × image/100).
 */
export const IMAGE = {
  retourMensuel: 0.06,
  valeurCommerciale: 0.3,
  attraitSponsor: 0.12,
  patienceConseil: 4,
  utiliteCandidat: 0.15,
};

/** Variation d'image par type de fait : [personne principale, écurie]. Le signe porte le sens (une critique publique abîme son auteur). */
export const IMAGE_PAR_FAIT: Record<string, [number, number]> = {
  // D-150 : gains des victoires et des titres réduits (le porteur les jugeait trop positifs).
  'gp.victoire': [1, 0.5],
  'gp.victoire_surprise': [3, 2],
  'gp.podium': [0.3, 0.2],
  'titre.pilotes': [8, 3],
  'titre.constructeurs': [0, 6],
  'personnel.soutien': [1.5, 0.5], // public seulement
  'personnel.felicitations': [1, 0.3],
  'personnel.critique': [-4, -1.5], // public seulement : l'auteur et son écurie
  'pilote.titularisation': [2, 1.5], // un jeune lancé
  'contrat.licenciement': [-1, -2],
  'contrat.demission': [0, -2],
  'conseil.licenciement_tp': [0, -2],
  'conseil.licenciement_joueur': [0, -2],
  'finances.crise': [0, -5],
  'proprietaire.sauvetage': [0, -2],
  'record.battu': [6, 3],
};

/**
 * Scandales (faits privés graves révélés, strictement professionnels et issus de la simulation, D-149 question 3) :
 * gravité par type de fait révélé (0 à 1) ; image = −imageMax × gravité (personne mise en cause et écurie) ;
 * sponsors soucieux de leur image (prestige, popularité) : satisfaction − satisfactionMax × gravité.
 */
export const SCANDALES: Record<string, number> = {
  'promesse.rompue': 1,
  'marche.offre': 0.6, // débauchage déloyal
  'finances.tension': 0.5,
  'finances.coupe_budget': 0.3,
  'personnel.critique': 0.5,
  'contrat.licenciement': 0.4,
  'politique.lobbying': 0.7,
  'contrat.depart_refuse': 0.3,
};
export const SCANDALE = { imageMax: 15, satisfactionMax: 25, imagesSponsorsSensibles: ['prestige', 'popularite'] };

/**
 * Exposition médiatique (0 à 100) : + parArticle × importance pour chaque article qui cite la personne ; − retourMensuel (part) chaque mois.
 * Lue par la popularité : cible + popularite × exposition / 100 (points de popularité).
 */
/** Audit 10.14 : sous ce seuil (valeur absolue), l'image ou l'exposition revient à zéro (sinon l'arrondi la figeait). */
export const RETOUR_ZERO_SEUIL = 1;
export const EXPOSITION = { parArticle: 2, retourMensuel: 0.25, popularite: 8 };

/**
 * Rumeurs (tabloïd et presse peu fiable) :
 * - d'un fait suivi (phase 8c) déjà déformé dans le paddock : probabilité hebdomadaire = appetit × intérêt × faitSuivi ; la rumeur est « vraie » (exagérée) ;
 * - de transfert, pendant la fenêtre du marché : probabilité hebdomadaire = appetit × transfert ; vraie si une offre existe vraiment, sinon fausse ;
 * - effet : exposition des sujets ; une rumeur fausse n'a pas d'autre effet (le joueur ne sait pas laquelle est vraie).
 */
export const RUMEURS_MEDIAS = { faitSuivi: 0.08, transfert: 0.35, partVraieCible: 0.5 };

/**
 * Conférences de presse :
 * - probaGP : probabilité, la semaine d'un Grand Prix, qu'une écurie soit interrogée ; probaApresFait : après un fait marquant qui la concerne ;
 * - delaiSemaines : temps laissé au joueur pour répondre ; sans réponse, le service de communication esquive ;
 * - objectifTitreRangAttendu : « viser le titre » fixe l'exigence du conseil à ce rang pour la saison ;
 * - rangRivalMax : une écurie jusqu'à ce rang au championnat peut être interrogée sur son rival direct (celle qui la précède) ;
 * - effets d'image par réponse (team principal et écurie).
 */
export const CONFERENCES = { probaGP: 0.15, probaApresFait: 0.6, delaiSemaines: 2, objectifTitreRangAttendu: 2, rangRivalMax: 8 };
export const IMAGE_PAR_REPONSE: Record<string, [number, number]> = {
  soutenir: [1.5, 0.5],
  mettre_pression: [-1, 0],
  viser_titre: [1, 1],
  prudence: [0, 0],
  assumer: [3, 4],
  nier: [-2, -1],
  attaquer_rival: [-1.5, 0],
  respecter: [1, 0.5],
  critiquer_federation: [0, 0],
  soutenir_federation: [0.5, 0],
  esquiver: [0, 0],
};

/**
 * Archives : un record de victoires ou de podiums n'est annoncé qu'à partir de `victoiresMin` ; les records comptés depuis 2027 ne sont annoncés
 * qu'après `saisonsMinAnnonce` saisons simulées (avant, « record » ne veut rien dire).
 */
export const ARCHIVES = { victoiresMin: 5, saisonsMinAnnonce: 5 };

/**
 * D-150 — lassitude du public envers ceux qui gagnent tout (« comme en vrai ») :
 * - `titresSaturation` : après autant de titres consécutifs (pilote, ou écurie aux constructeurs), une victoire n'améliore plus l'image ;
 *   avant, son gain est réduit en proportion (gain × (1 − titres consécutifs / titresSaturation)) ;
 * - `seuilErosion` : à partir de ce nombre de titres consécutifs, l'image s'érode en fin de saison de `erosionParTitre` × (titres − seuil + 1) points ;
 * - mêmes règles pour toutes les écuries et tous les pilotes (joueur compris).
 */
export const LASSITUDE_PUBLIC = { titresSaturation: 3, seuilErosion: 2, erosionParTitre: 6 };
