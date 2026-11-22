/**
 * Chronique v1 : résumé lisible d'une saison, généré à partir des faits simulés.
 * Modèles de phrases volontairement simples ; ChatGPT pourra les enrichir (contenu).
 * Aucune phrase n'invente un fait : tout vient des classements et des Grands Prix de la saison.
 */

import { SEUIL_SURPRISE_PCT } from '../../balance/course';
import { table, type Monde } from '../../core/monde';
import { TABLES, type Circuit, type Ecurie, type GrandPrix, type Personne, type Saison } from '../../model/types';

const ordinal = (n: number) => (n === 1 ? '1re' : `${n}e`);

export function genererChronique(monde: Monde, s: Saison): string[] {
  const nomP = (id: string) => {
    const p = table(monde, TABLES.personnes)[id] as unknown as Personne | undefined;
    return p ? `${p.prenom} ${p.nom}` : id;
  };
  const nomE = (id: string) => (table(monde, TABLES.ecuries)[id] as unknown as Ecurie | undefined)?.nom ?? id;
  const lignes: string[] = [];
  const [c1, c2] = s.pilotes;
  const k1 = s.constructeurs[0];
  if (!c1 || !k1) return lignes;

  const ecart = c1.points - (c2?.points ?? 0);
  let phrase = `${nomP(c1.pilote)} (${nomE(c1.ecurie)}) remporte le titre avec ${c1.points} points et ${c1.victoires} victoire${c1.victoires > 1 ? 's' : ''}`;
  if (c2) phrase += `, ${ecart} point${ecart > 1 ? 's' : ''} devant ${nomP(c2.pilote)} (${nomE(c2.ecurie)})`;
  lignes.push(phrase + '.');
  if (ecart <= 10) lignes.push('Le titre s’est joué à quelques points : une des saisons les plus serrées.');
  else if (ecart >= 120) lignes.push('Une domination sans partage.');

  if (s.titreOuvertDerniereManche) {
    lignes.push(
      s.leaderAvantDerniereManche && s.leaderAvantDerniereManche !== c1.pilote
        ? `Retournement lors de la dernière manche : ${nomP(c1.pilote)} arrache le titre à ${nomP(s.leaderAvantDerniereManche)}.`
        : 'Le titre restait ouvert avant la dernière manche.',
    );
  }

  const changements = s.leaders.filter((l, i) => i > 0 && l !== s.leaders[i - 1]).length;
  if (changements >= 4) lignes.push(`La tête du championnat a changé ${changements} fois.`);

  const ek = table(monde, TABLES.ecuries)[k1.ecurie] as unknown as Ecurie;
  lignes.push(
    `${nomE(k1.ecurie)} décroche le titre des constructeurs` +
      (ek.titresConstructeurs === 1 ? ', le premier de son histoire.' : ` (${ek.titresConstructeurs}e titre de son histoire).`),
  );
  if (k1.doubles >= 5) lignes.push(`${nomE(k1.ecurie)} signe ${k1.doubles} doublés.`);

  // Victoires surprises.
  for (const idGp of s.calendrier) {
    const gp = table(monde, TABLES.grandsPrix)[idGp] as unknown as GrandPrix;
    const v = gp.resultats[0];
    if (v?.position === 1 && v.retardVoiturePct >= SEUIL_SURPRISE_PCT) {
      const c = table(monde, TABLES.circuits)[gp.circuit] as unknown as Circuit;
      lignes.push(`Victoire surprise de ${nomP(v.pilote)} (${nomE(v.ecurie)}) à ${c.nom}${gp.pluie ? ', sous la pluie' : ''}.`);
    }
  }

  // Progression par rapport à la saison précédente.
  const prec = table(monde, TABLES.saisons)[`ssn_${s.annee - 1}`] as unknown as Saison | undefined;
  if (prec?.termine) {
    for (const [i, l] of s.constructeurs.entries()) {
      const avant = prec.constructeurs.findIndex((x) => x.ecurie === l.ecurie);
      if (avant >= 0 && avant - i >= 3) lignes.push(`${nomE(l.ecurie)} progresse de la ${ordinal(avant + 1)} à la ${ordinal(i + 1)} place.`);
      if (avant >= 0 && i - avant >= 3) lignes.push(`${nomE(l.ecurie)} recule de la ${ordinal(avant + 1)} à la ${ordinal(i + 1)} place.`);
    }
  }

  for (const l of s.constructeurs) if (l.points === 0) lignes.push(`${nomE(l.ecurie)} termine la saison sans marquer le moindre point.`);

  // Disettes : mentionnées seulement à 5 et 10 saisons, et comptées depuis le début de la simulation
  // (l'historique des victoires d'avant 2027 n'est pas dans les données).
  const saisons = (Object.values(table(monde, TABLES.saisons)) as unknown as Saison[]).filter((x) => x.annee <= s.annee).sort((a, b) => a.annee - b.annee);
  for (const l of s.constructeurs) {
    let n = 0;
    for (let i = saisons.length - 1; i >= 0; i--) {
      if ((saisons[i]!.constructeurs.find((x) => x.ecurie === l.ecurie)?.victoires ?? 0) > 0) break;
      n++;
    }
    const titree = (table(monde, TABLES.ecuries)[l.ecurie] as unknown as Ecurie).titresConstructeurs > 0;
    if ((n === 5 || n === 10) && titree) lignes.push(`${nomE(l.ecurie)}, pourtant titrée par le passé, n’a remporté aucune course depuis ${n} saisons.`);
  }
  return lignes;
}
