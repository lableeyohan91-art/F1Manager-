/**
 * Infrastructures — phase 5b (docs/systemes/phase-5-economie.md §7).
 *
 * - Vieillissement : une installation perd en efficacité avec l'âge et quand l'écurie est en crise (entretien négligé).
 * - Projets : amélioration (+1 niveau) ou rénovation (remise à neuf), avec coût et durée annoncés, et des risques
 *   (retards, dépassements) tirés au lancement et découverts en cours de route.
 * - Enveloppe réglementaire d'investissement par an, hors plafond : l'argent compte, mais dans une limite connue de tous.
 */

import { INSTALLATIONS_COUT } from '../../balance/capacites';
import type { DefinitionCommande } from '../../core/commandes';
import {
  COUT_INFRASTRUCTURE, DUREE_INFRASTRUCTURE, INSTALLATIONS_TECHNIQUES, INVESTISSEMENT_ANNUEL_MAX, MARGE_LANCEMENT_PROJET, PERIODES_PAR_AN,
  RISQUES_INFRASTRUCTURE, VIEILLISSEMENT,
} from '../../balance/finances';
import { ajouterEvenement } from '../../core/evenements';
import { nouvelIdentifiant } from '../../core/identifiants';
import { tirageLocal } from '../../core/moteur';
import { idsTries, parametre, table, type Monde } from '../../core/monde';
import { TABLES, type Ecurie, type Finances, type Installation, type Personne, type ProjetInfrastructure } from '../../model/types';

const arrondi = (x: number) => Math.round(x * 10) / 10;
const LIB: Record<string, string> = {
  soufflerie: 'sa nouvelle soufflerie', cfd: 'son nouveau centre de calcul (CFD)', simulateur: 'son nouveau simulateur', bureau_etudes: "son nouveau bureau d'études",
};
/** Phase 11 (correction d'accord) : « l'agrandissement de sa soufflerie », « de son simulateur ». */
const LIB_DE: Record<string, string> = {
  soufflerie: 'de sa soufflerie', cfd: 'de son centre de calcul (CFD)', simulateur: 'de son simulateur', bureau_etudes: "de son bureau d'études",
};

/** D-181 : niveau utile d'une installation (rendement décroissant au-dessus du seuil : le sommet rapporte moins). */
export function niveauUtile(niveau: number): number {
  return niveau <= INSTALLATIONS_COUT.seuilRendement ? niveau : INSTALLATIONS_COUT.seuilRendement + INSTALLATIONS_COUT.rendementAuDela * (niveau - INSTALLATIONS_COUT.seuilRendement);
}

/** Niveau effectif d'une installation : niveau utile × usure due à l'âge × état d'entretien. */
export function niveauEffectif(i: Installation): number {
  const age = Math.max(VIEILLISSEMENT.plancher, 1 - VIEILLISSEMENT.perteParAn * i.ageAnnees);
  return niveauUtile(i.niveau) * age * (0.8 + 0.2 * (i.etat / 100));
}

const installationsDe = (monde: Monde, idEcurie: string) => {
  const t = table(monde, TABLES.installations);
  return idsTries(t).map((id) => t[id] as unknown as Installation).filter((i) => i.ecurie === idEcurie);
};

/** Semaine 1 : chaque installation vieillit d'un an ; l'état remonte si l'écurie est saine. */
export function vieillirInstallations(monde: Monde, e: Ecurie, fi: Finances): void {
  for (const i of installationsDe(monde, e.id)) {
    i.ageAnnees++;
    if (fi.etatCrise === 'sain') i.etat = Math.min(100, i.etat + VIEILLISSEMENT.recuperationEtat);
  }
}

/** Période en crise : l'entretien est négligé. */
export function negligerEntretien(monde: Monde, e: Ecurie): void {
  for (const i of installationsDe(monde, e.id)) i.etat = Math.max(0, i.etat - VIEILLISSEMENT.perteEtatCrise / PERIODES_PAR_AN);
}

function enveloppe(monde: Monde): number {
  return parametre(monde, 'reglement.investissementAnnuelMax', INVESTISSEMENT_ANNUEL_MAX);
}

/** Coût annoncé d'un chantier (amélioration n → n+1, ou rénovation). */
export function coutChantier(i: Installation, nature: ProjetInfrastructure['nature']): number {
  return nature === 'amelioration' ? COUT_INFRASTRUCTURE.ameliorationParNiveau * (i.niveau + 1) : COUT_INFRASTRUCTURE.renovationParNiveau * i.niveau;
}

/** D-181 : règles communes d'un chantier (joueur et IA) : un seul à la fois, écurie saine, trésorerie ≥ une part du coût. */
export function motifRefusChantier(monde: Monde, auteur: string, prm: Record<string, unknown>): string | null {
  const idEcurie = String(prm['ecurie'] ?? '');
  const e = table(monde, TABLES.ecuries)[idEcurie] as unknown as Ecurie | undefined;
  const fi = (Object.values(table(monde, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === idEcurie);
  if (!e || e.statut !== 'active' || !fi) return 'Écurie inconnue.';
  const p = table(monde, TABLES.personnes)[auteur] as unknown as Personne | undefined;
  if (!p || p.statut !== 'actif' || p.ecurie !== idEcurie || (p.poste !== 'team_principal' && p.poste !== 'directeur_technique')) return 'Seuls le team principal et le directeur technique lancent un chantier.';
  const i = table(monde, TABLES.installations)[String(prm['installation'] ?? '')] as unknown as Installation | undefined;
  if (!i || i.ecurie !== idEcurie || !(INSTALLATIONS_TECHNIQUES as readonly string[]).includes(i.type)) return 'Installation technique inconnue.';
  const nature = prm['nature'];
  if (nature !== 'amelioration' && nature !== 'renovation') return 'Nature : amélioration ou rénovation.';
  if (fi.projets.length) return 'Un chantier est déjà en cours (un seul à la fois).';
  if (fi.etatCrise !== 'sain') return 'Pas de chantier tant que les finances ne sont pas saines.';
  if (nature === 'amelioration' && i.niveau >= 10) return 'Installation déjà au niveau maximal.';
  if (nature === 'renovation' && i.ageAnnees < COUT_INFRASTRUCTURE.ageMinRenovation) return `Rénovation possible après ${COUT_INFRASTRUCTURE.ageMinRenovation} ans.`;
  if (fi.tresorerieMEUR < MARGE_LANCEMENT_PROJET * coutChantier(i, nature)) return 'Trésorerie insuffisante pour lancer ce chantier.';
  return null;
}

/** Lance un chantier (après validation) : coût et durée annoncés, risques tirés au lancement. */
function lancerChantier(monde: Monde, e: Ecurie, fi: Finances, i: Installation, nature: ProjetInfrastructure['nature']): void {
  const cout = coutChantier(i, nature);
  const f = tirageLocal(monde, 'infrastructure', e.id, monde.date.annee);
  const d = DUREE_INFRASTRUCTURE[nature];
  // La durée annoncée tient compte de l'enveloppe annuelle : un chantier ne peut pas être payé plus vite qu'elle ne le permet.
  const dureePrevue = Math.max(f.entier(d.min, d.max), Math.ceil((cout / enveloppe(monde)) * 52 * 1.1));
  const retard = f.chance(RISQUES_INFRASTRUCTURE.probabiliteRetard) ? 1 + f.suivant() * RISQUES_INFRASTRUCTURE.retardMax : 1;
  const surcout = f.chance(RISQUES_INFRASTRUCTURE.probabiliteSurcout) ? 1 + f.suivant() * RISQUES_INFRASTRUCTURE.surcoutMax : 1;
  const p: ProjetInfrastructure = {
    id: nouvelIdentifiant(monde, 'prj'), installation: i.id, nature,
    coutPrevuMEUR: arrondi(cout), dureePrevueSemaines: dureePrevue,
    coutReelMEUR: arrondi(cout * surcout), dureeReelleSemaines: Math.round(dureePrevue * retard),
    depenseMEUR: 0, avancementSemaines: 0, debut: { annee: monde.date.annee, semaine: monde.date.semaine },
  };
  fi.projets.push(p);
  ajouterEvenement(monde, {
    type: 'infrastructure.lancement', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 2, visibilite: 'public',
    contexte: { installation: i.type, nature: p.nature, cout: p.coutPrevuMEUR, duree: p.dureePrevueSemaines },
    texte: `${e.nom} lance ${p.nature === 'amelioration' ? "l'agrandissement" : 'la rénovation'} ${LIB_DE[i.type] ?? `de ${i.type}`} (${p.coutPrevuMEUR} M€ annoncés).`,
  });
}

/** D-181 : commande commune de lancement d'un chantier (le joueur choisit ; l'IA passe par la même commande). */
export const commandeChantier: DefinitionCommande = {
  type: 'infrastructure.lancer',
  valider: (monde, c) => motifRefusChantier(monde, c.auteur, c.parametres),
  appliquer({ monde }, c) {
    const idEcurie = String(c.parametres['ecurie']);
    const e = table(monde, TABLES.ecuries)[idEcurie] as unknown as Ecurie;
    const fi = (Object.values(table(monde, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === idEcurie)!;
    lancerChantier(monde, e, fi, table(monde, TABLES.installations)[String(c.parametres['installation'])] as unknown as Installation, c.parametres['nature'] as ProjetInfrastructure['nature']);
  },
};

/**
 * Décision annuelle de l'IA (après le budget) : si aucun projet n'est en cours et que la trésorerie le permet, lancer le projet au
 * meilleur rapport gain / coût parmi les installations techniques, par la commande commune. Écurie du joueur : seulement si la recherche
 * est déléguée (la direction technique choisit).
 */
export function deciderProjet(monde: Monde, e: Ecurie, fi: Finances, reserveVisee: number, commander?: (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => unknown): void {
  if (fi.projets.length || fi.etatCrise !== 'sain' || (e.pilotee && !e.delegationRecherche)) return;
  let meilleur: { i: Installation; nature: ProjetInfrastructure['nature']; cout: number; ratio: number } | undefined;
  for (const i of installationsDe(monde, e.id).filter((x) => (INSTALLATIONS_TECHNIQUES as readonly string[]).includes(x.type))) {
    const actuel = niveauEffectif(i);
    if (i.niveau < 10) {
      const cout = coutChantier(i, 'amelioration');
      const ratio = (niveauUtile(i.niveau + 1) - actuel) / cout;
      if (!meilleur || ratio > meilleur.ratio) meilleur = { i, nature: 'amelioration', cout, ratio };
    }
    if (i.ageAnnees >= COUT_INFRASTRUCTURE.ageMinRenovation) {
      const cout = coutChantier(i, 'renovation');
      const ratio = (niveauUtile(i.niveau) - actuel) / cout;
      if (!meilleur || ratio > meilleur.ratio) meilleur = { i, nature: 'renovation', cout, ratio };
    }
  }
  if (!meilleur || fi.tresorerieMEUR - reserveVisee < MARGE_LANCEMENT_PROJET * meilleur.cout) return;
  const auteur = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste === 'team_principal');
  const prm = { ecurie: e.id, installation: meilleur.i.id, nature: meilleur.nature };
  if (!auteur || motifRefusChantier(monde, auteur.id, prm)) return;
  if (commander) commander({ type: 'infrastructure.lancer', auteur: auteur.id, parametres: prm });
  else lancerChantier(monde, e, fi, meilleur.i, meilleur.nature);
}

/** Retard annoncé dès que le temps calendaire écoulé dépasse la durée annoncée de plus de 4 semaines (suspensions comprises). */
function annoncerRetard(monde: Monde, e: Ecurie, p: ProjetInfrastructure): void {
  if (p.retardAnnonce || semainesEcoulees(monde, p) <= p.dureePrevueSemaines + 4) return;
  p.retardAnnonce = true;
  ajouterEvenement(monde, { type: 'infrastructure.retard', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 1, contexte: { projet: p.id, prevue: livraisonPrevue(p), semainesSuspendues: Math.round(p.semainesSuspendues ?? 0) } });
}

/** Période : paiement dans la limite de l'enveloppe annuelle, avancement proportionnel, livraison. */
/** Semaines calendaires écoulées depuis le lancement d'un projet (temps réel, suspensions comprises). */
export function semainesEcoulees(monde: Monde, p: ProjetInfrastructure): number {
  return (monde.date.annee - p.debut.annee) * 52 + (monde.date.semaine - p.debut.semaine);
}

/** Date de livraison prévue (début + durée annoncée). */
export function livraisonPrevue(p: ProjetInfrastructure): { annee: number; semaine: number } {
  const t = p.debut.semaine - 1 + p.dureePrevueSemaines;
  return { annee: p.debut.annee + Math.floor(t / 52), semaine: (t % 52) + 1 };
}

export function avancerProjets(monde: Monde, e: Ecurie, fi: Finances): void {
  for (const p of [...fi.projets]) {
    if (fi.etatCrise === 'crise' || fi.etatCrise === 'administration') { // chantier à l'arrêt : le temps passe sans travail
      p.semainesSuspendues = (p.semainesSuspendues ?? 0) + 4;
      annoncerRetard(monde, e, p);
      continue;
    }
    const restantSemaines = Math.max(4, p.dureeReelleSemaines - p.avancementSemaines);
    const besoin = Math.max(0, ((p.coutReelMEUR - p.depenseMEUR) * 4) / restantSemaines);
    const disponible = Math.max(0, enveloppe(monde) - fi.comptes.investissements);
    const paye = Math.min(besoin, disponible);
    p.depenseMEUR += paye;
    fi.comptes.investissements += paye;
    fi.tresorerieMEUR -= paye;
    const travail = besoin > 0 ? 4 * (paye / besoin) : 4;
    p.avancementSemaines += travail;
    p.semainesSuspendues = (p.semainesSuspendues ?? 0) + (4 - travail); // enveloppe épuisée : chantier ralenti ou suspendu
    annoncerRetard(monde, e, p);
    if (p.avancementSemaines >= p.dureeReelleSemaines && p.depenseMEUR >= p.coutReelMEUR - 0.01) {
      const i = table(monde, TABLES.installations)[p.installation] as unknown as Installation | undefined;
      if (i) {
        if (p.nature === 'amelioration') i.niveau = Math.min(10, i.niveau + 1);
        i.ageAnnees = 0;
        i.etat = 100;
      }
      fi.projets = fi.projets.filter((x) => x.id !== p.id);
      ajouterEvenement(monde, {
        type: 'infrastructure.livraison', acteurs: [{ id: e.id, role: 'ecurie' }], importance: 2, visibilite: 'public',
        contexte: {
          installation: i?.type, nature: p.nature, coutPrevu: p.coutPrevuMEUR, coutReel: p.coutReelMEUR,
          // Audit n°3 : retard calendaire (temps réellement écoulé), décomposé en dépassement du temps de travail et suspensions.
          livraisonPrevue: livraisonPrevue(p), livraisonReelle: { ...monde.date }, dureeCalendaire: semainesEcoulees(monde, p),
          retardSemaines: Math.max(0, Math.round(semainesEcoulees(monde, p) - p.dureePrevueSemaines)),
          semainesTravail: Math.round(p.avancementSemaines), semainesSuspendues: Math.round(p.semainesSuspendues ?? 0),
        },
        texte: `${e.nom} met en service ${LIB[i?.type ?? ''] ?? 'sa nouvelle installation'}${p.coutReelMEUR > p.coutPrevuMEUR + 0.1 ? ` (coût final ${p.coutReelMEUR} M€ au lieu de ${p.coutPrevuMEUR})` : ''}.`,
      });
    }
  }
}
