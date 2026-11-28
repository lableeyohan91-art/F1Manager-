/**
 * Phase 13e (fiche docs/systemes/phase-13e-course-en-direct.md) — la course regardée en direct, tour par tour. L'écran ne calcule rien :
 * il demande au moteur l'aperçu de la course à la fin d'un tour (`apercuGrandPrix`, sans rien modifier) et envoie les ordres du joueur
 * par la commande commune `course.ordre`. Le résultat final est le même calcul que ce que le joueur a regardé.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import { apercuGrandPrix, table, TABLES, type ApercuCourse, type Ecurie, type GrandPrix } from '../../engine';
import { commander, ecurieJoueur, nom, nomCircuit, personne, type Partie } from './partie';

const PNEU: Record<string, string> = { tendre: 'T', moyen: 'M', dur: 'D', pluie: 'P' };
const TYPE_NZ: Record<string, string> = { sc: 'Voiture de sécurité', vsc: 'VSC', rouge: 'Drapeau rouge' };

interface Fait { tour: number; texte: string; alerte?: boolean }

/** Ce qui s'est passé entre deux aperçus, vu du joueur (ses pilotes, les neutralisations, la météo, les arrêts de ses adversaires directs). */
function faitsDuTour(avant: ApercuCourse, apres: ApercuCourse, nosPilotes: string[], court: (id: string) => string): Fait[] {
  const t = apres.tour, f: Fait[] = [];
  const nz = apres.etat.neutralisations[apres.etat.neutralisations.length - 1];
  if (apres.etat.neutralisations.length > avant.etat.neutralisations.length && nz) f.push({ tour: t, texte: `${TYPE_NZ[nz.type]} (${nz.cause === 'debris' ? 'débris' : `${nz.cause === 'incident' ? 'accident' : 'panne'} de ${court(nz.pilote ?? '')}`})`, alerte: true });
  if (apres.changementsMeteo.includes(t)) f.push({ tour: t, texte: 'La météo change : la piste ' + ((apres.changementsMeteo.filter((x) => x <= t).length % 2 === 1) !== apres.pluie ? 'devient mouillée' : 'sèche'), alerte: true });
  for (const id of nosPilotes) {
    const a = avant.etat.voitures[id], b = apres.etat.voitures[id];
    if (!a || !b) continue;
    if (a.enCourse && !b.enCourse) { f.push({ tour: t, texte: `${court(id)} abandonne`, alerte: true }); continue; }
    const pa = avant.etat.ordre.indexOf(id) + 1, pb = apres.etat.ordre.indexOf(id) + 1;
    if (b.relais > a.relais) f.push({ tour: t, texte: `${court(id)} s'arrête : pneus ${b.composes[b.relais]} (${pb}e)` });
    if (b.depassements > a.depassements) f.push({ tour: t, texte: `${court(id)} dépasse ${court(apres.etat.ordre[pb] ?? '')} (${pb}e)` });
    else if (pb > pa && b.relais === a.relais) f.push({ tour: t, texte: `${court(id)} perd ${pb - pa} place${pb - pa > 1 ? 's' : ''} (${pb}e)` + (b.erreurs > a.erreurs ? ' après une erreur' : '') });
    else if (b.erreurs > a.erreurs) f.push({ tour: t, texte: `${court(id)} commet une petite erreur` });
    // Adversaires directs (juste devant ou juste derrière) qui s'arrêtent : moment de décider (undercut, couverture).
    for (const voisin of [avant.etat.ordre[pa - 2], avant.etat.ordre[pa]]) {
      if (!voisin || nosPilotes.includes(voisin)) continue;
      if (apres.etat.voitures[voisin]!.relais > avant.etat.voitures[voisin]!.relais) f.push({ tour: t, texte: `${court(voisin)}, juste ${voisin === avant.etat.ordre[pa - 2] ? 'devant' : 'derrière'} ${court(id)}, s'arrête`, alerte: true });
    }
  }
  return f;
}

export function CourseDirect({ partie, gpId, terminer }: { partie: Partie; gpId: string; terminer: () => void }) {
  const m = partie.monde;
  const gp = table(m, TABLES.grandsPrix)[gpId] as unknown as GrandPrix;
  const e = ecurieJoueur(m)!;
  const [tour, setTour] = useState(0);
  const [lecture, setLecture] = useState(false);
  const [vitesse, setVitesse] = useState(1);
  const [pauseAlertes, setPauseAlertes] = useState(true);
  const [faits, setFaits] = useState<Fait[]>([]);
  const [, setVersion] = useState(0);
  const precedent = useRef<ApercuCourse | null>(null);
  const a = apercuGrandPrix(m, gpId, tour);
  const nosPilotes = a ? Object.entries(a.ecuries).filter(([, ec]) => ec === e.id).map(([id]) => id) : [];
  const court = (id: string) => personne(m, id)?.nom ?? id;
  const nomCourt = (ec: string) => (table(m, TABLES.ecuries)[ec] as unknown as Ecurie | undefined)?.nomCourt ?? ec;

  // Faits du tour et pause aux moments clés.
  useEffect(() => {
    if (!a) return;
    // Tous les tours écoulés depuis le dernier affiché (y compris après « +5 tours » ou « aller à l'arrivée »).
    let p = precedent.current;
    const nouveaux: Fait[] = [];
    if (p) for (let k = p.tour + 1; k <= a.tour; k++) {
      const x = k === a.tour ? a : apercuGrandPrix(m, gpId, k)!;
      nouveaux.push(...faitsDuTour(p, x, nosPilotes, court));
      p = x;
    }
    if (nouveaux.length) setFaits((x) => [...nouveaux.reverse(), ...x].slice(0, 80));
    if (lecture && pauseAlertes && nouveaux.some((x) => x.alerte)) setLecture(false);
    precedent.current = a;
  }, [tour]);

  // Lecture automatique.
  useEffect(() => {
    if (!lecture || !a || a.tour >= a.tours) { if (lecture && a && a.tour >= a.tours) setLecture(false); return; }
    const id = setTimeout(() => setTour((t) => t + 1), 1000 / vitesse);
    return () => clearTimeout(id);
  }, [lecture, tour, vitesse]);

  if (!a) return <div class="carte"><p>Cette course ne peut pas être regardée en direct.</p><button class="btn" onClick={terminer}>Retour</button></div>;
  const fini = a.tour >= a.tours;
  const ordre = a.etat.ordre;
  const t0 = a.etat.voitures[ordre[0]!]!.temps;
  const nz = a.etat.neutralisation;
  const ordreSuivant = Math.min(a.tours, a.tour + 1);

  const ordonner = (pilote: string, prm: Record<string, unknown>, texte: string) => {
    const r = commander(partie, 'course.ordre', { grandPrix: gpId, ecurie: e.id, pilote, tour: ordreSuivant, ...prm });
    setFaits((x) => [{ tour: a.tour, texte: r.ok ? texte : `Refusé : ${r.motif}` }, ...x]);
    setVersion((v) => v + 1);
  };

  return (
    <div class="course-direct">
      <div class="carte">
        <h3>{nomCircuit(m, gp.circuit)} — tour {a.tour} / {a.tours}</h3>
        <p class="muted petit">
          {a.tour === 0 ? `Grille de départ. ` : ''}{a.pluie ? 'Départ sous la pluie. ' : ''}{nz ? `${TYPE_NZ[nz.type]} en piste. ` : ''}
          Ce que vous voyez est la vraie course : vos ordres comptent pour le résultat.
        </p>
        <div class="actions">
          {!fini && <button class="btn principal" onClick={() => setLecture(!lecture)}>{lecture ? '⏸ Pause' : '▶ Lecture'}</button>}
          {!fini && <button class="btn" onClick={() => { setLecture(false); setTour((t) => t + 1); }}>+1 tour</button>}
          {!fini && <button class="btn" onClick={() => { setLecture(false); setTour((t) => Math.min(a.tours, t + 5)); }}>+5 tours</button>}
          {!fini && <button class="btn" onClick={() => { setLecture(false); setTour(a.tours); }}>Aller à l’arrivée</button>}
          <label class="champ">Vitesse <select value={vitesse} onChange={(v) => setVitesse(Number((v.target as HTMLSelectElement).value))}><option value={1}>1 tour/s</option><option value={3}>3 tours/s</option><option value={8}>8 tours/s</option></select></label>
          <label class="champ"><input type="checkbox" checked={pauseAlertes} onChange={(v) => setPauseAlertes((v.target as HTMLInputElement).checked)} /> pause aux moments clés</label>
          {fini && <button class="btn principal" onClick={terminer}>Terminer le Grand Prix ▸</button>}
        </div>
      </div>
      <div class="grille">
        <div class="carte">
          <h3>Classement</h3>
          <table class="compact">
            <thead><tr><th>#</th><th>Pilote</th><th>Écurie</th><th>Écart</th><th title="composé et tours faits dessus">Pneus</th><th>Arrêts</th></tr></thead>
            <tbody>
              {ordre.map((id, i) => {
                const v = a.etat.voitures[id]!;
                return (
                  <tr key={id} class={nosPilotes.includes(id) ? 'nous' : ''}>
                    <td>{v.enCourse ? i + 1 : '—'}</td><td>{court(id)}</td><td class="muted">{nomCourt(a.ecuries[id]!)}</td>
                    <td>{!v.enCourse ? 'abandon' : i === 0 ? 'en tête' : `+${(v.temps - t0).toFixed(1)} s`}</td>
                    <td>{PNEU[v.composes[v.relais] ?? ''] ?? '?'}{v.tourRelais}</td><td>{v.relais}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          {!fini && nosPilotes.map((id) => {
            const v = a.etat.voitures[id]!;
            if (!v.enCourse) return null;
            return (
              <div class="carte" key={id}>
                <h3>{nom(personne(m, id))} — {ordre.indexOf(id) + 1}e</h3>
                <p class="muted petit">Pneus {v.composes[v.relais]} depuis {v.tourRelais} tours · arrêts faits : {v.relais}{v.relais < v.plan.length - 1 ? ` · prochain arrêt prévu dans ${v.plan[v.relais]! - v.tourRelais} tours` : ' · plus d’arrêt prévu'}</p>
                <div class="actions">
                  {(['tendre', 'moyen', 'dur', 'pluie'] as const).map((c) => <button key={c} class="btn" onClick={() => ordonner(id, { arret: c }, `${court(id)} : rentrer au tour ${ordreSuivant} pour des ${c}`)}>Stand : {c}</button>)}
                </div>
                <div class="ligne-champs">
                  {([['conduite', 'Conduite'], ['pneus', 'Pneus'], ['batterie', 'Batterie']] as const).map(([k, lib]) => (
                    <label key={k} class="champ">{lib} <select value="" onChange={(x) => { const val = (x.target as HTMLSelectElement).value; if (val) ordonner(id, { consignes: { [k]: val } }, `${court(id)} : ${lib.toLowerCase()} ${val}`); }}>
                      <option value="">changer…</option><option value="agressive">agressive</option><option value="neutre">neutre</option><option value="conservatrice">conservatrice</option>
                    </select></label>
                  ))}
                </div>
              </div>
            );
          })}
          <div class="carte">
            <h3>En direct</h3>
            {!faits.length && <p class="muted petit">Lancez la course. L’ingénieur gère tout seul si vous ne donnez aucun ordre.</p>}
            <ul class="liste-faits">{faits.map((f, i) => <li key={i} class={f.alerte ? 'fort' : ''}>Tour {f.tour} — {f.texte}</li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
