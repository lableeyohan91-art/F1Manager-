/**
 * Dette, crises et rachats — phase 5b (docs/systemes/phase-5-economie.md §8).
 *
 * - Sous la réserve minimale, l'écurie emprunte, dans la limite acceptée par le propriétaire et la banque.
 * - Intérêts à chaque période ; remboursement quand la trésorerie est confortable.
 * - Trésorerie négative : crise (motivation du personnel en baisse, événement causé), sauvetage possible par le propriétaire,
 *   puis administration et rachat si la crise dure.
 * - Lassitude : un propriétaire impatient qui perd de l'argent et des places peut vendre.
 */

import {
  CRISE_MOTIVATION, INVESTISSEUR, LASSITUDE, LIMITE_DETTE_RECETTES, PERIODES_CRISE_AVANT_ADMINISTRATION, PERIODES_PAR_AN, RACHAT, REMBOURSEMENT, REPRENEURS,
  RESERVE_MINIMALE_PERIODES, SAUVETAGE, TAUX_DETTE,
} from '../../balance/finances';
import { ajouterEvenement } from '../../core/evenements';
import { nouvelIdentifiant } from '../../core/identifiants';
import { tirageLocal } from '../../core/moteur';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { totalDepenses, totalRecettes } from '../../model/finances';
import { TABLES, type Contrat, type Ecurie, type Finances, type Personne, type Proprietaire, type Saison, type TypeProprietaire } from '../../model/types';
import { liberer, pourvoirPostes } from '../humain/contrats';
import { teamPrincipal } from '../humain/decision';

const arrondi = (x: number) => Math.round(x * 10) / 10;
const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

export function proprietaireActif(monde: Monde, idEcurie: string): Proprietaire | undefined {
  const t = table(monde, TABLES.proprietaires);
  return idsTries(t).map((id) => t[id] as unknown as Proprietaire).find((p) => p.ecurie === idEcurie && p.actif !== false);
}

export function tauxDette(fi: Finances, recettesAnnuelles: number): number {
  return Math.min(TAUX_DETTE.max, TAUX_DETTE.base + TAUX_DETTE.primeRisque * (fi.detteMEUR / Math.max(1, recettesAnnuelles)));
}

/** Capacité d'emprunt restante : limite acceptée par le propriétaire (goût du risque) moins la dette existante. */
export function capaciteEmprunt(monde: Monde, e: Ecurie, fi: Finances, recettesAnnuelles: number): number {
  const p = proprietaireActif(monde, e.id);
  return Math.max(0, LIMITE_DETTE_RECETTES * recettesAnnuelles * (0.5 + (p?.risque ?? 10) / 20) - fi.detteMEUR);
}

/**
 * Gestion de trésorerie en fin de période : intérêts, emprunt, remboursement, état de santé.
 * `depensesPeriode` et `recettesAnnuelles` sont les ordres de grandeur de l'année en cours.
 */
export function gererTresorerie(monde: Monde, e: Ecurie, fi: Finances, depensesPeriode: number, recettesAnnuelles: number): void {
  const interets = (fi.detteMEUR * tauxDette(fi, recettesAnnuelles)) / PERIODES_PAR_AN;
  fi.comptes.interets += interets;
  fi.tresorerieMEUR -= interets;

  const reserve = RESERVE_MINIMALE_PERIODES * depensesPeriode;
  if (fi.tresorerieMEUR < reserve) {
    const emprunt = Math.min(capaciteEmprunt(monde, e, fi, recettesAnnuelles), 1.5 * reserve - fi.tresorerieMEUR);
    if (emprunt > 0.5) {
      fi.detteMEUR += emprunt;
      fi.tresorerieMEUR += emprunt;
      ajouterEvenement(monde, {
        type: 'finances.emprunt', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 2, visibilite: 'prive',
        contexte: { montant: arrondi(emprunt), dette: arrondi(fi.detteMEUR) },
      });
    }
  } else if (fi.detteMEUR > 0 && fi.tresorerieMEUR > REMBOURSEMENT.seuilPeriodes * depensesPeriode) {
    const r = Math.min(fi.detteMEUR, (fi.tresorerieMEUR - REMBOURSEMENT.seuilPeriodes * depensesPeriode) * REMBOURSEMENT.part);
    fi.detteMEUR -= r;
    fi.tresorerieMEUR -= r;
    // Audit 5.12 : un remboursement est inscrit comme un fait.
    if (r > 0.5) ajouterEvenement(monde, { type: 'finances.remboursement', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 1, visibilite: 'prive', contexte: { montant: arrondi(r), dette: arrondi(fi.detteMEUR) } });
  }

  const avant = fi.etatCrise;
  if (fi.tresorerieMEUR < 0) {
    fi.etatCrise = 'crise';
    fi.periodesEnCrise++;
  } else {
    fi.etatCrise = fi.tresorerieMEUR < reserve ? 'tension' : 'sain';
    fi.periodesEnCrise = 0;
  }
  if (fi.etatCrise === 'crise' && avant !== 'crise') entrerEnCrise(monde, e, fi);
  if (fi.etatCrise === 'tension' && avant === 'sain') {
    ajouterEvenement(monde, { type: 'finances.tension', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 2, visibilite: 'prive', contexte: { tresorerie: arrondi(fi.tresorerieMEUR), dette: arrondi(fi.detteMEUR) } });
  }
  if (fi.etatCrise === 'crise') tenterSauvetage(monde, e, fi, depensesPeriode);
}

/** Entrée en crise : salaires menacés, le personnel le ressent (motivation), événement public. */
function entrerEnCrise(monde: Monde, e: Ecurie, fi: Finances): void {
  const ev = ajouterEvenement(monde, {
    type: 'finances.crise', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 3, visibilite: 'public',
    contexte: { tresorerie: arrondi(fi.tresorerieMEUR), dette: arrondi(fi.detteMEUR) },
    texte: `${e.nom} est en crise financière : trésorerie négative, salaires menacés.`,
  });
  const t = table(monde, TABLES.personnes);
  for (const id of idsTries(t)) {
    const p = t[id] as unknown as Personne;
    if (p.statut === 'actif' && p.ecurie === e.id) p.etat.motivation = Math.max(0, p.etat.motivation - CRISE_MOTIVATION);
  }
  fi.evenementCrise = ev.id; // audit 5.12 : cause du sauvetage, de l'administration ou du rachat qui suivront
}

/** Sauvetage par le propriétaire, sinon administration puis rachat si la crise dure. */
function tenterSauvetage(monde: Monde, e: Ecurie, fi: Finances, depensesPeriode: number): void {
  const p = proprietaireActif(monde, e.id);
  const f = tirageLocal(monde, 'crise.sauvetage', e.id, monde.date.annee, monde.date.semaine);
  if (p && f.chance(borner((SAUVETAGE[p.type] ?? 0.4) + (p.ambition - 10) / 40, 0, 0.95))) {
    const montant = -fi.tresorerieMEUR + 2 * depensesPeriode;
    fi.tresorerieMEUR += montant;
    fi.comptes.apportsExceptionnels += montant;
    fi.etatCrise = 'tension';
    fi.periodesEnCrise = 0;
    ajouterEvenement(monde, {
      type: 'proprietaire.sauvetage', acteurs: [{ id: p.id, role: 'auteur' }, { id: e.id, role: 'ecurie' }], causes: fi.evenementCrise && monde.evenements[fi.evenementCrise] ? [fi.evenementCrise] : [], importance: 3, visibilite: 'public',
      contexte: { montant: arrondi(montant) }, texte: `Le propriétaire de ${e.nom} injecte ${arrondi(montant)} M€ pour sauver l'écurie.`,
    });
    return;
  }
  if (fi.periodesEnCrise >= PERIODES_CRISE_AVANT_ADMINISTRATION) {
    fi.etatCrise = 'administration';
    ajouterEvenement(monde, {
      type: 'finances.administration', acteurs: [{ id: e.id, role: 'ecurie' }], causes: fi.evenementCrise && monde.evenements[fi.evenementCrise] ? [fi.evenementCrise] : [], importance: 4, visibilite: 'public',
      contexte: { dette: arrondi(fi.detteMEUR), tresorerie: arrondi(fi.tresorerieMEUR) }, texte: `${e.nom} est placée sous administration.`,
    });
    racheter(monde, e, fi, 'administration', depensesPeriode);
  }
}

/** Changement de propriétaire : nouveau type, nouvelle personnalité, dette en partie effacée, réserve injectée. */
export function racheter(monde: Monde, e: Ecurie, fi: Finances, motif: 'administration' | 'lassitude' | 'investisseur', depensesPeriode: number, exigences: { apportMin?: number; ambitionMin?: number } = {}): void {
  const ancien = proprietaireActif(monde, e.id);
  const f = tirageLocal(monde, 'rachat', e.id, monde.date.annee, monde.date.semaine);
  const types = Object.keys(REPRENEURS) as TypeProprietaire[];
  const type = f.choisirPondere(types, types.map((t) => REPRENEURS[t]!.poids));
  const r = REPRENEURS[type]!;
  const trait = () => Math.round(borner(f.normale(10.5, 3.5), 1, 20));
  const nouveau: Proprietaire = {
    id: nouvelIdentifiant(monde, 'pro'), ecurie: e.id, type, apportBaseMEUR: arrondi(Math.max(exigences.apportMin ?? 0, r.apportMin + f.suivant() * (r.apportMax - r.apportMin))),
    patience: trait(), ambition: Math.max(exigences.ambitionMin ?? 0, trait()), risque: trait(), actif: true, depuis: monde.date.annee,
  };
  if (ancien) ancien.actif = false;
  table(monde, TABLES.proprietaires)[nouveau.id] = nouveau as unknown as Entite;
  delete fi.chocApport; // audit 5.3 : le retrait de l'ancien propriétaire ne s'applique pas au nouveau
  const efface = RACHAT.partDetteEffacee * fi.detteMEUR;
  fi.detteMEUR -= efface;
  const injection = Math.max(0, -fi.tresorerieMEUR) + RACHAT.periodesReserveInjectees * depensesPeriode;
  fi.tresorerieMEUR += injection;
  fi.comptes.apportsExceptionnels += injection;
  fi.etatCrise = 'sain';
  fi.periodesEnCrise = 0;
  const ev = ajouterEvenement(monde, {
    type: 'proprietaire.rachat', acteurs: [{ id: e.id, role: 'ecurie' }, { id: nouveau.id, role: 'acheteur' }, ...(ancien ? [{ id: ancien.id, role: 'vendeur' }] : [])],
    importance: 4, visibilite: 'public', contexte: { motif, type, detteEffacee: arrondi(efface), injection: arrondi(injection) },
    texte: motif === 'investisseur'
      ? `Un investisseur ambitieux rachète ${e.nom}, qui stagnait en fond de grille : plus de moyens, et de nouvelles exigences.`
      : `${e.nom} change de propriétaire (${motif === 'administration' ? 'rachat après administration' : 'vente par un propriétaire lassé'}).`,
  });
  // Le nouveau propriétaire veut souvent son propre team principal.
  const tp = teamPrincipal(monde, e.id);
  if (tp && f.chance(RACHAT.probabiliteChangementTP)) {
    const c = (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).find((x) => x.personne === tp.id && x.statut === 'actif' && x.type === 'emploi');
    if (c) {
      const evtTp = ajouterEvenement(monde, {
        type: e.pilotee ? 'conseil.licenciement_joueur' : 'conseil.licenciement_tp', acteurs: [{ id: e.id, role: 'auteur' }, { id: tp.id, role: 'cible' }],
        importance: e.pilotee ? 5 : 3, visibilite: 'public', causes: [ev.id], contexte: { motif: 'nouveau_proprietaire' },
        texte: `Le nouveau propriétaire de ${e.nom} remplace le team principal.`,
      });
      if (e.pilotee) e.pilotee = false;
      liberer(monde, tp, c, 'licenciement', [evtTp.id]);
      pourvoirPostes(monde);
    }
  }
}

/** Lassitude (bilan annuel) : déficits répétés + mauvais résultats + propriétaire impatient → vente possible. */
export function verifierLassitude(monde: Monde, e: Ecurie, fi: Finances, rangAttendu: number): void {
  const p = proprietaireActif(monde, e.id);
  if (!p || p.patience > LASSITUDE.patienceMax || (p.depuis && monde.date.annee - p.depuis < LASSITUDE.anneesDeficit)) return;
  const h = fi.historique.slice(-LASSITUDE.anneesDeficit);
  if (h.length < LASSITUDE.anneesDeficit || !h.every((x) => totalDepenses(x) > totalRecettes(x))) return;
  const s = table(monde, TABLES.saisons)[`ssn_${monde.date.annee - 1}`] as unknown as Saison | undefined;
  const rang = s ? s.constructeurs.findIndex((c) => c.ecurie === e.id) + 1 : 0;
  if (rang <= rangAttendu) return;
  if (!tirageLocal(monde, 'proprietaire.lassitude', e.id, monde.date.annee).chance(LASSITUDE.probabilite)) return;
  racheter(monde, e, fi, 'lassitude', totalDepenses(h.at(-1)!) / PERIODES_PAR_AN);
}

/**
 * D-179, levier A : investisseur d'opportunité (bilan annuel). Une écurie qui stagne dans les dernières places sans être en crise vaut peu ;
 * un repreneur ambitieux peut l'acheter pour la faire monter. Mêmes règles pour l'écurie du joueur (nouveau patron, nouvelles exigences).
 */
export function verifierInvestisseur(monde: Monde, e: Ecurie, fi: Finances): void {
  const p = proprietaireActif(monde, e.id);
  if (!p || fi.etatCrise === 'administration') return;
  if (p.depuis && monde.date.annee - p.depuis < INVESTISSEUR.delaiDepuisRachat) return;
  const saisons = table(monde, TABLES.saisons);
  let enBas = 0;
  for (let k = 1; k <= INVESTISSEUR.fenetreSaisons; k++) {
    const s = saisons[`ssn_${monde.date.annee - k}`] as unknown as Saison | undefined;
    if (!s) return; // historique trop court
    const rang = s.constructeurs.findIndex((c) => c.ecurie === e.id) + 1;
    if (rang > 0 && rang > s.constructeurs.length - INVESTISSEUR.placesBas) enBas++;
  }
  if (enBas < INVESTISSEUR.saisonsBasMin) return;
  const proba = borner(INVESTISSEUR.probabiliteBase + INVESTISSEUR.parPointImpatience * (10 - p.patience), INVESTISSEUR.probabiliteMin, INVESTISSEUR.probabiliteMax);
  if (!tirageLocal(monde, 'proprietaire.investisseur', e.id, monde.date.annee).chance(proba)) return;
  const dernier = fi.historique.at(-1);
  racheter(monde, e, fi, 'investisseur', dernier ? totalDepenses(dernier) / PERIODES_PAR_AN : 0, { apportMin: INVESTISSEUR.hausseApportMin * p.apportBaseMEUR, ambitionMin: INVESTISSEUR.ambitionMin });
}
