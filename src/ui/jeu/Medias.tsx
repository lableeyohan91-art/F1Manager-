/** Phase 11 — écrans Actualités (articles, rumeurs, conférence de presse) et Archives (records, palmarès). */
import { useState } from 'preact/hooks';
import {
  articles, calculerRecords, chronologie, conferences, LIBELLES_QUESTIONS, LIBELLES_REPONSES, medias, nomArchive, texteArticle,
  type Article, type Media,
} from '../../engine';
import { IMAGE_PAR_REPONSE } from '../../engine/balance/medias';
import { commander, ecurieJoueur, faitsVisibles, membres, nom, nomEcurie, personne, type Partie } from './partie';
import { ListeFaits, type Navigation } from './Jeu';

/** Libellé d'une image publique (−100 à 100). */
export function libelleImage(v: number | undefined): string {
  const x = v ?? 0;
  if (x >= 25) return 'très appréciée';
  if (x >= 8) return 'appréciée';
  if (x > -8) return 'neutre';
  if (x > -25) return 'mal vue';
  return 'très mal vue';
}
export function Image({ v }: { v: number | undefined }) {
  const x = Math.round(v ?? 0);
  const c = x >= 8 ? 'var(--green)' : x <= -8 ? '#ff8a80' : 'var(--muted)';
  return <span style={{ color: c }}>{libelleImage(v)} ({x > 0 ? '+' : ''}{x})</span>;
}

const etoiles = (fiabilite: number) => '★'.repeat(Math.max(1, Math.round(fiabilite * 5))) + '☆'.repeat(5 - Math.max(1, Math.round(fiabilite * 5)));

/** Ce que chaque réponse risque (affiché avant de répondre). */
const RISQUES: Record<string, string> = {
  soutenir: 'Le pilote s’en souviendra ; vous vous engagez publiquement.',
  mettre_pression: 'Critique publique : le pilote s’en souviendra, votre image en pâtit.',
  viser_titre: 'Le conseil vous jugera sur le titre cette saison.',
  prudence: 'Aucun engagement ; le conseil garde ses attentes habituelles.',
  assumer: 'Votre image se redresse un peu.',
  nier: 'Démentir abîme votre image si les faits sont avérés.',
  attaquer_rival: 'Son team principal s’en souviendra.',
  respecter: 'Son team principal apprécie le geste.',
  critiquer_federation: 'Le président de la fédération s’en souviendra.',
  soutenir_federation: 'Le président de la fédération apprécie.',
  esquiver: 'Rien ne bouge.',
};

function ConferenceEnAttente({ partie, nav }: { partie: Partie; nav: Navigation }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const [msg, setMsg] = useState<string | null>(null);
  const c = conferences(m, e.id)[0];
  if (!c) return msg ? <div class="carte retour" role="status">{msg}</div> : null;
  const sujet = c.sujet ? (personne(m, c.sujet) ? nom(personne(m, c.sujet)) : nomEcurie(m, c.sujet)) : null;
  return (
    <div class="carte attention">
      <h3>La presse vous interroge</h3>
      <p><strong>« {LIBELLES_QUESTIONS[c.question]} »</strong>{sujet ? <span class="muted"> ({sujet})</span> : null}</p>
      <p class="muted petit">Réponse attendue avant la semaine {c.echeance.semaine} ; sinon, le service de communication esquivera.</p>
      <ul class="liste-decisions">
        {c.options.map((o) => {
          const [ip] = IMAGE_PAR_REPONSE[o] ?? [0, 0];
          return (
            <li key={o} onClick={() => { const r = commander(partie, 'media.declaration', { conference: c.id, reponse: o }); setMsg(r.ok ? 'Déclaration faite : elle sera dans les journaux.' : `Impossible : ${(r as { motif: string }).motif}`); nav.rafraichir(); }}>
              <span class="etiquette">{ip > 0 ? 'image +' : ip < 0 ? 'image −' : 'neutre'}</span>
              <div><strong>{LIBELLES_REPONSES[o]}</strong><div class="muted petit">{RISQUES[o]}</div></div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Un même fait repris par plusieurs médias n'apparaît qu'une fois, avec la liste des médias qui en parlent. */
function ListeArticles({ liste, mediasParId }: { liste: Article[]; mediasParId: Map<string, Media> }) {
  if (!liste.length) return <p class="muted">Aucun article pour l’instant.</p>;
  const groupes = new Map<string, Article[]>();
  for (const a of liste) (groupes.get(a.source) ?? groupes.set(a.source, []).get(a.source)!).push(a);
  return (
    <ul class="liste-faits">
      {[...groupes.values()].map((g) => {
        const a = g[0]!;
        const sources = g.map((x) => mediasParId.get(x.media)).filter((x): x is Media => !!x);
        return (
          <li key={a.id} class={a.importance >= 4 ? 'fort' : ''}>
            <div class="muted petit">
              {sources.map((md, i) => <span key={md.id}>{i ? ', ' : ''}{md.nom} <span title="Fiabilité du média">{etoiles(md.fiabilite)}</span></span>)}
              {' · '}{a.date.annee}, sem. {a.date.semaine}{a.genre === 'rumeur' ? ' · RUMEUR' : a.genre === 'scandale' ? ' · SCANDALE' : ''}
            </div>
            <strong>{a.titre}</strong>
            {a.texte && texteArticle(a) !== a.titre && <div class="petit">{texteArticle(a)}</div>}
          </li>
        );
      })}
    </ul>
  );
}

export function EcranActualites({ partie, nav }: { partie: Partie; nav: Navigation }) {
  const m = partie.monde;
  const e = ecurieJoueur(m)!;
  const [vue, setVue] = useState<'une' | 'ecurie' | 'rumeurs' | 'coulisses'>('une');
  const mediasParId = new Map(medias(m).map((x) => [x.id, x]));
  const nous = membres(m);
  const tous = articles(m).sort((a, b) => (a.date.annee - b.date.annee) * 52 + a.date.semaine - b.date.semaine || (a.id < b.id ? -1 : 1)).reverse();
  const liste = vue === 'une' ? tous.filter((a) => a.genre !== 'rumeur').slice(0, 60)
    : vue === 'ecurie' ? tous.filter((a) => a.sujets.some((s) => s === e.id || nous.has(s))).slice(0, 60)
      : tous.filter((a) => a.genre === 'rumeur').slice(0, 40);
  return (
    <>
      <ConferenceEnAttente partie={partie} nav={nav} />
      <div class="onglets">
        {([['une', 'À la une'], ['ecurie', 'Mon écurie'], ['rumeurs', 'Rumeurs'], ['coulisses', 'Coulisses']] as const).map(([v, l]) => (
          <button key={v} class={`btn ${vue === v ? 'actif' : ''}`} onClick={() => setVue(v)}>{l}</button>
        ))}
      </div>
      <div class="carte">
        {vue === 'rumeurs' && <p class="muted petit">Une rumeur peut être vraie, exagérée ou fausse. Fiez-vous à la fiabilité du média (étoiles).</p>}
        {vue === 'coulisses' ? (
          <>
            <p class="muted petit">Faits connus de vous et de votre écurie, publics ou non. Les faits mineurs s’effacent après une saison.</p>
            <ListeFaits faits={faitsVisibles(m, 'ecurie', 120)} />
          </>
        ) : <ListeArticles liste={liste} mediasParId={mediasParId} />}
      </div>
    </>
  );
}

export function EcranArchives({ partie }: { partie: Partie }) {
  const m = partie.monde;
  const [vue, setVue] = useState<'records' | 'palmares' | 'image'>('records');
  const records = calculerRecords(m);
  return (
    <>
      <div class="onglets">
        {([['records', 'Records'], ['palmares', 'Palmarès'], ['image', 'Image publique']] as const).map(([v, l]) => (
          <button key={v} class={`btn ${vue === v ? 'actif' : ''}`} onClick={() => setVue(v)}>{l}</button>
        ))}
      </div>
      <div class="carte">
        {vue === 'records' && (
          <>
            <p class="muted petit">Titres depuis 2010 (données réelles altérées) ; victoires et podiums depuis 2027 (les données n’en ont pas avant).</p>
            <ul class="liste-faits">{records.map((r) => <li key={r.id}><strong>{r.libelle}</strong><div>{nomArchive(m, r.detenteur)} : <span class="num">{r.valeur}</span>{r.depuis ? <span class="muted"> (depuis {r.depuis})</span> : null}</div></li>)}</ul>
          </>
        )}
        {vue === 'palmares' && (
          <div class="defile"><table class="compact"><thead><tr><th>Saison</th><th>Champion</th><th>Constructeurs</th></tr></thead>
            <tbody>{chronologie(m).map((l) => <tr key={l.saison}><td>{l.saison}</td><td>{l.pilote}<div class="muted petit">{l.ecuriePilote}</div></td><td>{l.constructeurs}</td></tr>)}</tbody>
          </table></div>
        )}
        {vue === 'image' && (
          <>
            <p class="muted petit">L’image publique pèse sur les sponsors, la patience du conseil, l’attrait pour les candidats et la valeur commerciale des pilotes.</p>
            <ul class="liste-faits">
              {(Object.values(m.tables['ecuries'] ?? {}) as unknown as { id: string; nom: string; image?: number; statut: string }[]).filter((x) => x.statut === 'active').sort((a, b) => (b.image ?? 0) - (a.image ?? 0))
                .map((x) => <li key={x.id} class="ligne-rang"><span>{x.nom}</span><Image v={x.image} /></li>)}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
