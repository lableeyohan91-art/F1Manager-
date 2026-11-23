/**
 * Phase 7b — marché du personnel technique et dirigeant (docs/systemes/phase-7-marche-du-travail.md §6, §7, §15 ; D-116, D-117).
 *
 * - Les écuries (IA) pourvoient leurs postes qui se libèrent (fins de contrat non prolongées) sur le marché, pendant la fenêtre,
 *   avec les mêmes offres, contre-offres, indemnités et contre-attaques que pour les pilotes.
 * - Elles peuvent aussi **améliorer** un poste technique clé en débauchant un responsable nettement meilleur que le leur
 *   (levier attendu contre les dominations par la voiture) : la personne en place est alors libérée, avec indemnité.
 * - Une personne débauchée sert une période de non-concurrence (6 mois), un responsable influent entraîne une partie de son département.
 * - Candidatures spontanées : une personne ambitieuse et lassée propose ses services (commande dont elle est l'auteur).
 */

import { CANDIDATURES, FENETRE, OFFRE_MARCHE, PERSONNEL_MARCHE, PLAN_MARCHE, RANG_POSTE, REMPLACEMENT } from '../../balance/marche';
import type { DefinitionCommande } from '../../core/commandes';
import { ajouterEvenement } from '../../core/evenements';
import { nouvelIdentifiant } from '../../core/identifiants';
import { table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal } from '../../core/moteur';
import { TABLES, type Candidature, type Ecurie, type Personne, type Poste } from '../../model/types';
import { lireEvenement } from '../memoire';
import { ecuriesActives } from '../saison/performance';
import { candidatPour, contratEmploi, dureeContrat, indemniteRupture } from '../humain/contrats';
import { forceEcurie, lassitude, niveauMetier, teamPrincipal } from '../humain/decision';
import { placesLibres } from '../humain/effectifs';
import { disponibilite, indexerContrats, offresMarche, scoreMarche, valeurAuPoste } from './index';

type Commander = (c: { type: string; auteur: string; parametres: Record<string, unknown> }) => { ok: true } | { ok: false; motif: string };
const POSTES = PERSONNEL_MARCHE.postes as readonly Poste[];
const arrondi = (x: number) => Math.round(x * 10) / 10;

export function candidatures(monde: Monde): Candidature[] {
  return (Object.values(table(monde, TABLES.candidatures)) as unknown as Candidature[]).sort((a, b) => (a.id < b.id ? -1 : 1));
}

/** Salaire offert par l'IA pour un poste de personnel (même règle que pour les pilotes : audace du team principal et budget). */
function salaireOffert(monde: Monde, e: Ecurie, tp: Personne, p: Personne, poste: Poste): number {
  const audace = (tp.traits['risque'] ?? 10) / 20;
  const budget = Math.min(1, e.budgetMEUR / 400);
  return valeurAuPoste(monde, p, poste) * (OFFRE_MARCHE.min + (OFFRE_MARCHE.max - OFFRE_MARCHE.min) * (0.5 * audace + 0.5 * budget));
}

/** Vivier pour un poste : les personnes qui peuvent l'occuper, présélectionnées sur leur niveau (calcul borné). */
function vivierPoste(monde: Monde, poste: Poste): Personne[] {
  return (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[])
    .filter((p) => p.statut !== 'retraite' && candidatPour(p, poste))
    .map((p) => ({ p, n: niveauMetier(p) }))
    .sort((a, b) => b.n - a.n || (a.p.id < b.p.id ? -1 : 1))
    .slice(0, PLAN_MARCHE.vivier / 2)
    .map((x) => x.p);
}

/**
 * Plan de personnel de l'IA pour le personnel technique et dirigeant (après les pilotes, à chaque tour de la fenêtre).
 * 1. Poste qui se libère pour la saison suivante : offre au meilleur candidat (libre de préférence ; débauchage si nettement meilleur).
 * 2. Une fois par saison (premier tour) : amélioration d'un poste technique clé si un responsable nettement meilleur est accessible.
 */
export function planPersonnel(monde: Monde, commander: Commander): void {
  const debut = monde.date.annee + 1;
  const idx = indexerContrats(monde);
  const recues = candidatures(monde);
  const viviers = new Map(POSTES.map((poste) => [poste, vivierPoste(monde, poste)]));
  for (const e of ecuriesActives(monde)) {
    if (e.pilotee) continue;
    const tp = teamPrincipal(monde, e.id);
    if (!tp) continue;
    for (const poste of POSTES) {
      const enCours = offresMarche(monde).some((o) => o.ecurie === e.id && o.poste === poste && (o.statut === 'en_attente' || o.statut === 'contre_offre' || o.statut === 'acceptee'));
      if (enCours) continue;
      const enPlace = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === e.id && p.poste === poste);
      const libre = placesLibres(monde, e.id, poste, debut) > 0;
      // Révision annuelle de l'effectif, au tour qui suit les candidatures spontanées : faut-il remplacer quelqu'un ? (coût/bénéfice)
      const amelioration = !libre && !!enPlace && monde.date.semaine === FENETRE.debut + 2 * FENETRE.pas;
      if (!libre && !amelioration) continue;
      const notes = (viviers.get(poste) ?? [])
        .filter((p) => p.id !== enPlace?.id)
        .map((p) => {
          const d = disponibilite(monde, p, e, debut, idx, poste);
          if (typeof d === 'string') return null;
          const salaire = salaireOffert(monde, e, tp, p, poste);
          const duree = Math.max(2, dureeContrat(monde, p));
          const bonus = recues.some((c) => c.personne === p.id && c.ecurie === e.id) ? CANDIDATURES.bonusScore : 0;
          return { p, d, salaire, duree, score: scoreMarche(monde, e, tp.id, p, salaire, duree, d.indemniteMEUR, poste) + bonus };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
        .sort((a, b) => b.score - a.score || (a.p.id < b.p.id ? -1 : 1));
      if (!notes.length) continue;
      let choix = notes[0]!;
      if (libre) {
        const meilleurLibre = notes.find((x) => !x.d.debauchage);
        if (choix.d.debauchage && meilleurLibre && choix.score < meilleurLibre.score + PLAN_MARCHE.ecartDebauchage) choix = meilleurLibre;
        commander({ type: 'marche.offre', auteur: tp.id, parametres: { ecurie: e.id, personne: choix.p.id, poste, salaire: arrondi(choix.salaire), duree: choix.duree, debut } });
      } else if (enPlace) {
        // Remplacement : décision coût/bénéfice (balance/marche.ts, REMPLACEMENT) — pas forcément quelqu'un de meilleur,
        // pas de nombre fixe : chaque remplacement déjà décidé cette saison alourdit le coût du suivant.
        const evalues = notes.slice(0, 3).map((x) => ({ x, bilan: bilanRemplacement(monde, e, tp, enPlace, x) })).sort((a, b) => b.bilan.decision - a.bilan.decision);
        const meilleur = evalues[0];
        if (!meilleur || meilleur.bilan.decision <= 0) continue;
        choix = meilleur.x;
        const bilan = meilleur.bilan;
        ajouterEvenement(monde, {
          type: 'marche.remplacement_envisage', acteurs: [{ id: tp.id, role: 'auteur' }, { id: enPlace.id, role: 'en_place' }, { id: choix.p.id, role: 'cible' }, { id: e.id, role: 'organisation' }],
          importance: 1, visibilite: 'prive', contexte: { poste, ...bilan },
        });
        commander({ type: 'marche.offre', auteur: tp.id, parametres: { ecurie: e.id, personne: choix.p.id, poste, salaire: arrondi(choix.salaire), duree: choix.duree, debut, remplace: enPlace.id } });
      }
    }
  }
}

/**
 * Bilan coût/bénéfice du remplacement d'une personne en place par un candidat (en unités du score de recrutement).
 * Le gain compare les deux personnes sur la même grille ; les coûts comptent indemnité, non-concurrence, continuité et instabilité.
 */
export function bilanRemplacement(monde: Monde, e: Ecurie, tp: Personne, enPlace: Personne, c: { p: Personne; d: { indemniteMEUR: number; debauchage: boolean }; salaire: number; duree: number; score: number }): { gain: number; couts: number; decision: number } {
  const contrat = contratEmploi(monde, enPlace.id);
  const restant = contrat ? Math.max(1, contrat.fin - monde.date.annee) : 1;
  const scoreEnPlace = scoreMarche(monde, e, tp.id, enPlace, contrat?.salaireMEUR ?? valeurAuPoste(monde, enPlace, enPlace.poste), restant, 0, enPlace.poste);
  const gain = c.score - scoreEnPlace;
  const reference = Math.max(1, e.budgetMEUR * PERSONNEL_MARCHE.partBudgetPoste * c.duree);
  const indemnite = contrat ? (REMPLACEMENT.poidsIndemnite * indemniteRupture(contrat)) / reference : 0;
  const nonConcurrence = c.d.debauchage
    ? (Math.max(0, niveauMetier(enPlace) - REMPLACEMENT.niveauVacant) / 20) * (PERSONNEL_MARCHE.nonConcurrenceSemaines / 52) / c.duree : 0;
  const dejaCetteSaison = offresMarche(monde).filter((o) => o.ecurie === e.id && o.remplace && o.annee === monde.date.annee && o.statut !== 'retiree' && o.statut !== 'expiree').length;
  const couts = indemnite + nonConcurrence + REMPLACEMENT.continuite + REMPLACEMENT.instabiliteParRemplacement * dejaCetteSaison;
  const seuil = REMPLACEMENT.seuil - REMPLACEMENT.audace * (((tp.traits['risque'] ?? 10) - 10) / 10);
  const jugement = tirageLocal(monde, 'marche.remplacement', e.id, enPlace.id, monde.date.annee).normale(0, REMPLACEMENT.alea);
  const r = (x: number) => Math.round(x * 1000) / 1000;
  return { gain: r(gain), couts: r(couts), decision: r(gain - couts - seuil + jugement) };
}

/* ---------------------------------------------------------------- Candidatures spontanées */

/** Règles d'une candidature (commande dont l'auteur est la personne elle-même). */
export function motifRefusCandidature(monde: Monde, auteur: string, prm: Record<string, unknown>): string | null {
  const p = table(monde, TABLES.personnes)[auteur] as unknown as Personne | undefined;
  if (!p || p.statut === 'retraite') return 'Seule une personne en activité peut proposer ses services.';
  const e = table(monde, TABLES.ecuries)[String(prm['ecurie'] ?? '')] as unknown as Ecurie | undefined;
  if (!e || e.statut !== 'active') return 'Écurie inconnue.';
  if (e.id === p.ecurie) return 'On ne postule pas dans sa propre écurie.';
  const poste = String(prm['poste'] ?? '') as Poste;
  if (!POSTES.includes(poste)) return 'Poste non ouvert aux candidatures.';
  if (!candidatPour(p, poste)) return 'Profil inadapté à ce poste.';
  if ((RANG_POSTE[poste] ?? 0) < (RANG_POSTE[p.poste] ?? 0)) return 'Une candidature vise un poste égal ou supérieur.';
  if (candidatures(monde).filter((c) => c.personne === p.id && c.annee === monde.date.annee).length >= CANDIDATURES.parSaison) return 'Nombre de candidatures de la saison atteint.';
  if (candidatures(monde).some((c) => c.personne === p.id && c.ecurie === e.id && c.annee === monde.date.annee)) return 'Candidature déjà envoyée à cette écurie.';
  return null;
}

export const commandeCandidature: DefinitionCommande = {
  type: 'marche.candidature',
  valider: (monde, c) => motifRefusCandidature(monde, c.auteur, c.parametres),
  appliquer({ monde }, c) {
    const p = table(monde, TABLES.personnes)[c.auteur] as unknown as Personne;
    const cand: Candidature = { id: nouvelIdentifiant(monde, 'cnd'), personne: p.id, ecurie: String(c.parametres['ecurie']), poste: String(c.parametres['poste']) as Poste, annee: monde.date.annee, semaine: monde.date.semaine };
    table(monde, TABLES.candidatures)[cand.id] = cand as unknown as Entite;
    const evt = ajouterEvenement(monde, {
      type: 'marche.candidature', acteurs: [{ id: p.id, role: 'personne' }, { id: cand.ecurie, role: 'organisation' }, ...(p.ecurie ? [{ id: p.ecurie, role: 'employeur' }] : [])],
      importance: 2, visibilite: 'prive', contexte: { candidature: cand.id, poste: cand.poste },
      texte: `${p.prenom} ${p.nom} propose ses services à ${(table(monde, TABLES.ecuries)[cand.ecurie] as unknown as Ecurie).nom} (${cand.poste.replace(/_/g, ' ')}).`,
    });
    // Son employeur peut l'apprendre : la confiance du team principal s'en ressent.
    const tp = p.ecurie ? teamPrincipal(monde, p.ecurie) : undefined;
    if (tp && tirageLocal(monde, 'marche.candidature.fuite', cand.id).chance(0.3)) lireEvenement(monde, tp.id, p.id, 'trahison', evt.id, { facteur: 0.3 });
  },
};

/** Les personnes ambitieuses et lassées proposent leurs services là où un poste égal ou supérieur se libère (début de fenêtre). */
export function candidaturesSpontanees(monde: Monde, commander: Commander): void {
  const debut = monde.date.annee + 1;
  const ecuries = ecuriesActives(monde).sort((a, b) => forceEcurie(monde, b.id) - forceEcurie(monde, a.id) || (a.id < b.id ? -1 : 1));
  const personnes = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[])
    .filter((p) => p.statut === 'actif' && POSTES.includes(p.poste) && (p.traits['ambition'] ?? 10) >= CANDIDATURES.ambitionMin)
    .sort((a, b) => (a.id < b.id ? -1 : 1));
  for (const p of personnes) {
    if (lassitude(monde, p).niveau < CANDIDATURES.lassitudeMin) continue;
    let envoyees = 0;
    for (const e of ecuries) {
      if (envoyees >= CANDIDATURES.parSaison || e.id === p.ecurie) continue;
      const poste = POSTES.filter((x) => (RANG_POSTE[x] ?? 0) >= (RANG_POSTE[p.poste] ?? 0) && candidatPour(p, x) && placesLibres(monde, e.id, x, debut) > 0)
        .sort((a, b) => (RANG_POSTE[b] ?? 0) - (RANG_POSTE[a] ?? 0))[0];
      if (!poste) continue;
      if (commander({ type: 'marche.candidature', auteur: p.id, parametres: { ecurie: e.id, poste } }).ok) envoyees++;
    }
  }
}
