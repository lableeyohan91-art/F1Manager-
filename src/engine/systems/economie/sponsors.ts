/**
 * Sponsors — phase 5b (docs/systemes/phase-5-economie.md §4).
 *
 * - Vivier d'entreprises FICTIVES (noms générés à partir de data/commun, aucune vraie marque), borné en volume.
 * - Marché annuel (semaine 1) : chaque sponsor libre choisit l'écurie la plus attirante qui a un emplacement libre
 *   et pas de concurrent de son secteur ; le montant dépend de son budget, de la conjoncture et de l'attrait.
 * - Objectif de classement : atteint → prime et satisfaction ; manqué → déception, rupture possible, rancune.
 * - Mêmes règles pour toutes les écuries, joueur compris (les décisions du joueur viendront avec l'interface de jeu).
 */

import {
  ALEA_CHOIX_SPONSOR, CONJONCTURE, DUREE_CONTRAT_SPONSOR, EMPLACEMENTS_SPONSORS, OFFRE_SPONSOR, POIDS_ATTRAIT, RANCUNE_SPONSOR_ANNEES,
  SATISFACTION_SPONSOR, SEUILS_RANG_SPONSOR, VIVIER_SPONSORS,
} from '../../balance/finances';
import { attraitPilotes } from '../marche/commercial';
import { ajouterEvenement } from '../../core/evenements';
import { nouvelIdentifiant } from '../../core/identifiants';
import { flux, tirageLocal } from '../../core/moteur';
import { idsTries, parametre, table, type Entite, type Monde } from '../../core/monde';
import { TABLE_REFERENTIEL, type Referentiel } from '../../generation/construction';
import {
  TABLES, type ContratSponsoring, type Departement, type Ecurie, type Finances, type ImageSponsor, type OffreSponsor, type Personne, type RangSponsor, type Saison,
  type Sponsor, type VarianteOffre,
} from '../../model/types';
import { CHOIX_EQUIPE, OFFRES_JOUEUR, SATISFACTION_CLAUSES } from '../../balance/sponsoring';
import { ajouterSemaines } from '../../core/calendrier';
import { iaDecide } from '../joueur/acces';
import { nombreGrandsPrix } from '../politique/acces';
import { bilanSaison, clauseTenue, rangAttenduPublic, rangVoiture } from './probabilites';
import { construireVariantes } from './variantes';
import { ecuriesActives, pilotesTitulaires } from '../saison/performance';
import { forceEcurie, teamPrincipal } from '../humain/decision';
import { attraitImage } from '../medias/acces';

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const arrondi = (x: number) => Math.round(x * 10) / 10;
const RANGS: RangSponsor[] = ['titre', 'principal', 'secondaire'];
const IMAGES: ImageSponsor[] = ['prestige', 'popularite', 'resultats', 'nationalite'];

export const sponsors = (m: Monde) => idsTries(table(m, TABLES.sponsors)).map((id) => table(m, TABLES.sponsors)[id] as unknown as Sponsor);
export const contratsSponsoring = (m: Monde) =>
  idsTries(table(m, TABLES.contratsSponsoring)).map((id) => table(m, TABLES.contratsSponsoring)[id] as unknown as ContratSponsoring);
export const offresSponsors = (m: Monde, idEcurie?: string) =>
  idsTries(table(m, TABLES.offresSponsors)).map((id) => table(m, TABLES.offresSponsors)[id] as unknown as OffreSponsor).filter((o) => !idEcurie || o.ecurie === idEcurie);
const couvre = (c: ContratSponsoring, annee: number) => c.statut === 'actif' && c.debut <= annee && c.fin >= annee;
export const contratsActifs = (m: Monde, annee: number, idEcurie?: string) =>
  contratsSponsoring(m).filter((c) => couvre(c, annee) && (!idEcurie || c.ecurie === idEcurie));

/**
 * Audit de la phase 7 (priorité 1) — source commune des engagements d'un sponsor pour une saison :
 * contrats d'écurie qui la couvrent, et sponsoring personnel d'un pilote (qui paie le pilote lui-même).
 * Un sponsor engagé ne peut pas s'engager ailleurs : jamais deux fois le même budget.
 */
export function sponsorsEngages(monde: Monde, annee: number): Set<string> {
  const res = new Set(contratsActifs(monde, annee).map((c) => c.sponsor));
  // Phase 11c : un sponsor dont l'offre attend la réponse du joueur est réservé.
  for (const o of offresSponsors(monde)) if (o.annee === annee) res.add(o.sponsor);
  for (const p of Object.values(table(monde, TABLES.personnes)) as unknown as { statut: string; sponsorPersonnel?: { sponsor: string; jusqua: number } }[]) {
    if (p.statut !== 'retraite' && p.sponsorPersonnel && p.sponsorPersonnel.jusqua >= annee) res.add(p.sponsorPersonnel.sponsor);
    // D-131 : un engagement conditionnel (junior) réserve aussi le sponsor.
    const eng = (p as { engagementF1?: { sponsor: string; jusqua: number } }).engagementF1;
    if (p.statut !== 'retraite' && eng && eng.jusqua >= annee) res.add(eng.sponsor);
  }
  return res;
}

/** Revenus de sponsoring prévus pour une année (hors primes d'objectif). */
export function revenusSponsors(monde: Monde, idEcurie: string, annee: number): number {
  // Levier B (prototype, variante « additionnelle ») : le groupe qui soutient un pilote paie l'écurie en plus de ses sponsors.
  const fi = (Object.values(table(monde, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === idEcurie);
  const ps = fi?.piloteSoutenu;
  const groupe = ps?.montant && ps.debut !== undefined && ps.jusqua !== undefined && annee >= ps.debut && annee <= ps.jusqua ? ps.montant : 0;
  return contratsActifs(monde, annee, idEcurie).reduce((a, c) => a + c.montantAnnuelMEUR, 0) + groupe;
}

/* ---------------------------------------------------------------- Conjoncture */

interface Conjoncture { id: 'conj'; valeur: number; annee: number }
export function conjoncture(monde: Monde): number {
  return (table(monde, TABLES.conjoncture)['conj'] as unknown as Conjoncture | undefined)?.valeur ?? 1;
}
/** Marche aléatoire annuelle bornée, avec rappel vers 1 (cycles économiques). */
function evoluerConjoncture(monde: Monde, annee: number): void {
  const t = table(monde, TABLES.conjoncture);
  const c = (t['conj'] as unknown as Conjoncture | undefined) ?? { id: 'conj', valeur: 1, annee: annee - 1 };
  if (c.annee >= annee) return;
  const f = flux(monde, 'conjoncture');
  c.valeur = borner(c.valeur + CONJONCTURE.rappel * (1 - c.valeur) + f.normale(0, CONJONCTURE.ecartType), CONJONCTURE.min, CONJONCTURE.max);
  c.annee = annee;
  t['conj'] = c as unknown as Entite;
}

/* ---------------------------------------------------------------- Vivier */

function creerSponsor(monde: Monde, annee: number): Sponsor {
  const ref = table(monde, TABLE_REFERENTIEL)['referentiel'] as unknown as Referentiel | undefined;
  const f = flux(monde, 'sponsors');
  const id = nouvelIdentifiant(monde, 'spo');
  const secteurs = ref?.secteurs ?? [];
  const secteur = secteurs.length ? f.choisirPondere(secteurs, secteurs.map((s) => s.poids)) : undefined;
  const pris = new Set(sponsors(monde).map((s) => s.nom));
  let nom = `Partenaire ${id.replace(/^spo_0*/, '')}`;
  const racines = ref?.racinesEntreprises ?? [];
  if (secteur && racines.length) {
    for (let essai = 0; essai < 20; essai++) {
      const n = `${f.choisir(racines)} ${f.choisir(secteur.suffixes)}`;
      if (!pris.has(n)) { nom = n; break; }
    }
  }
  const nats = ref?.nationalites.filter((n) => n.poids > 0) ?? [];
  const budgetMin = secteur?.budgetMinMEUR ?? 5, budgetMax = secteur?.budgetMaxMEUR ?? 40;
  // Budgets asymétriques : beaucoup de petits, quelques très gros (carré du tirage uniforme).
  const u = f.suivant();
  return {
    id, nom, secteur: secteur?.secteur ?? 'divers', nationalite: nats.length ? f.choisirPondere(nats, nats.map((n) => n.poids)).code : 'GBR',
    budgetMEUR: arrondi(budgetMin + u * u * (budgetMax - budgetMin)), image: f.choisir(IMAGES),
    fidelite: Math.round(borner(f.normale(10.5, 3.5), 1, 20)), exigence: Math.round(borner(f.normale(10.5, 3.5), 1, 20)),
    rancunes: [], actif: true, derniereAnneeContrat: annee,
  };
}

/** Crée le vivier de départ s'il n'existe pas encore (construction du monde, ou sauvegarde migrée). */
export function initialiserSponsors(monde: Monde): void {
  if (Object.keys(table(monde, TABLES.sponsors)).length) return;
  for (let i = 0; i < VIVIER_SPONSORS.initial; i++) {
    const s = creerSponsor(monde, monde.date.annee);
    table(monde, TABLES.sponsors)[s.id] = s as unknown as Entite;
  }
}

/** Départs des sponsors restés longtemps sans contrat, arrivées de nouvelles entreprises (volume borné). */
function renouvelerVivier(monde: Monde, annee: number): void {
  const engages = sponsorsEngages(monde, annee);
  for (const s of sponsors(monde)) {
    if (!s.actif || engages.has(s.id) || contratsSponsoring(monde).some((c) => c.sponsor === s.id && c.statut === 'actif')) continue;
    if (annee - s.derniereAnneeContrat >= VIVIER_SPONSORS.anneesSansContratAvantDepart && tirageLocal(monde, 'sponsor.depart', s.id, annee).chance(VIVIER_SPONSORS.probabiliteDepart)) {
      s.actif = false;
    }
    s.rancunes = s.rancunes.filter((r) => r.jusqua >= annee);
  }
  // Volume borné : les sponsors inactifs sans contrat sont effacés (les contrats terminés gardent leur identifiant).
  const t = table(monde, TABLES.sponsors);
  for (const s of sponsors(monde)) {
    if (!s.actif && !engages.has(s.id) && !contratsSponsoring(monde).some((c) => c.sponsor === s.id && c.fin >= annee - 5)) delete t[s.id];
  }
  // Les entreprises liées à un pilote (phase 7c) ne comptent pas dans le vivier général (elles ne sponsorisent que leur pilote).
  const actifs = sponsors(monde).filter((s) => s.actif && !s.lie).length;
  const n = Math.min(VIVIER_SPONSORS.arriveesParAn, Math.max(0, VIVIER_SPONSORS.maximum - actifs));
  for (let i = 0; i < n; i++) {
    const s = creerSponsor(monde, annee);
    t[s.id] = s as unknown as Entite;
  }
  // Les contrats terminés depuis longtemps sont effacés (volume borné ; les bilans annuels gardent les montants).
  const tc = table(monde, TABLES.contratsSponsoring);
  for (const c of contratsSponsoring(monde)) if (c.statut !== 'actif' && c.fin < annee - 5) delete tc[c.id];
}

/* ---------------------------------------------------------------- Attrait et offres */

function rangPrecedentClassement(monde: Monde, idEcurie: string, annee: number): number | undefined {
  const s = table(monde, TABLES.saisons)[`ssn_${annee}`] as unknown as Saison | undefined;
  if (!s?.termine) return undefined;
  const i = s.constructeurs.findIndex((c) => c.ecurie === idEcurie);
  return i >= 0 ? i + 1 : undefined;
}

/** Attrait d'une écurie pour un sponsor, entre 0 et 1 (informations publiques seulement). */
export function attrait(monde: Monde, e: Ecurie, s: Sponsor): number {
  const w = POIDS_ATTRAIT[s.image] ?? POIDS_ATTRAIT['prestige']!;
  const marketing = (Object.values(table(monde, TABLES.departements)) as unknown as Departement[]).find((d) => d.ecurie === e.id && d.type === 'marketing');
  const pilotes = pilotesTitulaires(monde).filter((p: Personne) => p.ecurie === e.id);
  const nat = e.nationalite === s.nationalite || pilotes.some((p) => p.nationalite === s.nationalite) ? 1 : 0;
  return borner(
    w.popularite * (e.popularite / 20) + w.prestige * (e.prestige / 20) + w.resultats * forceEcurie(monde, e.id)
      + w.marketing * ((marketing?.niveauMoyen ?? 10) / 20) + w.nationalite * nat
      // Phase 7c (D-096) : motivations diversifiées — popularité des pilotes, jeune espoir.
      + attraitPilotes(monde, e)
      // Phase 11 : une écurie mal vue fait fuir les sponsors, une écurie appréciée les attire.
      + attraitImage(e),
    0, 1,
  );
}

function rangPourMontant(montant: number): RangSponsor {
  return montant >= SEUILS_RANG_SPONSOR.titre ? 'titre' : montant >= SEUILS_RANG_SPONSOR.principal ? 'principal' : 'secondaire';
}

export function emplacementsLibres(monde: Monde, idEcurie: string, annee: number): Record<RangSponsor, number> {
  const occ = contratsActifs(monde, annee, idEcurie);
  const libres = {} as Record<RangSponsor, number>;
  for (const r of RANGS) libres[r] = (EMPLACEMENTS_SPONSORS[r] ?? 0) - occ.filter((c) => c.rang === r).length;
  return libres;
}

function montantOffre(monde: Monde, s: Sponsor, a: number): number {
  return s.budgetMEUR * conjoncture(monde) * OFFRE_SPONSOR.partEngagee * (OFFRE_SPONSOR.min + OFFRE_SPONSOR.amplitude * a);
}

/** Objectif de classement du contrat prudent (celui d'avant la refonte) : dernier rang, plus la tolérance du sponsor. */
function objectifPrudent(monde: Monde, s: Sponsor, e: Ecurie, annee: number): number {
  const rangActuel = rangPrecedentClassement(monde, e.id, annee - 1) ?? Math.round(1 + (1 - forceEcurie(monde, e.id)) * (ecuriesActives(monde).length - 1));
  const tolerance = Math.round((20 - s.exigence) / 5); // un sponsor exigeant ne tolère aucun recul
  // Audit 5.11 : jamais le dernier rang (« finir dernier ou mieux » serait un cadeau certain).
  return borner(rangActuel + tolerance, 1, Math.max(1, ecuriesActives(monde).length - 1));
}

/**
 * Phase 11c : variantes qu'un sponsor propose pour un emplacement (la prudente seule pour un emplacement secondaire).
 * Chiffrées d'après le rang attendu public de l'écurie et le budget F1 du sponsor (engagement ferme).
 */
export function variantesPour(monde: Monde, s: Sponsor, e: Ecurie, rang: RangSponsor, montant: number, annee: number): VarianteOffre[] {
  const toutes = construireVariantes({
    montantMEUR: montant, partPrime: OFFRE_SPONSOR.primeObjectif, objectifRang: objectifPrudent(monde, s, e, annee),
    rangAttendu: rangAttenduPublic(monde, e.id), ecuries: ecuriesActives(monde).length, grandsPrix: nombreGrandsPrix(monde),
    rangDernier: rangPrecedentClassement(monde, e.id, annee - 1), image: s.image, budgetF1MEUR: s.budgetMEUR * conjoncture(monde), titre: rang === 'titre',
  });
  return rang === 'secondaire' ? toutes.slice(0, 1) : toutes;
}

/**
 * Phase 11c : choix d'une variante par l'équipe (IA, domaine commercial délégué, repli à l'échéance). L'écurie compare ce qu'elle
 * sait de sa propre voiture au rang que le marché attend d'elle : elle ne parie que si elle se croit sous-estimée (et selon le goût
 * du risque de son team principal). Pas de stratégie universelle : sans raison de se croire meilleure, elle reste prudente.
 */
export function choisirVarianteEquipe(monde: Monde, e: Ecurie, variantes: VarianteOffre[]): VarianteOffre {
  // Réglage d'expérience (mesures de la phase 11c, sans effet en partie) : 1 = toujours prudente, 2 = toujours audacieuse.
  const force = parametre(monde, 'experience.sponsoring.variante', 0);
  if (force === 1) return variantes[0]!;
  if (force === 2) return variantes.find((v) => v.variante === 'audacieuse') ?? variantes.find((v) => v.variante === 'equilibree') ?? variantes[0]!;
  const risque = teamPrincipal(monde, e.id)?.traits['risque'] ?? 10;
  const score = rangAttenduPublic(monde, e.id) - rangVoiture(monde, e.id) + (risque - 10) / CHOIX_EQUIPE.diviseurRisque;
  const voulue = score >= CHOIX_EQUIPE.seuilAudacieuse ? 'audacieuse' : score >= CHOIX_EQUIPE.seuilEquilibree ? 'equilibree' : 'prudente';
  return variantes.find((v) => v.variante === voulue) ?? variantes.find((v) => v.variante === 'equilibree' && voulue === 'audacieuse') ?? variantes[0]!;
}

export function signerSponsor(monde: Monde, s: Sponsor, e: Ecurie, rang: RangSponsor, montant: number, annee: number, renouvellement: boolean, variante?: VarianteOffre, causes: string[] = []): ContratSponsoring {
  const v = variante ?? variantesPour(monde, s, e, rang, montant, annee)[0]!;
  const f = tirageLocal(monde, 'sponsor.contrat', s.id, e.id, annee);
  const duree = borner(Math.round(DUREE_CONTRAT_SPONSOR.min + (s.fidelite / 20) * (DUREE_CONTRAT_SPONSOR.max - DUREE_CONTRAT_SPONSOR.min) + f.normale(0, 0.7)), DUREE_CONTRAT_SPONSOR.min, DUREE_CONTRAT_SPONSOR.max);
  const c: ContratSponsoring = {
    id: nouvelIdentifiant(monde, 'csp'), sponsor: s.id, ecurie: e.id, rang, montantAnnuelMEUR: arrondi(v.fixeMEUR),
    variante: v.variante, clauses: v.clauses.map((x) => ({ ...x })), ...(v.enveloppeGPMEUR ? { enveloppeGPMEUR: v.enveloppeGPMEUR } : {}), primesVerseesMEUR: 0,
    clauseSortie: s.exigence >= 12, debut: annee, fin: annee + duree - 1, statut: 'actif', satisfaction: SATISFACTION_SPONSOR.initiale,
  };
  table(monde, TABLES.contratsSponsoring)[c.id] = c as unknown as Entite;
  s.derniereAnneeContrat = c.fin;
  ajouterEvenement(monde, {
    type: renouvellement ? 'sponsor.renouvellement' : 'sponsor.signature', acteurs: [{ id: e.id, role: 'ecurie' }, { id: s.id, role: 'sponsor' }],
    importance: rang === 'titre' ? 3 : 1, visibilite: 'public', causes,
    contexte: { rang, montant: c.montantAnnuelMEUR, duree, variante: c.variante, clauses: c.clauses.length, enveloppeGP: c.enveloppeGPMEUR ?? 0 },
    texte: rang === 'titre' ? `${s.nom} devient le sponsor titre de ${e.nom} (${c.montantAnnuelMEUR} M€ par an de fixe, ${duree} an${duree > 1 ? 's' : ''}).` : undefined,
  });
  return c;
}

/**
 * Phase 11c : un sponsor a choisi une écurie. Pour l'écurie du joueur (domaine commercial non délégué), un emplacement titre ou
 * principal donne une offre à laquelle il répond ; sinon, l'équipe signe la variante de son choix (mêmes règles que l'IA).
 */
export function conclure(monde: Monde, s: Sponsor, e: Ecurie, rang: RangSponsor, montant: number, annee: number, renouvellement: boolean): ContratSponsoring | OffreSponsor | undefined {
  const variantes = variantesPour(monde, s, e, rang, montant, annee);
  if (rang !== 'secondaire' && !iaDecide(e, 'commercial')) {
    const deja = offresSponsors(monde, e.id).filter((o) => o.rang === rang && o.annee === annee).length;
    if (deja >= emplacementsLibres(monde, e.id, annee)[rang] + OFFRES_JOUEUR.offresEnPlus) return undefined;
    const o: OffreSponsor = {
      id: nouvelIdentifiant(monde, 'osp'), sponsor: s.id, ecurie: e.id, rang, annee, renouvellement,
      echeance: ajouterSemaines(monde.date, OFFRES_JOUEUR.delaiSemaines), variantes,
    };
    table(monde, TABLES.offresSponsors)[o.id] = o as unknown as Entite;
    ajouterEvenement(monde, {
      type: 'sponsor.offre', acteurs: [{ id: s.id, role: 'auteur' }, { id: e.id, role: 'cible' }], importance: 2, visibilite: 'prive', connuPar: [e.id],
      contexte: { offre: o.id, rang, variantes: variantes.length, renouvellement },
      texte: `${s.nom} propose ${renouvellement ? 'de renouveler son contrat' : `un contrat de sponsor ${rang === 'titre' ? 'titre' : 'principal'}`} (${variantes.length} variante${variantes.length > 1 ? 's' : ''}).`,
    });
    return o;
  }
  return signerSponsor(monde, s, e, rang, montant, annee, renouvellement, choisirVarianteEquipe(monde, e, variantes));
}

/* ---------------------------------------------------------------- Bilan de saison (semaine 1, année écoulée) */

/**
 * Évalue les contrats de l'année écoulée : clauses (primes), satisfaction, ruptures, renouvellements.
 * Les primes sont inscrites dans les comptes de l'année écoulée (avant la clôture).
 * Phase 11c : une clause ratée déçoit en proportion de la probabilité que le sponsor lui accordait (la prudente : comme avant).
 */
export function evaluerSponsors(monde: Monde, annee: number, financesDe: (id: string) => Finances | undefined): void {
  for (const c of contratsActifs(monde, annee)) {
    const s = table(monde, TABLES.sponsors)[c.sponsor] as unknown as Sponsor | undefined;
    const e = table(monde, TABLES.ecuries)[c.ecurie] as unknown as Ecurie | undefined;
    const fi = financesDe(c.ecurie);
    if (!s || !e || !fi) continue;
    const b = bilanSaison(monde, annee, e.id);
    if (b.rang === undefined) continue;
    const n = Math.max(1, c.clauses.length);
    let delta = 0, manquee = false;
    const tenues: string[] = [];
    for (const cl of c.clauses) {
      cl.atteinte = clauseTenue(cl, b);
      if (cl.atteinte) {
        delta += SATISFACTION_SPONSOR.gainObjectif / n;
        fi.comptes.sponsors += cl.primeMEUR;
        fi.tresorerieMEUR += cl.primeMEUR;
        c.primesVerseesMEUR = arrondi(c.primesVerseesMEUR + cl.primeMEUR);
        tenues.push(`${cl.type} (${cl.primeMEUR} M€)`);
      } else {
        manquee = true;
        const ecart = cl.type === 'rang' || cl.type === 'progression' ? Math.max(0, b.rang - cl.seuil) : 0;
        const f = c.variante === 'prudente' ? 1 : Math.min(1, cl.probabilite / SATISFACTION_CLAUSES.probaReference);
        delta -= ((SATISFACTION_SPONSOR.perteBase + SATISFACTION_SPONSOR.pertePlace * ecart) * f) / n;
      }
    }
    c.satisfaction = borner(c.satisfaction + delta, 0, 100);
    if (tenues.length && (e.pilotee || c.variante !== 'prudente')) {
      ajouterEvenement(monde, {
        type: 'sponsor.prime', acteurs: [{ id: s.id, role: 'auteur' }, { id: e.id, role: 'cible' }], importance: c.variante === 'prudente' ? 1 : 2, visibilite: 'prive', connuPar: [e.id],
        contexte: { contrat: c.id, annee, variante: c.variante, montant: arrondi(c.clauses.filter((x) => x.atteinte).reduce((a, x) => a + x.primeMEUR, 0)) },
        texte: `${s.nom} verse ses primes à ${e.nom} : ${tenues.join(', ')}.`,
      });
    }
    if (manquee && c.clauseSortie && c.fin > annee && c.satisfaction < SATISFACTION_SPONSOR.seuilRupture) {
      c.statut = 'rompu';
      c.fin = annee;
      s.rancunes.push({ ecurie: e.id, jusqua: annee + RANCUNE_SPONSOR_ANNEES });
      ajouterEvenement(monde, {
        type: 'sponsor.depart', acteurs: [{ id: s.id, role: 'auteur' }, { id: e.id, role: 'cible' }], importance: c.rang === 'titre' ? 3 : 2, visibilite: 'public',
        contexte: { rang: b.rang, montant: c.montantAnnuelMEUR, variante: c.variante }, texte: `${s.nom} quitte ${e.nom} : objectifs manqués (${b.rang}e du championnat).`,
      });
      continue;
    }
    if (c.fin === annee) {
      c.statut = 'termine';
      const f = tirageLocal(monde, 'sponsor.renouvellement', c.id, annee);
      // Phase 7c : un contrat lié à un pilote (sponsor personnel) n'est pas renouvelé ici : il suit le pilote (systems/marche/commercial).
      if (!c.pilote && c.satisfaction >= SATISFACTION_SPONSOR.seuilRenouvellement && f.chance(0.3 + s.fidelite / 30) && s.actif) {
        const libres = emplacementsLibres(monde, e.id, annee + 1);
        if (libres[c.rang] > 0) conclure(monde, s, e, c.rang, montantOffre(monde, s, attrait(monde, e, s)), annee + 1, true);
      } else if (c.satisfaction < SATISFACTION_SPONSOR.seuilRenouvellement) {
        s.rancunes.push({ ecurie: e.id, jusqua: annee + 1 });
      }
    }
  }
}

/* ---------------------------------------------------------------- Marché (semaine 1) */

/** Meilleure écurie pour un sponsor libre (emplacement disponible, pas de concurrent de son secteur, pas de rancune). */
export function meilleurPlacement(monde: Monde, s: Sponsor, annee: number, exclure?: string): { e: Ecurie; a: number; rang: RangSponsor; montant: number } | undefined {
  let meilleur: { e: Ecurie; a: number; rang: RangSponsor; montant: number } | undefined;
  for (const e of ecuriesActives(monde)) {
    if (e.id === exclure) continue;
    if (s.rancunes.some((r) => r.ecurie === e.id && r.jusqua >= annee)) continue;
    const actifs = contratsActifs(monde, annee, e.id);
    if (actifs.some((c) => (table(monde, TABLES.sponsors)[c.sponsor] as unknown as Sponsor | undefined)?.secteur === s.secteur)) continue; // exclusivité de secteur
    // Audit 5.5 : les offres encore en attente comptent aussi (écurie du joueur : elle signe après la semaine 1).
    if ((Object.values(table(monde, TABLES.offresSponsors)) as unknown as OffreSponsor[]).some((o) => o.ecurie === e.id && o.annee === annee && o.sponsor !== s.id
      && (table(monde, TABLES.sponsors)[o.sponsor] as unknown as Sponsor | undefined)?.secteur === s.secteur)) continue;
    const a = borner(attrait(monde, e, s) + tirageLocal(monde, 'sponsor.choix', s.id, annee, e.id).normale(0, ALEA_CHOIX_SPONSOR), 0, 1);
    let montant = montantOffre(monde, s, a);
    const libresE = emplacementsLibres(monde, e.id, annee);
    let rang: RangSponsor | undefined = rangPourMontant(montant);
    // Pas d'emplacement à ce rang : le sponsor accepte un rang inférieur, avec un montant ramené à ce rang.
    for (let i = RANGS.indexOf(rang); i < RANGS.length && rang; i++) {
      const r = RANGS[i]!;
      if (libresE[r] > 0) { rang = r; break; }
      if (i === RANGS.length - 1) rang = undefined;
    }
    if (!rang) continue;
    if (rang === 'principal') montant = Math.min(montant, SEUILS_RANG_SPONSOR.titre - 0.1);
    if (rang === 'secondaire') montant = Math.min(montant, SEUILS_RANG_SPONSOR.principal - 0.1);
    if (!meilleur || a > meilleur.a) meilleur = { e, a, rang, montant };
  }
  return meilleur;
}

export function marcheSponsors(monde: Monde, annee: number): void {
  evoluerConjoncture(monde, annee);
  renouvelerVivier(monde, annee);
  const sousContrat = sponsorsEngages(monde, annee);
  const libres = sponsors(monde).filter((s) => s.actif && !s.lie && !sousContrat.has(s.id)).sort((a, b) => b.budgetMEUR - a.budgetMEUR || (a.id < b.id ? -1 : 1));
  for (const s of libres) {
    const m = meilleurPlacement(monde, s, annee);
    // Phase 11c : si l'écurie du joueur ne peut plus recevoir d'offre à ce rang, le sponsor va à l'écurie suivante.
    if (m && !conclure(monde, s, m.e, m.rang, m.montant, annee, false)) {
      const autre = meilleurPlacement(monde, s, annee, m.e.id);
      if (autre) conclure(monde, s, autre.e, autre.rang, autre.montant, annee, false);
    }
  }
}
