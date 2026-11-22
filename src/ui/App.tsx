import { useRef, useState } from 'preact/hooks';
import { creerScenarioGrille2026, ErreurDonnees, formaterDate, verifierCoherence, type Monde, type Moteur } from '../engine';
import { VueBilan, VueSaisons, VueVoitures } from './diagnostic/Saisons';
import { BacASable } from './diagnostic/Humain';
import { fichiersGrille2026 } from './donnees';
import { personnes } from './diagnostic/outils';
import {
  FicheEcurie, FichePersonne, ListeCircuits, ListeContrats, ListeEcuries, ListePalmares, ListePersonnes, type Selection,
} from './diagnostic/Vues';

type Onglet = 'bacasable' | 'saisons' | 'bilan' | 'ecuries' | 'voitures' | 'personnes' | 'contrats' | 'palmares' | 'circuits' | 'coherence';
const ONGLETS: [Onglet, string][] = [
  ['bacasable', 'Bac à sable'], ['saisons', 'Saisons'], ['bilan', 'Bilan'], ['ecuries', 'Écuries'], ['voitures', 'Voitures'], ['personnes', 'Personnes'],
  ['contrats', 'Contrats'], ['palmares', 'Palmarès'], ['circuits', 'Circuits'], ['coherence', 'Cohérence'],
];

function construire(graine: number): { monde: Monde | null; moteur: Moteur | null; erreur: string | null } {
  try {
    const sc = creerScenarioGrille2026(fichiersGrille2026());
    return { monde: sc.creerMonde(graine), moteur: sc.creerMoteur(), erreur: null };
  } catch (e) {
    return { monde: null, moteur: null, erreur: e instanceof ErreurDonnees ? e.problemes.join('\n') : String(e) };
  }
}

/** Interface de diagnostic v0 (phase 2) : consultation du monde en lecture seule. Outil de conception. */
export function App() {
  const [graine, setGraine] = useState(42);
  const [saisie, setSaisie] = useState('42');
  const [onglet, setOnglet] = useState<Onglet>('ecuries');
  const [, setVersion] = useState(0);
  const [selection, setSelection] = useState<Selection>(null);
  const [historique, setHistorique] = useState<Selection[]>([]);
  const etat = useRef<ReturnType<typeof construire> | null>(null);
  const grainEtat = useRef<number | null>(null);
  if (grainEtat.current !== graine) {
    etat.current = construire(graine);
    grainEtat.current = graine;
  }
  const { monde, moteur, erreur } = etat.current as ReturnType<typeof construire>;

  /** Simule n saisons (jusqu'à la fin de la saison en cours, puis les suivantes). */
  const simuler = (n: number) => {
    if (!monde || !moteur) return;
    // Dernière saison à terminer : la saison en cours (ou la suivante si celle-ci est déjà bouclée), puis n − 1 autres.
    const fin = (monde.date.semaine >= 50 ? monde.date.annee + 1 : monde.date.annee) + n - 1;
    // On s'arrête juste après le bilan de fin de saison (semaine 49) de l'année « fin ».
    while (monde.date.annee < fin || (monde.date.annee === fin && monde.date.semaine < 50)) moteur.avancerUneSemaine(monde);
    setVersion((v) => v + 1);
    setSelection(null);
    setOnglet('saisons');
  };

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
        <span class="muted">nom de travail · phase 4</span>
      </header>
      <main class="page">
        <div class="carte" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span class="muted">Graine</span>
          <input class="num" style={{ width: '90px' }} value={saisie} onInput={(e) => setSaisie((e.target as HTMLInputElement).value)} />
          <button class="btn principal" onClick={() => { const g = Number.parseInt(saisie, 10); if (Number.isInteger(g)) { setGraine(g); setSelection(null); setHistorique([]); } }}>
            Nouveau monde
          </button>
          <button class="btn" onClick={() => simuler(1)} disabled={!monde}>Simuler 1 saison</button>
          <button class="btn" onClick={() => simuler(10)} disabled={!monde}>Simuler 10 saisons</button>
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
                {onglet === 'bacasable' && moteur && <BacASable monde={monde} moteur={moteur} rafraichir={() => setVersion((v) => v + 1)} ouvrir={ouvrir} />}
                {onglet === 'saisons' && <VueSaisons monde={monde} ouvrir={ouvrir} />}
                {onglet === 'bilan' && <VueBilan monde={monde} />}
                {onglet === 'voitures' && <VueVoitures monde={monde} />}
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
  const pb = verifierCoherence(monde, { ages: monde.date.annee === 2027 && monde.date.semaine === 1 });
  return pb.length === 0 ? <p style={{ color: 'var(--green)' }}>Aucun problème de cohérence détecté.</p> : (
    <ul class="erreur">{pb.map((x) => <li key={x}>{x}</li>)}</ul>
  );
}
