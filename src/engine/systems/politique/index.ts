/**
 * Phase 8d-4 — politique (fiche phase 8 §9 ; D-132 questions 11 et 12 ; D-138).
 *
 * - Fédération présidée par une personnalité élue tous les 4 ans par les écuries (une voix chacune) ; son profil (orientation préférée,
 *   rigueur budgétaire, sensibilité au lobbying) pèse sur les propositions.
 * - Lobbying : de l'argent dépensé avant la préparation des réformes rend l'orientation défendue plus probable parmi les propositions ;
 *   il ne touche jamais au décompte des voix.
 * - Autres votes : plafond budgétaire et restrictions aérodynamiques, une saison sur deux, pour la saison suivante.
 * - Alliances : même motoriste, écuries partenaires, team principals qui s'entendent ; elles pèsent dans les votes de l'IA.
 * Mêmes commandes pour le joueur et l'IA.
 */

import { AUTRES_VOTES, ALLIANCES, FEDERATION, INFLUENCE, LOBBYING } from '../../balance/politique';
import { RESTRICTIONS_AERO } from '../../balance/finances';
import { PLAFOND_BUDGETAIRE_MEUR } from '../../balance/reglement';
import { CALENDRIER_REGLEMENT, ORIENTATIONS, type Domaine, type Orientation } from '../../balance/technique';
import { FUITES_REGLEMENT } from '../../balance/information';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement } from '../../core/evenements';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal, type Moteur, type Systeme } from '../../core/moteur';
import { TABLES, type Ecurie, type Personne } from '../../model/types';
import { financesDe, plafond, rangPrecedent } from '../economie';
import { age, niveauMetier, teamPrincipal } from '../humain/decision';
import { lienSocial } from '../humain/groupes';
import { ecuriesActives } from '../saison/performance';
import { reglementEnVigueur, savoirApplicable } from '../technique/acces';
import { allies, federation, regleVotee, type Alliance, type Federation } from './acces';

export * from './acces';

const r2 = (x: number) => Math.round(x * 100) / 100;
const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const ORIENTATIONS_LISTE = Object.keys(ORIENTATIONS) as Orientation[];
const COMPETENCE_ORIENTATION: Record<Orientation, string> = { aero: 'aerodynamique', chassis: 'conception', motorisation: 'visionTechnique', refonte: 'innovation' };
const nomDe = (p: Personne) => `${p.prenom} ${p.nom}`;

/* ------------------------------------------------------------------ Président */

/** Profil politique d'une personnalité (s'il devenait président). */
export function profilPresident(monde: Monde, p: Personne): { orientation: Orientation; rigueur: number; sensibilite: number } {
  const meilleure = [...ORIENTATIONS_LISTE].sort((a, b) => (p.competences[COMPETENCE_ORIENTATION[b]] ?? 0) - (p.competences[COMPETENCE_ORIENTATION[a]] ?? 0) || (a < b ? -1 : 1))[0]!;
  const orientation = (p.competences[COMPETENCE_ORIENTATION[meilleure]] ?? 0) >= FEDERATION.competenceOrientation
    ? meilleure : ORIENTATIONS_LISTE[tirageLocal(monde, 'politique.orientation', p.id).entier(0, ORIENTATIONS_LISTE.length - 1)]!;
  return {
    orientation,
    rigueur: r2(borner(((p.valeurs['equite'] ?? 10) - (p.valeurs['argent'] ?? 10)) / 20, -1, 1)),
    sensibilite: r2(borner(1 - (p.traits['professionnalisme'] ?? 10) / 20, 0, 1)),
  };
}

/** Candidats à la présidence : personnalités hors poste, anciennes dirigeantes, classées par notoriété. */
export function candidatsPresidence(monde: Monde): Personne[] {
  const postes = ['team_principal', 'directeur_technique', 'directeur_sportif'];
  const notoriete = (p: Personne) => niveauMetier(p) + ((p.competences['leadership'] ?? 10) + (p.competences['politique'] ?? 10)) / 2
    + tirageLocal(monde, 'politique.notoriete', p.id, monde.date.annee).normale(0, FEDERATION.aleaNotoriete);
  return (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[])
    .filter((p) => (p.statut === 'libre' || (p.statut === 'retraite' && monde.date.annee - (p.libreDepuis ?? monde.date.annee) <= FEDERATION.retraiteMax))
      && postes.includes(p.poste) && age(monde, p) >= FEDERATION.ageMin && age(monde, p) <= FEDERATION.ageMax)
    .map((p) => ({ p, n: notoriete(p) })).sort((a, b) => b.n - a.n || (a.p.id < b.p.id ? -1 : 1)).slice(0, FEDERATION.candidats).map((x) => x.p);
}

function installerPresident(monde: Monde, f: Federation, p: Personne | undefined, debut: number): void {
  if (!p) return;
  const profil = profilPresident(monde, p);
  f.president = p.id;
  f.nomPresident = nomDe(p);
  f.orientationPreferee = profil.orientation;
  f.rigueur = profil.rigueur;
  f.sensibiliteLobbying = profil.sensibilite;
  f.debutMandat = debut;
  f.finMandat = debut + FEDERATION.dureeMandat - 1;
}

/** Fédération de départ : un président nommé (premier mandat en cours), règles de départ. */
export function initialiserFederation(monde: Monde): Federation {
  const existante = federation(monde);
  if (existante) return existante;
  const f: Federation = { id: 'federation', debutMandat: monde.date.annee, finMandat: monde.date.annee + FEDERATION.dureeMandat - 1, rigueur: 0, sensibiliteLobbying: 0.5, lobbying: {}, lobbyistes: [], regles: {}, historique: [] };
  installerPresident(monde, f, candidatsPresidence(monde)[0], monde.date.annee);
  table(monde, TABLES.federation)['federation'] = f as unknown as Entite;
  return f;
}

/** Intérêt d'une écurie pour un candidat : orientation où elle a de l'avance, rigueur selon ses moyens, relation de son team principal. */
export function interetCandidat(monde: Monde, e: Ecurie, c: Personne): number {
  const profil = profilPresident(monde, c);
  const tp = teamPrincipal(monde, e.id);
  const relationTP = tp ? lienSocial(monde, tp, c) : { affinite: 0, confiance: 0 };
  const depense = financesDe(monde, e.id) ? Math.min(1, e.budgetMEUR / plafond(monde)) : 1;
  return avanceOrientation(monde, e.id, profil.orientation) / 10 + profil.rigueur * (1 - depense) + (relationTP.affinite + relationTP.confiance) / 2;
}

/** Avance de savoir d'une écurie dans les domaines d'une orientation (points, sur la moyenne des écuries). */
export function avanceOrientation(monde: Monde, idEcurie: string, o: Orientation): number {
  const reg = reglementEnVigueur(monde)?.id;
  const domaines = ORIENTATIONS[o].domaines as readonly Domaine[];
  const actives = ecuriesActives(monde);
  let total = 0;
  for (const d of domaines) {
    const moi = savoirApplicable(monde, idEcurie, d, reg);
    const moyenne = actives.reduce((a, x) => a + savoirApplicable(monde, x.id, d, reg), 0) / Math.max(1, actives.length);
    total += moi - moyenne;
  }
  return total / domaines.length;
}

function avecAllies(monde: Monde, e: Ecurie, interet: (x: Ecurie) => number): number {
  const autres = allies(monde, e.id).map((id) => table(monde, TABLES.ecuries)[id] as unknown as Ecurie).filter((x) => x?.statut === 'active');
  return interet(e) + (autres.length ? (ALLIANCES.poidsAllies * autres.reduce((a, x) => a + interet(x), 0)) / autres.length : 0);
}

function election(monde: Monde, f: Federation): void {
  const candidats = candidatsPresidence(monde);
  if (candidats.length < 2) return; // pas d'élection disputée : le mandat est prolongé d'office
  const votes: Record<string, string> = { ...(f.election?.annee === monde.date.annee ? f.election.votes : {}) };
  const voix = new Map(candidats.map((c) => [c.id, 0]));
  for (const e of ecuriesActives(monde)) {
    let choix = votes[e.id];
    if (!choix && !e.pilotee) {
      const alea = tirageLocal(monde, 'politique.election', e.id, monde.date.annee);
      choix = candidats.map((c) => ({ c, u: avecAllies(monde, e, (x) => interetCandidat(monde, x, c)) + alea.normale(0, AUTRES_VOTES.aleaVote) })).sort((a, b) => b.u - a.u || (a.c.id < b.c.id ? -1 : 1))[0]!.c.id;
      votes[e.id] = choix;
    }
    if (choix && voix.has(choix)) voix.set(choix, voix.get(choix)! + 1);
  }
  const max = Math.max(...voix.values());
  const ex = [...voix.entries()].filter(([, v]) => v === max).map(([k]) => k).sort();
  const elu = candidats.find((c) => c.id === ex[tirageLocal(monde, 'politique.egalite', monde.date.annee).entier(0, ex.length - 1)])!;
  installerPresident(monde, f, elu, monde.date.annee + 1);
  f.election = { annee: monde.date.annee, candidats: candidats.map((c) => c.id), votes };
  f.historique = [...f.historique, { annee: monde.date.annee, type: 'election', resultat: `${nomDe(elu)} (${max} voix)` }].slice(-10);
  ajouterEvenement(monde, {
    type: 'federation.election', acteurs: [{ id: elu.id, role: 'elu' }, ...candidats.filter((c) => c !== elu).map((c) => ({ id: c.id, role: 'candidat' }))], importance: 4, visibilite: 'public',
    contexte: { voix: Object.fromEntries(voix), orientation: f.orientationPreferee, rigueur: f.rigueur, egalite: ex.length > 1 },
    texte: `Élection à la présidence de la fédération : ${nomDe(elu)} l'emporte (${max} voix sur ${[...voix.values()].reduce((a, b) => a + b, 0)}).`,
  });
}

/* ------------------------------------------------------------------ Lobbying */

const anneePropositions = (monde: Monde) => { const r = reglementEnVigueur(monde); return r ? r.fin - CALENDRIER_REGLEMENT.anneesAvantFin : undefined; };

export function motifRefusLobbying(monde: Monde, auteur: string, prm: Record<string, unknown>): string | null {
  const e = table(monde, TABLES.ecuries)[String(prm['ecurie'] ?? '')] as unknown as Ecurie | undefined;
  if (!e || e.statut !== 'active') return 'Écurie inconnue.';
  const tp = teamPrincipal(monde, e.id);
  if (!tp || tp.id !== auteur) return 'Seul le team principal fait pression auprès de la fédération.';
  if (!ORIENTATIONS_LISTE.includes(String(prm['orientation']) as Orientation)) return 'Orientation inconnue.';
  const montant = prm['montant'];
  if (!(typeof montant === 'number' && Number.isFinite(montant) && montant >= LOBBYING.montantMin && montant <= LOBBYING.montantMax)) return `Montant de ${LOBBYING.montantMin} à ${LOBBYING.montantMax} M€.`;
  if (monde.date.annee !== anneePropositions(monde) || monde.date.semaine >= FUITES_REGLEMENT.semaineAvantProjet + 1) return 'Le lobbying n’a de sens qu’avant la préparation des réformes (début de l’année des propositions).';
  const f = federation(monde);
  if (f?.lobbyistes.includes(e.id)) return 'Cette écurie a déjà fait pression pour ces réformes.';
  const fi = financesDe(monde, e.id);
  if (fi && fi.tresorerieMEUR < montant) return 'Trésorerie insuffisante.';
  return null;
}

export const commandeLobbying: DefinitionCommande = {
  type: 'politique.lobbying',
  valider: (monde, c) => motifRefusLobbying(monde, c.auteur, c.parametres),
  appliquer({ monde }, c) {
    const f = initialiserFederation(monde);
    const e = table(monde, TABLES.ecuries)[String(c.parametres['ecurie'])] as unknown as Ecurie;
    const tp = teamPrincipal(monde, e.id)!;
    const orientation = String(c.parametres['orientation']);
    const montant = Number(c.parametres['montant']);
    const pression = montant * INFLUENCE.efficaciteParMEUR * ((tp.competences['politique'] ?? 10) / 20) * f.sensibiliteLobbying;
    f.lobbying[orientation] = r2((f.lobbying[orientation] ?? 0) + pression);
    f.lobbyistes.push(e.id);
    const fi = financesDe(monde, e.id);
    if (fi) { fi.tresorerieMEUR -= montant; fi.comptes.marketing += montant; }
    ajouterEvenement(monde, {
      type: 'politique.lobbying', acteurs: [{ id: tp.id, role: 'auteur' }, { id: e.id, role: 'ecurie' }], importance: 2, visibilite: 'prive',
      contexte: { orientation, montant, pression: r2(pression), sensibilitePresident: f.sensibiliteLobbying },
    });
  },
};

type Commander = (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => unknown;

function lobbyingIA(monde: Monde, commander: Commander): void {
  for (const e of ecuriesActives(monde)) {
    if (e.pilotee) continue;
    const tp = teamPrincipal(monde, e.id);
    const fi = financesDe(monde, e.id);
    if (!tp || !fi || fi.tresorerieMEUR <= LOBBYING.tresorerieMin) continue;
    const meilleure = ORIENTATIONS_LISTE.map((o) => ({ o, a: avanceOrientation(monde, e.id, o) })).sort((a, b) => b.a - a.a || (a.o < b.o ? -1 : 1))[0]!;
    if (meilleure.a < LOBBYING.avanceMin) continue;
    const montant = r2(borner(LOBBYING.partTresorerie * fi.tresorerieMEUR, LOBBYING.montantMin, LOBBYING.montantMax));
    commander({ type: 'politique.lobbying', auteur: tp.id, parametres: { ecurie: e.id, orientation: meilleure.o, montant } });
  }
}

/* ------------------------------------------------------------------ Autres votes */

function interetSujet(monde: Monde, e: Ecurie, sujet: string, valeur: number): number {
  if (sujet === 'plafondMEUR') {
    // Une écurie plus riche que la moyenne gagne à voir le plafond monter (elle peut suivre, les autres moins) ; une plus pauvre, à le voir baisser.
    const marge = (x: Ecurie) => (x.budgetMEUR - plafond(monde)) / plafond(monde);
    const actives = ecuriesActives(monde);
    const moyenne = actives.reduce((a, x) => a + marge(x), 0) / Math.max(1, actives.length);
    return (valeur > plafond(monde) ? 1 : -1) * (marge(e) - moyenne);
  }
  const { rang, n } = rangPrecedent(monde, e.id);
  const position = n > 1 ? (rang - 1) / (n - 1) : 0.5; // 0 = premier, 1 = dernier
  const elargir = valeur > (regleVotee(monde, 'restrictionAeroDernier', RESTRICTIONS_AERO.dernier) - regleVotee(monde, 'restrictionAeroPremier', RESTRICTIONS_AERO.premier));
  return (elargir ? 1 : -1) * (position - 0.5);
}

function proposerVote(monde: Monde, f: Federation): void {
  const alea = tirageLocal(monde, 'politique.sujet', monde.date.annee);
  const sujet = alea.chance(AUTRES_VOTES.probaPlafond) ? 'plafondMEUR' : 'ecartAero';
  let valeur: number, texte: string;
  if (sujet === 'plafondMEUR') {
    const sens = f.rigueur > 0 ? -1 : f.rigueur < 0 ? 1 : (alea.chance(AUTRES_VOTES.probaSens) ? -1 : 1);
    valeur = r2(borner(plafond(monde) * (1 + sens * AUTRES_VOTES.pasPlafond), AUTRES_VOTES.plafondMin * PLAFOND_BUDGETAIRE_MEUR, AUTRES_VOTES.plafondMax * PLAFOND_BUDGETAIRE_MEUR));
    texte = `plafond budgétaire porté à ${valeur} M€`;
  } else {
    const ecart = regleVotee(monde, 'restrictionAeroDernier', RESTRICTIONS_AERO.dernier) - regleVotee(monde, 'restrictionAeroPremier', RESTRICTIONS_AERO.premier);
    const sens = alea.chance(AUTRES_VOTES.probaSens) ? 1 : -1;
    valeur = r2(borner(ecart + 2 * sens * AUTRES_VOTES.pasAero, AUTRES_VOTES.ecartAeroMin, AUTRES_VOTES.ecartAeroMax));
    texte = `écart des restrictions aérodynamiques ${valeur > ecart ? 'élargi' : 'resserré'} à ${valeur}`;
  }
  f.vote = { annee: monde.date.annee, sujet, valeur, votes: {} };
  ajouterEvenement(monde, { type: 'federation.proposition', acteurs: [], importance: 2, visibilite: 'public', contexte: { sujet, valeur }, texte: `La fédération soumet au vote : ${texte}, pour la saison prochaine.` });
}

function decompterVote(monde: Monde, f: Federation): void {
  const v = f.vote;
  if (!v || v.annee !== monde.date.annee) return;
  let pour = 0, contre = 0;
  for (const e of ecuriesActives(monde)) {
    let choix = v.votes[e.id];
    if (choix === undefined && !e.pilotee) {
      choix = avecAllies(monde, e, (x) => interetSujet(monde, x, v.sujet, v.valeur)) + tirageLocal(monde, 'politique.vote', e.id, monde.date.annee).normale(0, AUTRES_VOTES.aleaVote) > 0;
      v.votes[e.id] = choix;
    }
    if (choix === true) pour++;
    else if (choix === false) contre++;
  }
  const adopte = pour > contre || (pour === contre && pour > 0); // égalité : la proposition du président l'emporte
  if (adopte) {
    f.reglesAVenir ??= {};
    if (v.sujet === 'plafondMEUR') f.reglesAVenir['plafondMEUR'] = v.valeur;
    else {
      const centre = (regleVotee(monde, 'restrictionAeroPremier', RESTRICTIONS_AERO.premier) + regleVotee(monde, 'restrictionAeroDernier', RESTRICTIONS_AERO.dernier)) / 2;
      f.reglesAVenir['restrictionAeroPremier'] = r2(centre - v.valeur / 2);
      f.reglesAVenir['restrictionAeroDernier'] = r2(centre + v.valeur / 2);
    }
  }
  f.historique = [...f.historique, { annee: monde.date.annee, type: v.sujet, resultat: `${adopte ? 'adopté' : 'rejeté'} (${pour} pour, ${contre} contre)` }].slice(-10);
  ajouterEvenement(monde, {
    type: 'federation.vote', acteurs: [], importance: 3, visibilite: 'public', contexte: { sujet: v.sujet, valeur: v.valeur, pour, contre, adopte },
    texte: `Vote des écuries (${v.sujet === 'plafondMEUR' ? 'plafond budgétaire' : 'restrictions aérodynamiques'}) : ${adopte ? 'adopté' : 'rejeté'}, ${pour} voix pour et ${contre} contre.`,
  });
}

/** Commandes de vote du joueur (élection, autres sujets). */
export const commandeVoteFederation: DefinitionCommande = {
  type: 'federation.vote',
  valider(monde, c) {
    const id = String(c.parametres['ecurie'] ?? '');
    const tp = teamPrincipal(monde, id);
    if (!tp || tp.id !== c.auteur) return 'Seul le team principal vote au nom de l’écurie.';
    const f = federation(monde);
    if (c.parametres['candidat'] !== undefined) {
      if (!f || monde.date.annee !== f.finMandat || monde.date.semaine > FEDERATION.semaineElection) return 'Aucune élection en cours.';
      return candidatsPresidence(monde).some((p) => p.id === c.parametres['candidat']) ? null : 'Candidat inconnu.';
    }
    if (!f?.vote || f.vote.annee !== monde.date.annee || monde.date.semaine > AUTRES_VOTES.semaine) return 'Aucun vote en cours.';
    return typeof c.parametres['pour'] === 'boolean' ? null : 'Préciser pour : vrai ou faux.';
  },
  appliquer({ monde }, c) {
    const f = initialiserFederation(monde);
    const id = String(c.parametres['ecurie']);
    if (c.parametres['candidat'] !== undefined) {
      f.election = f.election?.annee === monde.date.annee ? f.election : { annee: monde.date.annee, candidats: [], votes: {} };
      f.election.votes[id] = String(c.parametres['candidat']);
    } else f.vote!.votes[id] = c.parametres['pour'] === true;
  },
};

/* ------------------------------------------------------------------ Alliances */

export function detecterAlliances(monde: Monde): Alliance[] {
  const actives = ecuriesActives(monde);
  const paires: [string, string, Alliance['motif']][] = [];
  for (let i = 0; i < actives.length; i++) for (let j = i + 1; j < actives.length; j++) {
    const a = actives[i]!, b = actives[j]!;
    if (a.motoriste && a.motoriste === b.motoriste) { paires.push([a.id, b.id, 'motoriste']); continue; }
    if (a.ecuriePartenaire === b.id || b.ecuriePartenaire === a.id) { paires.push([a.id, b.id, 'partenaire']); continue; }
    const ta = teamPrincipal(monde, a.id), tb = teamPrincipal(monde, b.id);
    if (!ta || !tb) continue;
    const ab = lienSocial(monde, ta, tb), ba = lienSocial(monde, tb, ta);
    if ((ab.affinite + ba.affinite) / 2 >= ALLIANCES.affiniteMin && (ab.confiance + ba.confiance) / 2 >= ALLIANCES.confianceMin) paires.push([a.id, b.id, 'affinite']);
  }
  // Une alliance par composante (motif : le plus fréquent de ses liens).
  const parent = new Map<string, string>();
  const racine = (x: string): string => { const p = parent.get(x) ?? x; if (p === x) return x; const r = racine(p); parent.set(x, r); return r; };
  for (const [a, b] of paires) { const ra = racine(a), rb = racine(b); if (ra !== rb) parent.set(ra < rb ? rb : ra, ra < rb ? ra : rb); }
  const comp = new Map<string, string[]>();
  for (const [a, b] of paires) for (const x of [a, b]) { const r = racine(x); const l = comp.get(r) ?? comp.set(r, []).get(r)!; if (!l.includes(x)) l.push(x); }
  return [...comp.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([r, ecuries]) => {
    const motifs = paires.filter(([a]) => racine(a) === r).map(([, , m]) => m);
    const motif = (['motoriste', 'partenaire', 'affinite'] as Alliance['motif'][]).sort((x, y) => motifs.filter((m) => m === y).length - motifs.filter((m) => m === x).length)[0]!;
    return { id: `all_${r}`, ecuries: ecuries.sort(), motif, depuis: monde.date.annee };
  });
}

function mettreAJourAlliances(monde: Monde): void {
  const t = table(monde, TABLES.alliances);
  const anciennes = new Map(Object.values(t).map((a) => [(a as unknown as Alliance).ecuries.join('|'), a as unknown as Alliance]));
  for (const id of Object.keys(t)) delete t[id];
  for (const a of detecterAlliances(monde)) {
    const ancienne = anciennes.get(a.ecuries.join('|'));
    if (ancienne) a.depuis = ancienne.depuis;
    else ajouterEvenement(monde, { type: 'politique.alliance', acteurs: a.ecuries.map((id) => ({ id, role: 'ecurie' })), importance: 2, visibilite: 'public', contexte: { motif: a.motif } });
    t[a.id] = a as unknown as Entite;
  }
}

/* ------------------------------------------------------------------ Système */

export const systemePolitique: Systeme = {
  nom: 'politique.federation',
  executer({ monde, date, commanderIA }) {
    const f = initialiserFederation(monde);
    // Pas encore de président (aucune personnalité disponible au départ) : nomination dès qu'un candidat existe, pour le mandat en cours.
    if (!f.president) installerPresident(monde, f, candidatsPresidence(monde)[0], f.debutMandat);
    // Un président recruté par une écurie quitte la fédération : un intérim est nommé pour la fin du mandat.
    const pres = f.president ? (table(monde, TABLES.personnes)[f.president] as unknown as Personne | undefined) : undefined;
    if (f.president && (!pres || pres.statut === 'actif')) {
      const fin = f.finMandat, ancien = f.nomPresident;
      const suivant = candidatsPresidence(monde)[0];
      installerPresident(monde, f, suivant, f.debutMandat);
      f.finMandat = fin;
      if (suivant) ajouterEvenement(monde, {
        type: 'federation.interim', acteurs: [{ id: suivant.id, role: 'president' }], importance: 3, visibilite: 'public', contexte: { ancien },
        texte: `${ancien ?? 'Le président'} quitte la fédération ; ${nomDe(suivant)} assure l'intérim jusqu'en ${fin}.`,
      });
      else { delete f.president; delete f.nomPresident; }
    }
    if (date.semaine === 1 && f.reglesAVenir) {
      // Règles votées la saison précédente : en vigueur.
      f.regles = { ...f.regles, ...f.reglesAVenir };
      delete f.reglesAVenir;
    }
    if (date.semaine === ALLIANCES.semaine) mettreAJourAlliances(monde);
    // Lobbying : l'année des propositions, avant leur préparation ; remis à zéro une fois les avant-projets préparés.
    if (date.annee === anneePropositions(monde) && date.semaine === 1) lobbyingIA(monde, (c) => commanderIA(c));
    if (date.semaine === FUITES_REGLEMENT.semaineAvantProjet + 1 && (Object.keys(f.lobbying).length || f.lobbyistes.length)) { f.lobbying = {}; f.lobbyistes = []; }
    if (date.semaine === AUTRES_VOTES.semaine - 4 && date.annee % 2 === 0) proposerVote(monde, f);
    if (date.semaine === AUTRES_VOTES.semaine) decompterVote(monde, f);
    if (date.annee === f.finMandat && date.semaine === FEDERATION.semaineElection) election(monde, f);
    if (date.annee > f.finMandat) f.finMandat = date.annee + FEDERATION.dureeMandat - 1; // pas d'élection possible : mandat prolongé
  },
};

export function installerPolitique(moteur: Moteur): Moteur {
  moteur.ajouterSysteme(systemePolitique);
  moteur.commandes.enregistrer(commandeLobbying).enregistrer(commandeVoteFederation);
  return moteur;
}

