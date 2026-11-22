import { useState } from 'preact/hooks';
import { SEUIL_SURPRISE_PCT } from '../../engine/balance/course';
import { CARACTERISTIQUES_VITESSE } from '../../engine/balance/circuits';
import {
  indicateursSaison, indicateursSerie, motorisation,
  type Circuit, type GrandPrix, type Monde, type Saison, type Voiture,
} from '../../engine';
import { Carte, ecuries, Lien, liste, nomComplet, Note, personnes } from './outils';
import type { Selection } from './Vues';

type Ouvrir = (s: Selection) => void;

const LIB_CARAC: Record<string, string> = {
  viragesLents: 'Virages lents', viragesRapides: 'Virages rapides', vitessePointe: 'Vitesse de pointe',
  efficaciteAero: 'Efficacité aéro', motorisation: 'Motorisation', gestionPneus: 'Gestion des pneus', fiabilite: 'Fiabilité',
};

const f1 = (x: number) => x.toLocaleString('fr-FR', { maximumFractionDigits: 1, minimumFractionDigits: 1 });

export function saisonsDe(monde: Monde): Saison[] {
  return liste<Saison>(monde, 'saisons').sort((a, b) => b.annee - a.annee);
}

/** Liste des saisons + détail de la saison choisie. */
export function VueSaisons({ monde, ouvrir }: { monde: Monde; ouvrir: Ouvrir }) {
  const saisons = saisonsDe(monde);
  const [annee, setAnnee] = useState<number | null>(null);
  const [gp, setGp] = useState<string | null>(null);
  const choisie = saisons.find((s) => s.annee === annee) ?? saisons[0];
  if (!choisie) return <p class="muted">Aucune saison simulée pour l'instant. Utilise les boutons « Simuler » ci-dessus.</p>;
  if (gp) return <FicheGrandPrix monde={monde} id={gp} retour={() => setGp(null)} ouvrir={ouvrir} />;

  const per = new Map(personnes(monde).map((p) => [p.id, p]));
  const eqs = new Map(ecuries(monde).map((e) => [e.id, e]));
  const ind = choisie.termine ? indicateursSaison(monde, choisie) : null;
  return (
    <>
      <div class="onglets">
        {saisons.map((s) => (
          <button key={s.id} class={`btn ${s.annee === choisie.annee ? 'actif' : ''}`} onClick={() => setAnnee(s.annee)}>
            {s.annee}{s.termine ? '' : ' (en cours)'}
          </button>
        ))}
      </div>
      {choisie.chronique.length > 0 && (
        <Carte titre={`Chronique ${choisie.annee}`}>
          <ul>{choisie.chronique.map((l) => <li key={l}>{l}</li>)}</ul>
        </Carte>
      )}
      <div class="grille">
        <Carte titre="Classement pilotes">
          <table>
            <thead><tr><th>#</th><th>Pilote</th><th>Pts</th><th>V</th><th>Pod.</th></tr></thead>
            <tbody>
              {choisie.pilotes.map((l, i) => {
                const p = per.get(l.pilote);
                return (
                  <tr key={l.pilote} class="cliquable" onClick={() => ouvrir({ type: 'personne', id: l.pilote })}>
                    <td class="num">{i + 1}</td>
                    <td>{p ? nomComplet(p) : l.pilote} <span class="muted">{eqs.get(l.ecurie)?.nomCourt}</span></td>
                    <td class="num"><b>{l.points}</b></td><td class="num">{l.victoires}</td><td class="num">{l.podiums}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Carte>
        <Carte titre="Classement constructeurs">
          <table>
            <thead><tr><th>#</th><th>Écurie</th><th>Pts</th><th>V</th><th>Doublés</th><th>Primes</th></tr></thead>
            <tbody>
              {choisie.constructeurs.map((l, i) => (
                <tr key={l.ecurie} class="cliquable" onClick={() => ouvrir({ type: 'ecurie', id: l.ecurie })}>
                  <td class="num">{i + 1}</td><td>{eqs.get(l.ecurie)?.nom}</td><td class="num"><b>{l.points}</b></td>
                  <td class="num">{l.victoires}</td><td class="num">{l.doubles}</td>
                  <td class="num">{l.primesMEUR !== undefined ? `${l.primesMEUR} M€` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Carte>
      </div>
      <Carte titre="Calendrier et résultats">
        <div class="defile">
          <table>
            <thead><tr><th>Manche</th><th>Grand Prix</th><th>Semaine</th><th>Vainqueur</th><th></th></tr></thead>
            <tbody>
              {choisie.calendrier.map((id) => {
                const g = monde.tables['grandsprix']![id] as unknown as GrandPrix;
                const c = monde.tables['circuits']![g.circuit] as unknown as Circuit;
                const v = g.resultats[0];
                const surprise = v?.position === 1 && v.retardVoiturePct >= SEUIL_SURPRISE_PCT;
                return (
                  <tr key={id} class={g.termine ? 'cliquable' : ''} onClick={() => { if (g.termine) { setGp(id); window.scrollTo(0, 0); } }}>
                    <td class="num">{g.manche}</td><td>{c.nom} <span class="muted">{c.type}</span></td><td class="num">{g.semaine}</td>
                    <td>{g.termine && v ? `${per.get(v.pilote)?.nom ?? v.pilote} (${eqs.get(v.ecurie)?.nomCourt})` : <span class="muted">à venir</span>}</td>
                    <td>{g.pluie ? 'pluie ' : ''}{surprise ? 'surprise' : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Carte>
      {ind && (
        <Carte titre="Indicateurs de la saison">
          <div class="grille">
            <div><span class="muted">Vainqueurs différents</span><br /><span class="num">{ind.vainqueursDifferents}</span></div>
            <div><span class="muted">Écuries victorieuses</span><br /><span class="num">{ind.ecuriesVictorieuses}</span></div>
            <div><span class="muted">Écart 1er–2e</span><br /><span class="num">{ind.ecartP1P2} pts</span></div>
            <div><span class="muted">Changements de leader</span><br /><span class="num">{ind.changementsLeader}</span></div>
            <div><span class="muted">Taux d'abandon</span><br /><span class="num">{f1(100 * ind.tauxAbandon)} %</span></div>
            <div><span class="muted">Écart 1re–dernière voiture</span><br /><span class="num">{f1(ind.ecartPerfPct)} %</span></div>
            <div><span class="muted">Écart moyen coéquipiers</span><br /><span class="num">{ind.ecartCoequipiersPct.toFixed(2)} %</span></div>
            <div><span class="muted">Corrélation voiture/points</span><br /><span class="num">{ind.correlationVoiturePoints.toFixed(2)}</span></div>
            <div><span class="muted">Victoires inattendues</span><br /><span class="num">{ind.resultatsInattendus}</span></div>
            <div><span class="muted">Meilleure progression</span><br />{eqs.get(ind.progressionEcurie)?.nom} (+{ind.progressionMax.toFixed(2)})</div>
          </div>
        </Carte>
      )}
    </>
  );
}

function FicheGrandPrix({ monde, id, retour, ouvrir }: { monde: Monde; id: string; retour: () => void; ouvrir: Ouvrir }) {
  const g = monde.tables['grandsprix']![id] as unknown as GrandPrix;
  const c = monde.tables['circuits']![g.circuit] as unknown as Circuit;
  const per = new Map(personnes(monde).map((p) => [p.id, p]));
  const eqs = new Map(ecuries(monde).map((e) => [e.id, e]));
  return (
    <>
      <button class="btn" onClick={retour}>← Saison</button>
      <Carte titre={`${g.saison} · manche ${g.manche} · ${c.nom}`}>
        <p class="muted">{c.ville} ({c.pays}) · circuit {c.type} · {g.pluie ? 'sous la pluie' : 'sur le sec'}</p>
        <div class="defile">
          <table class="compact">
            <thead><tr><th>Pos.</th><th>Pilote</th><th>Écart</th><th>Pts</th><th>Voiture (rang)</th><th>Pourquoi ?</th></tr></thead>
            <tbody>
              {g.resultats.map((r) => {
                const p = per.get(r.pilote);
                const e = r.explication;
                return (
                  <tr key={r.pilote}>
                    <td class="num">{r.position ?? (r.abandon === 'mecanique' ? 'Abd. méca.' : 'Abd. incident')}</td>
                    <td><Lien onClick={() => ouvrir({ type: 'personne', id: r.pilote })}>{p ? nomComplet(p) : r.pilote}</Lien> <span class="muted">{eqs.get(r.ecurie)?.nomCourt}</span></td>
                    <td class="num">{r.ecartPct === null ? '—' : r.ecartPct === 0 ? 'vainqueur' : `+${r.ecartPct.toFixed(2)} %`}</td>
                    <td class="num">{r.points || ''}</td>
                    <td class="num">{r.rangVoiture}{r.retardVoiturePct > 0 ? ` (−${r.retardVoiturePct.toFixed(2)} %)` : ''}</td>
                    <td class="muted" style={{ fontSize: '.8rem' }}>
                      {e ? `voiture ${e.voiture.toFixed(2)} · pilote ${e.pilote.toFixed(2)} · forme ${e.forme >= 0 ? '+' : ''}${e.forme.toFixed(2)} · aléa ${e.alea >= 0 ? '+' : ''}${e.alea.toFixed(2)}` : 'détail effacé (ancienne saison)'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p class="muted" style={{ fontSize: '.8rem' }}>« Pourquoi ? » : contributions en % de temps au tour (plus c'est grand, plus c'est rapide ; l'aléa positif ralentit).</p>
      </Carte>
    </>
  );
}

/** Caractéristiques actuelles des voitures (D-056). */
export function VueVoitures({ monde }: { monde: Monde }) {
  const eqs = ecuries(monde);
  const voitures = new Map(liste<Voiture>(monde, 'voitures').map((v) => [v.ecurie, v]));
  const caracs = [...CARACTERISTIQUES_VITESSE, 'fiabilite'] as const;
  return (
    <div class="defile">
      <table>
        <thead><tr><th>Écurie</th>{caracs.map((c) => <th key={c}>{LIB_CARAC[c]}</th>)}</tr></thead>
        <tbody>
          {eqs.map((e) => {
            const v = voitures.get(e.id);
            if (!v) return null;
            return (
              <tr key={e.id}>
                <td><b>{e.nom}</b></td>
                {caracs.map((c) => <td key={c}><Note v={Math.round((c === 'motorisation' ? motorisation(monde, e) : v[c]) * 10) / 10} /></td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Résumé de toutes les saisons simulées (série). */
export function VueBilan({ monde }: { monde: Monde }) {
  const s = indicateursSerie(monde);
  if (s.saisons.length === 0) return <p class="muted">Aucune saison terminée.</p>;
  const pal = saisonsDe(monde).filter((x) => x.termine).reverse();
  const per = new Map(personnes(monde).map((p) => [p.id, p]));
  const eqs = new Map(ecuries(monde).map((e) => [e.id, e]));
  return (
    <>
      <div class="grille">
        <div><span class="muted">Saisons simulées</span><br /><span class="num">{s.saisons.length}</span></div>
        <div><span class="muted">Champions pilotes différents</span><br /><span class="num">{s.championsPilotesDifferents}</span></div>
        <div><span class="muted">Champions constructeurs différents</span><br /><span class="num">{s.championsConstructeursDifferents}</span></div>
        <div><span class="muted">Plus longue série de titres</span><br /><span class="num">{s.maxTitresConsecutifsEcurie}</span></div>
        <div><span class="muted">Écuries sans victoire</span><br /><span class="num">{s.ecuriesSansVictoire}</span></div>
        <div><span class="muted">Remontées (+3 places)</span><br /><span class="num">{s.remontees}</span></div>
      </div>
      <table style={{ marginTop: '12px' }}>
        <thead><tr><th>Saison</th><th>Champion</th><th>Écart</th><th>Constructeurs</th></tr></thead>
        <tbody>
          {pal.map((x) => (
            <tr key={x.id}>
              <td class="num">{x.annee}</td>
              <td>{per.get(x.pilotes[0]!.pilote)?.nom} <span class="muted">{eqs.get(x.pilotes[0]!.ecurie)?.nomCourt}</span></td>
              <td class="num">{x.pilotes[0]!.points - (x.pilotes[1]?.points ?? 0)} pts</td>
              <td>{eqs.get(x.constructeurs[0]!.ecurie)?.nom}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
