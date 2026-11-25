import { resolve } from 'node:path';
const r = resolve('.'); // Usage : npx tsx tools/retraites-pilotes.mts (10 graines × 15 saisons) — D-167
const eng = await import(`${r}/src/engine/index.ts`);
const { lireDonneesGrille2026 } = await import(`${r}/src/platform/node/donnees.ts`);
const sc = eng.creerScenarioGrille2026(lireDonneesGrille2026(r));
const lignes: any[] = [];
for (let g = 1; g <= 10; g++) {
  const m = sc.creerMonde(g); const mo = sc.creerMoteur();
  mo.avancer(m, 52 * 15);
  for (const e of Object.values(m.evenements) as any[]) {
    if (e.type !== 'personne.retraite' || !String(e.contexte?.poste).startsWith('pilote') || !(e.contexte?.saisonsF1 > 0)) continue;
    const pp = (m.tables['personnes'][e.acteurs[0].id] ?? m.tables['archives']?.[e.acteurs[0].id]) as any;
    lignes.push({ annee: e.date.annee, nom: pp ? pp.nom : '?', depart: pp ? 2026 - pp.anneeNaissance : 0, age: e.contexte.age, poste: e.contexte.poste, motif: e.contexte.motif, sf1: e.contexte.saisonsF1, titres: e.contexte.titres });
  }
}
const grp = (f: (l: any) => boolean) => lignes.filter(f);
const choix = (l: any) => ['choix personnel', 'retraite annoncée', 'retraite surprise'].includes(l.motif) && l.poste === 'pilote_titulaire';
const titu = grp(choix);
const autres = grp((l) => !choix(l));
const mot: Record<string, number> = {}; for (const l of lignes) mot[l.motif] = (mot[l.motif] ?? 0) + 1; console.log(mot);
const repart = (v: any[]) => { const t = [[0,32],[33,34],[35,36],[37,40],[41,99]]; return `${v.length} cas, âge moyen ${(v.reduce((a,l)=>a+l.age,0)/v.length).toFixed(1)} : ` + t.map(([a,b]) => `${b===99?a+'+':a===0?'≤'+b:a+'-'+b} ${Math.round(100*v.filter(l=>l.age>=a&&l.age<=b).length/v.length)} %`).join(' · '); };
console.log('Titulaires qui arrêtent (choix personnel) :', repart(titu));
console.log('Autres (sans baquet, réservistes) :', repart(autres));
const parMotif: Record<string, number> = {}; for (const l of autres) parMotif[l.poste + '/' + l.motif] = (parMotif[l.poste + '/' + l.motif] ?? 0) + 1; console.log(parMotif);
const sf = grp(l=>l.sf1>=5); console.log('Pilotes avec 5 saisons de F1 ou plus :', repart(sf));

console.log('41+ (titulaires) :', titu.filter(l=>l.age>=41).map(l=>`${l.nom} ${l.annee} ${l.age} ans (${l.depart} en 2026)`).join(' | '));
const gen = titu.filter(l=>l.depart<=32); console.log('Titulaires âgés de 32 ans ou moins en 2026 :', repart(gen));
