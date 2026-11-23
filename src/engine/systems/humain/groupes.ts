/**
 * Phase 8d-3 — groupes sociaux émergents (docs/systemes/memoire.md §4 ; fiche phase 8 §9 ; D-137).
 *
 * - Détection chaque saison à partir des relations : familiarité réciproque (avoir travaillé ensemble) et affinité ou respect mutuels.
 * - Leader : la personne la plus respectée de ses liens. Type déduit : clan d'un pilote, opposants à la direction, protégés d'un mentor,
 *   anciens collaborateurs, collègues.
 * - Effets : quand le leader change d'écurie, des membres proposent leurs services à sa nouvelle écurie (candidature spontanée, 7b) ;
 *   un groupe d'opposants pèse sur la motivation de ses membres et de leurs collègues.
 */

import { DETECTION_GROUPES, OPPOSANTS, SUIVRE_LEADER, TYPES_GROUPES } from '../../balance/groupes';
import { PERSONNEL_MARCHE } from '../../balance/marche';
import { ajouterEvenement } from '../../core/evenements';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import type { Systeme } from '../../core/moteur';
import { TABLES, type Personne, type Poste } from '../../model/types';
import { indexSouvenirs, relation, TABLE_RELATIONS, type Relation, type Souvenir } from '../memoire';
import { teamPrincipal } from './decision';
import { causesConnues, dernierFait, noterFaitDepart } from './causes';

export type TypeGroupe = 'clan' | 'opposants' | 'mentor' | 'anciens_collaborateurs' | 'collegues';

export interface Groupe {
  id: string;
  type: TypeGroupe;
  leader: string;
  membres: string[];
  /** Écurie du leader lors de la détection (pour repérer son départ). */
  ecurieLeader: string;
  /** Saison de la première détection de ce groupe (autour de ce leader). */
  depuis: number;
  annee: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;
const LIBELLES_GROUPES: Record<TypeGroupe, string> = {
  clan: 'Un clan', opposants: 'Un groupe d’opposants à la direction', mentor: 'Un cercle de protégés', anciens_collaborateurs: 'Un réseau d’anciens collaborateurs', collegues: 'Un groupe de collègues soudés',
};
const nomPersonne = (monde: Monde, id: string) => { const p = table(monde, TABLES.personnes)[id] as unknown as Personne | undefined; return p ? `${p.prenom} ${p.nom}` : id; };
const POSTES_SUIVEURS = PERSONNEL_MARCHE.postes as readonly Poste[];

export const groupes = (monde: Monde) => idsTries(table(monde, TABLES.groupes)).map((id) => table(monde, TABLES.groupes)[id] as unknown as Groupe);
export const groupeDe = (monde: Monde, idPersonne: string) => groupes(monde).find((g) => g.leader === idPersonne || g.membres.includes(idPersonne));

interface Lien { autre: string; affinite: number; respect: number }

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

/** Lien social de A envers B : depuis D-139, c'est la relation elle-même (affinité naturelle et respect professionnel compris). */
export function lienSocial(monde: Monde, a: Personne, b: Personne, souvenirsA?: Souvenir[]): { affinite: number; respect: number; confiance: number; familiarite: number } {
  return relation(monde, a.id, b.id, souvenirsA);
}

/** Détection des groupes de la saison (déterministe : parcours trié, départage par identifiant). */
export function detecterGroupes(monde: Monde): Groupe[] {
  const personnes = new Map<string, Personne>();
  for (const id of idsTries(table(monde, TABLES.personnes))) {
    const p = table(monde, TABLES.personnes)[id] as unknown as Personne;
    if (p.statut === 'actif') personnes.set(id, p);
  }
  const souvenirs = indexSouvenirs(monde);
  const rel = (de: string, vers: string) => lienSocial(monde, personnes.get(de)!, personnes.get(vers)!, souvenirs.get(de) ?? ([] as Souvenir[]));
  const tr = table(monde, TABLE_RELATIONS);
  const liens = new Map<string, Lien[]>();
  const vus = new Set<string>();
  for (const id of idsTries(tr)) {
    const r = tr[id] as unknown as Relation;
    if (!personnes.has(r.de) || !personnes.has(r.vers) || r.de === r.vers) continue;
    const cle = r.de < r.vers ? `${r.de}|${r.vers}` : `${r.vers}|${r.de}`;
    if (vus.has(cle)) continue;
    vus.add(cle);
    const retour = tr[`rel_${r.vers}__${r.de}`] as unknown as Relation | undefined;
    if (!retour || Math.min(r.familiarite, retour.familiarite) < DETECTION_GROUPES.familiariteMin) continue;
    const ab = rel(r.de, r.vers), ba = rel(r.vers, r.de);
    const affinite = (ab.affinite + ba.affinite) / 2, respect = (ab.respect + ba.respect) / 2;
    if (affinite < DETECTION_GROUPES.affiniteMin && respect < DETECTION_GROUPES.respectMin) continue;
    (liens.get(r.de) ?? liens.set(r.de, []).get(r.de)!).push({ autre: r.vers, affinite: ab.affinite, respect: ba.respect });
    (liens.get(r.vers) ?? liens.set(r.vers, []).get(r.vers)!).push({ autre: r.de, affinite: ba.affinite, respect: ab.respect });
  }
  // Leaders : ceux qui reçoivent le plus de respect de leurs liens (respect de l'autre envers eux).
  const respectRecu = (id: string) => (liens.get(id) ?? []).reduce((a, l) => a + Math.max(0, l.respect), 0);
  const candidats = [...liens.keys()].sort((a, b) => respectRecu(b) - respectRecu(a) || (a < b ? -1 : 1));
  const pris = new Set<string>();
  const res: Groupe[] = [];
  for (const leader of candidats) {
    if (pris.has(leader)) continue;
    const proches = (liens.get(leader) ?? []).filter((l) => !pris.has(l.autre)).sort((a, b) => b.respect + b.affinite - (a.respect + a.affinite) || (a.autre < b.autre ? -1 : 1));
    if (proches.length < DETECTION_GROUPES.membresMin) continue;
    const membres = proches.slice(0, DETECTION_GROUPES.membresMax).map((l) => l.autre).sort();
    pris.add(leader);
    for (const m of membres) pris.add(m);
    const lp = personnes.get(leader)!;
    res.push({ id: `grp_${leader}`, type: typeDe(monde, lp, membres.map((m) => personnes.get(m)!), rel), leader, membres, ecurieLeader: lp.ecurie, depuis: monde.date.annee, annee: monde.date.annee });
  }
  return res;
}

function typeDe(monde: Monde, leader: Personne, membres: Personne[], rel: (de: string, vers: string) => { confiance: number; respect: number; affinite: number }): TypeGroupe {
  if (leader.poste === 'pilote_titulaire') return 'clan';
  const mefiants = membres.filter((m) => {
    const tp = m.ecurie ? teamPrincipal(monde, m.ecurie) : undefined;
    return tp && tp.id !== leader.id && !membres.some((x) => x.id === tp.id) && rel(m.id, tp.id).confiance < TYPES_GROUPES.seuilMefiance;
  });
  if (mefiants.length >= TYPES_GROUPES.partOpposants * membres.length) return 'opposants';
  const ageMoyen = membres.reduce((a, m) => a + m.anneeNaissance, 0) / membres.length;
  const estime = membres.reduce((a, m) => a + rel(m.id, leader.id).respect - rel(m.id, leader.id).affinite, 0);
  if (ageMoyen - leader.anneeNaissance >= TYPES_GROUPES.ecartAgeMentor && estime > 0) return 'mentor';
  if (membres.filter((m) => m.ecurie !== leader.ecurie).length > membres.length / 2) return 'anciens_collaborateurs';
  return 'collegues';
}

/** Mise à jour annuelle : groupes nouveaux, dissous, conservés (même leader). */
function mettreAJour(monde: Monde): void {
  const t = table(monde, TABLES.groupes);
  const anciens = new Map(groupes(monde).map((g) => [g.id, g]));
  for (const id of Object.keys(t)) delete t[id];
  for (const g of detecterGroupes(monde)) {
    const ancien = anciens.get(g.id);
    if (ancien) g.depuis = ancien.depuis;
    else ajouterEvenement(monde, {
      type: 'groupe.forme', acteurs: [{ id: g.leader, role: 'leader' }, ...g.membres.map((m) => ({ id: m, role: 'membre' }))], importance: g.type === 'opposants' ? 3 : 2, visibilite: 'prive',
      connuPar: [g.leader, ...g.membres].sort(), contexte: { groupe: g.id, type: g.type, taille: g.membres.length + 1 },
      texte: `${LIBELLES_GROUPES[g.type]} se forme autour de ${nomPersonne(monde, g.leader)} (${g.membres.length + 1} personnes).`,
    });
    t[g.id] = g as unknown as Entite;
  }
}

/** Le leader a changé d'écurie : des membres proposent leurs services à sa nouvelle écurie (mêmes règles que les candidatures spontanées). */
type Commander = (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => unknown;
export function suivreLesLeaders(monde: Monde, commander: Commander): void {
  for (const g of groupes(monde)) {
    const leader = table(monde, TABLES.personnes)[g.leader] as unknown as Personne | undefined;
    if (!leader || leader.statut !== 'actif' || !leader.ecurie || leader.ecurie === g.ecurieLeader) continue;
    for (const id of g.membres) {
      const m = table(monde, TABLES.personnes)[id] as unknown as Personne | undefined;
      if (!m || m.statut !== 'actif' || m.ecurie !== g.ecurieLeader || !POSTES_SUIVEURS.includes(m.poste)) continue;
      const vers = lienSocial(monde, m, leader);
      const tp = teamPrincipal(monde, m.ecurie);
      const envie = SUIVRE_LEADER.poidsAffinite * vers.affinite + SUIVRE_LEADER.poidsRespect * vers.respect - SUIVRE_LEADER.poidsLoyaute * ((m.traits['loyaute'] ?? 10) / 20)
        - SUIVRE_LEADER.poidsConfianceTP * (tp && tp.id !== m.id ? relation(monde, m.id, tp.id).confiance : 0);
      if (envie < SUIVRE_LEADER.seuil) continue;
      const r = commander({ type: 'marche.candidature', auteur: m.id, parametres: { ecurie: leader.ecurie, poste: m.poste } }) as { ok: boolean } | undefined;
      if (!r?.ok) continue;
      // Jalon A : le départ du leader explique que le membre veuille le suivre ; ce choix explique sa candidature.
      const signatureLeader = dernierFait(monde, (x) => (x.type === 'marche.signature' || x.type === 'recrutement') && x.acteurs.some((a) => a.id === leader.id && a.role === 'personne'), 2);
      const suit = ajouterEvenement(monde, {
        type: 'groupe.suit_leader', acteurs: [{ id: m.id, role: 'membre' }, { id: leader.id, role: 'leader' }, { id: leader.ecurie, role: 'organisation' }], importance: 2, visibilite: 'prive',
        causes: causesConnues(monde, signatureLeader), contexte: { groupe: g.id, envie: r2(envie) },
        texte: `${m.prenom} ${m.nom} veut suivre ${leader.prenom} ${leader.nom} et propose ses services à sa nouvelle écurie.`,
      });
      const candidature = dernierFait(monde, (x) => x.type === 'marche.candidature' && x.acteurs.some((a) => a.id === m.id), 0);
      if (candidature) monde.evenements[candidature]!.causes = causesConnues(monde, ...monde.evenements[candidature]!.causes, suit.id);
      noterFaitDepart(m, suit.id);
    }
  }
}

/** Opposants à la direction : le climat se dégrade (motivation des membres et de leurs collègues). */
function climat(monde: Monde): void {
  const opposants = groupes(monde).filter((g) => g.type === 'opposants');
  if (!opposants.length) return;
  const tp = table(monde, TABLES.personnes);
  for (const g of opposants) {
    const membres = new Set([g.leader, ...g.membres]);
    const ecuries = new Set([...membres].map((id) => (tp[id] as unknown as Personne | undefined)?.ecurie).filter((e): e is string => !!e));
    for (const id of idsTries(tp)) {
      const p = tp[id] as unknown as Personne;
      if (p.statut !== 'actif' || !ecuries.has(p.ecurie)) continue;
      const baisse = membres.has(p.id) ? OPPOSANTS.motivationMembres : OPPOSANTS.motivationEquipe;
      p.etat.motivation = Math.max(0, Math.round((p.etat.motivation - baisse) * 10) / 10);
    }
  }
}

export const systemeGroupes: Systeme = {
  nom: 'humain.groupes',
  executer({ monde, date, commanderIA }) {
    if (date.semaine === SUIVRE_LEADER.semaine) suivreLesLeaders(monde, (c) => commanderIA(c));
    if (date.semaine === DETECTION_GROUPES.semaineDetection) mettreAJour(monde);
    if (date.semaine % 4 === 0) climat(monde);
  },
};
