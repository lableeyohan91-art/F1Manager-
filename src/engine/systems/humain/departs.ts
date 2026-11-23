/**
 * Phase 8d-2 — démissions et ruptures négociées (D-077 ; fiche phase 8 §9 ; D-136).
 *
 * - Une personne qui a envie de partir (motivation, méfiance envers le team principal, rancœur, lassitude) peut demander un départ à
 *   l'amiable, contre une partie de son indemnité. L'employeur accepte ou refuse : l'IA selon qu'elle peut la remplacer et lui fait
 *   encore confiance ; le joueur par la commande `contrat.repondre_depart`.
 * - Après un refus, une envie très forte peut mener à la démission : départ sans indemnité, période de non-concurrence, sentiment de
 *   trahison chez le team principal.
 * - L'employeur peut proposer une rupture négociée (commande `contrat.rupture_negociee`, même règle pour le joueur et l'IA) :
 *   la personne accepte si l'indemnité proposée suffit, compte tenu de son envie de partir.
 */

import { RANG_POSTE } from '../../balance/marche';
import { DEMANDES_DEPART, ENVIE_DE_PARTIR, REPONSE_EMPLOYEUR, RUPTURE_NEGOCIEE, SOUVENIRS_DEPARTS } from '../../balance/departs';
import { ajouterEvenement } from '../../core/evenements';
import type { DefinitionCommande } from '../../core/commandes';
import { idsTries, table, type Monde } from '../../core/monde';
import { tirageLocal, type Systeme } from '../../core/moteur';
import { TABLES, type Contrat, type Ecurie, type Personne, type Poste } from '../../model/types';
import { lireEvenement, relation } from '../memoire';
import { candidatPour, contratEmploi, indemniteRupture, liberer, personneDe, pourvoirPostes } from './contrats';
import { lassitude, niveauMetier, teamPrincipal } from './decision';
import { performanceInsuffisante } from './interactions';

const r1 = (x: number) => Math.round(x * 10) / 10;
const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const nom = (p: Personne) => `${p.prenom} ${p.nom}`;
const rang = (d: { annee: number; semaine: number }) => d.annee * 52 + d.semaine;

/** Envie de partir (0 à 1), calculée : les raisons sont rendues pour les explications. */
export function envieDePartir(monde: Monde, p: Personne): { envie: number; raisons: Record<string, number> } {
  if (p.statut !== 'actif' || !p.ecurie) return { envie: 0, raisons: {} };
  const tp = teamPrincipal(monde, p.ecurie);
  const raisons = {
    motivation: ENVIE_DE_PARTIR.poidsMotivation * (1 - p.etat.motivation / 100),
    mefiance: tp && tp.id !== p.id ? ENVIE_DE_PARTIR.poidsMefiance * Math.max(0, -relation(monde, p.id, tp.id).confiance) : 0,
    rancoeur: ENVIE_DE_PARTIR.poidsRancoeur * Math.max(0, -relation(monde, p.id, p.ecurie).confiance),
    lassitude: ENVIE_DE_PARTIR.poidsLassitude * Math.min(1, lassitude(monde, p).niveau / ENVIE_DE_PARTIR.lassitudeMax),
  };
  return { envie: borner(Object.values(raisons).reduce((a, b) => a + b, 0), 0, 1), raisons };
}

/** Personnel concerné par les demandes de départ de l'IA : ni pilotes ni team principal (nommé par le conseil). */
const concerne = (p: Personne) => p.statut === 'actif' && !!p.ecurie && !p.poste.startsWith('pilote') && p.poste !== 'team_principal' && p.poste !== 'ancien_pilote' && (RANG_POSTE[p.poste] ?? 0) > 0;

/** Départ à l'amiable : contrat rompu, indemnité convenue versée par l'employeur. */
function rompreALAmiable(monde: Monde, p: Personne, c: Contrat, indemnite: number, initiateur: 'employeur' | 'personne'): void {
  delete c.demandeDepart;
  c.clauses.indemniteRuptureMEUR = r1(indemnite); // l'indemnité convenue remplace celle du contrat (versée une seule fois par liberer)
  liberer(monde, p, c, initiateur === 'employeur' ? 'rupture_employeur' : 'rupture_personne');
}

/** Démission : départ sans indemnité, non-concurrence, trahison ressentie par le team principal. */
export function demissionner(monde: Monde, p: Personne, c: Contrat, causes: string[] = []): void {
  const tp = teamPrincipal(monde, p.ecurie);
  const ecurie = p.ecurie;
  const evt = ajouterEvenement(monde, {
    type: 'contrat.demission', acteurs: [{ id: p.id, role: 'auteur' }, { id: ecurie, role: 'organisation' }, ...(tp ? [{ id: tp.id, role: 'cible' }] : [])],
    importance: 3, visibilite: 'public', causes, contexte: { contrat: c.id, envie: Math.round(envieDePartir(monde, p).envie * 100) / 100 },
    texte: `${nom(p)} démissionne de ${(table(monde, TABLES.ecuries)[ecurie] as unknown as Ecurie | undefined)?.nom ?? ecurie}.`,
  });
  delete c.demandeDepart;
  c.clauses.indemniteRuptureMEUR = 0;
  liberer(monde, p, c, 'demission');
  const fin = rang(monde.date) + DEMANDES_DEPART.nonConcurrenceSemaines;
  p.nonConcurrenceJusqua = { annee: Math.floor((fin - 1) / 52), semaine: ((fin - 1) % 52) + 1 };
  if (tp) lireEvenement(monde, tp.id, p.id, 'trahison', evt.id, { facteur: SOUVENIRS_DEPARTS.trahisonDemission });
}

/** Un employeur de l'IA peut-il remplacer cette personne sans perte ? (un candidat libre au moins aussi bon, à la tolérance près) */
function remplacable(monde: Monde, p: Personne): boolean {
  const niveau = niveauMetier(p);
  return (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).some((x) => x.statut === 'libre' && candidatPour(x, p.poste as Poste) && niveauMetier(x) >= niveau - REPONSE_EMPLOYEUR.toleranceNiveau);
}

/** Réponse à une demande de départ (IA ou joueur). */
export function repondreDepart(monde: Monde, tp: Personne, p: Personne, accepter: boolean): void {
  const c = contratEmploi(monde, p.id) as Contrat;
  const demande = c.demandeDepart!;
  const evt = ajouterEvenement(monde, {
    type: accepter ? 'contrat.depart_accepte' : 'contrat.depart_refuse', acteurs: [{ id: tp.id, role: 'auteur' }, { id: p.id, role: 'cible' }, { id: p.ecurie, role: 'organisation' }],
    importance: 2, visibilite: 'prive', contexte: { indemnite: demande.indemnite },
  });
  if (accepter) rompreALAmiable(monde, p, c, demande.indemnite, 'personne');
  else {
    c.demandeDepart = { ...demande, refusee: true };
    lireEvenement(monde, p.id, tp.id, 'conflit', evt.id, { facteur: SOUVENIRS_DEPARTS.conflitRefusDepart });
  }
}

/** Proposition de rupture négociée par l'employeur : la personne accepte ou non. */
export function proposerRupture(monde: Monde, tp: Personne, p: Personne, indemnite: number): boolean {
  const c = contratEmploi(monde, p.id) as Contrat;
  const { envie } = envieDePartir(monde, p);
  const plein = indemniteRupture(c);
  const accepte = indemnite >= RUPTURE_NEGOCIEE.exigence * plein * (1 - envie) - 1e-9;
  const evt = ajouterEvenement(monde, {
    type: accepte ? 'contrat.rupture_negociee' : 'contrat.rupture_refusee', acteurs: [{ id: tp.id, role: 'auteur' }, { id: p.id, role: 'cible' }, { id: p.ecurie, role: 'organisation' }],
    importance: accepte ? 3 : 2, visibilite: accepte ? 'public' : 'prive', contexte: { indemnite: r1(indemnite), indemnitePleine: plein, envie: Math.round(envie * 100) / 100 },
    ...(accepte ? { texte: `${nom(p)} quitte son poste à l'amiable (indemnité de ${r1(indemnite)} M€).` } : {}),
  });
  if (accepte) {
    if (indemnite >= plein) lireEvenement(monde, p.id, tp.id, 'reconnaissance', evt.id, { facteur: SOUVENIRS_DEPARTS.reconnaissanceRupture });
    rompreALAmiable(monde, p, c, indemnite, 'employeur');
  } else lireEvenement(monde, p.id, tp.id, 'conflit', evt.id, { facteur: SOUVENIRS_DEPARTS.conflitRuptureRefusee });
  return accepte;
}

/* ------------------------------------------------------------------ Commandes */

function validerEmployeur(monde: Monde, auteur: string, idPersonne: string): { p: Personne; tp: Personne; c: Contrat } | string {
  const p = personneDe(monde, idPersonne);
  if (!p || p.statut !== 'actif' || !p.ecurie) return 'Personne inconnue ou sans poste.';
  const tp = teamPrincipal(monde, p.ecurie);
  if (!tp || tp.id !== auteur) return 'Seul le team principal de son écurie peut faire cela.';
  if (p.id === auteur) return 'Impossible envers soi-même.';
  const c = contratEmploi(monde, p.id);
  if (!c) return 'Aucun contrat en cours.';
  return { p, tp, c };
}

export const commandeRuptureNegociee: DefinitionCommande = {
  type: 'contrat.rupture_negociee',
  valider(monde, c) {
    const v = validerEmployeur(monde, c.auteur, String(c.parametres['personne'] ?? ''));
    if (typeof v === 'string') return v;
    const indemnite = c.parametres['indemnite'];
    if (!(typeof indemnite === 'number' && Number.isFinite(indemnite) && indemnite >= 0 && indemnite <= RUPTURE_NEGOCIEE.indemniteMax * indemniteRupture(v.c))) return `Indemnité de 0 à ${RUPTURE_NEGOCIEE.indemniteMax} fois l'indemnité de rupture du contrat.`;
    return null;
  },
  appliquer({ monde }, c) {
    const v = validerEmployeur(monde, c.auteur, String(c.parametres['personne'])) as { p: Personne; tp: Personne };
    proposerRupture(monde, v.tp, v.p, Number(c.parametres['indemnite']));
  },
};

export const commandeRepondreDepart: DefinitionCommande = {
  type: 'contrat.repondre_depart',
  valider(monde, c) {
    const v = validerEmployeur(monde, c.auteur, String(c.parametres['personne'] ?? ''));
    if (typeof v === 'string') return v;
    if (!v.c.demandeDepart || v.c.demandeDepart.refusee) return 'Aucune demande de départ en attente.';
    return typeof c.parametres['accepter'] === 'boolean' ? null : 'Préciser accepter : vrai ou faux.';
  },
  appliquer({ monde }, c) {
    const v = validerEmployeur(monde, c.auteur, String(c.parametres['personne'])) as { p: Personne; tp: Personne };
    repondreDepart(monde, v.tp, v.p, c.parametres['accepter'] === true);
  },
};

/* ------------------------------------------------------------------ Système (chaque mois) */

export const systemeDeparts: Systeme = {
  nom: 'humain.departs',
  executer({ monde, date, commanderIA }) {
    if (date.semaine % 4 !== 3) return;
    const tp = table(monde, TABLES.personnes);
    const actifsAvant = Object.values(tp).filter((x) => (x as unknown as Personne).statut === 'actif').length;
    for (const id of idsTries(tp)) {
      const p = tp[id] as unknown as Personne;
      if (!concerne(p)) continue;
      const c = contratEmploi(monde, p.id);
      const e = table(monde, TABLES.ecuries)[p.ecurie] as unknown as Ecurie | undefined;
      const dirigeant = teamPrincipal(monde, p.ecurie);
      if (!c || !e || !dirigeant) continue;
      const f = tirageLocal(monde, 'humain.departs', p.id, date.annee, date.semaine);
      const { envie } = envieDePartir(monde, p);
      const d = c.demandeDepart;
      if (d && !d.refusee) {
        // Demande en attente : l'IA répond tout de suite ; le joueur a un délai, au-delà la demande vaut refus.
        if (!e.pilotee) {
          const accepter = remplacable(monde, p) || relation(monde, dirigeant.id, p.id).confiance < REPONSE_EMPLOYEUR.seuilMefiance;
          repondreDepart(monde, dirigeant, p, accepter && d.indemnite <= REPONSE_EMPLOYEUR.partBudgetMax * e.budgetMEUR);
        } else if (rang(date) - rang(d.depuis) >= DEMANDES_DEPART.delaiReponseSemaines) {
          c.demandeDepart = { ...d, refusee: true };
        }
        continue;
      }
      if (d?.refusee) {
        // Refus : une envie très forte peut mener à la démission ; sinon la demande s'efface quand l'envie retombe.
        if (envie >= DEMANDES_DEPART.seuilDemission && f.chance(DEMANDES_DEPART.probaDemission)) demissionner(monde, p, c);
        else if (envie < DEMANDES_DEPART.seuilDemande) delete c.demandeDepart;
        continue;
      }
      if (envie >= DEMANDES_DEPART.seuilDemande && f.chance(DEMANDES_DEPART.probaDemande)) {
        c.demandeDepart = { indemnite: r1(DEMANDES_DEPART.partIndemniteDemandee * indemniteRupture(c)), depuis: { ...date } };
        ajouterEvenement(monde, {
          type: 'contrat.demande_depart', acteurs: [{ id: p.id, role: 'auteur' }, { id: dirigeant.id, role: 'cible' }, { id: p.ecurie, role: 'organisation' }],
          importance: 2, visibilite: 'prive', contexte: { envie: Math.round(envie * 100) / 100, indemnite: c.demandeDepart.indemnite, raisons: envieDePartir(monde, p).raisons },
        });
        continue;
      }
      // IA employeur : rupture négociée pour une personne insuffisante qui a déjà envie de partir (une fois par saison).
      if (!e.pilotee && envie >= RUPTURE_NEGOCIEE.seuilIA && performanceInsuffisante(monde, p) && c.ruptureProposee !== date.annee) {
        c.ruptureProposee = date.annee;
        const indemnite = r1(RUPTURE_NEGOCIEE.exigence * indemniteRupture(c) * (1 - envie) + RUPTURE_NEGOCIEE.margeIA);
        commanderIA({ type: 'contrat.rupture_negociee', auteur: dirigeant.id, parametres: { personne: p.id, indemnite: Math.min(indemnite, RUPTURE_NEGOCIEE.indemniteMax * indemniteRupture(c)) } });
      }
    }
    // Postes laissés vacants par un départ : recrutement habituel (les écuries du joueur recrutent elles-mêmes).
    if (Object.values(tp).filter((x) => (x as unknown as Personne).statut === 'actif').length < actifsAvant) pourvoirPostes(monde);
  },
};
