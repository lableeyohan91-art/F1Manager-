import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { App } from './App';
import { Jeu } from './jeu/Jeu';
import './style.css';

/** Phase 10 : l'écran de jeu par défaut ; le diagnostic (outil de conception) à l'adresse #diagnostic. */
function Racine() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const f = () => setHash(location.hash);
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);
  return hash.startsWith('#diagnostic') ? <App /> : <Jeu />;
}

render(<Racine />, document.getElementById('app') as HTMLElement);
