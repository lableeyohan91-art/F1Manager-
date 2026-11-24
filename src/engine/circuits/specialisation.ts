/**
 * Phase 11b — registre des caractéristiques de la voiture vues par le profil de vitesse, et voitures spécialisées (audit APEX Lab, points 6-7).
 *
 * Chaque caractéristique déclare :
 *  - son statut : « modelisee » (effet physique défini, testé par le banc) ou « future » (phase 12 ou 13 : AUCUN effet, non testée) ;
 *  - les paramètres physiques qu'elle améliore, avec leur poids relatif ;
 *  - ses compromis (ce qu'elle coûte ailleurs, quand le modèle le représente) ;
 *  - le seul canal par lequel la météo ou la température l'atteindra (règle contre le double comptage : un effet physique n'a
 *    qu'un propriétaire ; la météo agit par Conditions, jamais par un bonus séparé sur la caractéristique).
 * Aucune donnée de partie n'est créée ici : ce module ne fait que transformer une voiture physique, pour le banc et l'export.
 */
import type { VoiturePhysique } from './profil';

/** Paramètres de la voiture physique qu'une caractéristique peut améliorer ; sens : +1 = augmenter, −1 = diminuer. */
export const LEVIERS = {
  cla: 1,
  cda: -1,
  muMeca: 1,
  muMotricite: 1,
  muFreinage: 1,
  puissanceThermiqueW: 1,
  puissanceElectriqueW: 1,
  energieElectriqueTourJ: 1,
} as const;
export type Levier = keyof typeof LEVIERS;

export interface Caracteristique {
  id: string;
  nom: string;
  statut: 'modelisee' | 'future';
  /** Phase où la caractéristique sera branchée sur les courses (les modélisées ne le sont pas encore : D-162 proposée). */
  phase: '11b' | '12' | '13';
  /** Poids relatif de chaque levier (vide pour une caractéristique future). */
  leviers: Partial<Record<Levier, number>>;
  /** Compromis représentés par le modèle actuel, ou prévus. */
  compromis: string;
  /** Seul canal par lequel la météo et la température agiront (règle contre le double comptage). */
  canalMeteo: string;
}

export const CARACTERISTIQUES: readonly Caracteristique[] = [
  { id: 'appui', nom: 'Appui aérodynamique', statut: 'modelisee', phase: '11b', leviers: { cla: 1 }, compromis: 'Aucun dans le modèle actuel (la traînée ne dépend que du réglage d’ailerons) : limite connue, voir le rapport.', canalMeteo: 'Densité de l’air (altitude, température) dans Conditions.' },
  { id: 'faibleTrainee', nom: 'Faible traînée', statut: 'modelisee', phase: '11b', leviers: { cda: 1 }, compromis: 'Aucun dans le modèle actuel ; en réalité, une carrosserie fine limite le refroidissement (phase 12).', canalMeteo: 'Densité de l’air dans Conditions.' },
  { id: 'adherenceMecanique', nom: 'Adhérence mécanique', statut: 'modelisee', phase: '11b', leviers: { muMeca: 1 }, compromis: 'Aucun dans le modèle actuel ; en réalité, lié à l’usure des pneus (phase 13).', canalMeteo: 'Adhérence de piste et, plus tard, température de piste (phase 13).' },
  { id: 'motricite', nom: 'Motricité', statut: 'modelisee', phase: '11b', leviers: { muMotricite: 1 }, compromis: 'Consomme plus d’énergie électrique en sortie de virage (budget par tour).', canalMeteo: 'Adhérence de piste (pluie : phase 13).' },
  { id: 'moteur', nom: 'Moteur et efficacité énergétique', statut: 'modelisee', phase: '11b', leviers: { puissanceThermiqueW: 1, puissanceElectriqueW: 1, energieElectriqueTourJ: 1 }, compromis: 'Aucun dans le modèle actuel ; fiabilité et consommation en phase 12.', canalMeteo: 'Densité de l’air (puissance thermique) dans Conditions.' },
  { id: 'freinage', nom: 'Freinage', statut: 'modelisee', phase: '11b', leviers: { muFreinage: 1 }, compromis: 'Aucun dans le modèle actuel ; refroidissement des freins en phase 12.', canalMeteo: 'Adhérence de piste.' },
  { id: 'polyvalente', nom: 'Polyvalente', statut: 'modelisee', phase: '11b', leviers: { cla: 1, cda: 1, muMeca: 1, muMotricite: 1, muFreinage: 1, puissanceThermiqueW: 1, puissanceElectriqueW: 1, energieElectriqueTourJ: 1 }, compromis: 'Progrès réparti, sans point fort.', canalMeteo: 'Ceux des caractéristiques qui la composent.' },
  { id: 'refroidissement', nom: 'Refroidissement', statut: 'future', phase: '12', leviers: {}, compromis: 'Prévu : plus de refroidissement = plus de traînée ; trop peu = perte de puissance par forte chaleur.', canalMeteo: 'Température de l’air (Conditions.temperatureC) : seul canal.' },
  { id: 'pneus', nom: 'Gestion des pneus', statut: 'future', phase: '13', leviers: {}, compromis: 'Prévu : usure contre adhérence sur un relais (le profil d’un tour ne mesure pas l’usure).', canalMeteo: 'Température de piste (phase 13) : seul canal.' },
];

/**
 * Voiture spécialisée : chaque levier de la caractéristique est amélioré de intensite × poids (relatif, ex. 0,05 = +5 %).
 * Une caractéristique future n'a aucun levier : la voiture est inchangée (non testée, jamais un effet inventé).
 */
export function voitureSpecialisee(v: VoiturePhysique, c: Caracteristique, intensite: number): VoiturePhysique {
  const w: Record<string, unknown> = { ...v, deploiement: { ...v.deploiement } };
  for (const [k, poids] of Object.entries(c.leviers) as [Levier, number][]) {
    const sens = LEVIERS[k];
    w[k] = (v[k] as number) * (sens > 0 ? 1 + intensite * poids : 1 / (1 + intensite * poids));
  }
  return w as unknown as VoiturePhysique;
}
