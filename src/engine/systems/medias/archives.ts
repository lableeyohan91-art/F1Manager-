/**
 * Phase 11 — archives : records, palmarès, chronologie (consultation ; seuls les records en cours sont gardés, pour voir qu'un record tombe).
 * Titres depuis 2010 (données `palmares.csv`, puis saisons simulées) ; victoires et podiums depuis 2027 (les données n'en ont pas avant).
 */

import { ARCHIVES } from '../../balance/medias';
import { ajouterEvenement, type Evenement } from '../../core/evenements';
import { table, type Entite, type Monde } from '../../core/monde';
import { TABLES, type Ecurie, type Palmares, type Personne, type PersonneArchivee, type RecordSportif, type Saison } from '../../model/types';

const palmares = (m: Monde) => (Object.values(table(m, TABLES.palmares)) as unknown as Palmares[]).sort((a, b) => a.saison - b.saison);
const saisons = (m: Monde) => (Object.values(table(m, TABLES.saisons)) as unknown as Saison[]).filter((s) => s.termine).sort((a, b) => a.annee - b.annee);

/** Nom d'une personne (active ou archivée) ou d'une écurie. */
export function nomArchive(m: Monde, id: string): string {
  const p = (table(m, TABLES.personnes)[id] ?? table(m, TABLES.archives)[id]) as unknown as (Personne | PersonneArchivee) | undefined;
  if (p) return `${p.prenom} ${p.nom}`;
  return (table(m, TABLES.ecuries)[id] as unknown as Ecurie | undefined)?.nom ?? id;
}

function anneeNaissance(m: Monde, id: string): number | undefined {
  return ((table(m, TABLES.personnes)[id] ?? table(m, TABLES.archives)[id]) as unknown as { anneeNaissance?: number } | undefined)?.anneeNaissance;
}

function meilleur(compte: Map<string, number>, plusPetit = false): [string, number] | undefined {
  let res: [string, number] | undefined;
  for (const [id, v] of [...compte.entries()].sort(([a], [b]) => (a < b ? -1 : 1))) {
    if (!res || (plusPetit ? v < res[1] : v > res[1])) res = [id, v];
  }
  return res;
}

/** Records actuels, recalculés (aucun état) : libellé, détenteur, valeur, depuis. */
export function calculerRecords(m: Monde): RecordSportif[] {
  const res: RecordSportif[] = [];
  const pal = palmares(m);
  const titresP = new Map<string, number>(), titresC = new Map<string, number>(), jeune = new Map<string, number>();
  const depuis = new Map<string, number>();
  for (const x of pal) {
    titresP.set(x.championPilote, (titresP.get(x.championPilote) ?? 0) + 1);
    titresC.set(x.championConstructeurs, (titresC.get(x.championConstructeurs) ?? 0) + 1);
    const n = anneeNaissance(m, x.championPilote);
    if (n !== undefined && !jeune.has(x.championPilote)) { jeune.set(x.championPilote, x.saison - n); depuis.set(`j:${x.championPilote}`, x.saison); }
    depuis.set(`p:${x.championPilote}`, x.saison);
    depuis.set(`c:${x.championConstructeurs}`, x.saison);
  }
  const victoires = new Map<string, number>(), podiums = new Map<string, number>(), victoiresSaison = new Map<string, number>();
  for (const s of saisons(m)) for (const l of s.pilotes) {
    victoires.set(l.pilote, (victoires.get(l.pilote) ?? 0) + l.victoires);
    podiums.set(l.pilote, (podiums.get(l.pilote) ?? 0) + l.podiums);
    if (l.victoires > (victoiresSaison.get(l.pilote) ?? 0)) { victoiresSaison.set(l.pilote, l.victoires); depuis.set(`vs:${l.pilote}`, s.annee); }
    if (l.victoires) depuis.set(`v:${l.pilote}`, s.annee);
    if (l.podiums) depuis.set(`po:${l.pilote}`, s.annee);
  }
  const ajouter = (id: string, libelle: string, r: [string, number] | undefined, cle: string) => {
    if (r) res.push({ id, libelle, detenteur: r[0], valeur: r[1], depuis: depuis.get(`${cle}:${r[0]}`) ?? 0 });
  };
  ajouter('rec_titres_pilote', 'Titres de champion du monde (depuis 2010)', meilleur(titresP), 'p');
  ajouter('rec_titres_constructeurs', 'Titres constructeurs (depuis 2010)', meilleur(titresC), 'c');
  ajouter('rec_jeune_champion', 'Plus jeune champion du monde (âge)', meilleur(jeune, true), 'j');
  ajouter('rec_victoires', 'Victoires en Grand Prix (depuis 2027)', meilleur(victoires), 'v');
  ajouter('rec_podiums', 'Podiums (depuis 2027)', meilleur(podiums), 'po');
  ajouter('rec_victoires_saison', 'Victoires en une saison (depuis 2027)', meilleur(victoiresSaison), 'vs');
  return res;
}

/**
 * Fin de saison : compare les records aux records gardés ; un record qui change de détenteur produit un fait public (et un article).
 * Le premier passage enregistre les records sans fait.
 */
export function mettreAJourRecords(m: Monde): Evenement[] {
  const t = table(m, TABLES.records);
  const premier = Object.keys(t).length === 0;
  const faits: Evenement[] = [];
  for (const r of calculerRecords(m)) {
    const ancien = t[r.id] as unknown as RecordSportif | undefined;
    t[r.id] = r as unknown as Entite;
    if (premier || !ancien || ancien.detenteur === r.detenteur) continue;
    const depuis2027 = r.id === 'rec_victoires' || r.id === 'rec_podiums' || r.id === 'rec_victoires_saison';
    if (depuis2027 && (saisons(m).length < ARCHIVES.saisonsMinAnnonce || r.valeur < ARCHIVES.victoiresMin)) continue;
    faits.push(ajouterEvenement(m, {
      type: 'record.battu', acteurs: [{ id: r.detenteur, role: table(m, TABLES.ecuries)[r.detenteur] ? 'ecurie' : 'pilote' }, { id: ancien.detenteur, role: 'ancien' }],
      importance: 4, visibilite: 'public', contexte: { record: r.id, valeur: r.valeur, ancienneValeur: ancien.valeur },
      texte: `Record : ${nomArchive(m, r.detenteur)} détient désormais le record « ${r.libelle} » (${r.valeur}), devant ${nomArchive(m, ancien.detenteur)} (${ancien.valeur}).`,
    }));
  }
  return faits;
}

/** Palmarès d'une personne ou d'une écurie (titres par saison). */
export function palmaresDe(m: Monde, id: string): { saison: number; titre: 'pilotes' | 'constructeurs' }[] {
  return palmares(m).flatMap((x) => [
    ...(x.championPilote === id || x.ecurieChampionPilote === id ? [{ saison: x.saison, titre: 'pilotes' as const }] : []),
    ...(x.championConstructeurs === id ? [{ saison: x.saison, titre: 'constructeurs' as const }] : []),
  ]);
}

/** Chronologie : une ligne par saison (champions), du plus récent au plus ancien. */
export function chronologie(m: Monde): { saison: number; pilote: string; ecuriePilote: string; constructeurs: string }[] {
  return palmares(m).map((x) => ({ saison: x.saison, pilote: nomArchive(m, x.championPilote), ecuriePilote: nomArchive(m, x.ecurieChampionPilote), constructeurs: nomArchive(m, x.championConstructeurs) })).reverse();
}
