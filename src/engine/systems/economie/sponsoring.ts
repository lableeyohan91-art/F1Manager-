/**
 * Phase 11c — refonte du sponsoring (docs/systemes/phase-11c-sponsoring.md, D-155) : ce qui se passe pendant la saison.
 *
 * - Offres de contrat faites au joueur (domaine commercial non délégué) : il choisit une variante ou décline ; à l'échéance,
 *   son équipe tranche avec les règles de l'IA.
 * - Objectifs de course du sponsor titre : avant chaque Grand Prix, 3 objectifs calculés pour cette écurie sur ce circuit, plus
 *   « aucun ». Jugés sur les résultats réellement simulés. Sans choix, le directeur commercial choisit (sans arrêt ni alerte).
 * - Opérations exceptionnelles : après un exploit mesuré par rapport au rang attendu public (petites écuries seulement), un sponsor
 *   principal propose une opération ; le pilote demandé est affiché avant acceptation ; effets humains et commerciaux.
 * - Mêmes commandes et mêmes règles pour le joueur et l'IA (D-012).
 */

import { ESTIMATION_GP, CHOIX_EQUIPE, OBJECTIFS_GP, OPERATIONS } from '../../balance/sponsoring';
import { ajouterSemaines, rangSemaine, type DateJeu } from '../../core/calendrier';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement } from '../../core/evenements';
import { nouvelIdentifiant } from '../../core/identifiants';
import { idsTries, parametre, table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal, type Moteur, type Systeme } from '../../core/moteur';
import {
  TABLES, type ContratSponsoring, type Ecurie, type Finances, type FormatOperation, type GrandPrix, type NiveauObjectifGP, type ObjectifGP, type OffreSponsor,
  type OperationSponsor, type OptionObjectifGP, type Personne, type Saison, type Sponsor,
} from '../../model/types';
import { teamPrincipal } from '../humain/decision';
import { iaDecide } from '../joueur/acces';
import { popularite } from '../marche/commercial';
import { changerImage } from '../medias/acces';
import { lireEvenement } from '../memoire';
import { ecuriesActives, pilotesTitulaires } from '../saison/performance';
import { meilleurePosition, probaGP, rangAttenduGP, rangAttenduPublic } from './probabilites';
import { choisirVarianteEquipe, conclure, conjoncture, contratsActifs, emplacementsLibres, meilleurPlacement, offresSponsors, signerSponsor } from './sponsors';

const r1 = (x: number) => Math.round(x * 10) / 10;
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const borner = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const logit = (p: number) => Math.log(Math.max(1e-4, p) / Math.max(1e-4, 1 - p));
const rang = (d: DateJeu) => rangSemaine(d);
const nomDe = (p: Personne) => `${p.prenom} ${p.nom}`;
const ecurieDe = (m: Monde, id: string) => table(m, TABLES.ecuries)[id] as unknown as Ecurie | undefined;
const sponsorDe = (m: Monde, id: string) => table(m, TABLES.sponsors)[id] as unknown as Sponsor | undefined;
const personneDe = (m: Monde, id: string) => table(m, TABLES.personnes)[id] as unknown as Personne | undefined;
const contratDe = (m: Monde, id: string) => table(m, TABLES.contratsSponsoring)[id] as unknown as ContratSponsoring | undefined;
const finances = (m: Monde, idEcurie: string) => (Object.values(table(m, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === idEcurie);

export const NIVEAUX_GP: NiveauObjectifGP[] = ['prudent', 'intermediaire', 'audacieux'];
export const FORMATS_OPERATION: FormatOperation[] = ['tenues', 'visibilite', 'interview', 'campagne'];
/** Seuils de position qu'un sponsor peut fixer pour un Grand Prix (meilleur pilote dans les k premiers). */
const SEUILS_OBJECTIF = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15];

export const objectifsGP = (m: Monde, idEcurie?: string) =>
  idsTries(table(m, TABLES.objectifsGP)).map((id) => table(m, TABLES.objectifsGP)[id] as unknown as ObjectifGP).filter((o) => !idEcurie || o.ecurie === idEcurie);
export const operationsSponsors = (m: Monde, idEcurie?: string) =>
  idsTries(table(m, TABLES.operationsSponsors)).map((id) => table(m, TABLES.operationsSponsors)[id] as unknown as OperationSponsor).filter((o) => !idEcurie || o.ecurie === idEcurie);

/** Verse une prime de sponsoring dans les comptes de l'année en cours. */
function verser(monde: Monde, c: ContratSponsoring, montant: number): void {
  const fi = finances(monde, c.ecurie);
  if (!fi || montant <= 0) return;
  fi.comptes.sponsors += montant;
  fi.tresorerieMEUR += montant;
  c.primesVerseesMEUR = r1(c.primesVerseesMEUR + montant);
}

function prochainGP(monde: Monde): GrandPrix | undefined {
  const s = table(monde, TABLES.saisons)[`ssn_${monde.date.annee}`] as unknown as Saison | undefined;
  if (!s) return undefined;
  for (const id of s.calendrier) {
    const gp = table(monde, TABLES.grandsPrix)[id] as unknown as GrandPrix | undefined;
    if (gp && !gp.termine) return gp;
  }
  return undefined;
}

/* ================================================================ Offres de contrat (joueur) */

/** Signe une variante d'une offre (commande du joueur, ou décision de l'équipe), puis retire les offres devenues sans objet. */
export function signerOffre(monde: Monde, o: OffreSponsor, variante: string, parQui: 'joueur' | 'equipe'): ContratSponsoring | undefined {
  const s = sponsorDe(monde, o.sponsor), e = ecurieDe(monde, o.ecurie);
  const v = o.variantes.find((x) => x.variante === variante);
  delete table(monde, TABLES.offresSponsors)[o.id];
  if (!s || !e || !v) return undefined;
  const c = signerSponsor(monde, s, e, o.rang, v.fixeMEUR, o.annee, o.renouvellement, v);
  ajouterEvenement(monde, {
    type: 'sponsor.offre_signee', acteurs: [{ id: e.id, role: 'auteur' }, { id: s.id, role: 'sponsor' }], importance: 1, visibilite: 'prive', connuPar: [e.id],
    contexte: { offre: o.id, contrat: c.id, variante: v.variante, parQui },
    texte: `${parQui === 'joueur' ? 'Vous signez' : 'Votre directeur commercial signe'} avec ${s.nom} (contrat ${LIBELLES_VARIANTES[v.variante]}).`,
  });
  if (emplacementsLibres(monde, e.id, o.annee)[o.rang] <= 0) for (const x of offresSponsors(monde, e.id)) if (x.rang === o.rang && x.annee === o.annee) declinerOffre(monde, x, 'place prise');
  return c;
}

/** Décline une offre : le sponsor cherche une autre écurie (mêmes règles que le marché). */
export function declinerOffre(monde: Monde, o: OffreSponsor, motif: string): void {
  delete table(monde, TABLES.offresSponsors)[o.id];
  const s = sponsorDe(monde, o.sponsor), e = ecurieDe(monde, o.ecurie);
  if (!s || !e) return;
  ajouterEvenement(monde, {
    type: 'sponsor.offre_declinee', acteurs: [{ id: e.id, role: 'auteur' }, { id: s.id, role: 'sponsor' }], importance: 1, visibilite: 'prive', connuPar: [e.id],
    contexte: { offre: o.id, motif }, texte: `L'offre de ${s.nom} n'est pas retenue (${motif}).`,
  });
  const autre = meilleurPlacement(monde, s, o.annee, e.id);
  if (autre) conclure(monde, s, autre.e, autre.rang, autre.montant, o.annee, false);
}

/** À l'échéance (ou si le domaine commercial est délégué), l'équipe tranche : elle remplit les places libres avec les meilleures offres. */
function trancherOffres(monde: Monde): void {
  const maintenant = rang(monde.date);
  for (const o of offresSponsors(monde)) {
    if (!table(monde, TABLES.offresSponsors)[o.id]) continue; // déjà traitée
    const e = ecurieDe(monde, o.ecurie);
    if (!e) { delete table(monde, TABLES.offresSponsors)[o.id]; continue; }
    if (rang(o.echeance) > maintenant && !iaDecide(e, 'commercial')) continue;
    // Les offres du même rang sont examinées ensemble, de la plus chère à la moins chère.
    const lot = offresSponsors(monde, e.id).filter((x) => x.rang === o.rang && x.annee === o.annee)
      .sort((a, b) => b.variantes[0]!.valeurAttendueMEUR - a.variantes[0]!.valeurAttendueMEUR || (a.id < b.id ? -1 : 1));
    for (const x of lot) {
      if (!table(monde, TABLES.offresSponsors)[x.id]) continue;
      if (emplacementsLibres(monde, e.id, x.annee)[x.rang] > 0) signerOffre(monde, x, choisirVarianteEquipe(monde, e, x.variantes).variante, 'equipe');
      else declinerOffre(monde, x, 'place prise');
    }
  }
}

export const LIBELLES_VARIANTES: Record<string, string> = { prudente: 'prudent', equilibree: 'équilibré', audacieuse: 'audacieux' };

/* ================================================================ Objectifs de course (sponsor titre) */

/** Fourchette affichée par le directeur sportif : plus étroite avec sa compétence stratégie (D-155 question 5). */
function estimation(monde: Monde, e: Ecurie, p: number, cle: string): [number, number] {
  const ds = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((x) => x.statut === 'actif' && x.ecurie === e.id && x.poste === 'directeur_sportif');
  const strategie = ds?.competences['strategie'] ?? 10;
  const w = ESTIMATION_GP.demiLargeurMin + (ESTIMATION_GP.demiLargeurMax - ESTIMATION_GP.demiLargeurMin) * (1 - strategie / 20);
  const centre = p + tirageLocal(monde, 'sponsor.estimation', cle).normale(0, ESTIMATION_GP.biais * w);
  const pas = (x: number) => Math.round(borner(x, 0, 1) / ESTIMATION_GP.pas) * ESTIMATION_GP.pas;
  return [r3(pas(centre - w)), r3(Math.max(pas(centre - w), pas(centre + w)))];
}

/** Prépare l'objectif du prochain Grand Prix pour une écurie qui a un sponsor titre avec une enveloppe de course. */
function preparerObjectif(monde: Monde, e: Ecurie, c: ContratSponsoring, gp: GrandPrix): void {
  const id = `obj_${gp.id}_${e.id}`;
  if (table(monde, TABLES.objectifsGP)[id]) return;
  const s = sponsorDe(monde, c.sponsor);
  const saison = table(monde, TABLES.saisons)[`ssn_${gp.saison}`] as unknown as Saison | undefined;
  if (!s || !saison || !c.enveloppeGPMEUR) return;
  const part = c.enveloppeGPMEUR / Math.max(1, saison.calendrier.length);
  const r = rangAttenduGP(monde, e, gp);
  const n = ecuriesActives(monde).length;
  const primeMax = s.budgetMEUR * conjoncture(monde) * OBJECTIFS_GP.primeMaxPartBudget;
  const options: OptionObjectifGP[] = [];
  const pris = new Set<number>();
  for (const niveau of NIVEAUX_GP) {
    const visee = OBJECTIFS_GP.probaVisee[niveau];
    const valeur = part * (1 - OBJECTIFS_GP.decote[niveau]);
    let best: { k: number; p: number } | undefined, score = Infinity;
    for (const k of SEUILS_OBJECTIF) {
      const p = probaGP(r, n, k);
      if (pris.has(k) || p < 0.03 || p > 0.97 || valeur / p > primeMax) continue;
      const sc = Math.abs(logit(p) - logit(visee));
      if (sc < score) { score = sc; best = { k, p }; }
    }
    if (!best) continue;
    pris.add(best.k);
    options.push({ niveau, seuil: best.k, primeMEUR: r1(valeur / best.p), probabilite: r3(best.p), estimation: estimation(monde, e, best.p, `${id}:${niveau}`) });
  }
  // Ordre : du plus facile au plus difficile (seuil décroissant).
  options.sort((a, b) => b.seuil - a.seuil);
  const obj: ObjectifGP = { id, gp: gp.id, ecurie: e.id, contrat: c.id, partMEUR: r3(part), options };
  table(monde, TABLES.objectifsGP)[id] = obj as unknown as Entite;
}

/** Choix du directeur commercial : utilité selon son estimation et le goût du risque du team principal (aucun arrêt, aucune alerte). */
export function choisirObjectifEquipe(monde: Monde, o: ObjectifGP): NiveauObjectifGP | 'aucun' {
  // Réglage d'expérience (mesures, sans effet en partie) : 1 = toujours prudent, 2 = toujours audacieux, 3 = jamais d'objectif.
  const force = parametre(monde, 'experience.sponsoring.objectif', 0);
  if (force === 3) return 'aucun';
  if (force === 1 || force === 2) return o.options.find((x) => x.niveau === (force === 1 ? 'prudent' : 'audacieux'))?.niveau ?? 'aucun';
  const risque = teamPrincipal(monde, o.ecurie)?.traits['risque'] ?? 10;
  const aversion = (10 - risque) / CHOIX_EQUIPE.diviseurAversion;
  let choix: NiveauObjectifGP | 'aucun' = 'aucun', meilleure = o.partMEUR * OBJECTIFS_GP.aucun;
  for (const x of o.options) {
    const p = (x.estimation[0] + x.estimation[1]) / 2;
    const u = x.primeMEUR * p - aversion * x.primeMEUR * Math.sqrt(p * (1 - p));
    if (u > meilleure + 1e-9) { meilleure = u; choix = x.niveau; }
  }
  return choix;
}

function jugerObjectif(monde: Monde, o: ObjectifGP, gp: GrandPrix): void {
  delete table(monde, TABLES.objectifsGP)[o.id];
  const c = contratDe(monde, o.contrat), e = ecurieDe(monde, o.ecurie);
  if (!c || !e || c.statut !== 'actif') return;
  if (!o.choix) { o.choix = choisirObjectifEquipe(monde, o); o.choisiPar = 'equipe'; }
  const best = meilleurePosition(gp, e.id);
  const opt = o.options.find((x) => x.niveau === o.choix);
  const montant = o.choix === 'aucun' ? r1(o.partMEUR * OBJECTIFS_GP.aucun) : opt && best !== undefined && best <= opt.seuil ? opt.primeMEUR : 0;
  verser(monde, c, montant);
  // Seule l'écurie du joueur reçoit un message par course (volume borné) ; pour l'IA, la prime figure dans ses comptes et son contrat.
  if (e.pilotee) {
    const s = sponsorDe(monde, c.sponsor);
    const libelle = o.choix === 'aucun' ? 'sans objectif' : `objectif ${o.choix} (top ${opt?.seuil})`;
    ajouterEvenement(monde, {
      type: 'sponsor.objectif_course', acteurs: [{ id: c.sponsor, role: 'auteur' }, { id: e.id, role: 'cible' }], importance: montant > 0 && o.choix !== 'aucun' ? 2 : 1, visibilite: 'prive', connuPar: [e.id],
      contexte: { gp: gp.id, choix: o.choix, choisiPar: o.choisiPar ?? 'joueur', seuil: opt?.seuil ?? 0, meilleurePosition: best ?? 0, montant },
      texte: `${s?.nom ?? 'Le sponsor titre'} : ${libelle}, meilleure place ${best ?? 'abandon'} → ${montant > 0 ? `${montant} M€` : 'pas de prime'}.`,
    });
  }
}

/* ================================================================ Opérations exceptionnelles */

function exploit(monde: Monde, e: Ecurie, gp: GrandPrix): { type: 'podium' | 'victoire'; r: number; auteur: string } | undefined {
  const best = meilleurePosition(gp, e.id);
  if (best === undefined || best > 3) return undefined;
  const r = rangAttenduPublic(monde, e.id);
  if (r <= OPERATIONS.rangMaxJamais) return undefined;
  const type = best === 1 && r >= OPERATIONS.rangMinVictoire ? 'victoire' : r >= OPERATIONS.rangMinPodium ? 'podium' : undefined;
  if (!type) return undefined;
  const auteur = gp.resultats.find((x) => x.ecurie === e.id && x.position === best)!.pilote;
  return { type, r, auteur };
}

export function proposerOperation(monde: Monde, e: Ecurie, gp: GrandPrix): void {
  const x = exploit(monde, e, gp);
  if (!x) return;
  const annee = monde.date.annee;
  const passees = operationsSponsors(monde, e.id);
  if (passees.some((o) => o.proposeeLe.annee === annee)) return; // au plus une par écurie et par saison
  if (passees.some((o) => rang(monde.date) - rang(o.proposeeLe) < OPERATIONS.delaiSemaines)) return;
  const contrats = contratsActifs(monde, annee, e.id).filter((c) => c.rang === 'principal' && !c.operationFaite)
    .sort((a, b) => (sponsorDe(monde, b.sponsor)?.budgetMEUR ?? 0) - (sponsorDe(monde, a.sponsor)?.budgetMEUR ?? 0) || (a.id < b.id ? -1 : 1));
  const c = contrats[0];
  const s = c && sponsorDe(monde, c.sponsor);
  if (!c || !s) return;
  const n = ecuriesActives(monde).length;
  const petitesse = n > 1 ? (x.r - 1) / (n - 1) : 0;
  const base = s.budgetMEUR * conjoncture(monde) * (OPERATIONS.partMin + (OPERATIONS.partMax - OPERATIONS.partMin) * petitesse) * (x.type === 'victoire' ? OPERATIONS.bonusVictoire : 1);
  const f = tirageLocal(monde, 'sponsor.operation', e.id, gp.id);
  const ciblages = Object.keys(OPERATIONS.ciblage) as OperationSponsor['ciblage'][];
  const ciblage = f.choisirPondere(ciblages, ciblages.map((k) => OPERATIONS.ciblage[k]));
  const titulaires = pilotesTitulaires(monde).filter((p) => p.ecurie === e.id).sort((a, b) => (a.id < b.id ? -1 : 1));
  const saison = table(monde, TABLES.saisons)[`ssn_${annee}`] as unknown as Saison | undefined;
  const points = (id: string) => saison?.pilotes.find((l) => l.pilote === id)?.points ?? 0;
  const pilote = ciblage === 'exploit' ? x.auteur
    : ciblage === 'populaire' ? [...titulaires].sort((a, b) => popularite(b).internationale - popularite(a).internationale)[0]?.id
    : ciblage === 'numero1' ? [...titulaires].sort((a, b) => points(b.id) - points(a.id))[0]?.id : undefined;
  const ev = [...Object.keys(monde.evenements)].reverse().find((id) => {
    const v = monde.evenements[id]!;
    return (v.type === 'gp.victoire' || v.type === 'gp.podium') && v.contexte?.['gp'] === gp.id && v.acteurs.some((a) => a.id === x.auteur);
  });
  const suivant = prochainGP(monde);
  const op: OperationSponsor = {
    id: nouvelIdentifiant(monde, 'ops'), ecurie: e.id, contrat: c.id, sponsor: s.id, evenement: ev ?? '', exploit: x.type, rangAttendu: r1(x.r),
    ciblage, ...(pilote ? { pilote } : {}), auteur: x.auteur,
    formats: FORMATS_OPERATION.map((format) => ({ format, montantMEUR: r1(base * OPERATIONS.formats[format].multiplicateur) })),
    echeance: suivant ? { annee, semaine: suivant.semaine } : ajouterSemaines(monde.date, 2), proposeeLe: { ...monde.date }, statut: 'proposee',
  };
  table(monde, TABLES.operationsSponsors)[op.id] = op as unknown as Entite;
  const p = pilote ? personneDe(monde, pilote) : undefined;
  ajouterEvenement(monde, {
    type: 'sponsor.operation_proposee', acteurs: [{ id: s.id, role: 'auteur' }, { id: e.id, role: 'cible' }, ...(p ? [{ id: p.id, role: 'pilote' }] : [])], importance: 2,
    visibilite: 'prive', connuPar: [e.id], causes: ev ? [ev] : [],
    contexte: { operation: op.id, exploit: x.type, rangAttendu: op.rangAttendu, ciblage },
    texte: `Après ${x.type === 'victoire' ? 'une victoire' : 'un podium'} inattendu, ${s.nom} propose une opération publicitaire${p ? ` avec ${nomDe(p)}` : ''}.`,
  });
  if (iaDecide(e, 'commercial')) decisionEquipeOperation(monde, op);
}

/** Choix de l'équipe : accepter, avec un format que le pilote supporte (et pas de visibilité qui gênerait le sponsor titre). */
export function decisionEquipeOperation(monde: Monde, op: OperationSponsor): void {
  const pilote = op.pilote ?? op.auteur;
  const p = personneDe(monde, pilote);
  if (!p || p.ecurie !== op.ecurie || p.statut !== 'actif') { expirer(monde, op, 'pilote absent'); return; }
  // Réglage d'expérience (mesures, sans effet en partie) : 1 = tout accepter en campagne complète, 2 = tout refuser.
  const force = parametre(monde, 'experience.sponsoring.operations', 0);
  if (force === 2) { refuserOperation(monde, op); return; }
  if (force === 1) { accepterOperation(monde, op, 'campagne', pilote, 'equipe'); return; }
  const titre = contratsActifs(monde, monde.date.annee, op.ecurie).some((c) => c.rang === 'titre');
  const reserve = (p.traits['discretion'] ?? 10) >= OPERATIONS.seuilReserve || (p.traits['professionnalisme'] ?? 10) >= OPERATIONS.seuilReserve;
  const format: FormatOperation = reserve ? (titre ? 'tenues' : 'visibilite') : (p.traits['besoinReconnaissance'] ?? 10) >= 12 ? 'campagne' : 'interview';
  accepterOperation(monde, op, format, pilote, 'equipe');
}

function expirer(monde: Monde, op: OperationSponsor, motif: string): void {
  op.statut = 'expiree';
  ajouterEvenement(monde, {
    type: 'sponsor.operation_expiree', acteurs: [{ id: op.sponsor, role: 'auteur' }, { id: op.ecurie, role: 'cible' }], importance: 1, visibilite: 'prive', connuPar: [op.ecurie],
    contexte: { operation: op.id, motif }, texte: `L'opération publicitaire proposée tombe (${motif}).`,
  });
}

const SOLLICITATIONS = ['legere', 'moyenne', 'lourde'] as const;

export function accepterOperation(monde: Monde, op: OperationSponsor, format: FormatOperation, pilote: string, parQui: 'joueur' | 'equipe'): void {
  const c = contratDe(monde, op.contrat), s = sponsorDe(monde, op.sponsor), p = personneDe(monde, pilote), e = ecurieDe(monde, op.ecurie);
  if (!c || !s || !p || !e || c.statut !== 'actif') { expirer(monde, op, 'contrat ou pilote absent'); return; }
  const def = OPERATIONS.formats[format];
  const montant = op.formats.find((x) => x.format === format)?.montantMEUR ?? 0;
  op.statut = 'acceptee';
  op.format = format;
  op.pilote = pilote;
  c.operationFaite = true;
  verser(monde, c, montant);
  c.satisfaction = borner(c.satisfaction + OPERATIONS.satisfactionSponsor, 0, 100);
  const titre = contratsActifs(monde, monde.date.annee, e.id).find((x) => x.rang === 'titre' && x.id !== c.id);
  if (format === 'visibilite' && titre) titre.satisfaction = borner(titre.satisfaction - OPERATIONS.perteSponsorTitre, 0, 100);
  // Exposition et image du pilote (phase 11).
  p.exposition = Math.min(100, r1((p.exposition ?? 0) + def.exposition));
  changerImage(p, def.image);
  const sollicitation = SOLLICITATIONS[def.sollicitation - 1]!;
  const ev = ajouterEvenement(monde, {
    type: 'sponsor.operation', acteurs: [{ id: p.id, role: 'pilote' }, { id: s.id, role: 'sponsor' }, { id: e.id, role: 'ecurie' }], importance: 2, visibilite: 'public',
    causes: op.evenement ? [op.evenement] : [],
    // `sollicitation` : fait daté que la jauge d'énergie de la phase 13 lira (aucun effet sportif avant).
    contexte: { operation: op.id, format, sollicitation, montant, parQui, gene: format === 'visibilite' && !!titre },
    texte: `${nomDe(p)} participe à une opération ${LIBELLES_FORMATS[format]} de ${s.nom} pour ${e.nom} (${montant} M€).`,
  });
  // Souvenir selon la personnalité : mis en valeur, ou sollicité à l'excès (d'autant plus si l'écurie multiplie les opérations lourdes).
  const tp = teamPrincipal(monde, e.id);
  if (tp && tp.id !== p.id) {
    const valorise = (p.traits['besoinReconnaissance'] ?? 10) >= (p.traits['discretion'] ?? 10);
    const lourdesRecentes = operationsSponsors(monde, e.id).filter((o) => o.id !== op.id && o.statut === 'acceptee' && o.format && OPERATIONS.formats[o.format].sollicitation >= 3 && rang(monde.date) - rang(o.proposeeLe) < 52).length;
    const facteur = OPERATIONS.souvenirParSollicitation * def.sollicitation * (valorise ? 1 : 1 + OPERATIONS.surcroitParOperationLourde * lourdesRecentes);
    lireEvenement(monde, p.id, tp.id, valorise ? 'reconnaissance' : 'sollicitation', ev.id, { facteur });
  }
}

export function refuserOperation(monde: Monde, op: OperationSponsor): void {
  op.statut = 'refusee';
  ajouterEvenement(monde, {
    type: 'sponsor.operation_refusee', acteurs: [{ id: op.ecurie, role: 'auteur' }, { id: op.sponsor, role: 'sponsor' }], importance: 1, visibilite: 'prive', connuPar: [op.ecurie],
    contexte: { operation: op.id }, texte: 'Vous déclinez l’opération publicitaire proposée.',
  });
}

export const LIBELLES_FORMATS: Record<FormatOperation, string> = { tenues: 'tenues spéciales', visibilite: 'visibilité sur la voiture', interview: 'interview exclusive', campagne: 'campagne complète' };

/* ================================================================ Système hebdomadaire */

/**
 * Installé après la saison (les Grands Prix de la semaine sont déjà courus) :
 * 1. offres de contrat arrivées à échéance ; 2. objectifs de course jugés ; 3. opérations après un exploit ;
 * 4. opérations délaissées expirées ; 5. objectif du prochain Grand Prix préparé ; 6. volume borné.
 */
export const systemeSponsoring: Systeme = {
  nom: 'economie.sponsoring',
  executer({ monde, date }) {
    trancherOffres(monde);
    const termines = new Set<string>();
    for (const o of objectifsGP(monde)) {
      const gp = table(monde, TABLES.grandsPrix)[o.gp] as unknown as GrandPrix | undefined;
      if (!gp) { delete table(monde, TABLES.objectifsGP)[o.id]; continue; }
      if (gp.termine) { jugerObjectif(monde, o, gp); termines.add(gp.id); }
    }
    // Grands Prix courus cette semaine (même sans objectif) : exploits.
    const s = table(monde, TABLES.saisons)[`ssn_${date.annee}`] as unknown as Saison | undefined;
    for (const id of s?.calendrier ?? []) {
      const gp = table(monde, TABLES.grandsPrix)[id] as unknown as GrandPrix | undefined;
      if (gp?.termine && gp.semaine === date.semaine) for (const e of ecuriesActives(monde)) proposerOperation(monde, e, gp);
    }
    for (const op of operationsSponsors(monde)) {
      if (op.statut !== 'proposee') continue;
      const e = ecurieDe(monde, op.ecurie);
      if (!e) { op.statut = 'expiree'; continue; }
      if (iaDecide(e, 'commercial') || rang(op.echeance) <= rang(date)) decisionEquipeOperation(monde, op);
    }
    const gp = prochainGP(monde);
    if (gp) for (const e of ecuriesActives(monde)) {
      const c = contratsActifs(monde, date.annee, e.id).find((x) => x.rang === 'titre' && x.enveloppeGPMEUR);
      if (c) preparerObjectif(monde, e, c, gp);
    }
    // Volume borné : opérations conservées deux saisons (rareté), objectifs d'une saison passée effacés.
    for (const op of operationsSponsors(monde)) if (op.proposeeLe.annee < date.annee - 1) delete table(monde, TABLES.operationsSponsors)[op.id];
    for (const o of objectifsGP(monde)) if (!o.gp.startsWith(`gp_${date.annee}_`)) delete table(monde, TABLES.objectifsGP)[o.id];
  },
};

/* ================================================================ Commandes (joueur et IA) */

function validerTP(monde: Monde, auteur: string, idEcurie: string): string | null {
  const tp = teamPrincipal(monde, idEcurie);
  return tp && tp.id === auteur ? null : 'Seul le team principal de l’écurie peut décider.';
}

/** `sponsor.signer` : signer une variante d'une offre, ou la décliner (variante absente). */
export const commandeSignerSponsor: DefinitionCommande = {
  type: 'sponsor.signer',
  valider(monde, c) {
    const o = table(monde, TABLES.offresSponsors)[String(c.parametres['offre'] ?? '')] as unknown as OffreSponsor | undefined;
    if (!o) return 'Offre inconnue ou déjà traitée.';
    const v = validerTP(monde, c.auteur, o.ecurie);
    if (v) return v;
    const variante = c.parametres['variante'];
    if (variante === null || variante === undefined) return null;
    if (!o.variantes.some((x) => x.variante === variante)) return 'Variante inconnue pour cette offre.';
    if (emplacementsLibres(monde, o.ecurie, o.annee)[o.rang] <= 0) return 'Plus de place libre à ce rang.';
    return null;
  },
  appliquer({ monde }, c) {
    const o = table(monde, TABLES.offresSponsors)[String(c.parametres['offre'])] as unknown as OffreSponsor;
    const variante = c.parametres['variante'];
    if (variante === null || variante === undefined) declinerOffre(monde, o, 'déclinée par le team principal');
    else signerOffre(monde, o, String(variante), 'joueur');
  },
};

/** `sponsor.objectif_gp` : choisir l'objectif du prochain Grand Prix (ou aucun). */
export const commandeObjectifGP: DefinitionCommande = {
  type: 'sponsor.objectif_gp',
  valider(monde, c) {
    const o = table(monde, TABLES.objectifsGP)[String(c.parametres['objectif'] ?? '')] as unknown as ObjectifGP | undefined;
    if (!o) return 'Objectif inconnu.';
    const v = validerTP(monde, c.auteur, o.ecurie);
    if (v) return v;
    const gp = table(monde, TABLES.grandsPrix)[o.gp] as unknown as GrandPrix | undefined;
    if (!gp || gp.termine) return 'Le Grand Prix est déjà couru.';
    const choix = String(c.parametres['choix'] ?? '');
    return choix === 'aucun' || o.options.some((x) => x.niveau === choix) ? null : 'Choix inconnu.';
  },
  appliquer({ monde }, c) {
    const o = table(monde, TABLES.objectifsGP)[String(c.parametres['objectif'])] as unknown as ObjectifGP;
    o.choix = String(c.parametres['choix']) as ObjectifGP['choix'];
    o.choisiPar = 'joueur';
  },
};

/** `sponsor.operation` : accepter une opération (format, pilote si l'offre est libre) ou la refuser (format absent). */
export const commandeOperationSponsor: DefinitionCommande = {
  type: 'sponsor.operation',
  valider(monde, c) {
    const op = table(monde, TABLES.operationsSponsors)[String(c.parametres['operation'] ?? '')] as unknown as OperationSponsor | undefined;
    if (!op || op.statut !== 'proposee') return 'Opération inconnue ou déjà traitée.';
    const v = validerTP(monde, c.auteur, op.ecurie);
    if (v) return v;
    const format = c.parametres['format'];
    if (format === null || format === undefined) return null;
    if (!FORMATS_OPERATION.includes(format as FormatOperation)) return 'Format inconnu.';
    const pilote = op.pilote ?? String(c.parametres['pilote'] ?? '');
    if (op.pilote && c.parametres['pilote'] && c.parametres['pilote'] !== op.pilote) return 'Le sponsor demande un pilote précis.';
    const p = personneDe(monde, pilote);
    if (!p || p.statut !== 'actif' || p.ecurie !== op.ecurie || !p.poste.startsWith('pilote')) return 'Choisir un pilote de l’écurie.';
    return null;
  },
  appliquer({ monde }, c) {
    const op = table(monde, TABLES.operationsSponsors)[String(c.parametres['operation'])] as unknown as OperationSponsor;
    const format = c.parametres['format'];
    if (format === null || format === undefined) refuserOperation(monde, op);
    else accepterOperation(monde, op, format as FormatOperation, op.pilote ?? String(c.parametres['pilote']), 'joueur');
  },
};

export function installerSponsoring(moteur: Moteur): Moteur {
  moteur.ajouterSysteme(systemeSponsoring);
  moteur.commandes.enregistrer(commandeSignerSponsor).enregistrer(commandeObjectifGP).enregistrer(commandeOperationSponsor);
  return moteur;
}

/** Valeur indicative de l'objectif « aucun » (pour l'affichage). */
export const montantSansObjectif = (o: ObjectifGP) => r1(o.partMEUR * OBJECTIFS_GP.aucun);
/** Opération en attente de l'écurie, s'il y en a une. */
export const operationEnAttente = (m: Monde, idEcurie: string) => operationsSponsors(m, idEcurie).find((o) => o.statut === 'proposee');
