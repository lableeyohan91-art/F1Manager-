/**
 * Phase 10 — le joueur (docs/systemes/phase-10-joueur.md, D-147).
 *
 * - Prise de fonction : le joueur devient le team principal d'une écurie (personne marquée `joueur`, traits et valeurs neutres).
 * - Délégations : chaque domaine (pilotes, personnel, recherche, stands, académie, politique) est décidé soit par le joueur,
 *   soit par son équipe avec exactement les règles de l'IA (D-012).
 * - Budget de développement : proposé par la direction financière (règle de l'IA), modifiable par le joueur.
 * - Décisions en attente : consultation sans effet sur l'état, pour l'interface.
 * - Licenciement par le conseil (D-089) : la partie est terminée (la suite en phase 14).
 */

import { BUDGET_JOUEUR, DELEGATION_RECHERCHE_DEFAUT, DELEGATION_STANDS_DEFAUT, DELEGATIONS_DEFAUT, MANAGER_JOUEUR, URGENCE_SEMAINES } from '../../balance/joueur';
import { DEVELOPPEMENT_MINIMUM } from '../../balance/finances';
import { COMPETENCES_PAR_POSTE, COMPETENCES_TRANSVERSALES } from '../../balance/personnages';
import { SEMAINE_FIN_CONTRATS, SEMAINE_NEGOCIATIONS } from '../../balance/contrats';
import { DEMANDES_DEPART } from '../../balance/departs';
import { CALENDRIER_REGLEMENT } from '../../balance/technique';
import { AUTRES_VOTES, FEDERATION } from '../../balance/politique';
import { FENETRE } from '../../balance/marche';
import type { Commande, DefinitionCommande, ResultatCommande } from '../../core/commandes';
import { ajouterSemaines, rangSemaine, type DateJeu } from '../../core/calendrier';
import { ajouterEvenement } from '../../core/evenements';
import { idsTries, table, type Monde } from '../../core/monde';
import type { Moteur, Systeme } from '../../core/moteur';
import { TABLES, type Contrat, type Ecurie, type Personne, type Poste } from '../../model/types';
import { genererPersonne } from '../../generation/construction';
import { contratEmploi, creerContrat, deciderProlongation, liberer, pourvoirPostes, TABLE_NEGOCIATIONS, type NegociationEnCours } from '../humain/contrats';
import { reprendreProlongationsPilotes } from '../marche';
import { teamPrincipal, valeurMarche } from '../humain/decision';
import { placesLibres } from '../humain/effectifs';
import { financesDe, plafond } from '../economie';
import { equipeStands } from '../stands';
import { propositions } from '../technique';
import { federation } from '../politique';
import { POSTES_INDIVIDUALISES } from '../../balance/monde';
import { ecuriesActives } from '../saison/performance';
import { domainePoste, ecurieDuJoueur, iaDecide, type DomaineDelegue } from './acces';
import type { Conference } from '../../model/types';
import { LIBELLES_QUESTIONS } from '../medias/libelles';

export * from './acces';

const r1 = (x: number) => Math.round(x * 10) / 10;
const nomDe = (p: Personne) => `${p.prenom} ${p.nom}`;
const ecurieDe = (monde: Monde, id: string) => table(monde, TABLES.ecuries)[id] as unknown as Ecurie | undefined;
const personneDe = (monde: Monde, id: string) => table(monde, TABLES.personnes)[id] as unknown as Personne | undefined;

/** Domaines que le joueur peut déléguer (les deux derniers ont leur drapeau propre, phases 8b et 8d). */
export const DOMAINES_DELEGATION = ['pilotes', 'personnel', 'recherche', 'stands', 'academie', 'politique', 'communication'] as const;
export type DomaineJoueur = (typeof DOMAINES_DELEGATION)[number];

/** Le domaine est-il délégué (décidé par l'équipe avec les règles de l'IA) ? */
export function estDelegue(monde: Monde, e: Ecurie, domaine: DomaineJoueur): boolean {
  if (domaine === 'recherche') return !!e.delegationRecherche;
  if (domaine === 'stands') { const eq = equipeStands(monde, e.id); return eq ? !!eq.delegation : !!e.delegations?.stands; }
  return iaDecide(e, domaine);
}

/** Le manager incarné par le joueur, s'il dirige une écurie. */
export function managerJoueur(monde: Monde): Personne | undefined {
  return monde.joueur ? personneDe(monde, monde.joueur.personne) : undefined;
}

/* ------------------------------------------------------------------ Commandes */

const texte = (x: unknown) => (typeof x === 'string' ? x.trim() : '');

export const commandePrendreEcurie: DefinitionCommande = {
  type: 'joueur.prendre_ecurie',
  valider(monde, c) {
    if (monde.joueur) return 'Une écurie est déjà dirigée par le joueur dans cette partie.';
    const e = ecurieDe(monde, String(c.parametres['ecurie'] ?? ''));
    if (!e || e.statut !== 'active' || !ecuriesActives(monde).some((x) => x.id === e.id)) return 'Écurie inconnue.';
    if ((Object.values(table(monde, TABLES.ecuries)) as unknown as Ecurie[]).some((x) => x.pilotee)) return 'Une écurie est déjà dirigée par un joueur.';
    const prenom = texte(c.parametres['prenom']), nom = texte(c.parametres['nom']);
    if (!prenom || !nom) return 'Indiquer le prénom et le nom du manager.';
    if (prenom.length > 30 || nom.length > 30) return 'Prénom et nom : 30 caractères au plus.';
    return null;
  },
  appliquer({ monde }, c) {
    const e = ecurieDe(monde, String(c.parametres['ecurie'])) as Ecurie;
    const annee = monde.date.annee;
    const ancien = teamPrincipal(monde, e.id);
    const ancienContrat = ancien ? contratEmploi(monde, ancien.id) : undefined;
    // Le manager : une personne comme les autres (relations, jugement du conseil), aux couches cachées neutres.
    const p = genererPersonne(monde, 'team_principal', e, 'actif');
    p.joueur = true;
    p.prenom = texte(c.parametres['prenom']);
    p.nom = texte(c.parametres['nom']);
    const nat = texte(c.parametres['nationalite']);
    if (nat) p.nationalite = nat.slice(0, 3).toUpperCase();
    p.anneeNaissance = annee - MANAGER_JOUEUR.age;
    p.dateNaissance = String(p.anneeNaissance);
    for (const k of Object.keys(p.traits)) p.traits[k] = MANAGER_JOUEUR.trait;
    for (const k of Object.keys(p.valeurs)) p.valeurs[k] = MANAGER_JOUEUR.valeur;
    p.competences = {};
    for (const k of [...(COMPETENCES_PAR_POSTE['team_principal'] ?? []), ...COMPETENCES_TRANSVERSALES]) p.competences[k] = MANAGER_JOUEUR.competence;
    p.potentiel = MANAGER_JOUEUR.competence;
    p.aspirations = [];
    const arrivee = ajouterEvenement(monde, {
      type: 'joueur.prise_de_fonction', acteurs: [{ id: p.id, role: 'personne' }, { id: e.id, role: 'organisation' }, ...(ancien ? [{ id: ancien.id, role: 'remplace' }] : [])],
      importance: 4, visibilite: 'public', contexte: { ancien: ancien?.id ?? null },
      texte: `${nomDe(p)} prend la tête de ${e.nom}${ancien ? `, à la place de ${nomDe(ancien)}` : ''}.`,
    });
    // L'ancien team principal part (rupture à l'initiative de l'employeur : indemnité versée, comme pour l'IA).
    if (ancien && ancienContrat) liberer(monde, ancien, ancienContrat, 'rupture_employeur', [arrivee.id]);
    creerContrat(monde, p, e.id, 'team_principal', annee, MANAGER_JOUEUR.dureeContratAnnees, ancienContrat?.salaireMEUR ?? valeurMarche(monde, p), false);
    e.pilotee = true;
    e.delegations = { ...DELEGATIONS_DEFAUT, stands: DELEGATION_STANDS_DEFAUT };
    e.delegationRecherche = DELEGATION_RECHERCHE_DEFAUT;
    const eq = equipeStands(monde, e.id);
    if (eq) eq.delegation = DELEGATION_STANDS_DEFAUT;
    monde.joueur = { personne: p.id, ecurie: e.id, depuis: { ...monde.date }, etat: 'actif' };
  },
};

function validerJoueur(monde: Monde, auteur: string, idEcurie: string): string | null {
  if (!monde.joueur || monde.joueur.etat !== 'actif') return 'Aucune écurie dirigée par le joueur.';
  if (monde.joueur.ecurie !== idEcurie) return 'Le joueur ne dirige pas cette écurie.';
  const tp = teamPrincipal(monde, idEcurie);
  if (!tp || tp.id !== auteur) return 'Seul le team principal de l’écurie peut faire cela.';
  return null;
}

export const commandeDeleguerJoueur: DefinitionCommande = {
  type: 'joueur.deleguer',
  valider(monde, c) {
    const v = validerJoueur(monde, c.auteur, String(c.parametres['ecurie'] ?? ''));
    if (v) return v;
    if (!(DOMAINES_DELEGATION as readonly string[]).includes(String(c.parametres['domaine']))) return `Domaine inconnu (${DOMAINES_DELEGATION.join(', ')}).`;
    return typeof c.parametres['actif'] === 'boolean' ? null : 'Préciser actif : vrai ou faux.';
  },
  appliquer({ monde }, c) {
    const e = ecurieDe(monde, String(c.parametres['ecurie'])) as Ecurie;
    const domaine = String(c.parametres['domaine']) as DomaineJoueur;
    const actif = c.parametres['actif'] === true;
    if (domaine === 'recherche') e.delegationRecherche = actif;
    else {
      (e.delegations ??= {})[domaine as DomaineDelegue | 'stands'] = actif;
      const eq = domaine === 'stands' ? equipeStands(monde, e.id) : undefined;
      if (eq) eq.delegation = actif;
    }
    if (actif && (domaine === 'pilotes' || domaine === 'personnel')) reprendreDossiers(monde, e, domaine, c.auteur);
  },
};

/**
 * Audit de la phase 10 (arbitrage du porteur) : en déléguant les pilotes ou le personnel, le joueur confie aussi ses négociations
 * en cours (elles sont abandonnées, avec un fait qui le dit) ; son équipe reprend les fins de contrat de la saison si leur moment
 * habituel est déjà passé (personnel : semaine des négociations ; pilotes : ouverture du marché).
 */
function reprendreDossiers(monde: Monde, e: Ecurie, domaine: 'pilotes' | 'personnel', auteur: string): void {
  const negos = table(monde, TABLE_NEGOCIATIONS) as unknown as Record<string, NegociationEnCours>;
  for (const id of Object.keys(negos).sort()) {
    const c = table(monde, TABLES.contrats)[id] as unknown as Contrat | undefined;
    if (!c || c.organisation !== e.id || domainePoste(c.poste) !== domaine) continue;
    delete negos[id];
    const p = personneDe(monde, c.personne);
    ajouterEvenement(monde, {
      type: 'negociation.confiee', acteurs: [{ id: auteur, role: 'auteur' }, { id: c.personne, role: 'personne' }, { id: e.id, role: 'organisation' }],
      importance: 1, visibilite: 'prive', contexte: { contrat: id, domaine },
      texte: `La négociation avec ${p ? nomDe(p) : c.personne} est confiée à l'équipe (domaine délégué).`,
    });
  }
  const tp = teamPrincipal(monde, e.id);
  if (!tp) return;
  if (domaine === 'personnel' && monde.date.semaine > SEMAINE_NEGOCIATIONS && monde.date.semaine < SEMAINE_FIN_CONTRATS) {
    for (const c of (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).filter((x) => x.organisation === e.id && x.type === 'emploi' && x.statut === 'actif' && x.fin === monde.date.annee && !x.nonProlonge && domainePoste(x.poste) === 'personnel' && x.personne !== tp.id).sort((a, b) => (a.id < b.id ? -1 : 1))) {
      deciderProlongation(monde, c, tp);
    }
  }
  if (domaine === 'pilotes') reprendreProlongationsPilotes(monde, e.id);
}

/** Borne haute du budget de développement que le joueur peut fixer (M€). */
export function budgetMaxJoueur(monde: Monde): number {
  return r1(plafond(monde) * BUDGET_JOUEUR.maxEnPartDuPlafond);
}

export const commandeBudgetDeveloppement: DefinitionCommande = {
  type: 'budget.developpement',
  valider(monde, c) {
    const id = String(c.parametres['ecurie'] ?? '');
    const tp = teamPrincipal(monde, id);
    if (!tp || tp.id !== c.auteur) return 'Seul le team principal fixe le budget de développement.';
    if (!financesDe(monde, id)) return 'Écurie sans comptes.';
    const m = c.parametres['montant'];
    if (typeof m !== 'number' || !Number.isFinite(m)) return 'Montant invalide.';
    if (m < DEVELOPPEMENT_MINIMUM) return `Le développement ne descend pas sous ${DEVELOPPEMENT_MINIMUM} M€ par an.`;
    if (m > budgetMaxJoueur(monde)) return `Au plus ${budgetMaxJoueur(monde)} M€ par an.`;
    return null;
  },
  appliquer({ monde }, c) {
    const id = String(c.parametres['ecurie']);
    const fi = financesDe(monde, id)!;
    const avant = fi.budget.developpementMEUR;
    fi.budget.developpementMEUR = r1(Number(c.parametres['montant']));
    fi.budget.strategie = 'choix_du_team_principal';
    ajouterEvenement(monde, {
      type: 'finances.budget_modifie', acteurs: [{ id: c.auteur, role: 'auteur' }, { id, role: 'ecurie' }], importance: 1, visibilite: 'prive',
      contexte: { avant, apres: fi.budget.developpementMEUR },
      texte: `Budget de développement porté de ${avant} à ${fi.budget.developpementMEUR} M€ pour ${monde.date.annee}.`,
    });
  },
};

/* ------------------------------------------------------------------ Décisions en attente (consultation) */

export interface DecisionEnAttente {
  type: 'contre_offre' | 'augmentation' | 'depart' | 'fin_contrat' | 'poste_vacant' | 'offre_marche' | 'vote_reglement' | 'election' | 'vote_federation' | 'conference';
  /** Phase 11 : question de la presse en attente (identifiant de la conférence). */
  conference?: string;
  titre: string;
  detail: string;
  /** Ce qui se passe sans décision du joueur. */
  consequence: string;
  echeance?: DateJeu;
  urgente: boolean;
  personne?: string;
  contrat?: string;
  poste?: Poste;
}

const rang = (d: DateJeu) => rangSemaine(d);

/** Ce qui attend une décision du joueur pour son écurie (aucun effet sur l'état). */
export function decisionsEnAttente(monde: Monde, idEcurie = ecurieDuJoueur(monde)): DecisionEnAttente[] {
  if (!idEcurie) return [];
  const e = ecurieDe(monde, idEcurie);
  if (!e) return [];
  const res: DecisionEnAttente[] = [];
  const maintenant = rang(monde.date);
  const urgente = (d?: DateJeu) => !!d && rang(d) - maintenant <= URGENCE_SEMAINES;
  const annee = monde.date.annee;
  const contrats = (Object.values(table(monde, TABLES.contrats)) as unknown as Contrat[]).filter((c) => c.organisation === idEcurie && c.type === 'emploi');
  const negos = table(monde, TABLE_NEGOCIATIONS) as unknown as Record<string, NegociationEnCours>;
  const tp = teamPrincipal(monde, idEcurie);
  for (const c of contrats) {
    if (c.statut !== 'actif') continue;
    const p = personneDe(monde, c.personne);
    if (!p || p.id === tp?.id) continue;
    const delegue = iaDecide(e, domainePoste(c.poste));
    const n = negos[c.id];
    if (n) {
      const ech = { annee, semaine: SEMAINE_FIN_CONTRATS };
      res.push({ type: 'contre_offre', titre: `${nomDe(p)} : contre-proposition`, detail: `Demande ${n.salaireDemande} M€ par an sur ${n.dureeAnnees} an(s).`, consequence: 'Sans nouvelle offre, le contrat se termine à son échéance.', echeance: ech, urgente: urgente(ech), personne: p.id, contrat: c.id, poste: c.poste });
    }
    if (c.demandeAugmentation !== undefined && !delegue) {
      res.push({ type: 'augmentation', titre: `${nomDe(p)} demande une augmentation`, detail: `Salaire actuel ${c.salaireMEUR} M€, demande ${c.demandeAugmentation} M€.`, consequence: 'La demande reste en attente ; la personne s’en souvient.', urgente: false, personne: p.id, contrat: c.id, poste: c.poste });
    }
    if (c.demandeDepart && !c.demandeDepart.refusee && !delegue) {
      // Audit de la phase 10 : calendrier du moteur (avant : semaine 44 + 8 semaines donnait la semaine 52 de l'année suivante).
      const ech = ajouterSemaines(c.demandeDepart.depuis, DEMANDES_DEPART.delaiReponseSemaines);
      res.push({ type: 'depart', titre: `${nomDe(p)} demande à partir`, detail: `Départ à l’amiable contre une indemnité de ${c.demandeDepart.indemnite} M€.`, consequence: `Sans réponse en ${DEMANDES_DEPART.delaiReponseSemaines} semaines, la demande vaut refus.`, echeance: ech, urgente: urgente(ech), personne: p.id, contrat: c.id, poste: c.poste });
    }
    if (c.fin === annee && !c.nonProlonge && !n && !delegue && monde.date.semaine < SEMAINE_FIN_CONTRATS) {
      const ech = { annee, semaine: SEMAINE_FIN_CONTRATS };
      res.push({ type: 'fin_contrat', titre: `Contrat de ${nomDe(p)} : fin ${annee}`, detail: `${c.poste.replace(/_/g, ' ')}, ${c.salaireMEUR} M€ par an.`, consequence: 'Sans prolongation, la personne part en fin de saison.', echeance: ech, urgente: urgente(ech), personne: p.id, contrat: c.id, poste: c.poste });
    }
  }
  // Postes encore à pourvoir pour la saison suivante (contrats et pré-accords comptés).
  const suivante = annee + 1;
  for (const { poste } of POSTES_INDIVIDUALISES) {
    if (poste === 'team_principal' || iaDecide(e, domainePoste(poste))) continue;
    const libres = placesLibres(monde, idEcurie, poste as Poste, suivante);
    // Audit de la phase 10 : seulement tant que le marché permet d'agir (avant : affiché jusqu'en semaine 49, échéance dépassée).
    if (libres > 0 && monde.date.semaine <= FENETRE.fin) {
      const ech = { annee, semaine: FENETRE.fin };
      res.push({ type: 'poste_vacant', titre: `${libres > 1 ? `${libres} places` : 'Une place'} à pourvoir en ${suivante} : ${String(poste).replace(/_/g, ' ')}`, detail: `Marché ouvert de la semaine ${FENETRE.debut} à la semaine ${FENETRE.fin}.`, consequence: 'Sans recrutement, un remplaçant est engagé d’office en fin de saison.', echeance: ech, urgente: urgente(ech), poste: poste as Poste });
    }
  }
  // Offres du marché : contre-propositions reçues.
  for (const o of Object.values(table(monde, TABLES.offres)) as unknown as { id: string; ecurie: string; personne: string; statut: string; salaireMEUR: number; contreOffreMEUR?: number }[]) {
    if (o.ecurie !== idEcurie || o.statut !== 'contre_offre') continue;
    const p = personneDe(monde, o.personne);
    if (!p) continue;
    res.push({ type: 'offre_marche', titre: `${nomDe(p)} fait une contre-proposition`, detail: `Votre offre : ${o.salaireMEUR} M€ par an.`, consequence: 'Sans nouvelle offre, la négociation s’arrête à la clôture du marché.', urgente: false, personne: p.id });
  }
  // Votes (domaine politique non délégué).
  if (!iaDecide(e, 'politique')) {
    const props = propositions(monde);
    if (props.length && !props[0]!.votes?.[idEcurie] && monde.date.semaine <= CALENDRIER_REGLEMENT.semaineVote) {
      const ech = { annee, semaine: CALENDRIER_REGLEMENT.semaineVote };
      res.push({ type: 'vote_reglement', titre: 'Vote sur le prochain règlement', detail: `${props.length} réforme(s) proposée(s), ou prolongation du règlement actuel.`, consequence: 'Sans vote, l’écurie s’abstient.', echeance: ech, urgente: urgente(ech) });
    }
    const f = federation(monde);
    if (f && annee === f.finMandat && monde.date.semaine <= FEDERATION.semaineElection && !f.election?.votes[idEcurie]) {
      const ech = { annee, semaine: FEDERATION.semaineElection };
      res.push({ type: 'election', titre: 'Élection à la présidence de la fédération', detail: 'Une voix par écurie.', consequence: 'Sans vote, l’écurie s’abstient.', echeance: ech, urgente: urgente(ech) });
    }
    if (f?.vote && f.vote.annee === annee && monde.date.semaine <= AUTRES_VOTES.semaine && f.vote.votes[idEcurie] === undefined) {
      const ech = { annee, semaine: AUTRES_VOTES.semaine };
      res.push({ type: 'vote_federation', titre: 'Vote de la fédération', detail: `Sujet : ${f.vote.sujet === 'plafondMEUR' ? 'plafond budgétaire' : f.vote.sujet === 'grandsPrix' ? 'nombre de Grands Prix' : 'restrictions aérodynamiques'}, valeur proposée ${f.vote.valeur}.`, consequence: 'Sans vote, l’écurie s’abstient.', echeance: ech, urgente: urgente(ech) });
    }
  }
  // Phase 11 : questions de la presse (communication non déléguée).
  for (const c of Object.values(table(monde, TABLES.conferences)) as unknown as Conference[]) {
    if (c.ecurie !== idEcurie) continue;
    res.push({ type: 'conference', titre: 'La presse vous interroge', detail: LIBELLES_QUESTIONS[c.question], consequence: 'Sans réponse, le service de communication esquive la question.', echeance: c.echeance, urgente: urgente(c.echeance), conference: c.id, ...(c.sujet && personneDe(monde, c.sujet) ? { personne: c.sujet } : {}) });
  }
  return res.sort((a, b) => Number(b.urgente) - Number(a.urgente) || (a.echeance ? rang(a.echeance) : 1e9) - (b.echeance ? rang(b.echeance) : 1e9));
}

/* ------------------------------------------------------------------ Suivi : fin de partie */

/** Le joueur a perdu son poste (licenciement par le conseil, rachat) : la partie est terminée (phase 14 pour la suite). */
export const systemeSuiviJoueur: Systeme = {
  nom: 'joueur.suivi',
  executer({ monde }) {
    const j = monde.joueur;
    if (!j || j.etat !== 'actif') return;
    const e = ecurieDe(monde, j.ecurie);
    const p = personneDe(monde, j.personne);
    if (e?.pilotee && p && p.statut === 'actif' && p.ecurie === j.ecurie) return;
    j.etat = 'licencie';
    let fin: string | undefined;
    for (const id of Object.keys(monde.evenements).reverse()) {
      const ev = monde.evenements[id]!;
      if (ev.type === 'conseil.licenciement_joueur' || (ev.type === 'contrat.fin' && ev.acteurs.some((a) => a.id === j.personne))) { fin = id; break; }
    }
    if (e) { e.pilotee = false; delete e.delegations; e.delegationRecherche = false; const eq = equipeStands(monde, e.id); if (eq) eq.delegation = false; }
    if (p) {
      // Le manager quitte le paddock : il n'est plus recrutable par l'IA (la suite de sa carrière : phase 14).
      if (p.statut === 'actif') { const c = contratEmploi(monde, p.id); if (c) liberer(monde, p, c, 'licenciement', fin ? [fin] : []); }
      p.statut = 'retraite';
      p.ecurie = '';
      p.retraiteDepuis = monde.date.annee;
    }
    // Le poste de team principal est pourvu tout de suite, comme après tout licenciement.
    if (e && !teamPrincipal(monde, e.id)) pourvoirPostes(monde, true);
    const evt = ajouterEvenement(monde, {
      type: 'joueur.fin_de_partie', acteurs: [{ id: j.personne, role: 'personne' }, { id: j.ecurie, role: 'organisation' }], importance: 4, visibilite: 'public',
      causes: fin ? [fin] : [], texte: `${p ? nomDe(p) : 'Le manager'} quitte la tête de ${e?.nom ?? 'son écurie'}.`,
    });
    j.evenementFin = evt.id;
  },
};

/** Personnes de l'écurie du joueur, triées par poste (pour l'interface). */
export function effectifJoueur(monde: Monde, idEcurie: string): Personne[] {
  const ordre = POSTES_INDIVIDUALISES.map((x) => x.poste as string);
  return idsTries(table(monde, TABLES.personnes)).map((id) => personneDe(monde, id)!).filter((p) => p.statut === 'actif' && p.ecurie === idEcurie)
    .sort((a, b) => (ordre.indexOf(a.poste) + 1 || 99) - (ordre.indexOf(b.poste) + 1 || 99) || (a.nom < b.nom ? -1 : 1));
}

/**
 * Commande du joueur exécutée tout de suite (entre deux semaines), pour une réponse immédiate à l'écran. Elle est journalisée
 * à la date courante : quand on rejoue, elle est réappliquée au début de la même semaine, donc au même moment de la simulation.
 */
export function executerCommandeJoueur(moteur: Moteur, monde: Monde, commande: Omit<Commande, 'source'>): ResultatCommande {
  const c: Commande = { ...commande, source: 'exterieur' };
  const r = moteur.commandes.executer(monde, c);
  if (r.ok) monde.journalCommandes.push({ date: { ...monde.date }, commande: structuredClone(c) });
  return r;
}

export function installerJoueur(moteur: Moteur): Moteur {
  moteur.ajouterSysteme(systemeSuiviJoueur);
  moteur.commandes.enregistrer(commandePrendreEcurie).enregistrer(commandeDeleguerJoueur).enregistrer(commandeBudgetDeveloppement);
  return moteur;
}
