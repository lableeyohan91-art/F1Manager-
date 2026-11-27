/**
 * Tableau de bord prévisionnel (D-180, levier B ; fiche docs/systemes/economie-capacites-et-previsions.md §B).
 *
 * Fonction PURE : elle ne modifie rien. Elle rejoue les règles comptables existantes (écritures toutes les 4 semaines, chantiers,
 * intérêts, bilan annuel et dividendes) jusqu'à la fin de l'année, au niveau actuel des recettes et des dépenses, SANS les imprévus
 * (retrait non annoncé du propriétaire, crise, emprunts, primes de sponsors non acquises), signalés à part. La même fonction peut servir à l'IA.
 */

import { DIVIDENDES, INVESTISSEMENT_ANNUEL_MAX, PART_DIVIDENDES, PERIODES_PAR_AN } from '../../balance/finances';
import { ENVELOPPE_PRIMES_MEUR, PARTS_PRIMES } from '../../balance/reglement';
import { PREVISIONS } from '../../balance/previsions';
import { parametre, table, type Monde } from '../../core/monde';
import { totalDepenses, totalPlafonne, totalRecettes } from '../../model/finances';
import { TABLES, type ClauseSponsor, type Contrat, type Ecurie, type Finances, type Saison } from '../../model/types';
import { coutAnnuelAcademie } from '../juniors/academies';
import { partRecherche } from '../technique/acces';
import { tauxDette } from './crises';
import { apportAnnuel, commercialAnnuel, depensesFixes, financesDe, plafond, primesAttendues, proprietaireDe, rangPrecedent } from './index';
import { enveloppeInvestissement } from './infrastructures';
import { bilanSaison } from './probabilites';
import { contratsActifs, revenusSponsors } from './sponsors';

export interface PrevisionFinances {
  annee: number;
  /** Écritures comptables restantes cette année (sur 13). */
  periodesRestantes: number;
  tresorerie: { maintenant: number; dansQuatreSemaines: number; finAvantDividendes: number; finApresDividendes: number };
  /** Recettes restantes de l'année : garanties (au niveau actuel), primes de sponsors probables (comptées) et primes encore possibles au-delà (non comptées). */
  recettes: { primes: number; droits: number; sponsors: number; apport: number; garanties: number; primesSponsorsProbables: number; conditionnelles: number };
  /** Dépenses restantes de l'année, au niveau actuel. */
  depenses: { plafonneesFixes: number; developpement: number; horsPlafond: number; chantiers: number; interets: number; total: number };
  plafond: { montant: number; depense: number; aVenir: number; marge: number; depassementPrevu: number };
  developpement: { budget: number; payePrevu: number; nonDepensable: number; fiable: boolean };
  dividendes: { montant: number; seuil: number; part: number; typeProprietaire: string };
  saisonSuivante: {
    primesALaPlace: number; placeActuelle: number; gainUnePlace: number; pertesUnePlace: number;
    sponsorsQuiFinissent: number; sponsorsMontantPerdu: number; contratsQuiFinissent: number; salairesLiberes: number;
  };
  alertes: string[];
}

const arrondi = (x: number) => Math.round(x * 10) / 10;
/** Écritures restantes : semaines multiples de 4, de la semaine courante (pas encore jouée) à 52. */
export const periodesRestantes = (semaine: number) => Math.max(0, PERIODES_PAR_AN - Math.floor((semaine - 1) / 4));

function primesSelonPlace(place: number, n: number): number {
  const parts = PARTS_PRIMES.slice(0, n);
  const total = parts.reduce((a, b) => a + b, 0) || 1;
  return (ENVELOPPE_PRIMES_MEUR * (parts[Math.min(Math.max(place, 1), parts.length) - 1] ?? 0)) / total;
}

export function previsionFinances(monde: Monde, idEcurie: string): PrevisionFinances | undefined {
  const fi = financesDe(monde, idEcurie) as Finances | undefined;
  const e = table(monde, TABLES.ecuries)[idEcurie] as unknown as Ecurie | undefined;
  const annee = monde.date.annee, n = PERIODES_PAR_AN;
  // Pas de prévision avant que le budget de l'année soit établi (semaine 1, avant les systèmes) : elle n'aurait pas de sens.
  if (!fi || !e || fi.budget.annee !== annee) return undefined;
  const R = fi.comptes.annee === annee ? periodesRestantes(monde.date.semaine) : 0;
  const P = n - R;
  const c = fi.comptes;
  const fixes = depensesFixes(monde, e);

  // Recettes d'une écriture (mêmes formules que la comptabilité ; retrait du propriétaire compté seulement s'il est annoncé).
  const ch = fi.chocApport;
  const apportAn = apportAnnuel(monde, e, fi, annee) * (ch && ch.annee === annee && ch.annonce ? ch.facteur : 1);
  const rec = { primes: primesAttendues(monde, idEcurie) / n, droits: commercialAnnuel(monde, e, fi) / n, sponsors: revenusSponsors(monde, idEcurie, annee) / n, apport: apportAn / n };
  const recPeriode = rec.primes + rec.droits + rec.sponsors + rec.apport;

  // Développement : la recherche au fil de l'année ; les projets selon les Grands Prix restants. Une pièce vaut par les courses qui
  // restent : les projets se concentrent en début d'année (mesuré : 39 % au premier mois, moins de 1 % au dernier). Part restante estimée
  // r = (Grands Prix restants / calendrier)^exposant ; projets restants = déjà payés × r / (1 − r), bornés par le budget restant.
  // Avant `periodesMinRythme` écritures, on suit le budget (prévision peu fiable, signalée).
  const saison = table(monde, TABLES.saisons)[`ssn_${annee}`] as unknown as Saison | undefined;
  const nGP = saison?.calendrier.length ?? 0, faits = saison?.leaders.length ?? 0, gpRestants = Math.max(0, nGP - faits);
  const budget = fi.budget.annee === annee ? fi.budget.developpementMEUR : 0;
  const partRech = partRecherche(monde, idEcurie);
  const recherchePeriode = (budget * partRech) / n;
  const projetsPayes = fi.depensesTechniques?.annee === annee ? fi.depensesTechniques.projetsMEUR : 0;
  const fiable = P >= PREVISIONS.periodesMinRythme;
  const r = nGP ? Math.min(PREVISIONS.partRestanteMax, (gpRestants / nGP) ** PREVISIONS.exposantFinDeSaison) : 0;
  const projetsEstimes = fiable ? (projetsPayes * r) / (1 - r) : budget * (1 - partRech) * (R / n);
  const projetsRestants = Math.max(0, Math.min(projetsEstimes, budget * (1 - partRech) - projetsPayes));
  const projetsParPeriode = R > 0 ? projetsRestants / R : 0;
  const aPayer = fi.depensesTechniques?.aPayerMEUR ?? 0;
  const devRestant = R * recherchePeriode + projetsRestants + aPayer;

  const plafonneesFixesPeriode = (fixes.personnelPlafonne + fixes.departements + fixes.operations + fixes.entretien) / n;
  const horsPlafondPeriode = (fixes.salairesHorsPlafond + fixes.marketing + coutAnnuelAcademie(monde, idEcurie)) / n;

  // Chantiers d'installations : paiement au rythme prévu, dans l'enveloppe annuelle restante.
  let enveloppe = Math.max(0, enveloppeInvestissement(monde, idEcurie) - c.investissements);
  let chantiers = 0, chantierPeriode = 0;
  for (const p of fi.projets) {
    const restantSemaines = Math.max(4, p.dureeReelleSemaines - p.avancementSemaines);
    const besoinPeriode = Math.max(0, ((p.coutReelMEUR - p.depenseMEUR) * 4) / restantSemaines);
    const total = Math.min(enveloppe, Math.min(R, Math.ceil(restantSemaines / 4)) * besoinPeriode, p.coutReelMEUR - p.depenseMEUR);
    enveloppe -= total; chantiers += total; chantierPeriode += Math.min(besoinPeriode, total);
  }
  const interetsPeriode = (fi.detteMEUR * tauxDette(fi, n * recPeriode)) / n;
  const depPeriode = plafonneesFixesPeriode + horsPlafondPeriode + recherchePeriode + projetsParPeriode;

  const recRestantes = R * recPeriode;
  const depRestantes = R * (plafonneesFixesPeriode + horsPlafondPeriode) + devRestant + chantiers + R * interetsPeriode;
  const finSansPrimes = fi.tresorerieMEUR + recRestantes - depRestantes;

  // Primes de sponsors. Maximum : toutes les clauses annuelles et tous les objectifs des Grands Prix restants. Probable (compté dans la
  // trésorerie prévue) : les clauses tenues au rythme actuel (place actuelle ; podiums, victoires et arrivées dans les points extrapolés au
  // calendrier) et la valeur attendue des objectifs de course restants (la prime d'un objectif × sa probabilité = la part du Grand Prix).
  const contrats = contratsActifs(monde, annee, idEcurie);
  const bilan = bilanSaison(monde, annee, idEcurie);
  const rangCourant = saison ? saison.constructeurs.findIndex((x) => x.ecurie === idEcurie) + 1 : 0;
  const auRythme = (k: number) => (faits > 0 ? (k * nGP) / faits : 0);
  const tenueAuRythme = (cl: ClauseSponsor) => {
    if (faits === 0) return cl.probabilite >= 0.5;
    switch (cl.type) {
      case 'rang': case 'progression': return rangCourant > 0 && rangCourant <= cl.seuil;
      case 'podium': return auRythme(bilan.podiums) >= cl.seuil;
      case 'victoire': return auRythme(bilan.victoires) >= cl.seuil;
      case 'arrivees_points': return auRythme(bilan.arriveesPoints) >= cl.seuil;
    }
  };
  let primesMax = 0, primesProbables = 0;
  for (const k of contrats) {
    for (const cl of k.clauses) { primesMax += cl.primeMEUR; if (tenueAuRythme(cl)) primesProbables += cl.primeMEUR; }
    if (k.enveloppeGPMEUR && nGP) {
      const part = k.enveloppeGPMEUR / nGP;
      primesMax += gpRestants * part * PREVISIONS.primeMaxObjectifGP;
      primesProbables += gpRestants * part;
    }
  }
  const finAvant = finSansPrimes + primesProbables;
  const conditionnelles = primesMax - primesProbables;

  // Bilan : dividendes (même règle que la clôture), sur les dépenses de l'année complète.
  const p = proprietaireDe(monde, idEcurie);
  const part = p ? PART_DIVIDENDES[p.type] ?? 0.5 : 0;
  const seuil = DIVIDENDES.seuilAnneesDepenses * (totalDepenses(c) + depRestantes);
  const dividendes = p ? Math.max(0, part * (finAvant - seuil)) : 0;

  // Plafond.
  const cap = plafond(monde);
  const depense = totalPlafonne(c);
  const aVenir = R * plafonneesFixesPeriode + devRestant;
  const depassementPrevu = Math.max(0, depense + aVenir - cap);

  // Saison suivante.
  const nEcuries = (Object.values(table(monde, TABLES.ecuries)) as unknown as Ecurie[]).filter((x) => x.statut === 'active').length;
  // Avant la première course, la place de l'an dernier.
  const place = faits > 0 && rangCourant > 0 ? rangCourant : rangPrecedent(monde, idEcurie).rang;
  const primesALaPlace = primesSelonPlace(place, nEcuries);
  const finissent = contrats.filter((k) => k.fin === annee);
  const emplois = (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).filter((k) => k.statut === 'actif' && k.type === 'emploi' && k.organisation === idEcurie && k.fin === annee);

  const devAnnuel = c.developpement + devRestant;
  const nonDepensable = Math.max(0, budget - devAnnuel);

  const alertes: string[] = [];
  if (depassementPrevu > PREVISIONS.toleranceMEUR) alertes.push(`Dépassement du plafond prévu : ${arrondi(depassementPrevu)} M€ (amende et soufflerie réduite).`);
  if (finAvant < 0) alertes.push(`Trésorerie négative prévue en fin d'année (${arrondi(finAvant)} M€) : la direction financière coupera le développement.`);
  if (fiable && nonDepensable > PREVISIONS.nonDepensableSignale) alertes.push(`Environ ${Math.round(nonDepensable)} M€ du budget de développement ne seront pas dépensés au rythme actuel des projets.`);
  if (ch && ch.annee === annee && ch.annonce) alertes.push(`Le propriétaire a réduit son apport de ${Math.round(100 * (1 - ch.facteur))} % cette année.`);

  return {
    annee, periodesRestantes: R,
    tresorerie: {
      maintenant: arrondi(fi.tresorerieMEUR),
      dansQuatreSemaines: arrondi(R > 0 ? fi.tresorerieMEUR + recPeriode - depPeriode - chantierPeriode - interetsPeriode - aPayer : fi.tresorerieMEUR),
      finAvantDividendes: arrondi(finAvant), finApresDividendes: arrondi(finAvant - dividendes),
    },
    recettes: { primes: arrondi(R * rec.primes), droits: arrondi(R * rec.droits), sponsors: arrondi(R * rec.sponsors), apport: arrondi(R * rec.apport), garanties: arrondi(recRestantes), primesSponsorsProbables: arrondi(primesProbables), conditionnelles: arrondi(conditionnelles) },
    depenses: {
      plafonneesFixes: arrondi(R * plafonneesFixesPeriode), developpement: arrondi(devRestant), horsPlafond: arrondi(R * horsPlafondPeriode),
      chantiers: arrondi(chantiers), interets: arrondi(R * interetsPeriode), total: arrondi(depRestantes),
    },
    plafond: { montant: arrondi(cap), depense: arrondi(depense), aVenir: arrondi(aVenir), marge: arrondi(cap - depense - aVenir), depassementPrevu: arrondi(depassementPrevu) },
    developpement: { budget: arrondi(budget), payePrevu: arrondi(devAnnuel), nonDepensable: arrondi(nonDepensable), fiable },
    dividendes: { montant: arrondi(dividendes), seuil: arrondi(seuil), part, typeProprietaire: p?.type ?? '' },
    saisonSuivante: {
      primesALaPlace: arrondi(primesALaPlace), placeActuelle: place,
      gainUnePlace: arrondi(place > 1 ? primesSelonPlace(place - 1, nEcuries) - primesALaPlace : 0),
      pertesUnePlace: arrondi(place < nEcuries ? primesALaPlace - primesSelonPlace(place + 1, nEcuries) : 0),
      sponsorsQuiFinissent: finissent.length, sponsorsMontantPerdu: arrondi(finissent.reduce((a, k) => a + k.montantAnnuelMEUR, 0)),
      contratsQuiFinissent: emplois.length, salairesLiberes: arrondi(emplois.reduce((a, k) => a + k.salaireMEUR, 0)),
    },
    alertes,
  };
}

/** Recettes totales de l'année prévues (déjà encaissées + restantes garanties) : utile aux mesures de précision. */
export const recettesAnneePrevues = (fi: Finances, prev: PrevisionFinances) => totalRecettes(fi.comptes) + prev.recettes.garanties;
