/** Phase 8d-4 — accès à la fédération et aux alliances (module sans dépendance vers les autres systèmes). */

import { GRANDS_PRIX_PAR_SAISON } from '../../balance/reglement';
import { parametre, table, type Monde } from '../../core/monde';
import { TABLES } from '../../model/types';

export interface Federation {
  id: 'federation';
  president?: string;
  nomPresident?: string;
  debutMandat: number;
  finMandat: number;
  orientationPreferee?: string;
  /** −1 à 1 : un président rigoureux propose de baisser le plafond budgétaire. */
  rigueur: number;
  /** 0 à 1 : poids du lobbying auprès de lui. */
  sensibiliteLobbying: number;
  /** Pressions de lobbying par orientation pour la prochaine préparation de réformes (remises à zéro ensuite). */
  lobbying: Record<string, number>;
  /** Écuries qui ont déjà fait pression pour cette préparation. */
  lobbyistes: string[];
  /** Valeurs votées des règles (servent de valeur par défaut ; un réglage d'expérience les remplace). */
  regles: Record<string, number>;
  /** Règles votées qui prendront effet la saison suivante. */
  reglesAVenir?: Record<string, number>;
  /** Élection ou vote en cours (candidats, bulletins des écuries). */
  election?: { annee: number; candidats: string[]; votes: Record<string, string> };
  vote?: { annee: number; sujet: string; valeur: number; votes: Record<string, boolean>; evenement?: string };
  historique: { annee: number; type: string; resultat: string }[];
}

export interface Alliance {
  id: string;
  ecuries: string[];
  motif: 'motoriste' | 'partenaire' | 'affinite';
  depuis: number;
}

export const federation = (monde: Monde) => table(monde, TABLES.federation)['federation'] as unknown as Federation | undefined;

/** Valeur votée d'une règle (ou la valeur par défaut). */
export function regleVotee(monde: Monde, nom: string, defaut: number): number {
  return federation(monde)?.regles[nom] ?? defaut;
}

/** D-141 : nombre de Grands Prix de la saison (réglage d'expérience, sinon valeur votée, sinon valeur de départ). */
export function nombreGrandsPrix(monde: Monde): number {
  return parametre(monde, 'reglement.grandsPrix', regleVotee(monde, 'grandsPrix', GRANDS_PRIX_PAR_SAISON));
}

/** Poids de tirage des orientations des prochaines réformes : président et lobbying (1 par défaut). */
export function poidsOrientation(monde: Monde, orientation: string, bonusPresident: number): number {
  const f = federation(monde);
  if (!f) return 1;
  return 1 + (f.orientationPreferee === orientation ? bonusPresident : 0) + (f.lobbying[orientation] ?? 0);
}

/** Alliés d'une écurie (toutes alliances confondues). */
export function allies(monde: Monde, idEcurie: string): string[] {
  const res = new Set<string>();
  for (const a of Object.values(table(monde, TABLES.alliances)) as unknown as Alliance[]) if (a.ecuries.includes(idEcurie)) for (const e of a.ecuries) if (e !== idEcurie) res.add(e);
  return [...res].sort();
}
