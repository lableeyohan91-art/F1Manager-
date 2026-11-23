/**
 * Phase 7c — popularité, valeur commerciale, sponsors personnels, pilotes payants, agents
 * (docs/systemes/phase-7-marche-du-travail.md §5, §8, §15.3 ; D-096 à D-099, D-116, D-117).
 *
 * - Popularité (nationale, internationale) des pilotes : évolue chaque fin de saison avec les résultats, les titres, l'ancienneté, le charisme.
 * - Valeur commerciale (calculée) : popularité × taille du marché de sa nationalité × rareté de sa nationalité sur la grille.
 * - Sponsors personnels : un sponsor de sa nationalité (ou l'entreprise familiale) accompagne le pilote dans son écurie, dans un emplacement
 *   libre (jamais en plus : pas de double comptage), et le suit lors d'un transfert ; sinon, il paie le pilote lui-même.
 * - Pilotes payants : l'apport commercial d'un candidat entre dans le score de recrutement ; c'est le marché qui régule, jamais une règle.
 * - Agents : clients bornés, commission négociée, surenchère en négociation, poussée vers les transferts, démarchage des écuries.
 */

import {
  AGENTS, ATTRAIT_PILOTES, ENTREPRISES_LIEES, PILOTES_PAYANTS, POPULARITE, SPONSORS_PERSONNELS, TAILLE_MARCHE, TAILLE_MARCHE_DEFAUT, VALEUR_COMMERCIALE,
} from '../../balance/commercial';
import { SEUILS_RANG_SPONSOR } from '../../balance/finances';
import { ajouterEvenement } from '../../core/evenements';
import { nouvelIdentifiant } from '../../core/identifiants';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal, type Systeme } from '../../core/moteur';

/** Semaine de mise à jour de la popularité : après la dernière course, avant la prise d'effet des contrats. */
const SEMAINE_POPULARITE = 49;
import { TABLES, type Agent, type Candidature, type ContratSponsoring, type Ecurie, type Palmares, type Personne, type Saison, type Sponsor } from '../../model/types';
import { ecuriesActives } from '../saison/performance';
import { niveauMetier, valeurMarche } from '../humain/decision';
import { placesLibres } from '../humain/effectifs';
import { emplacementsLibres, signerSponsor, sponsorsEngages } from '../economie/sponsors';

const borner = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const arrondi = (x: number) => Math.round(x * 10) / 10;
const personnes = (m: Monde) => idsTries(table(m, TABLES.personnes)).map((id) => table(m, TABLES.personnes)[id] as unknown as Personne);
const titulaires = (m: Monde) => personnes(m).filter((p) => p.statut === 'actif' && p.poste === 'pilote_titulaire');

/* ---------------------------------------------------------------- Popularité et valeur commerciale */

function charisme(p: Personne): number {
  return ((p.competences['communication'] ?? 10) + (p.traits['sociabilite'] ?? 10) + (p.traits['besoinReconnaissance'] ?? 10)) / 60;
}

/** Popularité d'un pilote ; estimée d'après son niveau tant qu'elle n'a jamais été calculée (début de partie, jeune). */
export function popularite(p: Personne): { nationale: number; internationale: number } {
  if (p.popularite) return p.popularite;
  const base = borner(POPULARITE.initialeMin + POPULARITE.initialeParPointNiveau * Math.max(0, niveauMetier(p) - 12), 0, 100)
    * (p.poste === 'pilote_titulaire' ? 1 : POPULARITE.junior);
  return { nationale: borner(base + POPULARITE.bonusNational, 0, 100), internationale: base };
}

/** Fin de saison : la popularité de chaque pilote (titulaire, ou junior réputé) se rapproche de sa cible. */
export function evoluerPopularites(monde: Monde, annee: number): void {
  const s = table(monde, TABLES.saisons)[`ssn_${annee}`] as unknown as Saison | undefined;
  const pal = Object.values(table(monde, TABLES.palmares)) as unknown as Palmares[];
  const n = s?.pilotes.length ?? 22;
  for (const p of personnes(monde)) {
    if (!p.poste.startsWith('pilote') || p.statut === 'retraite') continue;
    if (p.poste !== 'pilote_titulaire' && !p.popularite && !(p.reputationJeune && p.reputationJeune > 0)) continue;
    const rang = s ? s.pilotes.findIndex((x) => x.pilote === p.id) : -1;
    const victoires = rang >= 0 ? s!.pilotes[rang]!.victoires : 0;
    const titres = pal.filter((x) => x.championPilote === p.id).length;
    const anciennete = Math.min(POPULARITE.plafondAnciennete, POPULARITE.parSaisonF1 * (p.carriere?.saisonsF1 ?? 0));
    let cible = (rang >= 0 ? POPULARITE.parRang * (n - 1 - rang) : (p.reputationJeune ?? 0) * POPULARITE.junior)
      + POPULARITE.parVictoire * victoires + POPULARITE.parTitre * titres + anciennete + POPULARITE.charisme * charisme(p);
    cible = borner(cible, 0, 100);
    const actuelle = popularite(p);
    const k = POPULARITE.inertie;
    p.popularite = {
      internationale: Math.round(k * actuelle.internationale + (1 - k) * cible),
      nationale: Math.round(k * actuelle.nationale + (1 - k) * borner(cible + POPULARITE.bonusNational, 0, 100)),
    };
  }
}

/** Valeur commerciale annuelle d'un pilote (M€) : popularité, taille du marché de sa nationalité, rareté de sa nationalité sur la grille. */
export function valeurCommerciale(monde: Monde, p: Personne): number {
  if (!p.poste.startsWith('pilote')) return 0;
  const pop = popularite(p);
  const compatriotes = titulaires(monde).filter((x) => x.id !== p.id && x.nationalite === p.nationalite).length;
  const rarete = 1 / (1 + compatriotes);
  const marche = TAILLE_MARCHE[p.nationalite] ?? TAILLE_MARCHE_DEFAUT;
  return arrondi(VALEUR_COMMERCIALE.baseMEUR * (pop.internationale / 100 + VALEUR_COMMERCIALE.poidsNational * (pop.nationale / 100) * marche * rarete));
}

/* ---------------------------------------------------------------- Sponsors personnels et pilotes payants */

const contratsSponsoring = (m: Monde) => Object.values(table(m, TABLES.contratsSponsoring)) as unknown as ContratSponsoring[];

/** Sponsors qui accompagnent un pilote (contrats actifs liés à lui). */
export function sponsorsDuPilote(monde: Monde, idPilote: string): ContratSponsoring[] {
  return contratsSponsoring(monde).filter((c) => c.pilote === idPilote && c.statut === 'actif');
}

/** Secteurs des sponsors actifs d'une écurie pour une saison (exclusivité de secteur). */
function secteursEcurie(monde: Monde, idEcurie: string, annee: number): Set<string | undefined> {
  const ts = table(monde, TABLES.sponsors);
  return new Set(contratsSponsoring(monde).filter((c) => c.statut === 'actif' && c.ecurie === idEcurie && c.debut <= annee && c.fin >= annee)
    .map((c) => (ts[c.sponsor] as unknown as Sponsor | undefined)?.secteur));
}

export interface ApportCommercial {
  /** Revenus versés au pilote lui-même (sponsor personnel) : ils réduisent ses exigences, l'écurie ne les touche pas. */
  verseAuPilote: number;
  /** Sponsors qui le suivent et pourraient être transférés (avant vérification des places et des secteurs). */
  potentiel: number;
  /** Part réellement transférable à l'écurie recruteuse : emplacement libre, pas de conflit de secteur, sponsor qui suit (sa nationalité). */
  transferable: number;
  /** Déjà acquis par l'écurie (le pilote y est déjà : rien de nouveau). */
  dejaAcquis: number;
  /** Nouveau et net pour l'écurie (transférable et pas déjà acquis). */
  netNouveau: number;
}

/**
 * Audit de la phase 7 (priorité 2) — apport commercial RÉEL d'un candidat pour une écurie donnée (même calcul pour le joueur et l'IA).
 * Les indemnités de transfert et les salaires sont comptés à part, dans le score de recrutement ; ici, seuls les revenus de sponsoring.
 */
export function apportCommercialPour(monde: Monde, e: Ecurie, p: Personne, annee = monde.date.annee + 1): ApportCommercial {
  const res: ApportCommercial = { verseAuPilote: 0, potentiel: 0, transferable: 0, dejaAcquis: 0, netNouveau: 0 };
  if (!p.poste.startsWith('pilote')) return res;
  if (p.sponsorPersonnel && p.sponsorPersonnel.jusqua >= annee) res.verseAuPilote = p.sponsorPersonnel.montantMEUR;
  const ts = table(monde, TABLES.sponsors);
  const libres = { ...emplacementsLibres(monde, e.id, annee) };
  const secteurs = secteursEcurie(monde, e.id, annee);
  const flux: { sponsor?: Sponsor; montant: number; suit: boolean }[] = sponsorsDuPilote(monde, p.id).map((c) => {
    const sp = ts[c.sponsor] as unknown as Sponsor | undefined;
    return { sponsor: sp, montant: c.montantAnnuelMEUR, suit: !!sp && sp.nationalite === p.nationalite };
  });
  // Débutant dont la famille finance la carrière : l'entreprise familiale suivra (si elle peut être créée).
  if ((p.carriere?.saisonsF1 ?? 0) === 0 && (p.budgetFamilleMEUR ?? 0) >= SPONSORS_PERSONNELS.seuilFamilleMEUR && !flux.length) {
    flux.push({ montant: (p.budgetFamilleMEUR ?? 0) * SPONSORS_PERSONNELS.partFamille, suit: entreprisesLieesActives(monde) < ENTREPRISES_LIEES.maximum });
  }
  for (const f of flux) {
    res.potentiel += f.montant;
    if (p.ecurie === e.id && p.poste === 'pilote_titulaire') { res.dejaAcquis += f.montant; continue; }
    if (!f.suit || (f.sponsor && secteurs.has(f.sponsor.secteur))) continue;
    const rang = f.montant >= SEUILS_RANG_SPONSOR.principal && libres.principal > 0 ? 'principal' : libres.secondaire > 0 ? 'secondaire' : libres.principal > 0 ? 'principal' : null;
    if (!rang) continue;
    libres[rang]--;
    res.transferable += rang === 'secondaire' ? Math.min(f.montant, SEUILS_RANG_SPONSOR.principal - 0.1) : f.montant;
  }
  res.netNouveau = res.transferable;
  return res;
}

/** Apport commercial potentiel d'un pilote, toutes écuries confondues (indicateur ; le recrutement lit apportCommercialPour). */
export function apportCommercial(monde: Monde, p: Personne): number {
  const suivent = sponsorsDuPilote(monde, p.id).reduce((a, c) => a + c.montantAnnuelMEUR, 0);
  const famille = (p.carriere?.saisonsF1 ?? 0) === 0 && (p.budgetFamilleMEUR ?? 0) >= SPONSORS_PERSONNELS.seuilFamilleMEUR ? (p.budgetFamilleMEUR ?? 0) * SPONSORS_PERSONNELS.partFamille : 0;
  return suivent + famille;
}

/** Terme « apport commercial » du score de recrutement : revenus nouveaux et nets pour cette écurie, à l'échelle du coût salarial. */
export function bonusPilotePayant(monde: Monde, e: Ecurie, p: Personne, duree: number): number {
  if (!p.poste.startsWith('pilote')) return 0;
  const budgetPoste = e.budgetMEUR * 0.05;
  return (PILOTES_PAYANTS.poids * apportCommercialPour(monde, e, p).netNouveau) / Math.max(1, budgetPoste) * Math.min(1, duree / 2);
}

/** Nombre d'entreprises liées à un pilote actuellement actives (plafond, audit de la phase 7). */
function entreprisesLieesActives(monde: Monde): number {
  return (Object.values(table(monde, TABLES.sponsors)) as unknown as Sponsor[]).filter((s) => s.actif && s.lie).length;
}

/** Entreprise liée à un pilote (familiale ou nationale) ; null si le plafond du monde est atteint. */
function entrepriseLiee(monde: Monde, p: Personne, genre: 'fam' | 'nat', montant: number): Sponsor | null {
  const id = `spo_${genre}_${p.id.replace(/^per_/, '')}`;
  const t = table(monde, TABLES.sponsors);
  const existant = t[id] as unknown as Sponsor | undefined;
  if (existant?.actif) return existant;
  // Plafond du monde, y compris pour réactiver une entreprise déjà créée.
  if (entreprisesLieesActives(monde) >= ENTREPRISES_LIEES.maximum) return null;
  if (existant) { existant.actif = true; return existant; }
  const s: Sponsor = {
    id, nom: genre === 'fam' ? `Groupe ${p.nom}` : `Entreprise ${p.nationalite} (soutien de ${p.nom})`,
    secteur: `${genre === 'fam' ? 'groupe familial' : 'soutien national'} ${p.id}`, nationalite: p.nationalite,
    budgetMEUR: arrondi(montant * ENTREPRISES_LIEES.multipleBudget), image: 'nationalite', fidelite: genre === 'fam' ? 18 : 14, exigence: genre === 'fam' ? 4 : 6,
    rancunes: [], actif: true, derniereAnneeContrat: 0, lie: p.id,
  };
  t[id] = s as unknown as Entite;
  ajouterEvenement(monde, { type: 'sponsor.creation_liee', acteurs: [{ id: p.id, role: 'pilote' }, { id, role: 'sponsor' }], importance: 1, contexte: { genre, budget: s.budgetMEUR } });
  return s;
}

/** Fin de vie : une entreprise liée cesse quand son pilote n'est plus titulaire depuis plus d'un an (ou a disparu). */
function fermerEntreprisesLiees(monde: Monde, annee: number): void {
  const engagees = sponsorsEngages(monde, annee);
  for (const s of Object.values(table(monde, TABLES.sponsors)) as unknown as Sponsor[]) {
    if (!s.lie || !s.actif || engagees.has(s.id)) continue;
    const p = table(monde, TABLES.personnes)[s.lie] as unknown as Personne | undefined;
    if (!p || p.statut === 'retraite' || annee - s.derniereAnneeContrat > ENTREPRISES_LIEES.anneesSansPilote) s.actif = false;
  }
}

/** Début d'année : les pilotes titulaires qui le peuvent attirent un sponsor personnel ; les sponsors suivent leurs pilotes. */
export function sponsorsPersonnels(monde: Monde, annee: number): void {
  // 1. Un sponsor accompagnant dont le pilote n'est plus titulaire dans l'écurie suit le pilote, ou s'arrête.
  for (const c of contratsSponsoring(monde)) {
    if (!c.pilote || c.statut !== 'actif') continue;
    const p = table(monde, TABLES.personnes)[c.pilote] as unknown as Personne | undefined;
    if (p && p.statut === 'actif' && p.poste === 'pilote_titulaire' && p.ecurie === c.ecurie) continue;
    suivreLePilote(monde, c, p, annee);
  }
  fermerEntreprisesLiees(monde, annee);
  // 2. Nouveaux sponsors personnels. Source commune des engagements : un sponsor déjà engagé (écurie ou pilote) ne l'est jamais deux fois.
  const engages = sponsorsEngages(monde, annee);
  const libres = (Object.values(table(monde, TABLES.sponsors)) as unknown as Sponsor[]).filter((s) => s.actif && !s.lie && !engages.has(s.id)).sort((a, b) => (a.id < b.id ? -1 : 1));
  for (const p of titulaires(monde)) {
    if (sponsorsDuPilote(monde, p.id).length || (p.sponsorPersonnel && p.sponsorPersonnel.jusqua >= annee)) continue;
    const valeur = valeurCommerciale(monde, p);
    const famille = (p.budgetFamilleMEUR ?? 0) >= SPONSORS_PERSONNELS.seuilFamilleMEUR;
    if (valeur < SPONSORS_PERSONNELS.seuilMEUR && !famille) continue;
    if (!tirageLocal(monde, 'sponsor.personnel', p.id, annee).chance(SPONSORS_PERSONNELS.probabilite)) continue;
    const parFamille = famille && valeur < SPONSORS_PERSONNELS.seuilMEUR;
    let montant = arrondi(parFamille ? (p.budgetFamilleMEUR ?? 0) * SPONSORS_PERSONNELS.partFamille : valeur * SPONSORS_PERSONNELS.part);
    // Entreprise familiale ; sinon un sponsor libre de sa nationalité ; sinon une entreprise nationale (plafonnée).
    const s = parFamille ? entrepriseLiee(monde, p, 'fam', montant)
      : libres.find((x) => x.nationalite === p.nationalite && !engages.has(x.id)) ?? entrepriseLiee(monde, p, 'nat', montant);
    if (!s) continue;
    // Conservation du budget : jamais plus qu'une part du budget du sponsor.
    montant = arrondi(Math.min(montant, s.budgetMEUR * ENTREPRISES_LIEES.partMaxBudget));
    if (montant <= 0) continue;
    engages.add(s.id);
    const e = table(monde, TABLES.ecuries)[p.ecurie] as unknown as Ecurie;
    const rang = emplacementLibrePour(monde, e.id, annee, montant, s);
    if (rang) {
      const c = signerSponsor(monde, s, e, rang, Math.min(montant, rang === 'secondaire' ? SEUILS_RANG_SPONSOR.principal - 0.1 : rang === 'principal' ? SEUILS_RANG_SPONSOR.titre - 0.1 : montant), annee, false);
      c.pilote = p.id;
      c.fin = Math.min(c.fin, annee + SPONSORS_PERSONNELS.dureeAns - 1);
      s.derniereAnneeContrat = c.fin;
      ajouterEvenement(monde, { type: 'sponsor.personnel', acteurs: [{ id: p.id, role: 'pilote' }, { id: s.id, role: 'sponsor' }, { id: e.id, role: 'ecurie' }], importance: 2, visibilite: 'public', contexte: { contrat: c.id, montant: c.montantAnnuelMEUR, genre: 'accompagnant' }, texte: `${s.nom} accompagne ${p.prenom} ${p.nom} chez ${e.nom}.` });
    } else {
      p.sponsorPersonnel = { sponsor: s.id, montantMEUR: montant, jusqua: annee + SPONSORS_PERSONNELS.dureeAns - 1 };
      s.derniereAnneeContrat = p.sponsorPersonnel.jusqua;
      ajouterEvenement(monde, { type: 'sponsor.personnel', acteurs: [{ id: p.id, role: 'pilote' }, { id: s.id, role: 'sponsor' }], importance: 1, visibilite: 'public', contexte: { montant, genre: 'personnel' }, texte: `${s.nom} devient le sponsor personnel de ${p.prenom} ${p.nom}.` });
    }
  }
}

function emplacementLibrePour(monde: Monde, idEcurie: string, annee: number, montant: number, s?: Sponsor): 'principal' | 'secondaire' | null {
  // Exclusivité de secteur (phase 5b) : jamais deux sponsors du même secteur dans une écurie.
  if (s) {
    const ts = table(monde, TABLES.sponsors);
    const secteurs = contratsSponsoring(monde).filter((c) => c.statut === 'actif' && c.ecurie === idEcurie && c.debut <= annee && c.fin >= annee)
      .map((c) => (ts[c.sponsor] as unknown as Sponsor | undefined)?.secteur);
    if (secteurs.includes(s.secteur)) return null;
  }
  const libres = emplacementsLibres(monde, idEcurie, annee);
  if (montant >= SEUILS_RANG_SPONSOR.principal && libres.principal > 0) return 'principal';
  return libres.secondaire > 0 ? 'secondaire' : libres.principal > 0 ? 'principal' : null;
}

/**
 * Transfert ou départ du pilote : un sponsor de sa nationalité le suit dans sa nouvelle écurie s'il y trouve un emplacement libre ;
 * sinon le contrat s'arrête (jamais compté deux fois).
 */
function suivreLePilote(monde: Monde, c: ContratSponsoring, p: Personne | undefined, annee: number): void {
  const s = table(monde, TABLES.sponsors)[c.sponsor] as unknown as Sponsor | undefined;
  const ancienne = c.ecurie;
  if (p && s && p.statut === 'actif' && p.poste === 'pilote_titulaire' && s.nationalite === p.nationalite) {
    const rang = emplacementLibrePour(monde, p.ecurie, annee, c.montantAnnuelMEUR, s);
    if (rang) {
      c.ecurie = p.ecurie;
      c.rang = rang;
      if (rang === 'secondaire') c.montantAnnuelMEUR = Math.min(c.montantAnnuelMEUR, SEUILS_RANG_SPONSOR.principal - 0.1);
      ajouterEvenement(monde, { type: 'sponsor.suit_pilote', acteurs: [{ id: p.id, role: 'pilote' }, { id: c.sponsor, role: 'sponsor' }, { id: p.ecurie, role: 'ecurie' }, { id: ancienne, role: 'ancienne' }], importance: 2, visibilite: 'public', contexte: { contrat: c.id, montant: c.montantAnnuelMEUR } });
      return;
    }
  }
  c.statut = 'rompu';
  ajouterEvenement(monde, { type: 'sponsor.depart_avec_pilote', acteurs: [{ id: c.sponsor, role: 'sponsor' }, { id: ancienne, role: 'ecurie' }, ...(p ? [{ id: p.id, role: 'pilote' }] : [])], importance: 1, visibilite: 'public', contexte: { contrat: c.id } });
}

/** Prise d'effet d'un transfert (semaine 50) : les sponsors accompagnants du pilote le suivent tout de suite, ou s'arrêtent. */
export function transfererSponsors(monde: Monde, p: Personne): void {
  for (const c of sponsorsDuPilote(monde, p.id)) if (c.ecurie !== p.ecurie) suivreLePilote(monde, c, p, monde.date.annee + 1);
}

/** Attrait supplémentaire d'une écurie pour les sponsors (D-096) : popularité de ses pilotes, jeune espoir. */
export function attraitPilotes(monde: Monde, e: Ecurie): number {
  const ps = titulaires(monde).filter((p) => p.ecurie === e.id);
  if (!ps.length) return 0;
  const pop = Math.max(...ps.map((p) => popularite(p).internationale)) / 100;
  const jeune = ps.some((p) => monde.date.annee - p.anneeNaissance <= ATTRAIT_PILOTES.ageJeune && (p.reputationJeune ?? 0) >= ATTRAIT_PILOTES.reputationJeune) ? 1 : 0;
  return ATTRAIT_PILOTES.popularite * pop + ATTRAIT_PILOTES.jeuneEspoir * jeune;
}

/* ---------------------------------------------------------------- Agents */

export function agents(monde: Monde): Agent[] {
  return idsTries(table(monde, TABLES.agents)).map((id) => table(monde, TABLES.agents)[id] as unknown as Agent);
}

/** Les agents représentent : pilotes de F1, pilotes d'Apex 2, personnel de haut niveau (D-117 §15.3). */
function eligibleAgent(monde: Monde, p: Personne): boolean {
  if (p.statut === 'retraite') return false;
  if (p.poste === 'pilote_titulaire' && p.statut === 'actif') return true;
  if (p.junior?.categorie === 'apex2' && p.junior.annee >= monde.date.annee - 1) return true;
  return ['directeur_technique', 'responsable_aero', 'responsable_conception', 'team_principal'].includes(p.poste) && niveauMetier(p) >= AGENTS.niveauPersonnel;
}

/** Commission négociée : plus faible pour un client de grande valeur, plus forte avec un agent bon négociateur. */
export function commissionNegociee(monde: Monde, a: Agent, p: Personne): number {
  const valeur = Math.min(1, valeurMarche(monde, p) / 20);
  const c = AGENTS.commissionMax - (AGENTS.commissionMax - AGENTS.commissionMin) * valeur + 0.03 * ((a.negociation - 10) / 10);
  return Math.round(borner(c, AGENTS.commissionMin, AGENTS.commissionMax) * 1000) / 1000;
}

/** Début d'année : création des agents si besoin, attribution des clients éligibles, fin des représentations devenues sans objet. */
export function attribuerAgents(monde: Monde): void {
  const ta = table(monde, TABLES.agents);
  if (Object.keys(ta).length === 0) {
    const noms = personnes(monde).filter((p) => p.statut !== 'retraite');
    for (let i = 0; i < AGENTS.nombre && noms.length > 1; i++) {
      const f = tirageLocal(monde, 'agents.creation', i);
      const a: Agent = {
        id: nouvelIdentifiant(monde, 'agt'), prenom: f.choisir(noms).prenom, nom: f.choisir(noms).nom,
        negociation: f.entier(6, 19), ambition: f.entier(4, 19), reseau: f.entier(5, 19),
      };
      ta[a.id] = a as unknown as Entite;
    }
  }
  const liste = agents(monde);
  if (!liste.length) return;
  const clients = new Map<string, number>(liste.map((a) => [a.id, 0]));
  for (const p of personnes(monde)) {
    if (p.agent && !eligibleAgent(monde, p)) { delete p.agent; delete p.commission; }
    if (p.agent) clients.set(p.agent, (clients.get(p.agent) ?? 0) + 1);
  }
  for (const p of personnes(monde)) {
    if (p.agent || !eligibleAgent(monde, p)) continue;
    const f = tirageLocal(monde, 'agents.choix', p.id, monde.date.annee);
    // Les meilleurs clients vont aux agents les mieux notés qui ont de la place ; un peu de hasard (relations, rencontres).
    const dispo = liste.filter((a) => (clients.get(a.id) ?? 0) < AGENTS.clientsMax)
      .map((a) => ({ a, s: (a.negociation + a.reseau) / 40 + f.normale(0, 0.2) }))
      .sort((x, y) => y.s - x.s || (x.a.id < y.a.id ? -1 : 1));
    const choisi = dispo[0]?.a;
    if (!choisi) continue;
    p.agent = choisi.id;
    p.commission = commissionNegociee(monde, choisi, p);
    clients.set(choisi.id, (clients.get(choisi.id) ?? 0) + 1);
  }
}

/** Agent d'une personne (s'il en a un). */
export function agentDe(monde: Monde, p: Personne): Agent | undefined {
  return p.agent ? (table(monde, TABLES.agents)[p.agent] as unknown as Agent | undefined) : undefined;
}

/**
 * Démarchage (D-117 §15.3) : chaque agent propose quelques clients disponibles l'an prochain (libres, ou en fin de contrat non prolongé)
 * aux écuries qui ont une place ouverte à leur poste. Inscrit comme candidature (lue par le plan de l'IA) et notifié à l'écurie.
 */
export function demarchageAgents(monde: Monde): void {
  const debut = monde.date.annee + 1;
  const tc = table(monde, TABLES.candidatures);
  const contrats = Object.values(table(monde, TABLES.contrats)) as unknown as { personne: string; statut: string; type: string; fin: number; nonProlonge?: boolean }[];
  const sousContrat = new Set(contrats.filter((c) => c.type === 'emploi' && (c.statut === 'signe' || (c.statut === 'actif' && c.fin >= debut))).map((c) => c.personne));
  for (const a of agents(monde)) {
    const n = Math.max(1, Math.round((AGENTS.demarchages * a.reseau) / 20));
    const mesClients = personnes(monde).filter((p) => p.agent === a.id && !sousContrat.has(p.id) && p.statut !== 'retraite');
    let faits = 0;
    for (const p of mesClients) {
      if (faits >= n) break;
      const poste = p.poste === 'pilote_junior' || p.poste === 'pilote_reserve' ? 'pilote_titulaire' : p.poste;
      const ouvertes = ecuriesActives(monde).filter((x) => x.id !== p.ecurie && placesLibres(monde, x.id, poste, debut) > 0).sort((x, y) => (x.id < y.id ? -1 : 1));
      const e = ouvertes.length ? ouvertes[tirageLocal(monde, 'agents.demarchage', a.id, p.id, monde.date.annee).entier(0, ouvertes.length - 1)] : undefined;
      if (!e) continue;
      const cand: Candidature = { id: nouvelIdentifiant(monde, 'cnd'), personne: p.id, ecurie: e.id, poste, annee: monde.date.annee, semaine: monde.date.semaine };
      tc[cand.id] = cand as unknown as Entite;
      ajouterEvenement(monde, {
        type: 'agent.demarchage', acteurs: [{ id: p.id, role: 'client' }, { id: e.id, role: 'organisation' }], importance: 1, visibilite: 'prive',
        contexte: { agent: a.id, poste }, texte: `L'agent ${a.prenom} ${a.nom} propose ${p.prenom} ${p.nom} à ${e.nom}.`,
      });
      faits++;
    }
  }
}

/** Calendrier commercial : agents et sponsors personnels en début d'année, démarchage pendant la fenêtre, popularité en fin de saison. */
export const systemeCommercial: Systeme = {
  nom: 'marche.commercial',
  executer({ monde, date }) {
    if (date.semaine === AGENTS.semaine) {
      attribuerAgents(monde);
      sponsorsPersonnels(monde, date.annee);
    }
    if (date.semaine === AGENTS.semaineDemarchage) demarchageAgents(monde);
    if (date.semaine === SEMAINE_POPULARITE) evoluerPopularites(monde, date.annee);
  },
};
