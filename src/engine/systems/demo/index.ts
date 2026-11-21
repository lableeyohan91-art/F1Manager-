/**
 * Systèmes et commande de DÉMONSTRATION (phase 1).
 *
 * Ils n'ont aucune règle de jeu : ils servent uniquement à faire tourner et tester le noyau
 * (événements, chaînes de causes, flux de hasard, agenda, compactage, commandes).
 * Ils seront retirés quand les vrais systèmes arriveront.
 */

import { ajouterEvenement, type Evenement } from '../../core/evenements';
import { planifier, type Moteur, type Systeme } from '../../core/moteur';
import { table, type Monde } from '../../core/monde';
import type { DefinitionCommande } from '../../core/commandes';

/** Produit un événement mineur par semaine, et un événement majeur par saison, chaîné au précédent. */
export const systemeChronometre: Systeme = {
  nom: 'demo.chronometre',
  executer({ monde, date }) {
    ajouterEvenement(monde, {
      type: 'demo.semaine',
      acteurs: [],
      importance: 1,
      contexte: { semaine: date.semaine },
    });
    if (date.semaine === 52) {
      const precedent = Object.values(monde.evenements)
        .filter((e: Evenement) => e.type === 'demo.saison')
        .at(-1);
      ajouterEvenement(monde, {
        type: 'demo.saison',
        acteurs: [],
        importance: 4,
        causes: precedent ? [precedent.id] : [],
        texte: `Fin de la saison ${date.annee}`,
      });
    }
  },
};

/** Tire des nombres dans son propre flux et produit parfois un événement notable. */
export const systemeHasard: Systeme = {
  nom: 'demo.hasard',
  phases: ['saison'],
  executer({ monde, flux }) {
    const f = flux('demo.hasard');
    const tirage = f.suivant();
    const compteur = table(monde, 'demo');
    const c = (compteur['compteur'] ?? { id: 'compteur', tirages: 0, somme: 0 }) as {
      id: string;
      tirages: number;
      somme: number;
    };
    c.tirages++;
    c.somme += tirage;
    compteur['compteur'] = c;
    if (tirage < 0.05) {
      ajouterEvenement(monde, { type: 'demo.rare', acteurs: [], importance: 3, contexte: { tirage } });
    }
  },
};

/** Planifie un rendez-vous annuel et réagit quand il échoit. */
export const systemeAgenda: Systeme = {
  nom: 'demo.agenda',
  executer({ monde, date, rendezVous }) {
    for (const r of rendezVous) {
      if (r.type === 'demo.anniversaire') {
        ajouterEvenement(monde, { type: 'demo.anniversaire', acteurs: [], importance: 2 });
      }
    }
    if (date.semaine === 1) planifier(monde, { annee: date.annee, semaine: 26 }, 'demo.anniversaire');
  },
};

/** Commande de démonstration : renommer une organisation. */
export const commandeRenommer: DefinitionCommande = {
  type: 'organisation.renommer',
  valider(monde: Monde, c) {
    const id = c.parametres['organisation'];
    const nom = c.parametres['nom'];
    if (typeof id !== 'string' || !monde.tables['organisations']?.[id]) return "Cette organisation n'existe pas.";
    if (typeof nom !== 'string' || nom.trim().length < 2) return 'Le nouveau nom doit contenir au moins 2 caractères.';
    return null;
  },
  appliquer({ monde }, c) {
    const id = c.parametres['organisation'] as string;
    const org = table(monde, 'organisations')[id] as { id: string; nom: string };
    const ancien = org.nom;
    org.nom = (c.parametres['nom'] as string).trim();
    ajouterEvenement(monde, {
      type: 'organisation.renommee',
      acteurs: [{ id, role: 'cible' }, { id: c.auteur, role: 'auteur' }],
      importance: 3,
      contexte: { ancien, nouveau: org.nom },
    });
  },
};

export function installerDemo(moteur: Moteur): Moteur {
  moteur.ajouterSysteme(systemeChronometre).ajouterSysteme(systemeHasard).ajouterSysteme(systemeAgenda);
  moteur.commandes.enregistrer(commandeRenommer);
  return moteur;
}
