/**
 * Mode développeur (D-108) : modifier les notes d'une personne (compétence, potentiel, trait) pendant une partie.
 * Comme toute modification de l'état, cela passe par une commande du moteur : validée, journalisée (donc rejouable),
 * et tracée par un événement. Réservée aux outils (auteur « developpeur ») : l'IA ne l'utilise jamais.
 */

import { TRAITS } from '../balance/personnages';
import type { DefinitionCommande } from '../core/commandes';
import { ajouterEvenement } from '../core/evenements';
import type { Moteur } from '../core/moteur';
import { table } from '../core/monde';
import { TABLES, type Personne } from '../model/types';

export const AUTEUR_DEVELOPPEUR = 'developpeur';
const BORNES = { min: 1, max: 20 };

export const commandeModifierPersonne: DefinitionCommande = {
  type: 'dev.modifier_personne',
  valider(monde, c) {
    if (c.auteur !== AUTEUR_DEVELOPPEUR || c.source !== 'exterieur') return 'Commande réservée au mode développeur.';
    const p = table(monde, TABLES.personnes)[String(c.parametres['personne'] ?? '')] as unknown as Personne | undefined;
    if (!p) return 'Personne inconnue.';
    const champ = String(c.parametres['champ'] ?? '');
    const cle = String(c.parametres['cle'] ?? '');
    const valeur = Number(c.parametres['valeur']);
    if (!(valeur >= BORNES.min && valeur <= BORNES.max)) return `La valeur doit être comprise entre ${BORNES.min} et ${BORNES.max}.`;
    if (champ === 'competence' && p.competences[cle] === undefined) return `Compétence inconnue pour cette personne : ${cle}.`;
    if (champ === 'trait' && !(cle in TRAITS)) return `Trait inconnu : ${cle}.`;
    if (!['competence', 'trait', 'potentiel'].includes(champ)) return 'Champ modifiable : competence, trait ou potentiel.';
    return null;
  },
  appliquer({ monde }, c) {
    const p = table(monde, TABLES.personnes)[String(c.parametres['personne'])] as unknown as Personne;
    const champ = String(c.parametres['champ']);
    const cle = String(c.parametres['cle'] ?? '');
    const valeur = Math.round(Number(c.parametres['valeur']) * 10) / 10;
    let avant: number;
    if (champ === 'competence') { avant = p.competences[cle]!; p.competences[cle] = valeur; }
    else if (champ === 'trait') { avant = p.traits[cle] ?? 10; p.traits[cle] = Math.round(valeur); }
    else { avant = p.potentiel; p.potentiel = Math.round(valeur); }
    ajouterEvenement(monde, {
      type: 'dev.modification', acteurs: [{ id: p.id, role: 'personne' }], importance: 1, visibilite: 'prive',
      contexte: { champ, cle, avant, apres: champ === 'competence' ? valeur : Math.round(valeur) },
    });
  },
};

export function installerDeveloppeur(moteur: Moteur): Moteur {
  moteur.commandes.enregistrer(commandeModifierPersonne);
  return moteur;
}
