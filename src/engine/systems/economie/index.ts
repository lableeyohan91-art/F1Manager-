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
  ALEA_APPORT, BUDGET_IA, OBJECTIF_PROPRIETAIRE, DIVIDENDES, PART_DIVIDENDES, CADRES_HORS_PLAFOND, COMMERCIAL, CONSEIL, CONSEIL_CONTRE_OFFRE, COUPE_EN_COURS, COUT_EMPLOYE, DEPASSEMENT_VOLONTAIRE,
  DEVELOPPEMENT_MINIMUM, EFFORT_TECHNIQUE_REFERENCE, MARGE_SECURITE_PLAFOND, FACTEUR_BUDGET_DEV, OPERATIONS_PAR_GP, PART_MARKETING,
  PART_DROITS_COMMERCIAUX, RETRAIT_PROPRIETAIRE, EMPRUNT_OFFENSIF, PERIODES_PAR_AN, PROPRIETAIRES, INVESTISSEMENT_ANNUEL_MAX, RESTRICTIONS_AERO, SANCTION_PLAFOND, SEUIL_DEPASSEMENT_MINEUR,
} from '../../balance/finances';
import { ENVELOPPE_PRIMES_MEUR, PARTS_PRIMES, PLAFOND_BUDGETAIRE_MEUR } from '../../balance/reglement';
import { SOUFFLERIE } from '../../balance/monoplaces';
import { INSTALLATIONS_COUT } from '../../balance/capacites';
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
import { evaluerSponsors, initialiserSponsors, marcheSponsors, revenusSponsors } from './sponsors';
import { capaciteEmprunt, gererTresorerie, proprietaireActif, tauxDette, verifierInvestisseur, verifierLassitude } from './crises';
import { avancerProjets, commandeChantier, commandeReduction, deciderProjet, deciderReductions, negligerEntretien, vieillirInstallations } from './infrastructures';
import { commandeEffectif, systemeCapacites } from './capacites';
import { coutAnnuelAcademie } from '../juniors/academies';

export * from './sponsors';
export * from './sponsoring';
export * from './probabilites';
export * from './variantes';
export * from './crises';
import { nombreGrandsPrix, regleVotee } from '../politique/acces';
import { partRecherche } from '../technique/acces';
import { CONFERENCES } from '../../balance/medias';
import { patienceImage } from '../medias/acces';
export * from './infrastructures';
export * from './previsions';
export * from './capacites';

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const arrondi = (x: number) => Math.round(x * 10) / 10;

export function financesDe(monde: Monde, idEcurie: string): Finances | undefined {
  return (Object.values(table(monde, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === idEcurie);
}
/** Propriétaire actuel (les anciens propriétaires restent dans la table, marqués inactifs, après un rachat). */
export function proprietaireDe(monde: Monde, idEcurie: string): Proprietaire | undefined {
  return proprietaireActif(monde, idEcurie);
}

/** Plafond budgétaire en vigueur (paramètre du règlement, modifiable par vote en phase 8). */
export function plafond(monde: Monde): number {
  // Phase 8d-4 : la valeur votée sert de valeur par défaut ; un réglage d'expérience la remplace.
  return parametre(monde, 'reglement.plafondMEUR', regleVotee(monde, 'plafondMEUR', PLAFOND_BUDGETAIRE_MEUR));
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

/**
 * Restriction aérodynamique (règle connue de tous) : part des heures de soufflerie et de CFD selon le classement (phase 12b, barème réel
 * 2026 : premier + 5 % par place, plafonné). Classement de la saison précédente, puis, à partir de la mi-saison, celui du moment.
 */
export function restrictionAero(monde: Monde, idEcurie: string): number {
  const { rang } = rangAero(monde, idEcurie);
  const premier = parametre(monde, 'reglement.restrictionAeroPremier', regleVotee(monde, 'restrictionAeroPremier', RESTRICTIONS_AERO.premier));
  const dernier = parametre(monde, 'reglement.restrictionAeroDernier', regleVotee(monde, 'restrictionAeroDernier', RESTRICTIONS_AERO.dernier));
  return Math.min(dernier, premier + RESTRICTIONS_AERO.pasParPlace * (rang - 1));
}

/** Rang retenu pour le barème : classement en cours à partir de la mi-saison (règle réelle), sinon celui de la saison précédente. */
function rangAero(monde: Monde, idEcurie: string): { rang: number; n: number } {
  if (monde.date.semaine >= SOUFFLERIE.semaineMiSaison) {
    const s = (table(monde, TABLES.saisons)[`ssn_${monde.date.annee}`] as unknown as Saison | undefined);
    // Relecture du 26/11/2026 : l'ordre officiel (départage par victoires puis places, trié après chaque Grand Prix), pas les seuls points.
    const cl = s ? s.constructeurs : [];
    const i = cl.findIndex((c) => c.ecurie === idEcurie);
    if (i >= 0 && cl.some((c) => c.points > 0)) return { rang: i + 1, n: cl.length };
  }
  return rangPrecedent(monde, idEcurie);
}

/**
 * Facteur budget du développement : effort technique annuel rapporté à la référence. Toutes les écuries au plafond sont à
 * égalité ; seules celles qui n'ont pas les moyens de l'atteindre sont en retrait (D-081 : l'argent compte, mais le plafond le borne).
 * D-166 : l'effort est l'argent RÉELLEMENT payé à la dernière période comptable (ramené à l'année) ; avant la première période
 * de l'année, l'effort prévu (dépenses plafonnées fixes + budget de développement). Changer le budget agit donc à partir de la
 * période suivante, et l'on reçoit exactement ce que l'on paie (fin du contournement du constat 5.1, sans limiter les modifications).
 */
export function facteurBudgetDeveloppement(monde: Monde, idEcurie: string): number {
  const fi = financesDe(monde, idEcurie);
  const e = table(monde, TABLES.ecuries)[idEcurie] as unknown as Ecurie | undefined;
  if (!fi || !e || fi.budget.annee === 0) return 1;
  const paye = fi.depensePeriode?.annee === monde.date.annee ? fi.depensePeriode.plafonneesAnnuelMEUR : undefined;
  const f = paye === undefined ? depensesFixes(monde, e) : undefined;
  const effort = paye ?? (f!.personnelPlafonne + f!.departements + f!.operations + f!.entretien + fi.budget.developpementMEUR);
  return borner(effort / EFFORT_TECHNIQUE_REFERENCE, FACTEUR_BUDGET_DEV.min, FACTEUR_BUDGET_DEV.max);
}

/* ---------------------------------------------------------------- Estimations annuelles */

export function primesAttendues(monde: Monde, idEcurie: string): number {
  const saisons = (Object.values(table(monde, TABLES.saisons)) as unknown as Saison[]).filter((s) => s.termine).sort((a, b) => b.annee - a.annee);
  const versee = saisons[0]?.constructeurs.find((c) => c.ecurie === idEcurie)?.primesMEUR;
  if (versee !== undefined) return versee;
  const { rang, n } = rangPrecedent(monde, idEcurie);
  const parts = PARTS_PRIMES.slice(0, n);
  const total = parts.reduce((a, b) => a + b, 0) || 1;
  return (ENVELOPPE_PRIMES_MEUR * (parts[rang - 1] ?? parts.at(-1) ?? 5)) / total;
}

/** Droits commerciaux (télévision, organisateur) : la part du commercial qui ne dépend pas des sponsors (phase 5b). */
export function commercialAnnuel(monde: Monde, e: Ecurie, fi: Finances): number {
  return PART_DROITS_COMMERCIAUX * fi.revenusCommerciauxBaseMEUR * (COMMERCIAL.popMin + COMMERCIAL.popParPoint * e.popularite) * (COMMERCIAL.resultatsMin + COMMERCIAL.resultatsAmplitude * forceEcurie(monde, e.id));
}

/** Apport effectif sur la période en cours : après l'annonce d'un retrait, l'apport restant est réduit. */
function apportPeriode(monde: Monde, e: Ecurie, fi: Finances, annee: number): number {
  const base = apportAnnuel(monde, e, fi, annee);
  const ch = fi.chocApport;
  if (!ch || ch.annee !== annee || monde.date.semaine < ch.semaine) return base;
  if (!ch.annonce) {
    ch.annonce = true;
    const p = proprietaireDe(monde, e.id);
    ajouterEvenement(monde, {
      type: 'proprietaire.retrait', acteurs: [...(p ? [{ id: p.id, role: 'auteur' }] : []), { id: e.id, role: 'cible' }], importance: 3, visibilite: 'public',
      contexte: { reduction: Math.round(100 * (1 - ch.facteur)) }, texte: `Le propriétaire de ${e.nom} réduit brutalement son soutien (−${Math.round(100 * (1 - ch.facteur))} % de son apport).`,
    });
  }
  return base * ch.facteur;
}

/** Tirage annuel (au budget) d'un éventuel retrait du propriétaire en cours d'année. */
function tirerRetrait(monde: Monde, e: Ecurie, fi: Finances, annee: number): void {
  const p = proprietaireDe(monde, e.id);
  if (!p) return;
  const f = tirageLocal(monde, 'proprietaire.retrait', e.id, annee);
  if (!f.chance(RETRAIT_PROPRIETAIRE.probabiliteParAn[p.type] ?? 0.03)) return;
  fi.chocApport = {
    annee, semaine: f.entier(RETRAIT_PROPRIETAIRE.semaineMin, RETRAIT_PROPRIETAIRE.semaineMax),
    facteur: 1 - (RETRAIT_PROPRIETAIRE.reductionMin + f.suivant() * (RETRAIT_PROPRIETAIRE.reductionMax - RETRAIT_PROPRIETAIRE.reductionMin)),
  };
}

export function apportAnnuel(monde: Monde, e: Ecurie, fi: Finances, annee: number): number {
  const p = proprietaireDe(monde, e.id);
  if (!p) return 0;
  const profil = PROPRIETAIRES[p.type] ?? PROPRIETAIRES['consortium']!;
  const f = tirageLocal(monde, 'proprietaire', e.id, annee);
  const proche = forceEcurie(monde, e.id); // 1 = au sommet
  const dernier = fi.historique.at(-1);
  const deficit = dernier ? Math.max(0, totalDepenses(dernier) - totalRecettes(dernier)) / Math.max(1, totalRecettes(dernier)) : 0;
  const envie = 1 + profil.sensibiliteResultats * ((p.ambition - 10) / 10) * (proche - 0.3) - profil.sensibilitePertes * deficit;
  const variation = (1 - profil.stabilite) * f.normale(0, 1) + f.normale(0, ALEA_APPORT);
  // D-179, levier C : objectif de l'an dernier atteint → apport majoré cette saison.
  const bonus = fi.bonusApport?.annee === annee ? fi.bonusApport.facteur : 1;
  return Math.max(0, p.apportBaseMEUR * envie * (1 + variation) * bonus);
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
    operations: OPERATIONS_PAR_GP * nombreGrandsPrix(monde),
    // D-181 : entretien progressif (niveau²) : rester au sommet coûte, rattraper coûte moins cher.
    entretien: inst.reduce((a, i) => a + INSTALLATIONS_COUT.entretienParNiveauCarre * i.niveau ** 2 * (1 + Math.min(i.ageAnnees, INSTALLATIONS_COUT.ageMaxEntretien) / 30), 0),
    salairesHorsPlafond: horsPlafond.reduce((a, c) => a + c.salaireMEUR, 0),
    marketing: fi ? PART_MARKETING * (commercialAnnuel(monde, e, fi) + revenusSponsors(monde, e.id, monde.date.annee)) : 0,
  };
}

/* ---------------------------------------------------------------- Bilan annuel et budget */

/** Clôture l'année écoulée : contrôle du plafond, sanctions, historique. */
function cloturer(monde: Monde, e: Ecurie, fi: Finances): void {
  const c = fi.comptes;
  if (c.annee >= monde.date.annee) return;
  const plafonnees = totalPlafonne(c);
  // Audit 5.2 : l'année écoulée est jugée avec SON plafond (voté l'année d'avant), pas avec celui qui vient d'entrer en vigueur.
  const cap = c.plafondMEUR ?? plafond(monde);
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
  fi.comptes = comptesVides(monde.date.annee); // audit 5.4 : nouvelle année ouverte tout de suite (plafond noté au budget annuel)
}

/**
 * Budget de l'année (IA du team principal, arbitré par le conseil) : recettes prévues − dépenses fixes − réserve visée,
 * plus une part de l'excédent de trésorerie ; le développement est limité par la marge sous le plafond.
 * Une écurie ambitieuse et joueuse peut choisir de dépasser légèrement le plafond (dilemme, pas interdiction).
 */
export function deciderBudget(monde: Monde, e: Ecurie, fi: Finances): number {
  const annee = monde.date.annee;
  const fixes = depensesFixes(monde, e);
  const recettes = primesAttendues(monde, e.id) + commercialAnnuel(monde, e, fi) + revenusSponsors(monde, e.id, annee) + apportAnnuel(monde, e, fi, annee);
  // Engagements hors exploitation (phase 5b) : intérêts de la dette, chantiers en cours (dans l'enveloppe annuelle).
  const engagements = fi.detteMEUR * tauxDette(fi, recettes) + coutAnnuelAcademie(monde, e.id)
    + Math.min(INVESTISSEMENT_ANNUEL_MAX, fi.projets.reduce((a, p) => a + Math.max(0, p.coutPrevuMEUR - p.depenseMEUR), 0));
  const fixesTotal = fixes.personnelPlafonne + fixes.departements + fixes.operations + fixes.entretien + fixes.salairesHorsPlafond + fixes.marketing + engagements;
  const proprietaire = proprietaireDe(monde, e.id);
  const tp = teamPrincipal(monde, e.id);
  const prudence = 1 + ((proprietaire?.patience ?? 10) - (tp?.traits['risque'] ?? 10)) / 40;
  const reserve = BUDGET_IA.periodesReserve * (fixesTotal / PERIODES_PAR_AN) * prudence;
  let disponible = recettes - fixesTotal + BUDGET_IA.partExcedentInvesti * (fi.tresorerieMEUR - reserve);
  // Emprunt offensif : un team principal joueur soutenu par un propriétaire joueur finance par la dette ce qui manque sous le plafond.
  let offensifDette = false;
  const risqueTP = tp?.traits['risque'] ?? 10;
  if ((proprietaire?.risque ?? 10) >= EMPRUNT_OFFENSIF.risqueProprietaire && risqueTP >= EMPRUNT_OFFENSIF.risqueTP) {
    const manque = plafond(monde) * (1 - MARGE_SECURITE_PLAFOND) - (fixes.personnelPlafonne + fixes.departements + fixes.operations + fixes.entretien) - disponible;
    const emprunt = Math.min(Math.max(0, manque), EMPRUNT_OFFENSIF.partCapacite * capaciteEmprunt(monde, e, fi, recettes));
    if (emprunt > 1) {
      fi.detteMEUR += emprunt;
      fi.tresorerieMEUR += emprunt;
      disponible += emprunt;
      offensifDette = true;
      ajouterEvenement(monde, { type: 'finances.emprunt', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 2, visibilite: 'prive', contexte: { montant: arrondi(emprunt), dette: arrondi(fi.detteMEUR), motif: 'offensif' } });
    }
  }
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
  if (offensifDette) strategie = 'endettement';
  dev = Math.max(DEVELOPPEMENT_MINIMUM, dev);
  // Audit 10.2 : un choix du team principal pour cette saison (fait avant la construction du budget annuel) est respecté.
  const choix = fi.budget.choixTP;
  if (choix && choix.annee === annee) { dev = choix.montantMEUR; strategie = 'choix_du_team_principal'; }
  fi.budget = { annee, developpementMEUR: arrondi(dev), plafondVise: arrondi(plafondVise), strategie, ...(choix ? { choixTP: choix } : {}) };
  // Audit 5.4 : les comptes de la nouvelle année sont ouverts dès la clôture (les versements de la semaine 1 y sont inscrits) ;
  // le plafond en vigueur cette année y est noté.
  if (fi.comptes.annee !== annee) fi.comptes = comptesVides(annee);
  fi.comptes.plafondMEUR = plafond(monde);
  tirerRetrait(monde, e, fi, annee);
  return reserve;
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
    sponsors: revenusSponsors(monde, e.id, annee) / n,
    apport: apportPeriode(monde, e, fi, annee) / n,
  };
  const depenses = {
    personnelPlafonne: fixes.personnelPlafonne / n, departements: fixes.departements / n, operations: fixes.operations / n,
    // Phase 12a : le développement payé = la part des programmes de recherche (au fil de l'année) + les projets de conception et de
    // fabrication réellement engagés depuis la dernière écriture (coûts de F1 Manager 2024) ; le budget n'est plus qu'un plafond de dépense.
    entretien: fixes.entretien / n, developpement: fi.budget.developpementMEUR * partRecherche(monde, e.id) / n + (fi.depensesTechniques?.aPayerMEUR ?? 0),
    salairesHorsPlafond: fixes.salairesHorsPlafond / n, marketing: fixes.marketing / n,
    // Phase 6b-2 : financement des affiliés de l'académie (hors plafond).
    academie: coutAnnuelAcademie(monde, e.id) / n,
  };
  if (fi.depensesTechniques) fi.depensesTechniques.aPayerMEUR = 0;
  for (const [k, v] of Object.entries(recettes)) (c as unknown as Record<string, number>)[k] = ((c as unknown as Record<string, number>)[k] ?? 0) + v;
  for (const [k, v] of Object.entries(depenses)) (c as unknown as Record<string, number>)[k] = ((c as unknown as Record<string, number>)[k] ?? 0) + v;
  fi.tresorerieMEUR += Object.values(recettes).reduce((a, b) => a + b, 0) - Object.values(depenses).reduce((a, b) => a + b, 0);
  // D-166 : argent plafonné réellement payé, ramené à l'année (lu par la progression des voitures). Relecture du 26/11/2026 : depuis la
  // phase 12a, les projets se paient d'un bloc ; on lisse donc sur les périodes écoulées de l'année (cumul payé / périodes × n), au
  // lieu d'extrapoler la seule dernière période (qui faisait sauter le facteur de 0,3 à 1,3 au gré des lancements).
  const periodesEcoulees = Math.max(1, Math.round((monde.date.semaine / 52) * n));
  fi.depensePeriode = { annee, plafonneesAnnuelMEUR: (n * totalPlafonne(c)) / periodesEcoulees };

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

  // Phase 5b : chantiers, puis trésorerie (intérêts, emprunt, remboursement, crise).
  avancerProjets(monde, e, fi);
  gererTresorerie(monde, e, fi, Object.values(depenses).reduce((a, b) => a + b, 0), n * Object.values(recettes).reduce((a, b) => a + b, 0));
  if (fi.etatCrise === 'crise' || fi.etatCrise === 'administration') negligerEntretien(monde, e);
}

/* ---------------------------------------------------------------- Conseil */

/**
 * D-179, levier C : objectif du propriétaire (bilan annuel). On juge l'objectif de la saison écoulée (atteint → apport majoré la saison
 * qui commence), puis on fixe le suivant : gagner une place (le champion : la garder). Visible par le joueur (événement privé).
 */
function objectifProprietaire(monde: Monde, e: Ecurie, fi: Finances): void {
  const p = proprietaireActif(monde, e.id);
  const s = table(monde, TABLES.saisons)[`ssn_${monde.date.annee - 1}`] as unknown as Saison | undefined;
  if (!p || !s) return;
  const rang = s.constructeurs.findIndex((c) => c.ecurie === e.id) + 1;
  if (rang <= 0) return;
  const o = fi.objectifProprietaire;
  if (o && o.annee === monde.date.annee - 1) {
    const atteint = rang <= o.place;
    // Le bonus récompense une PROGRESSION : garder la première place n'en donne pas (sinon le champion s'enrichit chaque année et
    // les dynasties remontent : mesuré, séries à 5 titres 30 % → 80 %).
    const bonus = parametre(monde, 'proprietaire.bonusObjectif', OBJECTIF_PROPRIETAIRE.bonusApport); // réglable pour les expériences
    if (atteint && bonus > 0 && o.place < (o.depart ?? o.place + 1) && (o.depart ?? 0) >= OBJECTIF_PROPRIETAIRE.placeMinBonus) fi.bonusApport = { annee: monde.date.annee, facteur: 1 + bonus };
    ajouterEvenement(monde, {
      type: 'proprietaire.objectif_bilan', acteurs: [{ id: p.id, role: 'auteur' }, { id: e.id, role: 'ecurie' }], importance: 2, visibilite: 'prive',
      contexte: { objectif: o.place, rang, atteint },
      texte: atteint && fi.bonusApport?.annee === monde.date.annee ? `Objectif du propriétaire atteint (${rang}e, objectif ${o.place}e) : son apport augmente de ${Math.round(100 * OBJECTIF_PROPRIETAIRE.bonusApport)} % cette saison.`
        : atteint ? `Objectif du propriétaire atteint (${rang}e) : la première place est gardée.` : `Objectif du propriétaire manqué (${rang}e, objectif ${o.place}e).`,
    });
  }
  const place = Math.max(1, rang - OBJECTIF_PROPRIETAIRE.progressionPlaces);
  fi.objectifProprietaire = { annee: monde.date.annee, place, depart: rang };
  ajouterEvenement(monde, {
    type: 'proprietaire.objectif', acteurs: [{ id: p.id, role: 'auteur' }, { id: e.id, role: 'ecurie' }], importance: 2, visibilite: 'prive',
    contexte: { place, annee: monde.date.annee },
    texte: `Le propriétaire de ${e.nom} fixe l'objectif de la saison : ${place === 1 ? 'le titre' : `${place}e place ou mieux`} au championnat constructeurs.`,
  });
}

/** Classement attendu par le conseil : rang des moyens financiers (recettes annuelles) parmi les écuries. */
function rangAttendu(monde: Monde, idEcurie: string): number {
  const moyens = ecuriesActives(monde).map((e) => {
    const fi = financesDe(monde, e.id);
    const h = fi?.historique.at(-1);
    return [e.id, h ? totalRecettes(h) : (fi?.revenusCommerciauxBaseMEUR ?? 0)] as const;
  }).sort((a, b) => b[1] - a[1]);
  return moyens.findIndex(([id]) => id === idEcurie) + 1;
}

/**
 * Évaluation annuelle du team principal par le conseil (remplace la règle provisoire de la phase 4).
 * Mêmes règles pour l'écurie pilotée par le joueur (D-089) : s'il est licencié, il perd la main sur l'écurie.
 */
function evaluerTeamPrincipal(monde: Monde, e: Ecurie): void {
  const tp = teamPrincipal(monde, e.id);
  const p = proprietaireDe(monde, e.id);
  if (!tp || !p) return;
  const saisons = (Object.values(table(monde, TABLES.saisons)) as unknown as Saison[]).filter((s) => s.termine).sort((a, b) => b.annee - a.annee).slice(0, 2);
  const attendu = rangAttendu(monde, e.id);
  // Phase 11 : « viser le titre » en conférence de presse relève l'exigence pour cette saison ; l'image pèse sur la patience.
  const attenduSaison = (annee: number) => (e.objectifAnnonce?.annee === annee && e.objectifAnnonce.niveau === 'titre' ? Math.min(attendu, CONFERENCES.objectifTitreRangAttendu) : attendu);
  const ecarts = saisons.map((s) => s.constructeurs.findIndex((c) => c.ecurie === e.id) + 1 - attenduSaison(s.annee));
  const patience = p.patience + patienceImage(e);
  const grave = (ecarts[0] ?? 0) >= CONSEIL.ecartGrave && patience <= CONSEIL.patienceMaxGrave;
  const repete = ecarts.length === 2 && ecarts.every((x) => x >= CONSEIL.ecartRepete) && patience <= CONSEIL.patienceMaxRepete;
  if (!(grave || repete)) return;
  if (!tirageLocal(monde, 'conseil.evaluation', e.id, monde.date.annee).chance(CONSEIL.probabilite)) return;
  const c = (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).find((x) => x.personne === tp.id && x.statut === 'actif' && x.type === 'emploi');
  if (!c) return;
  const joueur = !!e.pilotee;
  const evtConseil = ajouterEvenement(monde, {
    type: joueur ? 'conseil.licenciement_joueur' : 'conseil.licenciement_tp', acteurs: [{ id: e.id, role: 'auteur' }, { id: tp.id, role: 'cible' }],
    importance: joueur ? 5 : 4, visibilite: 'public', contexte: { ecarts, attendu, joueur },
    texte: joueur
      ? `Le conseil de ${e.nom} vous congédie : les résultats sont trop loin de ce que permettent les moyens de l'écurie.`
      : `Le conseil de ${e.nom} se sépare de son team principal, ${tp.prenom} ${tp.nom}.`,
  });
  if (joueur) e.pilotee = false; // le joueur perd la main ; l'IA reprend l'écurie et recrute un successeur
  liberer(monde, tp, c, 'licenciement', [evtConseil.id]);
}

/** Prolongation du team principal décidée par le conseil (semaine des négociations), joueur compris (D-089). */
function prolongationTeamPrincipal(monde: Monde, e: Ecurie): void {
  const tp = teamPrincipal(monde, e.id);
  const p = proprietaireDe(monde, e.id);
  if (!tp || !p) return;
  const c = (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).find((x) => x.personne === tp.id && x.statut === 'actif' && x.type === 'emploi');
  if (!c || c.fin !== monde.date.annee || c.nonProlonge) return;
  const s = (Object.values(table(monde, TABLES.saisons)) as unknown as Saison[]).filter((x) => x.termine).sort((a, b) => b.annee - a.annee)[0];
  const ecart = s ? s.constructeurs.findIndex((x) => x.ecurie === e.id) + 1 - rangAttendu(monde, e.id) : 0;
  const f = tirageLocal(monde, 'conseil.prolongation', c.id, monde.date.annee);
  if (ecart >= CONSEIL.ecartRepete && f.chance(0.7 - p.patience / 40)) {
    nePasProlonger(monde, c, e.id, 'résultats jugés insuffisants par le conseil');
    return;
  }
  // Audit 4.1 : une contre-offre du team principal reçoit une réponse (jusqu'à un plafond), puis le dernier mot ; sans accord, le conseil
  // décide explicitement de ne pas prolonger (avant : la contre-offre restait sans suite et le contrat expirait sans décision).
  let res = proposerProlongation(monde, c, e.id, valeurMarche(monde, tp), 2, [], 1);
  if (res.issue === 'contre_offre' && res.salaireDemande !== undefined) {
    res = proposerProlongation(monde, c, e.id, Math.min(res.salaireDemande, valeurMarche(monde, tp) * CONSEIL_CONTRE_OFFRE.plafondValeur), 2, [], 2, [res.evenement.id]);
  }
  if (res.issue !== 'accord' && c.statut === 'actif' && !c.nonProlonge) nePasProlonger(monde, c, e.id, 'pas d’accord avec le conseil sur la prolongation');
}

/* ---------------------------------------------------------------- Systèmes */

export const systemeEconomieAnnuelle: Systeme = {
  nom: 'economie.annuelle',
  executer({ monde, date, commanderIA }) {
    if (date.semaine !== 1) return;
    initialiserSponsors(monde);
    // Primes et satisfaction des sponsors de l'année écoulée (inscrites avant la clôture).
    evaluerSponsors(monde, date.annee - 1, (id) => financesDe(monde, id));
    for (const e of ecuriesActives(monde)) {
      const fi = financesDe(monde, e.id);
      if (!fi) continue;
      const cloture = fi.comptes.annee < date.annee;
      cloturer(monde, e, fi);
      if (!cloture) continue;
      vieillirInstallations(monde, e, fi);
      evaluerTeamPrincipal(monde, e);
      verifierLassitude(monde, e, fi, rangAttendu(monde, e.id));
      objectifProprietaire(monde, e, fi);
      verifierInvestisseur(monde, e, fi);
    }
    // Un team principal remercié est remplacé avant de bâtir le budget.
    if (ecuriesActives(monde).some((e) => !teamPrincipal(monde, e.id))) pourvoirPostes(monde);
    marcheSponsors(monde, date.annee);
    for (const e of ecuriesActives(monde)) {
      const fi = financesDe(monde, e.id);
      if (!fi || fi.budget.annee === date.annee) continue;
      const reserve = deciderBudget(monde, e, fi);
      // 27/11 : une écurie étranglée par ses coûts fixes réduit d'abord ses installations les moins rentables (même commande que le joueur).
      deciderReductions(monde, e, fi, commanderIA);
      deciderProjet(monde, e, fi, reserve, commanderIA);
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
  moteur.commandes.enregistrer(commandeEffectif).enregistrer(commandeChantier).enregistrer(commandeReduction);
  return moteur.ajouterSysteme(systemeEconomieAnnuelle).ajouterSysteme(systemeComptabilite).ajouterSysteme(systemeConseil).ajouterSysteme(systemeCapacites);
}


