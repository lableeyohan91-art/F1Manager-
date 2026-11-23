/**
 * Phase 7a — marché des transferts des pilotes titulaires (docs/systemes/phase-7-marche-du-travail.md, D-116, D-117).
 *
 * - Fenêtre principale (semaines 26 à 48) : tous les deux semaines, les personnes répondent aux offres reçues, puis les écuries
 *   (IA) font de nouvelles offres d'après leur plan de personnel. Le joueur passe par les mêmes commandes, validées par les mêmes règles.
 * - Offres concurrentes : la personne compare toutes ses offres (utilité de la phase 4) ; jusqu'à trois tours de contre-offres.
 * - Débauchage : un pilote sous contrat à la date de début s'obtient en versant sa clause de rachat, ou l'indemnité exigée par son écurie.
 *   Son employeur peut contre-attaquer (prolonger et augmenter). Un affilié d'académie se rachète aussi (levée de l'option prioritaire).
 * - Pré-accords : contrats qui commencent l'année suivante, ou celle d'après. Ils restent « signés » jusqu'à la semaine 50 de l'année
 *   qui précède leur début, où ils prennent effet (activerContratsSignes, appelée par les fins de contrat).
 * Le remplacement provisoire D-066 (pourvoirPostes) ne sert plus que de filet de sécurité en semaine 50.
 */

import { causesConnues, dernierFait } from '../humain/causes';
import { AGE_MINIMAL_F1 } from '../../balance/carriere';
import { PRIME_CONTINUITE, SEMAINE_FIN_CONTRATS } from '../../balance/contrats';
import { CANDIDATURES, DEPART_GROUPE, PERSONNEL_MARCHE, RACHAT, CONTRE_ATTAQUE, FENETRE, HORIZON, INERTIE_CONTRAT, OFFRE_MARCHE, PLAN_MARCHE, PREDATEUR, TOURS_MARCHE } from '../../balance/marche';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement, type Evenement } from '../../core/evenements';
import { nouvelIdentifiant } from '../../core/identifiants';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal, type Systeme } from '../../core/moteur';
import { TABLES, type Contrat, type Departement, type Ecurie, type Finances, type OffreMarche, type Personne, type Poste } from '../../model/types';
import { potentielEstime } from '../carriere/estimation';
import { changerMetier } from '../carriere/profil';
import { lireEvenement } from '../memoire';
import { ecuriesActives } from '../saison/performance';
import { affiliationDe } from '../juniors/academies';
import { TABLE_PROMESSES, type Promesse } from '../humain/promesses';
import {
  age, contexteScore, ecurie, evaluerOffre, type ContexteScore, niveauMetier, repondre, scoreCandidat, teamPrincipal, texteRaisons, valeurMarche, type Offre,
} from '../humain/decision';
import { dureeMaxEffectif, lireConditions, motifRefusConseil, nombrePlaces, occupantsPour } from '../humain/effectifs';
import { candidatPour, contratEmploi, deciderProlongation, dureeContrat, liberer, nePasProlonger, proposerProlongation } from '../humain/contrats';
import { candidaturesSpontanees, commandeCandidature, planPersonnel } from './personnel';
import { apportCommercialPour, bonusPilotePayant, systemeCommercial, transfererSponsors } from './commercial';
import { PILOTES_PAYANTS } from '../../balance/commercial';
import { domainePoste, iaDecide } from '../joueur/acces';

const arrondi = (x: number) => Math.round(x * 10) / 10;
const POSTE_MARCHE: Poste = 'pilote_titulaire';
const NOMBRE_TITULAIRES = 2;
/** Phase 7b : postes ouverts au marché (pilotes titulaires et personnel technique et dirigeant). */
export const POSTES_MARCHE: readonly Poste[] = [POSTE_MARCHE, ...PERSONNEL_MARCHE.postes];
const estPilote = (poste: Poste) => poste === POSTE_MARCHE;

const personnes = (m: Monde) => Object.values(table(m, TABLES.personnes)) as unknown as Personne[];
// Performance (audit n°4) : tri par identifiant seulement là où l'ordre compte (prise d'effet), pas pour les recherches.
const contrats = (m: Monde) => Object.values(table(m, TABLES.contrats)) as unknown as Contrat[];
const contratsTries = (m: Monde) => idsTries(table(m, TABLES.contrats)).map((id) => table(m, TABLES.contrats)[id] as unknown as Contrat);
const finances = (m: Monde, idEcurie: string) => (Object.values(table(m, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === idEcurie);
const nom = (m: Monde, id: string) => {
  const p = table(m, TABLES.personnes)[id] as unknown as Personne | undefined;
  return p ? `${p.prenom} ${p.nom}` : (ecurie(m, id)?.nom ?? id);
};

/** Valeur de marché comme pilote titulaire (un jeune ou un réserviste vaut ce que vaut le poste qu'on lui offre). */
export function valeurTitulaire(monde: Monde, p: Personne): number {
  return p.poste === POSTE_MARCHE ? valeurMarche(monde, p) : valeurMarche(monde, { ...p, poste: POSTE_MARCHE });
}

/** Phase 7b : valeur de marché au poste visé. */
export function valeurAuPoste(monde: Monde, p: Personne, poste: Poste): number {
  return p.poste === poste ? valeurMarche(monde, p) : valeurMarche(monde, { ...p, poste });
}

/** Années consécutives après `depuis` pour lesquelles l'écurie a encore une place de titulaire (pour borner une prolongation). */
export function anneesLibres(monde: Monde, idEcurie: string, depuis: number, max = 5, personne?: string): number {
  return personne ? dureeMaxEffectif(monde, idEcurie, personne, POSTE_MARCHE, depuis, max) : dureeMaxEffectif(monde, idEcurie, '', POSTE_MARCHE, depuis, max);
}

export function offresMarche(monde: Monde): OffreMarche[] {
  const t = table(monde, TABLES.offres);
  return idsTries(t).map((id) => t[id] as unknown as OffreMarche);
}

export function enFenetre(monde: Monde): boolean {
  return monde.date.semaine >= FENETRE.debut && monde.date.semaine <= FENETRE.fin;
}

/** Contrat signé (pas encore commencé) d'une personne. */
export function contratSigne(monde: Monde, idPersonne: string): Contrat | undefined {
  return contrats(monde).find((c) => c.personne === idPersonne && c.type === 'emploi' && c.statut === 'signe');
}

/** Pilotes titulaires assurés pour une saison donnée : contrats en cours qui la couvrent, plus contrats signés (règle commune, audit n°3). */
export function titulairesPour(monde: Monde, idEcurie: string, annee: number): string[] {
  return occupantsPour(monde, idEcurie, POSTE_MARCHE, annee);
}

/** Places de titulaire encore à pourvoir pour une saison (sans compter les offres en attente). */
export function besoinsPour(monde: Monde, idEcurie: string, annee: number): number {
  return Math.max(0, NOMBRE_TITULAIRES - titulairesPour(monde, idEcurie, annee).length);
}

/** Nombre d'offres simultanées en attente permises par le département recrutement. */
export function approchesMax(monde: Monde, idEcurie: string): number {
  const dep = (Object.values(table(monde, TABLES.departements)) as unknown as Departement[]).find((d) => d.ecurie === idEcurie && d.type === 'recrutement');
  return PLAN_MARCHE.approchesBase + Math.round((PLAN_MARCHE.approchesParNiveau * (dep?.niveauMoyen ?? 10)) / 20);
}

/** Indemnité exigée par une écurie pour libérer un pilote sous contrat (sans clause de rachat). */
export function indemniteExigee(monde: Monde, c: Contrat, acheteur: Ecurie, debut: number): number {
  const restant = Math.max(1, c.fin - debut + 1);
  const coequipiers = contrats(monde).filter((x) => x.type === 'emploi' && x.statut === 'actif' && x.organisation === c.organisation && x.poste === POSTE_MARCHE && x.personne !== c.personne);
  const p = table(monde, TABLES.personnes)[c.personne] as unknown as Personne;
  // Majoration « meilleur pilote » pour les pilotes ; un responsable est toujours le seul à son poste : majoration appliquée.
  const meilleur = c.poste !== POSTE_MARCHE || coequipiers.every((x) => niveauMetier(table(monde, TABLES.personnes)[x.personne] as unknown as Personne) <= niveauMetier(p));
  const majoration = 1 + (meilleur ? RACHAT.majorationMeilleur : 0) + RACHAT.majorationParPointPredateur * (acheteur.reputationPredateur ?? 0);
  return arrondi(Math.max(RACHAT.minimumMEUR, c.salaireMEUR * restant * RACHAT.multipleIndemnite * majoration));
}

export interface Disponibilite {
  indemniteMEUR: number;
  beneficiaire?: string;
  /** Vrai si la personne est encore sous contrat (ou affiliée) à la date de début : il s'agit d'un débauchage. */
  debauchage: boolean;
}

/** Une personne peut-elle signer avec cette écurie pour la saison `debut`, et à quel prix pour son employeur actuel ? */
/**
 * Performance (audit n°4, mesuré : le marché parcourait tous les contrats pour chaque candidat, chaque écurie et chaque tour) :
 * index des contrats courants par personne, construit une fois par tour de marché. Lecture seule : il n'est utilisé
 * que pour noter les candidats ; toute offre reste validée sur l'état réel par la commande.
 */
export interface IndexContrats { emploi: Map<string, Contrat>; signe: Set<string>; affiliation: Map<string, Contrat> }
export function indexerContrats(monde: Monde): IndexContrats {
  const idx: IndexContrats = { emploi: new Map(), signe: new Set(), affiliation: new Map() };
  for (const c of contrats(monde)) {
    if (c.type === 'emploi' && c.statut === 'actif') idx.emploi.set(c.personne, c);
    if (c.type === 'emploi' && c.statut === 'signe') idx.signe.add(c.personne);
    if (c.type === 'affiliation' && c.statut === 'actif') idx.affiliation.set(c.personne, c);
  }
  return idx;
}

export function disponibilite(monde: Monde, p: Personne, e: Ecurie, debut: number, idx?: IndexContrats, poste: Poste = POSTE_MARCHE): Disponibilite | string {
  if (p.statut === 'retraite') return 'Cette personne a pris sa retraite.';
  if (estPilote(poste)) {
    if (!p.poste.startsWith('pilote')) return 'Seul un pilote peut occuper un baquet de titulaire.';
    if (debut - p.anneeNaissance < AGE_MINIMAL_F1) return `Trop jeune pour la F1 à cette date (âge minimal ${AGE_MINIMAL_F1} ans).`;
  } else if (!candidatPour(p, poste)) return `Cette personne n’a pas le profil pour le poste de ${poste.replace(/_/g, ' ')}.`;
  if (idx ? idx.signe.has(p.id) : contratSigne(monde, p.id)) return 'Cette personne a déjà signé ailleurs pour la suite.';
  const c = idx ? idx.emploi.get(p.id) : contratEmploi(monde, p.id);
  if (c && c.organisation === e.id && p.poste === poste) return 'Déjà à ce poste dans l’écurie : passer par une prolongation.';
  if (c && c.organisation === e.id) return { indemniteMEUR: 0, debauchage: false }; // promotion interne
  if (c && c.organisation !== e.id && c.fin >= debut) {
    const vendeur = ecurie(monde, c.organisation);
    if (c.clauses.rachatMEUR !== undefined) return { indemniteMEUR: c.clauses.rachatMEUR, beneficiaire: c.organisation, debauchage: true };
    if (vendeur?.pilotee) return 'Sous contrat avec une écurie dirigée par un joueur, sans clause de rachat : son accord serait nécessaire.';
    return { indemniteMEUR: indemniteExigee(monde, c, e, debut), beneficiaire: c.organisation, debauchage: true };
  }
  const aff = idx ? idx.affiliation.get(p.id) : affiliationDe(monde, p.id);
  if (aff && aff.organisation !== e.id && aff.organisation !== e.ecuriePartenaire) {
    return { indemniteMEUR: arrondi(aff.clauses.rachatMEUR ?? Math.max(RACHAT.minimumMEUR, (aff.clauses.financementAnnuelMEUR ?? 0) * RACHAT.multipleAffiliation)), beneficiaire: aff.organisation, debauchage: true };
  }
  return { indemniteMEUR: 0, debauchage: false };
}

/**
 * Règles d'un engagement de pilote titulaire (audit n°3), communes à la création de l'offre et à sa signature :
 * nombres finis, durée entière, salaire validé après arrondi, disponibilité de la personne, effectif sur toute la durée,
 * trésorerie et état financier pour l'indemnité, arbitrage du conseil pour les engagements salariaux élevés.
 */
export function motifRefusEngagement(monde: Monde, e: Ecurie, p: Personne, salaireBrut: unknown, dureeBrute: unknown, debut: number, poste: Poste = POSTE_MARCHE, remplace?: string): string | null {
  const cond = lireConditions(salaireBrut, dureeBrute);
  if (typeof cond === 'string') return cond;
  const d = disponibilite(monde, p, e, debut, undefined, poste);
  if (typeof d === 'string') return d;
  // Effectif (audit n°3) ; phase 7b : la personne remplacée libère sa place.
  for (let y = debut; y < debut + cond.duree; y++) {
    if (occupantsPour(monde, e.id, poste, y).filter((id) => id !== p.id && id !== remplace).length >= nombrePlaces(poste)) return `Effectif complet : aucune place de ${poste.replace(/_/g, ' ')} libre en ${y}.`;
  }
  const fi = finances(monde, e.id);
  if (d.indemniteMEUR > 0 && fi && (fi.etatCrise === 'crise' || fi.etatCrise === 'administration')) return 'L’écurie est en difficulté financière : pas de débauchage possible.';
  if (d.indemniteMEUR > 0 && fi && fi.tresorerieMEUR < d.indemniteMEUR) return `Trésorerie insuffisante pour verser l’indemnité (${d.indemniteMEUR} M€).`;
  return estPilote(poste) ? motifRefusConseil(monde, e, p.id, cond.salaire, debut, debut + cond.duree - 1) : null;
}

/** Règles communes au joueur et à l'IA pour faire une offre (commande « marche.offre »). */
export function motifRefusOffre(monde: Monde, auteur: string, prm: Record<string, unknown>): string | null {
  const e = ecurie(monde, String(prm['ecurie'] ?? ''));
  if (!e || e.statut !== 'active') return 'Écurie inconnue.';
  const tp = teamPrincipal(monde, e.id);
  if (!tp || tp.id !== auteur) return 'Seul le team principal de l’écurie peut faire une offre.';
  if (!enFenetre(monde)) return `Le marché n’est ouvert que de la semaine ${FENETRE.debut} à la semaine ${FENETRE.fin}.`;
  const p = table(monde, TABLES.personnes)[String(prm['personne'] ?? '')] as unknown as Personne | undefined;
  if (!p) return 'Personne inconnue.';
  if (p.joueur) return 'Le manager du joueur n’est pas sur le marché.';
  const debut = prm['debut'];
  if (debut !== monde.date.annee + 1 && debut !== monde.date.annee + 2) return 'Un contrat commence la saison suivante, ou celle d’après (pré-accord).';
  if (prm['statutN1'] !== undefined && typeof prm['statutN1'] !== 'boolean') return 'Statut de n°1 : vrai ou faux.';
  const poste = (prm['poste'] ?? POSTE_MARCHE) as Poste;
  if (!POSTES_MARCHE.includes(poste)) return 'Poste non ouvert au marché.';
  if (prm['statutN1'] === true && !estPilote(poste)) return 'Le statut de n°1 ne concerne que les pilotes.';
  const remplace = prm['remplace'] === undefined ? undefined : String(prm['remplace']);
  if (remplace !== undefined) {
    if (estPilote(poste)) return 'Le remplacement d’un titulaire en place ne concerne que le personnel.';
    const cr = contratEmploi(monde, remplace);
    if (!cr || cr.organisation !== e.id || cr.poste !== poste) return 'La personne à remplacer n’occupe pas ce poste dans l’écurie.';
  }
  const refus = motifRefusEngagement(monde, e, p, prm['salaire'], prm['duree'], debut, poste, remplace);
  if (refus) return refus;
  const miennes = offresMarche(monde).filter((o) => o.ecurie === e.id && (o.statut === 'en_attente' || o.statut === 'contre_offre'));
  const existante = miennes.find((o) => o.personne === p.id);
  if (existante && existante.statut === 'en_attente') return 'Une offre est déjà en attente de réponse.';
  if (existante && existante.tour + 1 >= TOURS_MARCHE) return 'Dernier tour de négociation déjà joué.';
  if (!existante && miennes.length >= approchesMax(monde, e.id)) return 'Le département recrutement n’a plus de capacité d’approche disponible.';
  if (offresMarche(monde).some((o) => o.ecurie === e.id && o.personne === p.id && o.statut === 'refusee')) return 'Cette personne a déjà refusé une offre de l’écurie cette saison.';
  return null;
}

/** Crée l'offre (ou relance la négociation après une contre-offre). */
function enregistrerOffre(monde: Monde, auteur: string, prm: Record<string, unknown>): OffreMarche {
  const e = ecurie(monde, String(prm['ecurie'])) as Ecurie;
  const p = table(monde, TABLES.personnes)[String(prm['personne'])] as unknown as Personne;
  const debut = Number(prm['debut']);
  const poste = (prm['poste'] ?? POSTE_MARCHE) as Poste;
  const d = disponibilite(monde, p, e, debut, undefined, poste) as Disponibilite;
  const existante = offresMarche(monde).find((o) => o.ecurie === e.id && o.personne === p.id && o.statut === 'contre_offre');
  const o: OffreMarche = existante ?? {
    id: nouvelIdentifiant(monde, 'off'), ecurie: e.id, decideur: auteur, personne: p.id, poste, salaireMEUR: 0, dureeAnnees: 0, debut,
    statutN1: false, indemniteMEUR: 0, tour: -1, annee: monde.date.annee, semaine: 0, statut: 'en_attente',
  };
  const cond = lireConditions(prm['salaire'], prm['duree']) as { salaire: number; duree: number };
  o.salaireMEUR = cond.salaire;
  o.dureeAnnees = cond.duree;
  o.debut = debut;
  o.statutN1 = prm['statutN1'] === true;
  if (prm['remplace'] !== undefined) o.remplace = String(prm['remplace']);
  o.indemniteMEUR = d.indemniteMEUR;
  if (d.beneficiaire) o.beneficiaireIndemnite = d.beneficiaire;
  o.tour += 1;
  o.semaine = monde.date.semaine;
  o.statut = 'en_attente';
  delete o.salaireDemande;
  table(monde, TABLES.offres)[o.id] = o as unknown as Entite;
  // Jalon A : une offre répond souvent à une candidature spontanée de la personne auprès de cette écurie.
  const candidature = dernierFait(monde, (x) => x.type === 'marche.candidature' && x.acteurs.some((a) => a.id === p.id) && x.acteurs.some((a) => a.id === e.id && a.role === 'organisation'), 0);
  o.evenement = ajouterEvenement(monde, {
    type: 'marche.offre', acteurs: [{ id: p.id, role: 'personne' }, { id: auteur, role: 'auteur' }, { id: e.id, role: 'organisation' }], causes: causesConnues(monde, candidature),
    importance: d.debauchage ? 2 : 1, visibilite: 'prive',
    contexte: { offre: o.id, salaire: o.salaireMEUR, duree: o.dureeAnnees, debut, indemnite: o.indemniteMEUR, tour: o.tour },
  }).id;
  return o;
}

export const commandeOffre: DefinitionCommande = {
  type: 'marche.offre',
  valider: (monde, c) => motifRefusOffre(monde, c.auteur, c.parametres),
  appliquer({ monde }, c) {
    enregistrerOffre(monde, c.auteur, c.parametres);
  },
};

export const commandeRetirerOffre: DefinitionCommande = {
  type: 'marche.retirer_offre',
  valider(monde, c) {
    const o = table(monde, TABLES.offres)[String(c.parametres['offre'] ?? '')] as unknown as OffreMarche | undefined;
    if (!o) return 'Offre inconnue.';
    if (o.statut !== 'en_attente' && o.statut !== 'contre_offre') return 'Cette offre n’est plus en cours.';
    const tp = teamPrincipal(monde, o.ecurie);
    if (!tp || tp.id !== c.auteur) return 'Seul le team principal de l’écurie peut retirer son offre.';
    return null;
  },
  appliquer({ monde }, c) {
    (table(monde, TABLES.offres)[String(c.parametres['offre'])] as unknown as OffreMarche).statut = 'retiree';
  },
};

/* ===================================================================== Signature */

function verser(monde: Monde, de: string, a: string | undefined, montant: number): void {
  if (montant <= 0) return;
  const fd = finances(monde, de);
  if (fd) { fd.tresorerieMEUR -= montant; fd.comptes.indemnites += montant; }
  const fa = a ? finances(monde, a) : undefined;
  if (fa) { fa.tresorerieMEUR += montant; fa.comptes.transfertsRecus = (fa.comptes.transfertsRecus ?? 0) + montant; }
}

/** La personne accepte : contrat « signé » (prise d'effet en semaine 50 de l'année précédant son début), indemnité versée. */
function signer(monde: Monde, o: OffreMarche, p: Personne, raisons: string[], nbOffres: number): Evenement {
  const e = ecurie(monde, o.ecurie) as Ecurie;
  const ancien = contratEmploi(monde, p.id);
  const aff = affiliationDe(monde, p.id);
  verser(monde, e.id, o.beneficiaireIndemnite, o.indemniteMEUR);
  const debauche = o.indemniteMEUR > 0 && !!ancien && ancien.organisation === o.beneficiaireIndemnite;
  if (aff && o.beneficiaireIndemnite === aff.organisation && o.indemniteMEUR > 0) { aff.statut = 'rompu'; aff.motifFin = 'rachat'; }
  if (debauche) e.reputationPredateur = (e.reputationPredateur ?? 0) + PREDATEUR.parDebauchage;
  const c: Contrat = {
    id: nouvelIdentifiant(monde, 'ctr'), personne: p.id, organisation: e.id, type: 'emploi', poste: o.poste, debut: o.debut, fin: o.debut + o.dureeAnnees - 1,
    salaireMEUR: o.salaireMEUR, clauses: { ...(o.statutN1 ? { statutN1: true } : {}), rachatMEUR: arrondi(o.salaireMEUR * o.dureeAnnees * RACHAT.multiple) },
    statut: 'signe', verification: 'contrat simulé (marché 7)',
    ...(o.remplace ? { remplace: o.remplace } : {}),
    // Phase 7b (D-117) : un membre du personnel débauché sert une période de non-concurrence au début de son nouveau contrat.
    ...(debauche && !estPilote(o.poste) ? { nonConcurrenceSemaines: PERSONNEL_MARCHE.nonConcurrenceSemaines } : {}),
  };
  table(monde, TABLES.contrats)[c.id] = c as unknown as Entite;
  o.statut = 'acceptee';
  o.raisons = raisons;
  const evt = ajouterEvenement(monde, {
    type: 'marche.signature', acteurs: [{ id: p.id, role: 'personne' }, { id: o.decideur, role: 'auteur' }, { id: e.id, role: 'organisation' }, ...(o.beneficiaireIndemnite ? [{ id: o.beneficiaireIndemnite, role: 'cedant' }] : [])],
    // Jalon A : une signature ailleurs s'explique par ce qui poussait la personne à partir (nouveau défi, départ refusé, leader suivi…).
    importance: 3, visibilite: 'public', causes: causesConnues(monde, o.evenement, p.ecurie && p.ecurie !== e.id ? p.dernierFaitDepart : undefined),
    contexte: {
      contrat: c.id, offre: o.id, salaire: o.salaireMEUR, debut: o.debut, fin: c.fin, indemnite: o.indemniteMEUR, debauchage: debauche, offresConcurrentes: nbOffres, raisons,
      // D-131 : apport commercial net attendu par l'écurie au moment de la signature (mesure des recrutements motivés par l'argent).
      ...(estPilote(o.poste) ? { apportNet: Math.round(apportCommercialPour(monde, e, p, o.debut).netNouveau * 10) / 10 } : {}),
    },
    texte: `${nom(monde, p.id)} signe avec ${e.nom} comme ${o.poste.replace(/_/g, ' ')} à partir de ${o.debut} (${o.salaireMEUR} M€/an, jusqu'en ${c.fin})${o.indemniteMEUR > 0 ? ` ; indemnité de ${o.indemniteMEUR} M€ versée à ${nom(monde, o.beneficiaireIndemnite ?? '')}` : ''}.`,
  });
  // Un débauchage abîme les relations entre l'ancien employeur et l'acheteur, et avec le partant.
  if (debauche && ancien) {
    const tpAncien = teamPrincipal(monde, ancien.organisation);
    if (tpAncien) {
      lireEvenement(monde, tpAncien.id, o.decideur, 'conflit', evt.id, { facteur: 0.6 });
      lireEvenement(monde, tpAncien.id, p.id, 'perte', evt.id, { facteur: 0.5 });
    }
  }
  lireEvenement(monde, p.id, o.decideur, 'gratitude', evt.id, { facteur: 0.5 });
  for (const autre of offresMarche(monde)) {
    if (autre.personne === p.id && autre.id !== o.id && (autre.statut === 'en_attente' || autre.statut === 'contre_offre')) autre.statut = 'refusee';
  }
  return evt;
}

/* ===================================================================== Réponses des personnes */

function versOffre(o: OffreMarche): Offre {
  return { organisation: o.ecurie, decideur: o.decideur, poste: o.poste, salaireMEUR: o.salaireMEUR, dureeAnnees: o.dureeAnnees, promesses: o.statutN1 ? ['statut_n1'] : [], prolongation: false };
}

/** Utilité de rester (pilote sous contrat à la date de début) : son contrat actuel, vu comme une prolongation aux mêmes conditions. */
function utiliteRester(monde: Monde, p: Personne, c: Contrat): number {
  const tp = teamPrincipal(monde, c.organisation);
  return evaluerOffre(monde, p, { organisation: c.organisation, decideur: tp?.id ?? c.organisation, poste: c.poste, salaireMEUR: c.salaireMEUR, dureeAnnees: Math.max(1, c.fin - monde.date.annee), promesses: [], prolongation: true }).utilite;
}

/** Contre-attaque de l'employeur (IA) : il prolonge et augmente un pilote courtisé qu'il juge précieux. */
function contreAttaque(monde: Monde, p: Personne, c: Contrat, offres: OffreMarche[]): boolean {
  const e = ecurie(monde, c.organisation);
  if (!e || !iaDecide(e, domainePoste(c.poste)) || !POSTES_MARCHE.includes(c.poste)) return false;
  const tp = teamPrincipal(monde, e.id);
  if (!tp) return false;
  if (estPilote(c.poste)) {
    const coequipier = contrats(monde).find((x) => x.type === 'emploi' && x.statut === 'actif' && x.organisation === e.id && x.poste === POSTE_MARCHE && x.personne !== p.id);
    const niveauCoequipier = coequipier ? niveauMetier(table(monde, TABLES.personnes)[coequipier.personne] as unknown as Personne) : 0;
    // On se bat pour son meilleur pilote (ou un pilote presque aussi bon), pas pour celui qu'on remplacerait volontiers.
    if (niveauMetier(p) + PRIME_CONTINUITE.pilote < niveauCoequipier) return false;
  }
  // La prolongation ne peut pas empiéter sur des saisons où le poste est déjà promis à d'autres (pré-accords).
  const dureeMax = Math.min(dureeContrat(monde, p), dureeMaxEffectif(monde, e.id, p.id, c.poste, Math.max(c.fin, monde.date.annee)));
  if (dureeMax < 1) return false;
  const meilleure = Math.max(...offres.map((o) => o.salaireMEUR));
  const salaire = arrondi(Math.min(meilleure * CONTRE_ATTAQUE.surenchere, valeurAuPoste(monde, p, c.poste) * CONTRE_ATTAQUE.plafondValeur));
  if (salaire <= c.salaireMEUR) return false;
  const causes = offres.map((o) => o.id);
  let res = proposerProlongation(monde, c, tp.id, salaire, dureeMax, [], 0);
  if (res.issue === 'contre_offre' && res.salaireDemande !== undefined && res.salaireDemande <= valeurAuPoste(monde, p, c.poste) * CONTRE_ATTAQUE.plafondValeur) {
    res = proposerProlongation(monde, c, tp.id, res.salaireDemande, dureeMax, [], 1, [res.evenement.id]);
  }
  if (res.issue !== 'accord') return false;
  for (const o of offres) { o.statut = 'refusee'; o.raisons = ['+ a prolongé avec son écurie']; }
  ajouterEvenement(monde, { type: 'marche.contre_attaque', acteurs: [{ id: p.id, role: 'personne' }, { id: tp.id, role: 'auteur' }, { id: e.id, role: 'organisation' }], importance: 2, visibilite: 'public', causes: [res.evenement.id], contexte: { offres: causes, salaire } });
  return true;
}

/** Les personnes répondent aux offres reçues avant cette semaine (le délai laisse aux concurrents et à l'employeur le temps de réagir). */
function repondreAuxOffres(monde: Monde, cloture = false): void {
  const parPersonne = new Map<string, OffreMarche[]>();
  for (const o of offresMarche(monde)) {
    if (o.statut !== 'en_attente' || (o.annee === monde.date.annee && o.semaine >= monde.date.semaine)) continue;
    const l = parPersonne.get(o.personne) ?? [];
    l.push(o);
    parPersonne.set(o.personne, l);
  }
  for (const idP of [...parPersonne.keys()].sort()) {
    const p = table(monde, TABLES.personnes)[idP] as unknown as Personne | undefined;
    // Offres devenues caduques (retraite, signature ailleurs, place pourvue, trésorerie) : expirées.
    const valides = parPersonne.get(idP)!.filter((o) => {
      const e = ecurie(monde, o.ecurie);
      const ok = !!p && !!e && motifRefusOffreEnAttente(monde, o, p, e) === null;
      if (!ok) o.statut = 'expiree';
      return ok;
    });
    if (!p || valides.length === 0) continue;
    const actuel = contratEmploi(monde, p.id);
    const sousContrat = !!actuel && valides.some((o) => actuel.organisation !== o.ecurie && actuel.fin >= o.debut);
    if (sousContrat && actuel && contreAttaque(monde, p, actuel, valides)) continue;
    const rester = sousContrat && actuel ? utiliteRester(monde, p, actuel) : null;
    let meilleure: { o: OffreMarche; u: number; raisons: string[] } | null = null;
    for (const o of valides) {
      const offre = versOffre(o);
      const cle = `marche-${o.id}-${o.tour}`;
      const ev = evaluerOffre(monde, p, offre);
      const sousContratIci = !!actuel && actuel.organisation !== o.ecurie && actuel.fin >= o.debut;
      if (sousContratIci && rester !== null) {
        const bruit = tirageLocal(monde, 'decision', p.id, cle).normale(0, 0.04 + ((p.traits['temperament'] ?? 10) / 20) * 0.1);
        if (ev.ligneRouge?.sens !== 'refus' && ev.utilite - rester - INERTIE_CONTRAT + bruit >= 0) {
          if (!meilleure || ev.utilite > meilleure.u) meilleure = { o, u: ev.utilite, raisons: texteRaisons(ev.raisons) };
        } else { o.statut = 'refusee'; o.raisons = ['− préfère honorer son contrat actuel', ...texteRaisons(ev.raisons)]; }
        continue;
      }
      // Séance de clôture : réponse définitive (plus de contre-offre possible).
      const rep = repondre(monde, p, offre, cle, !cloture && o.tour + 1 < TOURS_MARCHE);
      if (rep.type === 'accepte') {
        if (!meilleure || ev.utilite > meilleure.u) meilleure = { o, u: ev.utilite, raisons: texteRaisons(rep.raisons) };
      } else if (rep.type === 'contre_offre') {
        o.statut = 'contre_offre';
        o.salaireDemande = rep.salaireDemande;
        o.raisons = texteRaisons(rep.raisons);
      } else {
        o.statut = 'refusee';
        o.raisons = texteRaisons(rep.raisons);
      }
    }
    if (meilleure) signer(monde, meilleure.o, p, meilleure.raisons, valides.length);
  }
}

/** Revalidation complète d'une offre en attente au moment de la signature (audit n°3) : mêmes règles que pour la faire, hors calendrier et capacité. */
function motifRefusOffreEnAttente(monde: Monde, o: OffreMarche, p: Personne, e: Ecurie): string | null {
  if (o.remplace) {
    const cr = contratEmploi(monde, o.remplace);
    if (!cr || cr.organisation !== e.id || cr.poste !== o.poste) return 'personne à remplacer partie';
  }
  const refus = motifRefusEngagement(monde, e, p, o.salaireMEUR, o.dureeAnnees, o.debut, o.poste, o.remplace);
  if (refus) return refus;
  const d = disponibilite(monde, p, e, o.debut, undefined, o.poste) as Disponibilite;
  o.indemniteMEUR = d.indemniteMEUR;
  if (d.beneficiaire) o.beneficiaireIndemnite = d.beneficiaire;
  return null;
}

/* ===================================================================== Plan de personnel de l'IA */

interface Cible { p: Personne; score: number; salaire: number; duree: number; indemnite: number; debauchage: boolean }

/** Vivier commun du tour : présélection sur l'opinion du paddock (niveau et potentiel estimé publics), pour borner le calcul. */
function vivier(monde: Monde): Personne[] {
  const notes = personnes(monde)
    .filter((p) => p.statut !== 'retraite' && p.poste.startsWith('pilote') && monde.date.annee + 1 - p.anneeNaissance >= AGE_MINIMAL_F1)
    .map((p) => ({ p, v: niveauMetier(p) + 0.5 * Math.max(0, potentielEstime(monde, null, p).centre - niveauMetier(p)) }))
    .sort((a, b) => b.v - a.v || (a.p.id < b.p.id ? -1 : 1));
  const sportifs = notes.slice(0, PLAN_MARCHE.vivier).map((x) => x.p);
  // D-131 : les pilotes qui apportent un soutien commercial réel (sponsors qui les suivent, engagement conditionnel) sont aussi examinés,
  // s'ils ont un niveau minimal. Ils ne sont pas préférés d'office : le score de recrutement pèse leur niveau ET leur apport.
  const pris = new Set(sportifs.map((p) => p.id));
  const soutenus = notes
    .filter((x) => !pris.has(x.p.id) && niveauMetier(x.p) >= PILOTES_PAYANTS.niveauMin
      && (!!x.p.engagementF1 || (Object.values(table(monde, TABLES.contratsSponsoring)) as unknown as { pilote?: string; statut: string }[]).some((c) => c.pilote === x.p.id && c.statut === 'actif')))
    .slice(0, PILOTES_PAYANTS.vivierSupplementaire)
    .map((x) => x.p);
  return [...sportifs, ...soutenus];
}

/** Score de marché : score de recrutement (phase 4/6) + pari sur la progression pendant le contrat − coût de l'indemnité. */
export function scoreMarche(monde: Monde, e: Ecurie, decideur: string, p: Personne, salaire: number, duree: number, indemnite: number, poste: Poste = POSTE_MARCHE, ctx?: ContexteScore): number {
  const base = scoreCandidat(monde, e, decideur, p, salaire, ctx).score;
  const progression = Math.max(0, Math.min(potentielEstime(monde, e.id, p).centre - niveauMetier(p), HORIZON.progressionParAn * duree));
  const budgetPoste = e.budgetMEUR * (estPilote(poste) ? 0.05 : PERSONNEL_MARCHE.partBudgetPoste);
  // Phase 7c : apport commercial d'un pilote (sponsors qui le suivent, budget familial d'un débutant) — pilotes payants (D-098).
  return base + (HORIZON.poids * progression) / 20 - 0.4 * (indemnite / Math.max(1, budgetPoste * duree)) + (estPilote(poste) ? bonusPilotePayant(monde, e, p, duree) : 0);
}

function salaireOffert(monde: Monde, e: Ecurie, tp: Personne | undefined, p: Personne): number {
  const audace = (tp?.traits['risque'] ?? 10) / 20;
  const budget = Math.min(1, e.budgetMEUR / 400);
  return valeurTitulaire(monde, p) * (OFFRE_MARCHE.min + (OFFRE_MARCHE.max - OFFRE_MARCHE.min) * (0.5 * audace + 0.5 * budget));
}

function ciblesPour(monde: Monde, e: Ecurie, tp: Personne, debut: number, liste: Personne[]): Cible[] {
  const res: Cible[] = [];
  const idx = indexerContrats(monde);
  const recues = Object.values(table(monde, TABLES.candidatures)) as unknown as { personne: string; ecurie: string }[];
  // Places libres de l'écurie : identiques pour tous les candidats (aucun n'en occupe encore), calculées une fois.
  const libres = anneesLibres(monde, e.id, debut - 1);
  if (libres < 1) return res;
  const ctx = contexteScore(monde, e, tp.id);
  for (const p of liste) {
    const d = disponibilite(monde, p, e, debut, idx);
    if (typeof d === 'string') continue;
    const salaire = salaireOffert(monde, e, tp, p);
    const duree = Math.min(Math.max(2, dureeContrat(monde, p)), libres);
    if (duree < 1) continue;
    // Phase 7c : un client proposé par son agent (ou une candidature) retient l'attention de l'écurie.
    const propose = recues.some((c) => c.personne === p.id && c.ecurie === e.id) ? CANDIDATURES.bonusScore : 0;
    res.push({ p, salaire, duree, indemnite: d.indemniteMEUR, debauchage: d.debauchage, score: scoreMarche(monde, e, tp.id, p, salaire, duree, d.indemniteMEUR, POSTE_MARCHE, ctx) + propose });
  }
  const f = tirageLocal(monde, 'marche.plan', e.id, monde.date.annee, monde.date.semaine);
  return res.map((c) => ({ ...c, score: c.score + f.normale(0, 0.02 + ((tp.traits['temperament'] ?? 10) / 20) * 0.03) })).sort((a, b) => b.score - a.score || (a.p.id < b.p.id ? -1 : 1));
}

type Commander = (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => { ok: true } | { ok: false; motif: string };

function planIA(monde: Monde, liste: Personne[], commander: Commander): void {
  const annee = monde.date.annee;
  for (const e of ecuriesActives(monde)) {
    if (!iaDecide(e, 'pilotes')) continue;
    const tp = teamPrincipal(monde, e.id);
    if (!tp) continue;
    const audace = (tp.traits['risque'] ?? 10) / 20;
    // 1. Contre-offres reçues : relancer si la demande reste raisonnable, sinon retirer.
    for (const o of offresMarche(monde).filter((x) => x.ecurie === e.id && x.statut === 'contre_offre')) {
      const p = table(monde, TABLES.personnes)[o.personne] as unknown as Personne;
      const plafond = valeurTitulaire(monde, p) * (OFFRE_MARCHE.plafondBase + OFFRE_MARCHE.plafondAudace * audace);
      const ok = o.salaireDemande !== undefined && o.salaireDemande <= plafond
        && commander({ type: 'marche.offre', auteur: tp.id, parametres: { ecurie: e.id, personne: o.personne, salaire: o.salaireDemande, duree: o.dureeAnnees, debut: o.debut, statutN1: o.statutN1 } }).ok;
      if (!ok) commander({ type: 'marche.retirer_offre', auteur: tp.id, parametres: { offre: o.id } });
    }
    // 2. Nouvelles offres, pour la saison suivante puis (pré-accords d'exception) celle d'après.
    const annees = monde.date.semaine >= PLAN_MARCHE.preAccordSemaineMin ? [annee + 1, annee + 2] : [annee + 1];
    for (const debut of annees) {
      const enCours = () => offresMarche(monde).filter((o) => o.ecurie === e.id && o.debut === debut && (o.statut === 'en_attente' || o.statut === 'contre_offre')).length;
      // Performance (audit de la phase 7, mesuré) : aucune signature n'a lieu pendant le plan, les places libres ne changent donc pas.
      const besoins = besoinsPour(monde, e.id, debut);
      if (besoins - enCours() <= 0) continue;
      // Promesse d'académie en cours : le jeune promis d'abord, dès qu'un baquet se libère avant l'échéance (6b-2).
      const promis = (Object.values(table(monde, TABLE_PROMESSES)) as unknown as Promesse[])
        .filter((x) => x.type === 'titularisation' && x.statut === 'en_cours' && x.organisation === e.id && debut <= x.echeance.annee)
        .map((x) => table(monde, TABLES.personnes)[x.beneficiaire] as unknown as Personne | undefined)
        .filter((p): p is Personne => !!p);
      for (const p of promis) {
        if (besoins - enCours() <= 0) break;
        const duree = Math.min(Math.max(2, dureeContrat(monde, p)), anneesLibres(monde, e.id, debut - 1));
        if (duree >= 1) commander({ type: 'marche.offre', auteur: tp.id, parametres: { ecurie: e.id, personne: p.id, salaire: arrondi(salaireOffert(monde, e, tp, p)), duree, debut } });
      }
      const cibles = ciblesPour(monde, e, tp, debut, liste);
      const meilleurLibre = cibles.find((c) => !c.debauchage)?.score ?? -Infinity;
      for (const c of cibles) {
        if (besoins - enCours() <= 0) break;
        if (c.debauchage && c.score < meilleurLibre + PLAN_MARCHE.ecartDebauchage) continue;
        if (debut === annee + 2) {
          // Pré-accord à deux saisons : réservé aux candidats d'exception, et rare.
          const rang = liste.indexOf(c.p);
          const dejaFaits = offresMarche(monde).filter((o) => o.ecurie === e.id && o.debut === annee + 2 && o.statut !== 'expiree' && o.statut !== 'retiree' && o.statut !== 'refusee').length;
          if (rang < 0 || rang >= PLAN_MARCHE.preAccordRang || dejaFaits >= PLAN_MARCHE.preAccordsParSaison) continue;
        }
        if (offresMarche(monde).some((o) => o.ecurie === e.id && o.personne === c.p.id && o.statut !== 'expiree' && o.statut !== 'retiree')) continue;
        const r = commander({ type: 'marche.offre', auteur: tp.id, parametres: { ecurie: e.id, personne: c.p.id, salaire: arrondi(c.salaire), duree: c.duree, debut } });
        if (!r.ok && /capacité/.test(r.motif)) break;
      }
    }
  }
}

/** Ouverture de la fenêtre : décisions de prolongation des titulaires dont le contrat finit cette année (IA), face au marché. */
function prolongationsTitulaires(monde: Monde, liste: Personne[]): void {
  const idx = indexerContrats(monde);
  for (const c of contratsTries(monde)) {
    if (c.statut !== 'actif' || c.type !== 'emploi' || c.poste !== POSTE_MARCHE || c.fin !== monde.date.annee || c.nonProlonge) continue;
    const e = ecurie(monde, c.organisation);
    if (!e || !iaDecide(e, 'pilotes')) continue;
    const tp = teamPrincipal(monde, e.id);
    if (!tp) continue;
    // Meilleur remplaçant accessible sur le marché (libres, fins de contrat, jeunes) : niveau, plus le pari sur sa progression.
    const remplacant = Math.max(0, ...liste
      .filter((p) => { if (p.id === c.personne) return false; const d = disponibilite(monde, p, e, monde.date.annee + 1, idx); return typeof d !== 'string' && d.indemniteMEUR === 0; })
      .filter((p) => valeurTitulaire(monde, p) <= e.budgetMEUR * 0.06)
      .map((p) => niveauMetier(p) + HORIZON.poids * Math.max(0, Math.min(potentielEstime(monde, e.id, p).centre - niveauMetier(p), HORIZON.progressionParAn * 2))));
    // Les baquets de l'an prochain sont déjà tous promis (pré-accords) : pas de prolongation possible.
    const dureeMax = anneesLibres(monde, e.id, monde.date.annee);
    if (dureeMax < 1) { nePasProlonger(monde, c, tp.id, 'baquets de la saison prochaine déjà attribués'); continue; }
    deciderProlongation(monde, c, tp, remplacant, dureeMax);
  }
}

/* ===================================================================== Prise d'effet (semaine 50) */

/** Contrats signés qui commencent l'an prochain : la personne quitte son employeur (fin ou rachat) et rejoint sa nouvelle écurie. */
export function activerContratsSignes(monde: Monde): void {
  // Audit n°5 : sans effet hors de la semaine de prise d'effet (appel en double ou à contretemps après une reprise).
  if (monde.date.semaine < SEMAINE_FIN_CONTRATS) return;
  const annee = monde.date.annee;
  for (const c of contratsTries(monde)) {
    if (c.type !== 'emploi' || c.statut !== 'signe' || c.debut !== annee + 1) continue;
    const p = table(monde, TABLES.personnes)[c.personne] as unknown as Personne | undefined;
    const e = ecurie(monde, c.organisation);
    if (!p || !e || p.statut === 'retraite' || e.statut !== 'active') { c.statut = 'rompu'; c.motifFin = 'demission'; continue; }
    for (const x of contrats(monde)) {
      if (x.personne !== p.id || x.type !== 'emploi' || x.statut !== 'actif') continue;
      if (x.fin > annee && x.organisation !== c.organisation) { x.statut = 'rompu'; x.motifFin = 'rachat'; }
      else { x.statut = 'termine'; x.motifFin = 'echeance'; }
    }
    const ancienne = p.ecurie;
    const ancienPoste = p.poste;
    // Phase 7b : la personne remplacée est libérée (licenciement, indemnité versée par le paiement centralisé).
    if (c.remplace) {
      const pr = table(monde, TABLES.personnes)[c.remplace] as unknown as Personne | undefined;
      const cr = pr ? contratEmploi(monde, pr.id) : undefined;
      if (pr && cr && cr.organisation === e.id && cr.poste === c.poste) liberer(monde, pr, cr, 'licenciement');
    }
    // Phase 7b : non-concurrence d'une personne débauchée (D-117 : 6 mois).
    if (c.nonConcurrenceSemaines) p.nonConcurrenceJusqua = { annee: c.debut, semaine: c.nonConcurrenceSemaines };
    // Phase 7b : départ en groupe d'un responsable technique influent débauché (D-077).
    if (c.nonConcurrenceSemaines && ancienne && ancienne !== e.id) departEnGroupe(monde, p, ancienne, e.id);
    p.statut = 'actif';
    p.ecurie = e.id;
    delete p.junior;
    delete p.libreDepuis;
    if (ancienPoste !== c.poste) changerMetier(p, c.poste, tirageLocal(monde, 'carriere.metier', p.id, annee), age(monde, p));
    c.statut = 'actif';
    if (c.poste === POSTE_MARCHE) transfererSponsors(monde, p); // phase 7c : le sponsor accompagnant suit son pilote
    ajouterEvenement(monde, {
      type: 'recrutement', acteurs: [{ id: p.id, role: 'personne' }, { id: e.id, role: 'organisation' }, ...(ancienne ? [{ id: ancienne, role: 'ancienne' }] : [])],
      // Jalon A : l'arrivée s'explique par la signature conclue pendant la fenêtre du marché.
      importance: 3, visibilite: 'public', causes: causesConnues(monde, dernierFait(monde, (x) => x.type === 'marche.signature' && x.contexte['contrat'] === c.id, 3)),
      contexte: { contrat: c.id, poste: c.poste, salaire: c.salaireMEUR, marche: true, ancienneEcurie: ancienne || null },
      texte: `${nom(monde, p.id)} rejoint ${e.nom}${ancienne && ancienne !== e.id ? ` (en provenance de ${nom(monde, ancienne)})` : ''}.`,
    });
  }
}

/** Départ en groupe : l'influence (leadership, gestion humaine) d'un responsable technique entraîne une partie de son département. */
function departEnGroupe(monde: Monde, p: Personne, ancienne: string, nouvelle: string): void {
  const type = p.poste === 'responsable_aero' ? 'aero' : p.poste === 'responsable_conception' || p.poste === 'directeur_technique' ? 'conception' : null;
  if (!type) return;
  const influence = ((p.competences['leadership'] ?? 10) + (p.competences['gestionHumaine'] ?? 10)) / 40;
  if (influence < DEPART_GROUPE.seuilInfluence) return;
  const deps = Object.values(table(monde, TABLES.departements)) as unknown as Departement[];
  const ancien = deps.find((d) => d.ecurie === ancienne && d.type === type);
  const nouveau = deps.find((d) => d.ecurie === nouvelle && d.type === type);
  if (!ancien || !nouveau) return;
  const perte = Math.round(DEPART_GROUPE.niveauMax * influence * 10) / 10;
  ancien.niveauMoyen = Math.max(1, Math.round((ancien.niveauMoyen - perte) * 10) / 10);
  nouveau.niveauMoyen = Math.min(20, Math.round((nouveau.niveauMoyen + perte / 2) * 10) / 10);
  ajouterEvenement(monde, {
    type: 'personnel.depart_groupe', acteurs: [{ id: p.id, role: 'personne' }, { id: ancienne, role: 'ancienne' }, { id: nouvelle, role: 'organisation' }],
    importance: 2, visibilite: 'public', contexte: { departement: type, perte },
    texte: `Des ingénieurs suivent ${nom(monde, p.id)} chez ${nom(monde, nouvelle)}.`,
  });
}

/** Fin de saison : offres effacées (volume borné), réputation de prédateur qui s'efface. */
export function clotureMarche(monde: Monde): void {
  const t = table(monde, TABLES.offres);
  for (const id of Object.keys(t)) delete t[id];
  const tc = table(monde, TABLES.candidatures);
  for (const id of Object.keys(tc)) delete tc[id];
  for (const e of ecuriesActives(monde)) if (e.reputationPredateur) e.reputationPredateur = Math.round(e.reputationPredateur * PREDATEUR.inertie * 1000) / 1000 || undefined;
}

/** Clôture de la fenêtre : réponses définitives aux offres en attente, puis expiration notifiée de celles qui restent. */
export function cloturerFenetre(monde: Monde): void {
  repondreAuxOffres(monde, true);
  for (const o of offresMarche(monde)) {
    if (o.statut !== 'en_attente' && o.statut !== 'contre_offre') continue;
    o.statut = 'expiree';
    ajouterEvenement(monde, {
      type: 'marche.offre_expiree', acteurs: [{ id: o.personne, role: 'personne' }, { id: o.decideur, role: 'auteur' }, { id: o.ecurie, role: 'organisation' }],
      importance: 1, visibilite: 'prive', contexte: { offre: o.id, salaire: o.salaireMEUR, debut: o.debut, salaireDemande: o.salaireDemande ?? null },
      texte: `La fenêtre de transferts se ferme : l'offre de ${nom(monde, o.ecurie)} à ${nom(monde, o.personne)} expire sans accord.`,
    });
  }
}

export const systemeMarche: Systeme = {
  nom: 'marche.transferts',
  executer({ monde, date, commanderIA }) {
    if (date.semaine === FENETRE.cloture) { cloturerFenetre(monde); return; }
    if (date.semaine < FENETRE.debut || date.semaine > FENETRE.fin || (date.semaine - FENETRE.debut) % FENETRE.pas !== 0) return;
    const liste = vivier(monde);
    if (date.semaine === FENETRE.debut) prolongationsTitulaires(monde, liste);
    repondreAuxOffres(monde);
    if (date.semaine === CANDIDATURES.semaine) candidaturesSpontanees(monde, (c) => commanderIA(c));
    planIA(monde, liste, (c) => commanderIA(c));
    planPersonnel(monde, (c) => commanderIA(c));
  },
};

export function installerMarche<M extends { ajouterSysteme(s: Systeme): M; commandes: { enregistrer(d: DefinitionCommande): unknown } }>(moteur: M): M {
  moteur.ajouterSysteme(systemeMarche);
  moteur.ajouterSysteme(systemeCommercial); // phase 7c
  moteur.commandes.enregistrer(commandeOffre);
  moteur.commandes.enregistrer(commandeCandidature);
  moteur.commandes.enregistrer(commandeRetirerOffre);
  return moteur;
}
