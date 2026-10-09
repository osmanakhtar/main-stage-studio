#!/usr/bin/env python3
"""Build the Art by Ayesha Johar v4 prototype: a multi-page site of rooms.

    python3 build-v4.py

Pages written next to this file:
  ayesha-johar-v4.html                 home: the foyer, with a door into each room
  ayesha-johar-v4-room-<key>.html      one page per body of work (five rooms)
  ayesha-johar-v4-about.html           Who I am
  ayesha-johar-v4-collect.html         Collect: originals, prints, commissions, enquiry

Direction (Osman, 9 Oct 2026): true to what Ayesha said, not to any house style.
Colourful, elegant, sophisticated, approachable; calm, original, relatable;
"I put colours together boldly". Every colour in the layout is sampled from her
paintings at build time (Pillow), so each room, and each painting as you reach
it, tints the page. Fonts: Syne + Manrope (ui-ux-pro-max "Fashion Forward",
for art galleries), Aref Ruqaa for the Arabic.

Static HTML so Stage can tag it; every image is an <img src="assets/art/...">
so the Stage publish rewrite reaches it (no CSS url()).
"""
import colorsys
import html
import json
import os
from urllib.parse import quote

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ART = os.path.join(HERE, "assets", "art")
E = html.escape

from site_kit import STATUS, WORKS, W, motif  # noqa: E402  (shared content)

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
    r, g, b = (c / 255 for c in rgb_(h))
    return colorsys.rgb_to_hls(r, g, b)


def from_hls(hh, l, s):
    return hex_([c * 255 for c in colorsys.hls_to_rgb(hh, l, s)])


def until(colour, against, ratio, step=-0.02):
    """Shift lightness until `colour` reaches `ratio` contrast against `against`."""
    hh, l, s = hls(colour)
    while contrast(from_hls(hh, l, s), against) < ratio and 0 < l < 1:
        l += step
    return from_hls(hh, max(0, min(1, l)), s)


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
    dark = min(found, key=lambda c: c["l"])
    return dict(colours=[c["hex"] for c in chosen], dark=dark["hex"])


PALETTE = {w[0]: sample(w[0]) for w in WORKS}

CREAM = "#FBF6EE"


def theme(colours, dark):
    """Page tokens from a set of painting colours."""
    base = mix(colours[0], CREAM, 0.88)
    hh, _, s = hls(dark)
    ink = from_hls(hh, 0.12, min(s, 0.4))
    vivid = colours[0] if hls(colours[0])[2] > 0.3 else max(colours, key=lambda c: hls(c)[2])
    accent = until(until(vivid, "#FFFFFF", 4.8), base, 4.7)
    soft = until(mix(ink, base, 0.35), base, 4.8)
    return dict(base=base, ink=ink, accent=accent, soft=soft, c=(colours + colours)[:4])


# ── ROOMS ──────────────────────────────────────────────────────────────────

ROOMS = [
    dict(key="sacred", num="I", name="The Sacred", line="Work that opens rather than closes.",
         desc="Mandalas, Ganesha, geometric symmetry. Spiritual traditions held with devotion and curiosity.",
         key_art=None, todo=[("Mandalas", "mandala"), ("Ganesha", "mandala")],
         borrowed=["skyline", "tower", "dancing-trees", "water"],
         note="The mandalas and the Ganesha are being photographed. Until then this room borrows its colours from across the collection."),
    dict(key="nature", num="II", name="Nature", line="The world before the damage.",
         desc="Water, shorelines, palm trees and skies. Open, generous and full of light.",
         key_art="water", todo=[], borrowed=None, note=""),
    dict(key="world", num="III", name="World", line="The places that shaped me.",
         desc="Amsterdam, Mauritius, London. Buildings and cities, painted as feeling rather than record.",
         key_art="tower", todo=[], borrowed=None, note=""),
    dict(key="witness", num="IV", name="Witness", line="Work that refuses to look away.",
         desc="George Floyd. The Earth with a bullet through it. The beauty is in the painting, not in what it shows. That is the resistance.",
         key_art="earth", todo=[("George Floyd", "line")], borrowed=None,
         note="The George Floyd portrait is being photographed and will hang here."),
    dict(key="love", num="V", name="Love", line="The quietest room.",
         desc="A pencil drawing of my wife. The most private work, given the most space.",
         key_art=None, todo=[("Pencil drawing", "love")],
         borrowed=["dancing-trees-ii", "woodland", "dancing-trees"],
         note="The drawing is being photographed. Until then this room borrows the softest colours from the collection."),
]
for r in ROOMS:
    r["works"] = [W[w[0]] for w in WORKS if w[2] == r["key"]]
    src = [w["slug"] for w in r["works"]] or r["borrowed"]
    cols, darks = [], []
    for s in src:
        cols += PALETTE[s]["colours"][:3]
        darks.append(PALETTE[s]["dark"])
    pick = []
    for c in cols:
        if all(min(abs(hls(c)[0] - hls(d)[0]), 1 - abs(hls(c)[0] - hls(d)[0])) > 0.05 for d in pick):
            pick.append(c)
    pick = (pick + cols)[:4]
    r["theme"] = theme(pick, min(darks, key=lambda d: hls(d)[1]))
    r["swatches"] = list(dict.fromkeys(pick + cols))[:6]
    r["file"] = f"ayesha-johar-v4-room-{r['key']}.html"
R = {r["key"]: r for r in ROOMS}

ALL = []
for s in ("dancing-trees", "water", "skyline", "stripes", "tower", "breeze"):
    ALL.append(PALETTE[s]["colours"][0])
HOME = theme(ALL, PALETTE["earth"]["dark"])
ABOUT_T = theme([PALETTE["woodland"]["colours"][0], PALETTE["dancing-trees"]["colours"][0], PALETTE["skyline"]["colours"][0], PALETTE["water"]["colours"][0]], PALETTE["dancing-trees"]["dark"])
COLLECT_T = theme([PALETTE["stripes"]["colours"][0], PALETTE["dancing-trees"]["colours"][0], PALETTE["water"]["colours"][0], PALETTE["tower"]["colours"][0]], PALETTE["block"]["dark"])

HOME_F, ABOUT_F, COLLECT_F = "ayesha-johar-v4.html", "ayesha-johar-v4-about.html", "ayesha-johar-v4-collect.html"

# ── SHARED PIECES ──────────────────────────────────────────────────────────

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Manrope:wght@300;400;500;600&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet">')

ARABIC = "جوهر"


def lift(h, floor=0.56):
    """Same hue, lifted so a colour field behind text stays light enough to read on."""
    hh, l, s = hls(h)
    return from_hls(hh, max(l, floor), s)


def style_vars(t):
    c = [lift(x) for x in t["c"]]
    return (f"--base:{t['base']};--ink:{t['ink']};--accent:{t['accent']};--soft:{t['soft']};"
            f"--c1:{c[0]};--c2:{c[1]};--c3:{c[2]};--c4:{c[3]};"
            f"--a1:{c[0]};--a2:{c[1]};--a3:{c[2]};--a4:{c[3]}")


def lines_svg():
    """Flowing lines after the tree forms in Dancing Trees: hidden shapes in the background."""
    paths = []
    for i in range(7):
        x = 60 + i * 140
        paths.append(f'<path d="M{x} 1000 C {x - 120} 760, {x + 160} 620, {x + 20} 430 S {x - 90} 140, {x + 70} -20"/>')
    return f'<svg class="lines" viewBox="0 0 1000 1000" preserveAspectRatio="none" fill="none" aria-hidden="true">{"".join(paths)}</svg>'


def marquee(text, cls="", reverse=False):
    item = f'<span class="mq-item">{text}</span>'
    return (f'<div class="mq {cls}{" rev" if reverse else ""}" aria-hidden="true"><div class="mq-track">'
            f'{item * 4}{item * 4}</div></div>')


def nav(current):
    items = ""
    for r in ROOMS:
        cur = ' aria-current="page"' if current == r["key"] else ""
        items += (f'<li><a href="{r["file"]}"{cur}><span class="rm-num">{r["num"]}</span>'
                  f'<span class="rm-name">{E(r["name"])}</span>'
                  f'<span class="rm-sw" aria-hidden="true">{"".join(f"<i style=\"background:{c}\"></i>" for c in r["swatches"][:4])}</span></a></li>')
    cur = lambda k: ' aria-current="page"' if current == k else ""
    return f'''<a class="skip" href="#main">Skip to content</a>
<header class="nav" id="nav">
  <a class="wordmark" href="{HOME_F}"{cur("home")}><span class="wm-by">Art by</span> Ayesha Johar <span class="wm-ar" lang="ar">{ARABIC}</span></a>
  <nav aria-label="Main">
    <button type="button" class="rooms-btn menu-toggle" id="rooms-btn" aria-expanded="false" aria-controls="rooms-menu">Rooms <span aria-hidden="true">+</span></button>
    <a href="{ABOUT_F}"{cur("about")}>Who I am</a>
    <a class="nav-collect" href="{COLLECT_F}"{cur("collect")}>Collect</a>
  </nav>
  <div class="rooms-menu" id="rooms-menu" hidden>
    <p class="rm-head">Five rooms, five bodies of work</p>
    <ul>{items}</ul>
  </div>
</header>'''


def footer():
    rooms = "".join(f'<li><a href="{r["file"]}">{E(r["name"])}</a></li>' for r in ROOMS)
    return f'''<footer class="foot">
  {marquee(f'<span lang="ar">{ARABIC}</span><b>Beauty is a form of resistance</b>', "mq-foot")}
  <div class="foot-grid">
    <div><p class="foot-name">Art by Ayesha Johar</p><p class="foot-soft">Acrylic paintings. London and Mauritius.</p></div>
    <nav aria-label="Rooms"><p class="foot-h">Rooms</p><ul>{rooms}</ul></nav>
    <nav aria-label="More"><p class="foot-h">More</p><ul><li><a href="{ABOUT_F}">Who I am</a></li><li><a href="{COLLECT_F}">Collect</a></li><li><a href="#" data-todo="instagram">Instagram</a></li><li><a href="#" data-todo="etsy">Etsy</a></li></ul></nav>
  </div>
  <p class="foot-copy">&copy; 2026 Ayesha Johar</p>
</footer>'''


def aura():
    return '<div class="aura" aria-hidden="true"><i></i><i></i><i></i><i></i></div>'


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
        <a class="btn" id="pp-ask" href="#">Ask about this painting</a>
        <a class="btn-line" id="pp-etsy" href="#" data-todo="etsy">Buy a print on Etsy</a>
        <button type="button" class="btn-line" id="pp-zoom" aria-pressed="false">Look closer</button>
        <button type="button" class="btn-text" id="pp-share">Share</button>
      </div>
      <p class="pp-note" id="pp-note" role="status" aria-live="polite"></p>
    </div>
  </div>
</div>'''


def data_json():
    out = []
    for w in WORKS:
        x = W[w[0]]
        r = R[x["pillar"]]
        scale = 2000 / max(x["w"], x["h"])
        pal = PALETTE[x["slug"]]
        out.append(dict(slug=x["slug"], title=x["title"], room=f'Room {r["num"]} · {r["name"]}',
                        status=STATUS[x["status"]], key=x["status"], alt=x["alt"],
                        full=f"assets/art/{x['slug']}.webp", sm=f"assets/art/{x['slug']}-sm.webp",
                        w=round(x["w"] * scale), h=round(x["h"] * scale),
                        colours=pal["colours"], base=mix(pal["colours"][0], CREAM, 0.86),
                        price={"available": "On request", "sold": "Original sold", "prints": "Prints from Etsy"}[x["status"]]))
    return json.dumps(out, ensure_ascii=False)


def status_chip(w):
    return f'<span class="chip s-{w["status"]}">{STATUS[w["status"]]}</span>'


def swatches(cols, label):
    return (f'<div class="sw" role="img" aria-label="{E(label)}">' +
            "".join(f'<i style="background:{c}"></i>' for c in cols) + "</div>")


# ── CSS ────────────────────────────────────────────────────────────────────

CSS = '''
@view-transition{navigation:auto}
::view-transition-old(root),::view-transition-new(root){animation-duration:.6s}
:root{--display:'Syne',system-ui,sans-serif;--body:'Manrope',system-ui,sans-serif;--arabic:'Aref Ruqaa','Amiri',serif;
  --gutter:clamp(16px,4vw,64px);--ease:cubic-bezier(.16,1,.3,1);--radius:18px}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
[hidden]{display:none !important}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
html.rm{scroll-behavior:auto}
body{font-family:var(--body);font-size:17px;line-height:1.65;background:var(--base);color:var(--ink);overflow-x:hidden;-webkit-font-smoothing:antialiased}
body.pp-open{overflow:hidden}
img{display:block;max-width:100%;height:auto}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
a{color:inherit}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.skip{position:absolute;left:-999px;top:8px;z-index:400;background:var(--ink);color:var(--base);padding:10px 16px}
.skip:focus{left:8px}
.kicker{font-family:var(--display);font-size:.8rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase}

/* the aura: colour from the paintings, drifting behind everything */
@property --a1{syntax:'<color>';inherits:true;initial-value:#ccc}
@property --a2{syntax:'<color>';inherits:true;initial-value:#ccc}
@property --a3{syntax:'<color>';inherits:true;initial-value:#ccc}
@property --a4{syntax:'<color>';inherits:true;initial-value:#ccc}
body{transition:--a1 2s ease,--a2 2s ease,--a3 2s ease,--a4 2s ease}
body::before{content:"";position:fixed;inset:-30vmax;z-index:-3;pointer-events:none;
  background:radial-gradient(closest-side at 22% 24%,color-mix(in srgb,var(--a1) 62%,transparent),transparent),
    radial-gradient(closest-side at 80% 34%,color-mix(in srgb,var(--a2) 58%,transparent),transparent),
    radial-gradient(closest-side at 38% 82%,color-mix(in srgb,var(--a3) 58%,transparent),transparent),
    radial-gradient(closest-side at 72% 76%,color-mix(in srgb,var(--a4) 40%,transparent),transparent);
  background-size:100% 100%;filter:blur(40px) saturate(1.15);animation:drift 40s ease-in-out infinite alternate}
@keyframes drift{0%{transform:translate(0,0) scale(1)}50%{transform:translate(6vmax,-4vmax) scale(1.08)}100%{transform:translate(-5vmax,5vmax) scale(1.04) rotate(4deg)}}
.lines{position:absolute;inset:0;width:100%;height:100%;z-index:-1;stroke:var(--ink);stroke-width:1.2;opacity:.09;pointer-events:none}
html.rm body::before,html.rm .mq-track{animation:none}

/* marquee */
.mq{overflow:hidden;white-space:nowrap;pointer-events:none;user-select:none}
.mq-track{display:inline-flex;animation:mq 90s linear infinite}
.mq.rev .mq-track{animation-direction:reverse}
.mq-item{display:inline-flex;align-items:center;gap:.4em;padding-right:.4em}
@keyframes mq{to{transform:translateX(-50%)}}

/* nav */
.nav{position:fixed;inset:0 0 auto;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px var(--gutter);transition:background .4s ease,box-shadow .4s ease}
.nav.scrolled,.nav.menu-open{background:color-mix(in srgb,var(--base) 86%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 1px 0 color-mix(in srgb,var(--ink) 12%,transparent)}
.wordmark{font-family:var(--display);font-weight:700;font-size:1.15rem;text-decoration:none;display:inline-flex;align-items:center;gap:8px;min-height:44px;white-space:nowrap}
.wm-by{font-weight:500;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--soft)}
.wm-ar{font-family:var(--arabic);font-weight:700;color:var(--accent);font-size:1.3rem}
.nav nav{display:flex;align-items:center;gap:clamp(6px,2vw,24px)}
.nav nav a,.rooms-btn{text-decoration:none;font-weight:500;font-size:.95rem;min-height:44px;min-width:44px;padding:8px 10px;display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:999px}
.nav nav a:hover,.rooms-btn:hover{background:color-mix(in srgb,var(--ink) 8%,transparent)}
.nav nav a[aria-current="page"]{text-decoration:underline;text-underline-offset:6px}
.rooms-btn[aria-expanded="true"] span{transform:rotate(45deg)}
.rooms-btn span{display:inline-block;transition:transform .3s ease}
.nav .nav-collect{background:var(--accent);color:#fff;padding:8px 18px}
.nav .nav-collect:hover{background:var(--ink)}
.rooms-menu{position:absolute;top:100%;right:var(--gutter);width:min(440px,calc(100vw - 2*var(--gutter)));background:var(--base);border-radius:var(--radius);
  box-shadow:0 30px 60px -20px rgba(0,0,0,.35);padding:18px}
.rm-head{font-size:.85rem;color:var(--soft);padding:4px 10px 10px}
.rooms-menu ul{list-style:none}
.rooms-menu a{display:grid;grid-template-columns:36px 1fr auto;align-items:center;gap:10px;padding:12px 10px;min-height:52px;border-radius:12px;text-decoration:none}
.rooms-menu a:hover,.rooms-menu a[aria-current="page"]{background:color-mix(in srgb,var(--ink) 7%,transparent)}
.rm-num{font-family:var(--display);color:var(--soft)}
.rm-name{font-family:var(--display);font-weight:600;font-size:1.15rem}
.rm-sw{display:flex}
.rm-sw i{width:16px;height:16px;border-radius:50%;margin-left:-4px;box-shadow:0 0 0 2px var(--base)}
@media (max-width:640px){.wm-by,.wm-ar{display:none}.nav nav a[href*="about"]{display:none}}

/* buttons */
.btn,.btn-line,.btn-text{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:50px;padding:12px 26px;border-radius:999px;font-weight:600;font-size:.95rem;text-decoration:none;transition:background .3s ease,color .3s ease,transform .3s var(--ease)}
.btn{background:var(--accent);color:#fff}
.btn:hover{background:var(--ink)}
.btn-line{border:1.5px solid currentColor}
.btn-line:hover{background:var(--ink);color:var(--base);border-color:var(--ink)}
.btn-text{padding:12px 4px;text-decoration:underline;text-underline-offset:5px}

/* reveal */
.rv{opacity:0;transform:translateY(28px);transition:opacity 1.1s var(--ease),transform 1.1s var(--ease)}
.rv.in{opacity:1;transform:none}
html.rm .rv{opacity:1;transform:none;transition:none}

/* chips and swatches */
.chip{display:inline-flex;align-items:center;gap:8px;font-size:.85rem;font-weight:600;padding:6px 14px;border-radius:999px;background:color-mix(in srgb,var(--base) 80%,#fff);color:var(--ink)}
.chip::before{content:"";width:8px;height:8px;border-radius:50%;background:currentColor}
.s-available::before{background:#1E7B4A}.s-prints::before{background:var(--accent)}.s-sold::before{background:#8A7F76}
.sw{display:flex;gap:8px}
.sw i{display:block;width:34px;height:34px;border-radius:50%;box-shadow:0 6px 16px -6px rgba(0,0,0,.45),inset 0 0 0 2px rgba(255,255,255,.5)}

/* ── HOME ── */
.h-hero{position:relative;min-height:100dvh;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center;gap:clamp(24px,4vw,64px);padding:110px var(--gutter) 72px;overflow:hidden;isolation:isolate}
.h-ar{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);z-index:-1;font-family:var(--arabic);font-weight:700;font-size:clamp(12rem,34vw,34rem);line-height:1;color:var(--accent);opacity:.1}
.h-ar .mq-item{padding-right:.25em}
.h-name{font-family:var(--display);font-weight:700;font-size:clamp(3rem,7.2vw,7.4rem);line-height:.9;letter-spacing:-.03em;margin:16px 0 24px}
.h-name span{display:block}
.h-name .j{background:linear-gradient(100deg,var(--c1),var(--c2) 35%,var(--c3) 70%,var(--c4));-webkit-background-clip:text;background-clip:text;color:transparent;
  background-size:200% 100%;animation:sheen 14s ease-in-out infinite alternate}
@keyframes sheen{to{background-position:100% 0}}
html.rm .h-name .j{animation:none}
.h-line{font-family:var(--display);font-weight:500;font-size:clamp(1.3rem,2.4vw,2rem);max-width:20ch;line-height:1.2}
.h-calm{max-width:44ch;margin-top:14px}
.h-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}
.h-art{position:relative;height:min(78vh,720px)}
.h-art figure{position:absolute;margin:0}
.h-art img{border-radius:6px;box-shadow:0 40px 70px -30px rgba(0,0,0,.55)}
.h-art .glow{position:absolute;inset:8%;z-index:-1;filter:blur(40px) saturate(1.6);opacity:.9;border-radius:50%}
.h-art .f1{left:4%;top:12%;width:72%;transform:rotate(-2deg)}
.h-art .f2{right:0;top:0;width:34%;transform:rotate(3deg)}
.h-art .f3{right:6%;bottom:2%;width:40%;transform:rotate(-1deg)}
.h-art a{display:block;transition:transform .8s var(--ease)}
.h-art a:hover{transform:scale(1.03) rotate(0deg)}
.h-art figure{transition:translate 1.2s var(--ease)}

.doors-wrap{padding:clamp(72px,10vw,140px) var(--gutter)}
.sec-title{font-family:var(--display);font-weight:700;font-size:clamp(2.4rem,6vw,5rem);line-height:.95;letter-spacing:-.02em;margin:12px 0 16px}
.sec-intro{max-width:56ch;margin-bottom:40px}
.doors{display:flex;gap:10px;height:min(76vh,720px)}
.door{position:relative;flex:1;min-width:0;overflow:hidden;border-radius:var(--radius);text-decoration:none;color:#fff;transition:flex .9s var(--ease);isolation:isolate;
  background:linear-gradient(160deg,var(--d1),var(--d2) 55%,var(--d3))}
.door img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;transition:transform 1.4s var(--ease)}
.door .motif{position:absolute;inset:0;display:grid;place-items:center;z-index:-2;color:rgba(255,255,255,.7)}
.door .motif svg{width:min(70%,320px)}
.door::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,rgba(10,8,8,.78),rgba(10,8,8,.15) 55%,rgba(10,8,8,.05))}
.door-closed{position:absolute;left:0;right:0;bottom:24px;display:flex;flex-direction:column;align-items:center;gap:10px;transition:opacity .4s ease}
.door-closed b{writing-mode:vertical-rl;transform:rotate(180deg);font-family:var(--display);font-weight:700;font-size:1.4rem;letter-spacing:.04em}
.door-closed small{font-family:var(--display);font-size:.9rem}
.door-open{position:absolute;left:0;right:0;bottom:0;padding:clamp(20px,3vw,40px);opacity:0;transform:translateY(16px);transition:opacity .5s ease .15s,transform .7s var(--ease) .15s;min-width:360px}
.door-open .kicker{color:rgba(255,255,255,.85)}
.door-open h3{font-family:var(--display);font-weight:800;font-size:clamp(2.2rem,4vw,3.6rem);line-height:.95;margin:8px 0 10px}
.door-open p{max-width:36ch;color:rgba(255,255,255,.92)}
.door-open .enter{display:inline-flex;margin-top:16px;font-weight:600;border-bottom:2px solid #fff;padding-bottom:2px}
.door:hover,.door:focus-visible,.doors:not(:hover):not(:focus-within) .door.on{flex:4.2}
.door:hover .door-open,.door:focus-visible .door-open,.doors:not(:hover):not(:focus-within) .door.on .door-open{opacity:1;transform:none}
.door:hover .door-closed,.door:focus-visible .door-closed,.doors:not(:hover):not(:focus-within) .door.on .door-closed{opacity:0}
.door:hover img.bg{transform:scale(1.05)}
@media (max-width:900px){
  .doors{flex-direction:column;height:auto}
  .door{flex:none;height:46vh;min-height:300px}
  .door-closed{display:none}
  .door-open{opacity:1;transform:none;min-width:0}
}

.say{position:relative;padding:clamp(72px,10vw,140px) 0;overflow:hidden}
.say .mq{font-family:var(--display);font-weight:800;font-size:clamp(3rem,9vw,8rem);line-height:1.05;letter-spacing:-.02em}
.say .mq-item b{color:transparent;-webkit-text-stroke:1.5px var(--ink)}
.say .mq-item i{font-style:normal;background:linear-gradient(90deg,var(--c1),var(--c3));-webkit-background-clip:text;background-clip:text;color:transparent}
.say blockquote{max-width:900px;margin:56px auto 0;padding:0 var(--gutter)}
.say blockquote p{font-family:var(--display);font-weight:500;font-size:clamp(1.3rem,2.6vw,2.1rem);line-height:1.35}
.say cite{display:block;margin-top:18px;font-style:normal;font-weight:600}

.split{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(16px,2vw,24px);padding:0 var(--gutter) clamp(72px,10vw,140px)}
.tile{position:relative;border-radius:var(--radius);overflow:hidden;min-height:440px;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(24px,3vw,44px);text-decoration:none;
  background:color-mix(in srgb,var(--base) 70%,#fff);isolation:isolate}
.tile .t-ar{position:absolute;right:-2%;top:-6%;font-family:var(--arabic);font-weight:700;font-size:18rem;line-height:1;color:var(--accent);opacity:.18;z-index:-1}
.tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.tile.dark{color:#fff;background:var(--ink)}
.tile.dark::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,rgba(10,8,8,.8),rgba(10,8,8,.1) 65%)}
.tile h2{font-family:var(--display);font-weight:800;font-size:clamp(2rem,4vw,3.4rem);line-height:.95;margin:8px 0 10px}
.tile p{max-width:40ch}
.tile .kicker{color:inherit;opacity:.85}
.tile .go{margin-top:16px;font-weight:600;border-bottom:2px solid currentColor;align-self:flex-start}
@media (max-width:900px){.h-hero{grid-template-columns:1fr;padding-top:96px}.h-art{height:62vh;order:-1}.split{grid-template-columns:1fr}}

/* ── ROOM ── */
.r-hero{position:relative;min-height:92dvh;display:flex;flex-direction:column;justify-content:flex-end;padding:120px var(--gutter) clamp(40px,7vh,80px);overflow:hidden;isolation:isolate}
.r-bleed{position:absolute;inset:-12%;z-index:-2;width:124%;height:124%;object-fit:cover;filter:blur(60px) saturate(1.5);opacity:.5}
.r-name-mq{position:absolute;left:0;right:0;top:16%;z-index:-1;font-family:var(--display);font-weight:800;font-size:clamp(7rem,22vw,20rem);line-height:1;color:transparent;-webkit-text-stroke:1.5px var(--ink);opacity:.14}
.r-name-mq .mq-item span[lang]{font-family:var(--arabic);-webkit-text-stroke:0;color:var(--accent);opacity:.9}
.crumbs{display:flex;flex-wrap:wrap;align-items:center;gap:8px;font-size:.9rem;margin-bottom:12px}
.crumbs a{text-decoration:none;min-height:44px;min-width:44px;display:inline-flex;align-items:center}
.crumbs a:hover{text-decoration:underline}
.r-title{font-family:var(--display);font-weight:700;font-size:clamp(3.6rem,13vw,12rem);line-height:.86;letter-spacing:-.035em}
.r-line{font-family:var(--display);font-weight:500;font-size:clamp(1.4rem,3vw,2.4rem);margin:18px 0 12px;max-width:24ch;line-height:1.15}
.r-desc{max-width:52ch;font-size:1.05rem}
.r-meta{display:flex;flex-wrap:wrap;align-items:center;gap:20px 32px;margin-top:28px}
.r-meta p{font-size:.95rem;font-weight:500}
.r-down{display:inline-flex;align-items:center;gap:10px;font-weight:600;text-decoration:none;min-height:44px}
.r-down span{display:inline-block;animation:bob 2.4s ease-in-out infinite}
@keyframes bob{50%{transform:translateY(5px)}}
html.rm .r-down span{animation:none}

.wall{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,4fr);gap:clamp(28px,5vw,88px);align-items:center;padding:clamp(56px,9vw,140px) var(--gutter);max-width:1480px;margin:0 auto}
.wall:nth-of-type(even){grid-template-columns:minmax(0,4fr) minmax(0,7fr)}
.wall:nth-of-type(even) .frame{order:2}
.frame{position:relative;isolation:isolate;justify-self:center;width:100%;display:flex;justify-content:center}
.frame .glow{position:absolute;inset:4% 8%;z-index:-1;width:84%;height:92%;object-fit:cover;filter:blur(52px) saturate(1.7);opacity:.95;transform:translateY(5%)}
.frame button{display:flex;justify-content:center;width:100%;container-type:inline-size;transition:transform .9s var(--ease)}
.frame button:hover{transform:translateY(-6px) scale(1.01)}
.frame img.art{width:auto;max-width:100%;border-radius:4px;box-shadow:0 50px 90px -40px rgba(0,0,0,.6)}
.w-num{font-family:var(--display);font-weight:600;color:var(--soft);letter-spacing:.12em}
.w-title{font-family:var(--display);font-weight:700;overflow-wrap:anywhere;font-size:clamp(2rem,3.4vw,3.4rem);line-height:.95;letter-spacing:-.02em;margin:10px 0 14px}
.w-info{display:flex;flex-direction:column;gap:16px;align-items:flex-start;min-width:0}
.w-info .sw i{width:28px;height:28px}
.w-actions{display:flex;flex-wrap:wrap;gap:10px}
.w-price{font-size:.95rem}
.plate{border-radius:6px;aspect-ratio:4/5;display:grid;place-items:center;color:var(--ink);background:color-mix(in srgb,var(--base) 60%,#fff);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ink) 12%,transparent)}
.plate svg{width:60%;opacity:.7}
.room-note{max-width:60ch;margin:0 auto;padding:40px var(--gutter);text-align:center;font-weight:500}
@media (max-width:900px){.wall,.wall:nth-of-type(even){grid-template-columns:1fr}.wall:nth-of-type(even) .frame{order:0}}

.next{display:block;position:relative;margin:clamp(24px,4vw,56px) var(--gutter);border-radius:calc(var(--radius) + 6px);overflow:hidden;min-height:62vh;text-decoration:none;color:#fff;isolation:isolate;
  background:linear-gradient(130deg,var(--n1),var(--n2) 50%,var(--n3))}
.next img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;transition:transform 1.6s var(--ease)}
.next::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(10,8,8,.75),rgba(10,8,8,.15))}
.next:hover img{transform:scale(1.05)}
.next-in{position:absolute;left:clamp(24px,5vw,72px);bottom:clamp(24px,5vw,72px);right:24px}
.next-in .kicker{color:rgba(255,255,255,.85)}
.next-in h2{font-family:var(--display);font-weight:800;font-size:clamp(3rem,9vw,8rem);line-height:.88;letter-spacing:-.03em;margin:10px 0}
.next-in p{font-size:1.15rem;max-width:30ch}
.next-in .enter{display:inline-flex;margin-top:18px;font-weight:600;border-bottom:2px solid #fff}
.all-rooms{padding:24px var(--gutter) clamp(56px,8vw,100px)}
.all-rooms ul{list-style:none;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:14px}
.all-rooms a{display:flex;flex-direction:column;gap:10px;padding:16px;border-radius:14px;text-decoration:none;background:color-mix(in srgb,var(--base) 60%,#fff);min-height:96px}
.all-rooms a:hover{background:color-mix(in srgb,var(--base) 30%,#fff)}
.all-rooms a[aria-current="page"]{outline:2px solid var(--ink)}
.all-rooms .rm-name{font-size:1rem}
@media (max-width:760px){.all-rooms ul{grid-template-columns:1fr 1fr}.r-hero{min-height:auto;padding-top:120px}}

/* ── ABOUT ── */
.a-hero{position:relative;padding:130px var(--gutter) clamp(56px,8vw,100px);display:grid;grid-template-columns:minmax(0,6fr) minmax(0,5fr);gap:clamp(32px,6vw,96px);align-items:center;isolation:isolate;overflow:hidden}
.a-hero h1{font-family:var(--display);font-weight:800;font-size:clamp(2.8rem,7vw,6.4rem);line-height:.9;letter-spacing:-.03em}
.a-hero h1 em{font-style:normal;background:linear-gradient(90deg,var(--c1),var(--c2),var(--c3));-webkit-background-clip:text;background-clip:text;color:transparent}
.a-copy p{max-width:58ch;margin-top:18px;font-size:1.08rem}
.portrait{aspect-ratio:4/5;border-radius:var(--radius);background:linear-gradient(150deg,var(--c1),var(--c2) 50%,var(--c3));display:grid;place-items:end start;padding:24px;color:#fff;font-weight:600;position:relative;overflow:hidden}
.portrait::before{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.45),transparent 60%)}
.portrait span{position:relative}
.name-sec{position:relative;padding:clamp(72px,10vw,140px) var(--gutter);display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:clamp(32px,6vw,96px);align-items:center}
.big-ar{font-family:var(--arabic);font-weight:700;font-size:clamp(9rem,24vw,22rem);line-height:1.1;text-align:center;background:linear-gradient(120deg,var(--c1),var(--c2),var(--c3),var(--c4));-webkit-background-clip:text;background-clip:text;color:transparent}
.name-sec .lead{font-family:var(--display);font-weight:700;font-size:clamp(1.6rem,3vw,2.4rem);line-height:1.15;margin:10px 0 18px}
.name-sec p{max-width:58ch;margin-bottom:14px}
.sign{font-family:var(--display);font-weight:600;color:var(--accent)}
.tags{list-style:none;display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
.tags li{border-radius:999px;padding:6px 14px;font-size:.85rem;font-weight:600;background:color-mix(in srgb,var(--base) 55%,#fff)}
@media (max-width:900px){.a-hero,.name-sec{grid-template-columns:1fr}.portrait{aspect-ratio:3/2}}

/* ── COLLECT ── */
.c-hero{padding:130px var(--gutter) 40px;position:relative;isolation:isolate}
.c-hero h1{font-family:var(--display);font-weight:800;font-size:clamp(3rem,8vw,7rem);line-height:.9;letter-spacing:-.03em}
.c-hero p{max-width:56ch;margin-top:18px;font-size:1.08rem}
.c-sec{padding:clamp(48px,7vw,96px) var(--gutter)}
.c-sec h2{font-family:var(--display);font-weight:800;font-size:clamp(2rem,4.4vw,3.4rem);line-height:.95;margin-bottom:10px}
.c-sec > p{max-width:56ch;margin-bottom:32px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px}
.card{background:color-mix(in srgb,var(--base) 60%,#fff);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column}
.card button{display:block;overflow:hidden}
.card img{width:100%;aspect-ratio:4/5;object-fit:cover;transition:transform 1s var(--ease)}
.card button:hover img{transform:scale(1.04)}
.card-body{padding:18px 20px 22px;display:flex;flex-direction:column;gap:8px}
.card-body h3{font-family:var(--display);font-weight:700;font-size:1.4rem}
.card-body p{font-size:.9rem;color:var(--soft)}
.forms{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(24px,4vw,56px)}
.form{background:color-mix(in srgb,var(--base) 60%,#fff);border-radius:var(--radius);padding:clamp(22px,3vw,40px)}
.form h3,.follow h3{font-family:var(--display);font-weight:700;font-size:1.6rem;margin-bottom:10px}
.form>p{color:var(--soft);margin-bottom:12px}
.field{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
.field label{font-size:.9rem;font-weight:600}
.field input,.field textarea{font:inherit;font-size:16px;padding:12px 14px;border:1.5px solid color-mix(in srgb,var(--ink) 35%,transparent);background:#fff;color:var(--ink);border-radius:10px}
.field [aria-invalid="true"]{border-color:#B3261E}
.form-status{margin-top:12px;min-height:1.5em;font-weight:500}
.side{display:flex;flex-direction:column;gap:24px}
.follow{padding:8px 4px}
.follow ul{list-style:none;display:flex;gap:16px}
.follow a{display:inline-flex;min-height:44px;min-width:44px;align-items:center;font-weight:600}
@media (max-width:900px){.forms{grid-template-columns:1fr}}

/* ── FOOTER ── */
.foot{position:relative;padding:40px 0 32px;margin-top:40px;border-top:1px solid color-mix(in srgb,var(--ink) 14%,transparent)}
.mq-foot{font-family:var(--display);font-weight:800;font-size:clamp(3rem,10vw,9rem);line-height:1.2;margin-bottom:40px}
.mq-foot .mq-item{gap:.5em;padding-right:.5em}
.mq-foot [lang="ar"]{font-family:var(--arabic);color:var(--accent)}
.mq-foot b{color:transparent;-webkit-text-stroke:1.5px var(--ink);font-weight:800}
.foot-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:32px;padding:0 var(--gutter)}
.foot-name{font-family:var(--display);font-weight:700;font-size:1.4rem}
.foot-soft,.foot-copy{color:var(--soft);font-size:.9rem}
.foot-h{font-family:var(--display);font-weight:600;margin-bottom:6px}
.foot ul{list-style:none}
.foot ul a{display:inline-flex;min-height:44px;min-width:44px;align-items:center;text-decoration:none}
.foot ul a:hover{text-decoration:underline}
.foot-copy{padding:24px var(--gutter) 0}
@media (max-width:760px){.foot-grid{grid-template-columns:1fr 1fr}.foot-grid>div:first-child{grid-column:1/-1}}

/* ── PAINTING PAGE ── */
.pp{position:fixed;inset:0;z-index:200;background:var(--ppbase,var(--base));display:grid;grid-template-rows:auto 1fr;opacity:0;transition:opacity .45s ease;isolation:isolate}
.pp.on{opacity:1}
.pp:not(.on){pointer-events:none}
.pp-bleed{position:absolute;inset:0;z-index:-1;overflow:hidden}
.pp-bleed img{width:100%;height:100%;object-fit:cover;filter:blur(70px) saturate(1.6);opacity:.45;transform:scale(1.3)}
.pp-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px var(--gutter)}
.pp-btn{min-height:44px;padding:8px 16px;font-weight:600;font-size:.9rem;border-radius:999px;background:color-mix(in srgb,#fff 55%,transparent)}
.pp-btn:hover{background:#fff}
.pp-nav{display:flex;gap:8px}
.pp-count{font-size:.85rem;font-weight:600}
.pp-body{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(300px,1fr);min-height:0;overflow:auto}
.pp-fig{display:grid;place-items:center;padding:clamp(16px,3vw,48px);overflow:hidden;min-height:0;cursor:zoom-in;touch-action:pan-y}
.pp-fig img{max-height:calc(100dvh - 140px);width:auto;max-width:100%;object-fit:contain;border-radius:4px;box-shadow:0 50px 90px -40px rgba(0,0,0,.6);transition:transform .5s var(--ease)}
.pp-fig.zoomed{cursor:zoom-out;touch-action:none}
.pp-fig.zoomed img{transform:scale(2.4)}
.pp-info{padding:clamp(24px,4vw,56px) var(--gutter) 48px clamp(16px,2vw,32px);display:flex;flex-direction:column;gap:14px;align-self:center}
.pp-room{font-family:var(--display);font-weight:600;font-size:.85rem;letter-spacing:.14em;text-transform:uppercase}
.pp-title{font-family:var(--display);font-weight:800;font-size:clamp(2.4rem,4.6vw,4rem);line-height:.92;letter-spacing:-.02em}
.pp-working{font-size:.8rem;margin-top:-6px}
.pp-status{font-weight:600}
.pp-sw{display:flex;gap:8px}
.pp-sw i{display:block;width:28px;height:28px;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(255,255,255,.6)}
.pp-facts{display:grid;gap:8px;border-top:1px solid rgba(0,0,0,.15);border-bottom:1px solid rgba(0,0,0,.15);padding:14px 0}
.pp-facts div{display:flex;justify-content:space-between;gap:16px}
.pp-story{font-style:italic}
.pp-actions{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.pp-note{font-size:.9rem;min-height:1.4em}
@media (max-width:880px){.pp-body{grid-template-columns:1fr;grid-auto-rows:max-content}.pp-fig{min-height:auto;padding:12px var(--gutter)}.pp-fig img{max-height:60dvh}.pp-info{align-self:start;padding:8px var(--gutter) 48px}}
@media (max-width:560px){.pp-count{display:none}.pp-btn{padding:8px 12px}}
html.rm .pp,html.rm .pp-fig img{transition:none}
'''

# ── JS ─────────────────────────────────────────────────────────────────────

JS = r'''
(() => {
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.toggle('rm', RM);
const $ = id => document.getElementById(id);
const body = document.body;

// nav and the Rooms menu
const nav = $('nav'), btn = $('rooms-btn'), menu = $('rooms-menu');
const onNav = () => nav.classList.toggle('scrolled', scrollY > 30);
addEventListener('scroll', onNav, { passive: true }); onNav();
function setMenu(open) {
  menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); nav.classList.toggle('menu-open', open);
  if (open) menu.querySelector('a').focus();
}
btn.addEventListener('click', () => setMenu(menu.hidden));
document.addEventListener('click', e => { if (!menu.hidden && !nav.contains(e.target)) setMenu(false); });
nav.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); btn.focus(); } });

// reveals
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.rv').forEach(el => RM ? el.classList.add('in') : io.observe(el));

// the page takes on the colours of the painting you are looking at
const home = ['--c1', '--c2', '--c3', '--c4'].map(v => getComputedStyle(body).getPropertyValue(v).trim());
const tint = cols => cols.forEach((c, i) => body.style.setProperty('--a' + (i + 1), c));
const walls = [...document.querySelectorAll('[data-colours]')];
if (walls.length) {
  const tio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) tint(JSON.parse(e.target.dataset.colours)); }), { rootMargin: '-45% 0px -45% 0px' });
  walls.forEach(w => tio.observe(w));
  const top = document.querySelector('.r-hero, .h-hero');
  if (top) new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) tint(home); }), { rootMargin: '-45% 0px -45% 0px' }).observe(top);
}

// home: the three paintings drift gently with the pointer
const art = document.querySelector('.h-art');
if (art && !RM && matchMedia('(pointer: fine)').matches) {
  const figs = [...art.querySelectorAll('figure')];
  addEventListener('pointermove', e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    figs.forEach((f, i) => { const k = (i + 1) * 9; f.style.translate = (x * k) + 'px ' + (y * k) + 'px'; });
  }, { passive: true });
}

// painting pages: #/painting/<slug>, shareable; prev and next stay in this page's set
const pp = $('pp');
if (pp) {
  const ALL = JSON.parse($('paintings').textContent);
  const order = [...new Set([...document.querySelectorAll('[data-painting]')].map(b => b.dataset.painting))];
  const DATA = order.map(s => ALL.find(p => p.slug === s));
  const fig = $('pp-fig'), img = document.createElement('img'), bleed = document.createElement('img');
  img.alt = ''; bleed.alt = '';
  let cur = -1, pushed = false, lastFocus = null, zoomed = false;
  const roomTitle = document.title;
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
    pp.classList.remove('on'); setZoom(false); body.classList.remove('pp-open'); document.title = roomTitle;
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

// forms (prototype: nothing is sent) and an enquiry carried over from a painting
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

# ── PAGES ──────────────────────────────────────────────────────────────────


def page(fname, title, desc, t, current, main, overlay=True):
    pp = PAINTING_PAGE.replace('id="pp-ask" href="#"', f'id="pp-ask" href="{COLLECT_F}#enquire" data-base="{COLLECT_F}"') if overlay else ""
    data = f'<script type="application/json" id="paintings">{data_json()}</script>' if overlay else ""
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<!-- Prototype v4 ({fname}). Built by build-v4.py: colours sampled from Ayesha's paintings. Do not edit by hand. -->
{FONTS}
<style>{CSS}</style>
</head>
<body style="{style_vars(t)}">
{nav(current)}
<main id="main">
{main}
</main>
{footer()}
{pp}
{data}
<script>{JS}</script>
</body>
</html>
'''


def door(r, on=False):
    t = r["theme"]
    c = r["swatches"]
    if r["key_art"]:
        bg = f'<img class="bg" src="assets/art/{r["key_art"]}-sm.webp" alt="" loading="lazy">'
    else:
        bg = f'<span class="motif">{motif(r["todo"][0][1])}</span>'
    n = len(r["works"])
    count = f'{n} painting{"" if n == 1 else "s"}' if n else "Photographs to come"
    return (f'<a class="door{" on" if on else ""}" href="{r["file"]}" style="--d1:{c[0]};--d2:{c[1]};--d3:{t["ink"]}">{bg}'
            f'<span class="door-closed" aria-hidden="true"><small>{r["num"]}</small><b>{E(r["name"])}</b></span>'
            f'<span class="door-open"><span class="kicker">Room {r["num"]} · {count}</span><h3>{E(r["name"])}</h3>'
            f'<p>{E(r["line"])}</p><span class="enter">Enter the room <span aria-hidden="true">→</span></span></span></a>')


def home_page():
    hero_art = ""
    for cls, slug in (("f1", "dancing-trees"), ("f2", "stripes"), ("f3", "tower")):
        w = W[slug]
        glow = PALETTE[slug]["colours"][0]
        hero_art += (f'<figure class="{cls}"><span class="glow" style="background:{glow}"></span>'
                     f'<a href="{R[w["pillar"]]["file"]}#/painting/{slug}" aria-label="{E(w["title"])}, in {E(R[w["pillar"]]["name"])}">'
                     f'<img src="assets/art/{slug}-sm.webp" alt="{E(w["alt"])}" width="{w["w"]}" height="{w["h"]}"></a></figure>')
    doors = "".join(door(r, on=(r["key"] == "nature")) for r in ROOMS)
    main = f'''<section class="h-hero" aria-labelledby="h-name" data-stage-section="arrival">
  {lines_svg()}
  {marquee(f'<span lang="ar">{ARABIC}</span>', "h-ar")}
  <div>
    <p class="kicker">Acrylic · London · Mauritius</p>
    <h1 class="h-name" id="h-name"><span>Ayesha</span><span class="j">Johar</span></h1>
    <p class="h-line">Beauty is a form of resistance.</p>
    <p class="h-calm">Thirty years of painting, hung in five rooms. Take your time: every painting is layered on purpose, and there is always something new to see.</p>
    <div class="h-cta"><a class="btn" href="#rooms">Choose a room</a><a class="btn-line" href="{COLLECT_F}">Collect</a></div>
  </div>
  <div class="h-art">{hero_art}</div>
</section>
<section class="doors-wrap" id="rooms" aria-labelledby="rooms-title" data-stage-section="rooms">
  <p class="kicker rv">The rooms</p>
  <h2 class="sec-title rv" id="rooms-title">Step into a room.</h2>
  <p class="sec-intro rv">The work is hung by what it holds, not when it was made. Each room has its own colours, taken from the paintings inside it.</p>
  <div class="doors rv">{doors}</div>
</section>
<section class="say" aria-label="On beauty" data-stage-section="on-beauty">
  {marquee("<b>Beauty is</b><i>a form of resistance</i>", "", reverse=True)}
  <blockquote class="rv"><p>Hidden colours and shapes exist everywhere, and once I expose them in my paintings, it forces us to see beauty in both the good and the bad.</p><cite>Ayesha Johar</cite></blockquote>
</section>
<section class="split" aria-label="More" data-stage-section="more">
  <a class="tile rv" href="{ABOUT_F}"><span class="t-ar" lang="ar" aria-hidden="true">{ARABIC}</span><span class="kicker">Who I am</span><h2>Painter, feminist, justice fighter.</h2><p>Born in Mauritius, living in London. Johar means jewel, courage and ultimate sacrifice.</p><span class="go">Meet Ayesha</span></a>
  <a class="tile dark rv" href="{COLLECT_F}"><img src="assets/art/forts-sm.webp" alt="" loading="lazy"><span class="kicker">Collect</span><h2>Bring the work into your life.</h2><p>Original paintings, prints, and commissions made for you.</p><span class="go">See what is available</span></a>
</section>'''
    return page(HOME_F, "Art by Ayesha Johar", "Beauty is a form of resistance. Acrylic paintings by Ayesha Johar, London and Mauritius, hung in five rooms.", HOME, "home", main)


def room_page(i):
    r = ROOMS[i]
    t = r["theme"]
    nxt = ROOMS[(i + 1) % len(ROOMS)]
    walls = ""
    n = len(r["works"]) + len(r["todo"])
    for j, w in enumerate(r["works"]):
        cols = PALETTE[w["slug"]]["colours"]
        walls += f'''<section class="wall" aria-labelledby="t-{w["slug"]}" data-colours='{json.dumps([lift(x) for x in (cols * 2)[:4]])}'>
  <div class="frame rv">
    <img class="glow" src="assets/art/{w["slug"]}-sm.webp" alt="" aria-hidden="true" loading="lazy">
    <button type="button" data-painting="{w["slug"]}" aria-label="Look closer at {E(w["title"])}"><img class="art" src="assets/art/{w["slug"]}.webp" alt="{E(w["alt"])}" width="{w["w"]}" height="{w["h"]}" style="aspect-ratio:{w["w"]}/{w["h"]};height:min(80vh,calc(100cqw * {w["h"]} / {w["w"]}))" loading="lazy"></button>
  </div>
  <div class="w-info rv">
    <p class="w-num">{j + 1:02d} / {n:02d}</p>
    <h2 class="w-title" id="t-{w["slug"]}">{E(w["title"])}</h2>
    {status_chip(w)}
    <p class="w-price">{ {"available": "Original available. Price on request.", "sold": "The original has found a home.", "prints": "Prints available through Etsy."}[w["status"]] }</p>
    {swatches(cols, "Colours in " + w["title"])}
    <div class="w-actions"><button type="button" class="btn" data-painting="{w["slug"]}">Look closer</button><a class="btn-line" href="{COLLECT_F}?about={quote(w["title"])}#enquire">Ask about it</a></div>
  </div>
</section>'''
    for k, (label, kind) in enumerate(r["todo"]):
        j = len(r["works"]) + k
        walls += f'''<section class="wall" aria-labelledby="t-todo-{k}">
  <div class="frame rv"><div class="plate" role="img" aria-label="{E(label)}: photograph to come">{motif(kind)}</div></div>
  <div class="w-info rv">
    <p class="w-num">{j + 1:02d} / {n:02d}</p>
    <h2 class="w-title" id="t-todo-{k}">{E(label)}</h2>
    <span class="chip">Photograph to come</span>
    <p class="w-price">This painting will hang here once it has been photographed.</p>
  </div>
</section>'''
    nb = (f'<img src="assets/art/{nxt["key_art"]}-sm.webp" alt="" loading="lazy">' if nxt["key_art"] else "")
    nc = nxt["swatches"]
    count = len(r["works"])
    bleed = r["key_art"] or r["borrowed"][0]
    rooms_strip = "".join(
        f'<li><a href="{x["file"]}"{" aria-current=\"page\"" if x is r else ""}><span class="rm-num">{x["num"]}</span><span class="rm-name">{E(x["name"])}</span>'
        f'<span class="rm-sw" aria-hidden="true">{"".join(f"<i style=\"background:{c}\"></i>" for c in x["swatches"][:4])}</span></a></li>' for x in ROOMS)
    main = f'''<section class="r-hero" aria-labelledby="r-title" data-stage-section="room-arrival">
  <img class="r-bleed" src="assets/art/{bleed}-sm.webp" alt="" aria-hidden="true">
  {lines_svg()}
  {marquee(f'{E(r["name"])} <span lang="ar">{ARABIC}</span>', "r-name-mq")}
  <nav class="crumbs" aria-label="Breadcrumb"><a href="{HOME_F}">Home</a><span aria-hidden="true">/</span><a href="{HOME_F}#rooms">Rooms</a><span aria-hidden="true">/</span><span aria-current="page">Room {r["num"]}</span></nav>
  <p class="kicker">Room {r["num"]} of V</p>
  <h1 class="r-title" id="r-title">{E(r["name"])}</h1>
  <p class="r-line">{E(r["line"])}</p>
  <p class="r-desc">{E(r["desc"])}</p>
  <div class="r-meta">
    {swatches(r["swatches"], "Colours in this room, taken from its paintings")}
    <p>{f"{count} painting{'' if count == 1 else 's'}" if count else "Photographs to come"}{", more to come" if r["todo"] and count else ""}</p>
    <a class="r-down" href="#hung">Walk in <span aria-hidden="true">↓</span></a>
  </div>
</section>
<div id="hung" data-stage-section="room-walls">
{f'<p class="room-note">{E(r["note"])}</p>' if r["note"] else ""}
{walls}
</div>
<a class="next rv" href="{nxt["file"]}" style="--n1:{nc[0]};--n2:{nc[1]};--n3:{nxt["theme"]["ink"]}" data-stage-section="next-room">{nb}
  <span class="next-in"><span class="kicker">Next room · Room {nxt["num"]}</span><h2>{E(nxt["name"])}</h2><p>{E(nxt["line"])}</p><span class="enter">Enter <span aria-hidden="true">→</span></span></span></a>
<nav class="all-rooms" aria-label="All rooms"><p class="kicker">All five rooms</p><ul>{rooms_strip}</ul></nav>'''
    return page(r["file"], f'{r["name"]} · Art by Ayesha Johar', f'{r["line"]} {r["desc"]}', t, r["key"], main)


def about_page():
    main = f'''<section class="a-hero" aria-labelledby="a-title" data-stage-section="about-intro">
  {lines_svg()}
  <div class="a-copy">
    <p class="kicker">Who I am</p>
    <h1 id="a-title">I put colours together the way <em>I put myself together.</em></h1>
    <p>I am a painter, a feminist and a justice fighter. I was born in Mauritius and I live in London. I am political, spiritual and curious, and I have spent years decolonising my mind and soul.</p>
    <p>I do not paint to fit in. I go against the grain, unapologetically, and I put colours together the way I put myself together: boldly, and my own way.</p>
    <p>I have been making work for over thirty years. Every painting is layered on purpose. Look again, and there is always something new to see.</p>
    <ul class="tags" aria-label="About Ayesha"><li>Acrylic</li><li>London</li><li>Mauritius</li><li>Feminist</li><li>Justice</li><li>Spirituality</li><li>Community</li><li>LGBTQ+</li></ul>
  </div>
  <figure class="portrait rv" role="img" aria-label="Photograph of Ayesha to come"><span>A photograph of Ayesha, ideally at work, to come</span></figure>
</section>
<section class="name-sec" aria-labelledby="n-title" data-stage-section="the-name">
  <p class="big-ar rv" lang="ar" aria-hidden="true">{ARABIC}</p>
  <div class="rv">
    <p class="kicker" id="n-title">The name</p>
    <p class="lead">Johar means jewel, courage and ultimate sacrifice.</p>
    <p>In 1600s Rajasthan, the women of a captured empire used to sacrifice themselves in a pit of fire rather than be shackled as sex slaves by the conquerors.</p>
    <p>Being a Johar, when my wife and I chose this name after we married, was a statement that we live by our principles, unapologetically and at all costs. I am political. I have been decolonising my mind and soul, and I am a justice fighter. Johar encompasses those values and passions.</p>
    <p class="sign">Ayesha Johar</p>
  </div>
</section>
<section class="say" aria-label="On beauty" data-stage-section="on-beauty">
  {marquee("<b>Beauty is</b><i>a form of resistance</i>")}
  <blockquote class="rv"><p>For me, beauty is a form of resistance. Hidden colours and shapes exist everywhere, and once I expose them in my paintings, it forces us to see beauty in both the good and the bad. Through that altered way of seeing, I urge the audience to see what we can reveal, and to challenge what is harmful in a different way.</p><cite>Ayesha Johar</cite></blockquote>
</section>
<nav class="all-rooms" aria-label="All rooms"><p class="kicker">Walk through the rooms</p><ul>{"".join(f'<li><a href="{x["file"]}"><span class="rm-num">{x["num"]}</span><span class="rm-name">{E(x["name"])}</span><span class="rm-sw" aria-hidden="true">{"".join(f"<i style=\"background:{c}\"></i>" for c in x["swatches"][:4])}</span></a></li>' for x in ROOMS)}</ul></nav>'''
    return page(ABOUT_F, "Who I am · Art by Ayesha Johar", "Ayesha Johar: painter, feminist and justice fighter, born in Mauritius, living in London.", ABOUT_T, "about", main, overlay=False)


def collect_page():
    def cards(status):
        out = ""
        for w in [W[x[0]] for x in WORKS if x[3] == status]:
            r = R[w["pillar"]]
            out += (f'<article class="card rv"><button type="button" data-painting="{w["slug"]}" aria-label="Look closer at {E(w["title"])}">'
                    f'<img src="assets/art/{w["slug"]}-sm.webp" alt="{E(w["alt"])}" width="{w["w"]}" height="{w["h"]}" loading="lazy"></button>'
                    f'<div class="card-body"><h3>{E(w["title"])}</h3><p>Room {r["num"]} · {E(r["name"])}</p>{status_chip(w)}</div></article>')
        return out
    main = f'''<section class="c-hero" aria-labelledby="c-title" data-stage-section="collect-intro">
  {lines_svg()}
  <p class="kicker">Collect · Commission · Follow</p>
  <h1 id="c-title">Bring the work into your life.</h1>
  <p>If a painting has stayed with you, here is how to take it further: an original, a print, or something made for you.</p>
</section>
<section class="c-sec" aria-labelledby="o-title" data-stage-section="originals">
  <h2 id="o-title">Original paintings</h2>
  <p>Acrylic originals, directly from Ayesha. Open any painting to look closer, then ask about it.</p>
  <div class="cards">{cards("available")}</div>
</section>
<section class="c-sec" aria-labelledby="p-title" data-stage-section="prints">
  <h2 id="p-title">Prints</h2>
  <p>Prints of these paintings are sold through Ayesha's Etsy shop, so the colour can live on your wall too.</p>
  <div class="cards">{cards("prints")}</div>
</section>
<section class="c-sec" aria-labelledby="f-title" data-stage-section="enquire">
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
    return page(COLLECT_F, "Collect · Art by Ayesha Johar", "Original paintings, prints and commissions from Ayesha Johar.", COLLECT_T, "collect", main)


if __name__ == "__main__":
    outs = {HOME_F: home_page(), ABOUT_F: about_page(), COLLECT_F: collect_page()}
    for i, r in enumerate(ROOMS):
        outs[r["file"]] = room_page(i)
    for name, text in outs.items():
        if chr(0x2014) in text:
            raise SystemExit(f"{name}: em dash found")
        with open(os.path.join(HERE, name), "w", encoding="utf-8") as f:
            f.write(text)
        print(f"wrote {name} ({len(text) // 1024} KB)")
    for r in ROOMS:
        t = r["theme"]
        print(f'{r["key"]:8} base {t["base"]} ink {t["ink"]} accent {t["accent"]} (white {contrast(t["accent"], "#FFFFFF"):.1f}) soft {t["soft"]} sw {" ".join(r["swatches"])}')
