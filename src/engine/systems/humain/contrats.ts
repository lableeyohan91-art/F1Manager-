/**
 * Contrats (phase 4) : négociations de prolongation, fins de contrat, remplacement provisoire (D-066),
 * renouvellement du réservoir. Toutes les actions passent par des commandes (mêmes règles pour le joueur et l'IA).
 */

import {
  OFFRE_SALAIRE, PRIME_CONTINUITE, RESERVOIR_MINIMUM, SEUIL_PROLONGATION, SEMAINE_FIN_CONTRATS, SEMAINE_NEGOCIATIONS, TOURS_RECRUTEMENT,
} from '../../balance/contrats';
import { assezAgePourLaF1, changerMetier } from '../carriere/profil';
import { engageablePar } from '../juniors/academies';
import { TABLE_PROMESSES, type Promesse } from './promesses';
import { POSTES_INDIVIDUALISES } from '../../balance/monde';
import { courbeAge } from '../../balance/personnages';
import type { Commande, DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement, type Evenement } from '../../core/evenements';
import { nouvelIdentifiant } from '../../core/identifiants';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal, type Moteur, type Systeme } from '../../core/moteur';
import { genererPersonne } from '../../generation/construction';
import { TABLES, type Contrat, type Ecurie, type Personne, type Poste } from '../../model/types';
import { lireEvenement, relation } from '../memoire';
import { ecuriesActives } from '../saison/performance';
import {
  age, ecurie, niveauMetier, repondre, scoreCandidat, teamPrincipal, texteRaisons, valeurMarche, type Offre, type Raison,
} from './decision';
import { faireUnePromesse, motifPromesseInvalide, type TypePromesse } from './promesses';
import { dureeMaxEffectif, lireConditions, motifRefusConseil, motifRefusEffectif } from './effectifs';
import { activerContratsSignes, clotureMarche } from '../marche';

const arrondi = (x: number) => Math.round(x * 10) / 10;

export function personneDe(monde: Monde, id: string): Personne | undefined {
  return table(monde, TABLES.personnes)[id] as unknown as Personne | undefined;
}

export function contratEmploi(monde: Monde, idPersonne: string): Contrat | undefined {
  const t = table(monde, TABLES.contrats);
  return idsTries(t).map((id) => t[id] as unknown as Contrat).find((c) => c.personne === idPersonne && c.statut === 'actif' && c.type === 'emploi');
}

function nomDe(monde: Monde, id: string): string {
  const p = personneDe(monde, id);
  if (p) return `${p.prenom} ${p.nom}`;
  return ecurie(monde, id)?.nom ?? id;
}

/** Négociation en attente de réponse du joueur (contre-offre). */
export interface NegociationEnCours {
  contrat: string;
  salaireDemande: number;
  dureeAnnees: number;
  promesses: TypePromesse[];
  evenement: string;
}
export const TABLE_NEGOCIATIONS = 'negociations';

function creerContrat(monde: Monde, p: Personne, organisation: string, poste: Poste, debut: number, duree: number, salaire: number, statutN1: boolean): Contrat {
  const c: Contrat = {
    id: nouvelIdentifiant(monde, 'ctr'), personne: p.id, organisation, type: 'emploi', poste, debut, fin: debut + duree - 1,
    salaireMEUR: arrondi(salaire), clauses: statutN1 ? { statutN1: true } : {}, statut: 'actif', verification: 'contrat simulé',
  };
  table(monde, TABLES.contrats)[c.id] = c as unknown as Entite;
  return c;
}

/* ===================================================================== Négociation de prolongation */

export interface ResultatNegociation {
  issue: 'accord' | 'refus' | 'contre_offre';
  raisons: string[];
  salaireDemande?: number;
  evenement: Evenement;
}

/**
 * L'organisation propose une prolongation ; la personne répond (accepte, contre-propose, refuse).
 * Accord : le contrat est prolongé (nouvelle fin, nouveau salaire). Utilisé par le joueur ET par l'IA.
 */
export function proposerProlongation(monde: Monde, c: Contrat, auteur: string, salaire: number, duree: number, promesses: TypePromesse[], tour: number, causes: string[] = [], cibles: Record<string, string> = {}): ResultatNegociation {
  const p = personneDe(monde, c.personne) as Personne;
  const finAvant = c.fin;
  // Audit n°3 : garde commune à toutes les prolongations (joueur, IA, conseil, contre-attaque) — pas de dépassement d'effectif.
  const effectif = motifRefusEffectif(monde, c.organisation, c.personne, c.poste, c.fin + 1, Math.max(c.fin, monde.date.annee) + duree);
  if (effectif) {
    const evt = ajouterEvenement(monde, {
      type: 'negociation.impossible', acteurs: [{ id: p.id, role: 'personne' }, { id: auteur, role: 'auteur' }, { id: c.organisation, role: 'organisation' }],
      importance: 1, visibilite: 'prive', causes, contexte: { contrat: c.id, motif: effectif },
    });
    return { issue: 'refus', raisons: [effectif], evenement: evt };
  }
  // Audit n°3 : une augmentation d'un pilote titulaire passe par l'arbitrage du conseil, pour le joueur comme pour l'IA.
  const e = ecurie(monde, c.organisation);
  const conseil = e && c.poste === 'pilote_titulaire' && salaire > c.salaireMEUR ? motifRefusConseil(monde, e, c.personne, salaire, monde.date.annee, Math.max(c.fin, monde.date.annee) + duree) : null;
  if (conseil) {
    const evt = ajouterEvenement(monde, {
      type: 'negociation.impossible', acteurs: [{ id: p.id, role: 'personne' }, { id: auteur, role: 'auteur' }, { id: c.organisation, role: 'organisation' }],
      importance: 1, visibilite: 'prive', causes, contexte: { contrat: c.id, motif: conseil },
    });
    return { issue: 'refus', raisons: [conseil], evenement: evt };
  }
  const offre: Offre = { organisation: c.organisation, decideur: auteur, poste: c.poste, salaireMEUR: salaire, dureeAnnees: duree, promesses, prolongation: true };
  const rep = repondre(monde, p, offre, `prolongation-${c.id}-${monde.date.annee}-${monde.date.semaine}-${tour}`, tour < 2);
  const raisons = texteRaisons(rep.raisons);
  const acteurs = [{ id: p.id, role: 'personne' }, { id: auteur, role: 'auteur' }, { id: c.organisation, role: 'organisation' }];
  const offreEvt = ajouterEvenement(monde, {
    type: 'negociation.offre', acteurs, importance: 1, visibilite: 'prive', causes,
    contexte: { contrat: c.id, salaire, duree, promesses, tour },
  });
  if (rep.type === 'accepte') {
    const ancienSalaire = c.salaireMEUR;
    c.fin = Math.max(c.fin, monde.date.annee) + duree;
    c.salaireMEUR = arrondi(salaire);
    if (promesses.includes('statut_n1')) c.clauses.statutN1 = true;
    const evt = ajouterEvenement(monde, {
      type: 'negociation.accord', acteurs, importance: 2, visibilite: 'public', causes: [offreEvt.id],
      contexte: { contrat: c.id, salaire, duree, raisons, ligneRouge: rep.ligneRouge ?? null },
      texte: `${nomDe(monde, p.id)} prolonge avec ${nomDe(monde, c.organisation)} jusqu'en ${c.fin} (${arrondi(salaire)} M€/an).`,
    });
    // Bonne reconnaissance : augmentation nette ou salaire au niveau de sa valeur.
    if (salaire >= Math.max(ancienSalaire * 1.1, valeurMarche(monde, p) * 0.95)) lireEvenement(monde, p.id, auteur, 'reconnaissance', evt.id, { facteur: 0.8 });
    for (const t of promesses) {
      // Audit n°3 : chaque promesse porte ses paramètres propres (montant, échéance précédente, personne visée).
      faireUnePromesse(monde, { auteur, organisation: c.organisation, beneficiaire: p.id, type: t, parametres: parametresPromesse(t, salaire, finAvant, cibles), echeance: { annee: c.fin, semaine: 48 }, publique: false }, [evt.id]);
    }
    return { issue: 'accord', raisons, evenement: evt };
  }
  if (rep.type === 'contre_offre') {
    const evt = ajouterEvenement(monde, {
      type: 'negociation.contre_offre', acteurs, importance: 1, visibilite: 'prive', causes: [offreEvt.id],
      contexte: { contrat: c.id, salaireDemande: rep.salaireDemande, raisons },
    });
    return { issue: 'contre_offre', raisons, salaireDemande: rep.salaireDemande, evenement: evt };
  }
  const evt = ajouterEvenement(monde, {
    type: 'negociation.refus', acteurs, importance: 2, visibilite: 'prive', causes: [offreEvt.id],
    contexte: { contrat: c.id, raisons, ligneRouge: rep.ligneRouge ?? null },
    texte: `${nomDe(monde, p.id)} refuse de prolonger avec ${nomDe(monde, c.organisation)}${rep.ligneRouge ? ` (${rep.ligneRouge})` : ''}.`,
  });
  if (tour >= 1) {
    lireEvenement(monde, p.id, auteur, 'conflit', evt.id);
    lireEvenement(monde, auteur, p.id, 'conflit', evt.id, { facteur: 0.7 });
  }
  return { issue: 'refus', raisons, evenement: evt };
}

/** Paramètres propres à chaque promesse faite lors d'une prolongation (audit n°3). */
function parametresPromesse(t: TypePromesse, salaire: number, finAvant: number, cibles: Record<string, string>): Record<string, string | number> {
  if (t === 'salaire_minimum') return { salaire: Math.round(salaire * 10) / 10 };
  if (t === 'prolongation') return { finAvant };
  if (t === 'ne_pas_recruter') return cibles['ne_pas_recruter'] ? { personne: cibles['ne_pas_recruter'] } : {};
  return {};
}

/** L'organisation refuse de prolonger : la personne s'en souvient. */
export function nePasProlonger(monde: Monde, c: Contrat, auteur: string, motif: string, causes: string[] = []): Evenement {
  const evt = ajouterEvenement(monde, {
    type: 'contrat.non_prolonge', acteurs: [{ id: c.personne, role: 'personne' }, { id: auteur, role: 'auteur' }, { id: c.organisation, role: 'organisation' }],
    importance: 2, visibilite: 'public', causes, contexte: { contrat: c.id, motif },
    texte: `${nomDe(monde, c.organisation)} ne prolonge pas ${nomDe(monde, c.personne)}.`,
  });
  c.nonProlonge = true;
  lireEvenement(monde, c.personne, auteur, 'manque_reconnaissance', evt.id, { facteur: 1.1 });
  return evt;
}

/* ===================================================================== IA du team principal : fins de contrat */

/** Meilleur niveau disponible parmi les personnes libres pour un poste (abordables par l'écurie). */
function meilleurLibre(monde: Monde, poste: Poste, e: Ecurie): number {
  const libres = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'libre' && candidatPour(p, poste));
  const abordables = libres.filter((p) => valeurMarche(monde, p) <= e.budgetMEUR * (poste.startsWith('pilote') ? 0.06 : 0.02));
  return Math.max(0, ...abordables.map(niveauMetier));
}

/** Qui peut postuler à quel poste (avant le vrai marché de la phase 7). */
export function candidatPour(p: Personne, poste: Poste): boolean {
  if (p.poste === poste) return true;
  if (poste === 'pilote_titulaire') return p.poste === 'pilote_reserve' || p.poste === 'pilote_junior';
  if (poste === 'pilote_reserve') return p.poste === 'pilote_junior' || p.poste === 'pilote_titulaire';
  if (poste === 'responsable_aero' || poste === 'responsable_conception') return p.poste === 'ingenieur';
  if (poste === 'directeur_technique') return p.poste === 'responsable_aero' || p.poste === 'responsable_conception';
  // Passerelles entre métiers (phase 6a §5) : les directeurs technique et sportif peuvent prendre la tête d'une écurie.
  if (poste === 'team_principal') return p.poste === 'directeur_technique' || p.poste === 'directeur_sportif';
  return false;
}

/** Durée proposée selon les années restantes avant le déclin du métier (D-051) : plus de 6 ans → 3 ans, plus de 2 → 2 ans, sinon 1. */
export function dureeContrat(monde: Monde, p: Personne): number {
  const restant = courbeAge(p.poste).declinApres - age(monde, p);
  return restant > 6 ? 3 : restant > 2 ? 2 : 1;
}

/**
 * Décision de l'IA pour un contrat qui se termine : proposer une prolongation (et à quelles conditions) ou non.
 * Phase 7a : pour les pilotes titulaires, le marché fournit le niveau du meilleur remplaçant accessible (`remplacant`).
 */
export function deciderProlongation(monde: Monde, c: Contrat, tp: Personne, remplacant?: number, dureeMax = 5): void {
  const p = personneDe(monde, c.personne) as Personne;
  const e = ecurie(monde, c.organisation) as Ecurie;
  const f = tirageLocal(monde, 'ia.prolongation', c.id, monde.date.annee);
  const r = relation(monde, tp.id, p.id);
  // Garder la personne ? Niveau comparé au meilleur remplaçant abordable, corrigé par la loyauté du TP, la relation et l'âge.
  const loyaute = ((tp.traits['loyaute'] ?? 10) - 10) / 10;
  const declin = Math.max(0, age(monde, p) - 34) * (p.poste.startsWith('pilote') ? 0.25 : 0.05);
  const continuite = p.poste.startsWith('pilote') ? PRIME_CONTINUITE.pilote : PRIME_CONTINUITE.personnel;
  const interet = niveauMetier(p) - (remplacant ?? meilleurLibre(monde, c.poste, e)) + continuite + 0.8 * loyaute + 1.5 * (r.affinite + r.respect) / 2 - declin + f.normale(0, 0.6);
  if (interet < SEUIL_PROLONGATION) {
    nePasProlonger(monde, c, tp.id, 'remplaçant jugé meilleur ou moins cher');
    return;
  }
  const valeur = valeurMarche(monde, p);
  const audace = (tp.traits['risque'] ?? 10) / 20;
  const budget = Math.min(1, e.budgetMEUR / 400);
  let salaire = valeur * (OFFRE_SALAIRE.min + (OFFRE_SALAIRE.max - OFFRE_SALAIRE.min) * (0.5 * audace + 0.5 * budget));
  const duree = Math.min(dureeMax, dureeContrat(monde, p));
  const promesses: TypePromesse[] = [];
  let res = proposerProlongation(monde, c, tp.id, salaire, duree, promesses, 0);
  if (res.issue === 'contre_offre' && res.salaireDemande !== undefined) {
    // Le TP accepte la contre-offre si elle reste raisonnable (selon son audace et son intérêt pour la personne).
    const plafond = valeur * (1.1 + 0.25 * audace) * (interet > 1 ? 1.1 : 1);
    if (res.salaireDemande <= plafond) salaire = res.salaireDemande;
    else salaire = Math.min(plafond, res.salaireDemande);
    res = proposerProlongation(monde, c, tp.id, salaire, duree, promesses, 1, [res.evenement.id]);
    if (res.issue === 'contre_offre') res = proposerProlongation(monde, c, tp.id, salaire, duree, promesses, 2, [res.evenement.id]);
  }
}

/** Conseil d'administration (provisoire avant la phase 5) : prolonge le team principal sauf mauvais résultats et conseil impatient. */
function decisionConseil(monde: Monde, c: Contrat): void {
  const p = personneDe(monde, c.personne) as Personne;
  const e = ecurie(monde, c.organisation) as Ecurie;
  const f = tirageLocal(monde, 'conseil', c.id, monde.date.annee);
  const saison = table(monde, TABLES.saisons)[`ssn_${monde.date.annee - 1}`] as unknown as { constructeurs: { ecurie: string }[] } | undefined;
  const rang = saison ? saison.constructeurs.findIndex((x) => x.ecurie === e.id) : -1;
  const decevant = rang >= 0 && rang >= Math.floor(saison!.constructeurs.length / 2) && e.prestige >= 14;
  if (decevant && f.chance(0.6 - e.toleranceConseil / 40)) {
    nePasProlonger(monde, c, e.id, 'résultats jugés insuffisants par le conseil');
    return;
  }
  proposerProlongation(monde, c, e.id, valeurMarche(monde, p), 2, [], 1);
}

export const systemeNegociations: Systeme = {
  nom: 'humain.negociations',
  executer({ monde, date }) {
    if (date.semaine !== SEMAINE_NEGOCIATIONS) return;
    for (const id of idsTries(table(monde, TABLES.contrats))) {
      const c = table(monde, TABLES.contrats)[id] as unknown as Contrat;
      if (c.statut !== 'actif' || c.type !== 'emploi' || c.fin !== date.annee || c.nonProlonge) continue;
      const e = ecurie(monde, c.organisation);
      if (!e || e.pilotee) continue; // écurie pilotée par le joueur : il décide lui-même
      const p = personneDe(monde, c.personne);
      if (!p) continue;
      if (p.poste === 'team_principal') {
        // Phase 5a : avec un propriétaire, c'est le conseil du système économie qui décide (economie.conseil).
        const aProprietaire = Object.values(table(monde, TABLES.proprietaires)).some((x) => x['ecurie'] === c.organisation);
        if (!aProprietaire) decisionConseil(monde, c);
      }
      else {
        // Phase 7a : les titulaires sont décidés à l'ouverture du marché (systems/marche), face aux offres possibles.
        if (p.poste === 'pilote_titulaire') continue;
        const tp = teamPrincipal(monde, c.organisation);
        if (tp) deciderProlongation(monde, c, tp);
      }
    }
  },
};

/* ===================================================================== Fins de contrat et remplacements */

function liberer(monde: Monde, p: Personne, c: Contrat, motif: Contrat['motifFin']): Evenement {
  c.statut = motif === 'licenciement' ? 'rompu' : 'termine';
  c.motifFin = motif;
  const ancienne = p.ecurie;
  p.statut = 'libre';
  p.ecurie = '';
  p.libreDepuis = monde.date.annee;
  const evt = ajouterEvenement(monde, {
    type: 'contrat.fin', acteurs: [{ id: p.id, role: 'personne' }, { id: ancienne, role: 'organisation' }],
    importance: 2, visibilite: 'public', contexte: { contrat: c.id, motif },
    texte: `${nomDe(monde, p.id)} quitte ${nomDe(monde, ancienne)}.`,
  });
  // Départ d'un proche : ceux qui l'apprécient s'en souviennent.
  for (const id of idsTries(table(monde, TABLES.personnes))) {
    const autre = table(monde, TABLES.personnes)[id] as unknown as Personne;
    if (autre.id === p.id || autre.ecurie !== ancienne || autre.statut !== 'actif') continue;
    const r = relation(monde, autre.id, p.id);
    if (r.affinite > 0.25) lireEvenement(monde, autre.id, ancienne, 'perte', evt.id, { facteur: r.affinite * 2 });
  }
  return evt;
}

export { liberer };

/** Postes vacants d'une écurie (par rapport aux 9 postes individualisés). */
export function postesVacants(monde: Monde, e: Ecurie): Poste[] {
  const actifs = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.ecurie === e.id);
  const res: Poste[] = [];
  for (const { poste, nombre } of POSTES_INDIVIDUALISES) {
    const n = actifs.filter((p) => p.poste === poste).length;
    for (let i = n; i < nombre; i++) res.push(poste as Poste);
  }
  return res;
}

interface Proposition { ecurie: Ecurie; poste: Poste; salaire: number; decideur: string; raisons: Raison[] }

/**
 * Pourvoit les postes vacants (D-066) par tours d'offres simultanées :
 * chaque écurie fait une offre à son candidat préféré ; chaque candidat choisit parmi ses offres celle qu'il préfère
 * (ou les refuse toutes). Plusieurs écuries peuvent viser la même personne : c'est le candidat qui tranche.
 * En dernier recours, une personne est générée (réservoir provisoire, avant la phase 6a).
 */
export function pourvoirPostes(monde: Monde): void {
  const refusesPar = new Map<string, Set<string>>(); // écurie+poste → candidats qui ont refusé
  const debut = monde.date.semaine >= SEMAINE_FIN_CONTRATS ? monde.date.annee + 1 : monde.date.annee;
  // Phase 7a : une personne qui a signé un pré-accord ailleurs n'est plus disponible.
  const signes = new Set((Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).filter((c) => c.statut === 'signe').map((c) => c.personne));
  for (let tour = 0; tour < TOURS_RECRUTEMENT; tour++) {
    const offres = new Map<string, Proposition[]>();
    let vacants = 0;
    for (const e of ecuriesActives(monde)) {
      if (e.pilotee) continue;
      const tp = teamPrincipal(monde, e.id);
      const decideur = tp?.id ?? e.id;
      const dejaVise = new Set<string>();
      for (const poste of postesVacants(monde, e)) {
        vacants++;
        // Promesse d'académie à tenir (6b-2) : le jeune promis prend le baquet libéré pour lui, s'il est toujours disponible.
        if (poste === 'pilote_titulaire') {
          const promis = (Object.values(table(monde, TABLE_PROMESSES)) as unknown as Promesse[])
            .filter((x) => x.type === 'titularisation' && x.statut === 'en_cours' && x.organisation === e.id)
            .map((x) => personneDe(monde, x.beneficiaire))
            .find((p): p is Personne => !!p && p.statut === 'libre' && !signes.has(p.id) && assezAgePourLaF1(monde, p) && engageablePar(monde, p, e));
          if (promis) {
            recruter(monde, promis, e, 'pilote_titulaire', valeurMarche(monde, promis), debut, decideur);
            continue;
          }
        }
        // Promotion interne d'abord : le pilote de réserve devient titulaire.
        if (poste === 'pilote_titulaire') {
          const reserve = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste === 'pilote_reserve');
          if (reserve && niveauMetier(reserve) >= 13) {
            titulariser(monde, reserve, decideur);
            continue;
          }
        }
        const cle = `${e.id}:${poste}`;
        const refus = refusesPar.get(cle) ?? new Set<string>();
        const candidats = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[])
          .filter((p) => p.statut === 'libre' && candidatPour(p, poste) && assezAgePourLaF1(monde, p) && engageablePar(monde, p, e) && !refus.has(p.id) && !dejaVise.has(p.id) && !signes.has(p.id))
          .sort((a, b) => (a.id < b.id ? -1 : 1));
        if (candidats.length === 0) continue;
        const f = tirageLocal(monde, 'recrutement', e.id, poste, monde.date.annee, tour);
        const notes = candidats.map((c) => {
          const salaire = valeurMarche(monde, c) * (0.95 + 0.1 * ((tp?.traits['risque'] ?? 10) / 20));
          const s = scoreCandidat(monde, e, decideur, c, salaire);
          return { c, salaire, score: s.score + f.normale(0, 0.03 + ((tp?.traits['temperament'] ?? 10) / 20) * 0.04), raisons: s.raisons };
        }).sort((a, b) => b.score - a.score);
        const choix = notes[0]!;
        dejaVise.add(choix.c.id);
        const liste = offres.get(choix.c.id) ?? [];
        liste.push({ ecurie: e, poste, salaire: choix.salaire, decideur, raisons: choix.raisons });
        offres.set(choix.c.id, liste);
      }
    }
    if (vacants === 0 || offres.size === 0) break;
    // Chaque candidat choisit.
    for (const idCandidat of [...offres.keys()].sort()) {
      const c = personneDe(monde, idCandidat) as Personne;
      let meilleure: { o: Proposition; u: number } | null = null;
      for (const o of offres.get(idCandidat)!) {
        const offre: Offre = { organisation: o.ecurie.id, decideur: o.decideur, poste: o.poste, salaireMEUR: o.salaire, dureeAnnees: 2, promesses: [], prolongation: false };
        const rep = repondre(monde, c, offre, `recrutement-${o.ecurie.id}-${monde.date.annee}-${tour}`, false);
        if (rep.type === 'accepte') {
          const u = rep.raisons.reduce((a, r) => a + r.contribution, 0);
          if (!meilleure || u > meilleure.u) meilleure = { o, u };
        } else {
          const cle = `${o.ecurie.id}:${o.poste}`;
          refusesPar.set(cle, new Set([...(refusesPar.get(cle) ?? []), c.id]));
        }
      }
      for (const o of offres.get(idCandidat)!) {
        if (meilleure && o !== meilleure.o) {
          const cle = `${o.ecurie.id}:${o.poste}`;
          refusesPar.set(cle, new Set([...(refusesPar.get(cle) ?? []), c.id]));
        }
      }
      if (meilleure) recruter(monde, c, meilleure.o.ecurie, meilleure.o.poste, meilleure.o.salaire, debut, meilleure.o.decideur, offres.get(idCandidat)!.length);
    }
  }
  // Dernier recours : générer une personne pour chaque poste encore vacant.
  for (const e of ecuriesActives(monde)) {
    if (e.pilotee) continue;
    for (const poste of postesVacants(monde, e)) {
      const p = genererPersonne(monde, poste, e, 'actif');
      creerContrat(monde, p, e.id, poste, debut, 2, valeurMarche(monde, p), false);
      ajouterEvenement(monde, { type: 'recrutement.genere', acteurs: [{ id: p.id, role: 'personne' }, { id: e.id, role: 'organisation' }], importance: 1, contexte: { poste } });
    }
  }
}

export function recruter(monde: Monde, c: Personne, e: Ecurie, poste: Poste, salaire: number, debut: number, decideur: string, nbOffres = 1): Contrat {
  // Audit n°3 : durée bornée par les places réellement libres (pré-accords déjà signés pour les saisons suivantes).
  const duree = Math.max(1, Math.min(Math.max(2, dureeContrat(monde, c)), dureeMaxEffectif(monde, e.id, c.id, poste, debut - 1)));
  const contrat = creerContrat(monde, c, e.id, poste, debut, duree, salaire, false);
  const ancienPoste = c.poste;
  c.statut = 'actif';
  c.ecurie = e.id;
  delete c.junior; // un jeune engagé en F1 quitte son baquet junior
  // Phase 6a : un changement de métier (promotion) recrée les compétences du nouveau métier.
  changerMetier(c, poste, tirageLocal(monde, 'carriere.metier', c.id, monde.date.annee), monde.date.annee - c.anneeNaissance);
  delete c.libreDepuis;
  const evt = ajouterEvenement(monde, {
    type: 'recrutement', acteurs: [{ id: c.id, role: 'personne' }, { id: decideur, role: 'auteur' }, { id: e.id, role: 'organisation' }],
    importance: poste === 'pilote_titulaire' || poste === 'team_principal' || poste === 'directeur_technique' ? 3 : 2,
    visibilite: 'public', contexte: { contrat: contrat.id, poste, salaire: arrondi(salaire), offresConcurrentes: nbOffres },
    texte: `${nomDe(monde, c.id)} rejoint ${e.nom} (${poste.replace(/_/g, ' ')})${nbOffres > 1 ? `, préféré à ${nbOffres - 1} autre(s) offre(s)` : ''}.`,
  });
  // Une opportunité offerte (promotion de poste) laisse de la gratitude.
  if (ancienPoste !== poste) lireEvenement(monde, c.id, decideur, 'gratitude', evt.id, { facteur: 0.8 });
  return contrat;
}

export function titulariser(monde: Monde, p: Personne, decideur: string): void {
  const c = contratEmploi(monde, p.id);
  p.poste = 'pilote_titulaire';
  if (c) {
    c.poste = 'pilote_titulaire';
    c.salaireMEUR = arrondi(Math.max(c.salaireMEUR, valeurMarche(monde, p)));
    // Audit n°3 : la titularisation ne prolonge pas au-delà des saisons où un baquet reste libre.
    c.fin = Math.max(c.fin, Math.min(monde.date.annee + 2, monde.date.annee + dureeMaxEffectif(monde, c.organisation, p.id, 'pilote_titulaire', monde.date.annee)));
  }
  const evt = ajouterEvenement(monde, {
    type: 'pilote.titularisation', acteurs: [{ id: p.id, role: 'pilote' }, { id: decideur, role: 'auteur' }, { id: p.ecurie, role: 'organisation' }],
    importance: 3, visibilite: 'public', texte: `${nomDe(monde, p.id)} est titularisé par ${nomDe(monde, p.ecurie)}.`,
  });
  lireEvenement(monde, p.id, decideur, 'gratitude', evt.id);
}

export const systemeFinsDeContrat: Systeme = {
  nom: 'humain.finsDeContrat',
  executer({ monde, date }) {
    if (date.semaine !== SEMAINE_FIN_CONTRATS) return;
    for (const id of idsTries(table(monde, TABLES.contrats))) {
      const c = table(monde, TABLES.contrats)[id] as unknown as Contrat;
      if (c.statut !== 'actif' || c.type !== 'emploi' || c.fin > date.annee) continue;
      const p = personneDe(monde, c.personne);
      if (p) liberer(monde, p, c, c.nonProlonge ? 'non_prolonge' : 'echeance');
    }
    // Phase 7a : les contrats signés pendant la fenêtre prennent effet ; le remplacement provisoire n'est plus qu'un filet de sécurité.
    activerContratsSignes(monde);
    pourvoirPostes(monde);
    clotureMarche(monde);
  },
};

/** Réservoir (D-066) : filet de sécurité, minimum de personnes libres par poste pour le personnel (les pilotes viennent des cohortes, phase 6a). */
export const systemeReservoir: Systeme = {
  nom: 'humain.reservoir',
  phases: ['intersaison'],
  executer({ monde, date }) {
    if (date.semaine !== 2) return;
    // Phase 6a : les retraites sont des décisions des personnes (systems/carriere) ; il ne reste ici qu'un filet de sécurité
    // pour le personnel (les pilotes viennent des cohortes).
    const tp = table(monde, TABLES.personnes);
    for (const [poste, minimum] of Object.entries(RESERVOIR_MINIMUM)) {
      const libres = (Object.values(tp) as unknown as Personne[]).filter((p) => p.statut === 'libre' && p.poste === poste).length;
      for (let i = libres; i < minimum; i++) {
        const p = genererPersonne(monde, poste as Poste, null, 'libre');
        p.libreDepuis = date.annee;
      }
    }
  },
};

/* ===================================================================== Commandes (joueur et IA) */

function valideurTP(monde: Monde, c: Commande): string | null {
  const p = personneDe(monde, String(c.parametres['personne'] ?? ''));
  if (!p) return 'Personne inconnue.';
  const tp = teamPrincipal(monde, p.ecurie);
  if (!tp || tp.id !== c.auteur) return 'Seul le team principal de son écurie peut faire cela.';
  if (p.id === c.auteur) return 'Le team principal ne peut pas faire cela envers lui-même.';
  return null;
}

export const commandeProposerProlongation: DefinitionCommande = {
  type: 'contrat.proposer_prolongation',
  valider(monde, c) {
    const v = valideurTP(monde, c);
    if (v) return v;
    // Audit n°3 : nombres finis, durée entière, salaire validé après arrondi ; effectif ; promesses complètes ; conseil.
    const cond = lireConditions(c.parametres['salaire'], c.parametres['duree']);
    if (typeof cond === 'string') return cond;
    const contrat = contratEmploi(monde, String(c.parametres['personne']));
    if (!contrat) return 'Aucun contrat actif.';
    const tour = c.parametres['tour'] ?? 0;
    if (!(typeof tour === 'number' && Number.isInteger(tour) && tour >= 0 && tour <= 2)) return 'Tour de négociation invalide (0 à 2).';
    const effectif = motifRefusEffectif(monde, contrat.organisation, contrat.personne, contrat.poste, contrat.fin + 1, Math.max(contrat.fin, monde.date.annee) + cond.duree);
    if (effectif) return effectif;
    const promesses = c.parametres['promesses'] ?? [];
    if (!Array.isArray(promesses)) return 'Liste de promesses invalide.';
    const cibles = (c.parametres['cibles'] ?? {}) as Record<string, string>;
    for (const t of promesses as TypePromesse[]) {
      const m = motifPromesseInvalide(t, parametresPromesse(t, cond.salaire, contrat.fin, cibles));
      if (m) return m;
    }
    const e = ecurie(monde, contrat.organisation);
    if (e && contrat.poste === 'pilote_titulaire' && cond.salaire > contrat.salaireMEUR) {
      const refus = motifRefusConseil(monde, e, contrat.personne, cond.salaire, monde.date.annee, Math.max(contrat.fin, monde.date.annee) + cond.duree);
      if (refus) return refus;
    }
    return null;
  },
  appliquer({ monde }, c) {
    const contrat = contratEmploi(monde, String(c.parametres['personne'])) as Contrat;
    const promesses = (c.parametres['promesses'] as TypePromesse[] | undefined) ?? [];
    const cond = lireConditions(c.parametres['salaire'], c.parametres['duree']) as { salaire: number; duree: number };
    const res = proposerProlongation(monde, contrat, c.auteur, cond.salaire, cond.duree, promesses, Number(c.parametres['tour'] ?? 0), [], (c.parametres['cibles'] ?? {}) as Record<string, string>);
    if (res.issue === 'contre_offre') {
      table(monde, TABLE_NEGOCIATIONS)[contrat.id] = { id: contrat.id, contrat: contrat.id, salaireDemande: res.salaireDemande, dureeAnnees: cond.duree, promesses, evenement: res.evenement.id } as unknown as Entite;
    } else delete table(monde, TABLE_NEGOCIATIONS)[contrat.id];
  },
};

export const commandeNePasProlonger: DefinitionCommande = {
  type: 'contrat.ne_pas_prolonger',
  valider: (monde, c) => valideurTP(monde, c) ?? (contratEmploi(monde, String(c.parametres['personne'])) ? null : 'Aucun contrat actif.'),
  appliquer({ monde }, c) {
    nePasProlonger(monde, contratEmploi(monde, String(c.parametres['personne'])) as Contrat, c.auteur, String(c.parametres['motif'] ?? 'choix du team principal'));
  },
};

export function installerContrats(moteur: Moteur): Moteur {
  moteur.ajouterSysteme(systemeNegociations).ajouterSysteme(systemeFinsDeContrat).ajouterSysteme(systemeReservoir);
  moteur.commandes.enregistrer(commandeProposerProlongation).enregistrer(commandeNePasProlonger);
  return moteur;
}

export { creerContrat };
export type { Poste };
