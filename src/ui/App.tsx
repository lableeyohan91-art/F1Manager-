import { useState } from 'preact/hooks';
import { empreinte, formaterDate, scenarioVideDemo } from '../engine';
import { SEMAINES_PAR_AN } from '../engine/balance/calendrier';

/** Phase 1 : page de démonstration du noyau. Remplacée par le diagnostic en phase 2. */
export function App() {
  const [resultat, setResultat] = useState<string | null>(null);

  const simuler = () => {
    const monde = scenarioVideDemo.creerMonde(42);
    const moteur = scenarioVideDemo.creerMoteur();
    const t0 = performance.now();
    moteur.avancer(monde, 50 * SEMAINES_PAR_AN);
    const ms = performance.now() - t0;
    setResultat(
      `50 saisons simulées en ${ms.toFixed(0)} ms, jusqu'à ${formaterDate(monde.date)}. ` +
        `${Object.keys(monde.evenements).length} événements au journal, ${monde.chronique.length} dans la Chronique. Empreinte ${empreinte(monde)}.`,
    );
  };

  return (
    <>
      <header class="topbar">
        <span class="marque" />
        <span class="titre">NOM DE TRAVAIL</span>
        <span class="muted">nom de travail · phase 1</span>
      </header>
      <main class="page">
        <div class="carte">
          <h2>Moteur en construction</h2>
          <p class="muted">Le noyau de la simulation fonctionne. Aucune règle de jeu pour l'instant.</p>
          <button class="btn principal" onClick={simuler}>Simuler 50 saisons de démonstration</button>
          {resultat && <p class="num">{resultat}</p>}
        </div>
      </main>
    </>
  );
}
