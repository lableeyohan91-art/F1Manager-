/**
 * Décisions humaines par utilité (phase 4, §5) : valeur de marché, évaluation d'une offre par un salarié,
 * évaluation d'un candidat par une écurie. Chaque décision garde ses principales raisons (« Pourquoi ? »).
 *
 * Anti-double comptage (D-070) : les souvenirs n'entrent qu'à travers les relations ; le moral n'entre pas.
 */

import { COMPETENCES_TRANSVERSALES, courbeAge } from '../../balance/personnages';
import { CROISSANCE_SALAIRE_PAR_POINT, PENALITE_AGE_RECRUTEMENT, PENALITE_BAISSE_SALAIRE, PRIME_PALMARES, RETOUR_APRES_DEPART, SALAIRE_REFERENCE_MEUR, UTILITE, VALEUR_MARCHE } from '../../balance/contrats';
import { idsTries, table, type Monde } from '../../core/monde';
import { tirageLocal } from '../../core/moteur';
import { TABLES, type Carriere, type Contrat, type Ecurie, type Palmares, type Personne, type Saison } from '../../model/types';
import { relation, souvenirsDe } from '../memoire';
import { ecuriesActives, indiceMoyen, niveauPilote } from '../saison/performance';
import { reputation, TABLE_PROMESSES, type Promesse, type TypePromesse } from './promesses';
import { PROMOTION_AFFILIE, REPUTATION_RECRUTEMENT_F1 } from '../../balance/juniors';
import { potentielEstime } from '../carriere/estimation';
import { AGENTS } from '../../balance/commercial';
import { agentDe } from '../marche/commercial';
import { ATTRAIT_POSTE_SUPERIEUR, LASSITUDE_PERSONNEL, LASSITUDE_PILOTE, PREDATEUR, RANG_POSTE, USURE_SUCCES } from '../../balance/marche';
import { utiliteImage } from '../medias/acces';

const borner = (x: number, min = -1, max = 1) => Math.min(max, Math.max(min, x));

export interface Raison {
  libelle: string;
  contribution: number;
}

/** Niveau métier (1–20) : niveau pilote pour les pilotes, moyenne des compétences du métier sinon. */
export function niveauMetier(p: Personne): number {
  if (p.poste.startsWith('pilote')) return niveauPilote(p, false);
  const v = Object.entries(p.competences).filter(([c]) => !(COMPETENCES_TRANSVERSALES as readonly string[]).includes(c)).map(([, x]) => x);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 10;
}

export function age(monde: Monde, p: Personne): number {
  return monde.date.annee - p.anneeNaissance;
}

/** Force sportive d'une écurie (0 = dernière, 1 = première) : dernier classement constructeurs, sinon indice voiture. */
export function forceEcurie(monde: Monde, idEcurie: string): number {
  const saisons = (Object.values(table(monde, TABLES.saisons)) as unknown as Saison[]).filter((s) => s.termine).sort((a, b) => b.annee - a.annee);
  const derniere = saisons[0];
  if (derniere) {
    const i = derniere.constructeurs.findIndex((c) => c.ecurie === idEcurie);
    if (i >= 0) return derniere.constructeurs.length > 1 ? 1 - i / (derniere.constructeurs.length - 1) : 1;
  }
  const classement = ecuriesActives(monde).map((e) => [e.id, indiceMoyen(monde, e)] as const).sort((a, b) => b[1] - a[1]);
  const i = classement.findIndex(([id]) => id === idEcurie);
  return classement.length > 1 && i >= 0 ? 1 - i / (classement.length - 1) : 0.5;
}

/** Valeur de marché annuelle (M€) : niveau métier, âge et courbe du métier, potentiel restant. */
export function valeurMarche(monde: Monde, p: Personne): number {
  const ref = SALAIRE_REFERENCE_MEUR[p.poste] ?? 1;
  const niveau = niveauMetier(p);
  const a = age(monde, p);
  const courbe = courbeAge(p.poste);
  let facteurAge = 1;
  if (a > courbe.declinApres) facteurAge = Math.max(0.4, 1 - 0.08 * (a - courbe.declinApres));
  // Phase 6a : l'opinion du paddock sur le potentiel, jamais le vrai potentiel caché.
  else if (a < courbe.progressionJusqua) facteurAge = 1 + 0.03 * Math.max(0, potentielEstime(monde, null, p).centre - niveau);
  const titres = (Object.values(table(monde, TABLES.palmares)) as unknown as Palmares[]).filter((x) => x.championPilote === p.id).length;
  const palmares = 1 + Math.min(PRIME_PALMARES.plafond, PRIME_PALMARES.parTitre * titres);
  return borner(ref * Math.pow(CROISSANCE_SALAIRE_PAR_POINT, niveau - 15) * facteurAge * palmares, VALEUR_MARCHE.min, VALEUR_MARCHE.max);
}

export function ecurie(monde: Monde, id: string): Ecurie | undefined {
  return table(monde, TABLES.ecuries)[id] as unknown as Ecurie | undefined;
}

/** Années passées sous contrat avec une organisation (contrats + carrière des données). */
/**
 * Index des contrats et des carrières par personne, posé seulement pendant un passage de masse (performance, phase 8d) ; mêmes éléments,
 * même ordre que le parcours de la table. Les appelants le retirent à la fin de leur passage.
 */
export const indexAnciennete = new WeakMap<Monde, { contrats: Map<string, Contrat[]>; carrieres: Map<string, Carriere[]> }>();
export function indexerAnciennete(monde: Monde): void {
  const contrats = new Map<string, Contrat[]>(), carrieres = new Map<string, Carriere[]>();
  for (const c of Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]) (contrats.get(c.personne) ?? contrats.set(c.personne, []).get(c.personne)!).push(c);
  for (const c of Object.values(table(monde, TABLES.carrieres)) as unknown as Carriere[]) (carrieres.get(c.personne) ?? carrieres.set(c.personne, []).get(c.personne)!).push(c);
  indexAnciennete.set(monde, { contrats, carrieres });
}

export function anneesDans(monde: Monde, p: Personne, organisation: string): number {
  const idx = indexAnciennete.get(monde);
  const contrats = (idx ? idx.contrats.get(p.id) ?? [] : (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[])).filter((c) => c.personne === p.id && c.organisation === organisation);
  const carriere = (idx ? idx.carrieres.get(p.id) ?? [] : (Object.values(table(monde, TABLES.carrieres)) as unknown as Carriere[])).filter((c) => c.personne === p.id && c.ecurieLignee === organisation);
  const annees = new Set<number>();
  for (const c of contrats) for (let y = c.debut; y <= Math.min(c.fin, monde.date.annee); y++) annees.add(y);
  for (const c of carriere) for (let y = c.de; y <= c.a; y++) annees.add(y);
  return annees.size;
}

/** Écurie formatrice : la première de la carrière connue. */
export function ecurieFormatrice(monde: Monde, p: Personne): string | undefined {
  const c = (Object.values(table(monde, TABLES.carrieres)) as unknown as Carriere[]).filter((x) => x.personne === p.id).sort((a, b) => a.de - b.de)[0];
  return c?.ecurieLignee;
}

export interface Offre {
  organisation: string;
  /** Personne qui décide au nom de l'organisation (team principal). */
  decideur: string;
  poste: Personne['poste'];
  salaireMEUR: number;
  dureeAnnees: number;
  promesses: TypePromesse[];
  /** Vrai s'il s'agit de prolonger avec l'employeur actuel. */
  prolongation: boolean;
}

export interface Evaluation {
  utilite: number;
  raisons: Raison[];
  /** Ligne rouge déclenchée (refus ou acceptation absolus), avec son libellé. */
  ligneRouge?: { sens: 'refus' | 'acceptation'; libelle: string };
}

function poidsValeur(p: Personne, v: string): number {
  const n = p.valeurs[v] ?? 10;
  // Tout le monde tient un minimum à l'argent et à l'équité, même ceux pour qui ce n'est pas une valeur forte.
  const socle = v === 'argent' || v === 'equite' ? UTILITE.socleArgentEquite : 0;
  return (socle + n / 20) * (n >= UTILITE.seuilConviction ? UTILITE.multiplicateurConviction : 1);
}

/** Souvenir fort de trahison ou d'humiliation envers une organisation ou son dirigeant. */
function aEteTrahiPar(monde: Monde, p: Personne, organisation: string, decideur: string): boolean {
  return souvenirsDe(monde, p.id).some((s) => (s.cible === organisation || s.cible === decideur) && ['trahison', 'humiliation', 'promesse_rompue'].includes(s.etiquette) && s.intensite > 0.25);
}

/** Lignes rouges situationnelles (D-067) : seulement pour une valeur ≥ 19 chez une personne qui se remet peu en question. */
export function ligneRouge(monde: Monde, p: Personne, o: Offre): Evaluation['ligneRouge'] {
  // Audit des phases 10–11 (cause des départs répétés de la chronique) : on ne revient pas aussitôt dans l'écurie qu'on vient de quitter
  // (départ à l'amiable, démission, licenciement, non-prolongation) ; avant, le recrutement d'urgence la réembauchait la même semaine.
  const d = p.dernierDepart;
  if (d && d.organisation === o.organisation && monde.date.annee - d.annee <= RETOUR_APRES_DEPART.saisons) return { sens: 'refus', libelle: 'vient de quitter cette écurie' };
  if ((p.traits['remiseEnQuestion'] ?? 10) > UTILITE.remiseEnQuestionMaxLigneRouge) return undefined;
  const fort = (v: string) => (p.valeurs[v] ?? 0) >= UTILITE.seuilLigneRouge;
  const valeur = valeurMarche(monde, p);
  if (fort('equite') && aEteTrahiPar(monde, p, o.organisation, o.decideur)) return { sens: 'refus', libelle: 'ne travaille jamais pour ceux qui l’ont trahi' };
  if (fort('argent') && o.salaireMEUR < 0.95 * valeur) return { sens: 'refus', libelle: 'ne signe jamais sous sa valeur' };
  if (fort('victoire') && forceEcurie(monde, o.organisation) < 0.3) return { sens: 'refus', libelle: 'refuse une écurie sans ambition sportive' };
  if (fort('stabilite') && o.dureeAnnees <= 1) return { sens: 'refus', libelle: 'refuse les contrats d’un an' };
  if (fort('fidelite') && o.prolongation && !aEteTrahiPar(monde, p, o.organisation, o.decideur) && o.salaireMEUR >= 0.7 * valeur) return { sens: 'acceptation', libelle: 'reste fidèle à son écurie' };
  if (fort('racines') && ecurieFormatrice(monde, p) === o.organisation && o.salaireMEUR >= 0.6 * valeur) return { sens: 'acceptation', libelle: 'veut finir sa carrière dans son écurie formatrice' };
  return undefined;
}

/** Utilité d'une offre pour la personne, avec ses raisons. */
export function evaluerOffre(monde: Monde, p: Personne, o: Offre): Evaluation {
  const raisons: Raison[] = [];
  const ajouter = (libelle: string, x: number) => { if (Math.abs(x) > 1e-6) raisons.push({ libelle, contribution: x }); return x; };
  const eq = ecurie(monde, o.organisation);
  const force = forceEcurie(monde, o.organisation);
  const valeur = valeurMarche(monde, p);
  // Phase 7c : la commission de l'agent (en partie ressentie) et un sponsor personnel qui paie le pilote modifient le salaire perçu.
  const revenus = p.sponsorPersonnel && p.sponsorPersonnel.jusqua >= monde.date.annee ? p.sponsorPersonnel.montantMEUR : 0;
  const ratio = (o.salaireMEUR * (1 - (p.commission ?? 0) * AGENTS.partCommissionRessentie) + revenus) / valeur;
  const anneesIci = anneesDans(monde, p, o.organisation);
  const norme = 3.5;

  let u = 0;
  // Couche 2 : valeurs personnelles.
  u += ajouter(ratio >= 1 ? 'salaire à la hauteur de sa valeur' : 'salaire en dessous de sa valeur', (poidsValeur(p, 'argent') * Math.tanh(3 * (ratio - 1))) / norme);
  u += ajouter(force >= 0.5 ? 'écurie compétitive' : 'écurie peu compétitive', (poidsValeur(p, 'victoire') * (2 * force - 1)) / norme);
  if (o.prolongation) u += ajouter('attaché à son écurie', (poidsValeur(p, 'fidelite') * Math.min(1, anneesIci / 6)) / norme);
  u += ajouter(o.dureeAnnees >= 2 ? 'contrat de plusieurs saisons' : 'contrat court', (poidsValeur(p, 'stabilite') * borner((o.dureeAnnees - 2) / 2)) / norme);
  u += ajouter('projet à construire', (poidsValeur(p, 'defi') * ((1 - force) * 0.6 - 0.2)) / norme);
  if (ratio < 0.8) u += ajouter('offre jugée injuste', (poidsValeur(p, 'equite') * -0.6) / norme);
  if (ratio < UTILITE.seuilOffreInsultante) u += ajouter('offre insultante', UTILITE.penaliteOffreInsultante);
  // Une forte baisse par rapport au salaire actuel se vit mal, même si l'offre correspond à la valeur de marché.
  const actuel = (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).find((c) => c.personne === p.id && c.statut === 'actif' && c.type === 'emploi')?.salaireMEUR;
  if (actuel && o.salaireMEUR < 0.9 * actuel) u += ajouter('baisse de salaire', -PENALITE_BAISSE_SALAIRE * (1 - o.salaireMEUR / actuel) * poidsValeur(p, 'argent'));
  if (eq && (eq.nationalite === p.nationalite || ecurieFormatrice(monde, p) === o.organisation)) u += ajouter('attachement à ses racines', poidsValeur(p, 'racines') / norme);

  // Phase 7a : lassitude d'un pilote installé depuis longtemps (et titré) dans la même écurie : envie d'un nouveau défi.
  const l = lassitude(monde, p);
  if (l.niveau > 0) u += o.organisation === l.ecurie ? ajouter('lassitude après des années dans la même écurie', -l.niveau / 2) : ajouter('envie d’un nouveau défi', l.niveau);
  // Phase 7c : l'agent touche une commission plus forte lors d'un transfert : il pousse parfois au mouvement.
  const ag = agentDe(monde, p);
  if (ag && !o.prolongation) u += ajouter('son agent pousse au transfert', AGENTS.pousseeTransfert * (ag.ambition / 20));
  // Phase 7b : un poste plus important attire les ambitieux.
  if ((RANG_POSTE[o.poste] ?? 0) > (RANG_POSTE[p.poste] ?? 0)) u += ajouter('poste plus important', ATTRAIT_POSTE_SUPERIEUR * ((p.traits['ambition'] ?? 10) / 20));
  // Phase 7a : une écurie réputée prédatrice inspire de la méfiance (un coût, jamais une interdiction).
  if (!o.prolongation && eq?.reputationPredateur) u += ajouter('écurie réputée prédatrice', -Math.min(PREDATEUR.malusMax, PREDATEUR.malusParPoint * eq.reputationPredateur));
  // Phase 11 : l'image publique de l'écurie (une écurie appréciée attire, une écurie mal vue rebute).
  if (eq?.image) u += ajouter(eq.image >= 0 ? 'écurie bien vue' : 'écurie mal vue', utiliteImage(eq));

  // Relations (seul canal des souvenirs) ; réputation si l'on ne se connaît pas.
  const rd = relation(monde, p.id, o.decideur);
  if (rd.familiarite > 0.05 || rd.confiance !== 0 || rd.affinite !== 0) {
    u += ajouter(rd.confiance >= 0 ? 'confiance envers le team principal' : 'méfiance envers le team principal', UTILITE.confianceDecideur * rd.confiance);
    u += ajouter(rd.affinite >= 0 ? 'bonne entente avec le team principal' : 'mauvaise entente avec le team principal', UTILITE.affiniteDecideur * rd.affinite);
  } else {
    const rep = reputation(monde, o.decideur, p.id); // phase 8c : ce que la personne sait (ou a entendu dire) du team principal
    u += ajouter('réputation du team principal', 0.3 * (rep.paroleTenue + rep.fideliteAuPersonnel) / 2);
  }
  const ro = relation(monde, p.id, o.organisation);
  u += ajouter(ro.confiance >= 0 ? 'confiance envers l’écurie' : 'rancœur envers l’écurie', UTILITE.confianceOrganisation * ro.confiance);

  // Couche 4 : aspirations.
  for (const asp of p.aspirations) {
    if (asp.type === 'etre_champion') u += ajouter('veut devenir champion', UTILITE.aspiration * (2 * force - 1));
    if (asp.type === 'ecurie_prestigieuse' && eq) u += ajouter('veut une écurie prestigieuse', (UTILITE.aspiration * (eq.prestige - 10)) / 10);
    if (asp.type === 'devenir_titulaire' && o.poste === 'pilote_titulaire') u += ajouter('veut devenir titulaire', UTILITE.aspiration * 1.5);
  }
  // Promesses : valeur pondérée par leur crédibilité (confiance envers celui qui promet).
  const credibilite = 0.5 + 0.5 * rd.confiance;
  if (o.promesses.includes('statut_n1')) u += ajouter('statut de n°1 promis', 0.4 * ((p.traits['ambition'] ?? 10) / 20) * credibilite);
  if (o.promesses.includes('titularisation')) u += ajouter('titularisation promise', 0.5 * credibilite);

  raisons.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  return { utilite: u, raisons, ligneRouge: ligneRouge(monde, p, o) };
}

/**
 * Lassitude (D-117 §15.1), calculée et non stockée.
 * - Pilote : saisons dans son écurie au-delà d'un seuil, titres pilotes avec elle.
 * - Personnel (phase 7b) : saisons au même poste dans la même écurie au-delà d'un seuil, titres constructeurs de l'écurie pendant ce temps,
 *   poste supérieur bloqué par quelqu'un de moins bon.
 * Accélérée par le goût du défi et l'ambition, freinée par la loyauté ; plafonnée.
 */
export function lassitude(monde: Monde, p: Personne): { niveau: number; ecurie?: string } {
  if (p.statut !== 'actif' || !p.ecurie) return { niveau: 0 };
  const pilote = p.poste === 'pilote_titulaire';
  const reglage = pilote ? LASSITUDE_PILOTE : LASSITUDE_PERSONNEL;
  if (!pilote && (RANG_POSTE[p.poste] ?? 0) === 0) return { niveau: 0 };
  const annees = anneesDans(monde, p, p.ecurie);
  const pal = Object.values(table(monde, TABLES.palmares)) as unknown as Palmares[];
  const titres = pilote
    ? pal.filter((x) => x.championPilote === p.id && x.ecurieChampionPilote === p.ecurie).length
    : pal.filter((x) => x.championConstructeurs === p.ecurie && x.saison > monde.date.annee - annees).length;
  const usure = usureSucces(monde, p, annees).usure;
  if (annees < reglage.anneesMin) return { niveau: usure, ecurie: p.ecurie };
  let brut = reglage.parAnnee * (annees - reglage.anneesMin + 1) + reglage.parTitre * titres;
  if (!pilote) {
    const superieur = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[])
      .find((x) => x.statut === 'actif' && x.ecurie === p.ecurie && (RANG_POSTE[x.poste] ?? 0) === (RANG_POSTE[p.poste] ?? 0) + 1);
    if (superieur && niveauMetier(superieur) <= niveauMetier(p)) brut += LASSITUDE_PERSONNEL.blocage;
  }
  const temperament = (((p.valeurs['defi'] ?? 10) + (p.traits['ambition'] ?? 10)) / 20) * (1.5 - (p.traits['loyaute'] ?? 10) / 20);
  return { niveau: Math.min(reglage.max, Math.max(0, brut * temperament)) + usure, ecurie: p.ecurie };
}

/** Seuil personnel d'usure (3 à 5 titres) selon la patience : loyauté, attachement à la stabilité, peu de goût du défi et d'ambition. */
export function seuilPersonnel(p: Personne): number {
  const patience = ((p.traits['loyaute'] ?? 10) + (p.valeurs['stabilite'] ?? 10) + (20 - (p.valeurs['defi'] ?? 10)) + (20 - (p.traits['ambition'] ?? 10))) / 80;
  return USURE_SUCCES.seuilMin + (USURE_SUCCES.seuilMax - USURE_SUCCES.seuilMin) * Math.min(1, Math.max(0, patience));
}

/**
 * D-140 — usure du succès : titres vécus avec l'écurie, seuil personnel (3 à 5 titres selon le caractère), immunité des très loyaux.
 * Renvoie aussi le signal précurseur (la personne a atteint seuil − anticipation : elle demande un nouveau défi).
 */
export function usureSucces(monde: Monde, p: Personne, anneesConnues?: number): { usure: number; titres: number; seuil: number; signal: boolean } {
  if (p.statut !== 'actif' || !p.ecurie || (p.traits['loyaute'] ?? 10) >= USURE_SUCCES.loyauteImmunite) return { usure: 0, titres: 0, seuil: Infinity, signal: false };
  const pilote = p.poste === 'pilote_titulaire';
  if (!pilote && (RANG_POSTE[p.poste] ?? 0) === 0) return { usure: 0, titres: 0, seuil: Infinity, signal: false };
  const annees = anneesConnues ?? anneesDans(monde, p, p.ecurie);
  const pal = Object.values(table(monde, TABLES.palmares)) as unknown as Palmares[];
  const constructeurs = pal.filter((x) => x.championConstructeurs === p.ecurie && x.saison > monde.date.annee - annees).length;
  const titres = pilote ? Math.max(constructeurs, pal.filter((x) => x.championPilote === p.id && x.ecurieChampionPilote === p.ecurie && x.saison > monde.date.annee - annees).length) : constructeurs;
  const seuil = seuilPersonnel(p);
  const depart = seuil - USURE_SUCCES.anticipation;
  const usure = Math.min(USURE_SUCCES.max, Math.max(0, USURE_SUCCES.parTitre * (titres - depart)));
  return { usure, titres, seuil, signal: titres >= depart };
}

/** Lassitude d'un pilote titulaire (phase 7a) ; nulle pour les autres postes. */
export function lassitudePilote(monde: Monde, p: Personne): { niveau: number; ecurie?: string } {
  return p.poste === 'pilote_titulaire' ? lassitude(monde, p) : { niveau: 0 };
}

/** Utilité de l'alternative (partir, chercher ailleurs) : la valeur de marché moins le coût de l'incertitude. */
export function utiliteAlternative(monde: Monde, p: Personne): number {
  const libres = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).filter((x) => x.statut === 'libre' && x.poste === p.poste).length;
  const concurrence = Math.min(1, libres / 8);
  const risque = (p.traits['risque'] ?? 10) / 20;
  return -UTILITE.coutIncertitude * (1 - risque) * (0.5 + concurrence);
}

export type Reponse = { type: 'accepte' | 'refuse'; raisons: Raison[]; ligneRouge?: string } | { type: 'contre_offre'; salaireDemande: number; raisons: Raison[] };

/** Réponse d'une personne à une offre : accepter, contre-proposer, refuser. */
export function repondre(monde: Monde, p: Personne, o: Offre, cle: string, contreOffrePossible: boolean): Reponse {
  // Phase 10 : l'IA ne décide jamais à la place du joueur. Le manager accepte de prolonger avec son écurie (le conseil reste juge,
  // D-089) et n'est pas sur le marché (offres d'emploi au joueur : phase 14).
  if (p.joueur) return o.organisation === p.ecurie ? { type: 'accepte', raisons: [] } : { type: 'refuse', raisons: [], ligneRouge: 'Le manager du joueur n’est pas sur le marché.' };
  const ev = evaluerOffre(monde, p, o);
  const top = ev.raisons.slice(0, 3);
  if (ev.ligneRouge) return { type: ev.ligneRouge.sens === 'refus' ? 'refuse' : 'accepte', raisons: top, ligneRouge: ev.ligneRouge.libelle };
  const f = tirageLocal(monde, 'decision', p.id, cle);
  const bruit = f.normale(0, UTILITE.bruitBase + ((p.traits['temperament'] ?? 10) / 20) * UTILITE.bruitTemperament);
  const ecart = ev.utilite - utiliteAlternative(monde, p) + bruit;
  if (ecart >= 0) return { type: 'accepte', raisons: top };
  const valeur = valeurMarche(monde, p);
  if (contreOffrePossible && ecart > -0.35 && o.salaireMEUR < valeur * 1.3) {
    const audace = ((p.traits['ambition'] ?? 10) + (p.traits['risque'] ?? 10)) / 40;
    // Phase 7c : un agent bon négociateur pousse la demande plus haut.
    const agent = agentDe(monde, p);
    const surenchere = agent ? 1 + AGENTS.surenchere * (agent.negociation / 20) : 1;
    return { type: 'contre_offre', salaireDemande: Math.round(Math.max(o.salaireMEUR * (1 + 0.1 + 0.15 * audace), valeur) * surenchere * 10) / 10, raisons: top };
  }
  return { type: 'refuse', raisons: top };
}

/** Score d'un candidat pour une écurie (IA du team principal) : niveau, potentiel, coût, relations, compatibilité. */
/**
 * Performance (audit de la phase 7, mesuré) : ce qui est commun à tous les candidats d'une écurie (affiliations, promesses dues,
 * souvenirs du décideur) est préparé une seule fois. Mêmes données, mêmes résultats ; à reconstruire si l'état change.
 */
export interface ContexteScore { affiliation: Map<string, Contrat>; promessesDues: Set<string>; souvenirsDecideur: ReturnType<typeof souvenirsDe> }
export function contexteScore(monde: Monde, e: Ecurie, decideur: string): ContexteScore {
  const affiliation = new Map<string, Contrat>();
  for (const x of Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]) if (x.type === 'affiliation' && x.statut === 'actif') affiliation.set(x.personne, x);
  const promessesDues = new Set((Object.values(table(monde, TABLE_PROMESSES)) as unknown as Promesse[])
    .filter((x) => x.type === 'titularisation' && x.statut === 'en_cours' && x.organisation === e.id && x.echeance.annee <= monde.date.annee + 1).map((x) => x.beneficiaire));
  return { affiliation, promessesDues, souvenirsDecideur: souvenirsDe(monde, decideur) };
}

export function scoreCandidat(monde: Monde, e: Ecurie, decideur: string, c: Personne, salaireMEUR: number, ctx?: ContexteScore): { score: number; raisons: Raison[] } {
  const raisons: Raison[] = [];
  const ajouter = (libelle: string, x: number) => { raisons.push({ libelle, contribution: x }); return x; };
  const jeunesse = /jeune|junior|filière/i.test(e.politiqueRecrutement) ? 1 : 0;
  let s = 0;
  s += ajouter('niveau', niveauMetier(c) / 20);
  // Phase 6a : l'écurie juge sur SON estimation du potentiel (département recrutement), pas sur le vrai potentiel.
  s += ajouter('potentiel estimé', ((potentielEstime(monde, e.id, c).centre - niveauMetier(c)) / 20) * (0.3 + 0.4 * jeunesse));
  // Phase 6b : la réputation sportive des jeunes (karting, Apex 4, Apex 3, Apex 2) compte pour les recruteurs.
  if (c.reputationJeune) s += ajouter('réputation junior', REPUTATION_RECRUTEMENT_F1 * c.reputationJeune);
  // Phase 6b-2 : préférence pour ses propres affiliés (et ceux de l'écurie partenaire), surtout si une promesse arrive à échéance.
  const aff = ctx ? ctx.affiliation.get(c.id) : (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).find((x) => x.type === 'affiliation' && x.statut === 'actif' && x.personne === c.id);
  if (aff && (aff.organisation === e.id || aff.organisation === e.ecuriePartenaire)) s += ajouter('affilié de l’académie', aff.organisation === e.id ? PROMOTION_AFFILIE.propre : PROMOTION_AFFILIE.partenaire);
  const promesseEchue = ctx ? ctx.promessesDues.has(c.id) : (Object.values(table(monde, TABLE_PROMESSES)) as unknown as Promesse[]).some((x) => x.type === 'titularisation' && x.statut === 'en_cours' && x.beneficiaire === c.id && x.organisation === e.id && x.echeance.annee <= monde.date.annee + 1);
  if (promesseEchue) s += ajouter('promesse de titularisation', PROMOTION_AFFILIE.promesseEchue);
  const declin = Math.max(0, age(monde, c) - courbeAge(c.poste).declinApres);
  if (declin > 0) s += ajouter('âge', -PENALITE_AGE_RECRUTEMENT * declin);
  const budgetPoste = e.budgetMEUR * (c.poste.startsWith('pilote') ? 0.05 : 0.015);
  s += ajouter('coût', -0.4 * Math.max(0, salaireMEUR / budgetPoste - 1));
  const r = relation(monde, decideur, c.id, ctx?.souvenirsDecideur);
  s += ajouter('relation avec le team principal', 0.25 * (r.respect + r.affinite) / 2);
  const force = forceEcurie(monde, e.id);
  s += ajouter('compatibilité avec le projet', 0.08 * (((c.valeurs['victoire'] ?? 10) - 10) / 10) * (2 * force - 1) + 0.05 * (((c.valeurs['defi'] ?? 10) - 10) / 10) * (1 - 2 * force));
  raisons.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  return { score: s, raisons };
}

/** Team principal actif d'une écurie. */
export function teamPrincipal(monde: Monde, idEcurie: string): Personne | undefined {
  // Un seul team principal actif par écurie (invariant vérifié par verifierCoherence) : recherche sans tri (performance, audit n°4).
  return (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === idEcurie && p.poste === 'team_principal');
}

export function texteRaisons(raisons: Raison[]): string[] {
  return raisons.slice(0, 3).map((r) => `${r.contribution >= 0 ? '+' : '−'} ${r.libelle}`);
}
