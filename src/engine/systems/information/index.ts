/**
 * Phase 8c — qui sait quoi : fuites, rumeurs, révélations, avant-projets de règlement
 * (docs/systemes/phase-8c-qui-sait-quoi.md ; fiche phase 8 §8 ; D-132, D-134).
 *
 * - Un fait privé intéressant est « suivi » : la liste de ceux qui le connaissent est tenue dans `connuPar` (bornée).
 * - Chaque semaine, ceux qui savent peuvent en parler à une relation (fuite), parfois en le déformant (rumeur).
 * - La presse peut le révéler ; trop de monde au courant le rend public.
 * - La réputation perçue (humain/promesses.ts) tient compte de ce que chacun sait, et de ce qu'il en croit.
 * - Avant-projets de règlement : une écurie peut en avoir vent avant leur publication, et les perçoit approximativement.
 */

import { DIFFUSION, FAITS_DIFFUSABLES, FUITES_REGLEMENT, REVELATION, RUMEURS } from '../../balance/information';
import { ORIENTATIONS, type Orientation } from '../../balance/technique';
import { ajouterEvenement, type Evenement } from '../../core/evenements';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal, type Moteur, type Systeme } from '../../core/moteur';
import { TABLES, type Personne } from '../../model/types';
import { indexSouvenirs, relation, TABLE_RELATIONS, type Relation, type Souvenir } from '../memoire';
import { ecuriesActives } from '../saison/performance';
import { decisionsRecherche } from '../technique';
import { avantProjets } from '../technique/acces';
import { faitsSuivis, type FaitSuivi } from './connaissance';

const ETAT = 'etat';
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));

export { connait, faitsConnusPar, faitsSuivis, poidsPercu, type FaitSuivi } from './connaissance';

/* ------------------------------------------------------------------ Suivi des nouveaux faits */

function interetDe(e: Evenement): number {
  if (e.visibilite !== 'prive') return 0;
  if (e.type === 'marche.offre' && e.importance < 2) return 0; // une offre ordinaire n'intéresse personne ; un débauchage, si
  return FAITS_DIFFUSABLES[e.type] ?? 0;
}

/** Dirigeants informés d'un fait qui concerne une écurie : team principal et directeur technique (et directeur financier pour les finances). */
function dirigeantsInformes(parEcurie: Map<string, Personne[]>, idEcurie: string, type: string): string[] {
  const postes = type.startsWith('finances.') ? ['team_principal', 'directeur_technique', 'directeur_financier'] : ['team_principal', 'directeur_technique'];
  return (parEcurie.get(idEcurie) ?? []).filter((p) => postes.includes(p.poste)).map((p) => p.id);
}

function suivreNouveauxFaits(monde: Monde, contexte: () => Contexte): void {
  const t = table(monde, TABLES.information);
  const etat = (t[ETAT] ??= { id: ETAT, dernier: 0 } as unknown as Entite) as unknown as { id: string; dernier: number };
  const dernier = monde.compteurs['evt'] ?? 0;
  if (etat.dernier >= dernier) return;
  // Performance : seuls les événements créés depuis le dernier passage (identifiants numérotés dans l'ordre de création).
  const debut = etat.dernier + 1;
  etat.dernier = dernier;
  for (let n = debut; n <= dernier; n++) {
    const id = `evt_${String(n).padStart(6, '0')}`;
    const e = monde.evenements[id];
    if (!e) continue;
    const interet = interetDe(e);
    if (!interet) continue;
    const ctx = contexte();
    const connus = new Set(e.connuPar);
    for (const a of e.acteurs) {
      if (ctx.personnes.has(a.id)) connus.add(a.id);
      else if (table(monde, TABLES.ecuries)[a.id]) for (const p of dirigeantsInformes(ctx.parEcurie, a.id, e.type)) connus.add(p);
    }
    e.connuPar = [...connus].sort().slice(0, DIFFUSION.connaisseursMax);
    faitsSuivis(monde)[id] = { id, interet, debut: { ...monde.date }, perception: {}, rumeur: [], source: {} } satisfies FaitSuivi as unknown as Entite;
  }
}

/* ------------------------------------------------------------------ Diffusion */

interface Contexte {
  personnes: Map<string, Personne>;
  parEcurie: Map<string, Personne[]>;
  /** Index des relations, construit seulement si quelqu'un parle (performance ; même ordre : identifiants triés). */
  relations?: Map<string, Relation[]>;
  souvenirs?: Map<string, Souvenir[]>;
}

function construireContexte(monde: Monde): Contexte {
  const personnes = new Map<string, Personne>();
  const parEcurie = new Map<string, Personne[]>();
  const tp = table(monde, TABLES.personnes);
  for (const id of idsTries(tp)) {
    const p = tp[id] as unknown as Personne;
    if (p.statut !== 'actif') continue;
    personnes.set(id, p);
    if (p.ecurie) (parEcurie.get(p.ecurie) ?? parEcurie.set(p.ecurie, []).get(p.ecurie)!).push(p);
  }
  return { personnes, parEcurie };
}

function relationsDe(monde: Monde, ctx: Contexte, id: string): Relation[] {
  if (!ctx.relations) {
    const relations = new Map<string, Relation[]>();
    const tr = table(monde, TABLE_RELATIONS);
    for (const rid of idsTries(tr)) {
      const r = tr[rid] as unknown as Relation;
      if (r.familiarite < DIFFUSION.familiariteMin || !ctx.personnes.has(r.vers)) continue;
      (relations.get(r.de) ?? relations.set(r.de, []).get(r.de)!).push(r);
    }
    ctx.relations = relations;
  }
  return ctx.relations.get(id) ?? [];
}

/** Destinataire d'une confidence : une relation (au prorata de familiarité + affinité), sinon un collègue. */
function destinataire(monde: Monde, ctx: Contexte, p: Personne, dejaInformes: Set<string>, alea: number): string | undefined {
  const candidats = relationsDe(monde, ctx, p.id).filter((r) => !dejaInformes.has(r.vers)).map((r) => ({ id: r.vers, poids: r.familiarite + Math.max(0, r.base.affinite) }));
  if (!candidats.length && p.ecurie) for (const c of ctx.parEcurie.get(p.ecurie) ?? []) if (c.id !== p.id && !dejaInformes.has(c.id)) candidats.push({ id: c.id, poids: 1 });
  const total = candidats.reduce((a, c) => a + c.poids, 0);
  if (!total) return undefined;
  let x = alea * total;
  for (const c of candidats) if ((x -= c.poids) <= 0) return c.id;
  return candidats[candidats.length - 1]!.id;
}

function diffuser(monde: Monde, e: Evenement, f: FaitSuivi, ctx: Contexte): void {
  const flux = tirageLocal(monde, 'information.fuite', e.id, monde.date.annee, monde.date.semaine);
  const informes = new Set(e.connuPar);
  for (const id of [...e.connuPar]) {
    if (informes.size >= DIFFUSION.connaisseursMax) break;
    const p = ctx.personnes.get(id);
    const parle = flux.suivant(), choix = flux.suivant(), deforme = flux.suivant();
    if (!p) continue;
    const proba = DIFFUSION.tauxBase * f.interet * (DIFFUSION.discretionMax - (p.traits['discretion'] ?? 10) / 20);
    if (parle >= proba) continue;
    const d = destinataire(monde, ctx, p, informes, choix);
    if (!d) continue;
    informes.add(d);
    const rumeur = f.rumeur.includes(id) || deforme < RUMEURS.base + RUMEURS.manqueProfessionnalisme * (1 - (p.traits['professionnalisme'] ?? 10) / 20);
    ctx.souvenirs ??= indexSouvenirs(monde);
    const confiance = relation(monde, d, id, ctx.souvenirs.get(d) ?? []).confiance;
    const croyance = borner(RUMEURS.croyanceBase + RUMEURS.croyanceConfiance * confiance, 0, 1);
    f.perception[d] = r3(croyance * (rumeur ? RUMEURS.amplification : 1));
    f.source[d] = id;
    if (rumeur) f.rumeur.push(d);
  }
  e.connuPar = [...informes].sort();
}

function reveler(monde: Monde, e: Evenement, f: FaitSuivi, motif: 'presse' | 'trop_de_monde'): void {
  e.visibilite = 'public';
  ajouterEvenement(monde, {
    type: 'information.revelee', acteurs: e.acteurs.filter((a) => a.role === 'auteur' || a.role === 'organisation' || a.role === 'ecurie'),
    importance: f.interet >= REVELATION.seuilImportanceNotable ? 3 : 2, visibilite: 'public', causes: [e.id],
    contexte: { fait: e.id, type: e.type, motif, connaisseurs: e.connuPar.length, rumeurs: f.rumeur.length },
    texte: motif === 'presse'
      ? `La presse révèle une information jusque-là confidentielle (${e.type.replace('.', ' : ').replace(/_/g, ' ')}).`
      : `L'information (${e.type.replace('.', ' : ').replace(/_/g, ' ')}) circulait tant dans le paddock qu'elle est devenue publique.`,
  });
}

function avancerFaits(monde: Monde): void {
  let ctx: Contexte | undefined;
  const contexte = () => (ctx ??= construireContexte(monde));
  suivreNouveauxFaits(monde, contexte);
  const t = faitsSuivis(monde);
  const age = (f: FaitSuivi) => (monde.date.annee - f.debut.annee) * 52 + monde.date.semaine - f.debut.semaine;
  for (const id of idsTries(t)) {
    const f = t[id] as unknown as FaitSuivi;
    const e = monde.evenements[id];
    if (!e) { delete t[id]; continue; } // effacé du journal : on l'oublie aussi
    if (e.visibilite === 'public' || age(f) > DIFFUSION.dureeDiffusion) continue;
    diffuser(monde, e, f, contexte());
    if (e.connuPar.length >= DIFFUSION.connaisseursMax) reveler(monde, e, f, 'trop_de_monde');
    else if (tirageLocal(monde, 'information.presse', id, monde.date.annee, monde.date.semaine).chance(REVELATION.base * f.interet * (e.connuPar.length / DIFFUSION.connaisseursMax))) reveler(monde, e, f, 'presse');
  }
  // Volume borné : les plus anciens faits suivis sont oubliés.
  const ids = idsTries(t);
  for (const id of ids.slice(0, Math.max(0, ids.length - DIFFUSION.faitsMax))) delete t[id];
}

/* ------------------------------------------------------------------ Avant-projets de règlement (lien 8b) */

type Commander = (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => unknown;

function fuitesAvantProjets(monde: Monde, commander: Commander): void {
  const projets = avantProjets(monde);
  if (!projets.length) return;
  for (const e of ecuriesActives(monde)) {
    if (projets.every((r) => (r.connuPar ?? []).includes(e.id))) continue;
    const direction = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.ecurie === e.id && (p.poste === 'team_principal' || p.poste === 'directeur_technique'));
    const tp = direction.find((p) => p.poste === 'team_principal');
    const proba = FUITES_REGLEMENT.base * ((tp?.competences['politique'] ?? 10) / 20) * (FUITES_REGLEMENT.prestigeBase + e.prestige / 20);
    if (!tirageLocal(monde, 'information.avant_projet', e.id, monde.date.annee, monde.date.semaine).chance(proba)) continue;
    for (const r of projets) (r.connuPar ??= []).includes(e.id) || r.connuPar.push(e.id);
    ajouterEvenement(monde, {
      type: 'reglement.fuite', acteurs: [{ id: e.id, role: 'ecurie' }, ...(tp ? [{ id: tp.id, role: 'auteur' }] : [])], importance: 2, visibilite: 'prive',
      connuPar: direction.map((p) => p.id).sort(), contexte: { avantProjets: projets.map((r) => ({ id: r.id, orientation: r.orientation })), politique: tp?.competences['politique'] ?? null },
      texte: `${e.nom} a vent des réformes que prépare la fédération (${projets.map((r) => ORIENTATIONS[r.orientation as Orientation]?.libelle.toLowerCase() ?? r.orientation).join(', ')}), grâce à son réseau.`,
    });
    decisionsRecherche(monde, commander, e.id);
  }
}

/* ------------------------------------------------------------------ Système */

export const systemeInformation: Systeme = {
  nom: 'information.diffusion',
  executer({ monde, commanderIA }) {
    avancerFaits(monde);
    fuitesAvantProjets(monde, (c) => commanderIA(c));
  },
};

export function installerInformation(moteur: Moteur): Moteur {
  return moteur.ajouterSysteme(systemeInformation);
}

