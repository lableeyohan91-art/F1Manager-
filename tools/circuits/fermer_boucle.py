"""Phase 11b — répare les sauts de position (début de tour mal recollé) et referme la boucle d'une trace dont le dernier point ne rejoint pas le premier (tour relevé dont le début et la fin
des positions ne coïncident pas exactement). L'écart est réparti linéairement le long du tour (quelques mètres sur plusieurs
kilomètres : courbures inchangées à l'œil, longueur vérifiée par les tests). Usage : python3 fermer_boucle.py <trace.json> [...]
"""
import json, math, sys

SAUT_MAX = 2.5  # un pas de plus de 2,5 × le pas nominal est un saut (début de tour mal recollé)
FENETRE = 6    # points reconstruits de chaque côté d'un saut (sur une ligne droite : interpolation linéaire exacte)


def reparer_sauts(d):
    p, n, pas = d['points'], len(d['points']), d['pasM']
    reparations = []
    for i in range(n):
        q = p[(i + 1) % n]
        if math.hypot(q['x'] - p[i]['x'], q['y'] - p[i]['y']) > SAUT_MAX * pas:
            a, b = (i - FENETRE) % n, (i + 1 + FENETRE) % n
            pa, pb = p[a], p[b]
            for k in range(1, 2 * FENETRE + 1):
                j = (a + k) % n
                f = k / (2 * FENETRE + 1)
                p[j]['x'] = round(pa['x'] + (pb['x'] - pa['x']) * f, 1)
                p[j]['y'] = round(pa['y'] + (pb['y'] - pa['y']) * f, 1)
            reparations.append(i * pas)
    return reparations


for f in sys.argv[1:]:
    d = json.load(open(f))
    rep = reparer_sauts(d)
    if rep:
        d.setdefault('statuts', {})['sauts'] = f'saut de position réparé (interpolation linéaire en ligne droite) à {rep} m'
        print(f, 'sauts réparés à', rep, 'm')
    p = d['points']
    n = len(p)
    # Point attendu après le dernier : prolongement du dernier pas ; l'écart à combler est la distance de ce point au premier.
    ex = 2 * p[-1]['x'] - p[-2]['x']
    ey = 2 * p[-1]['y'] - p[-2]['y']
    gx, gy = p[0]['x'] - ex, p[0]['y'] - ey
    for i, q in enumerate(p):
        q['x'] = round(q['x'] + gx * i / n, 1)
        q['y'] = round(q['y'] + gy * i / n, 1)
    d.setdefault('statuts', {})['fermeture'] = f'boucle refermée : écart de {math.hypot(gx, gy):.1f} m réparti le long du tour'
    json.dump(d, open(f, 'w'), ensure_ascii=False, separators=(',', ':'))
    print(f, f'écart réparti {math.hypot(gx, gy):.1f} m')
