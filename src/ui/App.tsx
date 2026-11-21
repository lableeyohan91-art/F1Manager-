import { useMemo, useState } from 'preact/hooks';
import { creerScenarioGrille2026, ErreurDonnees, formaterDate, verifierCoherence, type Monde } from '../engine';
import { fichiersGrille2026 } from './donnees';
import { personnes } from './diagnostic/outils';
import {
  FicheEcurie, FichePersonne, ListeCircuits, ListeContrats, ListeEcuries, ListePalmares, ListePersonnes, type Selection,
} from './diagnostic/Vues';

type Onglet = 'ecuries' | 'personnes' | 'contrats' | 'palmares' | 'circuits' | 'coherence';
const ONGLETS: [Onglet, string][] = [
  ['ecuries', 'Écuries'], ['personnes', 'Personnes'], ['contrats', 'Contrats'],
  ['palmares', 'Palmarès'], ['circuits', 'Circuits'], ['coherence', 'Cohérence'],
];

function construire(graine: number): { monde: Monde | null; erreur: string | null } {
  try {
    return { monde: creerScenarioGrille2026(fichiersGrille2026()).creerMonde(graine), erreur: null };
  } catch (e) {
    return { monde: null, erreur: e instanceof ErreurDonnees ? e.problemes.join('\n') : String(e) };
  }
}

/** Interface de diagnostic v0 (phase 2) : consultation du monde en lecture seule. Outil de conception. */
export function App() {
  const [graine, setGraine] = useState(42);
  const [saisie, setSaisie] = useState('42');
  const [onglet, setOnglet] = useState<Onglet>('ecuries');
  const [selection, setSelection] = useState<Selection>(null);
  const [historique, setHistorique] = useState<Selection[]>([]);
  const { monde, erreur } = useMemo(() => construire(graine), [graine]);

  const ouvrir = (s: Selection) => {
    setHistorique((h) => [...h, selection]);
    setSelection(s);
    window.scrollTo(0, 0);
  };
  const retour = () => {
    setSelection(historique.at(-1) ?? null);
    setHistorique((h) => h.slice(0, -1));
  };

  const exporter = () => {
    if (!monde) return;
    const blob = new Blob([JSON.stringify(monde, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `monde-grille-2026-graine-${graine}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <header class="topbar">
        <span class="marque" />
        <span class="titre">DIAGNOSTIC</span>
        <span class="muted">nom de travail · phase 2</span>
      </header>
      <main class="page">
        <div class="carte" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span class="muted">Graine</span>
          <input class="num" style={{ width: '90px' }} value={saisie} onInput={(e) => setSaisie((e.target as HTMLInputElement).value)} />
          <button class="btn principal" onClick={() => { const g = Number.parseInt(saisie, 10); if (Number.isInteger(g)) { setGraine(g); setSelection(null); setHistorique([]); } }}>
            Nouveau monde
          </button>
          <button class="btn" onClick={exporter} disabled={!monde}>Exporter (JSON)</button>
          {monde && <span class="muted">{formaterDate(monde.date)} · {personnes(monde).length} personnes</span>}
        </div>

        {erreur && <div class="carte erreur"><h3>Données invalides</h3><pre style={{ whiteSpace: 'pre-wrap' }}>{erreur}</pre></div>}

        {monde && (
          selection ? (
            <>
              <button class="btn" onClick={retour}>← Retour</button>
              {selection.type === 'ecurie' && <FicheEcurie monde={monde} id={selection.id} ouvrir={ouvrir} />}
              {selection.type === 'personne' && <FichePersonne monde={monde} id={selection.id} ouvrir={ouvrir} />}
            </>
          ) : (
            <>
              <nav class="onglets">
                {ONGLETS.map(([id, lib]) => (
                  <button key={id} class={`btn ${onglet === id ? 'actif' : ''}`} onClick={() => setOnglet(id)}>{lib}</button>
                ))}
              </nav>
              <div class="carte">
                {onglet === 'ecuries' && <ListeEcuries monde={monde} ouvrir={ouvrir} />}
                {onglet === 'personnes' && <ListePersonnes monde={monde} ouvrir={ouvrir} />}
                {onglet === 'contrats' && <ListeContrats monde={monde} ouvrir={ouvrir} />}
                {onglet === 'palmares' && <ListePalmares monde={monde} ouvrir={ouvrir} />}
                {onglet === 'circuits' && <ListeCircuits monde={monde} />}
                {onglet === 'coherence' && <Coherence monde={monde} />}
              </div>
            </>
          )
        )}
        <p class="muted" style={{ fontSize: '.8rem' }}>
          Outil de conception : tout est affiché en clair, y compris les caractéristiques cachées au joueur. Noms altérés, personnalités fictives.
        </p>
      </main>
    </>
  );
}

function Coherence({ monde }: { monde: Monde }) {
  const pb = verifierCoherence(monde);
  return pb.length === 0 ? <p style={{ color: 'var(--green)' }}>Aucun problème de cohérence détecté.</p> : (
    <ul class="erreur">{pb.map((x) => <li key={x}>{x}</li>)}</ul>
  );
}
