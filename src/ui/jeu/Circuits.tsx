/**
 * Phase 11b — écran Circuits : les 30 circuits du vivier (calendrier de la saison, puis hors calendrier) et leur fiche A à E.
 * Les fiches viennent de data/grille-2026/circuits-fiches.json (calculées par le moteur, outil generer-fiches-jeu.mts), chargées à la
 * demande pour ne pas alourdir le premier affichage sur téléphone. Les éditions simulées viennent de la partie.
 */
import { useEffect, useState } from 'preact/hooks';
import { moisDeSemaine, table, TABLES, type Circuit, type Monde } from '../../engine';
import { grandsPrix, nom, nomCircuit, nomEcurie, personne, type Partie } from './partie';

/* Forme des fiches générées (seuls les champs affichés). */
interface Virage { numero: number; nom: string; x: number; y: number; sens: string; vMinKmh: number; classe: string }
export interface Fiche {
  permanent: boolean;
  A: { longueurM: number; virages: number; sens: string; nature: string; nuit: boolean; tourReelS: number | null; anneeReleve: number | null; source: string; carte: [number, number][]; virages_: Virage[]; statutVirages: string; lignesDroites: { longueurM: number; vMaxKmh: number }[]; freinages: unknown[]; denivele: { ecartM: number; penteMaxPct: number; statut: string }; statuts: Record<string, string> };
  B: { provisoire: boolean; essentiels: { id: string; nom: string; pourquoi: string; gainS: number }[]; moinsImportant: { nom: string; gainS: number }; limites: string };
  contraintes: Record<string, number | Record<string, unknown> | string> & { energie: { partPleineChargePct: number; coupureElectriqueKmh: number | null }; pneus: { stress: number; abrasivite: number; evolutionPiste: number } };
  C: { climat: { source: string; station: string; moisGP: number; heureCourse: number; mois: Record<string, { airC: number; pluie: number | null; humidite: number | null }> } | null; revetement: { abrasivite: number; adherence: number; statut: string }; altitudeM: number; nuit: boolean };
  D: { regles: string; configuration: string | null; editions: { annee: number; nom: string; sc: number | null; vsc: number | null; rouges: number }[] } | null;
  E: { reglages: { id: string; etat: string }[] };
  strategie: { stands: { tempsPassageS: number; perteNetteS: number; perteHorsImmobilisationS: number; vitesseLimiteKmh: number; statut: string }; zonesDepassement: { virage: number | null; ligneAvantM: number; chuteKmh: number }[]; difficulteDepassement: number };
  incidents: { zonesRisque: { virage: number; raison: string }[]; murs: number; degagements: number; largeur: number; evacuation: number; statut: string };
}

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const REGLAGES: Record<string, string> = { ailerons: 'Ailerons (niveau d’appui)', hauteurCaisse: 'Hauteur de caisse', suspension: 'Suspension', refroidissement: 'Ouvertures de refroidissement', freins: 'Refroidissement des freins' };
const CONTRAINTES: [string, string][] = [['appui', 'Appui'], ['traineeVitessePointe', 'Faible traînée'], ['puissance', 'Puissance'], ['adherenceMecanique', 'Adhérence méca.'], ['motricite', 'Motricité'], ['freinage', 'Freinage']];
const pct = (x: number | null) => (x === null ? '—' : `${Math.round(x * 100)} %`);
const niveau = (x: number) => '●'.repeat(x) + '○'.repeat(Math.max(0, 5 - x));

let cache: Promise<Record<string, Fiche>> | null = null;
export const chargerFiches = () => (cache ??= import('../../../data/grille-2026/circuits-fiches.json').then((d) => (d as unknown as { default: { circuits: Record<string, Fiche> } }).default.circuits));

function Barre({ libelle, v }: { libelle: string; v: number }) {
  return (
    <div class="jauge">
      <span>{libelle}</span>
      <span class="piste"><span style={{ width: `${v}%`, background: v >= 65 ? 'var(--green)' : v >= 35 ? 'var(--text)' : 'var(--muted)' }} /></span>
      <span class="num">{v}</span>
    </div>
  );
}

/** Tracé du circuit (vu de dessus), virages numérotés. */
function Carte({ f }: { f: Fiche }) {
  const xs = f.A.carte.map((p) => p[0]), ys = f.A.carte.map((p) => -p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const marge = Math.max(x1 - x0, y1 - y0) * 0.06;
  const vb = `${x0 - marge} ${y0 - marge} ${x1 - x0 + 2 * marge} ${y1 - y0 + 2 * marge}`;
  const e = Math.max(x1 - x0, y1 - y0) / 100;
  return (
    <svg class="carte-circuit" viewBox={vb} role="img" aria-label="Tracé du circuit">
      <polygon points={f.A.carte.map((p) => `${p[0]},${-p[1]}`).join(' ')} fill="none" stroke="var(--text)" stroke-width={e * 1.2} stroke-linejoin="round" />
      <circle cx={f.A.carte[0]![0]} cy={-f.A.carte[0]![1]} r={e * 1.8} fill="var(--accent)" />
      {f.A.virages_.map((v) => (
        <g key={v.numero}>
          <circle cx={v.x} cy={-v.y} r={e * 2.6} fill="var(--panel-2)" stroke="var(--muted)" stroke-width={e * 0.3} />
          <text x={v.x} y={-v.y} font-size={e * 3} text-anchor="middle" dominant-baseline="central" fill="var(--text)">{v.numero}</text>
        </g>
      ))}
    </svg>
  );
}

function FicheCircuit({ partie, id, f, retour }: { partie: Partie; id: string; f: Fiche; retour: () => void }) {
  const m = partie.monde;
  const c = table(m, TABLES.circuits)[id] as unknown as Circuit | undefined;
  // Mois du Grand Prix dans la partie (s'il est au calendrier), sinon mois habituel.
  const gp = grandsPrix(m).find((g) => g.circuit === id);
  const mois = gp ? moisDeSemaine(gp.semaine) : f.C.climat?.moisGP ?? 1;
  const cl = f.C.climat?.mois[String(mois)];
  const simulees = (Object.values(table(m, TABLES.grandsPrix)) as unknown as { circuit: string; saison: number; termine: boolean; pluie: boolean; resultats: { position: number | null; pilote: string; ecurie: string }[] }[])
    .filter((g) => g.circuit === id && g.termine).sort((a, b) => b.saison - a.saison);
  const auCalendrier = !!gp;
  const statut = !c?.vivier ? '' : c.vivier.statut === 'permanent' ? 'Circuit permanent'
    : c.vivier.finContrat && c.vivier.finContrat >= m.date.annee
      ? (auCalendrier ? `En rotation, contrat jusqu’en ${c.vivier.finContrat}` : `Contrat jusqu’en ${c.vivier.finContrat}, mais sans place cette saison (les contrats les plus longs passent devant)`)
      : 'En rotation, sans contrat : reviendra quand il sera le plus longtemps absent';
  return (
    <>
      <button class="btn" onClick={retour}>← Tous les circuits</button>
      <div class="carte">
        <h2>{nomCircuit(m, id)}</h2>
        <p class="muted">{statut}{c?.vivier?.derniereEdition ? ` · dernière édition ${c.vivier.derniereEdition}` : ''}</p>
      </div>

      <details class="carte" open>
        <summary><h3>A. Présentation</h3></summary>
        <Carte f={f} />
        <p>{(f.A.longueurM / 1000).toLocaleString('fr-FR')} km · {f.A.virages} virages · sens {f.A.sens} · {f.A.nature}{f.A.nuit ? ' · de nuit' : ''}</p>
        <p class="muted petit">Lignes droites : {f.A.lignesDroites.length} (la plus longue {Math.max(0, ...f.A.lignesDroites.map((l) => l.longueurM))} m) · freinages appuyés : {f.A.freinages.length} · dénivelé {f.A.denivele.ecartM} m, pente maximale {f.A.denivele.penteMaxPct} %</p>
        {f.A.tourReelS && <p class="muted petit">Tour de référence relevé ({f.A.anneeReleve}) : {Math.floor(f.A.tourReelS / 60)} min {(f.A.tourReelS % 60).toFixed(1)} s</p>}
        <details><summary class="muted petit">Virages ({f.A.statutVirages.startsWith('R (rapprochement') ? 'numérotation officielle' : 'numérotation reconstruite, à vérifier'})</summary>
          <ul class="liste-faits petit">{f.A.virages_.map((v) => <li key={v.numero}><strong>{v.numero}</strong>{v.nom ? ` ${v.nom}` : ''} · {v.sens} · {v.classe} ({v.vMinKmh} km/h)</li>)}</ul>
        </details>
        <p class="muted petit">Sources : {f.A.source}. Tracé : {f.A.statuts['trace']}</p>
      </details>

      <details class="carte" open>
        <summary><h3>B. Exigences techniques</h3></summary>
        {f.B.provisoire && <p class="muted petit"><span class="badge">provisoire</span> en attendant les caractéristiques des voitures de la phase 12.</p>}
        {f.B.essentiels.map((e) => <p key={e.id}><strong>{e.nom}</strong> — {e.pourquoi}.</p>)}
        <p class="muted">Moins important : {f.B.moinsImportant.nom}.</p>
        {CONTRAINTES.map(([k, l]) => <Barre key={k} libelle={l} v={f.contraintes[k] as number} />)}
        <p class="muted petit">50 = moyenne du calendrier. {f.B.limites}</p>
      </details>

      <details class="carte">
        <summary><h3>C. Conditions</h3></summary>
        {cl && f.C.climat && <p>{MOIS[mois - 1]!.replace(/^./, (x) => x.toUpperCase())}, départ à {f.C.climat.heureCourse} h : air ≈ {cl.airC} °C, pluie pendant la course ≈ {pct(cl.pluie)}{cl.humidite ? `, humidité ${cl.humidite} %` : ''}.</p>}
        <p>Revêtement : abrasivité {niveau(f.C.revetement.abrasivite)} · adhérence {niveau(f.C.revetement.adherence)}</p>
        <p>Pneus : contrainte {niveau(f.contraintes.pneus.stress)} · bosses {niveau(f.contraintes['bosses'] as number)} · vibreurs {niveau(f.contraintes['vibreurs'] as number)}</p>
        <p>Altitude {f.C.altitudeM} m · pleine charge {f.contraintes.energie.partPleineChargePct} % du tour{f.contraintes.energie.coupureElectriqueKmh ? ` · déploiement électrique coupé vers ${f.contraintes.energie.coupureElectriqueKmh} km/h` : ''}</p>
        {f.C.climat && <div class="defile"><table class="compact"><thead><tr><th>Mois</th><th>Air</th><th>Pluie</th></tr></thead>
          <tbody>{Object.entries(f.C.climat.mois).map(([k, x]) => <tr key={k} class={Number(k) === mois ? 'moi' : ''}><td>{MOIS[Number(k) - 1]}</td><td class="num">{x.airC} °C</td><td class="num">{pct(x.pluie)}</td></tr>)}</tbody></table></div>}
        <p class="muted petit">Climat : {f.C.climat?.station} ({f.C.climat?.source}). Revêtement, bosses, vibreurs : {f.C.revetement.statut === 'H' ? 'hypothèses' : 'estimations à recouper'}. La météo détaillée arrive en phase 13.</p>
      </details>

      <details class="carte">
        <summary><h3>D. Historique</h3></summary>
        {simulees.length > 0 && <><h4>Dans votre partie</h4>
          <ul class="liste-faits petit">{simulees.slice(0, 10).map((g) => { const v = g.resultats.find((r) => r.position === 1); return <li key={g.saison}><strong>{g.saison}</strong> {nom(personne(m, v?.pilote ?? ''))} ({nomEcurie(m, v?.ecurie ?? '')}){g.pluie ? ' · pluie' : ''}</li>; })}</ul>
          <p class="muted petit">Safety Cars, VSC et drapeaux rouges : non simulés avant la phase 13.</p></>}
        {f.D && <><h4>Éditions réelles</h4>
          <div class="defile"><table class="compact"><thead><tr><th>Année</th><th>SC</th><th>VSC</th><th>Rouge</th></tr></thead>
            <tbody>{[...f.D.editions].reverse().map((e, i) => <tr key={`${e.annee}-${i}`}><td>{e.annee}</td><td class="num">{e.sc ?? '—'}</td><td class="num">{e.vsc ?? '—'}</td><td class="num">{e.rouges}</td></tr>)}</tbody></table></div>
          <p class="muted petit">{f.D.regles}{f.D.configuration ? ` ${f.D.configuration}` : ''} « — » : non applicable à l’époque.</p></>}
      </details>

      <details class="carte">
        <summary><h3>Stratégie et incidents</h3></summary>
        <p>Arrêt au stand : {f.strategie.stands.tempsPassageS} s dans la voie (limite {f.strategie.stands.vitesseLimiteKmh} km/h), soit ≈ {f.strategie.stands.perteNetteS} s perdues sur un tour normal.</p>
        <p>Dépassement : {['', 'facile', 'assez facile', 'moyen', 'difficile', 'très difficile'][f.strategie.difficulteDepassement]}{f.strategie.zonesDepassement.length ? ` — surtout au freinage des virages ${f.strategie.zonesDepassement.map((z) => z.virage).join(', ')}` : ''}.</p>
        <p>Zones à risque : {f.incidents.zonesRisque.map((z) => `virage ${z.virage} (${z.raison})`).join(' ; ')}.</p>
        <p>Murs {niveau(f.incidents.murs)} · dégagements {niveau(f.incidents.degagements)} · évacuation difficile {niveau(f.incidents.evacuation)}</p>
        <p class="muted petit">Préparé pour la phase 13 (stratégie, incidents, direction de course) ; sans effet sur les courses d’ici là. {f.strategie.stands.statut}.</p>
      </details>

      <details class="carte">
        <summary><h3>E. Préparation du week-end</h3></summary>
        <ul class="liste-faits">{f.E.reglages.map((r) => <li key={r.id}>{REGLAGES[r.id] ?? r.id} : <span class="muted">{r.etat}</span></li>)}</ul>
        <p class="muted petit">Les réglages se découvrent en essais libres avec vos ingénieurs et ne sont jamais donnés. Retours d’ingénieurs : à venir (phase 13).</p>
      </details>
    </>
  );
}

export function EcranCircuits({ partie }: { partie: Partie }) {
  const m: Monde = partie.monde;
  const [fiches, setFiches] = useState<Record<string, Fiche> | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [choisi, setChoisi] = useState<string | null>(null);
  useEffect(() => { chargerFiches().then(setFiches, () => setErreur('Fiches des circuits introuvables.')); }, []);
  const gps = grandsPrix(m);
  const auCalendrier = new Set(gps.map((g) => g.circuit));
  const autres = (Object.values(table(m, TABLES.circuits)) as unknown as Circuit[]).filter((c) => !auCalendrier.has(c.id))
    .sort((a, b) => (a.vivier?.jourHabituel ?? 0) - (b.vivier?.jourHabituel ?? 0));
  if (erreur) return <div class="carte"><p>{erreur}</p></div>;
  if (!fiches) return <div class="carte"><p class="muted">Chargement des fiches…</p></div>;
  if (choisi && fiches[choisi]) return <FicheCircuit partie={partie} id={choisi} f={fiches[choisi]!} retour={() => { setChoisi(null); window.scrollTo(0, 0); }} />;
  const ouvrir = (id: string) => { setChoisi(id); window.scrollTo(0, 0); };
  return (
    <>
      <div class="carte">
        <h3>Calendrier {m.date.annee}</h3>
        <ul class="liste-faits">{gps.map((g) => <li key={g.id}><button class="lien" onClick={() => ouvrir(g.circuit)}><strong>{g.manche}. {nomCircuit(m, g.circuit)}</strong></button> <span class="muted">{MOIS[moisDeSemaine(g.semaine) - 1]}{fiches[g.circuit]?.permanent ? ' · permanent' : ''}</span></li>)}</ul>
      </div>
      <div class="carte">
        <h3>Hors calendrier ({autres.length})</h3>
        <p class="muted petit">Dix circuits sont permanents ; les autres se partagent les places restantes : les contrats en cours, puis les circuits absents depuis le plus longtemps.</p>
        <ul class="liste-faits">{autres.map((c) => <li key={c.id}><button class="lien" onClick={() => ouvrir(c.id)}><strong>{c.nom}</strong></button> <span class="muted">{c.vivier?.derniereEdition ? `dernière édition ${c.vivier.derniereEdition}` : ''}</span></li>)}</ul>
      </div>
    </>
  );
}
