/** Mode développeur (D-108) : modifier les notes d'une personne par la commande « dev.modifier_personne ». */
import { useState } from 'preact/hooks';
import { AUTEUR_DEVELOPPEUR, type Commande, type Monde, type Moteur, type Personne } from '../../engine';
import { TRAITS } from '../../engine/balance/personnages';
import { Carte } from './outils';

export function EditeurDeveloppeur({ monde, moteur, p, rafraichir }: { monde: Monde; moteur: Moteur; p: Personne; rafraichir: () => void }) {
  const [message, setMessage] = useState<string | null>(null);
  const modifier = (champ: 'competence' | 'trait' | 'potentiel', cle: string, valeur: number) => {
    const commande: Commande = { type: 'dev.modifier_personne', auteur: AUTEUR_DEVELOPPEUR, source: 'exterieur', parametres: { personne: p.id, champ, cle, valeur } };
    const r = moteur.commandes.executer(monde, commande);
    if (r.ok) monde.journalCommandes.push({ date: { ...monde.date }, commande }); // journalisée : la partie reste rejouable
    setMessage(r.ok ? null : r.motif);
    rafraichir();
  };
  const champ = (lib: string, v: number, onChange: (x: number) => void, pas = 0.5) => (
    <label key={lib} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center', margin: '2px 0' }}>
      <span>{lib}</span>
      <input type="number" class="num" min={1} max={20} step={pas} value={v} style={{ width: '80px' }}
        onChange={(e) => onChange(Number((e.target as HTMLInputElement).value))} />
    </label>
  );
  return (
    <Carte titre="Mode développeur — modifier les notes">
      <p class="muted" style={{ fontSize: '.85rem' }}>Chaque modification passe par une commande du moteur, journalisée et tracée par un événement.</p>
      {message && <p class="erreur">{message}</p>}
      {champ('Potentiel (caché)', p.potentiel, (x) => modifier('potentiel', 'potentiel', x), 1)}
      <h4>Compétences</h4>
      {Object.entries(p.competences).map(([k, v]) => champ(k, v, (x) => modifier('competence', k, x)))}
      <h4>Traits</h4>
      {Object.entries(TRAITS).map(([k, lib]) => champ(lib, p.traits[k] ?? 10, (x) => modifier('trait', k, x), 1))}
    </Carte>
  );
}
