/**
 * Phase 10 — parcours complet du joueur dans un vrai navigateur, sur un téléphone simulé (Playwright) :
 * nouvelle partie, prise de fonction, avancer, ouvrir chaque écran, une fiche, sauvegarder, recharger la page, reprendre.
 * Usage : npm run build && npx vite preview --port 4173 & node tools/parcours-joueur.mjs [dossier des captures]
 * Échoue (code 1) si une étape manque ou si la console du navigateur affiche une erreur.
 */
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

// Playwright est installé hors du projet (outil de test, pas une dépendance du jeu) : chargé par require.
const { chromium, devices } = createRequire(import.meta.url)('playwright');

const URL_SITE = process.env.URL_SITE ?? 'http://localhost:4173/F1Manager-/';
const dossier = process.argv[2] ?? 'sorties/parcours-joueur';
mkdirSync(dossier, { recursive: true });

const navigateur = await chromium.launch();
const erreurs = [];
const etapes = [];
const ok = (x) => { etapes.push(`✔ ${x}`); console.log(`✔ ${x}`); };

async function parcours(nomAppareil, contexteOptions) {
  const ctx = await navigateur.newContext(contexteOptions);
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push(`[${nomAppareil}] ${m.text()}`); });
  page.on('pageerror', (e) => erreurs.push(`[${nomAppareil}] ${e.message}`));
  const allerA = async (ecran) => {
    const bouton = page.locator('.jeu-nav button', { hasText: ecran });
    if (!(await bouton.isVisible())) await page.locator('.jeu-nav button.plus').click(); // téléphone : écrans secondaires derrière « Plus »
    await bouton.click();
  };
  const capture = (n) => page.screenshot({ path: `${dossier}/${nomAppareil}-${n}.png`, fullPage: false });

  await page.goto(URL_SITE);
  await page.getByText('Prendre la tête d’une écurie').waitFor();
  await page.locator('input.num').first().fill('42');
  await capture('01-accueil');
  await page.getByRole('button', { name: 'Nouvelle partie' }).click();
  await page.getByText('Votre manager').waitFor({ timeout: 60_000 });
  ok(`${nomAppareil} : monde préparé`);
  await page.getByLabel('Prénom').fill('Camille');
  await page.getByLabel('Nom', { exact: true }).fill('Essai');
  await page.locator('.carte-choix').last().click();
  await capture('02-choix');
  await page.getByRole('button', { name: 'Prendre la tête de l’écurie' }).click();
  await page.getByText('Décisions en attente').waitFor();
  ok(`${nomAppareil} : prise de fonction`);
  await capture('03-tableau');

  // Avancer : une semaine, puis jusqu'à une décision (plusieurs fois).
  const dateAvant = await page.locator('.jeu-titre .muted').textContent();
  await page.getByRole('button', { name: '+1 sem.' }).click();
  await page.waitForFunction((d) => document.querySelector('.jeu-titre .muted')?.textContent !== d, dateAvant);
  ok(`${nomAppareil} : une semaine simulée`);
  // Phase 11c : le marché des sponsors de janvier a fait des offres à l'écurie du joueur (domaine commercial non délégué).
  await allerA('Finances');
  await page.getByText('Sponsors sous contrat').first().waitFor();
  const signer = page.getByRole('button', { name: 'Signer ce contrat' });
  if (await signer.count()) {
    await capture('04b-offre-sponsor');
    await signer.last().click();
    await page.getByText(/Contrat signé avec/).waitFor();
    ok(`${nomAppareil} : offre de sponsor signée (${await signer.count()} variante(s) encore proposée(s) par d'autres offres)`);
  } else ok(`${nomAppareil} : écran des sponsors (aucune offre en attente)`);
  await allerA('Accueil');
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Continuer ▸' }).click();
    await page.waitForFunction(() => !document.querySelector('.jeu-bandeau.calcul'), null, { timeout: 120_000 });
  }
  ok(`${nomAppareil} : avance jusqu’aux décisions (${await page.locator('.jeu-titre .muted').textContent()})`);
  await capture('04-tableau-apres');

  for (const [ecran, texte] of [['Actualités', 'À la une'], ['Archives', 'Records'], ['Équipe', 'Effectif de'], ['Marché', 'Cibles possibles'], ['Technique', 'Savoir technique'], ['Finances', 'Budget de développement'], ['Championnat', 'Constructeurs'], ['Direction', 'Délégations'], ['Réglages', 'Mesure des performances']]) {
    await allerA(ecran);
    await page.getByText(texte).first().waitFor();
    await capture(`05-${ecran.normalize('NFD').replace(/[^a-zA-Z]/g, '').toLowerCase()}`);
  }
  ok(`${nomAppareil} : les 9 écrans s’ouvrent`);

  // Fiche d'un pilote de l'équipe, et une action (soutien).
  await allerA('Équipe');
  await page.locator('.liste-personnes li', { hasText: 'Pilote titulaire' }).first().click();
  await page.getByText('Compétences').waitFor();
  await page.getByRole('button', { name: 'Soutenir' }).click();
  await page.getByText('Soutien exprimé.').waitFor();
  await capture('06-fiche-pilote');
  ok(`${nomAppareil} : fiche pilote et action (soutien)`);

  // Délégation : reprendre la main sur le personnel, puis la rendre.
  await allerA('Direction');
  const etiquette = page.locator('label.interrupteur', { hasText: 'Recrutements, prolongations' });
  const avant = await etiquette.locator('input').isChecked();
  await etiquette.click();
  await page.waitForFunction((a) => document.querySelectorAll('label.interrupteur input')[1]?.checked !== a, avant);
  await etiquette.click();
  ok(`${nomAppareil} : délégation modifiée`);

  // Sauvegarde, rechargement, reprise.
  await allerA('Réglages');
  await page.getByRole('button', { name: 'Sauvegarder' }).click();
  await page.getByText('Partie sauvegardée').waitFor({ timeout: 30_000 });
  const date = await page.locator('.jeu-titre .muted').textContent();
  await page.reload();
  await page.getByRole('button', { name: 'Reprendre la partie' }).click();
  await page.getByText('Décisions en attente').waitFor({ timeout: 30_000 });
  const dateReprise = await page.locator('.jeu-titre .muted').textContent();
  if (dateReprise !== date) throw new Error(`Reprise à une autre date : ${dateReprise} au lieu de ${date}`);
  ok(`${nomAppareil} : sauvegarde puis reprise (${date})`);

  // Mesure des performances (D-110).
  await allerA('Réglages');
  await page.getByRole('button', { name: '8 semaines' }).click();
  await page.getByText(/semaines en/).waitFor({ timeout: 60_000 });
  ok(`${nomAppareil} : mesure — ${await page.locator('p.num.petit').textContent()}`);
  await capture('07-mesure');

  // Aucun défilement horizontal de la page.
  const deborde = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (deborde) throw new Error(`${nomAppareil} : la page déborde horizontalement`);
  ok(`${nomAppareil} : pas de débordement horizontal`);

  // Audit de la phase 10 : import d'une sauvegarde téléchargée (vérifiée, puis confirmation).
  await allerA('Réglages');
  const [telechargement] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Télécharger la sauvegarde' }).click()]);
  await page.getByLabel('Fichier de sauvegarde').setInputFiles(await telechargement.path());
  await page.getByText('Partie trouvée').waitFor();
  await page.getByRole('button', { name: 'Remplacer la partie en cours' }).click();
  await page.getByText('Partie importée').waitFor();
  ok(`${nomAppareil} : import d’une sauvegarde téléchargée`);

  // Audit de la phase 10 : nouvelle partie alors qu'une partie existe → confirmation, annulation possible, ancienne partie récupérable.
  await allerA('Réglages');
  await page.getByRole('button', { name: 'Sauvegarder' }).click();
  await page.getByText('Partie sauvegardée').waitFor({ timeout: 30_000 });
  await page.getByRole('button', { name: 'Quitter vers l’accueil' }).click();
  await page.getByRole('button', { name: 'Nouvelle partie' }).click();
  await page.getByText('Votre manager').waitFor({ timeout: 60_000 });
  await page.getByLabel('Prénom').fill('Deuxième');
  await page.getByLabel('Nom', { exact: true }).fill('Partie');
  await page.locator('.carte-choix').first().click();
  await page.getByRole('button', { name: 'Prendre la tête de l’écurie' }).click();
  await page.getByText('Une partie est déjà sauvegardée.').waitFor();
  await page.getByRole('button', { name: 'Annuler' }).click();
  if (await page.getByText('Une partie est déjà sauvegardée.').isVisible()) throw new Error('la confirmation ne s’est pas fermée');
  await page.getByRole('button', { name: 'Prendre la tête de l’écurie' }).click();
  await page.getByRole('button', { name: 'Confirmer et commencer' }).click();
  await page.getByText('La précédente est conservée').waitFor({ timeout: 30_000 });
  ok(`${nomAppareil} : nouvelle partie avec confirmation (annulation puis confirmation)`);
  await allerA('Réglages');
  await page.getByRole('button', { name: 'Quitter vers l’accueil' }).click();
  await page.getByRole('button', { name: 'Reprendre l’ancienne partie' }).click();
  await page.getByText('Ancienne partie reprise').waitFor({ timeout: 30_000 });
  ok(`${nomAppareil} : ancienne partie récupérée`);

  // Audit de la phase 10 : sauvegarde principale corrompue → reprise par le secours ; les deux corrompues → message clair.
  const corrompre = (cles) => page.evaluate((cles) => new Promise((ok, ko) => {
    const req = indexedDB.open('f1manager', 1);
    req.onsuccess = () => { const tx = req.result.transaction('sauvegardes', 'readwrite'); for (const k of cles) tx.objectStore('sauvegardes').put(new Blob(['corrompu']), k); tx.oncomplete = () => ok(true); tx.onerror = () => ko(tx.error); };
    req.onerror = () => ko(req.error);
  }), cles);
  await corrompre(['partie-joueur']);
  await page.reload();
  await page.getByRole('button', { name: 'Reprendre la partie' }).click();
  await page.getByText('Partie récupérée depuis la sauvegarde de secours').waitFor({ timeout: 30_000 });
  ok(`${nomAppareil} : principale corrompue, partie récupérée par le secours`);
  await corrompre(['partie-joueur', 'partie-joueur::secours']);
  await page.reload();
  await page.getByRole('button', { name: 'Reprendre la partie' }).click();
  await page.getByText('Sauvegardes illisibles').waitFor();
  ok(`${nomAppareil} : principale et secours corrompues, refus expliqué`);
  await page.getByRole('button', { name: 'Nouvelle partie' }).waitFor();

  await ctx.close();
}

try {
  await parcours('telephone', { ...devices['iPhone 13'] });
  await parcours('ordinateur', { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
} catch (e) {
  erreurs.push(String(e));
}
await navigateur.close();
if (erreurs.length) {
  console.error('ÉCHEC :\n' + erreurs.join('\n'));
  process.exit(1);
}
console.log(`Parcours réussi (${etapes.length} étapes).`);
