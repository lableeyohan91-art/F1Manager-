/**
 * Phase 12b — soufflerie et CFD (fiche principale §5, D-170 Q6) : allocation selon le barème réel, répartition chaque semaine entre les
 * projets aéro et la recherche, efficacité d'une heure. Les heures non utilisées sont perdues (aucun report, aucun transfert).
 */

import { PIECES, SOUFFLERIE, type TypePiece } from '../../balance/monoplaces';
import { parametre, table, type Monde } from '../../core/monde';
import { TABLES, type Ecurie, type Finances, type Installation, type Personne, type ProjetConception } from '../../model/types';
import { restrictionAero } from '../economie';

const financesDe = (m: Monde, id: string) => (Object.values(table(m, TABLES.finances)) as unknown as Finances[]).find((f) => f.ecurie === id);

/** Part du barème (1 = 100 %) d'une écurie cette semaine : classement, amplification déclarée (D-169), sanction d'un dépassement du plafond. */
export function bareme(monde: Monde, idEcurie: string): number {
  const b = 1 + parametre(monde, 'soufflerie.amplification', SOUFFLERIE.amplification) * (restrictionAero(monde, idEcurie) - 1);
  return Math.max(0, b) * (1 - (financesDe(monde, idEcurie)?.sanctionAero ?? 0));
}

/** Allocation de la semaine (heures de vent, unités de CFD). */
export function allocationSemaine(monde: Monde, idEcurie: string): { heures: number; cfd: number } {
  const f = (SOUFFLERIE.periodesParAn / 52) * bareme(monde, idEcurie);
  return { heures: SOUFFLERIE.heuresParPeriode * f, cfd: SOUFFLERIE.cfdParPeriode * f };
}

/** Allocation d'une période réglementaire (affichage). */
export function allocationPeriode(monde: Monde, idEcurie: string): { heures: number; cfd: number; bareme: number } {
  const b = bareme(monde, idEcurie);
  return { heures: SOUFFLERIE.heuresParPeriode * b, cfd: SOUFFLERIE.cfdParPeriode * b, bareme: b };
}

/** Efficacité d'une heure : installations, compétence du responsable aéro, fraîcheur du pôle aéro (12b). */
export function efficaciteHeure(monde: Monde, idEcurie: string, type: 'soufflerie' | 'cfd', fraicheur = 1): number {
  const inst = (Object.values(table(monde, TABLES.installations)) as unknown as Installation[]).find((i) => i.ecurie === idEcurie && i.type === type);
  const resp = (Object.values(table(monde, TABLES.personnes)) as unknown as Personne[]).find((p) => p.statut === 'actif' && p.ecurie === idEcurie && p.poste === 'responsable_aero');
  const comp = ((resp?.competences['aerodynamique'] ?? 10) + (resp?.competences['correlation'] ?? 10)) / 40;
  return (SOUFFLERIE.qualiteBase + SOUFFLERIE.qualiteParNiveau * (inst?.niveau ?? 5)) * (SOUFFLERIE.competenceBase + SOUFFLERIE.competenceAmplitude * comp) * fraicheur;
}

/**
 * Répartition hebdomadaire : la part « recherche » s'ajoute aux heures de recherche de l'écurie, le reste est partagé à parts égales
 * entre ses projets aéro en conception (sans projet aéro, tout va à la recherche).
 */
export function repartirSoufflerie(monde: Monde, e: Ecurie, projetsEcurie: ProjetConception[], fraicheurAero = 1): void {
  const { heures, cfd } = allocationSemaine(monde, e.id);
  const effH = heures * efficaciteHeure(monde, e.id, 'soufflerie', fraicheurAero);
  const effC = cfd * efficaciteHeure(monde, e.id, 'cfd', fraicheurAero);
  const aero = projetsEcurie.filter((p) => p.fabricationJoursRestants === undefined && PIECES[p.type as TypePiece]?.pole === 'aero');
  const partRecherche = aero.length ? e.souffleriePartRecherche ?? SOUFFLERIE.partRechercheDefaut : 1;
  e.heuresRecherche = Math.round(((e.heuresRecherche ?? 0) + effH * partRecherche) * 100) / 100;
  for (const p of aero) {
    p.heures = Math.round(((p.heures ?? 0) + (effH * (1 - partRecherche)) / aero.length) * 100) / 100;
    p.cfd = Math.round(((p.cfd ?? 0) + (effC * (1 - partRecherche)) / aero.length) * 10) / 10;
  }
}

/** Facteur de la recherche aéro de la phase 8 pour les heures reçues sur la période (rendement décroissant). */
export function facteurRechercheSoufflerie(heures: number): number {
  return SOUFFLERIE.rechercheMin + SOUFFLERIE.rechercheAmplitude * (1 - Math.exp(-heures / SOUFFLERIE.rechercheReference));
}
