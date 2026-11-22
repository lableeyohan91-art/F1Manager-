/**
 * Économie — phase 5a (docs/systemes/phase-5-economie.md, D-078).
 *
 * - Comptabilité par période de 4 semaines : recettes (primes, commercial, apport du propriétaire) et dépenses
 *   (plafonnées : personnel, départements, opérations, entretien, développement ; hors plafond : pilotes et 3 cadres
 *   les mieux payés, marketing, indemnités, amendes).
 * - Bilan annuel (semaine 1) : contrôle du plafond, sanctions, puis budget de l'année décidé par l'IA du team principal
 *   et du conseil (mêmes règles pour toutes les écuries).
 * - Le budget de développement réellement dépensé et les restrictions aérodynamiques selon le classement agissent
 *   sur le développement des voitures (systems/saison).
 * - Le conseil évalue le team principal (remplace la règle provisoire de la phase 4).
 *
 * Pas de triche (D-081) : l'IA ne lit que ses propres comptes et des informations publiques (classements).
 */

import {
  ALEA_APPORT, BUDGET_IA, DIVIDENDES, PART_DIVIDENDES, CADRES_HORS_PLAFOND, COMMERCIAL, CONSEIL, COUPE_EN_COURS, COUT_EMPLOYE, DEPASSEMENT_VOLONTAIRE,
  DEVELOPPEMENT_MINIMUM, EFFORT_TECHNIQUE_REFERENCE, MARGE_SECURITE_PLAFOND, ENTRETIEN_PAR_NIVEAU, FACTEUR_BUDGET_DEV, OPERATIONS_PAR_GP, PART_MARKETING,
  PERIODES_PAR_AN, PROPRIETAIRES, RESTRICTIONS_AERO, SANCTION_PLAFOND, SEUIL_DEPASSEMENT_MINEUR,
} from '../../balance/finances';
import { ENVELOPPE_PRIMES_MEUR, GRANDS_PRIX_PAR_SAISON, PARTS_PRIMES, PLAFOND_BUDGETAIRE_MEUR } from '../../balance/reglement';
import { SEMAINE_NEGOCIATIONS } from '../../balance/contrats';
import { ajouterEvenement } from '../../core/evenements';
import { idsTries, parametre, table, type Monde } from '../../core/monde';
import { tirageLocal, type Moteur, type Systeme } from '../../core/moteur';
import { comptesVides, totalDepenses, totalPlafonne, totalRecettes } from '../../model/finances';
import {
  TABLES, type Contrat, type Departement, type Ecurie, type Finances, type Installation, type Personne, type Proprietaire, type Saison,
} from '../../model/types';
import { ecuriesActives, indiceMoyen } from '../saison/performance';
import { liberer, nePasProlonger, pourvoirPostes, proposerProlongation } from '../humain/contrats';
import { forceEcurie, teamPrincipal, valeurMarche } from '../humain/decision';

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const arrondi = (x: number) => Math.round(x * 10) / 10;

export function financesDe(monde: Monde, idEcurie: string): Finances | undefined {
  return (Object.values(table(monde, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === idEcurie);
}
export function proprietaireDe(monde: Monde, idEcurie: string): Proprietaire | undefined {
  return (Object.values(table(monde, TABLES.proprietaires)) as unknown as Proprietaire[]).find((p) => p.ecurie === idEcurie);
}

/** Plafond budgétaire en vigueur (paramètre du règlement, modifiable par vote en phase 8). */
export function plafond(monde: Monde): number {
  return parametre(monde, 'reglement.plafondMEUR', PLAFOND_BUDGETAIRE_MEUR);
}

/** Rang au dernier classement constructeurs terminé (1 = premier) ; à défaut, rang de l'indice voiture. */
export function rangPrecedent(monde: Monde, idEcurie: string): { rang: number; n: number } {
  const saisons = (Object.values(table(monde, TABLES.saisons)) as unknown as Saison[]).filter((s) => s.termine).sort((a, b) => b.annee - a.annee);
  const s = saisons[0];
  if (s) {
    const i = s.constructeurs.findIndex((c) => c.ecurie === idEcurie);
    if (i >= 0) return { rang: i + 1, n: s.constructeurs.length };
  }
  const classement = ecuriesActives(monde).map((e) => [e.id, indiceMoyen(monde, e)] as const).sort((a, b) => b[1] - a[1]);
  return { rang: Math.max(1, classement.findIndex(([id]) => id === idEcurie) + 1), n: classement.length };
}

/** Restriction aérodynamique (règle connue de tous) : efficacité du développement aéro selon le dernier classement. */
export function restrictionAero(monde: Monde, idEcurie: string): number {
  const { rang, n } = rangPrecedent(monde, idEcurie);
  const t = n > 1 ? (rang - 1) / (n - 1) : 0.5;
  const premier = parametre(monde, 'reglement.restrictionAeroPremier', RESTRICTIONS_AERO.premier);
  const dernier = parametre(monde, 'reglement.restrictionAeroDernier', RESTRICTIONS_AERO.dernier);
  return premier + t * (dernier - premier);
}

/**
 * Facteur budget du développement : effort technique annuel prévu (dépenses plafonnées fixes + budget de développement
 * restant, coupes comprises) rapporté à la référence. Toutes les écuries au plafond sont à égalité ; seules celles qui
 * n'ont pas les moyens de l'atteindre sont en retrait (D-081 : l'argent compte, mais le plafond le borne).
 */
export function facteurBudgetDeveloppement(monde: Monde, idEcurie: string): number {
  const fi = financesDe(monde, idEcurie);
  const e = table(monde, TABLES.ecuries)[idEcurie] as unknown as Ecurie | undefined;
  if (!fi || !e || fi.budget.annee === 0) return 1;
  const f = depensesFixes(monde, e);
  const effort = f.personnelPlafonne + f.departements + f.operations + f.entretien + fi.budget.developpementMEUR;
  return borner(effort / EFFORT_TECHNIQUE_REFERENCE, FACTEUR_BUDGET_DEV.min, FACTEUR_BUDGET_DEV.max);
}

/* ---------------------------------------------------------------- Estimations annuelles */

function primesAttendues(monde: Monde, idEcurie: string): number {
  const saisons = (Object.values(table(monde, TABLES.saisons)) as unknown as Saison[]).filter((s) => s.termine).sort((a, b) => b.annee - a.annee);
  const versee = saisons[0]?.constructeurs.find((c) => c.ecurie === idEcurie)?.primesMEUR;
  if (versee !== undefined) return versee;
  const { rang, n } = rangPrecedent(monde, idEcurie);
  const parts = PARTS_PRIMES.slice(0, n);
  const total = parts.reduce((a, b) => a + b, 0) || 1;
  return (ENVELOPPE_PRIMES_MEUR * (parts[rang - 1] ?? parts.at(-1) ?? 5)) / total;
}

function commercialAnnuel(monde: Monde, e: Ecurie, fi: Finances): number {
  return fi.revenusCommerciauxBaseMEUR * (COMMERCIAL.popMin + COMMERCIAL.popParPoint * e.popularite) * (COMMERCIAL.resultatsMin + COMMERCIAL.resultatsAmplitude * forceEcurie(monde, e.id));
}

function apportAnnuel(monde: Monde, e: Ecurie, fi: Finances, annee: number): number {
  const p = proprietaireDe(monde, e.id);
  if (!p) return 0;
  const profil = PROPRIETAIRES[p.type] ?? PROPRIETAIRES['consortium']!;
  const f = tirageLocal(monde, 'proprietaire', e.id, annee);
  const proche = forceEcurie(monde, e.id); // 1 = au sommet
  const dernier = fi.historique.at(-1);
  const deficit = dernier ? Math.max(0, totalDepenses(dernier) - totalRecettes(dernier)) / Math.max(1, totalRecettes(dernier)) : 0;
  const envie = 1 + profil.sensibiliteResultats * ((p.ambition - 10) / 10) * (proche - 0.3) - profil.sensibilitePertes * deficit;
  const variation = (1 - profil.stabilite) * f.normale(0, 1) + f.normale(0, ALEA_APPORT);
  return Math.max(0, p.apportBaseMEUR * envie * (1 + variation));
}

/** Dépenses fixes annuelles (hors développement), en séparant plafonné et hors plafond. */
export function depensesFixes(monde: Monde, e: Ecurie): { personnelPlafonne: number; departements: number; operations: number; entretien: number; salairesHorsPlafond: number; marketing: number } {
  const contrats = (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).filter((c) => c.statut === 'actif' && c.type === 'emploi' && c.organisation === e.id);
  const pilotes = contrats.filter((c) => c.poste === 'pilote_titulaire');
  const cadres = contrats.filter((c) => c.poste !== 'pilote_titulaire').sort((a, b) => b.salaireMEUR - a.salaireMEUR);
  const horsPlafond = [...pilotes, ...cadres.slice(0, CADRES_HORS_PLAFOND)];
  const plafonnes = cadres.slice(CADRES_HORS_PLAFOND);
  const deps = (Object.values(table(monde, TABLES.departements)) as unknown as Departement[]).filter((d) => d.ecurie === e.id);
  const inst = (Object.values(table(monde, TABLES.installations)) as unknown as Installation[]).filter((i) => i.ecurie === e.id);
  const fi = financesDe(monde, e.id);
  return {
    personnelPlafonne: plafonnes.reduce((a, c) => a + c.salaireMEUR, 0),
    departements: deps.reduce((a, d) => a + d.effectif * (COUT_EMPLOYE.base + COUT_EMPLOYE.parPointNiveau * d.niveauMoyen), 0),
    operations: OPERATIONS_PAR_GP * parametre(monde, 'reglement.grandsPrix', GRANDS_PRIX_PAR_SAISON),
    entretien: inst.reduce((a, i) => a + i.niveau * ENTRETIEN_PAR_NIVEAU * (1 + i.ageAnnees / 30), 0),
    salairesHorsPlafond: horsPlafond.reduce((a, c) => a + c.salaireMEUR, 0),
    marketing: fi ? PART_MARKETING * commercialAnnuel(monde, e, fi) : 0,
  };
}

/* ---------------------------------------------------------------- Bilan annuel et budget */

/** Clôture l'année écoulée : contrôle du plafond, sanctions, historique. */
function cloturer(monde: Monde, e: Ecurie, fi: Finances): void {
  const c = fi.comptes;
  if (c.annee >= monde.date.annee) return;
  const plafonnees = totalPlafonne(c);
  const cap = plafond(monde);
  const depassement = Math.max(0, plafonnees - cap);
  fi.sanctionAero = 0;
  if (depassement > 0.01) {
    const mineur = depassement <= SEUIL_DEPASSEMENT_MINEUR * cap;
    const amende = SANCTION_PLAFOND.amendeFacteur * depassement;
    fi.tresorerieMEUR -= amende;
    c.amendes += amende;
    fi.sanctionAero = mineur ? SANCTION_PLAFOND.reductionAeroMineur : SANCTION_PLAFOND.reductionAeroMajeur;
    ajouterEvenement(monde, {
      type: 'finances.depassement_plafond', acteurs: [{ id: e.id, role: 'ecurie' }], importance: mineur ? 3 : 4, visibilite: 'public',
      contexte: { depassement: arrondi(depassement), amende: arrondi(amende), mineur },
      texte: `${e.nom} dépasse le plafond budgétaire de ${arrondi(depassement)} M€ (${mineur ? 'mineur' : 'majeur'}) : ${arrondi(amende)} M€ d'amende et développement aérodynamique réduit.`,
    });
  }
  // Dividendes : le propriétaire retire une part de la trésorerie excédentaire.
  const seuil = DIVIDENDES.seuilAnneesDepenses * totalDepenses(c);
  const p = proprietaireDe(monde, e.id);
  if (p && fi.tresorerieMEUR > seuil) {
    const retrait = (PART_DIVIDENDES[p.type] ?? 0.5) * (fi.tresorerieMEUR - seuil);
    fi.tresorerieMEUR -= retrait;
    c.dividendes += retrait;
    ajouterEvenement(monde, {
      type: 'finances.dividendes', acteurs: [{ id: e.id, role: 'ecurie' }, { id: p.id, role: 'proprietaire' }], importance: 1,
      contexte: { montant: arrondi(retrait), tresorerie: arrondi(fi.tresorerieMEUR) },
    });
  }
  fi.historique.push({ ...c, tresorerieFin: arrondi(fi.tresorerieMEUR), plafonnees: arrondi(plafonnees), depassement: arrondi(depassement) });
  if (fi.historique.length > 30) fi.historique.shift(); // borne (résumés anciens dans la Chronique plus tard)
  ajouterEvenement(monde, {
    type: 'finances.bilan', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 1,
    contexte: { annee: c.annee, recettes: arrondi(totalRecettes(c)), depenses: arrondi(totalDepenses(c)), plafonnees: arrondi(plafonnees), tresorerie: arrondi(fi.tresorerieMEUR) },
  });
}

/**
 * Budget de l'année (IA du team principal, arbitré par le conseil) : recettes prévues − dépenses fixes − réserve visée,
 * plus une part de l'excédent de trésorerie ; le développement est limité par la marge sous le plafond.
 * Une écurie ambitieuse et joueuse peut choisir de dépasser légèrement le plafond (dilemme, pas interdiction).
 */
export function deciderBudget(monde: Monde, e: Ecurie, fi: Finances): void {
  const annee = monde.date.annee;
  const fixes = depensesFixes(monde, e);
  const fixesTotal = fixes.personnelPlafonne + fixes.departements + fixes.operations + fixes.entretien + fixes.salairesHorsPlafond + fixes.marketing;
  const recettes = primesAttendues(monde, e.id) + commercialAnnuel(monde, e, fi) + apportAnnuel(monde, e, fi, annee);
  const proprietaire = proprietaireDe(monde, e.id);
  const tp = teamPrincipal(monde, e.id);
  const prudence = 1 + ((proprietaire?.patience ?? 10) - (tp?.traits['risque'] ?? 10)) / 40;
  const reserve = BUDGET_IA.periodesReserve * (fixesTotal / PERIODES_PAR_AN) * prudence;
  const disponible = recettes - fixesTotal + BUDGET_IA.partExcedentInvesti * (fi.tresorerieMEUR - reserve);
  const cap = plafond(monde);
  const margeSousPlafond = cap * (1 - MARGE_SECURITE_PLAFOND) - (fixes.personnelPlafonne + fixes.departements + fixes.operations + fixes.entretien);
  let plafondVise = cap;
  let strategie = 'equilibre';
  const f = tirageLocal(monde, 'budget', e.id, annee);
  const risque = tp?.traits['risque'] ?? 10;
  if (risque >= DEPASSEMENT_VOLONTAIRE.seuilRisque && forceEcurie(monde, e.id) >= 0.6 && f.chance((risque - DEPASSEMENT_VOLONTAIRE.seuilRisque + 1) * DEPASSEMENT_VOLONTAIRE.probabiliteParPoint)) {
    plafondVise = cap * (1 + f.suivant() * DEPASSEMENT_VOLONTAIRE.ampleurMax);
    strategie = 'offensif';
  }
  let dev = Math.min(disponible, margeSousPlafond + (plafondVise - cap));
  if (disponible < margeSousPlafond * 0.6) strategie = 'prudent';
  dev = Math.max(DEVELOPPEMENT_MINIMUM, dev);
  fi.budget = { annee, developpementMEUR: arrondi(dev), plafondVise: arrondi(plafondVise), strategie };
  fi.comptes = comptesVides(annee);
}

/** Écriture d'une période comptable (1/13 de l'année). */
function passerPeriode(monde: Monde, e: Ecurie, fi: Finances): void {
  const annee = monde.date.annee;
  const n = PERIODES_PAR_AN;
  const fixes = depensesFixes(monde, e);
  const c = fi.comptes;
  const recettes = {
    primes: primesAttendues(monde, e.id) / n,
    commercial: commercialAnnuel(monde, e, fi) / n,
    apport: apportAnnuel(monde, e, fi, annee) / n,
  };
  const depenses = {
    personnelPlafonne: fixes.personnelPlafonne / n, departements: fixes.departements / n, operations: fixes.operations / n,
    entretien: fixes.entretien / n, developpement: fi.budget.developpementMEUR / n, salairesHorsPlafond: fixes.salairesHorsPlafond / n, marketing: fixes.marketing / n,
  };
  for (const [k, v] of Object.entries(recettes)) (c as unknown as Record<string, number>)[k] = ((c as unknown as Record<string, number>)[k] ?? 0) + v;
  for (const [k, v] of Object.entries(depenses)) (c as unknown as Record<string, number>)[k] = ((c as unknown as Record<string, number>)[k] ?? 0) + v;
  fi.tresorerieMEUR += Object.values(recettes).reduce((a, b) => a + b, 0) - Object.values(depenses).reduce((a, b) => a + b, 0);

  // Projection de fin d'année : si la trésorerie finirait négative, on coupe le développement restant.
  const periodesRestantes = Math.max(0, n - Math.round((monde.date.semaine / 52) * n));
  const solde = Object.values(recettes).reduce((a, b) => a + b, 0) - Object.values(depenses).reduce((a, b) => a + b, 0);
  if (fi.tresorerieMEUR + solde * periodesRestantes < 0 && fi.budget.developpementMEUR > DEVELOPPEMENT_MINIMUM) {
    const avant = fi.budget.developpementMEUR;
    fi.budget.developpementMEUR = arrondi(Math.max(DEVELOPPEMENT_MINIMUM, avant * (1 - COUPE_EN_COURS)));
    ajouterEvenement(monde, {
      type: 'finances.coupe_budget', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 2, visibilite: 'prive',
      contexte: { avant, apres: fi.budget.developpementMEUR, tresorerie: arrondi(fi.tresorerieMEUR) },
    });
  }
}

/* ---------------------------------------------------------------- Conseil */

/** Classement attendu par le conseil : rang des moyens financiers (recettes annuelles) parmi les écuries. */
function rangAttendu(monde: Monde, idEcurie: string): number {
  const moyens = ecuriesActives(monde).map((e) => {
    const fi = financesDe(monde, e.id);
    const h = fi?.historique.at(-1);
    return [e.id, h ? totalRecettes(h) : (fi?.revenusCommerciauxBaseMEUR ?? 0)] as const;
  }).sort((a, b) => b[1] - a[1]);
  return moyens.findIndex(([id]) => id === idEcurie) + 1;
}

/** Évaluation annuelle du team principal par le conseil (remplace la règle provisoire de la phase 4). */
function evaluerTeamPrincipal(monde: Monde, e: Ecurie): void {
  const tp = teamPrincipal(monde, e.id);
  const p = proprietaireDe(monde, e.id);
  if (!tp || !p || e.pilotee) return;
  const saisons = (Object.values(table(monde, TABLES.saisons)) as unknown as Saison[]).filter((s) => s.termine).sort((a, b) => b.annee - a.annee).slice(0, 2);
  const attendu = rangAttendu(monde, e.id);
  const ecarts = saisons.map((s) => s.constructeurs.findIndex((c) => c.ecurie === e.id) + 1 - attendu);
  const grave = (ecarts[0] ?? 0) >= CONSEIL.ecartGrave && p.patience <= CONSEIL.patienceMaxGrave;
  const repete = ecarts.length === 2 && ecarts.every((x) => x >= CONSEIL.ecartRepete) && p.patience <= CONSEIL.patienceMaxRepete;
  if (!(grave || repete)) return;
  if (!tirageLocal(monde, 'conseil.evaluation', e.id, monde.date.annee).chance(CONSEIL.probabilite)) return;
  const c = (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).find((x) => x.personne === tp.id && x.statut === 'actif' && x.type === 'emploi');
  if (!c) return;
  ajouterEvenement(monde, {
    type: 'conseil.licenciement_tp', acteurs: [{ id: e.id, role: 'auteur' }, { id: tp.id, role: 'cible' }], importance: 4, visibilite: 'public',
    contexte: { ecarts, attendu }, texte: `Le conseil de ${e.nom} se sépare de son team principal, ${tp.prenom} ${tp.nom}.`,
  });
  liberer(monde, tp, c, 'licenciement');
}

/** Prolongation du team principal décidée par le conseil (semaine des négociations). */
function prolongationTeamPrincipal(monde: Monde, e: Ecurie): void {
  const tp = teamPrincipal(monde, e.id);
  const p = proprietaireDe(monde, e.id);
  if (!tp || !p || e.pilotee) return;
  const c = (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).find((x) => x.personne === tp.id && x.statut === 'actif' && x.type === 'emploi');
  if (!c || c.fin !== monde.date.annee || c.nonProlonge) return;
  const s = (Object.values(table(monde, TABLES.saisons)) as unknown as Saison[]).filter((x) => x.termine).sort((a, b) => b.annee - a.annee)[0];
  const ecart = s ? s.constructeurs.findIndex((x) => x.ecurie === e.id) + 1 - rangAttendu(monde, e.id) : 0;
  const f = tirageLocal(monde, 'conseil.prolongation', c.id, monde.date.annee);
  if (ecart >= CONSEIL.ecartRepete && f.chance(0.7 - p.patience / 40)) {
    nePasProlonger(monde, c, e.id, 'résultats jugés insuffisants par le conseil');
    return;
  }
  proposerProlongation(monde, c, e.id, valeurMarche(monde, tp), 2, [], 1);
}

/* ---------------------------------------------------------------- Systèmes */

export const systemeEconomieAnnuelle: Systeme = {
  nom: 'economie.annuelle',
  executer({ monde, date }) {
    if (date.semaine !== 1) return;
    for (const e of ecuriesActives(monde)) {
      const fi = financesDe(monde, e.id);
      if (!fi) continue;
      cloturer(monde, e, fi);
      evaluerTeamPrincipal(monde, e);
    }
    // Un team principal remercié est remplacé avant de bâtir le budget.
    if (ecuriesActives(monde).some((e) => !teamPrincipal(monde, e.id))) pourvoirPostes(monde);
    for (const e of ecuriesActives(monde)) {
      const fi = financesDe(monde, e.id);
      if (fi && fi.budget.annee !== date.annee) deciderBudget(monde, e, fi);
    }
  },
};

export const systemeComptabilite: Systeme = {
  nom: 'economie.comptabilite',
  executer({ monde, date }) {
    if (date.semaine % 4 !== 0) return;
    for (const id of idsTries(table(monde, TABLES.finances))) {
      const fi = table(monde, TABLES.finances)[id] as unknown as Finances;
      const e = table(monde, TABLES.ecuries)[fi.ecurie] as unknown as Ecurie | undefined;
      if (e && e.statut === 'active' && fi.budget.annee === date.annee) passerPeriode(monde, e, fi);
    }
  },
};

export const systemeConseil: Systeme = {
  nom: 'economie.conseil',
  executer({ monde, date }) {
    if (date.semaine !== SEMAINE_NEGOCIATIONS) return;
    for (const e of ecuriesActives(monde)) prolongationTeamPrincipal(monde, e);
  },
};

/** À installer AVANT les systèmes de la saison (le budget doit exister avant le développement d'intersaison). */
export function installerEconomie(moteur: Moteur): Moteur {
  return moteur.ajouterSysteme(systemeEconomieAnnuelle).ajouterSysteme(systemeComptabilite).ajouterSysteme(systemeConseil);
}


