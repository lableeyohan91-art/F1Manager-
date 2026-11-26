/**
 * Phase 12a — conception des pièces (docs/systemes/phase-12-conception-detaillee.md §2, §4.3, §6, §10.2 ; D-170).
 *
 * - Frontière : efficacité maximale atteignable par une écurie sur une pièce, fixée par le règlement (borne absolue), son savoir
 *   (phase 8, rendement décroissant) et l'architecture choisie (pari de concept aux grandes réformes).
 * - Projets : durées et coûts de F1 Manager 2024 (rythme normal, sans événement en 12a), capacité des pôles, exécution incertaine,
 *   fabrication puis installation si le responsable estime la nouvelle version meilleure.
 * - Intersaison et réformes : reconception ABSOLUE (jamais relative à la moyenne de la grille).
 * - IA (et directeur technique en délégation) : mêmes commandes, décisions d'après le temps au tour estimé sur les circuits à venir.
 */

import {
  DOMAINES_SOUFFLERIE, EFFICACITE_REFERENCE, IA_ERREURS, PAQUETS, EVENEMENTS_CONCEPTION, FAMILLES_ARCHITECTURE, FATIGUE, FRONTIERE, IA_RYTHME, RYTHMES, IA_CONCEPTION, INTERSAISON, PAYSAGE, PIECES, PROJETS, RECONCEPTION, SOUFFLERIE, TYPES_PIECES, type TypePiece,
} from '../../balance/monoplaces';
import { USURE_SUCCES } from '../../balance/marche';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement } from '../../core/evenements';
import { idsTries, parametre, table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal } from '../../core/moteur';

type Commander = (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => unknown;
import {
  TABLES, type Circuit, type Departement, type DilemmeTechnique, type Ecurie, type Finances, type GrandPrix, type Installation, type PieceVoiture, type Personne, type ProjetConception, type Reglement,
} from '../../model/types';
import { partRecherche, programmes, reglementAnnonce, reglementEnVigueur, savoir, savoirApplicable, savoirExistant } from '../technique/acces';
import { repartirSoufflerie } from './soufflerie';
import { depenser, enveloppeRestante } from './depenses';
import { chargePole, departementPole, evoluerFatigue, facteurProductivite, fatiguePole, fraicheur, partIngenieurs, probaIncident, rythmeDe, type Pole } from './fatigue';
import { COHESION_DEPARTEMENT, ESSAIS_RENFORCES, FIABILITE_DEPARTEMENT, INGENIEURS, PRODUCTION, PROJETS_PAR_POLE } from '../../balance/capacites';
import { facteurDetection, niveauUtile } from '../economie/capacites';
import { alertesResponsables, creerDilemme, dilemmes, echeancesDilemmes, resoudre, responsable, stresser } from './dilemmes';
import { presenterEvenement, tirerEvenement } from './evenements';
import { rangSemaine } from '../../core/calendrier';
export { depenser, enveloppeRestante } from './depenses';
import { IA_RECHERCHE, SAVOIR } from '../../balance/technique';
import { forceEcurie, usureSucces } from '../humain/decision';
import { ecartTempsPct, effetPiece, invaliderVoitures, parametresVoiture, piecesInstallees, type ParametresVoiture } from './physique';
import { ajouterPiece, installer, versions } from './pieces';

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const r2 = (x: number) => Math.round(x * 100) / 100;
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const ecurieDe = (m: Monde, id: string) => table(m, TABLES.ecuries)[id] as unknown as Ecurie | undefined;
const financesDe = (m: Monde, id: string) => (Object.values(table(m, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === id);

/* ===================================================================== Savoir, architecture, frontière */

/** Savoir applicable moyen des domaines d'une pièce, sous un règlement. */
export function savoirPiece(monde: Monde, idEcurie: string, type: TypePiece, r: Reglement | undefined): number {
  const d = PIECES[type].domaines;
  // Changement d'ère : sous une grande réforme, pour les pièces qu'elle touche, le savoir de fond ne compte qu'en partie ; c'est la
  // recherche menée SUR ce règlement qui fait la différence (D-128 : obsolescence partielle ; fiche §10.2).
  const reforme = !!r && r.orientation !== 'initial' && pieceTouchee(r, type);
  return d.reduce((a, x) => {
    if (!reforme) return a + savoirApplicable(monde, idEcurie, x, r?.id);
    const s = savoirExistant(monde, idEcurie, x);
    return a + (s?.parReglement[r!.id] ?? 0) + FRONTIERE.partFondamentalReforme * (s?.fondamental ?? 0);
  }, 0) / d.length;
}

/** Paysage caché d'une grande réforme : familles d'architecture et pénalité de chacune (la meilleure : 0). Déterministe (graine). */
export function paysage(monde: Monde, r: Reglement): { familles: string[]; penalites: Record<string, number> } {
  const noms = FAMILLES_ARCHITECTURE[r.orientation];
  if (!noms) return { familles: [], penalites: {} };
  const f = tirageLocal(monde, 'monoplaces.paysage', r.id);
  const n = Math.min(noms.length, f.entier(PAYSAGE.famillesMin, PAYSAGE.famillesMax));
  const familles = noms.slice(0, n);
  const meilleure = f.entier(0, n - 1);
  const penalites: Record<string, number> = {};
  familles.forEach((x, i) => { penalites[x] = i === meilleure ? 0 : r3(PAYSAGE.penaliteMin + f.suivant() * (PAYSAGE.penaliteMax - PAYSAGE.penaliteMin)); });
  return { familles, penalites };
}

/** Une pièce est-elle touchée par l'architecture de ce règlement ? */
export function pieceTouchee(r: Reglement, type: TypePiece): boolean {
  return PIECES[type].domaines.some((d) => (r.intensites[d] ?? 0) >= PAYSAGE.intensiteTouchee);
}

function directeurTechnique(monde: Monde, idEcurie: string): Personne | undefined {
  return (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === idEcurie && p.poste === 'directeur_technique');
}

/**
 * Pénalités PERÇUES par une écurie (même information pour le joueur et l'IA) : vérité + bruit propre à l'écurie, qui se resserre avec
 * le savoir propre à ce règlement (recherche orientée vers lui, phase 8) et la vision technique du directeur technique. Le tirage de l'erreur est fixe : seule son ampleur
 * diminue quand on apprend (pas de relance possible).
 */
export function paysagePercu(monde: Monde, idEcurie: string, r: Reglement): Record<string, number> {
  const { familles, penalites } = paysage(monde, r);
  // Seule la recherche menée SUR ce règlement (savoir propre au règlement, phase 8) éclaire le pari : le savoir fondamental, partagé par
  // toutes les grandes écuries, ne dit rien de l'architecture qui conviendra aux nouvelles règles (sinon tout le monde devine juste).
  const touchees = TYPES_PIECES.filter((t) => pieceTouchee(r, t));
  const savoirPrepare = touchees.reduce((a, t) => a + PIECES[t].domaines.reduce((b, d) => b + (savoirExistant(monde, idEcurie, d)?.parReglement[r.id] ?? 0), 0) / PIECES[t].domaines.length, 0) / Math.max(1, touchees.length);
  const vision = directeurTechnique(monde, idEcurie)?.competences['visionTechnique'] ?? 10;
  const sigma = PAYSAGE.bruitBase * Math.exp(-savoirPrepare / PAYSAGE.echelleSavoirIndice) * Math.max(0.2, PAYSAGE.visionBase - vision / 20);
  const res: Record<string, number> = {};
  for (const x of familles) res[x] = r3(Math.max(0, penalites[x]! + sigma * tirageLocal(monde, 'monoplaces.indice', idEcurie, r.id, x).normale(0, 1)));
  return res;
}

/** Pénalité réelle d'architecture d'une écurie pour une pièce sous un règlement (0 sans architecture ou pièce non touchée). */
export function penaliteArchitecture(monde: Monde, e: Ecurie, type: TypePiece, r: Reglement | undefined): number {
  if (!r || !pieceTouchee(r, type)) return 0;
  const famille = e.architectures?.[r.id];
  return famille ? paysage(monde, r).penalites[famille] ?? 0 : 0;
}

/** Frontière (efficacité maximale atteignable) d'une écurie pour une pièce, sous le règlement donné (par défaut, celui en vigueur). */
export function frontiere(monde: Monde, e: Ecurie, type: TypePiece, r: Reglement | undefined = reglementEnVigueur(monde)): number {
  const s = savoirPiece(monde, e.id, type, r);
  return FRONTIERE.min + FRONTIERE.etendue * (1 - Math.exp(-s / FRONTIERE.echelleSavoir)) * (1 - penaliteArchitecture(monde, e, type, r));
}

/* ===================================================================== Capacité et qualité */

const INSTALLATIONS_POLE: Record<Pole, string[]> = { aero: ['soufflerie', 'cfd'], conception: ['bureau_etudes', 'simulateur'] };
const COMPETENCE_POLE: Record<Pole, { poste: string; competence: string }> = { aero: { poste: 'responsable_aero', competence: 'aerodynamique' }, conception: { poste: 'responsable_conception', competence: 'conception' } };

function departement(monde: Monde, idEcurie: string, pole: Pole): Departement | undefined {
  return (Object.values(table(monde, TABLES.departements)) as unknown as Departement[]).find((d) => d.ecurie === idEcurie && d.type === pole);
}

/** Projets simultanés possibles dans un pôle (effectif / taille d'équipe, borné). */
export function emplacements(_monde: Monde, _idEcurie: string, _pole: Pole): number {
  // D-181 : même nombre pour toutes les écuries ; l'effectif agit sur la vitesse des projets (facteurIngenieurs).
  return PROJETS_PAR_POLE;
}

/** D-181 : facteur de vitesse d'un projet selon les ingénieurs du pôle qui y travaillent (rendement décroissant). */
export function facteurIngenieurs(monde: Monde, p: ProjetConception): number {
  const pole = PIECES[p.type as TypePiece].pole as Pole;
  const effectif = departement(monde, p.ecurie, pole)?.effectif ?? INGENIEURS.reference;
  const affectes = effectif * partIngenieurs(projets(monde, p.ecurie), p);
  return borner((affectes / INGENIEURS.reference) ** INGENIEURS.exposant, INGENIEURS.vitesseMin, INGENIEURS.vitesseMax);
}

/** D-181 : cohésion d'un département rapportée à sa valeur habituelle (intégration des recrues, licenciements). */
export function facteurCohesion(d: Departement | undefined): number {
  if (!d) return 1;
  const ecart = d.cohesion - (d.cohesionHabituelle ?? d.cohesion);
  return borner(1 + COHESION_DEPARTEMENT.effetParPoint * ecart, COHESION_DEPARTEMENT.facteurMin, COHESION_DEPARTEMENT.facteurMax);
}

/** D-181 : vitesse de fabrication selon l'effectif du département production. */
export function facteurProduction(monde: Monde, idEcurie: string): number {
  const d = (Object.values(table(monde, TABLES.departements)) as unknown as Departement[]).find((x) => x.ecurie === idEcurie && x.type === 'production');
  if (!d) return 1;
  return borner((d.effectif / PRODUCTION.reference) ** PRODUCTION.exposant, PRODUCTION.min, PRODUCTION.max) * facteurCohesion(d);
}


/** Productivité d'un pôle (jours de conception par jour de calendrier), installations et usure du succès comprises (D-140). */
export function productivite(monde: Monde, idEcurie: string, pole: Pole): number {
  const niveau = departement(monde, idEcurie, pole)?.niveauMoyen ?? 10;
  const inst = (Object.values(table(monde, TABLES.installations)) as unknown as Installation[]).filter((i) => i.ecurie === idEcurie && INSTALLATIONS_POLE[pole].includes(i.type));
  // D-181 : rendement décroissant des installations au-dessus du seuil ; cohésion du département.
  const niv = inst.length ? inst.reduce((a, i) => a + niveauUtile(i.niveau), 0) / inst.length : 5;
  return (PROJETS.productiviteBase + (PROJETS.productiviteNiveau * niveau) / 20) * (PROJETS.installationBase + PROJETS.installationParNiveau * (niv - 5)) * facteurCohesion(departement(monde, idEcurie, pole));
}

/** Compétence de conception (sur 20) d'une écurie pour un pôle : directeur technique et responsable du pôle, motivation comprise. */
function competence(monde: Monde, idEcurie: string, pole: Pole): number {
  const { poste, competence: comp } = COMPETENCE_POLE[pole];
  const equipe = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).filter((p) => p.statut === 'actif' && p.ecurie === idEcurie && (p.poste === poste || p.poste === 'directeur_technique'));
  if (!equipe.length) return 10;
  // Motivation (phase 4) et usure du succès des cadres (D-140, équilibrage volontaire) : comme la capacité de développement précédente.
  return equipe.reduce((a, p) => a + (p.competences[comp] ?? 10) * (0.7 + 0.6 * (p.etat.motivation / 100)) * (1 - USURE_SUCCES.effetDeveloppement * usureSucces(monde, p).usure), 0) / equipe.length;
}

/** Corrélation (sur 20) du responsable du pôle : précision de l'estimation. */
function correlation(monde: Monde, idEcurie: string, pole: Pole): number {
  const p = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((x) => x.statut === 'actif' && x.ecurie === idEcurie && x.poste === COMPETENCE_POLE[pole].poste);
  return p?.competences['correlation'] ?? 10;
}


/** Part attendue de l'écart à la frontière comblée par un projet (sans l'aléa d'exécution). */
export function progressionAttendue(monde: Monde, e: Ecurie, type: TypePiece): number {
  const pole = PIECES[type].pole as Pole;
  // Phase 12b : le barème selon le classement et la sanction d'un dépassement du plafond passent par les HEURES de soufflerie et de CFD
  // (soufflerie.ts), plus par un coefficient de vitesse.
  // Variante R2 (prototype) : un « paquet » comble une plus grande part de l'écart.
  return Math.min(PAQUETS.progressionMax, PROJETS.progressionBase * parametre(monde, 'conception.progression', 1) * facteurPaquet(monde) * Math.sqrt(competence(monde, e.id, pole) / PROJETS.competenceReference));
}

/* ===================================================================== Estimation par circuit */

/** Circuits sur lesquels juger une voiture : Grands Prix restants de la saison, sinon le vivier (ou tous les circuits). */
export function circuitsAVenir(monde: Monde): Circuit[] {
  const gps = (Object.values(table(monde, TABLES.grandsPrix)) as unknown as GrandPrix[]).filter((g) => g.saison === monde.date.annee && !g.termine);
  const tc = table(monde, TABLES.circuits);
  const parGp = gps.map((g) => tc[g.circuit] as unknown as Circuit).filter((c) => !!c);
  if (parGp.length) return parGp;
  const tous = Object.values(tc) as unknown as Circuit[];
  const vivier = tous.filter((c) => c.vivier);
  return vivier.length ? vivier : tous;
}

/** Écart moyen de temps au tour (%) d'une voiture de paramètres donnés sur une liste de circuits. */
export function ecartMoyen(p: ParametresVoiture, circuits: Circuit[]): number {
  return circuits.length ? circuits.reduce((a, c) => a + ecartTempsPct(p, c), 0) / circuits.length : 0;
}

/** Paramètres de la voiture si une pièce était remplacée par une autre (efficacité, concept). */
export function avecPiece(monde: Monde, e: Ecurie, type: TypePiece, efficacite: number, concept: number, base?: ParametresVoiture): ParametresVoiture {
  const p = { ...(base ?? parametresVoiture(monde, e)) };
  const actuelle = piecesInstallees(monde, e.id).find((x) => x.type === type);
  const retirer = actuelle ? effetPiece(type, actuelle.efficacite, actuelle.concept) : {};
  const ajouter = effetPiece(type, efficacite, concept);
  for (const k of new Set([...Object.keys(retirer), ...Object.keys(ajouter)])) (p as Record<string, number>)[k] = ((p as Record<string, number>)[k] ?? 0) - ((retirer as Record<string, number>)[k] ?? 0) + ((ajouter as Record<string, number>)[k] ?? 0);
  return p;
}

/** Efficacité attendue d'une nouvelle version (concept visé), avant l'aléa d'exécution. */
export function efficaciteAttendue(monde: Monde, e: Ecurie, type: TypePiece, concept: number): number {
  const actuelle = piecesInstallees(monde, e.id).find((x) => x.type === type);
  const base = actuelle?.efficacite ?? EFFICACITE_REFERENCE;
  const f = frontiere(monde, e, type);
  return base + progressionAttendue(monde, e, type) * Math.max(0, f - base) - PROJETS.penaliteConcept * Math.abs(concept - (actuelle?.concept ?? 0));
}

/* ===================================================================== Projets */

export const projets = (monde: Monde, idEcurie?: string) => idsTries(table(monde, TABLES.projetsConception))
  .map((id) => table(monde, TABLES.projetsConception)[id] as unknown as ProjetConception).filter((p) => !idEcurie || p.ecurie === idEcurie);

/** Coût total d'un projet (conception + exemplaires fabriqués). */
export const coutTotal = (type: TypePiece, paquet = 1) => paquet * (PIECES[type].coutProjetMEUR + PROJETS.exemplaires * PIECES[type].coutUnitaireMEUR);
/** Variante R2 (prototype, `conception.paquets`) : facteur de taille des projets (1 = projets ordinaires). */
export const facteurPaquet = (monde: Monde) => parametre(monde, 'conception.paquets', PAQUETS.facteur);

function auteurAutorise(monde: Monde, auteur: string, idEcurie: string): boolean {
  const p = table(monde, TABLES.personnes)[auteur] as unknown as Personne | undefined;
  return !!p && p.statut === 'actif' && p.ecurie === idEcurie && (p.poste === 'team_principal' || p.poste === 'directeur_technique');
}

export function motifRefusProjet(monde: Monde, auteur: string, prm: Record<string, unknown>): string | null {
  const e = ecurieDe(monde, String(prm['ecurie'] ?? ''));
  if (!e || e.statut !== 'active') return 'Écurie inconnue.';
  if (!auteurAutorise(monde, auteur, e.id)) return 'Seuls le team principal et le directeur technique lancent un projet.';
  const type = String(prm['type'] ?? '') as TypePiece;
  if (!(TYPES_PIECES as readonly string[]).includes(type)) return 'Pièce inconnue.';
  const concept = prm['concept'];
  if (typeof concept !== 'number' || !Number.isFinite(concept) || concept < -1 || concept > 1) return 'Concept entre −1 et +1.';
  const enCours = projets(monde, e.id);
  if (enCours.some((p) => p.type === type)) return 'Un projet est déjà en cours sur cette pièce.';
  const pole = PIECES[type].pole as Pole;
  if (enCours.filter((p) => PIECES[p.type as TypePiece].pole === pole && p.fabricationJoursRestants === undefined).length >= emplacements(monde, e.id, pole)) return 'Le pôle n’a plus d’équipe disponible.';
  const essais = prm['essais'];
  if (essais !== undefined && essais !== 'normaux' && essais !== 'renforces') return 'Essais : normaux ou renforcés.';
  if (enveloppeRestante(monde, e.id) < coutTotal(type, facteurPaquet(monde)) + (essais === 'renforces' ? ESSAIS_RENFORCES.surcout * PIECES[type].coutProjetMEUR * facteurPaquet(monde) : 0)) return 'Le budget de développement de l’année ne couvre pas ce projet.';
  return null;
}

/** Lance un projet : coût de conception payé tout de suite (comme dans F1M, pas de remboursement), fabrication payée à la fin. */
export function lancerProjet(monde: Monde, auteur: string, prm: Record<string, unknown>): ProjetConception {
  const idEcurie = String(prm['ecurie']);
  const type = String(prm['type']) as TypePiece;
  const def = PIECES[type];
  const id = `prj_${idEcurie.replace(/^eq_/, '')}_${type}_${monde.date.annee}_${monde.date.semaine}`;
  // D-181 : essais renforcés (plus cher, résultat plus sûr).
  const essais = prm['essais'] === 'renforces';
  const k = facteurPaquet(monde);
  const cout = r2(def.coutProjetMEUR * k * (essais ? 1 + ESSAIS_RENFORCES.surcout : 1));
  const p: ProjetConception = { id, ecurie: idEcurie, type, concept: r2(Number(prm['concept'])), joursRestants: r2(def.conceptionJours * k), joursTotal: r2(def.conceptionJours * k), debut: { ...monde.date }, coutMEUR: cout, ...(essais ? { essaisRenforces: true } : {}) };
  depenser(monde, idEcurie, cout);
  const evt = ajouterEvenement(monde, {
    type: 'conception.lancement', acteurs: [{ id: auteur, role: 'auteur' }, { id: idEcurie, role: 'ecurie' }], importance: 1, visibilite: 'prive',
    contexte: { projet: id, piece: type, concept: p.concept, cout, essaisRenforces: essais },
    texte: `Lancement d'un nouveau projet : ${def.libelle.toLowerCase()} (${p.concept > 0.05 ? def.conceptPlus : p.concept < -0.05 ? def.conceptMoins : 'concept équilibré'}).`,
  });
  p.evenement = evt.id;
  p.rythme = 'normal';
  // Phase 12b : un éventuel événement de conception est tiré une seule fois, au lancement (pas de relance possible).
  tirerEvenement(monde, p);
  table(monde, TABLES.projetsConception)[id] = p as unknown as Entite;
  return p;
}

export function motifRefusAnnulation(monde: Monde, auteur: string, prm: Record<string, unknown>): string | null {
  const p = table(monde, TABLES.projetsConception)[String(prm['projet'] ?? '')] as unknown as ProjetConception | undefined;
  if (!p) return 'Projet inconnu.';
  return auteurAutorise(monde, auteur, p.ecurie) ? null : 'Seuls le team principal et le directeur technique décident d’un projet.';
}

export const commandeLancerProjet: DefinitionCommande = {
  type: 'conception.lancer',
  valider: (monde, c) => motifRefusProjet(monde, c.auteur, c.parametres),
  appliquer: ({ monde }, c) => { lancerProjet(monde, c.auteur, c.parametres); },
};

export const commandeAnnulerProjet: DefinitionCommande = {
  type: 'conception.annuler',
  valider: (monde, c) => motifRefusAnnulation(monde, c.auteur, c.parametres),
  appliquer({ monde }, c) {
    const p = table(monde, TABLES.projetsConception)[String(c.parametres['projet'])] as unknown as ProjetConception;
    delete table(monde, TABLES.projetsConception)[p.id];
    ajouterEvenement(monde, {
      type: 'conception.annulation', acteurs: [{ id: c.auteur, role: 'auteur' }, { id: p.ecurie, role: 'ecurie' }], importance: 1, visibilite: 'prive',
      causes: p.evenement ? [p.evenement] : [], contexte: { projet: p.id, piece: p.type }, texte: `Projet abandonné : ${PIECES[p.type as TypePiece].libelle.toLowerCase()}.`,
    });
  },
};

/** Choix de l'architecture (famille) d'un règlement annoncé ou proposé, pour la nouvelle génération (pari de concept). */
export const commandeArchitecture: DefinitionCommande = {
  type: 'conception.architecture',
  valider(monde, c) {
    const e = ecurieDe(monde, String(c.parametres['ecurie'] ?? ''));
    if (!e || !auteurAutorise(monde, c.auteur, e.id)) return 'Seuls le team principal et le directeur technique choisissent l’architecture.';
    const r = table(monde, TABLES.reglements)[String(c.parametres['reglement'] ?? '')] as unknown as Reglement | undefined;
    if (!r || (r.statut !== 'annonce' && r.statut !== 'propose')) return 'Règlement à venir inconnu.';
    return paysage(monde, r).familles.includes(String(c.parametres['famille'])) ? null : 'Famille d’architecture inconnue pour ce règlement.';
  },
  appliquer({ monde }, c) {
    const e = ecurieDe(monde, String(c.parametres['ecurie']))!;
    (e.architectures ??= {})[String(c.parametres['reglement'])] = String(c.parametres['famille']);
    ajouterEvenement(monde, {
      type: 'conception.architecture', acteurs: [{ id: c.auteur, role: 'auteur' }, { id: e.id, role: 'ecurie' }], importance: 2, visibilite: 'prive',
      contexte: { reglement: String(c.parametres['reglement']), famille: String(c.parametres['famille']) },
    });
  },
};

/** Savoir gagné par un projet (« jours d'expertise ») : propre au règlement, une part au fondamental, rendement décroissant (phase 8). */
function apprendre(monde: Monde, idEcurie: string, type: TypePiece, idReglement: string | undefined, jours: number): void {
  const doms = PIECES[type].domaines;
  for (const d of doms) {
    const s = savoir(monde, idEcurie, d);
    const gain = (SOUFFLERIE.expertiseParJour * jours) / doms.length / (1 + savoirApplicable(monde, idEcurie, d, idReglement) / SAVOIR.rendementK);
    s.fondamental = r3(s.fondamental + gain * SAVOIR.partFondamental);
    if (idReglement) s.parReglement[idReglement] = r3((s.parReglement[idReglement] ?? 0) + gain * (1 - SAVOIR.partFondamental));
    else s.fondamental = r3(s.fondamental + gain * (1 - SAVOIR.partFondamental));
  }
}

/** Part des heures de soufflerie réservée à la recherche (préparation de l'avenir) : même commande pour le joueur et l'IA. */
export const commandeSoufflerie: DefinitionCommande = {
  type: 'conception.soufflerie',
  valider(monde, c) {
    const e = ecurieDe(monde, String(c.parametres['ecurie'] ?? ''));
    if (!e || !auteurAutorise(monde, c.auteur, e.id)) return 'Seuls le team principal et le directeur technique répartissent la soufflerie.';
    const x = c.parametres['partRecherche'];
    return typeof x === 'number' && Number.isFinite(x) && x >= 0 && x <= 1 ? null : 'Part de la recherche entre 0 et 1.';
  },
  appliquer({ monde }, c) {
    const e = ecurieDe(monde, String(c.parametres['ecurie']))!;
    e.souffleriePartRecherche = r2(Number(c.parametres['partRecherche']));
    ajouterEvenement(monde, { type: 'conception.soufflerie', acteurs: [{ id: c.auteur, role: 'auteur' }, { id: e.id, role: 'ecurie' }], importance: 1, visibilite: 'prive', contexte: { partRecherche: e.souffleriePartRecherche } });
  },
};

/** Part de soufflerie visée par l'IA : la préparation de l'avenir si un programme aéro vise un règlement futur. */
function partSouffleriePolitique(monde: Monde, e: Ecurie): number {
  const actuel = reglementEnVigueur(monde)?.id;
  const prepare = programmes(monde, e.id).some((p) => p.statut === 'actif' && (DOMAINES_SOUFFLERIE as readonly string[]).includes(p.domaine) && p.horizon !== 'actuelle' && p.horizon !== 'suivante' && p.horizon !== actuel);
  return prepare ? SOUFFLERIE.partRecherchePreparation : SOUFFLERIE.partRechercheDefaut;
}

/** Fin de conception : qualité réelle tirée (fixée une fois pour toutes), fabrication lancée et payée. */
function terminerConception(monde: Monde, p: ProjetConception): void {
  const e = ecurieDe(monde, p.ecurie);
  if (!e) return;
  const type = p.type as TypePiece;
  const actuelle = piecesInstallees(monde, e.id).find((x) => x.type === type);
  const base = actuelle?.efficacite ?? EFFICACITE_REFERENCE;
  const r = reglementEnVigueur(monde);
  const s = savoirPiece(monde, e.id, type, r);
  const f = tirageLocal(monde, 'monoplaces.conception', p.id);
  // Phase 12b, variantes (CFD) : plusieurs exécutions possibles ; l'équipe garde celle qui PARAÎT la meilleure (prédiction imparfaite,
  // selon la corrélation) : plus de CFD donne en moyenne une meilleure pièce, avec un rendement décroissant.
  const pole = PIECES[type].pole as Pole;
  const n = Math.min(SOUFFLERIE.variantesMax, 1 + Math.floor((p.cfd ?? 0) / SOUFFLERIE.cfdParVariante));
  const sigmaExec = PROJETS.ecartExecution * Math.exp(-s / PROJETS.echelleSavoirExecution) * (p.essaisRenforces ? ESSAIS_RENFORCES.facteurIncertitude : 1);
  const sigmaPred = SOUFFLERIE.ecartPredictionCfd * (1.5 - correlation(monde, e.id, pole) / 20);
  let q = -Infinity, predite = -Infinity;
  for (let i = 0; i < n; i++) {
    const qi = progressionAttendue(monde, e, type) + f.normale(0, sigmaExec);
    const pi = qi + f.normale(0, sigmaPred);
    if (pi > predite) { predite = pi; q = qi; }
  }
  q = Math.max(PROJETS.progressionMin, q);
  // Phase 12b : choix faits pendant le projet (part du gain obtenue, bonus d'une piste ou d'un matériau) et défaut caché de performance.
  const gain = q * Math.max(0, frontiere(monde, e, type) - base) * (p.facteurGain ?? 1) * (p.defaut?.type === 'performance' ? 1 - p.defaut.ampleur : 1);
  p.efficacite = r2(base + gain + (p.bonusEfficacite ?? 0) - PROJETS.penaliteConcept * Math.abs(p.concept - (actuelle?.concept ?? 0)));
  // Phase 12b, expertise : la conception et les essais font gagner du savoir propre au règlement dans les domaines de la pièce.
  apprendre(monde, e.id, type, r?.id, p.joursTotal + SOUFFLERIE.joursParHeure * (p.heures ?? 0) + SOUFFLERIE.joursParUniteCfd * (p.cfd ?? 0));
  p.fabricationJoursRestants = PIECES[type].fabricationJours;
  if (p.echec) {
    // Phase 12b : projet devenu inutilisable (erreurs en cascade d'une équipe épuisée) ; l'expertise reste, l'argent est perdu.
    delete table(monde, TABLES.projetsConception)[p.id];
    ajouterEvenement(monde, {
      type: 'conception.echec', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 2, visibilite: 'prive', causes: p.evenement ? [p.evenement] : [],
      contexte: { projet: p.id, piece: type, incidents: p.incidents ?? 0 }, texte: `Le projet « ${PIECES[type].libelle.toLowerCase()} » est inutilisable : trop d'erreurs accumulées.`,
    });
    return;
  }
  depenser(monde, e.id, PROJETS.exemplaires * PIECES[type].coutUnitaireMEUR * facteurPaquet(monde));
}

/** Fin de fabrication : nouvelle version créée ; installée si le responsable l'estime meilleure (estimation imparfaite). */
function terminerFabrication(monde: Monde, p: ProjetConception): void {
  const e = ecurieDe(monde, p.ecurie);
  delete table(monde, TABLES.projetsConception)[p.id];
  if (!e) return;
  const type = p.type as TypePiece;
  const liste = versions(monde, e.id, type);
  const piece = ajouterPiece(monde, {
    ecurie: e.id, type, version: (liste.at(-1)?.version ?? 0) + 1, efficacite: p.efficacite ?? EFFICACITE_REFERENCE, concept: p.concept,
    reglement: reglementEnVigueur(monde)?.id ?? '', saison: monde.date.annee, installee: false,
    ...(p.defaut?.type === 'fragile' ? { fragile: true } : {}),
  });
  const pole = PIECES[type].pole as Pole;
  // Phase 12b, validation (soufflerie) : chaque heure de vent resserre l'estimation (rendement décroissant).
  const sigma = (PROJETS.ecartEstimation * (1.5 - correlation(monde, e.id, pole) / 20) * (1 + fatiguePole(monde, e.id, pole) / 100)) / Math.sqrt(1 + (p.heures ?? 0) / SOUFFLERIE.heuresValidation)
    * (p.essaisRenforces ? ESSAIS_RENFORCES.facteurIncertitude : 1);
  const estimee = piece.efficacite + tirageLocal(monde, 'monoplaces.estimation', p.id).normale(0, sigma);
  const circuits = circuitsAVenir(monde);
  const avec = ecartMoyen(avecPiece(monde, e, type, estimee, piece.concept), circuits);
  const sans = ecartMoyen(parametresVoiture(monde, e), circuits);
  const installee = avec < sans;
  if (installee) installer(monde, piece);
  else installer(monde, piecesInstallees(monde, e.id).find((x) => x.type === type) ?? piece); // borne l'historique, garde l'actuelle
  ajouterEvenement(monde, {
    type: 'conception.terminee', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 1, visibilite: 'prive', causes: p.evenement ? [p.evenement] : [],
    contexte: { projet: p.id, piece: type, version: piece.version, efficacite: piece.efficacite, estimee: r2(estimee), installee },
    texte: installee ? `Nouvelle version ${piece.version} de la pièce « ${PIECES[type].libelle.toLowerCase()} » montée sur la voiture.`
      : `La version ${piece.version} de la pièce « ${PIECES[type].libelle.toLowerCase()} » est jugée moins bonne : l'ancienne reste montée.`,
  });
}

/** Avancement hebdomadaire des projets (conception, puis fabrication). */
export function avancerProjetsConception(monde: Monde): void {
  const parEcurie = new Map<string, ProjetConception[]>();
  for (const p of projets(monde)) parEcurie.set(p.ecurie, [...(parEcurie.get(p.ecurie) ?? []), p]);
  for (const id of idsTries(table(monde, TABLES.ecuries))) {
    const e = ecurieDe(monde, id)!;
    const liste = parEcurie.get(id) ?? [];
    if (e.statut !== 'active') { for (const p of liste) delete table(monde, TABLES.projetsConception)[p.id]; continue; }
    // Phase 12b : fatigue des pôles selon la charge de la semaine, puis heures de soufflerie (moins utiles à une équipe fatiguée).
    for (const pole of ['aero', 'conception'] as Pole[]) {
      const d = departementPole(monde, id, pole);
      if (d) evoluerFatigue(d, chargePole(liste, pole));
    }
    repartirSoufflerie(monde, e, liste, fraicheur(fatiguePole(monde, id, 'aero')));
    for (const p of liste) avancerProjet(monde, p);
  }
  echeancesDilemmes(monde);
}

/** Une semaine de travail sur un projet : avancement (rythme, fatigue), surcoût de l'intensif, incidents, alertes, événement prévu. */
function avancerProjet(monde: Monde, p: ProjetConception): void {
  if (p.fabricationJoursRestants !== undefined) {
    p.fabricationJoursRestants = r2(p.fabricationJoursRestants - 7 * facteurProduction(monde, p.ecurie));
    if (p.fabricationJoursRestants <= 0) terminerFabrication(monde, p);
    return;
  }
  const type = p.type as TypePiece;
  const pole = PIECES[type].pole as Pole;
  const f = fatiguePole(monde, p.ecurie, pole);
  const rythme = rythmeDe(p);
  const jours = 7 * productivite(monde, p.ecurie, pole) * facteurIngenieurs(monde, p) * RYTHMES.vitesse[rythme] * facteurProductivite(f);
  if (rythme === 'intensif') {
    // Surcoût variable (D-170 Q11) : heures supplémentaires, plus chères quand l'équipe est fatiguée ; stress du responsable.
    depenser(monde, p.ecurie, FATIGUE.surcout * p.coutMEUR * Math.min(1, jours / p.joursTotal) * (1 + f / 100));
    stresser(monde, p.ecurie, pole, FATIGUE.stressIntensif);
  }
  p.joursRestants = r2(p.joursRestants - jours);
  incidents(monde, p, pole, f);
  presenterEvenement(monde, p, (d) => creerDilemme(monde, d), (x) => conceptAlternatif(monde, x));
  alertesResponsables(monde, p);
  if (p.joursRestants <= 0 && table(monde, TABLES.projetsConception)[p.id] && !dilemmes(monde).some((d) => d.projet === p.id)) terminerConception(monde, p);
}

/** Incidents d'exécution (difficultés normales et erreurs dues à la fatigue) : détectés (retard) ou non (défaut caché). */
function incidents(monde: Monde, p: ProjetConception, pole: Pole, f: number): void {
  const t = tirageLocal(monde, 'monoplaces.incident', p.id, rangSemaine(monde.date));
  if (!t.chance(probaIncident(f))) return;
  p.incidents = (p.incidents ?? 0) + 1;
  stresser(monde, p.ecurie, pole, FATIGUE.stressIncident);
  const rigueur = responsable(monde, p.ecurie, pole)?.competences['rigueur'] ?? 10;
  const equipe = Math.min(FIABILITE_DEPARTEMENT.detectionMax, (FATIGUE.detectionBase + (FATIGUE.detectionRigueur * rigueur) / 20) * fraicheur(f) * facteurDetection(monde, p.ecurie));
  const detecte = t.chance(1 - (1 - equipe) * Math.exp(-(p.heures ?? 0) / SOUFFLERIE.heuresDetection));
  if (detecte) {
    const retard = t.entier(FATIGUE.retardMinJours, FATIGUE.retardMaxJours);
    p.joursRestants = r2(p.joursRestants + retard);
    ajouterEvenement(monde, {
      type: 'conception.incident', acteurs: [{ id: p.ecurie, role: 'ecurie' }], importance: 1, visibilite: 'prive', causes: p.evenement ? [p.evenement] : [],
      contexte: { projet: p.id, piece: p.type, retardJours: retard, fatigue: f }, texte: `Erreur détectée sur le projet « ${PIECES[p.type as TypePiece].libelle.toLowerCase()} » : ${retard} jours d'essais supplémentaires.`,
    });
    return;
  }
  // Non détecté : défaut caché ; un second au-delà d'une fatigue extrême rend le projet inutilisable.
  if (p.defaut && f >= FATIGUE.echecFatigue) { p.echec = true; return; }
  p.defaut ??= t.chance(FATIGUE.partFragile) ? { type: 'fragile', ampleur: 1 } : { type: 'performance', ampleur: r2(FATIGUE.defautMin + t.suivant() * (FATIGUE.defautMax - FATIGUE.defautMin)) };
}

/** Concept alternatif le plus prometteur pour un projet (réorientation), d'après les circuits à venir. */
function conceptAlternatif(monde: Monde, p: ProjetConception): { concept: number; gain: number } {
  const e = ecurieDe(monde, p.ecurie)!;
  const type = p.type as TypePiece;
  const circuits = circuitsAVenir(monde);
  const base = parametresVoiture(monde, e);
  const eff = efficaciteAttendue(monde, e, type, p.concept);
  const actuel = ecartMoyen(avecPiece(monde, e, type, eff, p.concept, base), circuits);
  let best = { concept: p.concept, gain: 0 };
  for (const c of [p.concept - EVENEMENTS_CONCEPTION.decalageConcept, p.concept + EVENEMENTS_CONCEPTION.decalageConcept].map((x) => r2(borner(x, -1, 1)))) {
    if (c === p.concept) continue;
    const gain = actuel - ecartMoyen(avecPiece(monde, e, type, eff, c, base), circuits);
    if (gain > best.gain || best.concept === p.concept) best = { concept: c, gain };
  }
  return best;
}

/** Rythme d'un projet : même commande pour le joueur et l'IA. */
export const commandeRythme: DefinitionCommande = {
  type: 'conception.rythme',
  valider(monde, c) {
    const p = table(monde, TABLES.projetsConception)[String(c.parametres['projet'] ?? '')] as unknown as ProjetConception | undefined;
    if (!p || !auteurAutorise(monde, c.auteur, p.ecurie)) return 'Projet inconnu ou auteur non autorisé.';
    return ['allege', 'normal', 'intensif'].includes(String(c.parametres['rythme'])) ? null : 'Rythme : allégé, normal ou intensif.';
  },
  appliquer({ monde }, c) {
    const p = table(monde, TABLES.projetsConception)[String(c.parametres['projet'])] as unknown as ProjetConception;
    p.rythme = String(c.parametres['rythme']) as ProjetConception['rythme'];
    ajouterEvenement(monde, { type: 'conception.rythme', acteurs: [{ id: c.auteur, role: 'auteur' }, { id: p.ecurie, role: 'ecurie' }], importance: 1, visibilite: 'prive', contexte: { projet: p.id, rythme: p.rythme } });
  },
};

/** D-181 : projet prioritaire (il reçoit plus d'ingénieurs du pôle) : même commande pour le joueur et l'IA. */
export const commandePriorite: DefinitionCommande = {
  type: 'conception.priorite',
  valider(monde, c) {
    const p = table(monde, TABLES.projetsConception)[String(c.parametres['projet'] ?? '')] as unknown as ProjetConception | undefined;
    if (!p || !auteurAutorise(monde, c.auteur, p.ecurie)) return 'Projet inconnu ou auteur non autorisé.';
    if (p.fabricationJoursRestants !== undefined) return 'Le projet est déjà en fabrication.';
    return typeof c.parametres['prioritaire'] === 'boolean' ? null : 'Préciser prioritaire : vrai ou faux.';
  },
  appliquer({ monde }, c) {
    const p = table(monde, TABLES.projetsConception)[String(c.parametres['projet'])] as unknown as ProjetConception;
    if (c.parametres['prioritaire'] === true) p.prioritaire = true; else delete p.prioritaire;
    ajouterEvenement(monde, { type: 'conception.priorite', acteurs: [{ id: c.auteur, role: 'auteur' }, { id: p.ecurie, role: 'ecurie' }], importance: 1, visibilite: 'prive', contexte: { projet: p.id, prioritaire: !!p.prioritaire } });
  },
};

/** Réponse à un dilemme technique : même commande pour le joueur et l'IA. */
export const commandeDilemme: DefinitionCommande = {
  type: 'conception.dilemme',
  valider(monde, c) {
    const d = table(monde, TABLES.dilemmesTechniques)[String(c.parametres['dilemme'] ?? '')] as unknown as DilemmeTechnique | undefined;
    if (!d || !auteurAutorise(monde, c.auteur, d.ecurie)) return 'Dilemme inconnu ou auteur non autorisé.';
    return d.options.includes(String(c.parametres['option'])) ? null : 'Option inconnue.';
  },
  appliquer({ monde }, c) {
    const d = table(monde, TABLES.dilemmesTechniques)[String(c.parametres['dilemme'])] as unknown as DilemmeTechnique;
    resoudre(monde, d, String(c.parametres['option']), c.auteur);
  },
};

/* ===================================================================== Intersaison et réformes */

/** Exécution incertaine d'une reconception (même loi que les projets). */
function aleaExecution(monde: Monde, cle: string, s: number): number {
  return tirageLocal(monde, 'monoplaces.reconception', cle).normale(0, PROJETS.ecartExecution * Math.exp(-s / PROJETS.echelleSavoirExecution));
}

/** Voiture de l'année suivante (semaine 1) : chaque pièce comble une part de l'écart à sa frontière ; coût d'une voiture neuve. */
export function intersaison(monde: Monde, ecuries: Ecurie[]): void {
  const r = reglementEnVigueur(monde);
  for (const e of ecuries) {
    const gains: Record<string, number> = {};
    for (const p of piecesInstallees(monde, e.id)) {
      const type = p.type as TypePiece;
      if (!(type in PIECES)) continue;
      const s = savoirPiece(monde, e.id, type, r);
      const q = Math.max(PROJETS.progressionMin, INTERSAISON.progression + aleaExecution(monde, `${e.id}|${type}|${monde.date.annee}|inter`, s));
      const avant = p.efficacite;
      p.efficacite = r2(p.efficacite + q * Math.max(0, frontiere(monde, e, type, r) - p.efficacite));
      gains[type] = r2(p.efficacite - avant);
    }
    invaliderVoitures(monde);
    depenser(monde, e.id, TYPES_PIECES.reduce((a, t) => a + coutTotal(t), 0));
    ajouterEvenement(monde, { type: 'technique.intersaison', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 1, visibilite: 'prive', contexte: { gains } });
  }
}

/**
 * Reconception à l'entrée d'un nouveau règlement ou d'une évolution mineure : chaque pièce touchée à l'intensité I perd la part I de
 * son avance et repart d'une qualité propre à l'écurie (savoir préparé, exécution), vers SA frontière sous ce règlement (architecture
 * comprise). Absolu : rien ne ramène une écurie vers la moyenne de la grille (fiche §10.4).
 */
export function reconcevoir(monde: Monde, ecuries: Ecurie[], intensites: Record<string, number>, r: Reglement, cle: string, grandeReforme = false): void {
  const coupe = grandeReforme ? parametre(monde, 'reglement.coupeReforme', RECONCEPTION.coupeReforme) : 0;
  for (const e of ecuries) {
    const variations: Record<string, number> = {};
    for (const p of piecesInstallees(monde, e.id)) {
      const type = p.type as TypePiece;
      if (!(type in PIECES)) continue;
      const d = PIECES[type].domaines;
      const I = Math.max(...d.map((x) => intensites[x] ?? 0));
      if (I <= 0) continue;
      const s = savoirPiece(monde, e.id, type, r);
      const qualite = borner(RECONCEPTION.qualiteBase + RECONCEPTION.qualiteSavoir * (1 - Math.exp(-s / FRONTIERE.echelleSavoir)) + aleaExecution(monde, `${e.id}|${type}|${cle}`, s), 0, 1);
      const avant = p.efficacite;
      p.efficacite = r2(Math.max(FRONTIERE.min, FRONTIERE.min + (1 - I) * (p.efficacite - FRONTIERE.min) + I * qualite * (frontiere(monde, e, type, r) - FRONTIERE.min) - I * coupe));
      p.reglement = r.id;
      variations[type] = r2(p.efficacite - avant);
    }
    // Relecture du 26/11/2026 : une pièce déjà conçue (en fabrication) sous l'ancien règlement subit la même variation que la pièce montée ;
    // sinon elle arrivait après la réforme avec une efficacité d'avant la réforme (ni perte d'intensité ni coupe).
    for (const q of projets(monde, e.id)) {
      const dv = variations[q.type];
      if (q.fabricationJoursRestants !== undefined && q.efficacite !== undefined && dv !== undefined) q.efficacite = r2(Math.max(FRONTIERE.min, q.efficacite + dv));
    }
    invaliderVoitures(monde);
    ajouterEvenement(monde, {
      type: 'technique.reconception', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 1, visibilite: 'prive',
      contexte: { cle, reglement: r.id, variations, architecture: e.architectures?.[r.id] ?? null },
    });
  }
}

/** Architecture retenue par une écurie qui n'a rien choisi : la famille qu'elle perçoit comme la meilleure (jugement de son DT). */
export function architectureRecommandee(monde: Monde, idEcurie: string, r: Reglement): string | undefined {
  const percu = paysagePercu(monde, idEcurie, r);
  return Object.entries(percu).sort((a, b) => a[1] - b[1] || (a[0] < b[0] ? -1 : 1))[0]?.[0];
}

/** À l'entrée en vigueur d'une réforme : chaque écurie sans choix prend la recommandation de son directeur technique. */
export function fixerArchitectures(monde: Monde, ecuries: Ecurie[], r: Reglement): void {
  if (!paysage(monde, r).familles.length) return;
  for (const e of ecuries) {
    if (e.architectures?.[r.id]) continue;
    const f = architectureRecommandee(monde, e.id, r);
    if (f) (e.architectures ??= {})[r.id] = f;
  }
}

/* ===================================================================== Décisions (IA et délégation) */

/** Meilleur projet perçu pour une pièce : concept candidat et gain estimé (% de temps au tour, positif = plus rapide). */
export function meilleurProjet(monde: Monde, e: Ecurie, type: TypePiece, circuits: Circuit[]): { concept: number; gain: number } {
  const actuelle = piecesInstallees(monde, e.id).find((x) => x.type === type);
  const c0 = actuelle?.concept ?? 0;
  const base = parametresVoiture(monde, e);
  const sans = ecartMoyen(base, circuits);
  let best = { concept: c0, gain: -Infinity };
  for (const c of [...new Set([c0, c0 - IA_CONCEPTION.pasConcept, c0 + IA_CONCEPTION.pasConcept].map((x) => r2(borner(x, -1, 1))))]) {
    const gain = sans - ecartMoyen(avecPiece(monde, e, type, efficaciteAttendue(monde, e, type, c), c, base), circuits);
    if (gain > best.gain) best = { concept: c, gain };
  }
  return best;
}

/** Décisions hebdomadaires : remplir les équipes libres avec le projet au meilleur gain estimé par million (même règle pour tous). */
export function decisionsConception(monde: Monde, commander: Commander): void {
  const circuits = circuitsAVenir(monde);
  for (const id of idsTries(table(monde, TABLES.ecuries))) {
    const e = ecurieDe(monde, id)!;
    if (e.statut !== 'active' || (e.pilotee && !e.delegationRecherche)) continue;
    const auteur = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === e.id && (p.poste === 'directeur_technique' || p.poste === 'team_principal'));
    if (!auteur) continue;
    // Phase 12b : rythme des projets selon la fatigue du pôle et l'enjeu (repos d'une équipe épuisée, intensif pour une écurie qui
    // joue le titre ou un directeur technique audacieux, si l'équipe est fraîche).
    const dt = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((x) => x.statut === 'actif' && x.ecurie === e.id && x.poste === 'directeur_technique');
    const enjeu = forceEcurie(monde, e.id) >= IA_RYTHME.forcePretendant || (dt?.traits['risque'] ?? 10) >= IA_RYTHME.risqueAudacieux;
    for (const p of projets(monde, e.id)) {
      if (p.fabricationJoursRestants !== undefined) continue;
      const f = fatiguePole(monde, e.id, PIECES[p.type as TypePiece].pole as Pole);
      // Coup de collier pour finir une pièce (les dernières semaines), si l'équipe n'est pas déjà fatiguée ; repos d'une équipe épuisée.
      const finProche = p.joursRestants <= IA_RYTHME.joursFinProjet;
      const voulu = f >= IA_RYTHME.fatigueRepos ? 'allege' : (finProche && f < IA_RYTHME.fatigueFinProjet) || (f < IA_RYTHME.fatigueIntensif && enjeu) ? 'intensif' : 'normal';
      if (rythmeDe(p) !== voulu) commander({ type: 'conception.rythme', auteur: auteur.id, parametres: { projet: p.id, rythme: voulu } });
    }
    const voulue = partSouffleriePolitique(monde, e);
    if ((e.souffleriePartRecherche ?? SOUFFLERIE.partRechercheDefaut) !== voulue) commander({ type: 'conception.soufflerie', auteur: auteur.id, parametres: { ecurie: e.id, partRecherche: voulue } });
    const enCoursListe = projets(monde, e.id);
    const libres = (['aero', 'conception'] as Pole[]).filter((pole) => enCoursListe.filter((p) => PIECES[p.type as TypePiece].pole === pole && p.fabricationJoursRestants === undefined).length < emplacements(monde, e.id, pole));
    // L'IA garde de quoi payer ses programmes de recherche quand ils ne sont pas encore lancés (début de partie) : sinon les projets
    // du début d'année consomment l'argent de la recherche et le plafond est dépassé.
    const fiIA = (Object.values(table(monde, TABLES.finances)) as unknown as Finances[]).find((x) => x.ecurie === e.id);
    const reserve = Math.max(0, 2 * (IA_RECHERCHE.partDefaut + IA_RECHERCHE.partAudace / 2) - partRecherche(monde, e.id)) * (fiIA?.budget.developpementMEUR ?? 0);
    const disponible = () => enveloppeRestante(monde, e.id) - reserve;
    if (!libres.length || disponible() < Math.min(...TYPES_PIECES.map(coutTotal))) continue;
    const enCours = new Set(enCoursListe.map((p) => p.type));
    const f = tirageLocal(monde, 'monoplaces.ia', e.id, monde.date.annee, monde.date.semaine);
    // Prototype : erreurs de développement selon la compétence de conception du pôle (IA_ERREURS, paramètre `ia.erreurs`).
    const erreurs = e.id === IA_ERREURS.ecurieExemptee ? 0 : parametre(monde, 'ia.erreurs', 0);
    const poidsCompetence = parametre(monde, 'ia.erreursCompetence', 1);
    const facteurErreur = (t: TypePiece) => erreurs * (poidsCompetence * borner((IA_ERREURS.competenceSansErreur - competence(monde, e.id, PIECES[t].pole as Pole)) / IA_ERREURS.etendue, 0, 1)
      + (1 - poidsCompetence) * IA_ERREURS.facteurUniforme);
    const candidats = TYPES_PIECES.filter((t) => !enCours.has(t) && libres.includes(PIECES[t].pole as Pole)).map((t) => {
      const best = meilleurProjet(monde, e, t, circuits);
      const fe = facteurErreur(t);
      const concept = fe > 0 && f.chance(IA_ERREURS.probaConcept * fe) ? r2(borner(best.concept + (f.chance(0.5) ? 1 : -1) * IA_ERREURS.decalageConcept, -1, 1)) : best.concept;
      return { t, gain: best.gain, concept, bruit: f.normale(0, IA_CONCEPTION.alea) + (fe > 0 ? f.normale(0, IA_ERREURS.ecartGain * fe) : 0) };
    })
      .map((x) => ({ ...x, score: (x.gain + x.bruit) / coutTotal(x.t, facteurPaquet(monde)) })).sort((a, b) => b.score - a.score);
    for (const x of candidats) {
      if (x.gain < IA_CONCEPTION.gainMin || disponible() < coutTotal(x.t, facteurPaquet(monde))) continue;
      const prm = { ecurie: e.id, type: x.t, concept: x.concept };
      if (motifRefusProjet(monde, auteur.id, prm)) continue;
      commander({ type: 'conception.lancer', auteur: auteur.id, parametres: prm });
    }
  }
}

/** Règlement visé par le choix d'architecture : annoncé, sinon le premier proposé. */
export function reglementAChoisir(monde: Monde): Reglement | undefined {
  return reglementAnnonce(monde);
}
