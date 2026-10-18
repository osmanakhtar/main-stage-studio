#!/usr/bin/env python3
"""Vera logo: builds every logo file from Fraunces, so the mark is reproducible, not hand-drawn.

The idea ("vera.", the full stop) is in ../../vera-brand-identity.md section 7.

    python3 -m venv /tmp/vl && /tmp/vl/bin/pip install fonttools
    /tmp/vl/bin/python build-logo.py

Needs fonttools and rsvg-convert (brew install librsvg). Writes SVG masters and PNG
exports beside this script, then copies the PNGs to the places that read them:
Content Studio (../../assets/vera-mark*.png) and the studio-platform tenant
(tenants/vera/brand/logo-*.png). Edit the constants here, never the SVGs.
"""
import os, shutil, subprocess
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

HERE = os.path.dirname(os.path.abspath(__file__))
VERA = os.path.dirname(os.path.dirname(HERE))
TENANT = '/Users/osmanakhtar/workspace/studio-platform/tenants/vera/brand'
FONT = os.path.join(VERA, 'brand/fonts/Fraunces-Variable.ttf')

NAVY, BONE, GOLD = '#1E2B4D', '#F5F2EC', '#C6A667'
# Display optical size, light weight (the "light touch"), SOFT up for warmth, WONK off for calm.
INSTANCE = {'opsz': 144, 'wght': 320, 'SOFT': 100, 'WONK': 0}
KERN = {'ve': -38, 'er': -6, 'ra': -22}   # optical kerning, font units (2000 upm)
R = 104      # the point: a true circle, about one stem wide, so it reads as a mark not punctuation
GAP = 60     # air between the last letter's ink and the point

font = instantiateVariableFont(TTFont(FONT), INSTANCE)
gs, cmap = font.getGlyphSet(), font.getBestCmap()

def glyph(c):
    g = gs[cmap[ord(c)]]
    p, b = SVGPathPen(gs), BoundsPen(gs)
    g.draw(p); g.draw(b)
    return p.getCommands(), g.width, b.bounds

def word(text):
    x, parts, last = 0, [], None
    for i, c in enumerate(text):
        d, adv, bounds = glyph(c)
        parts.append(f'<path transform="translate({x:.1f} 0)" d="{d}"/>')
        last = (x, bounds)
        x += adv + (KERN.get(c + text[i + 1], 0) if i + 1 < len(text) else 0)
    return ''.join(parts), last[0] + last[1][2]   # paths, right edge of the ink

def lockup(ink, pad=60):
    body, right = word('vera')
    cx = right + GAP + R
    minx, top, bot = glyph('v')[2][0], glyph('e')[2][3], -20
    w, h = cx + R - minx + 2 * pad, top - bot + 2 * pad
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" role="img" aria-label="Vera">'
            f'<g transform="translate({pad - minx:.1f} {top + pad:.1f}) scale(1 -1)">'
            f'<g fill="{ink}">{body}</g><circle cx="{cx:.1f}" cy="{R}" r="{R}" fill="{GOLD}"/></g></svg>')

def monogram(ink, bg=None, r=R, size=1000):
    """'v.' in a square. Small sizes pass a larger r: the point is optically enlarged, as a foundry draws small sizes."""
    body, right = word('v')
    vb = glyph('v')[2]
    cx = right + GAP * 0.75 + r
    inkw, h = cx + r - vb[0], vb[3] - vb[1]
    s = size * 0.56 / inkw
    tx, ty = (size - inkw * s) / 2 - vb[0] * s, (size + h * s) / 2 + vb[1] * s
    rect = f'<rect width="{size}" height="{size}" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" role="img" aria-label="Vera">{rect}'
            f'<g transform="translate({tx:.1f} {ty:.1f}) scale({s:.4f} {-s:.4f})"><g fill="{ink}">{body}</g>'
            f'<circle cx="{cx:.1f}" cy="{r}" r="{r}" fill="{GOLD}"/></g></svg>')

SVGS = {
    'vera-logo': lockup(NAVY),                       # primary: on bone, white, stone
    'vera-logo-light': lockup(BONE),                 # on navy and on photography
    'vera-monogram': monogram(NAVY),                 # logo bug, stamps, small marks
    'vera-monogram-light': monogram(BONE),
    'vera-avatar': monogram(BONE, bg=NAVY),          # social avatar, app icon
    'vera-favicon': monogram(BONE, bg=NAVY, r=150),  # 16 to 48px
}
# (svg, png name, width): width only, height follows the artwork
PNGS = [('vera-logo', 'vera-logo', 1200), ('vera-logo-light', 'vera-logo-light', 1200),
        ('vera-monogram', 'vera-monogram', 512), ('vera-monogram-light', 'vera-monogram-light', 512),
        ('vera-avatar', 'vera-avatar', 1080), ('vera-favicon', 'vera-favicon', 64)]
# where each surface reads its logo: (png built here, destination)
COPIES = [
    ('vera-monogram.png', os.path.join(VERA, 'assets/vera-mark.png')),
    ('vera-monogram-light.png', os.path.join(VERA, 'assets/vera-mark-light.png')),
    ('vera-monogram.svg', os.path.join(VERA, 'assets/vera-mark.svg')),
    ('tenant-header.png', os.path.join(TENANT, 'logo-header.png')),   # console header, navy bar
    ('tenant-email.png', os.path.join(TENANT, 'logo-email.png')),     # email header, white, shown 120px
    ('tenant-footer.png', os.path.join(TENANT, 'logo-footer.png')),   # email footer, navy, shown 84px
]

def png(svg, out, width):
    subprocess.run(['rsvg-convert', '-w', str(width), os.path.join(HERE, svg + '.svg'), '-o', os.path.join(HERE, out)], check=True)

for name, svg in SVGS.items():
    open(os.path.join(HERE, name + '.svg'), 'w').write(svg + '\n')
for svg, out, w in PNGS:
    png(svg, out + '.png', w)
png('vera-logo-light', 'tenant-header.png', 400)
png('vera-logo', 'tenant-email.png', 240)
png('vera-logo-light', 'tenant-footer.png', 168)
for src, dst in COPIES:
    if os.path.isdir(os.path.dirname(dst)):
        shutil.copy(os.path.join(HERE, src), dst)
print('built', len(SVGS), 'svgs and copied', len(COPIES), 'files')
