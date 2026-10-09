"""Shared kit for the Art by Ayesha Johar multi-page prototypes (v3 A/B/C and v4).

Holds the content (paintings, rooms, her words), colour sampled from the
paintings with Pillow, generated background art for each room, and the parts
every variation shares: Rooms menu, footer, painting page, forms and their JS.
A variation supplies its own fonts, colour tokens, CSS and page layouts.

Images are always plain <img src="assets/art/..."> and art is inline SVG, so the
Stage publish rewrite reaches every asset (Stage does not rewrite CSS url()).
"""
import colorsys
import html
import json
import os
import random

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ART = os.path.join(HERE, "assets", "art")
E = html.escape
ARABIC = "جوهر"

# ── CONTENT ────────────────────────────────────────────────────────────────

STATUS = {"available": "Original available", "sold": "Sold", "prints": "Prints available"}
PRICE = {"available": "On request", "sold": "Original sold", "prints": "Prints from Etsy"}
PRICE_LINE = {"available": "Original available. Price on request.",
              "sold": "The original has found a home.",
              "prints": "Prints available through Etsy."}

# slug, working title, room, status, alt, sm width, sm height
WORKS = [
    ("water", "Water I", "nature", "available", "Water I: light rippling across clear turquoise water, seen from above.", 800, 798),
    ("breeze", "Breeze", "nature", "prints", "Breeze: a palm tree leaning over a turquoise lagoon with an island on the horizon.", 800, 394),
    ("dancing-trees", "Dancing Trees", "nature", "prints", "Dancing Trees: flowing, flame-like tree forms in coral, orange, teal and deep brown.", 800, 602),
    ("woodland", "Woodland", "nature", "sold", "Woodland: tall bare trunks against a soft pink winter sky.", 600, 800),
    ("water-ii", "Water II", "nature", "prints", "Water II: teal water broken into looping lines of reflected light.", 800, 626),
    ("stripes", "Stripes", "nature", "prints", "Stripes: horizontal bands of cobalt, sky blue, violet, coral and yellow.", 568, 800),
    ("dancing-trees-ii", "Dancing Trees II", "nature", "prints", "Dancing Trees II: the flowing tree forms again, in teal, lilac and peach.", 800, 597),
    ("tower", "Tower", "world", "available", "Tower: a rust and teal building pierced with round windows against a pink sky.", 644, 800),
    ("forts", "Mansa Forts", "world", "available", "Mansa Forts: three rusted sea forts on stilts above turquoise water under a grey sky.", 800, 792),
    ("amsterdam", "Amsterdam", "world", "sold", "Amsterdam: a bare tree in front of a red brick canal house with glowing windows.", 614, 800),
    ("skyline", "Skyline", "world", "available", "Skyline: a city silhouette beneath a sweeping violet and coral dusk sky.", 643, 800),
    ("block", "Block", "world", "prints", "Block: a facade abstracted into a grid of orange, red, blue and yellow panels.", 793, 800),
    ("earth", "The Earth", "witness", "sold", "The Earth: a planet in fiery reds, golds and blues streaks through a violet sky.", 800, 979),
]
W = {w[0]: dict(slug=w[0], title=w[1], pillar=w[2], status=w[3], alt=w[4], w=w[5], h=w[6]) for w in WORKS}

ABOUT_PARAS = [
    "I am a painter, a feminist and a justice fighter. I was born in Mauritius and I live in London. I am political, spiritual and curious, and I have spent years decolonising my mind and soul.",
    "I do not paint to fit in. I go against the grain, unapologetically, and I put colours together the way I put myself together: boldly, and my own way.",
    "I have been making work for over thirty years. Every painting is layered on purpose. Look again, and there is always something new to see.",
]
NAME_PARAS = [
    "In 1600s Rajasthan, the women of a captured empire used to sacrifice themselves in a pit of fire rather than be shackled as sex slaves by the conquerors.",
    "Being a Johar, when my wife and I chose this name after we married, was a statement that we live by our principles, unapologetically and at all costs. I am political. I have been decolonising my mind and soul, and I am a justice fighter. Johar encompasses those values and passions.",
]
BEAUTY = ("For me, beauty is a form of resistance. Hidden colours and shapes exist everywhere, and once I expose them in my paintings, "
          "it forces us to see beauty in both the good and the bad. Through that altered way of seeing, I urge the audience to see what we can reveal, "
          "and to challenge what is harmful in a different way.")
TAGS = ["Acrylic", "London", "Mauritius", "Feminist", "Justice", "Spirituality", "Community", "LGBTQ+"]

# ── COLOUR, SAMPLED FROM THE PAINTINGS ─────────────────────────────────────


def hex_(rgb):
    return "#%02X%02X%02X" % tuple(int(round(max(0, min(255, c)))) for c in rgb)


def rgb_(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def lum(h):
    def ch(c):
        c /= 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb_(h)
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)


def contrast(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def mix(a, b, t):
    ra, rb = rgb_(a), rgb_(b)
    return hex_([ra[i] * (1 - t) + rb[i] * t for i in range(3)])


def hls(h):
    return colorsys.rgb_to_hls(*(c / 255 for c in rgb_(h)))


def from_hls(hh, l, s):
    return hex_([c * 255 for c in colorsys.hls_to_rgb(hh, max(0, min(1, l)), max(0, min(1, s)))])


def shade(h, l=None, s=None):
    hh, l0, s0 = hls(h)
    return from_hls(hh, l0 if l is None else l, s0 if s is None else s)


def until(colour, against, ratio, step=-0.02):
    """Move lightness (down by default) until `colour` reaches `ratio` against `against`."""
    hh, l, s = hls(colour)
    while contrast(from_hls(hh, l, s), against) < ratio and 0 < l < 1:
        l += step
    return from_hls(hh, l, s)


def text_on(bg, light="#FFFFFF", dark="#16110E"):
    return light if contrast(light, bg) >= contrast(dark, bg) else dark


def lift(h, floor=0.56):
    hh, l, s = hls(h)
    return from_hls(hh, max(l, floor), s)


def sample(slug):
    im = Image.open(os.path.join(ART, f"{slug}-sm.webp")).convert("RGB").resize((160, 160))
    q = im.quantize(colors=16, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()
    found = []
    for n, i in sorted(q.getcolors(), reverse=True):
        h = hex_(pal[i * 3:i * 3 + 3])
        hh, l, s = hls(h)
        found.append(dict(hex=h, share=n / 25600, h=hh, l=l, s=s))
    vivid = [c for c in found if c["s"] >= 0.3 and 0.28 <= c["l"] <= 0.82]
    vivid.sort(key=lambda c: c["s"] * (c["share"] ** 0.5), reverse=True)
    chosen = []
    for c in vivid + sorted(found, key=lambda c: -c["share"]):
        if all(min(abs(c["h"] - d["h"]), 1 - abs(c["h"] - d["h"])) > 0.06 or abs(c["l"] - d["l"]) > 0.25 for d in chosen):
            chosen.append(c)
        if len(chosen) == 5:
            break
    return dict(colours=[c["hex"] for c in chosen], dark=min(found, key=lambda c: c["l"])["hex"])


PALETTE = {w[0]: sample(w[0]) for w in WORKS}
CREAM = "#FBF6EE"

# ── ROOMS ──────────────────────────────────────────────────────────────────

ROOMS = [
    dict(key="sacred", num="I", name="The Sacred", line="Work that opens rather than closes.",
         desc="Mandalas, Ganesha, geometric symmetry. Spiritual traditions held with devotion and curiosity.",
         key_art=None, todo=[("Mandalas", "mandala"), ("Ganesha", "mandala")], borrowed=["skyline", "tower", "dancing-trees", "water"],
         note="The mandalas and the Ganesha are being photographed. Until then this room borrows its colours from across the collection."),
    dict(key="nature", num="II", name="Nature", line="The world before the damage.",
         desc="Water, shorelines, palm trees and skies. Open, generous and full of light.",
         key_art="water", todo=[], borrowed=None, note=""),
    dict(key="world", num="III", name="World", line="The places that shaped me.",
         desc="Amsterdam, Mauritius, London. Buildings and cities, painted as feeling rather than record.",
         key_art="tower", todo=[], borrowed=None, note=""),
    dict(key="witness", num="IV", name="Witness", line="Work that refuses to look away.",
         desc="George Floyd. The Earth with a bullet through it. The beauty is in the painting, not in what it shows. That is the resistance.",
         key_art="earth", todo=[("George Floyd", "line")], borrowed=None, note="The George Floyd portrait is being photographed and will hang here."),
    dict(key="love", num="V", name="Love", line="The quietest room.",
         desc="A pencil drawing of my wife. The most private work, given the most space.",
         key_art=None, todo=[("Pencil drawing", "love")], borrowed=["dancing-trees-ii", "woodland", "dancing-trees"],
         note="The drawing is being photographed. Until then this room borrows the softest colours from the collection."),
]


def _hue_far(a, b, d=0.05):
    return min(abs(hls(a)[0] - hls(b)[0]), 1 - abs(hls(a)[0] - hls(b)[0])) > d


for r in ROOMS:
    r["works"] = [W[w[0]] for w in WORKS if w[2] == r["key"]]
    src = [w["slug"] for w in r["works"]] or r["borrowed"]
    cols = []
    for s in src:
        cols += PALETTE[s]["colours"][:3]
    pick = []
    for c in cols:
        if all(_hue_far(c, d) for d in pick):
            pick.append(c)
    r["swatches"] = list(dict.fromkeys(pick + cols))[:6]
    while len(r["swatches"]) < 4:
        r["swatches"].append(shade(r["swatches"][0], l=min(0.8, hls(r["swatches"][-1])[1] + 0.2)))
    r["primary"] = max(r["swatches"][:3], key=lambda c: hls(c)[2]) if r["key"] == "witness" else r["swatches"][0]
R = {r["key"]: r for r in ROOMS}
HOME_COLOURS = [PALETTE[s]["colours"][0] for s in ("dancing-trees", "water", "skyline", "stripes", "tower", "breeze")]

# ── BACKGROUND ART, ONE LANGUAGE PER ROOM ──────────────────────────────────
# Colours come in as CSS variables --m1..--m4 so each variation can recolour them.


def _mandala(cx, cy, r, petals, spin):
    p = [f'<g class="spin" style="--spin:{spin}s">']
    for k, rr in enumerate((1, .8, .6, .42, .24, .1)):
        p.append(f'<circle cx="{cx}" cy="{cy}" r="{r * rr:.1f}" fill="var(--m{k % 4 + 1})" opacity="{.18 + k * .06:.2f}"/>')
    for i in range(petals):
        a = i * 360 / petals
        p.append(f'<ellipse cx="{cx}" cy="{cy - r * .6:.1f}" rx="{r * .1:.1f}" ry="{r * .3:.1f}" fill="var(--m2)" opacity=".5" transform="rotate({a:.1f} {cx} {cy})"/>')
        p.append(f'<ellipse cx="{cx}" cy="{cy - r * .32:.1f}" rx="{r * .06:.1f}" ry="{r * .16:.1f}" fill="var(--m4)" opacity=".7" transform="rotate({a + 180 / petals:.1f} {cx} {cy})"/>')
    for i in range(petals * 2):
        p.append(f'<circle cx="{cx}" cy="{cy - r * .9:.1f}" r="{r * .03:.1f}" fill="var(--m3)" transform="rotate({i * 180 / petals:.1f} {cx} {cy})"/>')
    p.append(f'<circle cx="{cx}" cy="{cy}" r="{r * .96:.1f}" fill="none" stroke="var(--m1)" stroke-width="1.5" opacity=".7"/></g>')
    return "".join(p)


def _wave(y, amp, period, fill, op, dur):
    d = [f"M-1200 {y}"]
    x = -1200
    while x < 2400:
        d.append(f"q {period / 4} {-amp} {period / 2} 0 t {period / 2} 0")
        x += period
    d.append("V 820 H -1200 Z")
    return f'<path class="drift" style="--drift:{dur}s;--dx:-{period}px" d="{" ".join(d)}" fill="{fill}" opacity="{op}"/>'


def room_art(key, seed=7, home=False):
    rnd = random.Random(seed)
    out = []
    if key == "sacred":
        for cx, cy, r, n, sp in ((210, 190, 170, 16, 160), (980, 600, 260, 20, 220), (720, 120, 80, 12, 120), (120, 690, 120, 12, 180), (1120, 140, 70, 10, 140), (520, 560, 110, 14, 200)):
            out.append(_mandala(cx, cy, r, n, sp))
    elif key == "nature":
        out.append('<circle class="pulse" cx="930" cy="170" r="110" fill="var(--m3)" opacity=".55"/>')
        out.append('<circle cx="930" cy="170" r="160" fill="none" stroke="var(--m3)" stroke-width="1.5" opacity=".4"/>')
        for i in range(6):
            a = -70 + i * 22
            out.append(f'<path class="sway" d="M170 420 C 230 340, 330 300, 430 300 C 330 330, 250 370, 170 420 Z" fill="var(--m{i % 2 + 2})" opacity=".55" transform="rotate({a} 170 420)"/>')
        out.append('<path d="M170 420 C 150 560, 140 680, 150 820" stroke="var(--m4)" stroke-width="10" fill="none" opacity=".55"/>')
        for i, (y, amp, per, op, dur) in enumerate(((470, 34, 300, .35, 26), (540, 28, 400, .45, 34), (610, 40, 300, .5, 22), (690, 26, 600, .6, 40), (760, 30, 400, .7, 30))):
            out.append(_wave(y, amp, per, f"var(--m{i % 4 + 1})", op, dur))
        for i in range(9):
            y = 500 + i * 34
            x = rnd.randint(-100, 900)
            out.append(f'<path class="drift" style="--drift:{18 + i * 3}s;--dx:-300px" d="M{x} {y} q 40 -10 80 0 t 80 0 t 80 0" stroke="#fff" stroke-width="2" fill="none" opacity=".45"/>')
    elif key == "world":
        x = -20
        while x < 1220:
            w = rnd.randint(70, 150)
            h = rnd.randint(220, 560)
            c = f"var(--m{rnd.randint(1, 4)})"
            out.append(f'<g class="rise" style="--d:{rnd.randint(0, 8) / 10}s"><rect x="{x}" y="{800 - h}" width="{w}" height="{h}" fill="{c}" opacity=".55"/>')
            if rnd.random() < .45:
                for k in range(rnd.randint(2, 4)):
                    out.append(f'<circle cx="{x + w / 2:.0f}" cy="{800 - h + 40 + k * 70}" r="{min(w, 70) / 4:.0f}" fill="var(--m{rnd.randint(1, 4)})" opacity=".9"/>')
            else:
                for wy in range(800 - h + 26, 790, 46):
                    for wx in range(x + 12, x + w - 22, 30):
                        if rnd.random() < .7:
                            out.append(f'<rect x="{wx}" y="{wy}" width="16" height="24" fill="#fff" opacity="{rnd.choice((.25, .4, .6))}"/>')
            out.append('</g>')
            x += w + rnd.randint(6, 30)
        for cx, cy, r in ((260, 150, 70), (860, 110, 46), (1080, 260, 90)):
            out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="var(--m2)" stroke-width="10" opacity=".45"/><circle cx="{cx}" cy="{cy}" r="{r * .55:.0f}" fill="var(--m3)" opacity=".5"/>')
    elif key == "witness":
        for i in range(70):
            out.append(f'<circle cx="{rnd.randint(0, 1200)}" cy="{rnd.randint(0, 800)}" r="{rnd.choice((1, 1.5, 2, 3))}" fill="#fff" opacity="{rnd.choice((.3, .5, .8))}"/>')
        for i, (rx, ry, rot, sp) in enumerate(((520, 160, -18, 240), (380, 120, -18, 180), (640, 220, -18, 300))):
            out.append(f'<g class="spin" style="--spin:{sp}s"><ellipse cx="600" cy="420" rx="{rx}" ry="{ry}" fill="none" stroke="var(--m{i + 2})" stroke-width="2" opacity=".6" transform="rotate({rot} 600 420)"/>'
                       f'<circle cx="{600 + rx * .94:.0f}" cy="{420 - ry * .3:.0f}" r="{10 + i * 6}" fill="var(--m{i + 1})" transform="rotate({rot} 600 420)"/></g>')
        out.append('<circle cx="600" cy="420" r="150" fill="var(--m1)" opacity=".75"/><circle cx="560" cy="380" r="150" fill="var(--m3)" opacity=".35"/>')
        out.append('<path d="M1220 -20 L 760 330" stroke="var(--m4)" stroke-width="5" opacity=".8" stroke-linecap="round"/><path d="M1220 10 L 790 340" stroke="#fff" stroke-width="1.5" opacity=".6"/>')
    elif key == "love":
        out.append('<circle class="breathe" cx="520" cy="400" r="210" fill="var(--m2)" opacity=".35"/><circle class="breathe b2" cx="700" cy="400" r="210" fill="var(--m3)" opacity=".35"/>')
        for i in range(7):
            y0 = 120 + i * 90
            out.append(f'<path class="draw" style="--d:{i * .6}s" d="M-40 {y0} C 260 {y0 - 160 + rnd.randint(-40, 40)}, 420 {y0 + 200}, 640 {y0 + rnd.randint(-60, 60)} S 1040 {y0 - 180}, 1260 {y0 + rnd.randint(-40, 80)}" '
                       f'stroke="var(--m{1 if i % 2 else 4})" stroke-width="{1.2 + (i % 3) * .6}" fill="none" stroke-linecap="round" opacity=".75"/>')
        out.append('<path class="draw" style="--d:1s" d="M470 330 C 470 270, 560 260, 600 320 C 640 260, 730 270, 730 330 C 730 420, 620 470, 600 520 C 580 470, 470 420, 470 330 Z" fill="none" stroke="var(--m1)" stroke-width="2" opacity=".8"/>')
    cls = "room-art" + (" home-art" if home else "")
    return f'<svg class="{cls} art-{key}" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">{"".join(out)}</svg>'


def mini_art(key):
    """Small square motif for doors and windows."""
    return room_art(key, seed=3).replace('viewBox="0 0 1200 800"', 'viewBox="300 0 800 800"').replace('class="room-art', 'class="mini-art room-art')


def placeholder(kind):
    if kind == "mandala":
        return _mandala(100, 100, 90, 12, 200).replace('class="spin"', 'class=""')
    if kind == "love":
        return ('<path d="M24 150 C 46 92, 82 62, 100 98 C 118 62, 154 92, 176 150" stroke="var(--m1)" stroke-width="2" fill="none"/>'
                '<path d="M60 150 C 74 120, 90 112, 100 124 C 110 112, 126 120, 140 150" stroke="var(--m4)" stroke-width="2" fill="none"/>')
    return '<path d="M100 22 V 178" stroke="var(--m1)" stroke-width="2"/><circle cx="100" cy="100" r="54" fill="none" stroke="var(--m2)" stroke-width="2"/>'


def motif(kind):
    if kind == "mandala":
        rings = "".join(f'<circle cx="100" cy="100" r="{r}"/>' for r in (14, 30, 52, 86))
        petals = "".join(f'<ellipse cx="100" cy="62" rx="11" ry="36" transform="rotate({i * 30} 100 100)"/>' for i in range(12))
        dots = "".join(f'<circle cx="100" cy="10" r="3" transform="rotate({i * 15} 100 100)"/>' for i in range(24))
        body = rings + petals + dots
    elif kind == "love":
        body = ('<path d="M24 150 C 46 92, 82 62, 100 98 C 118 62, 154 92, 176 150"/>'
                '<path d="M60 150 C 74 120, 90 112, 100 124 C 110 112, 126 120, 140 150" opacity=".55"/>')
    else:
        body = '<path d="M100 22 V 178"/><circle cx="100" cy="100" r="54" opacity=".5"/>'
    return f'<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="0.9" aria-hidden="true">{body}</svg>'


def plate_svg(kind):
    return f'<svg viewBox="0 0 200 200" aria-hidden="true">{placeholder(kind)}</svg>'


def motif_vars(cols, floor=None):
    cs = [lift(c, floor) if floor else c for c in (cols * 2)[:4]]
    return ";".join(f"--m{i + 1}:{c}" for i, c in enumerate(cs))


# ── SITE: shared markup bound to one variation's file names ────────────────


class Site:
    def __init__(self, prefix, fonts_href, label):
        self.prefix, self.fonts_href, self.label = prefix, fonts_href, label
        self.home = f"{prefix}.html"
        self.about = f"{prefix}-about.html"
        self.collect = f"{prefix}-collect.html"

    def room_file(self, key):
        return f"{self.prefix}-room-{key}.html"

    def nav(self, current):
        items = ""
        for r in ROOMS:
            cur = ' aria-current="page"' if current == r["key"] else ""
            dots = "".join(f'<i style="background:{c}"></i>' for c in r["swatches"][:4])
            items += (f'<li><a href="{self.room_file(r["key"])}"{cur}><span class="rm-num">{r["num"]}</span>'
                      f'<span class="rm-name">{E(r["name"])}</span><span class="rm-sw" aria-hidden="true">{dots}</span></a></li>')
        cur = lambda k: ' aria-current="page"' if current == k else ""
        return f'''<a class="skip" href="#main">Skip to content</a>
<header class="nav" id="nav">
  <a class="wordmark" href="{self.home}"{cur("home")}><span class="wm-by">Art by</span> Ayesha Johar <span class="wm-ar" lang="ar">{ARABIC}</span></a>
  <nav aria-label="Main">
    <button type="button" class="rooms-btn menu-toggle" id="rooms-btn" aria-expanded="false" aria-controls="rooms-menu">Rooms <span aria-hidden="true">+</span></button>
    <a href="{self.about}"{cur("about")}>Who I am</a>
    <a class="nav-collect" href="{self.collect}"{cur("collect")}>Collect</a>
  </nav>
  <div class="rooms-menu" id="rooms-menu" hidden>
    <p class="rm-head">Five rooms, five bodies of work</p>
    <ul>{items}</ul>
  </div>
</header>'''

    def all_rooms(self, current=None, label="All five rooms"):
        lis = ""
        for x in ROOMS:
            cur = ' aria-current="page"' if current == x["key"] else ""
            dots = "".join(f'<i style="background:{c}"></i>' for c in x["swatches"][:4])
            lis += f'<li><a href="{self.room_file(x["key"])}"{cur}><span class="rm-num">{x["num"]}</span><span class="rm-name">{E(x["name"])}</span><span class="rm-sw" aria-hidden="true">{dots}</span></a></li>'
        return f'<nav class="all-rooms" aria-label="All rooms"><p class="kicker">{E(label)}</p><ul>{lis}</ul></nav>'

    def footer(self):
        rooms = "".join(f'<li><a href="{self.room_file(r["key"])}">{E(r["name"])}</a></li>' for r in ROOMS)
        return f'''<footer class="foot">
  {marquee(f'<span lang="ar">{ARABIC}</span><b>Beauty is a form of resistance</b>', "mq-foot")}
  <div class="foot-grid">
    <div><p class="foot-name">Art by Ayesha Johar</p><p class="foot-soft">Acrylic paintings. London and Mauritius.</p></div>
    <nav aria-label="Rooms"><p class="foot-h">Rooms</p><ul>{rooms}</ul></nav>
    <nav aria-label="More"><p class="foot-h">More</p><ul><li><a href="{self.about}">Who I am</a></li><li><a href="{self.collect}">Collect</a></li><li><a href="#" data-todo="instagram">Instagram</a></li><li><a href="#" data-todo="etsy">Etsy</a></li></ul></nav>
  </div>
  <p class="foot-copy">&copy; 2026 Ayesha Johar</p>
</footer>'''

    def page(self, fname, title, desc, body_attr, current, main, css, js="", overlay=True):
        pp = PAINTING_PAGE.replace('id="pp-ask" href="#"', f'id="pp-ask" href="{self.collect}#enquire" data-base="{self.collect}"') if overlay else ""
        data = f'<script type="application/json" id="paintings">{data_json()}</script>' if overlay else ""
        return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<!-- {E(self.label)} ({fname}). Generated by a build script from site_kit.py. Do not edit by hand. -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="{self.fonts_href}" rel="stylesheet">
<style>{BASE_CSS}{css}</style>
</head>
<body {body_attr}>
{self.nav(current)}
<main id="main">
{main}
</main>
{self.footer()}
{pp}
{data}
<script>{BASE_JS}</script>
<script>{js}</script>
</body>
</html>
'''

    def about_main(self, hero_cls=""):
        tags = "".join(f"<li>{t}</li>" for t in TAGS)
        paras = "".join(f"<p>{E(p)}</p>" for p in ABOUT_PARAS)
        names = "".join(f"<p>{E(p)}</p>" for p in NAME_PARAS)
        return f'''<section class="ab-hero {hero_cls}" aria-labelledby="a-title" data-stage-section="about-intro">
  <div class="ab-copy">
    <p class="kicker">Who I am</p>
    <h1 id="a-title">I put colours together the way <em>I put myself together.</em></h1>
    {paras}
    <ul class="tags" aria-label="About Ayesha">{tags}</ul>
  </div>
  <figure class="portrait rv" role="img" aria-label="Photograph of Ayesha to come"><span>A photograph of Ayesha, ideally at work, to come</span></figure>
</section>
<section class="ab-name" aria-labelledby="n-title" data-stage-section="the-name">
  <p class="big-ar rv" lang="ar" aria-hidden="true">{ARABIC}</p>
  <div class="rv">
    <p class="kicker" id="n-title">The name</p>
    <p class="lead">Johar means jewel, courage and ultimate sacrifice.</p>
    {names}
    <p class="sign">Ayesha Johar</p>
  </div>
</section>
<section class="ab-beauty" aria-label="On beauty" data-stage-section="on-beauty">
  <blockquote class="rv"><p>{E(BEAUTY)}</p><cite>Ayesha Johar</cite></blockquote>
</section>
{self.all_rooms(label="Walk through the rooms")}'''

    def collect_main(self):
        def cards(status):
            out = ""
            for w in [W[x[0]] for x in WORKS if x[3] == status]:
                r = R[w["pillar"]]
                out += (f'<article class="card rv"><button type="button" data-painting="{w["slug"]}" aria-label="Look closer at {E(w["title"])}">'
                        f'<img src="assets/art/{w["slug"]}-sm.webp" alt="{E(w["alt"])}" width="{w["w"]}" height="{w["h"]}" loading="lazy"></button>'
                        f'<div class="card-body"><h3>{E(w["title"])}</h3><p><a href="{self.room_file(r["key"])}">Room {r["num"]} · {E(r["name"])}</a></p>{status_chip(w)}</div></article>')
            return out
        return f'''<section class="co-hero" aria-labelledby="c-title" data-stage-section="collect-intro">
  <p class="kicker">Collect · Commission · Follow</p>
  <h1 id="c-title">Bring the work into your life.</h1>
  <p>If a painting has stayed with you, here is how to take it further: an original, a print, or something made for you.</p>
</section>
<section class="co-sec" aria-labelledby="o-title" data-stage-section="originals">
  <h2 id="o-title">Original paintings</h2>
  <p>Acrylic originals, directly from Ayesha. Open any painting to look closer, then ask about it.</p>
  <div class="cards">{cards("available")}</div>
</section>
<section class="co-sec" aria-labelledby="p-title" data-stage-section="prints">
  <h2 id="p-title">Prints</h2>
  <p>Prints of these paintings are sold through Ayesha's Etsy shop, so the colour can live on your wall too.</p>
  <div class="cards">{cards("prints")}</div>
</section>
<section class="co-sec" aria-labelledby="f-title" data-stage-section="enquire">
  <h2 id="f-title">Commissions and questions</h2>
  <p>A painting made for you starts with a conversation about what you are looking for, and why.</p>
  <div class="forms">
    <form class="form" id="enquire" novalidate aria-labelledby="enq-title">
      <h3 id="enq-title">Write to Ayesha</h3>
      <div class="field"><label for="enq-name">Your name</label><input id="enq-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="enq-email">Email address</label><input id="enq-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="enq-msg">Your message</label><textarea id="enq-msg" name="message" rows="5" required></textarea></div>
      <button class="btn" type="submit">Send to Ayesha</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
    <div class="side">
      <form class="form" id="signup" novalidate aria-labelledby="sign-title">
        <h3 id="sign-title">Hear about new work first</h3>
        <p>A short note when new paintings are ready. Nothing else.</p>
        <div class="field"><label for="sign-email">Email address</label><input id="sign-email" name="email" type="email" autocomplete="email" required></div>
        <button class="btn" type="submit">Keep me posted</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
      <div class="follow"><h3>Follow</h3><ul><li><a href="#" data-todo="instagram">Instagram</a></li><li><a href="#" data-todo="etsy">Etsy</a></li></ul></div>
    </div>
  </div>
</section>'''


def marquee(text, cls="", reverse=False):
    item = f'<span class="mq-item">{text}</span>'
    return f'<div class="mq {cls}{" rev" if reverse else ""}" aria-hidden="true"><div class="mq-track">{item * 4}{item * 4}</div></div>'


def status_chip(w):
    return f'<span class="chip s-{w["status"]}">{STATUS[w["status"]]}</span>'


def swatches(cols, label):
    return f'<div class="sw" role="img" aria-label="{E(label)}">' + "".join(f'<i style="background:{c}"></i>' for c in cols) + "</div>"


def data_json():
    out = []
    for w in WORKS:
        x = W[w[0]]
        r = R[x["pillar"]]
        scale = 2000 / max(x["w"], x["h"])
        pal = PALETTE[x["slug"]]
        out.append(dict(slug=x["slug"], title=x["title"], room=f'Room {r["num"]} · {r["name"]}', status=STATUS[x["status"]], key=x["status"],
                        alt=x["alt"], full=f"assets/art/{x['slug']}.webp", sm=f"assets/art/{x['slug']}-sm.webp",
                        w=round(x["w"] * scale), h=round(x["h"] * scale), colours=pal["colours"],
                        base=mix(pal["colours"][0], CREAM, 0.86), price=PRICE[x["status"]]))
    return json.dumps(out, ensure_ascii=False)


def art_img(w, cls="art", lazy=True, cap="80vh"):
    """A painting sized from its proportions before it loads (needs a container-type parent)."""
    return (f'<img class="{cls}" src="assets/art/{w["slug"]}.webp" alt="{E(w["alt"])}" width="{w["w"]}" height="{w["h"]}" '
            f'style="aspect-ratio:{w["w"]}/{w["h"]};height:min({cap},calc(100cqw * {w["h"]} / {w["w"]}))"{" loading=\"lazy\"" if lazy else ""}>')


PAINTING_PAGE = '''<div class="pp" id="pp" role="dialog" aria-modal="true" aria-labelledby="pp-title" hidden>
  <div class="pp-bleed" id="pp-bleed" aria-hidden="true"></div>
  <div class="pp-bar">
    <button type="button" class="pp-btn" id="pp-close">Back to the room</button>
    <span class="pp-count" id="pp-count"></span>
    <span class="pp-nav">
      <button type="button" class="pp-btn" id="pp-prev" aria-label="Previous painting">Previous</button>
      <button type="button" class="pp-btn" id="pp-next" aria-label="Next painting">Next</button>
    </span>
  </div>
  <div class="pp-body">
    <figure class="pp-fig" id="pp-fig"></figure>
    <div class="pp-info">
      <p class="pp-room" id="pp-room"></p>
      <h2 class="pp-title" id="pp-title"></h2>
      <p class="pp-working">Working title</p>
      <p class="pp-status" id="pp-status"></p>
      <div class="pp-sw" id="pp-sw" role="img" aria-label="Colours in this painting"></div>
      <dl class="pp-facts">
        <div><dt>Medium</dt><dd>Acrylic</dd></div>
        <div><dt>Size</dt><dd>To come</dd></div>
        <div><dt>Price</dt><dd id="pp-price"></dd></div>
      </dl>
      <p class="pp-story">Ayesha's words about this painting will go here.</p>
      <div class="pp-actions">
        <a class="pp-cta" id="pp-ask" href="#">Ask about this painting</a>
        <a class="pp-line" id="pp-etsy" href="#" data-todo="etsy">Buy a print on Etsy</a>
        <button type="button" class="pp-line" id="pp-zoom" aria-pressed="false">Look closer</button>
        <button type="button" class="pp-text" id="pp-share">Share</button>
      </div>
      <p class="pp-note" id="pp-note" role="status" aria-live="polite"></p>
    </div>
  </div>
</div>'''

# Tokens every variation sets on <body>: --bg --ink --soft --panel --on-panel --accent --on-accent
# --display --body --arabic, plus --m1..--m4 for the background art.
BASE_CSS = '''
@view-transition{navigation:auto}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
[hidden]{display:none !important}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
html.rm{scroll-behavior:auto}
body{font-family:var(--body);font-size:17px;line-height:1.65;background:var(--bg);color:var(--ink);overflow-x:hidden;-webkit-font-smoothing:antialiased;
  --gutter:clamp(16px,4vw,64px);--ease:cubic-bezier(.16,1,.3,1);--radius:16px}
body.pp-open{overflow:hidden}
img{display:block;max-width:100%;height:auto}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
a{color:inherit}
:focus-visible{outline:3px solid currentColor;outline-offset:3px}
.skip{position:absolute;left:-999px;top:8px;z-index:400;background:var(--ink);color:var(--bg);padding:10px 16px}
.skip:focus{left:8px}
.kicker{font-size:.78rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase}
.rv{opacity:0;transform:translateY(28px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease)}
.rv.in{opacity:1;transform:none}

/* background art */
.room-art{position:absolute;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none}
.room-art .spin{transform-box:fill-box;transform-origin:center;animation:spin var(--spin,160s) linear infinite}
.room-art .drift{animation:drift var(--drift,30s) linear infinite}
.room-art .sway{transform-box:view-box;animation:sway 9s ease-in-out infinite alternate}
.room-art .pulse{transform-box:fill-box;transform-origin:center;animation:pulse 8s ease-in-out infinite alternate}
.room-art .breathe{transform-box:fill-box;transform-origin:center;animation:pulse 10s ease-in-out infinite alternate}
.room-art .b2{animation-delay:-5s}
.room-art .rise{animation:rise 1.6s var(--ease) both;animation-delay:var(--d,0s)}
.room-art .draw{stroke-dasharray:2400;stroke-dashoffset:2400;animation:draw 9s ease forwards;animation-delay:var(--d,0s)}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes drift{to{transform:translateX(var(--dx,-300px))}}
@keyframes sway{to{transform:rotate(3deg)}}
@keyframes pulse{to{transform:scale(1.08)}}
@keyframes rise{from{transform:translateY(80px);opacity:0}}
@keyframes draw{to{stroke-dashoffset:0}}

/* marquee */
.mq{overflow:hidden;white-space:nowrap;pointer-events:none;user-select:none}
.mq-track{display:inline-flex;animation:mq 90s linear infinite}
.mq.rev .mq-track{animation-direction:reverse}
.mq-item{display:inline-flex;align-items:center;gap:.4em;padding-right:.4em}
@keyframes mq{to{transform:translateX(-50%)}}
html.rm .rv{opacity:1;transform:none;transition:none}
html.rm .room-art *,html.rm .mq-track{animation:none !important}
html.rm .room-art .draw{stroke-dashoffset:0}

/* nav */
.nav{position:fixed;inset:0 0 auto;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px var(--gutter);transition:background .4s ease,box-shadow .4s ease}
.nav.scrolled,.nav.menu-open{background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 1px 0 color-mix(in srgb,var(--ink) 14%,transparent)}
.wordmark{font-family:var(--display);font-size:1.2rem;text-decoration:none;display:inline-flex;align-items:center;gap:8px;min-height:44px;white-space:nowrap}
.wm-by{font-family:var(--body);font-weight:600;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase}
.wm-ar{font-family:var(--arabic);font-size:1.3rem}
.nav nav{display:flex;align-items:center;gap:clamp(6px,2vw,22px)}
.nav nav a,.rooms-btn{text-decoration:none;font-weight:600;font-size:.95rem;min-height:44px;min-width:44px;padding:8px 12px;display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:999px}
.nav nav a:hover,.rooms-btn:hover{background:color-mix(in srgb,var(--ink) 10%,transparent)}
.nav nav a[aria-current="page"]{text-decoration:underline;text-underline-offset:6px}
.rooms-btn span{display:inline-block;transition:transform .3s ease}
.rooms-btn[aria-expanded="true"] span{transform:rotate(45deg)}
.nav .nav-collect{background:var(--accent);color:var(--on-accent);padding:8px 18px}
.nav .nav-collect:hover{background:var(--ink);color:var(--bg)}
.rooms-menu{position:absolute;top:100%;right:var(--gutter);width:min(440px,calc(100vw - 2*var(--gutter)));background:var(--panel);color:var(--on-panel);border-radius:var(--radius);box-shadow:0 30px 60px -20px rgba(0,0,0,.4);padding:16px}
.rm-head{font-size:.85rem;padding:4px 10px 10px;opacity:.85}
.rooms-menu ul,.all-rooms ul{list-style:none}
.rooms-menu a{display:grid;grid-template-columns:36px 1fr auto;align-items:center;gap:10px;padding:12px 10px;min-height:52px;border-radius:12px;text-decoration:none}
.rooms-menu a:hover,.rooms-menu a[aria-current="page"]{background:color-mix(in srgb,var(--on-panel) 9%,transparent)}
.rm-name{font-family:var(--display);font-size:1.2rem}
.rm-sw{display:flex}
.rm-sw i{width:16px;height:16px;border-radius:50%;margin-left:-4px;box-shadow:0 0 0 2px var(--panel)}
@media (max-width:640px){.wm-by,.wm-ar{display:none}.nav nav a[href*="about"]{display:none}}

/* buttons, chips, swatches */
.btn,.btn-line{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:50px;padding:12px 26px;border-radius:999px;font-weight:600;font-size:.95rem;text-decoration:none;transition:background .3s ease,color .3s ease}
.btn{background:var(--accent);color:var(--on-accent)}
.btn:hover{background:var(--ink);color:var(--bg)}
.btn-line{border:2px solid currentColor}
.btn-line:hover{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.chip{display:inline-flex;align-items:center;gap:8px;font-size:.85rem;font-weight:600;padding:6px 14px;border-radius:999px;background:#fff;color:#16110E}
.chip::before{content:"";width:8px;height:8px;border-radius:50%;background:currentColor}
.s-available::before{background:#1E7B4A}.s-prints::before{background:#B4441B}.s-sold::before{background:#8A7F76}
.sw{display:flex;gap:8px}
.sw i{display:block;width:30px;height:30px;border-radius:50%;box-shadow:0 6px 16px -6px rgba(0,0,0,.45),inset 0 0 0 2px rgba(255,255,255,.55)}

/* breadcrumbs and room strip */
.crumbs{display:flex;flex-wrap:wrap;align-items:center;gap:8px;font-size:.9rem;margin-bottom:10px}
.crumbs a{text-decoration:none;min-height:44px;min-width:44px;display:inline-flex;align-items:center}
.crumbs a:hover{text-decoration:underline}
.all-rooms{padding:32px var(--gutter) clamp(56px,8vw,100px)}
.all-rooms ul{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:14px}
.all-rooms a{display:flex;flex-direction:column;gap:10px;padding:16px;border-radius:14px;text-decoration:none;background:var(--panel);color:var(--on-panel);min-height:100px}
.all-rooms a[aria-current="page"]{outline:2px solid currentColor;outline-offset:-2px}
@media (max-width:760px){.all-rooms ul{grid-template-columns:1fr 1fr}}

/* about */
.ab-hero{position:relative;padding:130px var(--gutter) clamp(56px,8vw,100px);display:grid;grid-template-columns:minmax(0,6fr) minmax(0,5fr);gap:clamp(32px,6vw,96px);align-items:center;isolation:isolate;overflow:hidden}
.ab-hero h1{font-family:var(--display);font-size:clamp(2.6rem,6.4vw,6rem);line-height:.95;letter-spacing:-.02em}
.ab-copy p{max-width:58ch;margin-top:18px;font-size:1.06rem}
.portrait{aspect-ratio:4/5;border-radius:var(--radius);display:grid;place-items:end start;padding:24px;color:#fff;font-weight:600;position:relative;overflow:hidden;background:linear-gradient(150deg,var(--m1),var(--m2) 50%,var(--m3))}
.portrait::before{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.5),transparent 60%)}
.portrait span{position:relative}
.ab-name{padding:clamp(72px,10vw,140px) var(--gutter);display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:clamp(32px,6vw,96px);align-items:center}
.big-ar{font-family:var(--arabic);font-size:clamp(8rem,22vw,20rem);line-height:1.15;text-align:center}
.ab-name .lead{font-family:var(--display);font-size:clamp(1.6rem,3vw,2.4rem);line-height:1.15;margin:10px 0 18px}
.ab-name p{max-width:58ch;margin-bottom:14px}
.sign{font-family:var(--display);font-size:1.3rem}
.tags{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
.tags li{border-radius:999px;padding:6px 14px;font-size:.85rem;font-weight:600;background:var(--panel);color:var(--on-panel)}
.ab-beauty{padding:clamp(48px,8vw,120px) var(--gutter)}
.ab-beauty blockquote{max-width:960px;margin:0 auto}
.ab-beauty p{font-family:var(--display);font-size:clamp(1.4rem,2.8vw,2.3rem);line-height:1.3}
.ab-beauty cite{display:block;margin-top:18px;font-style:normal;font-weight:600}
@media (max-width:900px){.ab-hero,.ab-name{grid-template-columns:1fr}.portrait{aspect-ratio:3/2}}

/* collect */
.co-hero{padding:130px var(--gutter) 32px}
.co-hero h1{font-family:var(--display);font-size:clamp(3rem,8vw,7rem);line-height:.92;letter-spacing:-.02em}
.co-hero p{max-width:56ch;margin-top:18px;font-size:1.06rem}
.co-sec{padding:clamp(48px,7vw,96px) var(--gutter)}
.co-sec h2{font-family:var(--display);font-size:clamp(2rem,4.4vw,3.4rem);line-height:1;margin-bottom:10px}
.co-sec>p{max-width:56ch;margin-bottom:32px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px}
.card{background:var(--panel);color:var(--on-panel);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column}
.card button{display:block;overflow:hidden}
.card img{width:100%;aspect-ratio:4/5;object-fit:cover;transition:transform 1s var(--ease)}
.card button:hover img{transform:scale(1.04)}
.card-body{padding:18px 20px 22px;display:flex;flex-direction:column;gap:8px;align-items:flex-start}
.card-body h3{font-family:var(--display);font-size:1.5rem;line-height:1.1}
.card-body a{min-height:44px;display:inline-flex;align-items:center}
.forms{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(24px,4vw,56px)}
.form{background:var(--panel);color:var(--on-panel);border-radius:var(--radius);padding:clamp(22px,3vw,40px)}
.form h3,.follow h3{font-family:var(--display);font-size:1.7rem;margin-bottom:10px}
.form>p{margin-bottom:12px}
.field{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
.field label{font-size:.9rem;font-weight:600}
.field input,.field textarea{font:inherit;font-size:16px;padding:12px 14px;border:1.5px solid rgba(0,0,0,.35);background:#fff;color:#16110E;border-radius:10px}
.field [aria-invalid="true"]{border-color:#B3261E}
.form .btn{background:var(--on-panel);color:var(--panel)}
.form-status{margin-top:12px;min-height:1.5em;font-weight:600}
.side{display:flex;flex-direction:column;gap:24px}
.follow ul{list-style:none;display:flex;gap:16px}
.follow a{display:inline-flex;min-height:44px;min-width:44px;align-items:center;font-weight:600}
@media (max-width:900px){.forms{grid-template-columns:1fr}}

/* footer */
.foot{position:relative;padding:40px 0 32px;border-top:1px solid color-mix(in srgb,var(--ink) 18%,transparent)}
.mq-foot{font-family:var(--display);font-size:clamp(3rem,10vw,9rem);line-height:1.25;margin-bottom:36px}
.mq-foot .mq-item{gap:.5em;padding-right:.5em}
.mq-foot [lang="ar"]{font-family:var(--arabic)}
.foot-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:32px;padding:0 var(--gutter)}
.foot-name{font-family:var(--display);font-size:1.5rem}
.foot-h{font-weight:700;margin-bottom:6px}
.foot ul{list-style:none}
.foot ul a{display:inline-flex;min-height:44px;min-width:44px;align-items:center;text-decoration:none}
.foot ul a:hover{text-decoration:underline}
.foot-soft,.foot-copy{font-size:.9rem}
.foot-copy{padding:24px var(--gutter) 0}
@media (max-width:760px){.foot-grid{grid-template-columns:1fr 1fr}.foot-grid>div:first-child{grid-column:1/-1}}

/* painting page: always light and quiet so the painting leads */
.pp{position:fixed;inset:0;z-index:200;background:var(--ppbase,#F4EFE8);color:#16110E;display:grid;grid-template-rows:auto 1fr;opacity:0;transition:opacity .45s ease;isolation:isolate;font-family:var(--body)}
.pp.on{opacity:1}
.pp:not(.on){pointer-events:none}
.pp-bleed{position:absolute;inset:0;z-index:-1;overflow:hidden}
.pp-bleed img{width:100%;height:100%;object-fit:cover;filter:blur(70px) saturate(1.6);opacity:.45;transform:scale(1.3)}
.pp-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px var(--gutter)}
.pp-btn{min-height:44px;padding:8px 16px;font-weight:600;font-size:.9rem;border-radius:999px;background:rgba(255,255,255,.6)}
.pp-btn:hover{background:#fff}
.pp-nav{display:flex;gap:8px}
.pp-count{font-size:.85rem;font-weight:600}
.pp-body{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(300px,1fr);min-height:0;overflow:auto}
.pp-fig{display:grid;place-items:center;padding:clamp(16px,3vw,48px);overflow:hidden;min-height:0;cursor:zoom-in;touch-action:pan-y}
.pp-fig img{max-height:calc(100dvh - 140px);width:auto;max-width:100%;object-fit:contain;border-radius:3px;box-shadow:0 50px 90px -40px rgba(0,0,0,.6);transition:transform .5s var(--ease)}
.pp-fig.zoomed{cursor:zoom-out;touch-action:none}
.pp-fig.zoomed img{transform:scale(2.4)}
.pp-info{padding:clamp(24px,4vw,56px) var(--gutter) 48px clamp(16px,2vw,32px);display:flex;flex-direction:column;gap:14px;align-self:center}
.pp-room{font-weight:700;font-size:.8rem;letter-spacing:.14em;text-transform:uppercase}
.pp-title{font-family:var(--display);font-size:clamp(2.4rem,4.6vw,4rem);line-height:.95}
.pp-working{font-size:.8rem;margin-top:-6px}
.pp-status{font-weight:700}
.pp-sw{display:flex;gap:8px}
.pp-sw i{display:block;width:28px;height:28px;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(255,255,255,.6)}
.pp-facts{display:grid;gap:8px;border-top:1px solid rgba(0,0,0,.15);border-bottom:1px solid rgba(0,0,0,.15);padding:14px 0}
.pp-facts div{display:flex;justify-content:space-between;gap:16px}
.pp-story{font-style:italic}
.pp-actions{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.pp-cta,.pp-line,.pp-text{display:inline-flex;align-items:center;min-height:48px;padding:12px 22px;border-radius:999px;font-weight:600;text-decoration:none}
.pp-cta{background:#16110E;color:#fff}
.pp-line{border:2px solid #16110E}
.pp-text{text-decoration:underline;padding:12px 4px}
.pp-note{font-size:.9rem;min-height:1.4em}
@media (max-width:880px){.pp-body{grid-template-columns:1fr;grid-auto-rows:max-content}.pp-fig{min-height:auto;padding:12px var(--gutter)}.pp-fig img{max-height:60dvh}.pp-info{align-self:start;padding:8px var(--gutter) 48px}}
@media (max-width:560px){.pp-count{display:none}.pp-btn{padding:8px 12px}}
html.rm .pp,html.rm .pp-fig img{transition:none}
'''

BASE_JS = r'''
(() => {
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.toggle('rm', RM);
window.AJ = { RM };
const $ = id => document.getElementById(id);
const body = document.body;

const nav = $('nav'), btn = $('rooms-btn'), menu = $('rooms-menu');
const onNav = () => nav.classList.toggle('scrolled', scrollY > 30);
addEventListener('scroll', onNav, { passive: true }); onNav();
function setMenu(open) { menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); nav.classList.toggle('menu-open', open); if (open) menu.querySelector('a').focus(); }
btn.addEventListener('click', () => setMenu(menu.hidden));
document.addEventListener('click', e => { if (!menu.hidden && !nav.contains(e.target)) setMenu(false); });
nav.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); btn.focus(); } });

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.rv').forEach(el => RM ? el.classList.add('in') : io.observe(el));

const pp = $('pp');
if (pp) {
  const ALL = JSON.parse($('paintings').textContent);
  const order = [...new Set([...document.querySelectorAll('[data-painting]')].map(b => b.dataset.painting))];
  const DATA = order.map(s => ALL.find(p => p.slug === s));
  const fig = $('pp-fig'), img = document.createElement('img'), bleed = document.createElement('img');
  img.alt = ''; bleed.alt = '';
  let cur = -1, pushed = false, lastFocus = null, zoomed = false;
  const pageTitle = document.title;
  function setZoom(on, e) { zoomed = on; fig.classList.toggle('zoomed', on); $('pp-zoom').setAttribute('aria-pressed', on); $('pp-zoom').textContent = on ? 'Step back' : 'Look closer'; if (on && e) origin(e); if (!on) img.style.transformOrigin = '50% 50%'; }
  function origin(e) { const r = img.getBoundingClientRect(); img.style.transformOrigin = Math.min(100, Math.max(0, (e.clientX - r.left) / r.width * 100)) + '% ' + Math.min(100, Math.max(0, (e.clientY - r.top) / r.height * 100)) + '%'; }
  function show(slug) {
    const i = order.indexOf(slug); if (i < 0) return hide();
    const p = DATA[i]; cur = i; setZoom(false);
    pp.style.setProperty('--ppbase', p.base);
    img.src = p.full; img.alt = p.alt; img.width = p.w; img.height = p.h; if (!img.parentNode) fig.appendChild(img);
    bleed.src = p.sm; if (!bleed.parentNode) $('pp-bleed').appendChild(bleed);
    $('pp-title').textContent = p.title; $('pp-room').textContent = p.room; $('pp-status').textContent = p.status; $('pp-price').textContent = p.price;
    $('pp-sw').innerHTML = p.colours.map(c => '<i style="background:' + c + '"></i>').join('');
    $('pp-count').textContent = (i + 1) + ' of ' + DATA.length;
    $('pp-etsy').hidden = p.key !== 'prints'; $('pp-note').textContent = '';
    $('pp-ask').href = $('pp-ask').dataset.base + '?about=' + encodeURIComponent(p.title) + '#enquire';
    document.title = p.title + ' · Art by Ayesha Johar';
    if (pp.hidden) { lastFocus = document.activeElement; pp.hidden = false; body.classList.add('pp-open'); requestAnimationFrame(() => pp.classList.add('on')); $('pp-close').focus(); }
  }
  function hide() {
    if (pp.hidden) return;
    pp.classList.remove('on'); setZoom(false); body.classList.remove('pp-open'); document.title = pageTitle;
    setTimeout(() => { pp.hidden = true; }, RM ? 0 : 450);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  const route = () => { const m = location.hash.match(/^#\/painting\/([a-z0-9-]+)$/); m ? show(m[1]) : hide(); };
  const close = () => { if (pushed) { pushed = false; history.back(); } else { history.replaceState(null, '', location.pathname + location.search); hide(); } };
  const step = d => { const s = order[(cur + d + order.length) % order.length]; history.replaceState(null, '', '#/painting/' + s); show(s); };
  document.addEventListener('click', e => { const b = e.target.closest('[data-painting]'); if (!b) return; e.preventDefault(); pushed = true; location.hash = '#/painting/' + b.dataset.painting; });
  addEventListener('hashchange', route); route();
  $('pp-close').addEventListener('click', close);
  $('pp-prev').addEventListener('click', () => step(-1));
  $('pp-next').addEventListener('click', () => step(1));
  $('pp-zoom').addEventListener('click', () => setZoom(!zoomed));
  img.addEventListener('click', e => setZoom(!zoomed, e));
  fig.addEventListener('pointermove', e => { if (zoomed) origin(e); });
  $('pp-share').addEventListener('click', async () => {
    const url = location.href;
    try { if (navigator.share) { await navigator.share({ title: DATA[cur].title + ' by Ayesha Johar', url }); return; } await navigator.clipboard.writeText(url); $('pp-note').textContent = 'Link copied.'; }
    catch (_) { $('pp-note').textContent = 'Copy this link: ' + url; }
  });
  pp.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); zoomed ? setZoom(false) : close(); }
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Tab') {
      const f = [...pp.querySelectorAll('button,a')].filter(x => !x.hidden && x.offsetParent);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
}

const about = new URLSearchParams(location.search).get('about');
if (about && $('enq-msg')) $('enq-msg').value = "I'd like to ask about " + about + '.';
document.querySelectorAll('form.form').forEach(f => f.addEventListener('submit', e => {
  e.preventDefault();
  const fields = [...f.querySelectorAll('input,textarea')], bad = fields.filter(x => !x.checkValidity());
  fields.forEach(x => x.setAttribute('aria-invalid', String(!x.checkValidity())));
  const st = f.querySelector('.form-status');
  if (bad.length) { st.textContent = 'Please fill in ' + bad.map(x => f.querySelector('label[for="' + x.id + '"]').textContent.toLowerCase()).join(' and ') + '.'; bad[0].focus(); return; }
  st.textContent = f.id === 'signup' ? 'Thank you. You will hear when new work is ready.' : 'Thank you. Ayesha will be in touch.'; f.reset();
}));
document.querySelectorAll('[data-todo]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); a.title = 'Link to come'; }));
})();
'''
