/**
 * Tests contrefactuels des dilemmes (phase 4, critères 1 à 3 ; score de réussite D-069).
 *
 * Pour une graine : on avance jusqu'au point de décision, on copie le monde, on applique l'option A dans une copie
 * et l'option B dans l'autre (par les mêmes commandes que le joueur), puis on simule 1, 3 (et 5) saisons et on
 * compare le score de réussite de l'écurie concernée. Tirages locaux (D-057) : seules les conséquences de la
 * décision séparent les deux mondes.
 */

import { copierMonde, table, type Monde } from '../core/monde';
import type { Moteur } from '../core/moteur';
import { TABLES, type Contrat, type Ecurie, type Personne, type Saison } from '../model/types';
import { relation } from '../systems/memoire';
import { contratEmploi, nePasProlonger, personneDe, pourvoirPostes, proposerProlongation } from '../systems/humain/contrats';
import { repondreDepart } from '../systems/humain/departs';
import { niveauMetier, teamPrincipal, valeurMarche } from '../systems/humain/decision';
import { reputation } from '../systems/humain/promesses';
import { changerStatutN1, critiquer, licencier, repondreAugmentation, soutenir } from '../systems/humain/interactions';

/** Pondérations du score de réussite (D-069), configurables. */
export interface Ponderations { sport: number; personnel: number; finances: number; confiance: number }
export const PONDERATIONS_DEFAUT: Ponderations = { sport: 0.4, personnel: 0.25, finances: 0.2, confiance: 0.15 };

export interface Score {
  total: number;
  sport: number;
  personnel: number;
  finances: number;
  confiance: number;
}

export interface Instantane {
  ecurie: string;
  annee: number;
  /** Personnel individualisé présent au moment de la décision. */
  personnel: string[];
}

function moyenne(v: number[]): number {
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
}

/**
 * Score de réussite d'une écurie sur les saisons terminées depuis la décision, chaque composante entre 0 et 1 :
 * - sport : points constructeurs de l'écurie / points du champion, en moyenne sur les saisons ;
 * - personnel : niveau moyen du personnel individualisé actuel (/20) × part du personnel d'origine encore présent ;
 * - finances : (primes − masse salariale des postes clés) rapportées au budget, ramenées entre 0 et 1 ;
 * - confiance : confiance moyenne du personnel envers le team principal, et réputation de celui-ci.
 */
export function scoreReussite(monde: Monde, inst: Instantane, p: Ponderations = PONDERATIONS_DEFAUT): Score {
  const e = table(monde, TABLES.ecuries)[inst.ecurie] as unknown as Ecurie;
  const saisons = (Object.values(table(monde, TABLES.saisons)) as unknown as Saison[]).filter((s) => s.termine && s.annee >= inst.annee);
  const sport = moyenne(saisons.map((s) => {
    const max = s.constructeurs[0]?.points || 1;
    return (s.constructeurs.find((c) => c.ecurie === inst.ecurie)?.points ?? 0) / max;
  }));
  const actifs = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).filter((x) => x.statut === 'actif' && x.ecurie === inst.ecurie);
  const restes = inst.personnel.filter((id) => actifs.some((a) => a.id === id)).length / Math.max(1, inst.personnel.length);
  const personnel = (moyenne(actifs.map(niveauMetier)) / 20) * (0.5 + 0.5 * restes);
  const contrats = (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).filter((c) => c.statut === 'actif' && c.organisation === inst.ecurie && c.type === 'emploi');
  const primes = moyenne(saisons.map((s) => s.constructeurs.find((c) => c.ecurie === inst.ecurie)?.primesMEUR ?? 0));
  const masse = contrats.reduce((a, c) => a + c.salaireMEUR, 0);
  const finances = Math.max(0, Math.min(1, 0.5 + (primes - masse) / (2 * e.budgetMEUR)));
  const tp = teamPrincipal(monde, inst.ecurie);
  let confiance = 0.5;
  if (tp) {
    const conf = moyenne(actifs.filter((a) => a.id !== tp.id).map((a) => relation(monde, a.id, tp.id).confiance));
    const rep = reputation(monde, tp.id);
    confiance = Math.max(0, Math.min(1, 0.5 + 0.35 * conf + 0.15 * (rep.paroleTenue + rep.fideliteAuPersonnel) / 2));
  }
  return { total: p.sport * sport + p.personnel * personnel + p.finances * finances + p.confiance * confiance, sport, personnel, finances, confiance };
}

export interface Dilemme {
  nom: string;
  options: [string, string];
  /** Choisit l'écurie et la situation ; renvoie null si le contexte ne permet pas ce dilemme. */
  preparer(monde: Monde): { ecurie: string; personne: string } | null;
  /** Applique l'option 0 (A) ou 1 (B). */
  appliquer(monde: Monde, ctx: { ecurie: string; personne: string }, option: 0 | 1): void;
  /** Une étape différée (ex. : rompre la promesse plus tard) : nombre de semaines, puis action. */
  differe?: { semaines: number; action(monde: Monde, ctx: { ecurie: string; personne: string }, option: 0 | 1): void };
}

function ecurieDeLaGraine(monde: Monde): Ecurie {
  const eqs = (Object.values(table(monde, TABLES.ecuries)) as unknown as Ecurie[]).sort((a, b) => (a.id < b.id ? -1 : 1));
  return eqs[monde.graine % eqs.length]!;
}

export const DILEMMES: Dilemme[] = [
  {
    nom: 'Augmentation demandée par le directeur technique',
    options: ['accorder', 'refuser'],
    preparer(monde) {
      const e = ecurieDeLaGraine(monde);
      const dt = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste === 'directeur_technique');
      return dt ? { ecurie: e.id, personne: dt.id } : null;
    },
    appliquer(monde, ctx, option) {
      const tp = teamPrincipal(monde, ctx.ecurie);
      const dt = personneDe(monde, ctx.personne);
      const c = contratEmploi(monde, ctx.personne);
      if (!tp || !dt || !c) return;
      c.demandeAugmentation = Math.round(Math.max(c.salaireMEUR * 1.25, valeurMarche(monde, dt)) * 10) / 10;
      repondreAugmentation(monde, tp, dt, option === 0, false);
    },
  },
  {
    nom: 'Promesse de statut de n°1 : la tenir ou la rompre',
    options: ['tenir', 'rompre'],
    preparer(monde) {
      const e = ecurieDeLaGraine(monde);
      const s = table(monde, TABLES.saisons)[`ssn_${monde.date.annee}`] as unknown as Saison | undefined;
      const pil = s?.pilotes.find((l) => l.ecurie === e.id)?.pilote;
      return pil ? { ecurie: e.id, personne: pil } : null;
    },
    appliquer(monde, ctx) {
      // Dans les deux branches : prolongation avec promesse de statut de n°1.
      const tp = teamPrincipal(monde, ctx.ecurie);
      const c = contratEmploi(monde, ctx.personne);
      const p = personneDe(monde, ctx.personne);
      if (tp && c && p) proposerProlongation(monde, c, tp.id, valeurMarche(monde, p) * 1.3, 2, ['statut_n1'], 1);
    },
    differe: {
      semaines: 20,
      action(monde, ctx, option) {
        const tp = teamPrincipal(monde, ctx.ecurie);
        const p = personneDe(monde, ctx.personne);
        if (option === 1 && tp && p && p.ecurie === ctx.ecurie) changerStatutN1(monde, tp, p, false);
      },
    },
  },
  {
    nom: 'Pilote en difficulté : soutenir ou critiquer publiquement',
    options: ['soutenir', 'critiquer'],
    preparer(monde) {
      const e = ecurieDeLaGraine(monde);
      const s = table(monde, TABLES.saisons)[`ssn_${monde.date.annee}`] as unknown as Saison | undefined;
      const pilotes = s?.pilotes.filter((l) => l.ecurie === e.id) ?? [];
      const moinsBon = pilotes.sort((a, b) => a.points - b.points)[0];
      return moinsBon ? { ecurie: e.id, personne: moinsBon.pilote } : null;
    },
    appliquer(monde, ctx, option) {
      const tp = teamPrincipal(monde, ctx.ecurie);
      const p = personneDe(monde, ctx.personne);
      if (!tp || !p) return;
      if (option === 0) soutenir(monde, tp, p, true);
      else critiquer(monde, tp, p, true);
    },
  },
  // Jalon A bis : trois dilemmes de plus (une décision unique, jouée par les mêmes fonctions que les commandes du joueur).
  {
    nom: 'Le responsable aérodynamique demande à partir : accepter ou refuser',
    options: ['accepter', 'refuser'],
    preparer(monde) {
      const e = ecurieDeLaGraine(monde);
      const p = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((x) => x.statut === 'actif' && x.ecurie === e.id && x.poste === 'responsable_aero');
      return p && contratEmploi(monde, p.id) ? { ecurie: e.id, personne: p.id } : null;
    },
    appliquer(monde, ctx, option) {
      const tp = teamPrincipal(monde, ctx.ecurie);
      const p = personneDe(monde, ctx.personne);
      const c = contratEmploi(monde, ctx.personne);
      if (!tp || !p || !c) return;
      c.demandeDepart = { indemnite: 0.5, depuis: { ...monde.date } };
      repondreDepart(monde, tp, p, option === 0);
      if (option === 0) pourvoirPostes(monde, true);
    },
  },
  {
    nom: 'Directeur technique décevant : le licencier ou le garder',
    options: ['licencier', 'garder'],
    preparer(monde) {
      const e = ecurieDeLaGraine(monde);
      const dt = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste === 'directeur_technique');
      return dt && contratEmploi(monde, dt.id) ? { ecurie: e.id, personne: dt.id } : null;
    },
    appliquer(monde, ctx, option) {
      if (option === 1) return;
      const tp = teamPrincipal(monde, ctx.ecurie);
      const dt = personneDe(monde, ctx.personne);
      if (!tp || !dt) return;
      licencier(monde, tp, dt);
      pourvoirPostes(monde, true);
    },
  },
  {
    nom: 'Pilote vétéran en fin de contrat : le prolonger ou le laisser partir',
    options: ['prolonger', 'laisser partir'],
    preparer(monde) {
      const e = ecurieDeLaGraine(monde);
      const pilotes = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste === 'pilote_titulaire')
        .sort((a, b) => a.anneeNaissance - b.anneeNaissance || (a.id < b.id ? -1 : 1));
      const veteran = pilotes[0];
      return veteran && contratEmploi(monde, veteran.id) ? { ecurie: e.id, personne: veteran.id } : null;
    },
    appliquer(monde, ctx, option) {
      const tp = teamPrincipal(monde, ctx.ecurie);
      const c = contratEmploi(monde, ctx.personne);
      const p = personneDe(monde, ctx.personne);
      if (!tp || !c || !p) return;
      // Le contrat se termine à la fin de la saison dans les deux branches ; seule la décision diffère.
      c.fin = monde.date.annee;
      if (option === 0) proposerProlongation(monde, c, tp.id, valeurMarche(monde, p), 2, [], 1);
      else nePasProlonger(monde, c, tp.id, 'choix sportif');
    },
  },
];

export interface ResultatDilemme {
  graine: number;
  ecurie: string;
  horizons: { saisons: number; a: Score; b: Score }[];
  /** La personne concernée a-t-elle quitté l'écurie (dans l'horizon le plus long) ? */
  departA: boolean;
  departB: boolean;
}

/** Joue un dilemme pour une graine. creerMonde/creerMoteur viennent du scénario. */
export function jouerDilemme(d: Dilemme, creerMonde: () => Monde, creerMoteur: () => Moteur, horizons: number[], semaineDecision = 20): ResultatDilemme | null {
  const base = creerMonde();
  const mBase = creerMoteur();
  mBase.avancer(base, semaineDecision - 1);
  const ctx = d.preparer(base);
  if (!ctx) return null;
  const inst: Instantane = {
    ecurie: ctx.ecurie, annee: base.date.annee,
    personnel: (Object.values(table(base, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.ecurie === ctx.ecurie).map((p) => p.id),
  };
  const branches = ([0, 1] as const).map((option) => {
    const m = copierMonde(base);
    const mo = creerMoteur();
    d.appliquer(m, ctx, option);
    let semaines = 0;
    if (d.differe) {
      mo.avancer(m, d.differe.semaines);
      semaines = d.differe.semaines;
      d.differe.action(m, ctx, option);
    }
    const scores: Score[] = [];
    const finSaison = 52 - (semaineDecision - 1) + 2; // juste après le bilan de la saison en cours
    let ecoule = semaines;
    for (const h of horizons) {
      const cible = finSaison + (h - 1) * 52;
      mo.avancer(m, Math.max(0, cible - ecoule));
      ecoule = Math.max(ecoule, cible);
      scores.push(scoreReussite(m, inst));
    }
    const parti = personneDe(m, ctx.personne)?.ecurie !== ctx.ecurie;
    return { scores, parti };
  });
  return {
    graine: base.graine, ecurie: ctx.ecurie,
    horizons: horizons.map((h, i) => ({ saisons: h, a: branches[0]!.scores[i]!, b: branches[1]!.scores[i]! })),
    departA: branches[0]!.parti, departB: branches[1]!.parti,
  };
}
