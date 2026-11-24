/**
 * Interactions humaines (phase 4, D-070) : soutenir, critiquer, féliciter (en public ou en privé), s'excuser,
 * reconnaître une erreur, discuter en privé, statut de n°1, licenciement, demandes d'augmentation.
 * Les mêmes commandes servent au joueur (bac à sable) et à l'IA des team principals.
 * Effets saisonniers : défaite face au coéquipier, réussite collective.
 */

import { DEMANDE_AUGMENTATION, REACTION_TEAM_PRINCIPAL, SEUIL_AUGMENTATION } from '../../balance/contrats';
import { SATURATION } from '../../balance/memoire';
import type { Commande, DefinitionCommande } from '../../core/commandes';
import { rangSemaine } from '../../core/calendrier';
import { ajouterEvenement, type Evenement } from '../../core/evenements';
import { idsTries, table, type Entite, type Monde } from '../../core/monde';
import { tirageLocal, type Moteur, type Systeme } from '../../core/moteur';
import { TABLES, type Contrat, type Ecurie, type Personne, type Saison } from '../../model/types';
import { noterContact, lireEvenement, reconcilier, relation, relationBrute } from '../memoire';
import { contratEmploi, indemniteRupture, liberer, personneDe } from './contrats';
import { niveauMetier, teamPrincipal, valeurMarche } from './decision';
import { domainePoste, iaDecide } from '../joueur/acces';

const nom = (p: Personne) => `${p.prenom} ${p.nom}`;

/** Une critique est-elle justifiée ? Pilote : nettement battu par son coéquipier cette saison. Autres : niveau faible. */
export function performanceInsuffisante(monde: Monde, p: Personne): boolean {
  if (p.poste === 'pilote_titulaire') {
    const s = table(monde, TABLES.saisons)[`ssn_${monde.date.annee}`] as unknown as Saison | undefined;
    const moi = s?.pilotes.find((l) => l.pilote === p.id);
    const coequipier = s?.pilotes.find((l) => l.ecurie === p.ecurie && l.pilote !== p.id);
    if (!moi || !coequipier) return false;
    return moi.points < 0.7 * coequipier.points && coequipier.points - moi.points >= 15;
  }
  return niveauMetier(p) < 12;
}

/** Dernière interaction du même type entre les mêmes personnes : sert à la saturation. */
function interactionRecente(monde: Monde, type: string, auteur: string, cible: string): boolean {
  const limite = rangSemaine(monde.date) - SATURATION.semaines;
  return Object.values(monde.evenements).some((e) => e.type === type && rangSemaine(e.date) >= limite && e.acteurs.some((a) => a.id === auteur && a.role === 'auteur') && e.acteurs.some((a) => a.id === cible && a.role === 'cible'));
}

function evenementInteraction(monde: Monde, type: string, auteur: Personne, cible: Personne, publique: boolean, contexte: Record<string, unknown>, texte?: string): Evenement {
  return ajouterEvenement(monde, {
    type, acteurs: [{ id: auteur.id, role: 'auteur' }, { id: cible.id, role: 'cible' }, { id: cible.ecurie, role: 'organisation' }],
    importance: publique ? 3 : 2, visibilite: publique ? 'public' : 'prive', contexte: { publique, ...contexte }, ...(texte ? { texte } : {}),
  });
}

const changerConfiance = (p: Personne, delta: number) => (p.etat.confiance = Math.max(0, Math.min(100, p.etat.confiance + delta)));

/* ------------------------------------------------------------------ Actions élémentaires (utilisées par les commandes) */

export function soutenir(monde: Monde, auteur: Personne, cible: Personne, publique: boolean): Evenement {
  const fragile = Math.max(0, (60 - cible.etat.confiance) / 60);
  const evt = evenementInteraction(monde, 'personnel.soutien', auteur, cible, publique, {}, publique ? `${nom(auteur)} soutient publiquement ${nom(cible)}.` : undefined);
  const recent = interactionRecente(monde, 'personnel.soutien', auteur.id, cible.id);
  lireEvenement(monde, cible.id, auteur.id, 'soutien', evt.id, { facteur: (publique ? 1.1 : 0.9) * (1 + fragile) * (recent ? 0.5 : 1) });
  changerConfiance(cible, (publique ? 6 : 4) * (recent ? 0.3 : 1));
  return evt;
}

export function critiquer(monde: Monde, auteur: Personne, cible: Personne, publique: boolean): Evenement {
  const justifiee = performanceInsuffisante(monde, cible);
  const evt = evenementInteraction(monde, 'personnel.critique', auteur, cible, publique, { justifiee }, publique ? `${nom(auteur)} critique publiquement ${nom(cible)}.` : undefined);
  if (publique) {
    lireEvenement(monde, cible.id, auteur.id, justifiee ? 'critique_dure' : 'humiliation', evt.id);
    // Une forte remise en question oriente aussi vers soi (sans tout accepter : la critique laisse quand même une trace).
    if (justifiee && (cible.traits['remiseEnQuestion'] ?? 10) >= 13) lireEvenement(monde, cible.id, cible.id, 'echec_personnel', evt.id, { facteur: 0.8 });
    changerConfiance(cible, justifiee ? -5 : -8);
  } else {
    lireEvenement(monde, cible.id, auteur.id, justifiee ? 'critique_constructive' : 'manque_respect', evt.id);
    changerConfiance(cible, justifiee ? -1 : -3);
  }
  return evt;
}

export function feliciter(monde: Monde, auteur: Personne, cible: Personne, publique: boolean): Evenement {
  const evt = evenementInteraction(monde, 'personnel.felicitations', auteur, cible, publique, {});
  const recent = interactionRecente(monde, 'personnel.felicitations', auteur.id, cible.id);
  lireEvenement(monde, cible.id, auteur.id, 'reconnaissance', evt.id, { facteur: (publique ? 0.6 : 0.45) * (recent ? 0.3 : 1) });
  changerConfiance(cible, recent ? 0.5 : 2);
  return evt;
}

export function reparer(monde: Monde, auteur: Personne, cible: Personne, type: 'excuses' | 'reconnaissanceErreur' | 'discussionPrivee', publique: boolean): Evenement {
  const typeEvt = { excuses: 'personnel.excuses', reconnaissanceErreur: 'personnel.reconnaissance_erreur', discussionPrivee: 'personnel.discussion_privee' }[type];
  const evt = evenementInteraction(monde, typeEvt, auteur, cible, publique, {});
  const recent = interactionRecente(monde, typeEvt, auteur.id, cible.id);
  const reduit = reconcilier(monde, cible.id, auteur.id, type, recent);
  if (type !== 'discussionPrivee' && reduit > 0) lireEvenement(monde, cible.id, auteur.id, 'excuses_recues', evt.id, { facteur: (publique ? 1.2 : 1) * (recent ? 0.3 : 1) });
  if (type === 'discussionPrivee') {
    const r = relationBrute(monde, cible.id, auteur.id, true);
    if (r) { r.familiarite = Math.min(1, r.familiarite + (recent ? 0.01 : 0.05)); noterContact(monde, r); }
  }
  return evt;
}

export function changerStatutN1(monde: Monde, auteur: Personne, pilote: Personne, accorder: boolean): Evenement | null {
  const c = contratEmploi(monde, pilote.id);
  if (!c || !!c.clauses.statutN1 === accorder) return null;
  c.clauses.statutN1 = accorder;
  const evt = evenementInteraction(monde, accorder ? 'pilote.statut_n1_accorde' : 'pilote.statut_n1_retire', auteur, pilote, true, {},
    `${nom(auteur)} ${accorder ? 'accorde' : 'retire'} le statut de n°1 à ${nom(pilote)}.`);
  if (accorder) {
    lireEvenement(monde, pilote.id, auteur.id, 'reconnaissance', evt.id);
    for (const autre of Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]) {
      if (autre.ecurie === pilote.ecurie && autre.poste === 'pilote_titulaire' && autre.id !== pilote.id && autre.statut === 'actif') {
        lireEvenement(monde, autre.id, auteur.id, 'injustice', evt.id, { facteur: 0.6 + (autre.traits['ambition'] ?? 10) / 20 });
        lireEvenement(monde, autre.id, pilote.id, 'rivalite', evt.id);
      }
    }
  } else {
    const promis = Object.values(table(monde, 'promesses')).some((x) => {
      const p = x as unknown as { beneficiaire: string; type: string; statut: string };
      return p.beneficiaire === pilote.id && p.type === 'statut_n1' && p.statut === 'en_cours';
    });
    lireEvenement(monde, pilote.id, auteur.id, 'trahison', evt.id, { facteur: promis ? 1.5 : 1 });
  }
  return evt;
}

export function licencier(monde: Monde, auteur: Personne, cible: Personne): Evenement {
  const justifie = performanceInsuffisante(monde, cible);
  const c = contratEmploi(monde, cible.id) as Contrat;
  const ecurieId = cible.ecurie;
  const evt = ajouterEvenement(monde, {
    type: 'contrat.licenciement', acteurs: [{ id: auteur.id, role: 'auteur' }, { id: cible.id, role: 'cible' }, { id: ecurieId, role: 'organisation' }],
    importance: 3, visibilite: 'public', contexte: { justifie, indemnite: indemniteRupture(c) },
    texte: `${nom(auteur)} licencie ${nom(cible)}.`,
  });
  lireEvenement(monde, cible.id, auteur.id, justifie ? 'humiliation' : 'injustice', evt.id, { facteur: 1.2 });
  lireEvenement(monde, cible.id, ecurieId, 'trahison', evt.id, { facteur: justifie ? 0.5 : 0.9 });
  // Les proches de la personne licenciée jugent la décision.
  for (const autre of Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]) {
    if (autre.ecurie !== ecurieId || autre.statut !== 'actif' || autre.id === cible.id || autre.id === auteur.id) continue;
    const r = relation(monde, autre.id, cible.id);
    if (r.affinite > 0.2) lireEvenement(monde, autre.id, auteur.id, 'injustice', evt.id, { facteur: r.affinite * 2 * (justifie ? 0.4 : 1) });
  }
  liberer(monde, cible, c, 'licenciement', [evt.id]);
  return evt;
}

/** Réponse à une demande d'augmentation en attente. */
export function repondreAugmentation(monde: Monde, auteur: Personne, cible: Personne, accepter: boolean, justification: boolean): Evenement {
  const c = contratEmploi(monde, cible.id) as Contrat;
  const demande = c.demandeAugmentation ?? c.salaireMEUR;
  delete c.demandeAugmentation;
  const evt = evenementInteraction(monde, accepter ? 'augmentation.accordee' : 'augmentation.refusee', auteur, cible, false, { demande, justification });
  if (accepter) {
    c.salaireMEUR = Math.round(demande * 10) / 10;
    lireEvenement(monde, cible.id, auteur.id, 'reconnaissance', evt.id);
  } else {
    lireEvenement(monde, cible.id, auteur.id, 'manque_reconnaissance', evt.id, { facteur: justification ? 0.6 : 1 });
  }
  return evt;
}

/* ------------------------------------------------------------------ Commandes */

function commande(type: string, appliquer: (monde: Monde, auteur: Personne, cible: Personne, c: Commande) => void, validerEnPlus?: (monde: Monde, cible: Personne, c: Commande) => string | null): DefinitionCommande {
  return {
    type,
    valider(monde, c) {
      const cible = personneDe(monde, String(c.parametres['personne'] ?? ''));
      if (!cible || cible.statut !== 'actif') return 'Personne inconnue ou sans poste.';
      const tp = teamPrincipal(monde, cible.ecurie);
      if (!tp || tp.id !== c.auteur) return 'Seul le team principal de son écurie peut faire cela.';
      if (cible.id === c.auteur) return 'Impossible envers soi-même.';
      return validerEnPlus ? validerEnPlus(monde, cible, c) : null;
    },
    appliquer({ monde }, c) {
      const cible = personneDe(monde, String(c.parametres['personne'])) as Personne;
      appliquer(monde, personneDe(monde, c.auteur) as Personne, cible, c);
    },
  };
}

export const COMMANDES_INTERACTIONS: DefinitionCommande[] = [
  commande('personnel.soutenir', (m, a, p, c) => void soutenir(m, a, p, !!c.parametres['publique'])),
  commande('personnel.critiquer', (m, a, p, c) => void critiquer(m, a, p, !!c.parametres['publique'])),
  commande('personnel.feliciter', (m, a, p, c) => void feliciter(m, a, p, !!c.parametres['publique'])),
  commande('personnel.excuses', (m, a, p, c) => void reparer(m, a, p, 'excuses', !!c.parametres['publique'])),
  commande('personnel.reconnaitre_erreur', (m, a, p, c) => void reparer(m, a, p, 'reconnaissanceErreur', !!c.parametres['publique'])),
  commande('personnel.discussion_privee', (m, a, p) => void reparer(m, a, p, 'discussionPrivee', false)),
  commande('pilote.statut_n1', (m, a, p, c) => void changerStatutN1(m, a, p, !!c.parametres['accorder']),
    (m, p, c) => (p.poste !== 'pilote_titulaire' ? 'Réservé aux pilotes titulaires.' : !!contratEmploi(m, p.id)?.clauses.statutN1 === !!c.parametres['accorder'] ? 'Rien ne change.' : null)),
  commande('contrat.licencier', (m, a, p) => void licencier(m, a, p)),
  commande('contrat.repondre_augmentation', (m, a, p, c) => void repondreAugmentation(m, a, p, !!c.parametres['accepter'], !!c.parametres['justification']),
    (m, p) => ((contratEmploi(m, p.id) as Contrat)?.demandeAugmentation === undefined ? 'Aucune demande d’augmentation en attente.' : null)),
];

/* ------------------------------------------------------------------ IA : demandes d'augmentation et réactions du team principal */

export const systemeVieDuPersonnel: Systeme = {
  nom: 'humain.vieDuPersonnel',
  phases: ['saison'],
  executer({ monde, date }) {
    if (date.semaine % 4 !== 2) return;
    const tp = table(monde, TABLES.personnes);
    const dirigeants = new Map<string, Personne>();
    for (const id of idsTries(tp)) {
      const p = tp[id] as unknown as Personne;
      if (p.statut === 'actif' && p.poste === 'team_principal' && p.ecurie && !dirigeants.has(p.ecurie)) dirigeants.set(p.ecurie, p);
    }
    for (const id of idsTries(tp)) {
      const p = tp[id] as unknown as Personne;
      if (p.statut !== 'actif' || !p.ecurie || p.poste === 'team_principal') continue;
      const dirigeant = dirigeants.get(p.ecurie);
      if (!dirigeant) continue;
      // Phase 10 : dans l'écurie du joueur, l'IA ne répond et ne réagit que pour un domaine délégué (pilotes ou personnel).
      const ecuriePilotee = !iaDecide(table(monde, TABLES.ecuries)[p.ecurie] as unknown as Ecurie, domainePoste(p.poste));
      const f = tirageLocal(monde, 'vie', p.id, date.annee, date.semaine);
      const c = contratEmploi(monde, p.id) as Contrat | undefined;
      // Demande d'augmentation : personne sous-payée, ambitieuse, pas déjà en demande.
      if (c && c.demandeAugmentation === undefined && c.salaireMEUR < DEMANDE_AUGMENTATION.seuilSousPaye * valeurMarche(monde, p)
        && f.chance(DEMANDE_AUGMENTATION.probabiliteMensuelle * ((p.traits['ambition'] ?? 10) / 10))) {
        c.demandeAugmentation = Math.round(c.salaireMEUR * (1 + DEMANDE_AUGMENTATION.hausseDemandee) * 10) / 10;
        const evt = ajouterEvenement(monde, { type: 'augmentation.demandee', acteurs: [{ id: p.id, role: 'auteur' }, { id: dirigeant.id, role: 'cible' }], importance: 1, visibilite: 'prive', contexte: { demande: c.demandeAugmentation } });
        if (!ecuriePilotee) {
          // Réponse de l'IA : accepte si la personne vaut la dépense ; la loyauté du TP l'y pousse, le budget l'en retient.
          const budgetSerre = (table(monde, TABLES.ecuries)[p.ecurie] as unknown as { budgetMEUR: number }).budgetMEUR < 320;
          const envie = niveauMetier(p) / 20 + ((dirigeant.traits['loyaute'] ?? 10) - 10) / 40 - (budgetSerre ? 0.15 : 0) + f.normale(0, 0.08);
          repondreAugmentation(monde, dirigeant, p, envie > SEUIL_AUGMENTATION, budgetSerre || performanceInsuffisante(monde, p));
          void evt;
        }
      }
      // Réaction du TP (IA) à un pilote en difficulté : soutien ou critique, en privé ou en public, selon sa personnalité.
      if (!ecuriePilotee && p.poste === 'pilote_titulaire' && performanceInsuffisante(monde, p) && f.chance(REACTION_TEAM_PRINCIPAL.probabiliteMensuelle)) {
        const dur = ((dirigeant.traits['temperament'] ?? 10) - (dirigeant.traits['loyaute'] ?? 10) + (dirigeant.traits['ambition'] ?? 10) - 10) / 20;
        const publique = f.chance(0.2 + 0.3 * ((dirigeant.traits['temperament'] ?? 10) / 20));
        if (f.suivant() < 0.5 + dur) critiquer(monde, dirigeant, p, publique);
        else soutenir(monde, dirigeant, p, publique);
      }
    }
  },
};

/** Fin de saison : défaites face au coéquipier, réussites collectives, saisons ratées (souvenirs envers soi-même). */
export const systemeBilanHumain: Systeme = {
  nom: 'humain.bilanSaison',
  phases: ['finDeSaison'],
  executer({ monde, date }) {
    if (date.semaine !== 49) return;
    const s = table(monde, TABLES.saisons)[`ssn_${date.annee}`] as unknown as Saison | undefined;
    if (!s?.termine) return;
    const evt = ajouterEvenement(monde, { type: 'saison.bilan_humain', acteurs: [], importance: 1, contexte: { saison: date.annee } });
    const parEcurie = new Map<string, string[]>();
    for (const l of s.pilotes) parEcurie.set(l.ecurie, [...(parEcurie.get(l.ecurie) ?? []), l.pilote]);
    for (const [ecurie, pilotes] of parEcurie) {
      if (pilotes.length !== 2) continue;
      const [a, b] = pilotes as [string, string];
      const la = s.pilotes.find((l) => l.pilote === a)!, lb = s.pilotes.find((l) => l.pilote === b)!;
      const [perdant, gagnant] = la.points < lb.points ? [a, b] : [b, a];
      const ecart = Math.abs(la.points - lb.points);
      if (ecart >= 30) {
        lireEvenement(monde, perdant, gagnant, 'rivalite', evt.id, { facteur: Math.min(1.5, ecart / 100 + 0.5) });
        const pp = personneDe(monde, perdant);
        if (pp && (pp.traits['remiseEnQuestion'] ?? 10) >= 12) lireEvenement(monde, perdant, perdant, 'echec_personnel', evt.id, { facteur: 0.7 });
      }
      void ecurie;
    }
    // Réussite collective : titre constructeurs ou forte progression → toute l'écurie s'en souvient.
    const champion = s.constructeurs[0]?.ecurie;
    for (const p of Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]) {
      if (p.statut !== 'actif' || p.ecurie !== champion) continue;
      lireEvenement(monde, p.id, p.ecurie, 'reussite_commune', evt.id, { facteur: 1.2 });
      const tp = teamPrincipal(monde, p.ecurie);
      if (tp && tp.id !== p.id) lireEvenement(monde, p.id, tp.id, 'reussite_commune', evt.id, { facteur: 0.8 });
    }
  },
};

export function installerInteractions(moteur: Moteur): Moteur {
  moteur.ajouterSysteme(systemeVieDuPersonnel).ajouterSysteme(systemeBilanHumain);
  for (const c of COMMANDES_INTERACTIONS) moteur.commandes.enregistrer(c);
  return moteur;
}

export type { Entite };
