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
  EFFICACITE_REFERENCE, FAMILLES_ARCHITECTURE, FRONTIERE, IA_CONCEPTION, INTERSAISON, PAYSAGE, PIECES, PROJETS, RECONCEPTION, TYPES_PIECES, type TypePiece,
} from '../../balance/monoplaces';
import { USURE_SUCCES } from '../../balance/marche';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement } from '../../core/evenements';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal } from '../../core/moteur';

type Commander = (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => unknown;
import {
  TABLES, type Circuit, type Departement, type Ecurie, type Finances, type GrandPrix, type Installation, type PieceVoiture, type Personne, type ProjetConception, type Reglement,
} from '../../model/types';
import { programmes, reglementAnnonce, reglementEnVigueur, savoirApplicable, savoirExistant } from '../technique/acces';
import { restrictionAero } from '../economie';
import { usureSucces } from '../humain/decision';
import { ecartTempsPct, effetPiece, invaliderVoitures, parametresVoiture, piecesInstallees, type ParametresVoiture } from './physique';
import { ajouterPiece, installer, versions } from './pieces';

const borner = (x: number, min: number, max: number) => Math.min(max, Math.max(min, x));
const r2 = (x: number) => Math.round(x * 100) / 100;
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const ecurieDe = (m: Monde, id: string) => table(m, TABLES.ecuries)[id] as unknown as Ecurie | undefined;
const financesDe = (m: Monde, id: string) => (Object.values(table(m, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === id);

/* ===================================================================== Savoir, architecture, frontière */

/** Savoir applicable moyen des domaines d'une pièce, sous un règlement. */
export function savoirPiece(monde: Monde, idEcurie: string, type: TypePiece, idReglement: string | undefined): number {
  const d = PIECES[type].domaines;
  return d.reduce((a, x) => a + savoirApplicable(monde, idEcurie, x, idReglement), 0) / d.length;
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
  const s = savoirPiece(monde, e.id, type, r?.id);
  return FRONTIERE.min + FRONTIERE.etendue * (1 - Math.exp(-s / FRONTIERE.echelleSavoir)) * (1 - penaliteArchitecture(monde, e, type, r));
}

/* ===================================================================== Capacité et qualité */

type Pole = 'aero' | 'conception';
const INSTALLATIONS_POLE: Record<Pole, string[]> = { aero: ['soufflerie', 'cfd'], conception: ['bureau_etudes', 'simulateur'] };
const COMPETENCE_POLE: Record<Pole, { poste: string; competence: string }> = { aero: { poste: 'responsable_aero', competence: 'aerodynamique' }, conception: { poste: 'responsable_conception', competence: 'conception' } };

function departement(monde: Monde, idEcurie: string, pole: Pole): Departement | undefined {
  return (Object.values(table(monde, TABLES.departements)) as unknown as Departement[]).find((d) => d.ecurie === idEcurie && d.type === pole);
}

/** Projets simultanés possibles dans un pôle (effectif / taille d'équipe, borné). */
export function emplacements(monde: Monde, idEcurie: string, pole: Pole): number {
  return borner(Math.floor((departement(monde, idEcurie, pole)?.effectif ?? 0) / PROJETS.tailleEquipe), PROJETS.emplacementsMin, PROJETS.emplacementsMax);
}

/** Productivité d'un pôle (jours de conception par jour de calendrier), installations et usure du succès comprises (D-140). */
export function productivite(monde: Monde, idEcurie: string, pole: Pole): number {
  const niveau = departement(monde, idEcurie, pole)?.niveauMoyen ?? 10;
  const inst = (Object.values(table(monde, TABLES.installations)) as unknown as Installation[]).filter((i) => i.ecurie === idEcurie && INSTALLATIONS_POLE[pole].includes(i.type));
  const niv = inst.length ? inst.reduce((a, i) => a + i.niveau, 0) / inst.length : 5;
  return (PROJETS.productiviteBase + (PROJETS.productiviteNiveau * niveau) / 20) * (PROJETS.installationBase + PROJETS.installationParNiveau * (niv - 5));
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
  // Restriction aérodynamique selon le classement (phase 5a) et sanction d'un dépassement du plafond (réduction aéro de la saison).
  const sanction = financesDe(monde, e.id)?.sanctionAero ?? 0;
  const aero = pole === 'aero' ? restrictionAero(monde, e.id) * (1 - sanction) : 1;
  // Restriction aérodynamique (phase 5a, barème selon le classement) sur les pièces aéro, jusqu'aux heures de soufflerie (12b).
  return PROJETS.progressionBase * Math.sqrt(competence(monde, e.id, pole) / PROJETS.competenceReference) * aero;
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

/** Dépenses techniques de l'année (créées au besoin). */
function depenses(fi: Finances, annee: number): NonNullable<Finances['depensesTechniques']> {
  if (!fi.depensesTechniques || fi.depensesTechniques.annee !== annee) fi.depensesTechniques = { annee, projetsMEUR: 0, aPayerMEUR: fi.depensesTechniques?.aPayerMEUR ?? 0 };
  return fi.depensesTechniques;
}

/** Enveloppe encore disponible pour les projets cette année (budget de développement hors part de la recherche, moins le déjà dépensé). */
export function enveloppeRestante(monde: Monde, idEcurie: string): number {
  const fi = financesDe(monde, idEcurie);
  if (!fi) return Infinity;
  const recherche = programmes(monde, idEcurie).filter((p) => p.statut === 'actif').reduce((a, p) => a + p.part, 0);
  return fi.budget.developpementMEUR * (1 - recherche) - depenses(fi, monde.date.annee).projetsMEUR;
}

/** Engage une dépense technique (comptée à la prochaine écriture comptable, sous le plafond). */
export function depenser(monde: Monde, idEcurie: string, montant: number): void {
  const fi = financesDe(monde, idEcurie);
  if (!fi) return;
  const d = depenses(fi, monde.date.annee);
  d.projetsMEUR = r2(d.projetsMEUR + montant);
  d.aPayerMEUR = r2(d.aPayerMEUR + montant);
}

/** Coût total d'un projet (conception + exemplaires fabriqués). */
export const coutTotal = (type: TypePiece) => PIECES[type].coutProjetMEUR + PROJETS.exemplaires * PIECES[type].coutUnitaireMEUR;

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
  if (enveloppeRestante(monde, e.id) < coutTotal(type)) return 'Le budget de développement de l’année ne couvre pas ce projet.';
  return null;
}

/** Lance un projet : coût de conception payé tout de suite (comme dans F1M, pas de remboursement), fabrication payée à la fin. */
export function lancerProjet(monde: Monde, auteur: string, prm: Record<string, unknown>): ProjetConception {
  const idEcurie = String(prm['ecurie']);
  const type = String(prm['type']) as TypePiece;
  const def = PIECES[type];
  const id = `prj_${idEcurie.replace(/^eq_/, '')}_${type}_${monde.date.annee}_${monde.date.semaine}`;
  const p: ProjetConception = { id, ecurie: idEcurie, type, concept: r2(Number(prm['concept'])), joursRestants: def.conceptionJours, joursTotal: def.conceptionJours, debut: { ...monde.date }, coutMEUR: def.coutProjetMEUR };
  depenser(monde, idEcurie, def.coutProjetMEUR);
  const evt = ajouterEvenement(monde, {
    type: 'conception.lancement', acteurs: [{ id: auteur, role: 'auteur' }, { id: idEcurie, role: 'ecurie' }], importance: 1, visibilite: 'prive',
    contexte: { projet: id, piece: type, concept: p.concept, cout: def.coutProjetMEUR },
    texte: `Lancement d'un nouveau projet : ${def.libelle.toLowerCase()} (${p.concept > 0.05 ? def.conceptPlus : p.concept < -0.05 ? def.conceptMoins : 'concept équilibré'}).`,
  });
  p.evenement = evt.id;
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

/** Fin de conception : qualité réelle tirée (fixée une fois pour toutes), fabrication lancée et payée. */
function terminerConception(monde: Monde, p: ProjetConception): void {
  const e = ecurieDe(monde, p.ecurie);
  if (!e) return;
  const type = p.type as TypePiece;
  const actuelle = piecesInstallees(monde, e.id).find((x) => x.type === type);
  const base = actuelle?.efficacite ?? EFFICACITE_REFERENCE;
  const r = reglementEnVigueur(monde);
  const s = savoirPiece(monde, e.id, type, r?.id);
  const f = tirageLocal(monde, 'monoplaces.conception', p.id);
  const q = Math.max(PROJETS.progressionMin, progressionAttendue(monde, e, type) + f.normale(0, PROJETS.ecartExecution * Math.exp(-s / PROJETS.echelleSavoirExecution)));
  p.efficacite = r2(base + q * Math.max(0, frontiere(monde, e, type) - base) - PROJETS.penaliteConcept * Math.abs(p.concept - (actuelle?.concept ?? 0)));
  p.fabricationJoursRestants = PIECES[type].fabricationJours;
  depenser(monde, e.id, PROJETS.exemplaires * PIECES[type].coutUnitaireMEUR);
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
  });
  const pole = PIECES[type].pole as Pole;
  const sigma = PROJETS.ecartEstimation * (1.5 - correlation(monde, e.id, pole) / 20);
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
  for (const p of projets(monde)) {
    const e = ecurieDe(monde, p.ecurie);
    if (!e || e.statut !== 'active') { delete table(monde, TABLES.projetsConception)[p.id]; continue; }
    if (p.fabricationJoursRestants === undefined) {
      p.joursRestants = r2(p.joursRestants - 7 * productivite(monde, p.ecurie, PIECES[p.type as TypePiece].pole as Pole));
      if (p.joursRestants <= 0) terminerConception(monde, p);
    } else {
      p.fabricationJoursRestants = r2(p.fabricationJoursRestants - 7);
      if (p.fabricationJoursRestants <= 0) terminerFabrication(monde, p);
    }
  }
}

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
      const s = savoirPiece(monde, e.id, type, r?.id);
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
export function reconcevoir(monde: Monde, ecuries: Ecurie[], intensites: Record<string, number>, r: Reglement, cle: string): void {
  for (const e of ecuries) {
    const variations: Record<string, number> = {};
    for (const p of piecesInstallees(monde, e.id)) {
      const type = p.type as TypePiece;
      if (!(type in PIECES)) continue;
      const d = PIECES[type].domaines;
      const I = Math.max(...d.map((x) => intensites[x] ?? 0));
      if (I <= 0) continue;
      const s = savoirPiece(monde, e.id, type, r.id);
      const qualite = borner(RECONCEPTION.qualiteBase + RECONCEPTION.qualiteSavoir * (1 - Math.exp(-s / FRONTIERE.echelleSavoir)) + aleaExecution(monde, `${e.id}|${type}|${cle}`, s), 0, 1);
      const avant = p.efficacite;
      p.efficacite = r2(FRONTIERE.min + (1 - I) * (p.efficacite - FRONTIERE.min) + I * qualite * (frontiere(monde, e, type, r) - FRONTIERE.min));
      p.reglement = r.id;
      variations[type] = r2(p.efficacite - avant);
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
    const enCoursListe = projets(monde, e.id);
    const libres = (['aero', 'conception'] as Pole[]).filter((pole) => enCoursListe.filter((p) => PIECES[p.type as TypePiece].pole === pole && p.fabricationJoursRestants === undefined).length < emplacements(monde, e.id, pole));
    if (!libres.length || enveloppeRestante(monde, e.id) < Math.min(...TYPES_PIECES.map(coutTotal))) continue;
    const enCours = new Set(enCoursListe.map((p) => p.type));
    const f = tirageLocal(monde, 'monoplaces.ia', e.id, monde.date.annee, monde.date.semaine);
    const candidats = TYPES_PIECES.filter((t) => !enCours.has(t) && libres.includes(PIECES[t].pole as Pole)).map((t) => ({ t, ...meilleurProjet(monde, e, t, circuits) }))
      .map((x) => ({ ...x, score: (x.gain + f.normale(0, IA_CONCEPTION.alea)) / coutTotal(x.t) })).sort((a, b) => b.score - a.score);
    for (const x of candidats) {
      if (x.gain < IA_CONCEPTION.gainMin) continue;
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
