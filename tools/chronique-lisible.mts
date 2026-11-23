/**
 * Jalon A — chronique lisible d'une partie : le passé (2010–2026), puis chaque saison observée, en quatre rubriques
 * (la saison, le marché, dans les coulisses, politique et règlement). Les faits mineurs étant effacés du journal après une saison,
 * ils sont recueillis semaine par semaine pendant la simulation. Aucune phrase n'invente un fait : tout vient des événements.
 * Usage : npx tsx tools/chronique-lisible.mts <graine> <saisons> [fichier de sortie]
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const G = Number(process.argv[2] ?? 42), S = Number(process.argv[3] ?? 10);
const sortie = process.argv[4] ?? `docs/rapports/jalon-a/chronique-graine-${G}.md`;
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const m = sc.creerMonde(G);
const mo = sc.creerMoteur();

const RUBRIQUES: Record<string, string[]> = {
  marche: ['marche.signature', 'contrat.non_prolonge', 'personne.retraite', 'personne.reconversion', 'conseil.licenciement_tp', 'sponsor.signature', 'proprietaire.rachat', 'proprietaire.sauvetage', 'finances.crise'],
  coulisses: ['personnel.besoin_defi', 'contrat.demande_depart', 'contrat.depart_accepte', 'contrat.depart_refuse', 'contrat.demission', 'contrat.rupture_negociee', 'groupe.forme', 'groupe.suit_leader', 'information.revelee', 'stands.changement_chef', 'recherche.decouverte', 'marche.candidature'],
  politique: ['federation.election', 'federation.interim', 'federation.proposition', 'federation.vote', 'politique.alliance', 'politique.lobbying', 'reglement.propositions', 'reglement.vote', 'reglement.annonce', 'reglement.entree_en_vigueur', 'reglement.evolution_mineure', 'reglement.fuite'],
};
const types = new Set(Object.values(RUBRIQUES).flat());
/** Ce qui intéresse le plus le lecteur passe d'abord : pilotes, dirigeants, crises ; les sponsors ensuite. */
function priorite(e: any): number {
  if (e.type === 'marche.signature') return /pilote titulaire/.test(e.texte) ? 10 : /team principal|directeur technique/.test(e.texte) ? 8 : 5;
  if (e.type === 'sponsor.signature') return 2;
  if (['contrat.demission', 'conseil.licenciement_tp', 'proprietaire.rachat', 'finances.crise', 'federation.election', 'reglement.annonce', 'recherche.decouverte', 'groupe.suit_leader'].includes(e.type)) return 9;
  return e.importance;
}
const recueillis = new Map<string, any>();
for (let k = 0; k < 52 * S; k++) {
  mo.avancer(m, 1);
  for (const e of Object.values(m.evenements) as any[]) if (!recueillis.has(e.id) && types.has(e.type) && e.texte) recueillis.set(e.id, e);
}
const lignes: string[] = [`# Chronique — graine ${G}, saisons ${m.origine?.date?.annee ?? 2027} à ${m.date.annee - 1}`, '', '> Chronique générée par le moteur (jalon A). Faits simulés ; les noms réels sont altérés (D-042). Les rubriques « coulisses » rapportent aussi des faits privés que le joueur ne connaîtrait pas forcément.', '', '## Le passé (2010–2026)', ''];
for (const e of m.chronique.filter((c: any) => c.type.startsWith('histoire.'))) lignes.push(`- ${e.resume}`);
const saisons = (Object.values(m.tables['saisons']) as any[]).filter((s) => s.termine).sort((a, b) => a.annee - b.annee);
for (const s of saisons) {
  lignes.push('', `## ${s.annee}`, '', '### La saison', '');
  for (const l of s.chronique ?? []) lignes.push(`- ${l}`);
  const top = s.constructeurs.slice(0, 3).map((c: any, i: number) => `${i + 1}. ${m.tables['ecuries'][c.ecurie]?.nom ?? c.ecurie} (${c.points} pts)`).join(' · ');
  lignes.push(`- Constructeurs : ${top}.`);
  for (const [cle, titre] of [['marche', 'Le marché'], ['coulisses', 'Dans les coulisses'], ['politique', 'Politique et règlement']] as const) {
    const evts = [...recueillis.values()].filter((e) => e.date.annee === s.annee && RUBRIQUES[cle]!.includes(e.type)).sort((a, b) => a.date.semaine - b.date.semaine || (a.id < b.id ? -1 : 1));
    if (!evts.length) continue;
    lignes.push('', `### ${titre}`, '');
    // Volume lisible : au plus 12 faits par rubrique (les plus importants d'abord, puis dans l'ordre).
    const choisis = evts.slice().sort((a, b) => priorite(b) - priorite(a) || a.date.semaine - b.date.semaine).slice(0, 12).sort((a, b) => a.date.semaine - b.date.semaine);
    for (const e of choisis) lignes.push(`- ${e.texte}`);
    if (evts.length > choisis.length) lignes.push(`- … et ${evts.length - choisis.length} autre(s) fait(s).`);
  }
}
mkdirSync(dirname(sortie), { recursive: true });
writeFileSync(sortie, lignes.join('\n') + '\n');
console.log(`Chronique écrite : ${sortie} (${lignes.length} lignes)`);
