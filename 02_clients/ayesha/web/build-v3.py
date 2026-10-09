#!/usr/bin/env python3
"""Build the Art by Ayesha Johar v3 variations as multi-page sites.

    python3 build-v3.py

Three variations, each a home page, five room pages, Who I am and Collect:
  ayesha-johar-v3a*.html   A. The Walk: each room painted in its own deep colour, a gallery walk along the wall
  ayesha-johar-v3b*.html   B. Colour Field: every painting gets a full screen of its own vivid colour
  ayesha-johar-v3c*.html   C. Hidden Colours: the room starts grey and its colours come through as you look
  ayesha-johar-v3-choose.html  an internal index of every direction (v3 A, B, C and v4)

Direction (Osman, 9 Oct 2026): no house-style guardrails on type or colour.
Every colour is sampled from her paintings (site_kit.py). Each room carries
generated art in its own language: mandalas for The Sacred, water and fronds
for Nature, a skyline with round windows for World, orbits for Witness, and
drawn lines for Love.
"""
import os
from urllib.parse import quote

from site_kit import (ARABIC, CREAM, HOME_COLOURS, PALETTE, PRICE_LINE, ROOMS, STATUS, W, E, Site, art_img, contrast, from_hls, hls,
                      marquee, mini_art, mix, motif_vars, plate_svg, room_art, shade, status_chip, swatches, text_on, until)

HERE = os.path.dirname(os.path.abspath(__file__))


def tokens(d, art_cols, floor=None):
    return 'style="' + ";".join(f"--{k}:{v}" for k, v in d.items()) + ";" + motif_vars(art_cols, floor) + '"'


def count_text(r):
    n = len(r["works"])
    base = f"{n} painting{'' if n == 1 else 's'}" if n else "Photographs to come"
    return base + (", more to come" if r["todo"] and n else "")


def crumbs(site, r):
    return (f'<nav class="crumbs" aria-label="Breadcrumb"><a href="{site.home}">Home</a><span aria-hidden="true">/</span>'
            f'<a href="{site.home}#rooms">Rooms</a><span aria-hidden="true">/</span><span aria-current="page">Room {r["num"]}</span></nav>')


def actions(site, w, ask_cls="btn-line"):
    return (f'<div class="acts"><button type="button" class="btn" data-painting="{w["slug"]}">Look closer</button>'
            f'<a class="{ask_cls}" href="{site.collect}?about={quote(w["title"])}#enquire">Ask about it</a></div>')


TILE_ABOUT = '<span class="kicker">Who I am</span><h2>Painter, feminist, justice fighter.</h2><p>Born in Mauritius, living in London. Johar means jewel, courage and ultimate sacrifice.</p><span class="go">Meet Ayesha</span>'
TILE_COLLECT = '<img src="assets/art/forts-sm.webp" alt="" loading="lazy"><span class="kicker">Collect</span><h2>Bring the work into your life.</h2><p>Original paintings, prints, and commissions made for you.</p><span class="go">See what is available</span>'
TILES_CSS = '''
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:0 var(--gutter) clamp(56px,8vw,120px)}
.tile{position:relative;border-radius:var(--radius);overflow:hidden;min-height:400px;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(24px,3vw,44px);text-decoration:none;isolation:isolate;background:var(--panel);color:var(--on-panel)}
.tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.tile.dark{color:#fff;background:#120d0b}
.tile.dark::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,rgba(0,0,0,.8),rgba(0,0,0,.1) 70%)}
.tile.dark .kicker{color:#fff}
.tile h2{font-size:clamp(2rem,4.2vw,3.4rem);line-height:.95;margin:8px 0 10px}
.tile .go{margin-top:16px;font-weight:700;border-bottom:2px solid currentColor;align-self:flex-start}
.tile .t-ar{position:absolute;right:4%;top:-4%;font-family:var(--arabic);font-size:14rem;line-height:1;color:var(--accent);opacity:.25;z-index:-1}
@media (max-width:860px){.tiles{grid-template-columns:1fr}}
.acts{display:flex;flex-wrap:wrap;gap:10px}
'''


def tiles(site, ar=False):
    t_ar = f'<span class="t-ar" lang="ar" aria-hidden="true">{ARABIC}</span>' if ar else ""
    return (f'<section class="tiles" aria-label="More" data-stage-section="more"><a class="tile rv" href="{site.about}">{t_ar}{TILE_ABOUT}</a>'
            f'<a class="tile dark rv" href="{site.collect}">{TILE_COLLECT}</a></section>')


# ═══ A. THE WALK ═══════════════════════════════════════════════════════════

A = Site("ayesha-johar-v3a", "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Figtree:wght@400;500;600;700&family=Reem+Kufi:wght@400;700&display=swap",
         "Prototype v3 A, The Walk")
A_FONTS = {"display": "'Bricolage Grotesque',system-ui,sans-serif", "body": "'Figtree',system-ui,sans-serif", "arabic": "'Reem Kufi',sans-serif"}


def a_wall(colour):
    hh, _, s = hls(colour)
    return from_hls(hh, .2, min(.75, max(s, .45)))


def a_theme(colour, second, art_cols):
    wall = a_wall(colour)
    ink = "#FFF6EA"
    d = dict(bg=wall, ink=ink, soft=until(mix(ink, wall, .3), wall, 4.8, step=.02),
             panel=from_hls(hls(colour)[0], .3, min(.6, max(hls(colour)[2], .35))),
             accent=until(shade(second, l=.74, s=min(.85, hls(second)[2] + .2)), wall, 5, step=.02), **A_FONTS)
    d["on-panel"], d["on-accent"] = ink, wall
    return tokens(d, art_cols, .5)


A_CSS = TILES_CSS + '''
.kicker{color:var(--soft)}
h1,h2,h3,.wordmark{font-family:var(--display)}
.wordmark{font-weight:800}
.wm-ar{color:var(--accent)}
.room-art{opacity:.55}
.a-foyer{position:relative;min-height:100dvh;padding:120px var(--gutter) 64px;overflow:hidden;isolation:isolate;display:flex;flex-direction:column;justify-content:center}
.a-ar{position:absolute;inset:0;z-index:-1;display:flex;flex-direction:column;justify-content:center;gap:2vh;font-family:var(--arabic);font-weight:700;font-size:clamp(5rem,13vw,12rem);line-height:1.1;color:var(--accent);opacity:.14}
.a-name{font-size:clamp(3.4rem,10vw,10rem);font-weight:800;line-height:.86;letter-spacing:-.04em;margin:14px 0 22px}
.a-name span{display:block}
.a-name span:last-child{color:var(--accent)}
.a-line{font-family:var(--display);font-size:clamp(1.4rem,2.8vw,2.3rem);font-weight:600;max-width:24ch;line-height:1.15}
.a-calm{max-width:46ch;margin-top:14px;color:var(--soft)}
.a-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
.arches-wrap{padding:clamp(56px,8vw,120px) var(--gutter)}
.sec-title{font-size:clamp(2.4rem,6vw,5rem);font-weight:800;line-height:.92;letter-spacing:-.03em;margin:12px 0 14px}
.sec-intro{max-width:56ch;color:var(--soft);margin-bottom:40px}
.arches{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:clamp(10px,1.6vw,22px);align-items:end}
.arch{position:relative;display:flex;flex-direction:column;justify-content:flex-end;gap:2px;min-height:min(64vh,580px);border-radius:999px 999px 18px 18px;overflow:hidden;isolation:isolate;text-decoration:none;
  background:var(--wall);color:#FFF6EA;padding:24px 18px;transition:transform .8s var(--ease),box-shadow .8s var(--ease);box-shadow:0 30px 60px -30px rgba(0,0,0,.6)}
.arch:nth-child(even){min-height:min(70vh,640px)}
.arch .room-art{opacity:.8}
.arch::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,rgba(0,0,0,.72),transparent 60%)}
.arch:hover,.arch:focus-visible{transform:translateY(-10px);box-shadow:0 50px 80px -30px rgba(0,0,0,.7)}
.arch b{font-family:var(--display);font-weight:800;font-size:clamp(1.4rem,2.2vw,2rem);line-height:1}
.arch small{font-size:.8rem;font-weight:700;letter-spacing:.14em}
.arch .l{font-size:.95rem;margin-top:6px}
.arch .go{margin-top:12px;font-weight:700;border-bottom:2px solid currentColor;align-self:flex-start}
@media (max-width:1000px){.arches{grid-template-columns:repeat(2,minmax(0,1fr))}.arch,.arch:nth-child(even){min-height:380px}}
@media (max-width:560px){.arches{grid-template-columns:1fr}}
.tile h2{font-weight:800}
.a-hero{position:relative;min-height:100dvh;padding:120px var(--gutter) clamp(40px,8vh,90px);display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;isolation:isolate}
.a-hero::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,var(--bg) 10%,transparent 62%)}
.a-title{font-size:clamp(3.8rem,13vw,12rem);font-weight:800;line-height:.86;letter-spacing:-.04em}
.a-hero .a-line{margin:18px 0 10px}
.a-desc{max-width:52ch;font-size:1.06rem}
.a-meta{display:flex;flex-wrap:wrap;align-items:center;gap:18px 30px;margin-top:26px}
.a-meta p{font-weight:600}
.a-meta a{font-weight:700;text-decoration:none;min-height:44px;display:inline-flex;align-items:center;gap:8px}
.a-note{max-width:60ch;margin:0 auto;padding:12px var(--gutter);text-align:center;color:var(--soft)}
.walk{position:relative}
.walk-sticky{padding:72px 0 64px}
.track{display:flex;gap:clamp(36px,6vw,110px);align-items:center;padding:0 var(--gutter);overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:var(--gutter);scrollbar-width:thin}
.track>*{scroll-snap-align:start;flex:0 0 auto}
.w-intro{width:min(440px,80vw)}
.w-intro h2{font-size:clamp(2rem,4vw,3.4rem);font-weight:800;line-height:.95;margin:10px 0 14px}
.w-intro p{color:var(--soft)}
.wp{position:relative;display:flex;flex-direction:column;gap:14px}
.wp::before{content:"";position:absolute;left:-25%;right:-25%;top:-110px;height:75%;z-index:0;pointer-events:none;background:radial-gradient(ellipse at 50% 0,rgba(255,236,200,.34),transparent 65%)}
.wp button{position:relative;z-index:1;display:block;padding:12px;background:#FFFDF8;box-shadow:0 40px 70px -30px rgba(0,0,0,.85);transition:transform .8s var(--ease)}
.wp button:hover{transform:translateY(-6px)}
.wp img{height:min(56vh,460px);width:auto;max-width:none}
.wp.tall img{height:min(64vh,520px)}
.wp.low img{height:min(46vh,380px)}
.wp figcaption{position:relative;z-index:1;display:flex;flex-direction:column;gap:8px;align-items:flex-start}
.wp .t{font-family:var(--display);font-weight:700;font-size:1.4rem}
.wp .p{font-size:.9rem;color:var(--soft)}
.wp .plate{position:relative;z-index:1;height:min(56vh,460px);aspect-ratio:4/5;background:#FFFDF8;display:grid;place-items:center;box-shadow:0 40px 70px -30px rgba(0,0,0,.85)}
.wp .plate svg{width:78%}
.w-end{width:min(320px,70vw);display:flex;flex-direction:column;gap:10px}
.w-end a{font-family:var(--display);font-weight:800;font-size:2rem;text-decoration:none;min-height:44px}
.bar{display:none}
html.walking .walk-sticky{position:sticky;top:0;height:100dvh;overflow:hidden;display:flex;flex-direction:column;justify-content:center;padding:80px 0 40px}
html.walking .track{overflow:visible;width:max-content;will-change:transform;scroll-snap-type:none}
html.walking .bar{display:block;position:absolute;left:var(--gutter);right:var(--gutter);bottom:26px;height:3px;background:color-mix(in srgb,var(--ink) 18%,transparent)}
html.walking .bar i{display:block;height:100%;background:var(--accent);transform-origin:left;transform:scaleX(0)}
.a-next{position:relative;display:block;margin:clamp(40px,6vw,90px) auto 0;width:min(560px,calc(100% - 2*var(--gutter)));min-height:70vh;border-radius:999px 999px 18px 18px;overflow:hidden;isolation:isolate;text-decoration:none;color:#FFF6EA;background:var(--wall);transition:transform .8s var(--ease)}
.a-next .room-art{opacity:.85}
.a-next::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,rgba(0,0,0,.75),transparent 60%)}
.a-next .in{position:absolute;left:32px;right:32px;bottom:32px;display:flex;flex-direction:column;gap:8px}
.a-next .in .kicker{color:#FFF6EA}
.a-next b{font-family:var(--display);font-weight:800;font-size:clamp(2.6rem,6vw,4.4rem);line-height:.9}
.a-next .go{font-weight:700;border-bottom:2px solid currentColor;align-self:flex-start}
.a-next:hover{transform:translateY(-6px)}
.ab-hero h1{font-weight:800}
.ab-hero h1 em,.big-ar,.sign{color:var(--accent);font-style:normal}
.co-hero h1,.co-sec h2{font-weight:800}
.mq-foot{font-weight:800;color:var(--accent)}
.mq-foot b{color:var(--soft)}
'''

A_JS = r'''
(() => {
const RM = window.AJ.RM, root = document.documentElement, walk = document.querySelector('.walk');
if (!walk) return;
const desk = matchMedia('(min-width: 1024px)'), t = walk.querySelector('.track');
let on = false, dist = 0;
function layout() {
  on = desk.matches && !RM; root.classList.toggle('walking', on);
  if (on) { dist = Math.max(0, t.scrollWidth - innerWidth); walk.style.height = (innerHeight + dist) + 'px'; } else { walk.style.height = ''; t.style.transform = ''; }
  tick();
}
function tick() {
  if (!on) return;
  const x = Math.min(dist, Math.max(0, -walk.getBoundingClientRect().top));
  t.style.transform = 'translate3d(' + (-x) + 'px,0,0)';
  walk.querySelector('.bar i').style.transform = 'scaleX(' + (dist ? x / dist : 0) + ')';
}
let raf = 0;
addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; tick(); }); }, { passive: true });
addEventListener('resize', layout); desk.addEventListener('change', layout); addEventListener('load', layout); layout();
document.addEventListener('focusin', e => {
  if (!on) return; const panel = e.target.closest('.track > *'); if (!panel) return;
  scrollTo({ top: walk.offsetTop + Math.min(dist, Math.max(0, panel.offsetLeft - innerWidth * .25)), behavior: 'auto' });
});
})();
'''


def a_home():
    t = a_theme(HOME_COLOURS[0], HOME_COLOURS[2], HOME_COLOURS)
    rows = "".join(marquee(f'<span lang="ar">{ARABIC}</span>', "", reverse=bool(i % 2)) for i in range(3))
    arches = "".join(
        f'<a class="arch rv" href="{A.room_file(r["key"])}" style="--wall:{a_wall(r["primary"])};{motif_vars(r["swatches"], .5)}">{room_art(r["key"], seed=5)}'
        f'<small>ROOM {r["num"]}</small><b>{E(r["name"])}</b><span class="l">{E(r["line"])}</span><span class="go">Enter</span></a>' for r in ROOMS)
    main = f'''<section class="a-foyer" aria-labelledby="h-name" data-stage-section="arrival">
  <div class="a-ar" aria-hidden="true">{rows}</div>
  <p class="kicker">Acrylic · London · Mauritius</p>
  <h1 class="a-name" id="h-name"><span>Ayesha</span><span>Johar</span></h1>
  <p class="a-line">Beauty is a form of resistance.</p>
  <p class="a-calm">Thirty years of painting, hung in five rooms. Each room is painted in the colours of the work inside it. Take your time.</p>
  <div class="a-cta"><a class="btn" href="#rooms">Choose a room</a><a class="btn-line" href="{A.collect}">Collect</a></div>
</section>
<section class="arches-wrap" id="rooms" aria-labelledby="rooms-title" data-stage-section="rooms">
  <p class="kicker rv">The rooms</p>
  <h2 class="sec-title rv" id="rooms-title">Five doors. Walk through any of them.</h2>
  <p class="sec-intro rv">The work is hung by what it holds, not when it was made.</p>
  <div class="arches">{arches}</div>
</section>
{tiles(A, ar=True)}'''
    return A.page(A.home, "Art by Ayesha Johar", "Beauty is a form of resistance. Acrylic paintings by Ayesha Johar, hung in five rooms.", t, "home", main, A_CSS, A_JS)


def a_room(i):
    r, nxt = ROOMS[i], ROOMS[(i + 1) % len(ROOMS)]
    rhythm = ["tall", "", "low", "tall", "", "low", ""]
    panels = [f'<div class="w-intro"><p class="kicker">Along the wall</p><h2>{E(count_text(r))}</h2><p>Open any painting to look closer, see if it is available, or ask about it.</p></div>']
    for j, w in enumerate(r["works"]):
        panels.append(f'<figure class="wp {rhythm[j % 7]}"><button type="button" data-painting="{w["slug"]}" aria-label="Look closer at {E(w["title"])}">'
                      f'<img src="assets/art/{w["slug"]}-sm.webp" alt="{E(w["alt"])}" width="{w["w"]}" height="{w["h"]}" style="aspect-ratio:{w["w"]}/{w["h"]}" loading="lazy"></button>'
                      f'<figcaption><span class="t">{E(w["title"])}</span>{status_chip(w)}<span class="p">{PRICE_LINE[w["status"]]}</span></figcaption></figure>')
    for label, kind in r["todo"]:
        panels.append(f'<figure class="wp"><div class="plate" role="img" aria-label="{E(label)}: photograph to come">{plate_svg(kind)}</div>'
                      f'<figcaption><span class="t">{E(label)}</span><span class="chip">Photograph to come</span></figcaption></figure>')
    panels.append(f'<div class="w-end"><p class="kicker">End of this wall</p><a href="{A.room_file(nxt["key"])}">Next: {E(nxt["name"])} <span aria-hidden="true">→</span></a></div>')
    main = f'''<section class="a-hero" aria-labelledby="r-title" data-stage-section="room-arrival">
  {room_art(r["key"])}
  {crumbs(A, r)}
  <p class="kicker">Room {r["num"]} of V</p>
  <h1 class="a-title" id="r-title">{E(r["name"])}</h1>
  <p class="a-line">{E(r["line"])}</p>
  <p class="a-desc">{E(r["desc"])}</p>
  <div class="a-meta">{swatches(r["swatches"], "Colours in this room, taken from its paintings")}<p>{count_text(r)}</p><a href="#walk">Walk along the wall <span aria-hidden="true">→</span></a></div>
</section>
{f'<p class="a-note">{E(r["note"])}</p>' if r["note"] else ""}
<section class="walk" id="walk" aria-label="The paintings in {E(r["name"])}" data-stage-section="room-wall">
  <div class="walk-sticky"><div class="track">{"".join(panels)}</div><div class="bar" aria-hidden="true"><i></i></div></div>
</section>
<a class="a-next rv" href="{A.room_file(nxt["key"])}" style="--wall:{a_wall(nxt["primary"])};{motif_vars(nxt["swatches"], .5)}" data-stage-section="next-room">{room_art(nxt["key"], seed=5)}
  <span class="in"><span class="kicker">Next room · Room {nxt["num"]}</span><b>{E(nxt["name"])}</b><span>{E(nxt["line"])}</span><span class="go">Enter</span></span></a>
{A.all_rooms(r["key"])}'''
    return A.page(A.room_file(r["key"]), f'{r["name"]} · Art by Ayesha Johar', f'{r["line"]} {r["desc"]}',
                  a_theme(r["primary"], r["swatches"][1], r["swatches"]), r["key"], main, A_CSS, A_JS)


def a_about():
    cols = [PALETTE[s]["colours"][0] for s in ("woodland", "dancing-trees", "skyline", "water")]
    t = a_theme(PALETTE["dancing-trees"]["colours"][0], PALETTE["water"]["colours"][0], cols)
    return A.page(A.about, "Who I am · Art by Ayesha Johar", "Ayesha Johar: painter, feminist and justice fighter, born in Mauritius, living in London.", t, "about", A.about_main(), A_CSS, overlay=False)


def a_collect():
    t = a_theme(PALETTE["stripes"]["colours"][0], PALETTE["dancing-trees"]["colours"][0], HOME_COLOURS)
    return A.page(A.collect, "Collect · Art by Ayesha Johar", "Original paintings, prints and commissions from Ayesha Johar.", t, "collect", A.collect_main(), A_CSS)


# ═══ B. COLOUR FIELD ═══════════════════════════════════════════════════════

B = Site("ayesha-johar-v3b", "https://fonts.googleapis.com/css2?family=Gloock&family=Lalezar&family=Outfit:wght@300;400;500;600;700&display=swap",
         "Prototype v3 B, Colour Field")
B_FONTS = {"display": "'Gloock',Georgia,serif", "body": "'Outfit',system-ui,sans-serif", "arabic": "'Lalezar',sans-serif"}


def field(colour):
    """A vivid field from a painting colour, with whichever text colour reads on it at 4.8:1 or better."""
    hh, _, s = hls(colour)
    s = max(s, .6)
    f = from_hls(hh, .44, s)
    for _ in range(40):
        t = text_on(f)
        if contrast(t, f) >= 4.8:
            return f, t
        f = from_hls(hh, hls(f)[1] + (-.02 if t == "#FFFFFF" else .02), s)
    return f, text_on(f)


def b_theme(colour, art_cols):
    f, t = field(colour)
    d = dict(bg=f, ink=t, soft=t, panel="#FFFFFF", accent=t, **B_FONTS)
    d["on-panel"], d["on-accent"] = "#16110E", f
    return tokens(d, art_cols)


B_CSS = TILES_CSS + '''
body{transition:background-color 1.2s ease,color 1.2s ease}
html.rm body{transition:none}
h1,h2,h3,.wordmark{font-family:var(--display);font-weight:400}
.room-art{opacity:.5}
.b-hero{position:relative;height:190vh}
.b-stage{position:sticky;top:0;height:100dvh;overflow:hidden}
.b-img{position:absolute;inset:0;clip-path:inset(calc(var(--p,0)*9vh) calc(var(--p,0)*7vw) round calc(var(--p,0)*28px))}
.b-img img{width:100%;height:100%;object-fit:cover}
.b-card{position:absolute;left:var(--gutter);bottom:clamp(24px,6vh,64px);max-width:min(640px,calc(100% - 2*var(--gutter)));background:var(--bg);color:var(--ink);padding:clamp(22px,3vw,40px);border-radius:24px;opacity:var(--o,1);transform:translateY(calc(var(--p,0)*-60px))}
.b-name{font-size:clamp(3rem,7.6vw,7rem);line-height:.9;margin:10px 0 14px}
.b-name span{font-family:var(--arabic);font-size:.5em;margin-left:.2em;vertical-align:middle}
.b-line{font-size:clamp(1.2rem,2.2vw,1.7rem);font-weight:500}
html.rm .b-card{opacity:1;transform:none}
.band{position:relative;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);align-items:center;gap:clamp(20px,4vw,64px);min-height:82vh;padding:clamp(48px,8vw,110px) var(--gutter);
  background:var(--f);color:var(--ft);text-decoration:none;overflow:hidden;isolation:isolate}
.band .room-art{opacity:.7;transition:transform 2s var(--ease)}
.band:hover .room-art{transform:scale(1.06)}
.band .num{font-family:var(--display);font-size:1.4rem}
.band h2{font-size:clamp(3.4rem,10vw,9rem);line-height:.86;margin:8px 0 14px}
.band p{font-size:1.2rem;max-width:30ch}
.band .go{display:inline-flex;margin-top:22px;font-weight:600;font-size:1.05rem;border-bottom:2px solid currentColor}
.band .pic{justify-self:center;width:min(100%,460px);transform:rotate(var(--rot,2deg));transition:transform 1s var(--ease)}
.band:hover .pic{transform:rotate(0) scale(1.03)}
.band .pic img{width:100%;border-radius:6px;box-shadow:0 50px 90px -30px rgba(0,0,0,.6)}
.band .pic .plate{aspect-ratio:4/5;border-radius:6px;background:rgba(255,255,255,.92);display:grid;place-items:center;box-shadow:0 50px 90px -30px rgba(0,0,0,.6)}
.band .pic .plate svg{width:72%}
@media (max-width:860px){.band{grid-template-columns:1fr;min-height:auto}.band .pic{width:min(80%,360px)}}
.say{padding:clamp(72px,10vw,140px) 0;overflow:hidden}
.say .mq{font-family:var(--display);font-size:clamp(3rem,9vw,8rem);line-height:1.15}
.say .mq-item i{font-style:normal;font-family:var(--arabic)}
.say blockquote{max-width:900px;margin:48px auto 0;padding:0 var(--gutter)}
.say blockquote p{font-family:var(--display);font-size:clamp(1.4rem,2.8vw,2.3rem);line-height:1.3}
.say cite{display:block;margin-top:16px;font-style:normal;font-weight:600}
.tile{border-radius:24px}
.ch-open{position:relative;height:190vh}
.ch-stage{position:sticky;top:0;height:100dvh;overflow:hidden;isolation:isolate;background:#120d0b}
.ch-img{position:absolute;inset:0;clip-path:inset(calc(var(--p,0)*11vh) calc(var(--p,0)*10vw) round calc(var(--p,0)*28px));background:#120d0b}
.ch-img img{width:100%;height:100%;object-fit:cover}
.ch-img .room-art{opacity:.95}
.ch-img::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.7),rgba(0,0,0,0) 55%)}
.ch-copy{position:absolute;left:0;right:0;bottom:clamp(40px,12vh,120px);padding:0 calc(var(--gutter) + 4vw);color:#fff;opacity:var(--o,1);transform:translateY(var(--y,0px))}
.ch-copy .kicker,.ch-copy .crumbs{color:#fff}
.ch-title{font-size:clamp(3.6rem,12vw,11rem);line-height:.86;margin:6px 0 12px}
.ch-line{font-size:clamp(1.3rem,2.6vw,2.1rem);font-weight:500}
html.rm .ch-copy{opacity:1;transform:none}
.intro{max-width:1100px;margin:0 auto;padding:clamp(56px,8vw,110px) var(--gutter) 24px}
.intro p.d{font-family:var(--display);font-size:clamp(1.5rem,3vw,2.4rem);line-height:1.25;margin:14px 0 22px}
.intro .meta{display:flex;flex-wrap:wrap;gap:16px 28px;align-items:center;font-weight:600}
.fld{position:relative;min-height:100vh;display:grid;grid-template-columns:minmax(0,7fr) minmax(0,4fr);gap:clamp(24px,5vw,80px);align-items:center;padding:clamp(56px,8vw,120px) var(--gutter);isolation:isolate;overflow:hidden}
.fld:nth-of-type(even){grid-template-columns:minmax(0,4fr) minmax(0,7fr)}
.fld:nth-of-type(even) .fr{order:2}
.fr{display:flex;justify-content:center;container-type:inline-size}
.fr button{display:flex;justify-content:center;width:100%}
.fr img.art{width:auto;max-width:100%;border-radius:6px;box-shadow:0 60px 100px -40px rgba(0,0,0,.65);transition:transform .9s var(--ease)}
.fr button:hover img{transform:scale(1.015)}
.fr .plate{width:min(100%,420px);aspect-ratio:4/5;border-radius:6px;background:rgba(255,255,255,.92);display:grid;place-items:center}
.fr .plate svg{width:72%}
.info{background:#fff;color:#16110E;border-radius:24px;padding:clamp(22px,3vw,36px);display:flex;flex-direction:column;gap:14px;align-items:flex-start;box-shadow:0 30px 60px -30px rgba(0,0,0,.4)}
.info .n{font-weight:600;letter-spacing:.1em}
.info h2{font-size:clamp(2.2rem,4vw,3.6rem);line-height:.95}
.info .btn{background:#16110E;color:#fff}
.info .btn-line{color:#16110E}
@media (max-width:900px){.fld,.fld:nth-of-type(even){grid-template-columns:1fr;min-height:auto}.fld:nth-of-type(even) .fr{order:0}}
.mq-foot [lang="ar"]{font-size:1.1em}
'''

B_JS = r'''
(() => {
const RM = window.AJ.RM, body = document.body;
const prog = el => { const r = el.getBoundingClientRect(), t = r.height - innerHeight; return t > 0 ? Math.min(1, Math.max(0, -r.top / t)) : 0; };
const hero = document.querySelector('.b-hero'), opens = [...document.querySelectorAll('.ch-open')];
function tick() {
  if (RM) return;
  if (hero) { const p = prog(hero); hero.style.setProperty('--p', p.toFixed(4)); hero.querySelector('.b-card').style.setProperty('--o', Math.max(0, 1 - p * 2.2).toFixed(3)); }
  opens.forEach(c => {
    const r = c.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    const q = prog(c); c.style.setProperty('--p', Math.min(1, q * 1.2).toFixed(4));
    const copy = c.querySelector('.ch-copy'); copy.style.setProperty('--o', Math.max(0, 1 - Math.max(0, q - .35) * 2.6).toFixed(3)); copy.style.setProperty('--y', (-q * 80).toFixed(1) + 'px');
  });
}
let raf = 0;
addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; tick(); }); }, { passive: true });
addEventListener('resize', tick); tick();
// the whole page, nav included, takes on the colour of the painting in front of you
const cs = getComputedStyle(body), start = [cs.getPropertyValue('--bg').trim(), cs.getPropertyValue('--ink').trim()];
const set = (bg, ink) => { ['--bg', '--on-accent'].forEach(v => body.style.setProperty(v, bg)); ['--ink', '--accent', '--soft'].forEach(v => body.style.setProperty(v, ink)); };
const fio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const d = e.target.dataset; d.f ? set(d.f, d.ft) : set(start[0], start[1]); } }), { rootMargin: '-50% 0px -50% 0px' });
document.querySelectorAll('[data-f], [data-reset]').forEach(s => fio.observe(s));
})();
'''

B_KEYS_HOME = {"sacred": None, "nature": "breeze", "world": "skyline", "witness": "earth", "love": None}
B_KEYS_ROOM = {"sacred": None, "nature": "water", "world": "tower", "witness": "earth", "love": None}


def b_band(r, key_slug, rot, label=None):
    f, ft = field(r["primary"])
    if key_slug:
        w = W[key_slug]
        pic = f'<img src="assets/art/{key_slug}-sm.webp" alt="" width="{w["w"]}" height="{w["h"]}" loading="lazy">'
    else:
        pic = f'<div class="plate" style="{motif_vars(r["swatches"])}">{plate_svg(r["todo"][0][1])}</div>'
    head = f'<span class="kicker">{E(label)}</span>' if label else f'<span class="num">{r["num"]}</span>'
    return (f'<a class="band" href="{B.room_file(r["key"])}" style="--f:{f};--ft:{ft};--rot:{rot}deg;{motif_vars(r["swatches"][1:] + r["swatches"][:1])}">{room_art(r["key"], seed=11)}'
            f'<span>{head}<h2>{E(r["name"])}</h2><p>{E(r["line"])}</p><span class="go">Enter the room</span></span>'
            f'<span class="pic" aria-hidden="true">{pic}</span></a>')


def b_home():
    t = b_theme(PALETTE["breeze"]["colours"][0], HOME_COLOURS)
    bands = "".join(b_band(r, B_KEYS_HOME[r["key"]], (2, -2)[i % 2]) for i, r in enumerate(ROOMS))
    main = f'''<section class="b-hero" aria-labelledby="h-name" data-stage-section="arrival" data-reset="1">
  <div class="b-stage">
    <div class="b-img"><img src="assets/art/breeze.webp" alt="{E(W["breeze"]["alt"])}" width="2000" height="985" fetchpriority="high"></div>
    <div class="b-card"><p class="kicker">Acrylic · London · Mauritius</p><h1 class="b-name" id="h-name">Ayesha Johar<span lang="ar">{ARABIC}</span></h1><p class="b-line">Beauty is a form of resistance.</p></div>
  </div>
</section>
<section id="rooms" aria-label="The rooms" data-stage-section="rooms">{bands}</section>
<section class="say" aria-label="On beauty" data-stage-section="on-beauty" data-reset="1">
  {marquee(f'Beauty is a form of resistance <i lang="ar">{ARABIC}</i>')}
  <blockquote class="rv"><p>Hidden colours and shapes exist everywhere, and once I expose them in my paintings, it forces us to see beauty in both the good and the bad.</p><cite>Ayesha Johar</cite></blockquote>
</section>
{tiles(B)}'''
    return B.page(B.home, "Art by Ayesha Johar", "Beauty is a form of resistance. Acrylic paintings by Ayesha Johar, hung in five rooms.", t, "home", main, B_CSS, B_JS)


def b_room(i):
    r, nxt = ROOMS[i], ROOMS[(i + 1) % len(ROOMS)]
    k = B_KEYS_ROOM[r["key"]]
    opener = f'<img src="assets/art/{k}.webp" alt="{E(W[k]["alt"])}">' if k else room_art(r["key"])
    n = len(r["works"]) + len(r["todo"])
    flds = ""
    for j, w in enumerate(r["works"]):
        cols = PALETTE[w["slug"]]["colours"]
        f, ft = field(cols[0])
        flds += f'''<section class="fld" data-f="{f}" data-ft="{ft}" aria-labelledby="t-{w["slug"]}" style="{motif_vars(cols[1:] + cols[:1])}">
  {room_art(r["key"], seed=20 + j)}
  <div class="fr rv"><button type="button" data-painting="{w["slug"]}" aria-label="Look closer at {E(w["title"])}">{art_img(w, cap="78vh")}</button></div>
  <div class="info rv"><p class="n">{j + 1:02d} / {n:02d}</p><h2 id="t-{w["slug"]}">{E(w["title"])}</h2>{status_chip(w)}<p>{PRICE_LINE[w["status"]]}</p>
    {swatches(cols, "Colours in " + w["title"])}{actions(B, w)}</div>
</section>'''
    for kk, (label, kind) in enumerate(r["todo"]):
        f, ft = field(r["swatches"][(kk + 1) % len(r["swatches"])])
        flds += f'''<section class="fld" data-f="{f}" data-ft="{ft}" aria-labelledby="t-todo-{kk}" style="{motif_vars(r["swatches"])}">
  {room_art(r["key"], seed=40 + kk)}
  <div class="fr rv"><div class="plate" role="img" aria-label="{E(label)}: photograph to come">{plate_svg(kind)}</div></div>
  <div class="info rv"><p class="n">{len(r["works"]) + kk + 1:02d} / {n:02d}</p><h2 id="t-todo-{kk}">{E(label)}</h2><span class="chip">Photograph to come</span><p>This painting will hang here once it has been photographed.</p></div>
</section>'''
    main = f'''<section aria-labelledby="r-title" data-stage-section="room-arrival" data-reset="1"><div class="ch-open"><div class="ch-stage">
  <div class="ch-img">{opener}</div>
  <div class="ch-copy">{crumbs(B, r)}<p class="kicker">Room {r["num"]} of V</p><h1 class="ch-title" id="r-title">{E(r["name"])}</h1><p class="ch-line">{E(r["line"])}</p></div>
</div></div></section>
<section class="intro" aria-label="About this room" data-reset="1"><p class="kicker">{E(r["name"])}</p><p class="d">{E(r["desc"])}</p>
  <div class="meta">{swatches(r["swatches"], "Colours in this room, taken from its paintings")}<span>{count_text(r)}</span></div>
  {f'<p style="margin-top:18px">{E(r["note"])}</p>' if r["note"] else ""}</section>
{flds}
<div data-reset="1" data-stage-section="next-room">{b_band(nxt, B_KEYS_HOME[nxt["key"]], 2, label=f"Next room · Room {nxt['num']}")}</div>
<div data-reset="1">{B.all_rooms(r["key"])}</div>'''
    return B.page(B.room_file(r["key"]), f'{r["name"]} · Art by Ayesha Johar', f'{r["line"]} {r["desc"]}', b_theme(r["primary"], r["swatches"]), r["key"], main, B_CSS, B_JS)


def b_about():
    t = b_theme(PALETTE["dancing-trees"]["colours"][0], HOME_COLOURS)
    return B.page(B.about, "Who I am · Art by Ayesha Johar", "Ayesha Johar: painter, feminist and justice fighter.", t, "about", B.about_main(), B_CSS, overlay=False)


def b_collect():
    t = b_theme(PALETTE["stripes"]["colours"][0], HOME_COLOURS)
    return B.page(B.collect, "Collect · Art by Ayesha Johar", "Original paintings, prints and commissions from Ayesha Johar.", t, "collect", B.collect_main(), B_CSS)


# ═══ C. HIDDEN COLOURS ═════════════════════════════════════════════════════

C = Site("ayesha-johar-v3c", "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Mirza:wght@400;700&display=swap",
         "Prototype v3 C, Hidden Colours")
C_FONTS = {"display": "'Instrument Serif',Georgia,serif", "body": "'Instrument Sans',system-ui,sans-serif", "arabic": "'Mirza',serif"}


def c_theme(colour, art_cols):
    veil = mix(colour, "#F3F1EE", .9)
    ink = "#1B1714"
    d = dict(bg=veil, ink=ink, soft=until("#5A524C", veil, 4.8), panel="#FFFFFF",
             accent=until(until(shade(colour, s=max(hls(colour)[2], .5)), "#FFFFFF", 5), veil, 4.8), **C_FONTS)
    d["on-panel"], d["on-accent"] = ink, "#FFFFFF"
    return tokens(d, art_cols)


C_CSS = TILES_CSS + '''
h1,h2,h3,.wordmark{font-family:var(--display);font-weight:400}
.wordmark{font-size:1.4rem}
em{font-style:italic}
.kicker{color:var(--soft)}
.wm-ar{color:var(--accent)}
.veil{filter:grayscale(var(--g,1)) brightness(calc(1 + var(--g,1) * .06))}
html.rm .veil{filter:none}
.c-hero{min-height:100dvh;display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:clamp(24px,5vw,80px);align-items:center;padding:110px var(--gutter) 64px}
.c-name{font-size:clamp(3.6rem,9vw,9rem);line-height:.88;margin:14px 0 22px}
.c-name em{display:block;color:var(--accent)}
.c-name .ar{font-family:var(--arabic);font-style:normal;font-size:.45em;margin-left:.15em}
.c-line{font-family:var(--display);font-style:italic;font-size:clamp(1.5rem,2.8vw,2.4rem)}
.c-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
.bloom{position:relative;margin:0}
.bloom a{display:block;position:relative}
.bloom img{width:100%;border-radius:4px}
.bloom .grey{filter:grayscale(1) brightness(1.05)}
.bloom .colour{position:absolute;inset:0;height:100%;clip-path:circle(0% at 46% 52%);transition:clip-path 3.4s cubic-bezier(.45,0,.2,1) .6s}
.bloom.open .colour{clip-path:circle(75% at 46% 52%)}
.bloom figcaption{margin-top:12px;font-size:.9rem;color:var(--soft)}
html.rm .bloom .colour{clip-path:none;transition:none}
.say{position:relative;height:220vh}
.say-stage{position:sticky;top:0;height:100dvh;display:flex;flex-direction:column;justify-content:center;max-width:1180px;margin:0 auto;padding:0 var(--gutter)}
.say p.words{font-family:var(--display);font-size:clamp(2rem,4.8vw,4.2rem);line-height:1.15}
.words .w{color:color-mix(in srgb,var(--ink) 16%,transparent);transition:color .5s ease}
.words .w.lit{color:var(--ink)}
.words .w.g.lit{color:var(--wc,var(--accent));font-style:italic}
html.rm .words .w{color:var(--ink)}
html.rm .words .w.g{color:var(--wc);font-style:italic}
.say .who{margin-top:24px;color:var(--soft)}
.windows-wrap{padding:clamp(56px,8vw,120px) var(--gutter)}
.sec-title{font-size:clamp(2.6rem,6vw,5.2rem);line-height:.95;margin:12px 0 14px}
.sec-intro{max-width:56ch;color:var(--soft);margin-bottom:44px}
.windows{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:clamp(14px,2vw,32px)}
.win{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;text-decoration:none}
.disc{position:relative;display:block;width:100%;aspect-ratio:1;border-radius:50%;overflow:hidden;isolation:isolate;background:var(--disc);box-shadow:0 30px 60px -30px rgba(0,0,0,.5);filter:grayscale(1);transition:filter 1.4s ease,transform 1s var(--ease)}
.disc .room-art{opacity:1}
.win:hover .disc,.win:focus-visible .disc,.win.lit .disc{filter:none;transform:scale(1.03)}
.win b{font-family:var(--display);font-size:clamp(1.5rem,2.2vw,2.1rem);font-weight:400;line-height:1}
.win small{color:var(--soft);font-size:.9rem}
@media (max-width:900px){.windows{grid-template-columns:repeat(2,minmax(0,1fr))}}
.tile h2 em{color:inherit}
.c-room{position:relative;height:170vh}
.c-room-stage{position:sticky;top:0;height:100dvh;overflow:hidden;isolation:isolate;display:flex;flex-direction:column;justify-content:flex-end;padding:110px var(--gutter) clamp(40px,8vh,90px)}
.c-room-stage .art-wrap{position:absolute;inset:0;z-index:-2}
.c-room-stage .room-art{opacity:.9}
.c-room-stage::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(to top,var(--bg) 8%,color-mix(in srgb,var(--bg) 55%,transparent) 48%,transparent 78%)}
.c-title{font-size:clamp(4rem,13vw,12rem);line-height:.86}
.c-title em{color:var(--accent)}
.c-room-line{font-family:var(--display);font-style:italic;font-size:clamp(1.5rem,3vw,2.5rem);margin:12px 0 8px}
.c-desc{max-width:52ch}
.c-meta{display:flex;flex-wrap:wrap;gap:16px 28px;align-items:center;margin-top:22px;font-weight:600}
.c-hint{font-size:.9rem;color:var(--soft);font-weight:500}
.c-note{max-width:60ch;margin:24px auto;padding:0 var(--gutter);text-align:center}
.cg{position:relative;height:250vh}
.cg-stage{position:sticky;top:0;height:100dvh;overflow:hidden}
.cg-title{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;width:min(560px,80vw);z-index:2}
.cg-title h2{font-size:clamp(2.4rem,5vw,4.4rem);line-height:.95}
.cg-title p{color:var(--soft);margin-top:10px}
.cg-item{position:absolute;left:var(--x);top:var(--t);width:var(--w);z-index:1;transform:translate3d(0,var(--ty,0px),0) scale(var(--s,1))}
.cg-item button{display:block;width:100%;box-shadow:0 26px 50px -30px rgba(0,0,0,.55)}
.cg-item img{width:100%}
.cg-item figcaption{background:#fff;padding:8px 10px;display:flex;flex-direction:column;gap:2px;font-size:.85rem}
.cg-item figcaption b{font-family:var(--display);font-weight:400;font-size:1.15rem}
.solo{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(24px,5vw,80px);align-items:center;padding:clamp(56px,8vw,120px) var(--gutter);max-width:1400px;margin:0 auto}
.solo .fr{display:flex;justify-content:center;container-type:inline-size}
.solo .fr button{display:flex;justify-content:center;width:100%}
.solo img.art{width:auto;max-width:100%;box-shadow:0 50px 90px -40px rgba(0,0,0,.6)}
.solo .plate{width:min(100%,420px);aspect-ratio:4/5;background:#fff;display:grid;place-items:center}
.solo .plate svg{width:70%}
.solo-info{display:flex;flex-direction:column;gap:14px;align-items:flex-start}
.solo-info h2{font-size:clamp(2.4rem,4.4vw,4rem);line-height:.95}
.lens-ring{position:fixed;width:190px;height:190px;border-radius:50%;pointer-events:none;z-index:150;border:2px solid #fff;box-shadow:0 12px 40px rgba(0,0,0,.35);background-repeat:no-repeat;opacity:0;transform:translate(-50%,-50%) scale(.85);transition:opacity .25s ease,transform .25s ease}
.lens-ring.on{opacity:1;transform:translate(-50%,-50%) scale(1)}
.c-next{display:grid;grid-template-columns:auto 1fr;gap:clamp(20px,4vw,56px);align-items:center;padding:clamp(56px,8vw,110px) var(--gutter);text-decoration:none;max-width:1200px;margin:0 auto}
.c-next .disc{width:min(36vw,340px)}
.c-next:hover .disc,.c-next:focus-visible .disc{filter:none}
.c-next b{display:block;font-family:var(--display);font-weight:400;font-size:clamp(3rem,8vw,7rem);line-height:.9;margin:8px 0}
@media (max-width:1023px){
  .c-hero{grid-template-columns:1fr;padding-top:96px}.bloom{order:-1}
  .say{height:auto;padding:96px 0}.say-stage{position:static;height:auto}
  .c-room{height:auto}.c-room-stage{position:relative;height:auto;min-height:88dvh}
  .cg{height:auto;padding:56px 0}.cg-stage{position:static;height:auto;overflow:visible;display:grid;grid-template-columns:1fr 1fr;gap:18px;padding:0 var(--gutter)}
  .cg-title{position:static;transform:none;grid-column:1/-1;text-align:left;width:auto;margin-bottom:8px}
  .cg-item{position:static;width:auto;transform:none}
  .solo{grid-template-columns:1fr}
}
@media (max-width:560px){.cg-stage{grid-template-columns:1fr}.c-next{grid-template-columns:1fr}.c-next .disc{width:70vw}}
.ab-hero h1 em,.big-ar,.sign{color:var(--accent)}
.mq-foot{font-family:var(--display);font-style:italic}
.mq-foot [lang="ar"]{color:var(--accent);font-style:normal}
'''

C_JS = r'''
(() => {
const RM = window.AJ.RM, desk = matchMedia('(min-width: 1024px)');
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = el => { const r = el.getBoundingClientRect(), t = r.height - innerHeight; return t > 0 ? clamp(-r.top / t) : clamp(1 - r.top / innerHeight); };
const bloom = document.querySelector('.bloom');
if (bloom) { addEventListener('load', () => bloom.classList.add('open')); setTimeout(() => bloom.classList.add('open'), 1200); }
const say = document.querySelector('.say'), words = say ? [...say.querySelectorAll('.w')] : [];
const rooms = [...document.querySelectorAll('.c-room')], gal = [...document.querySelectorAll('.cg')], solos = [...document.querySelectorAll('.solo')];
function tick() {
  if (RM) return;
  if (say) { const sp = desk.matches ? prog(say) : clamp((innerHeight * .85 - say.getBoundingClientRect().top) / (say.offsetHeight * .8)); const n = Math.round(sp * 1.15 * words.length); words.forEach((w, i) => w.classList.toggle('lit', i < n)); }
  rooms.forEach(r => { const p = desk.matches ? prog(r) : clamp(-r.getBoundingClientRect().top / (innerHeight * .5)); r.style.setProperty('--g', (1 - clamp(p * 1.7)).toFixed(3)); });
  gal.forEach(g => {
    const b = g.getBoundingClientRect(); if (b.bottom < -100 || b.top > innerHeight + 100) return;
    if (desk.matches) {
      const p = prog(g);
      g.querySelectorAll('.cg-item').forEach(it => { const k = +it.dataset.rate; it.style.setProperty('--s', (.84 + p * .18 * k).toFixed(4)); it.style.setProperty('--ty', ((.5 - p) * 70 * k).toFixed(1) + 'px'); it.style.setProperty('--g', (1 - clamp((p - .12) / .5 * k)).toFixed(3)); });
    } else g.querySelectorAll('.cg-item').forEach(it => it.style.setProperty('--g', (1 - clamp((innerHeight - it.getBoundingClientRect().top) / (innerHeight * .7))).toFixed(3)));
  });
  solos.forEach(s => s.style.setProperty('--g', (1 - clamp((innerHeight - s.getBoundingClientRect().top) / (innerHeight * .9))).toFixed(3)));
}
let raf = 0;
addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; tick(); }); }, { passive: true });
addEventListener('resize', tick); tick();
if (!matchMedia('(hover: hover)').matches) {
  const wio = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('lit', e.isIntersecting)), { rootMargin: '-35% 0px -35% 0px' });
  document.querySelectorAll('.win').forEach(w => wio.observe(w));
}
if (!RM && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const ring = document.createElement('div'); ring.className = 'lens-ring'; ring.setAttribute('aria-hidden', 'true'); document.body.appendChild(ring);
  const Z = 2.2;
  document.querySelectorAll('img.lens').forEach(im => {
    im.addEventListener('pointerenter', () => { ring.style.backgroundImage = 'url("' + (im.currentSrc || im.src) + '")'; ring.classList.add('on'); });
    im.addEventListener('pointerleave', () => ring.classList.remove('on'));
    im.addEventListener('pointermove', e => { const r = im.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px'; ring.style.backgroundSize = (r.width * Z) + 'px ' + (r.height * Z) + 'px'; ring.style.backgroundPosition = (95 - x * Z) + 'px ' + (95 - y * Z) + 'px'; });
  });
  addEventListener('scroll', () => ring.classList.remove('on'), { passive: true });
}
})();
'''

SLOTS = [(3, 14, 16, 1.0), (77, 13, 16, .7), (6, 58, 14, .85), (80, 56, 14, 1.15), (37, 70, 11, .6), (59, 12, 10, .9), (25, 12, 10, 1.2)]
STATEMENT = "Hidden colours and shapes exist everywhere. Once I expose them in my paintings, it forces us to see beauty in both the good and the bad."
LIT = {"hidden": 0, "colours": 1, "shapes": 2, "beauty": 3, "good": 0, "bad.": 2}


def disc(r):
    return f'<span class="disc" style="--disc:{mix(r["primary"], "#FFFFFF", .55)};{motif_vars(r["swatches"])}">{mini_art(r["key"])}</span>'


def c_home():
    t = c_theme(HOME_COLOURS[0], HOME_COLOURS)
    veil = mix(HOME_COLOURS[0], "#F3F1EE", .9)
    words = []
    for wd in STATEMENT.split(" "):
        g = LIT.get(wd.lower().strip(","))
        style = f' style="--wc:{until(HOME_COLOURS[g], veil, 4.8)}"' if g is not None else ""
        words.append(f'<span class="w{" g" if g is not None else ""}"{style}>{E(wd)}</span>')
    wins = "".join(f'<a class="win rv" href="{C.room_file(r["key"])}">{disc(r)}<small>Room {r["num"]}</small><b>{E(r["name"])}</b><small>{E(r["line"])}</small></a>' for r in ROOMS)
    main = f'''<section class="c-hero" aria-labelledby="h-name" data-stage-section="arrival">
  <div>
    <p class="kicker">Acrylic · London · Mauritius</p>
    <h1 class="c-name" id="h-name">Ayesha <em>Johar <span class="ar" lang="ar">{ARABIC}</span></em></h1>
    <p class="c-line">Beauty is a form of resistance.</p>
    <div class="c-cta"><a class="btn" href="#rooms">Choose a room</a><a class="btn-line" href="{C.collect}">Collect</a></div>
  </div>
  <figure class="bloom"><a href="{C.room_file("nature")}#/painting/dancing-trees" aria-label="Dancing Trees, in the Nature room">
    <img class="grey" src="assets/art/dancing-trees.webp" alt="" width="2000" height="1505" fetchpriority="high">
    <img class="colour" src="assets/art/dancing-trees.webp" alt="{E(W["dancing-trees"]["alt"])}" width="2000" height="1505"></a>
    <figcaption>Dancing Trees. Every painting here arrives quiet; its colour comes through as you look.</figcaption></figure>
</section>
<section class="say" aria-label="On beauty" data-stage-section="on-beauty"><div class="say-stage"><p class="kicker">On beauty</p><p class="words">{" ".join(words)}</p><p class="who">Ayesha Johar</p></div></section>
<section class="windows-wrap" id="rooms" aria-labelledby="rooms-title" data-stage-section="rooms">
  <p class="kicker rv">The rooms</p>
  <h2 class="sec-title rv" id="rooms-title">Five rooms. <em>Look in.</em></h2>
  <p class="sec-intro rv">Each room is drawn from the work inside it. Hover, or scroll, and its colours come through.</p>
  <div class="windows">{wins}</div>
</section>
{tiles(C)}'''
    return C.page(C.home, "Art by Ayesha Johar", "Beauty is a form of resistance. Acrylic paintings by Ayesha Johar, hung in five rooms.", t, "home", main, C_CSS, C_JS)


def c_room(i):
    r, nxt = ROOMS[i], ROOMS[(i + 1) % len(ROOMS)]
    ws, total = r["works"], len(r["works"]) + len(r["todo"])
    if len(ws) >= 3:
        items = "".join(
            f'<figure class="cg-item" style="--x:{SLOTS[j % 7][0]}%;--t:{SLOTS[j % 7][1]}%;--w:{SLOTS[j % 7][2]}vw" data-rate="{SLOTS[j % 7][3]}">'
            f'<button type="button" data-painting="{w["slug"]}" aria-label="Look closer at {E(w["title"])}">'
            f'<img class="lens veil" src="assets/art/{w["slug"]}-sm.webp" alt="{E(w["alt"])}" width="{w["w"]}" height="{w["h"]}" loading="lazy"></button>'
            f'<figcaption><b>{E(w["title"])}</b><span>{STATUS[w["status"]]}</span></figcaption></figure>' for j, w in enumerate(ws))
        body = (f'<section class="cg" aria-labelledby="g-title" data-stage-section="room-works"><div class="cg-stage">'
                f'<div class="cg-title"><p class="kicker">{E(count_text(r))}</p><h2 id="g-title">Colour waits <em>to be found.</em></h2>'
                f'<p>Scroll slowly. Hover over any painting to see it in full colour; open it to look closer.</p></div>{items}</div></section>')
    else:
        body = ""
        for j, w in enumerate(ws):
            body += f'''<section class="solo" aria-labelledby="t-{w["slug"]}" data-stage-section="room-works">
  <div class="fr"><button type="button" data-painting="{w["slug"]}" aria-label="Look closer at {E(w["title"])}">{art_img(w, cls="art lens veil", cap="78vh")}</button></div>
  <div class="solo-info rv"><p class="kicker">{j + 1:02d} / {total:02d}</p><h2 id="t-{w["slug"]}">{E(w["title"])}</h2>{status_chip(w)}<p>{PRICE_LINE[w["status"]]}</p>
    {swatches(PALETTE[w["slug"]]["colours"], "Colours in " + w["title"])}{actions(C, w)}</div></section>'''
        for kk, (label, kind) in enumerate(r["todo"]):
            body += f'''<section class="solo" aria-labelledby="t-todo-{kk}" style="{motif_vars(r["swatches"])}">
  <div class="fr"><div class="plate veil" role="img" aria-label="{E(label)}: photograph to come">{plate_svg(kind)}</div></div>
  <div class="solo-info rv"><p class="kicker">{len(ws) + kk + 1:02d} / {total:02d}</p><h2 id="t-todo-{kk}">{E(label)}</h2><span class="chip">Photograph to come</span><p>This painting will hang here once it has been photographed.</p></div></section>'''
    title = E(r["name"])
    if title.startswith("The "):
        title = "The <em>" + title[4:] + "</em>"
    main = f'''<section class="c-room" aria-labelledby="r-title" data-stage-section="room-arrival"><div class="c-room-stage">
  <div class="art-wrap veil">{room_art(r["key"])}</div>
  {crumbs(C, r)}
  <p class="kicker">Room {r["num"]} of V</p>
  <h1 class="c-title" id="r-title">{title}</h1>
  <p class="c-room-line">{E(r["line"])}</p>
  <p class="c-desc">{E(r["desc"])}</p>
  <div class="c-meta">{swatches(r["swatches"], "Colours in this room, taken from its paintings")}<span>{count_text(r)}</span><span class="c-hint">Scroll, and the room's colours come through.</span></div>
</div></section>
{f'<p class="c-note">{E(r["note"])}</p>' if r["note"] else ""}
{body}
<a class="c-next rv" href="{C.room_file(nxt["key"])}" data-stage-section="next-room">{disc(nxt)}
  <span><span class="kicker">Next room · Room {nxt["num"]}</span><b>{E(nxt["name"])}</b><span>{E(nxt["line"])}</span></span></a>
{C.all_rooms(r["key"])}'''
    return C.page(C.room_file(r["key"]), f'{r["name"]} · Art by Ayesha Johar', f'{r["line"]} {r["desc"]}', c_theme(r["primary"], r["swatches"]), r["key"], main, C_CSS, C_JS)


def c_about():
    t = c_theme(PALETTE["dancing-trees"]["colours"][0], HOME_COLOURS)
    return C.page(C.about, "Who I am · Art by Ayesha Johar", "Ayesha Johar: painter, feminist and justice fighter.", t, "about", C.about_main(), C_CSS, overlay=False)


def c_collect():
    t = c_theme(PALETTE["water"]["colours"][0], HOME_COLOURS)
    return C.page(C.collect, "Collect · Art by Ayesha Johar", "Original paintings, prints and commissions from Ayesha Johar.", t, "collect", C.collect_main(), C_CSS)


# ═══ INDEX (internal) ══════════════════════════════════════════════════════

def chooser():
    """The front door on Stage: client-facing, one card per direction."""
    opts = [  # in the order they were made: version 2 first, then A, B, C, D
        ("ayesha-johar-v2.html", "water", "Where we started", "Version 2",
         "The single-page version you have already seen, kept here so you can compare."),
        (A.home, "dancing-trees", "Direction A", "The Walk",
         "Each room is painted wall to wall in the colours of the paintings inside it, with its own mural behind the work. Your paintings hang under soft gallery light, and you walk along the wall from one to the next."),
        (B.home, "breeze", "Direction B", "Colour Field",
         "The boldest of the four. Every painting gets a full screen of its own colour, and the whole page changes colour as you move through a room."),
        (C.home, "stripes", "Direction C", "Hidden Colours",
         "Your idea made literal. Each room arrives quiet and grey, and its colours come through as you look. A lens shows any painting in full colour, up close."),
        ("ayesha-johar-v4.html", "tower", "Direction D", "Colour in Motion",
         "Soft colour drifts behind everything, taken from your paintings, and shifts with each painting you reach. Five doors open into the rooms."),
    ]
    cards = ""
    for href, art, k, n, d in opts:
        w = W[art]
        cards += (f'<li><a href="{href}"><span class="pic"><img src="assets/art/{art}-sm.webp" alt="" width="{w["w"]}" height="{w["h"]}" loading="lazy"></span>'
                  f'<span class="k">{E(k)}</span><b>{E(n)}</b><span class="d">{E(d)}</span><span class="go">Open {E(n)}</span></a></li>')
    return f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Website directions · Art by Ayesha Johar</title>
<meta name="description" content="Four directions for the Art by Ayesha Johar website, to explore and choose between.">
<!-- Directions page (Stage front door). Generated by build-v3.py. Do not edit by hand. -->
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>*{{box-sizing:border-box;margin:0;padding:0}}body{{font-family:'Instrument Sans',system-ui,sans-serif;font-size:17px;line-height:1.6;background:#F4F0EA;color:#1B1714}}
main{{max-width:1320px;margin:0 auto;padding:clamp(40px,7vw,96px) clamp(16px,4vw,56px)}}
.kick{{font-size:.8rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#5A524C}}
h1{{font-family:'Instrument Serif',Georgia,serif;font-weight:400;font-size:clamp(2.8rem,7vw,5.6rem);line-height:.95;margin:14px 0 20px}}h1 em{{color:#B4441B}}
.lead p{{max-width:62ch;margin-bottom:12px}}
ul{{list-style:none;display:grid;gap:20px;margin-top:44px}}
li a{{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);grid-template-rows:1fr auto auto 1fr auto;column-gap:clamp(20px,3.5vw,48px);row-gap:8px;padding-right:clamp(20px,3.5vw,48px);background:#fff;border-radius:18px;overflow:hidden;text-decoration:none;color:inherit;box-shadow:0 20px 40px -28px rgba(0,0,0,.45);transition:transform .5s cubic-bezier(.16,1,.3,1)}}
li a:hover,li a:focus-visible{{transform:translateY(-6px)}}a:focus-visible{{outline:3px solid #1B1714;outline-offset:3px}}
.pic{{grid-column:1;grid-row:1/-1;position:relative;min-height:260px}}li img{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.k{{grid-column:2;grid-row:2;padding-top:24px;font-size:.78rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#8A3A16}}
li b{{grid-column:2;grid-row:3;font-family:'Instrument Serif',Georgia,serif;font-weight:400;font-size:clamp(2rem,3.4vw,2.6rem);line-height:1}}
.d{{grid-column:2;grid-row:4;max-width:60ch}}.go{{grid-column:2;grid-row:5;margin:6px 0 24px;font-weight:700;border-bottom:2px solid currentColor;justify-self:start}}
@media (max-width:640px){{li a{{grid-template-columns:1fr;grid-template-rows:none;padding:0}}.pic{{grid-row:auto;min-height:0;aspect-ratio:16/9}}.k,li b,.d,.go{{grid-column:1;grid-row:auto;padding-left:20px;padding-right:20px}}.k{{padding-top:12px}}.go{{margin:6px 20px 20px;padding:0}}}}
.same{{margin-top:56px;max-width:70ch}}.same h2{{font-family:'Instrument Serif',Georgia,serif;font-weight:400;font-size:2rem;margin-bottom:10px}}.same li{{margin:0 0 8px 20px;list-style:disc}}.same ul{{display:block;margin:0}}</style></head>
<body><main>
<section class="lead" data-stage-section="intro"><p class="kick">Art by Ayesha Johar · Website directions · October 2026</p>
<h1>Five ways into <em>your work.</em></h1>
<p>These directions are built on everything you told us: the site should feel calm, original and easy to relate to; colourful, elegant, sophisticated and approachable; and it should help you sell your work and be seen.</p>
<p>Each one is a full website: a home page, a room for each of your five bodies of work, Who I am, and Collect. Open each one, walk through the rooms, and tell us which feels most like you. Mixing is welcome too: "the rooms from one with the colours of another" is a perfectly good answer.</p></section>
<ul data-stage-section="directions">{cards}</ul>
<section class="same" data-stage-section="same-in-all"><h2>The same in every direction</h2><ul>
<li>Every colour on the page is taken from your paintings.</li>
<li>Your five bodies of work each have their own room: The Sacred, Nature, World, Witness and Love.</li>
<li>Every painting opens to its own page, with its status, price and a way to ask about it or buy a print.</li>
<li>Collect is always one click away: originals, prints on Etsy, commissions, and a sign-up for new work.</li>
<li>Painting titles are our working titles, and The Sacred and Love show where your photographs will go.</li>
</ul></section>
</main></body></html>
'''


if __name__ == "__main__":
    outs = {"ayesha-johar-v3-choose.html": chooser()}
    for site, home, room, about, collect in ((A, a_home, a_room, a_about, a_collect), (B, b_home, b_room, b_about, b_collect), (C, c_home, c_room, c_about, c_collect)):
        outs[site.home], outs[site.about], outs[site.collect] = home(), about(), collect()
        for i, r in enumerate(ROOMS):
            outs[site.room_file(r["key"])] = room(i)
    for name, text in outs.items():
        if chr(0x2014) in text:
            raise SystemExit(f"{name}: em dash found")
        with open(os.path.join(HERE, name), "w", encoding="utf-8") as f:
            f.write(text)
    for old in ("ayesha-johar-v3-a.html", "ayesha-johar-v3-b.html", "ayesha-johar-v3-c.html"):
        if os.path.exists(os.path.join(HERE, old)):
            os.remove(os.path.join(HERE, old))
    print(f"wrote {len(outs)} pages")
