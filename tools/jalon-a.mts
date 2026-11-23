/**
 * Jalon A — critères non couverts par les autres outils (ROADMAP « Jalon A — critères ») :
 * plantages sur N graines, chaînes de causes, groupes sociaux par écurie, départs derrière un leader, rotation du personnel,
 * faillites et rachats, taille de sauvegarde. Usage : npx tsx tools/jalon-a.mts <graines> <saisons>
 */
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
const racine = resolve('.');
const eng = await import(`${racine}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${racine}/src/platform/node/donnees.ts`);
const N = Number(process.argv[2] ?? 20), S = Number(process.argv[3] ?? 10);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(racine));
const moy = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);

let plantages = 0;
const partChaines: number[] = [], groupesParEcurie: number[] = [], rotationPersonnel: number[] = [], rotationPilotes: number[] = [];
let departsLeader = 0, suiveurs = 0, faillites = 0, rachats = 0, crises = 0, problemesCoherence = 0;
const t0 = performance.now();
for (let g = 1; g <= N; g++) {
  try {
    const m = sc.creerMonde(g);
    const mo = sc.creerMoteur();
    const significatifs = new Map<string, any>();
    for (let s = 0; s < S; s++) {
      const avant = new Map((Object.values(m.tables['personnes']) as any[]).filter((p) => p.statut === 'actif' && p.ecurie).map((p) => [p.id, p.ecurie]));
      for (let k = 0; k < 52; k++) {
        mo.avancer(m, 1);
        if (k % 4 === 3) for (const e of Object.values(m.evenements) as any[]) if (e.importance >= 3 && !significatifs.has(e.id) && !e.contexte?.passe) significatifs.set(e.id, e);
      }
      // Rotation sur la saison : part des personnes en poste qui ont changé d'écurie ou quitté leur poste.
      const ps = m.tables['personnes'] as Record<string, any>;
      const tourne = (filtre: (p: any) => boolean) => {
        const ids = [...avant.keys()].filter((id) => ps[id] && filtre(ps[id]));
        return ids.length ? ids.filter((id) => ps[id].statut !== 'actif' || ps[id].ecurie !== avant.get(id)).length / ids.length : 0;
      };
      rotationPersonnel.push(tourne((p) => !p.poste.startsWith('pilote') && p.poste !== 'ingenieur'));
      rotationPilotes.push(tourne((p) => p.poste === 'pilote_titulaire'));
      const ecuries = eng.ecuriesActives(m).length;
      groupesParEcurie.push(eng.groupes(m).length / ecuries);
      if (eng.verifierCoherence(m, { ages: false }).length) problemesCoherence++;
    }
    // Chaînes de causes : profondeur (nombre de maillons) des événements significatifs encore au journal.
    const profondeur = (id: string, vus = new Set<string>()): number => {
      const e = m.evenements[id];
      if (!e || vus.has(id)) return 0;
      vus.add(id);
      return 1 + Math.max(0, ...(e.causes as string[]).map((c) => profondeur(c, vus)));
    };
    const encore = [...significatifs.values()].filter((e) => m.evenements[e.id]);
    if (encore.length) partChaines.push(encore.filter((e) => profondeur(e.id) >= 3).length / encore.length);
    for (const e of significatifs.values()) {
      if (e.type === 'finances.administration') faillites++;
      if (e.type === 'proprietaire.rachat') rachats++;
      if (e.type === 'finances.crise') crises++;
    }
    const tous = Object.values(m.evenements) as any[];
    suiveurs += tous.filter((e) => e.type === 'groupe.suit_leader').length;
    departsLeader += new Set(tous.filter((e) => e.type === 'groupe.suit_leader').map((e) => e.acteurs.find((a: any) => a.role === 'leader')?.id)).size;
  } catch (err) {
    plantages++;
    console.error(`graine ${g} : ${(err as Error).message}`);
  }
}
// Taille de sauvegarde après 50 saisons (une graine).
const m50 = sc.creerMonde(1);
sc.creerMoteur().avancer(m50, 52 * 50);
const brut = eng.serialiser(m50);
const pc = (x: number) => `${(100 * x).toFixed(0)} %`;
console.log(`# Jalon A — critères mesurés (${N} graines × ${S} saisons, ${((performance.now() - t0) / 1000).toFixed(0)} s)\n`);
console.log('| Critère | Mesure |\n| --- | --- |');
console.log(`| Plantages | ${plantages} sur ${N} |`);
console.log(`| Parties où la cohérence est prise en défaut (au moins une fin de saison) | ${problemesCoherence} sur ${N} |`);
console.log(`| Événements significatifs (importance ≥ 3) avec au moins 3 maillons de causes | ${pc(moy(partChaines))} |`);
console.log(`| Groupes sociaux par écurie (moyenne des fins de saison) | ${moy(groupesParEcurie).toFixed(2)} |`);
console.log(`| Leaders suivis par au moins un membre / membres qui ont suivi (cumul) | ${departsLeader} / ${suiveurs} |`);
console.log(`| Rotation annuelle du personnel (dirigeants et responsables) | ${pc(moy(rotationPersonnel))} |`);
console.log(`| Rotation annuelle des pilotes titulaires | ${pc(moy(rotationPilotes))} |`);
console.log(`| Crises / rachats / mises sous administration (cumul) | ${crises} / ${rachats} / ${faillites} |`);
console.log(`| Sauvegarde après 50 saisons (brut / compressé) | ${(brut.length / 1e6).toFixed(1)} Mo / ${(gzipSync(brut).length / 1e6).toFixed(2)} Mo |`);
