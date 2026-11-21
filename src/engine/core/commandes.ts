/**
 * Commandes (voir docs/architecture.md §5).
 *
 * Toute action d'un acteur (joueur ou IA) est une commande, validée par les MÊMES règles
 * pour tous (principe 3 du game design). Une commande refusée donne un motif lisible.
 *
 * - Commandes extérieures (joueur, outils) : mises en file, appliquées au début du pas suivant,
 *   et journalisées pour pouvoir rejouer la partie.
 * - Commandes de l'IA : appliquées immédiatement pendant le pas. Elles ne sont pas journalisées :
 *   elles se recalculent à l'identique quand on rejoue.
 */

import type { Monde } from './monde';

export interface Commande {
  /** Type de commande, ex. « organisation.renommer ». */
  type: string;
  /** Identifiant de l'acteur qui la passe (personne, organisation, ou « outil »). */
  auteur: string;
  /** Origine : le joueur (ou un outil extérieur), ou l'IA. */
  source: 'exterieur' | 'ia';
  parametres: Record<string, unknown>;
}

export interface ContexteCommande {
  monde: Monde;
}

export interface DefinitionCommande {
  type: string;
  /** Renvoie null si la commande est valide, sinon un motif de refus lisible (en français). */
  valider(monde: Monde, commande: Commande): string | null;
  /** Applique la commande (et produit ses événements). Appelée seulement si elle est valide. */
  appliquer(ctx: ContexteCommande, commande: Commande): void;
}

export type ResultatCommande = { ok: true } | { ok: false; motif: string };

export class RegistreCommandes {
  private readonly definitions = new Map<string, DefinitionCommande>();

  enregistrer(def: DefinitionCommande): this {
    if (this.definitions.has(def.type)) throw new Error(`Commande déjà enregistrée : ${def.type}`);
    this.definitions.set(def.type, def);
    return this;
  }

  /** Valide puis applique une commande, tout de suite. */
  executer(monde: Monde, commande: Commande): ResultatCommande {
    const def = this.definitions.get(commande.type);
    if (!def) return { ok: false, motif: `Commande inconnue : ${commande.type}` };
    const motif = def.valider(monde, commande);
    if (motif !== null) return { ok: false, motif };
    def.appliquer({ monde }, commande);
    return { ok: true };
  }

  /** Vérifie une commande sans l'appliquer (pour l'interface : griser un bouton, expliquer pourquoi). */
  verifier(monde: Monde, commande: Commande): ResultatCommande {
    const def = this.definitions.get(commande.type);
    if (!def) return { ok: false, motif: `Commande inconnue : ${commande.type}` };
    const motif = def.valider(monde, commande);
    return motif === null ? { ok: true } : { ok: false, motif };
  }
}

/** Met une commande extérieure en file : elle sera appliquée au début du prochain pas. */
export function soumettreCommande(monde: Monde, commande: Commande): void {
  if (commande.source !== 'exterieur') throw new Error('Seules les commandes extérieures passent par la file');
  monde.fileCommandes.push(structuredClone(commande));
}
