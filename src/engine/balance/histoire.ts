/**
 * Phase 9 — histoire ancrée (docs/systemes/phase-9-histoire-ancree.md ; D-046, D-142, D-143). Valeurs PROVISOIRES (D-120).
 * Le passé (2010–2026) n'est pas rejoué : sa couche humaine est construite saison par saison sur les faits des données.
 */

/**
 * Calendrier du passé :
 * - debut : première saison reprise (D-046 : depuis 2010) ; une carrière antérieure compte à partir de cette saison ;
 * - semaine : semaine de référence des faits d'une saison passée (souvenirs et événements datés de cette semaine) ;
 * - moisParSaison : mois d'oubli appliqués après chaque saison passée (les souvenirs anciens s'effacent et laissent un résidu).
 */
export const PASSE = { debut: 2010, semaine: 30, moisParSaison: 12 };

/**
 * Histoires réelles connues (histoires.csv, D-143) : publiques et célèbres, elles marquent plus durablement que les souvenirs ordinaires.
 * Pendant la construction du passé, elles s'atténuent à `persistance` fois la vitesse d'oubli normale ; en jeu, l'oubli redevient normal.
 */
export const HISTOIRES_REELLES = { persistance: 0.2 };

/**
 * Situations connues des données, et souvenirs plausibles qu'elles laissent (tirés selon les personnalités fictives, D-143) :
 * - rivalite : coéquipier du champion de la saison ; probabilité = base + parAmbition × (ambition − 10) / 10 ; intensité × facteur ;
 * - mentorat : un jeune (≤ ageJeune) face à un aîné (≥ ageAine) dans la même écurie ; l'aîné le soutient avec la probabilité
 *   base × sociabilité / 10 ;
 * - depart : un pilote quitte une écurie : gratitude s'il y a été titré ou y est resté au moins anneesGratitude saisons,
 *   sinon manque de reconnaissance avec la probabilité probaRancoeur ;
 * - reussite : les personnes présentes dans l'écurie championne des constructeurs partagent une réussite commune envers elle.
 */
export const SITUATIONS_PASSE = {
  rivalite: { base: 0.35, parAmbition: 0.25, facteur: 0.8 },
  mentorat: { ageJeune: 23, ageAine: 30, base: 0.4, facteur: 0.8 },
  depart: { anneesGratitude: 4, facteurGratitude: 0.8, probaRancoeur: 0.4, facteurRancoeur: 0.7 },
  reussite: { facteur: 0.6 },
};

/** Ères : une série d'au moins `serieMin` titres constructeurs consécutifs devient une ère de la Chronique. */
export const ERES = { serieMin: 3 };
