"""Phase 11b — recoupement partiel des éditions antérieures à 2023 avec les comptes rendus de course de Wikipédia.
Vérifie seulement la PRÉSENCE d'une Safety Car, d'une VSC, d'un drapeau rouge (un récit ne permet pas un décompte fiable).
Usage : python3 recoupement_wikipedia.py <trace> ...   (écrit le résultat dans chaque édition : champ recoupementWikipedia)
"""
import json, re, sys, time, urllib.request, urllib.parse

def article(titre):
    for e in range(6):
        try:
            r = urllib.request.Request(f'https://en.wikipedia.org/w/index.php?title={urllib.parse.quote(titre)}&action=raw',
                                       headers={'User-Agent': 'etude-circuits/1.0 (jeu de gestion, usage non commercial)'})
            t = urllib.request.urlopen(r, timeout=60).read().decode()
            m = re.match(r'#REDIRECT\s*\[\[([^\]#]+)', t, re.I)
            if m:
                titre = m.group(1); time.sleep(3); continue
            return t
        except Exception:
            time.sleep(20 * (e + 1))
    return None

def section_course(t):
    """Seulement le récit de la course (section « Race »), pas les essais ni les qualifications."""
    m = re.search(r'\n===?\s*Race\s*===?\s*\n', t)
    if not m:
        return None
    fin = re.search(r'\n==[^=][^\n]*==\s*\n', t[m.end():])
    return t[m.end(): m.end() + fin.start()] if fin else t[m.end():]

def presences(t):
    t = re.sub(r'<ref[^>]*>.*?</ref>|<ref[^/]*/>', '', t, flags=re.S).lower()
    vsc = bool(re.search(r'virtual safety car|\bvsc\b', t))
    sans_vsc = re.sub(r'virtual safety car', ' ', t)
    sc = bool(re.search(r'safety car', sans_vsc))
    dr = bool(re.search(r'red flag|red-flag|race was (suspended|stopped)|was red[- ]flagged', t))
    return dict(sc=sc, vsc=vsc, dr=dr)

if __name__ == '__main__':
    for trace in sys.argv[1:]:
        d = json.load(open(trace))
        for e in d['historique']['editions']:
            if e['annee'] >= 2023:
                continue
            t = article(f"{e['annee']} {e['nom']}")
            if t is None:
                e['recoupementWikipedia'] = 'article inaccessible'; continue
            rc = section_course(t)
            if rc is None:
                e['recoupementWikipedia'] = 'section « course » introuvable'; continue
            p = presences(rc)
            base = dict(sc=bool(e['safetyCars']), vsc=bool(e['vsc']), dr=bool(e['drapeauxRouges']))
            diff = [k for k in p if p[k] != base[k]]
            e['recoupementWikipedia'] = 'présences identiques' if not diff else 'désaccord sur : ' + ', '.join({'sc': 'Safety Car', 'vsc': 'VSC', 'dr': 'drapeau rouge'}[k] + (' (article : oui)' if p[k] else ' (article : non)') for k in diff)
            print(d['circuit'], e['annee'], e['recoupementWikipedia'], flush=True)
            time.sleep(3)
        json.dump(d, open(trace, 'w'), ensure_ascii=False, separators=(',', ':'))
