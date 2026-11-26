/**
 * Économie, levier A (version 2 ; D-181, fiche docs/systemes/economie-capacites-et-previsions.md §E) — capacités achetables :
 * - recruter ou réduire les départements dont l'effectif agit sur le jeu (aéro, conception, production, fiabilité), par une commande
 *   commune au joueur et à l'IA (`departement.effectif`) : délai d'arrivée, préavis, frais et indemnités sous le plafond, cohésion ;
 * - effets de la production (vitesse de fabrication, dans monoplaces/conception) et de la fiabilité (abandons, détection des erreurs) ;
 * - décisions de l'IA (mêmes commandes) ; rendement décroissant des installations (`niveauUtile`, dans infrastructures).
 */

import { COUT_EMPLOYE } from '../../balance/finances';
import { COHESION_DEPARTEMENT, FIABILITE_DEPARTEMENT, IA_EFFECTIFS, PROJETS_PAR_POLE, RECRUTEMENT_DEPARTEMENT } from '../../balance/capacites';
import { rangSemaine, ajouterSemaines } from '../../core/calendrier';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement } from '../../core/evenements';
import { idsTries, table, type Monde } from '../../core/monde';
import type { Systeme } from '../../core/moteur';
import { TABLES, type Departement, type Ecurie, type Finances, type Personne } from '../../model/types';
import { forceEcurie, teamPrincipal } from '../humain/decision';
import { iaDecide } from '../joueur/acces';
import { financesDe } from './index';
import { previsionFinances } from './previsions';

export { niveauUtile } from './infrastructures';

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const r1 = (x: number) => Math.round(x * 10) / 10;
const r2 = (x: number) => Math.round(x * 100) / 100;
const LIBELLES: Record<string, string> = { aero: 'aérodynamique', conception: 'conception', production: 'production', fiabilite: 'fiabilité' };
export const DEPARTEMENTS_REGLABLES = Object.keys(RECRUTEMENT_DEPARTEMENT.bornes);

export function departementDe(monde: Monde, idEcurie: string, type: string): Departement | undefined {
  return (Object.values(table(monde, TABLES.departements)) as unknown as Departement[]).find((d) => d.ecurie === idEcurie && d.type === type);
}

/** Coût annuel d'une personne du département (M€), le même que celui des dépenses fixes. */
export const coutParPersonne = (d: Departement) => COUT_EMPLOYE.base + COUT_EMPLOYE.parPointNiveau * d.niveauMoyen;

/** Fiabilité : multiplicateur de la probabilité d'abandon mécanique (moins d'abandons avec un département plus fourni). */
export function facteurAbandon(monde: Monde, idEcurie: string): number {
  const d = departementDe(monde, idEcurie, 'fiabilite');
  if (!d) return 1;
  return borner((FIABILITE_DEPARTEMENT.reference / Math.max(1, d.effectif)) ** FIABILITE_DEPARTEMENT.exposant, FIABILITE_DEPARTEMENT.min, FIABILITE_DEPARTEMENT.max);
}

/** Fiabilité : multiplicateur de la détection des erreurs d'exécution des projets. */
export function facteurDetection(monde: Monde, idEcurie: string): number {
  const d = departementDe(monde, idEcurie, 'fiabilite');
  return d ? (d.effectif / FIABILITE_DEPARTEMENT.reference) ** FIABILITE_DEPARTEMENT.exposantDetection : 1;
}

/* ---------------------------------------------------------------- Commande commune */

function auteurAutorise(monde: Monde, auteur: string, idEcurie: string): boolean {
  const p = table(monde, TABLES.personnes)[auteur] as unknown as Personne | undefined;
  return !!p && p.statut === 'actif' && p.ecurie === idEcurie && (p.poste === 'team_principal' || p.poste === 'directeur_technique');
}

/** Niveau des recrues : celui du département, modulé par l'attrait de l'écurie et le choix de profils confirmés. */
export function niveauRecrues(monde: Monde, d: Departement, confirmes: boolean): number {
  const force = forceEcurie(monde, d.ecurie);
  const attrait = force >= RECRUTEMENT_DEPARTEMENT.forceAttirante ? RECRUTEMENT_DEPARTEMENT.niveauAttrait : force < RECRUTEMENT_DEPARTEMENT.forcePeuAttirante ? -RECRUTEMENT_DEPARTEMENT.niveauAttrait : 0;
  return borner(d.niveauMoyen + attrait + (confirmes ? RECRUTEMENT_DEPARTEMENT.niveauConfirmes : 0), 1, 20);
}

/** Coût immédiat (sous le plafond) d'un mouvement : frais de recrutement, ou indemnités de licenciement. */
export function coutImmediat(d: Departement, nombre: number, confirmes: boolean): number {
  return nombre > 0
    ? nombre * RECRUTEMENT_DEPARTEMENT.fraisParPersonne * (confirmes ? RECRUTEMENT_DEPARTEMENT.fraisConfirmes : 1)
    : -nombre * coutParPersonne(d) * RECRUTEMENT_DEPARTEMENT.indemniteAnnees;
}

export function motifRefusEffectifDepartement(monde: Monde, auteur: string, prm: Record<string, unknown>): string | null {
  const idEcurie = String(prm['ecurie'] ?? '');
  const e = table(monde, TABLES.ecuries)[idEcurie] as unknown as Ecurie | undefined;
  if (!e || e.statut !== 'active') return 'Écurie inconnue.';
  if (!auteurAutorise(monde, auteur, idEcurie)) return 'Seuls le team principal et le directeur technique décident des effectifs.';
  const type = String(prm['departement'] ?? '');
  const bornes = RECRUTEMENT_DEPARTEMENT.bornes[type];
  const d = departementDe(monde, idEcurie, type);
  if (!bornes || !d) return `Département réglable : ${DEPARTEMENTS_REGLABLES.map((x) => LIBELLES[x]).join(', ')}.`;
  const n = prm['nombre'];
  if (typeof n !== 'number' || !Number.isInteger(n) || Math.abs(n) < RECRUTEMENT_DEPARTEMENT.campagneMin || Math.abs(n) > RECRUTEMENT_DEPARTEMENT.campagneMax) {
    return `De ${RECRUTEMENT_DEPARTEMENT.campagneMin} à ${RECRUTEMENT_DEPARTEMENT.campagneMax} personnes à la fois (nombre négatif pour réduire).`;
  }
  if (d.mouvement) return 'Un mouvement de personnel est déjà en cours dans ce département.';
  const apres = d.effectif + n;
  if (apres < bornes[0] || apres > bornes[1]) return `L'effectif doit rester entre ${bornes[0]} et ${bornes[1]} personnes.`;
  const profil = prm['profil'];
  if (profil !== undefined && profil !== 'standard' && profil !== 'confirmes') return 'Profil : standard ou confirmés.';
  if (n < 0 && d.dernierRecrutement !== undefined && rangSemaine(monde.date) - d.dernierRecrutement < RECRUTEMENT_DEPARTEMENT.semainesSansLicenciement) {
    const fi = financesDe(monde, idEcurie);
    if (!fi || (fi.etatCrise !== 'crise' && fi.etatCrise !== 'administration')) return 'Pas de licenciement moins d’un an après un recrutement (sauf crise).';
  }
  return null;
}

export const commandeEffectif: DefinitionCommande = {
  type: 'departement.effectif',
  valider: (monde, c) => motifRefusEffectifDepartement(monde, c.auteur, c.parametres),
  appliquer({ monde }, c) {
    const idEcurie = String(c.parametres['ecurie']);
    const d = departementDe(monde, idEcurie, String(c.parametres['departement']))!;
    const n = Number(c.parametres['nombre']);
    const confirmes = c.parametres['profil'] === 'confirmes';
    const cout = r2(coutImmediat(d, n, confirmes));
    const fi = financesDe(monde, idEcurie) as Finances | undefined;
    if (fi) { fi.comptes.departements += cout; fi.tresorerieMEUR -= cout; } // sous le plafond (frais de personnel)
    const delai = n > 0 ? RECRUTEMENT_DEPARTEMENT.delaiArriveeSemaines : RECRUTEMENT_DEPARTEMENT.preavisSemaines;
    d.mouvement = { nombre: n, niveau: r1(n > 0 ? niveauRecrues(monde, d, confirmes) : d.niveauMoyen), effet: ajouterSemaines(monde.date, delai) };
    const e = table(monde, TABLES.ecuries)[idEcurie] as unknown as Ecurie;
    ajouterEvenement(monde, {
      type: n > 0 ? 'departement.recrutement' : 'departement.reduction', acteurs: [{ id: c.auteur, role: 'auteur' }, { id: idEcurie, role: 'ecurie' }],
      importance: Math.abs(n) >= 20 ? 2 : 1, visibilite: n < 0 && Math.abs(n) >= 20 ? 'public' : 'prive',
      contexte: { departement: d.type, nombre: n, niveau: d.mouvement.niveau, cout, profil: confirmes ? 'confirmes' : 'standard', effet: d.mouvement.effet },
      texte: n > 0
        ? `${e.nom} recrute ${n} personnes en ${LIBELLES[d.type]}${confirmes ? ' (profils confirmés)' : ''} : arrivée dans ${delai} semaines.`
        : `${e.nom} réduit son département ${LIBELLES[d.type]} de ${-n} personnes (${cout} M€ d'indemnités).`,
    });
  },
};

/* ---------------------------------------------------------------- Système hebdomadaire */

/** Arrivées et départs effectifs ; cohésion (perte à l'intégration, remontée chaque mois). */
function appliquerMouvements(monde: Monde): void {
  const maintenant = rangSemaine(monde.date);
  for (const id of idsTries(table(monde, TABLES.departements))) {
    const d = table(monde, TABLES.departements)[id] as unknown as Departement;
    if (d.mouvement && rangSemaine(d.mouvement.effet) <= maintenant) {
      const { nombre, niveau } = d.mouvement;
      const avant = d.effectif;
      d.effectif = Math.max(1, avant + nombre);
      if (nombre > 0) {
        d.niveauMoyen = r1(borner((avant * d.niveauMoyen + nombre * niveau) / d.effectif, 1, 20)) as Departement['niveauMoyen'];
        d.cohesion = r1(borner(d.cohesion - COHESION_DEPARTEMENT.perteParPartNouveaux * (nombre / d.effectif), 1, 20)) as Departement['cohesion'];
        d.dernierRecrutement = maintenant;
      } else {
        d.cohesion = r1(borner(d.cohesion - COHESION_DEPARTEMENT.perteParPartLicencies * (-nombre / avant), 1, 20)) as Departement['cohesion'];
      }
      delete d.mouvement;
      ajouterEvenement(monde, {
        type: 'departement.mouvement_effectif', acteurs: [{ id: d.ecurie, role: 'ecurie' }], importance: 1, visibilite: 'prive',
        contexte: { departement: d.type, nombre, effectif: d.effectif, niveau: d.niveauMoyen, cohesion: d.cohesion },
      });
    }
    // Remontée mensuelle de la cohésion vers sa valeur habituelle (semaines multiples de 4).
    if (monde.date.semaine % 4 === 0 && d.cohesionHabituelle !== undefined && d.cohesion !== d.cohesionHabituelle) {
      const ecart = d.cohesionHabituelle - d.cohesion;
      d.cohesion = r1(d.cohesion + Math.sign(ecart) * Math.min(Math.abs(ecart), COHESION_DEPARTEMENT.remonteeParMois)) as Departement['cohesion'];
    }
  }
}

/** Effectif visé par l'IA : de quoi mener ses projets à pleine équipe (pôles), l'effectif de base ailleurs. */
export function effectifVise(type: string): number {
  const base: Record<string, number> = { aero: PROJETS_PAR_POLE * IA_EFFECTIFS.cibleParProjet, conception: PROJETS_PAR_POLE * IA_EFFECTIFS.cibleParProjet, production: 250, fiabilite: 40 };
  const b = RECRUTEMENT_DEPARTEMENT.bornes[type]!;
  return borner(base[type] ?? b[0], b[0], b[1]);
}

/**
 * Décisions de l'IA (mêmes commandes) : en crise, réduire ; sinon recruter vers l'effectif visé si l'argent libre couvre le salaire annuel
 * des recrues (plus ou moins prudemment selon le goût du risque du team principal). Argent libre = le plus petit de la marge prévue sous le
 * plafond et de la trésorerie prévue au-delà du seuil de réserve (l'argent qui partirait sinon en dividendes).
 */
function decisionsIA(monde: Monde, commander: (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => unknown): void {
  for (const id of idsTries(table(monde, TABLES.ecuries))) {
    const e = table(monde, TABLES.ecuries)[id] as unknown as Ecurie;
    if (e.statut !== 'active' || !iaDecide(e, 'personnel')) continue;
    const tp = teamPrincipal(monde, e.id);
    const fi = financesDe(monde, e.id);
    if (!tp || !fi) continue;
    const crise = fi.etatCrise === 'crise' || fi.etatCrise === 'administration';
    if (crise) {
      for (const type of ['production', 'conception', 'aero']) {
        const d = departementDe(monde, e.id, type);
        if (!d || d.mouvement) continue;
        const n = -Math.min(RECRUTEMENT_DEPARTEMENT.campagneMax, Math.max(RECRUTEMENT_DEPARTEMENT.campagneMin, Math.round(d.effectif * IA_EFFECTIFS.partReductionCrise)));
        if (!motifRefusEffectifDepartement(monde, tp.id, { ecurie: e.id, departement: type, nombre: n })) commander({ type: 'departement.effectif', auteur: tp.id, parametres: { ecurie: e.id, departement: type, nombre: n } });
      }
      continue;
    }
    if (fi.etatCrise !== 'sain') continue;
    const prev = previsionFinances(monde, e.id);
    if (!prev) continue;
    const risque = tp.traits['risque'] ?? 10;
    const annees = IA_EFFECTIFS.anneesMarge * (risque >= 14 ? 0.5 : risque <= 6 ? 2 : 1);
    // Argent libre : à la fois sous le plafond et en trésorerie, ce qui partirait sinon en dividendes (au-delà du seuil de réserve).
    let marge = Math.min(prev.plafond.marge, prev.tresorerie.finAvantDividendes - prev.dividendes.seuil);
    for (const type of ['aero', 'conception', 'fiabilite', 'production']) {
      const d = departementDe(monde, e.id, type);
      if (!d || d.mouvement) continue;
      const manque = effectifVise(type) - d.effectif;
      if (manque < RECRUTEMENT_DEPARTEMENT.campagneMin) continue;
      const n = Math.min(RECRUTEMENT_DEPARTEMENT.campagneMax, manque);
      const cout = annees * n * coutParPersonne(d) + coutImmediat(d, n, false);
      if (marge < cout) continue;
      const prm = { ecurie: e.id, departement: type, nombre: n, profil: 'standard' };
      if (motifRefusEffectifDepartement(monde, tp.id, prm)) continue;
      commander({ type: 'departement.effectif', auteur: tp.id, parametres: prm });
      marge -= cout;
    }
  }
}

export const systemeCapacites: Systeme = {
  nom: 'economie.capacites',
  executer({ monde, date, commanderIA }) {
    appliquerMouvements(monde);
    if (IA_EFFECTIFS.semaines.includes(date.semaine)) decisionsIA(monde, commanderIA);
  },
};
