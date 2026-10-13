#!/usr/bin/env python3
"""MSS v6 site prototype: build plan step 11.

    python3 build-site.py

Writes one HTML file per page beside this script and copies the clips, posters and
portrait into assets/. Copy source of record: 01_mss/strategy/mss-website-copy-v4.md.
Look: direction A (01_mss/brand/mss-v6-specimen.html, mss-v6-tokens.css).
Edit this script, not the HTML. Publish with stage-publish.py.

Stage rules followed: no page-switcher nav (Stage injects its own pill), and
data-stage-section on every top-level section from the first draft.
"""
import os, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
MSS = os.path.dirname(os.path.dirname(HERE))
FOUNDER = os.path.join(MSS, 'brand/founder/osman-mono-4x5-soft.webp')  # grade-portrait.py

# ── assets ────────────────────────────────────────────────────────────────────
# Stills only for now (12 Oct): the clips come back once they are properly made (media-plan.md).
# assets/still-*.webp are written by make-stills.sh from the tool recordings and the Sable files (flat, as Stage needs).
A = os.path.join(HERE, 'assets')
os.makedirs(A, exist_ok=True)
if not os.path.exists(os.path.join(A, 'still-website-edit.webp')):
    raise SystemExit('stills missing: run bash make-stills.sh first')
shutil.copy(FOUNDER, os.path.join(A, 'os-akhtar-mono-4x5-oct26c.webp'))
# the cue films (tools/clips/cue, rendered into out-v6): copied in with their posters
CLIPS = os.path.join(MSS, 'website/tools/clips/out-v6')
FILMS = {
    'identity': ('identity-cue', "Sable's identity, spread by spread: the idea, the name, the colour, the type, the light", 'Sable · self-initiated'),
    'website': ('website-cue', 'A typo on a Sunday night, fixed in Stage', 'Live editing in Stage · Vera demo site'),
    'content': ('content-cue', 'Content Studio plans and drafts a real week of posts', 'Content Studio · PureMed Aesthetics'),
    'platform': ('platform-cue', 'Four old sources become one record, then a batch recall in one search', 'Old records brought in, one record, a recall · Vera demo, fictional patients'),
    'ayesha': ('ayesha-cue', "Ayesha's brand, from her own work: her paintings, five bodies of work, her name, her line, colour sampled from a canvas, the five directions she is choosing between", 'Art by Ayesha Johar · in review'),
    'campaign': ('campaign-cue', 'One sign-up, the real follow-up series, stopped by a booking', 'Guide and follow-up series · Vera demo, days compressed for filming'),
}
for _f, _a, _c in FILMS.values():
    for _ext in ('mp4', 'webm', 'webp'):
        shutil.copy(os.path.join(CLIPS, f'{_f}.{_ext}'), os.path.join(A, f'{_f}.{_ext}'))

# ── shared pieces ─────────────────────────────────────────────────────────────
SPIKE = ('<svg class="spike" viewBox="0 0 40 40" fill="none" aria-hidden="true">'
         '<path d="M5 17V5H17" stroke="currentColor" stroke-width="5" stroke-linecap="square"/>'
         '<path d="M35 23V35H23" stroke="currentColor" stroke-width="5" stroke-linecap="square"/></svg>')
ARROW = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6"/></svg>'

CSS = """
:root{--black:#12110F;--riser:#1F1D1A;--riser2:#26231F;--line:#2E2B27;--house:#F3F1EC;--rig:#8C8981;--rig-deep:#5E5B55;
  --tung:#FFB21A;--tung-hover:#FFC54D;--red:#E5402A;--ok:#9BD48A;
  --display:"Archivo",system-ui,sans-serif;--mono:"Geist Mono",ui-monospace,Menlo,monospace;
  --gutter:clamp(16px,4vw,56px);--max:1280px;--ease:cubic-bezier(.2,.7,.2,1)}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
body{background:var(--black);color:var(--house);font-family:var(--display);font-size:17px;line-height:1.55;font-variation-settings:"wdth" 100;overflow-x:hidden}
a{color:inherit}
img,video{display:block;max-width:100%}
:focus-visible{outline:2px solid var(--tung);outline-offset:3px}
.wrap{max-width:var(--max);margin:0 auto;padding:0 var(--gutter)}
.label{font-family:var(--mono);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--rig)}
.mono{font-family:var(--mono);font-size:13px;letter-spacing:.02em}
.d1{font-family:var(--display);font-variation-settings:"wdth" 125;font-weight:900;font-size:clamp(56px,11vw,168px);line-height:.88;letter-spacing:-.035em}
.d2{font-family:var(--display);font-variation-settings:"wdth" 125;font-weight:800;font-size:clamp(34px,5.4vw,72px);line-height:.94;letter-spacing:-.02em}
.d3{font-family:var(--display);font-variation-settings:"wdth" 112;font-weight:700;font-size:clamp(22px,2.4vw,28px);line-height:1.15}
.lede{font-size:clamp(18px,2vw,22px);max-width:40ch}
.muted{color:var(--rig)}
.body{max-width:62ch}
.body p+p{margin-top:1em}
section{padding:clamp(64px,9vw,128px) 0;border-top:1px solid var(--line)}
.head{display:grid;gap:18px;margin-bottom:clamp(32px,5vw,64px)}
@media(min-width:900px){.head{grid-template-columns:200px minmax(0,1fr)}}
.head .lede{margin-top:16px;color:var(--rig)}
/* header and footer */
.top{position:sticky;top:0;z-index:20;background:var(--black);border-bottom:1px solid var(--line)}
.top .wrap{display:flex;align-items:center;justify-content:space-between;height:64px;gap:16px}
.lockup{display:flex;align-items:center;gap:12px;text-decoration:none;min-height:44px;color:var(--house)}
.lockup .spike{width:28px;height:28px;color:var(--tung);flex:none}
.wm{font-family:var(--display);font-variation-settings:"wdth" 125;font-weight:800;font-size:17px;letter-spacing:-.01em;white-space:nowrap}
.wm small{font-family:var(--mono);font-weight:400;font-size:12px;letter-spacing:.24em;color:var(--rig);margin-left:8px}
@media(max-width:420px){.wm small{display:none}}
footer{border-top:1px solid var(--line);padding:clamp(56px,8vw,96px) 0 40px}
footer .grid{display:grid;gap:32px}
@media(min-width:900px){footer .grid{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);align-items:end}}
.flinks{margin-left:-6px;list-style:none;display:flex;flex-wrap:wrap;gap:4px 12px;font-family:var(--mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase}
.flinks a{color:var(--rig);text-decoration:none;min-height:44px;min-width:44px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center}
.flinks a:hover{color:var(--house)}
.inline-link{display:inline-block;padding:12px 0;margin:-12px 0}
footer .small{margin-top:40px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px}
/* buttons */
.ctas{display:flex;flex-wrap:wrap;gap:12px}
/* CTAs (12 Oct): the fill wipes in from the left, the arrow takes a bow (out right, back in left),
   the Spike tape snaps in at two corners like the hero mark, and the press sinks. */
.btn{--fill:rgba(243,241,236,.07);--tape:var(--tung);position:relative;display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 22px;font-family:var(--mono);font-size:13px;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;border:1px solid var(--line);color:var(--house);background-color:transparent;cursor:pointer;
  background-image:radial-gradient(var(--gr) circle at var(--mx,50%) var(--my,50%),var(--glow),transparent),linear-gradient(var(--fill),var(--fill));background-repeat:no-repeat;background-size:100% 100%,0% 100%;background-position:0 0,left top;
  transition:border-color .25s var(--ease),background-color .25s var(--ease),background-size .45s var(--ease),transform .18s var(--ease),--gr .4s var(--ease)}
.btn::before,.btn::after{content:"";position:absolute;width:9px;height:9px;border:0 solid var(--tape);opacity:0;pointer-events:none;transition:opacity .2s var(--ease),transform .4s cubic-bezier(.3,1.5,.5,1)}
.btn::before{top:-6px;left:-6px;border-top-width:2px;border-left-width:2px;transform:translate(-6px,-6px)}
.btn::after{bottom:-6px;right:-6px;border-bottom-width:2px;border-right-width:2px;transform:translate(6px,6px)}
.btn:hover,.btn:focus-visible{border-color:var(--house);background-size:100% 100%,100% 100%}
.btn:hover::before,.btn:hover::after,.btn:focus-visible::before,.btn:focus-visible::after{opacity:1;transform:none}
.btn:active{transform:scale(.97)}
.btn.primary{--fill:var(--tung-hover);background-color:var(--tung);border-color:var(--tung);color:var(--black);font-weight:500}
.btn.primary:hover{border-color:var(--tung-hover)}
.btn svg{width:14px;height:14px;flex:none}
.btn:hover svg,.btn:focus-visible svg{animation:bow .5s var(--ease)}
@keyframes bow{0%{transform:none;opacity:1}45%{transform:translateX(12px);opacity:0}46%{transform:translateX(-12px);opacity:0}100%{transform:none;opacity:1}}
/* the beam, scaled down: a Tungsten light that follows the pointer across anything you can press */
@property --gr{syntax:"<length>";inherits:false;initial-value:0px}
:root{--glow:rgba(255,178,26,.20)}
.glow{background-image:radial-gradient(var(--gr) circle at var(--mx,50%) var(--my,50%),var(--glow),transparent);background-repeat:no-repeat;transition:--gr .4s var(--ease),background-color .3s var(--ease)}
.glow.lit,.btn.lit{--gr:180px}
.btn.primary{--glow:rgba(255,255,255,.45)}
.light{--glow:rgba(255,178,26,.30)}
/* cursor: arrow over reading text, hand over anything you can press. (Stage's prototype mode had
   its own I-beam over text; fixed in Stage itself, patch 2026-10-12-preview-cursor.) */
body{cursor:default}
a,button,summary,label,select,[role=button]{cursor:pointer}
input,textarea{cursor:text}
.top .btn{min-height:44px;padding:0 16px;font-size:12px}
/* nav */
.top-right{display:flex;align-items:center;gap:8px}
.top .start-btn{display:none}
@media(min-width:520px){.top .start-btn{display:inline-flex}}
.nav{display:none;list-style:none;align-items:center;gap:2px;font-family:var(--mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase}
@media(min-width:1000px){.nav{display:flex}}
.nav a,.nav summary{display:inline-flex;align-items:center;min-height:44px;padding:0 12px;color:var(--rig);text-decoration:none;cursor:pointer;transition:color .2s var(--ease)}
.nav a:hover,.nav summary:hover,.nav a[aria-current="page"],.nav details[open] summary{color:var(--house)}
.nav details{position:relative}
.nav summary{list-style:none}
.nav summary::-webkit-details-marker,.mnav summary::-webkit-details-marker{display:none}
.nav summary::after{content:"";width:6px;height:6px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg);margin:-4px 0 0 10px}
.nav .menu{position:absolute;top:calc(100% + 10px);left:0;min-width:260px;list-style:none;background:var(--riser);border:1px solid var(--line);padding:8px 0;z-index:30}
.nav .menu a{display:flex;justify-content:space-between;gap:16px;width:100%;padding:0 16px;color:var(--house)}
.nav .menu a:hover{background-color:var(--riser2)}
.nav .menu a span{color:var(--rig)}
.mnav summary{list-style:none}
@media(min-width:1000px){.mnav{display:none}}
.mnav .sheet-m{position:fixed;left:0;right:0;top:64px;bottom:0;background:var(--black);overflow-y:auto;padding:8px var(--gutter) 120px;border-top:1px solid var(--line);z-index:30}
.mnav .sheet-m .label{display:block;margin-top:28px;margin-bottom:4px}
.mnav .sheet-m a{display:flex;align-items:center;min-height:52px;border-bottom:1px solid var(--line);font-family:var(--display);font-variation-settings:"wdth" 112;font-weight:700;font-size:22px;text-decoration:none}
.mnav .sheet-m a[aria-current="page"]{color:var(--tung)}
.mnav .sheet-m .btn{margin-top:28px;font-family:var(--mono);font-size:13px;font-weight:500}
/* hero */
.hero{position:relative;min-height:calc(100dvh - 64px);display:flex;align-items:flex-end;border-top:0;overflow:hidden;isolation:isolate}
.hero h1{font-size:clamp(64px,15vw,232px)}
/* the beam: lighting, not a background (brand rule exception, hero only) */
.beam-pos{position:absolute;left:0;top:0;width:0;height:0;z-index:-1;pointer-events:none;transform:translate3d(62vw,40vh,0);transition:transform 1.5s cubic-bezier(.45,0,.2,1)}
.beam-pos.follow{transition:transform .9s var(--ease)}
.beam{--bw:min(96vw,1200px);--bh:min(120vh,1300px);position:absolute;width:var(--bw);height:var(--bh);left:calc(var(--bw) / -2);top:calc(var(--bh) / -2);
  background:radial-gradient(closest-side,rgba(255,178,26,.20),rgba(255,178,26,.07) 48%,transparent);transition:opacity 1.1s var(--ease)}
.beam.drift{animation:drift 16s ease-in-out infinite alternate}
@keyframes drift{0%{transform:translate3d(0,0,0)}33%{transform:translate3d(-7vw,4vh,0)}66%{transform:translate3d(5vw,-5vh,0)}100%{transform:translate3d(-3vw,6vh,0)}}
.hero .marked::before{transform-origin:top left}.hero .marked::after{transform-origin:bottom right}
.hero .marked::before,.hero .marked::after{transition:opacity .3s var(--ease),transform .45s cubic-bezier(.3,1.5,.5,1)}
.lights-pre .hero .marked::before,.lights-pre .hero .marked::after{opacity:0;transform:scale(2.4)}
.hero .sub{display:grid;gap:28px;margin-top:clamp(28px,4vw,48px);align-items:end}
@media(min-width:900px){.hero .sub{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr)}}
.marked{position:relative;display:inline-block;padding:0 .06em}
.marked::before,.marked::after{content:"";position:absolute;width:.22em;height:.22em;border:0 solid var(--tung)}
.marked::before{top:-.04em;left:-.04em;border-top-width:.055em;border-left-width:.055em}
.marked::after{bottom:-.02em;right:-.04em;border-bottom-width:.055em;border-right-width:.055em}
/* spike frame for media */
.framed{position:relative}
.framed::before,.framed::after{content:"";position:absolute;width:22px;height:22px;border:0 solid var(--tung);pointer-events:none;z-index:2;transition:transform .5s var(--ease)}
.framed::before{top:-8px;left:-8px;border-top-width:4px;border-left-width:4px}
.framed::after{bottom:-8px;right:-8px;border-bottom-width:4px;border-right-width:4px}
.framed.quiet::before,.framed.quiet::after{border-color:var(--rig)}
/* media */
.clip{position:relative;background:var(--riser);border:1px solid var(--line);aspect-ratio:16/10;overflow:hidden}
.clip img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top left;opacity:0;transform:scale(1.03);transition:opacity .6s var(--ease),transform 1.2s var(--ease)}
.clip img.on{opacity:1;transform:none}
.g-thumbs{display:flex;gap:8px}
.g-thumbs button{position:relative;width:72px;aspect-ratio:16/10;padding:0;border:1px solid var(--line);background:var(--riser);overflow:hidden;opacity:.55;transition:opacity .25s var(--ease),border-color .25s var(--ease),transform .18s var(--ease)}
.g-thumbs button::after{content:"";position:absolute;inset:-10px}
.g-thumbs button img{width:100%;height:100%;object-fit:cover;object-position:top left}
.g-thumbs button:hover,.g-thumbs button[aria-pressed="true"]{opacity:1;border-color:var(--tung)}
.g-thumbs button:active{transform:scale(.95)}
.light .g-thumbs button{border-color:#DAD6CE;background:#EAE7E0}
.light .g-thumbs button:hover,.light .g-thumbs button[aria-pressed="true"]{border-color:var(--black)}
.cliprow{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;margin-top:18px}
.panel{background:var(--riser);border:1px solid var(--line);padding:clamp(24px,3vw,40px);display:grid;gap:14px;align-content:start}
.panel ol{list-style:none;display:grid;gap:0}
.panel li{display:grid;grid-template-columns:40px minmax(0,1fr);gap:12px;padding:14px 0;border-top:1px solid var(--line)}
.panel li:first-child{border-top:0}
.panel li span:first-child{font-family:var(--mono);font-size:12px;color:var(--rig);padding-top:3px}
/* lineup */
.lineup{border-top:1px solid var(--line)}
.row{display:grid;grid-template-columns:minmax(0,1fr);gap:16px;padding:24px 0;border-bottom:1px solid var(--line);text-decoration:none;transition:background-color .3s var(--ease)}
.row:hover{background-color:#171613}
@media(min-width:900px){.row{grid-template-columns:200px minmax(0,1.4fr) minmax(0,1fr) 140px 24px;align-items:center;gap:28px;padding:20px 12px}}
.row .thumb{aspect-ratio:16/10;background:var(--riser);border:1px solid var(--line);overflow:hidden;display:flex;align-items:center;justify-content:center}
.row .thumb img{width:100%;height:100%;object-fit:cover;object-position:top left;transition:transform .8s var(--ease)}
.row:hover .thumb img{transform:scale(1.05)}
.spot-thumb .sheet,.row .thumb .sheet{width:100%;height:100%;padding:12px 14px;display:grid;align-content:center;gap:4px;font-family:var(--mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--rig)}
.spot-thumb .sheet i,.row .thumb .sheet i{font-style:normal;color:var(--house)}
.row h3{font-family:var(--display);font-variation-settings:"wdth" 125;font-weight:800;font-size:clamp(28px,3vw,40px);line-height:1;letter-spacing:-.02em}
.row p{color:var(--rig);margin-top:6px;max-width:40ch}
.row .go svg{width:20px;height:20px}
@media(max-width:899px){.row .thumb .sheet span:nth-child(n+4){display:none}.row{grid-template-columns:120px minmax(0,1fr);gap:8px 16px;align-items:start}.row .thumb{grid-row:span 3}.row h3{font-size:26px}.row .go{display:none}}
.asides{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);margin-top:40px}
@media(min-width:900px){.asides{grid-template-columns:1fr 1fr}}
.asides>div{background:var(--black);padding:24px;display:grid;gap:12px;align-content:start}
/* prices */
.p{display:inline-flex;flex-wrap:wrap;align-items:baseline;gap:6px 10px;font-family:var(--mono)}
.p b{font-family:var(--display);font-variation-settings:"wdth" 125;font-weight:800;font-size:22px;letter-spacing:-.01em;font-variant-numeric:tabular-nums;color:var(--house)}
.p s{font-size:13px;color:var(--rig)}
.p small{font-size:12px;color:var(--rig)}
.p.big b{font-size:clamp(48px,7vw,96px);line-height:.9}
.p.big s{font-size:16px}
.founding-note{margin-top:20px}
/* proof, badges */
.badge{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:12px;letter-spacing:.1em;text-transform:uppercase;padding:4px 8px;border:1px solid currentColor}
.badge.live{color:var(--ok)}.badge.prog{color:var(--tung)}.badge.self,.badge.demo{color:var(--rig)}
.badge.live::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--red)}
.proofs{display:grid;gap:1px;background:var(--line);border:1px solid var(--line)}
@media(min-width:900px){.proofs.pair{grid-template-columns:1fr 1fr}}
.proofs>div{background:var(--black);padding:clamp(22px,3vw,36px);display:grid;gap:14px;align-content:start}
/* lists */
.ticks{list-style:none;display:grid;gap:0;border-top:1px solid var(--line)}
.ticks li{display:grid;grid-template-columns:22px minmax(0,1fr);gap:14px;padding:16px 0;border-bottom:1px solid var(--line);font-size:18px}
.ticks li::before{content:"";width:10px;height:10px;margin-top:9px;border-top:2px solid var(--tung);border-left:2px solid var(--tung)}
.split{display:grid;gap:clamp(32px,5vw,64px)}
@media(min-width:900px){.split{grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start}}
section.first{border-top:0}
section[id]{scroll-margin-top:64px}
@media(min-width:900px){.split.wide-left{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}.split.lead{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr)}}
/* cues */
.cues{display:grid;gap:1px;background:var(--line);border:1px solid var(--line)}
@media(min-width:760px){.cues{grid-template-columns:repeat(5,minmax(0,1fr))}}
.cue{background:var(--black);padding:24px 20px;display:flex;flex-direction:column;gap:10px}
@media(min-width:760px){.cue{min-height:180px}}
.cue b{font-family:var(--display);font-variation-settings:"wdth" 112;font-weight:700;font-size:19px;line-height:1.2}
.cue p{color:var(--rig);font-size:15px}
.cue p.cue-line{color:var(--house)}
.steps{display:grid;gap:0;border-top:1px solid var(--line)}
.step{display:grid;gap:24px;padding:clamp(32px,5vw,56px) 0;border-bottom:1px solid var(--line)}
@media(min-width:900px){.step{grid-template-columns:200px minmax(0,1fr) minmax(0,1fr);align-items:start}}
.step h3{margin-bottom:10px}
/* faq */
.faq{border-top:1px solid var(--line)}
.qlabel{padding-top:24px}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:16px;align-items:center;min-height:64px;padding:16px 0;font-family:var(--display);font-variation-settings:"wdth" 112;font-weight:700;font-size:20px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";font-family:var(--mono);font-weight:400;color:var(--rig);transition:transform .3s var(--ease)}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq details p{padding:0 0 22px;color:var(--rig);max-width:62ch}
/* tables */
.table{width:100%;border-collapse:collapse;font-family:var(--mono);font-size:14px}
.table th{text-align:left;font-weight:400;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--rig);padding:12px 12px 12px 0;border-bottom:1px solid var(--line)}
.table td{padding:18px 12px 18px 0;border-bottom:1px solid var(--line);vertical-align:baseline}
.table td:first-child{font-family:var(--display);font-variation-settings:"wdth" 112;font-weight:700;font-size:18px}
.table td.f{font-family:var(--display);font-variation-settings:"wdth" 125;font-weight:800;font-size:22px}
.table td.t s{color:var(--rig)}
.table .u{color:var(--rig)}
@media(max-width:700px){.table thead{display:none}.table tr{display:grid;grid-template-columns:1fr auto auto;gap:4px 16px;padding:16px 0;border-bottom:1px solid var(--line)}
 .table td{border:0;padding:0}.table td:first-child{grid-column:1/-1}.table td.u{grid-column:1/2}}
/* work */
.filters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
.chip{min-height:44px;padding:0 16px;font-family:var(--mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;border:1px solid var(--line);background:transparent;color:var(--rig);cursor:pointer}
.chip[aria-pressed="true"]{border-color:var(--house);color:var(--house)}
.cards{display:grid;gap:1px;background:var(--line);border:1px solid var(--line)}
@media(min-width:760px){.cards{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(min-width:1100px){.cards{grid-template-columns:repeat(3,minmax(0,1fr))}}
.wcard{background:var(--black);display:flex;flex-direction:column;text-decoration:none}
a.wcard:hover{background-color:#171613}
.wthumb{aspect-ratio:16/10;overflow:hidden;background:var(--riser);border-bottom:1px solid var(--line)}
.wthumb img{width:100%;height:100%;object-fit:cover;object-position:top left;transition:transform .8s var(--ease)}
.wcard:hover .wthumb img{transform:scale(1.04)}
.wbody{padding:24px 28px 28px;display:flex;flex-direction:column;gap:12px;flex:1}
.wgo{margin-top:auto;padding-top:8px;display:inline-flex;align-items:center;gap:8px;color:var(--house)}
.wgo svg{width:14px;height:14px;transition:transform .35s var(--ease)}
.wcard:hover .wgo svg{transform:translateX(4px)}
.wcard h3{font-family:var(--display);font-variation-settings:"wdth" 112;font-weight:700;font-size:24px;line-height:1.15}
.wcard .prods{margin-top:2px}
.wcard[hidden]{display:none}
/* light surface (case study) */
.light{background:var(--house);color:var(--black)}
.light .muted,.light .label{color:var(--rig-deep)}
.light .badge.live{color:#2F6B24}
.light .ticks{border-top-color:#DAD6CE}.light .ticks li{border-bottom-color:#DAD6CE}
.light .ticks li::before{border-color:var(--black)}
.receipts{display:grid;gap:1px;background:#DAD6CE;border:1px solid #DAD6CE}
@media(min-width:760px){.receipts{grid-template-columns:repeat(3,minmax(0,1fr))}}
.receipts>div{background:var(--house);padding:24px;display:grid;gap:8px}
.receipts b{font-family:var(--display);font-variation-settings:"wdth" 125;font-weight:800;font-size:clamp(28px,3.4vw,40px);line-height:1}
.facts{display:grid;gap:0;border-top:1px solid var(--line);align-self:start}
.facts div{display:grid;gap:4px;padding:14px 0;border-bottom:1px solid var(--line)}
.light .facts,.light .facts div{border-color:#DAD6CE}
.built{display:grid;gap:0;border-top:1px solid #DAD6CE}
.built div{display:grid;gap:8px;padding:20px 0;border-bottom:1px solid #DAD6CE}
@media(min-width:900px){.built div{grid-template-columns:200px minmax(0,1fr)}}
.built b{font-family:var(--display);font-variation-settings:"wdth" 112;font-weight:700;font-size:20px}
/* about */
.portrait{aspect-ratio:4/5;object-fit:cover;width:100%;filter:grayscale(1)}
/* career logos: one tone (make-logos.py), heights set per logo so they read at the same weight */
.logos{display:flex;flex-wrap:wrap;align-items:center;gap:28px 40px;margin-top:40px;padding-top:28px;border-top:1px solid var(--line)}
.logos .label{flex-basis:100%}
.logos img{height:var(--h);width:auto;opacity:.75}
@media(max-width:700px){.logos{gap:22px 28px}.logos img{height:calc(var(--h)*.8)}}
.beliefs{list-style:none;display:grid;gap:0;border-top:1px solid var(--line)}
.beliefs li{display:grid;grid-template-columns:48px minmax(0,1fr);gap:12px;padding:20px 0;border-bottom:1px solid var(--line);font-size:20px;font-family:var(--display);font-variation-settings:"wdth" 112;font-weight:700}
.beliefs li span:first-child{font-family:var(--mono);font-weight:400;font-size:12px;color:var(--rig);padding-top:6px}
/* form */
.form{display:grid;gap:28px;max-width:760px}
.opts{display:flex;flex-wrap:wrap;gap:8px}
.opt{position:relative}
.opt input{position:absolute;opacity:0;width:1px;height:1px}
.opt span{display:inline-flex;align-items:center;min-height:48px;padding:0 18px;border:1px solid var(--line);font-family:var(--mono);font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--rig);cursor:pointer;transition:border-color .2s var(--ease),color .2s var(--ease)}
.opt input:checked+span{border-color:var(--tung);color:var(--house);background-color:rgba(255,178,26,.06)}
.opt input:focus-visible+span{outline:2px solid var(--tung);outline-offset:3px}
.field{display:grid;gap:8px}
.field label,.field legend{font-family:var(--mono);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--rig)}
.field input,.field textarea,.field select{width:100%;min-height:52px;padding:12px 14px;background:var(--riser);border:1px solid var(--line);color:var(--house);font:inherit;font-size:17px;border-radius:0}
.field textarea{min-height:140px;resize:vertical}
.field input:focus,.field textarea:focus,.field select:focus{outline:2px solid var(--tung);outline-offset:0;border-color:var(--tung)}
.field .hint{font-size:14px;color:var(--rig)}
fieldset{border:0;display:grid;gap:12px}
.two{display:grid;gap:20px}
@media(min-width:700px){.two{grid-template-columns:1fr 1fr}}
.done{display:none;border:1px solid var(--tung);padding:28px;max-width:760px}
.done.on{display:block}
.light section,section.light{border-top-color:#DAD6CE}
section.light{background:var(--house);color:var(--black)}
section.light+section:not(.light){border-top-color:var(--line)}
.light .btn{border-color:var(--rig);color:var(--black);--tape:var(--black)}
.light .btn:not(.primary){--fill:rgba(18,17,15,.06)}
.light .btn:hover{border-color:var(--black)}
.light .cues,.light .proofs,.light .asides{background:#DAD6CE;border-color:#DAD6CE}
.light .cue,.light .proofs>div,.light .asides>div{background:var(--house)}
.light .cue p:not(.label),.light .faq details p,.light .head .lede{color:var(--rig-deep)}
.light .cue p.cue-line{color:var(--black)}
.light .panel,.light .clip{background:#EAE7E0;border-color:#DAD6CE}
.light .panel li{border-top-color:#DAD6CE}
.light .framed::before,.light .framed::after,.light .marked::before,.light .marked::after{border-color:var(--black)}
.light .badge.prog{color:var(--black)}
.light .badge.self,.light .badge.demo{color:var(--rig-deep)}
.light .p b{color:var(--black)}
.light .p s,.light .p small{color:var(--rig-deep)}
.light .faq,.light .faq details{border-color:#DAD6CE}
.light .faq summary::after{color:var(--rig-deep)}
.light .table th,.light .table td{border-bottom-color:#DAD6CE}
.light .table th,.light .table .u,.light .table td.t s{color:var(--rig-deep)}
section.light{padding:clamp(48px,6vw,88px) 0}
.mnav[open] .m-open,.mnav:not([open]) .m-close{display:none}
.light :focus-visible{outline-color:var(--black)}
/* the lineup, "Spotlight" (chosen 12 Oct over a hover-peek list and a 3D drum): the running order on the left, one stage on the right
   that lights whichever product you are on and runs through its stills */
.spot{display:grid;gap:0}
@media(min-width:900px){.spot{grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:clamp(32px,4vw,64px);align-items:start}}
.spot-list{list-style:none;border-top:1px solid var(--line)}
.spot-item{position:relative;display:grid;grid-template-columns:40px minmax(0,1fr) 24px;gap:4px 14px;padding:22px 12px;border-bottom:1px solid var(--line);text-decoration:none}
.spot-item::before{content:"";position:absolute;left:0;top:20px;bottom:20px;width:2px;background:var(--house);transform:scaleY(0);transform-origin:top;transition:transform .45s var(--ease)}
.spot-item .num{font-family:var(--mono);font-size:12px;color:var(--rig);padding-top:8px}
.spot-item h3{font-family:var(--display);font-variation-settings:"wdth" 125;font-weight:800;font-size:clamp(28px,3vw,40px);line-height:1;letter-spacing:-.02em;transition:color .35s var(--ease),transform .45s var(--ease)}
.spot-item p{color:var(--rig);margin-top:6px;max-width:38ch;font-size:16px}
.spot-item .meta{display:flex;flex-wrap:wrap;gap:6px 16px;align-items:baseline;margin-top:12px}
.spot-item .go{align-self:center;opacity:.35;transition:opacity .3s var(--ease),transform .45s var(--ease)}
.spot-item .go svg{width:20px;height:20px}
.spot-item:hover .go,.spot-item.on .go{opacity:1;transform:translateX(4px)}
.spot-thumb{grid-column:1/-1;aspect-ratio:16/10;background:var(--riser);border:1px solid var(--line);overflow:hidden;margin-bottom:14px}
.spot-thumb img{width:100%;height:100%;object-fit:cover;object-position:top left}
.spot-stage,.spot-stage img{display:none}
@media(min-width:900px){
  .spot-thumb,.spot-thumb img{display:none}
  .spot-stage img{display:block}
  .spot-list:hover .spot-item:not(.on) h3,.spot.engaged .spot-item:not(.on) h3{color:var(--rig)}
  .spot-item.on::before{transform:scaleY(1)}
  .spot-item.on h3{transform:translateX(8px)}
  .spot-stage{display:block;position:sticky;top:96px}
}
.spot-win{position:relative;aspect-ratio:16/10;background:var(--riser);border:1px solid var(--line);overflow:hidden}
.spot-set{position:absolute;inset:0;opacity:0;transition:opacity .5s var(--ease)}
.spot-set.on{opacity:1}
.spot-set img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top left;opacity:0;transform:scale(1.04);transition:opacity .7s var(--ease),transform 3.2s linear}
.spot-set img.on{opacity:1;transform:scale(1)}
.spot-set .panel{position:absolute;inset:0;border:0;align-content:center}
.spot-set video,.film-clip video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.film-clip{position:relative;aspect-ratio:16/10}
.spot-cap{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-top:18px;min-height:20px}
.bars{display:flex;gap:6px}
.bars i{position:relative;width:28px;height:2px;background:var(--line);overflow:hidden}
.bars i.on::after{content:"";position:absolute;inset:0;background:var(--house);transform-origin:left;animation:fillbar var(--hold,3.2s) linear forwards}
.bars i.done::after{content:"";position:absolute;inset:0;background:var(--rig)}
@keyframes fillbar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
"""

JS = """
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(pointer:fine)').matches;
  var $$ = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  // the beam, scaled down: a light that follows the pointer across anything you can press
  var GLOW = '.btn,.row,.wcard,.chip,.opt span,.nav a,.nav summary,.flinks a,.faq summary,.spot-item,.g-thumbs button,.mnav .sheet-m a:not(.btn)';
  if (fine && !reduce) {
    $$(GLOW).forEach(function(el){ if (!el.classList.contains('btn')) el.classList.add('glow'); });
    var lit = null;
    document.addEventListener('pointermove', function(e){
      var el = e.target.closest && e.target.closest(GLOW);
      if (lit && lit !== el) { lit.classList.remove('lit'); lit = null; }
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      if (lit !== el) { el.classList.add('lit'); lit = el; }
    }, {passive:true});
    document.addEventListener('pointerleave', function(){ if (lit) { lit.classList.remove('lit'); lit = null; } });
  }
  // galleries: thumbs swap the still on the stage
  $$('[data-gallery]').forEach(function(g){
    var imgs = $$('.clip img', g), btns = $$('.g-thumbs button', g);
    btns.forEach(function(b, i){
      b.addEventListener('click', function(){
        imgs.forEach(function(im, j){ im.classList.toggle('on', i === j); });
        btns.forEach(function(x, j){ x.setAttribute('aria-pressed', i === j ? 'true' : 'false'); });
      });
    });
  });
  // cue films on the product pages: play while on screen, never under reduced motion (the poster stays)
  var play = function(v){ if (!reduce) { var p = v.play(); if (p && p.catch) p.catch(function(){}); } };
  if ('IntersectionObserver' in window) {
    var fo = new IntersectionObserver(function(es){ es.forEach(function(e){ var v = e.target.querySelector('video'); if (e.isIntersecting) play(v); else v.pause(); }); }, {threshold:.35});
    $$('[data-film]').forEach(function(f){ fo.observe(f); });
  }
  // a set of stills that runs on its own while it is lit (the lineup stage); a film plays instead
  var HOLD = 3200;
  function runner(set, bars){
    var imgs = $$('img', set), k = 0, t = 0, vid = set.querySelector('video');
    if (vid) return { start: function(){ vid.currentTime = 0; play(vid); }, stop: function(){ vid.pause(); } };
    function show(n){
      k = n; imgs.forEach(function(im, j){ im.classList.toggle('on', j === n); });
      if (bars) $$('i', bars).forEach(function(b, j){ b.className = j === n ? '' : (j < n ? 'done' : ''); void b.offsetWidth; if (j === n) b.className = 'on'; });
    }
    return {
      start: function(){ clearInterval(t); show(0); if (!reduce && imgs.length > 1) t = setInterval(function(){ show((k + 1) % imgs.length); }, HOLD); },
      stop: function(){ clearInterval(t); }
    };
  }
  // the lineup, Spotlight: whichever product you are on is the one on stage
  $$('.spot').forEach(function(spot){
    var items = $$('.spot-item', spot), sets = $$('.spot-set', spot), cap = spot.querySelector('.spot-cap .label'), bars = spot.querySelector('.bars');
    if (!sets.length) return;
    var runs = sets.map(function(s){ return runner(s, null); }), cur = -1;
    function light(i){
      if (i === cur) return; cur = i;
      items.forEach(function(it, j){ it.classList.toggle('on', j === i); });
      sets.forEach(function(s, j){ s.classList.toggle('on', j === i); runs[j].stop(); });
      var n = sets[i].querySelectorAll('img').length;
      bars.innerHTML = n > 1 ? new Array(n + 1).join('<i></i>') : '';
      runs[i] = runner(sets[i], bars); runs[i].start();
      cap.textContent = sets[i].getAttribute('data-cap');
    }
    items.forEach(function(it, i){
      it.addEventListener('pointerenter', function(){ spot.classList.add('engaged'); light(i); });
      it.addEventListener('focus', function(){ spot.classList.add('engaged'); light(i); });
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting && !spot.matches(':hover')) light(items.indexOf(e.target)); }); }, {rootMargin:'-45% 0px -50% 0px'});
      items.forEach(function(it){ io.observe(it); });
    }
    light(0);
  });
  // menus: close on outside click and Escape
  var menus = [].slice.call(document.querySelectorAll('.top details'));
  document.addEventListener('click', function(e){ menus.forEach(function(d){ if (d.open && !d.contains(e.target)) d.open = false; }); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') menus.forEach(function(d){ if (d.open) { d.open = false; d.querySelector('summary').focus(); } }); });
  // hero: finding your light. The beam sweeps in once per session and lands on the marked word, then the tape snaps in.
  var hero = document.querySelector('.hero'), root = document.documentElement;
  if (hero) {
    var pos = hero.querySelector('.beam-pos'), beam = hero.querySelector('.beam'), mark = hero.querySelector('.marked');
    var place = function(x, y){ pos.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)'; };
    var spot = function(){ var h = hero.getBoundingClientRect(), m = mark.getBoundingClientRect(); return [m.left - h.left + m.width / 2, m.top - h.top + m.height / 2]; };
    var home = function(){ var t = spot(); place(t[0], t[1]); };
    var after = function(){
      if (reduce) return;
      if (window.matchMedia('(pointer:fine)').matches) {
        var raf = 0;
        hero.addEventListener('pointermove', function(e){
          if (raf) return;
          raf = requestAnimationFrame(function(){ var h = hero.getBoundingClientRect(); pos.classList.add('follow'); place(e.clientX - h.left, e.clientY - h.top); raf = 0; });
        });
        hero.addEventListener('pointerleave', home);
      } else { beam.classList.add('drift'); }
    };
    window.addEventListener('resize', home);
    if (root.classList.contains('lights-pre') && !reduce) {
      pos.style.transition = 'none'; beam.style.opacity = '0';
      place(-0.15 * hero.clientWidth, -0.35 * hero.clientHeight);
      void pos.offsetWidth; pos.style.transition = '';
      requestAnimationFrame(function(){ beam.style.opacity = '1'; home(); });
      setTimeout(function(){ root.classList.remove('lights-pre'); try { sessionStorage.setItem('mss-lights', '1'); } catch (e) {} after(); }, 1500);
    } else { root.classList.remove('lights-pre'); pos.style.transition = 'none'; home(); void pos.offsetWidth; pos.style.transition = ''; after(); }
  }
  var chips = [].slice.call(document.querySelectorAll('.filters .chip'));
  chips.forEach(function(c){
    c.addEventListener('click', function(){
      chips.forEach(function(x){ x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
      var f = c.getAttribute('data-filter');
      [].slice.call(document.querySelectorAll('.wcard')).forEach(function(card){
        card.hidden = f !== 'all' && card.getAttribute('data-products').split(' ').indexOf(f) < 0;
      });
    });
  });
  var form = document.querySelector('form.form');
  if (form) {
    var want = (location.search.match(/[?&]p=([a-z-]+)/) || [])[1];
    if (want) { var box = form.querySelector('input[value="' + want + '"]'); if (box) box.checked = true; }
    form.addEventListener('submit', function(e){
      e.preventDefault(); form.hidden = true;
      var d = document.querySelector('.done'); d.classList.add('on'); d.setAttribute('tabindex','-1'); d.focus();
    });
  }
})();
"""

FOUNDING = ('<p class="label founding-note">Founding price for my first three clients on each product. '
            'After that, the target price applies.</p>')


def page(fname, title, desc, body, light=False):
    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>{CSS}</style>
<script>try{{if(!sessionStorage.getItem('mss-lights')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('lights-pre')}}catch(e){{}}</script>
</head>
<body>
<header class="top"><div class="wrap">
  <a class="lockup" href="index.html" aria-label="Main Stage Studio, home">{SPIKE}<span class="wm">MAIN STAGE<small>STUDIO</small></span></a>
  {nav(fname)}
</div></header>
<main{' class="light"' if light else ''}>
{body}
</main>
<footer><div class="wrap">
  <div class="grid">
    <div><p class="d2">Run the show.</p><p class="muted" style="margin-top:16px">Main Stage Studio. Founded and run by Os Akhtar.</p></div>
    <ul class="flinks"><li><a href="pricing.html">Pricing</a></li><li><a href="work.html">Work</a></li><li><a href="how-it-works.html">How it works</a></li><li><a href="about.html">About</a></li><li><a href="start.html">Start</a></li></ul>
  </div>
  <div class="small label"><span>Privacy · Terms</span><span>mainstagestudio.co.uk</span></div>
</div></footer>
<script>{JS}</script>
</body>
</html>
"""
    open(os.path.join(HERE, fname), 'w', encoding='utf-8').write(html)


NAV_PRODUCTS = [('review.html', 'Review', 'The way in'), ('identity.html', 'Identity', ''), ('website.html', 'Website', ''),
                ('campaign.html', 'Campaign', ''), ('content.html', 'Content', ''), ('platform.html', 'Platform', ''), ('care.html', 'Care', '')]
NAV_PAGES = [('work.html', 'Work'), ('how-it-works.html', 'How it works'), ('pricing.html', 'Pricing'), ('about.html', 'About')]


def nav(fname):
    cur = lambda href: ' aria-current="page"' if href == fname else ''
    prods = ''.join(f'<li><a href="{h}"{cur(h)}>{n}{f"<span>{x}</span>" if x else ""}</a></li>' for h, n, x in NAV_PRODUCTS)
    pages = ''.join(f'<li><a href="{h}"{cur(h)}>{n}</a></li>' for h, n in NAV_PAGES)
    sheet = ('<span class="label">Products</span>' + ''.join(f'<a href="{h}"{cur(h)}>{n}</a>' for h, n, _ in NAV_PRODUCTS)
             + '<span class="label">Studio</span>' + ''.join(f'<a href="{h}"{cur(h)}>{n}</a>' for h, n in NAV_PAGES)
             + f'<a class="btn primary" href="start.html">Start a project {ARROW}</a>')
    return (f'<nav aria-label="Main"><ul class="nav"><li><details><summary>Products</summary><ul class="menu">{prods}</ul></details></li>{pages}</ul></nav>'
            f'<div class="top-right"><details class="mnav"><summary class="btn" aria-label="Menu"><span class="m-open">Menu</span><span class="m-close">Close</span></summary><div class="sheet-m">{sheet}</div></details>'
            f'<a class="btn start-btn" href="start.html">Start a project</a></div>')


def sec(sid, inner, cls=''):
    return f'<section id="{sid}" data-stage-section="{sid}"{f" class={chr(34)}{cls}{chr(34)}" if cls else ""}><div class="wrap">{inner}</div></section>\n'


def price(f, t, unit='', big=False):
    u = f' <small>{unit}</small>' if unit else ''
    return f'<span class="p{" big" if big else ""}"><b>£{f}</b><s>£{t}</s>{u}</span>'


def badge(kind, text):
    return f'<span class="badge {kind}">{text}</span>'


# Product stills (assets/still-*.webp, made by make-stills.sh): (file, alt). Vera is a fictional demo clinic.
SHOTS = {
    'identity': [('sable-presented', "Sable's homepage: her name set large on cream, beside a portrait"),
                 ('sable-cover', 'Sable album cover: a thin line of light across black'),
                 ('sable-home', "Sable's homepage on dark: her name over the full-length portrait")],
    'website': [('website-edit', 'Stage editor on the Vera demo site: the headline being changed on the page itself'),
                ('website-hero', 'The Vera demo site home page, as a visitor sees it'),
                ('website-phone', 'The same change checked in phone view before it is sent')],
    'campaign': [('campaign-form', 'Vera demo guide sign-up form, with its consent wording'),
                 ('campaign-series', 'The console: who is in the follow-up series and how far they have got'),
                 ('campaign-sent', 'The console: every email the series has sent, newest first')],
    'content': [('content-slides', 'Three carousel slides built from the clinic photo library'),
                ('content-builder', 'The carousel builder: media library, slides and the words for each slide'),
                ('content-checks', 'The content checks: one post clean, one held for a word a clinic cannot use')],
    'platform': [('platform-dash', 'The console dashboard: who can be reached, what went out, where people came from'),
                 ('platform-email', 'An email in the series, approved by the owner, with its wording'),
                 ('platform-preview', 'The email preview, exactly as a client would receive it')],
}


SHOTS.update({
    'case-ayesha': [('work-ayesha-choose', "Ayesha's website directions, side by side for her to choose"),
                    ('work-ayesha', 'Direction A, the Love room: the quietest body of her work'),
                    ('work-ayesha-about', "Direction A, Who I am: her own words beside a space for her photograph")],
    'case-sable': [('sable-presented', "Sable's homepage on Bone: the wordmark, with london beneath in gold"),
                   ('sable-cover', 'Sable album cover: a thin line of light across black'),
                   ('sable-home', "Sable's homepage on Night, over the full-length portrait")],
    'case-conveyancing': [('work-thackray', "Thackray Vane's site, with the five stages of a conveyance drawn as a rail"),
                          ('work-thackray-2', 'Every fee and disbursement itemised before a client instructs, with the rules engine note beside it')],
    'case-accountancy': [('work-marbury', "Marbury Hale's site: key dates and the fee schedule, ruled like a ledger"),
                         ('work-marbury-2', 'The fee schedule by service, with the rules engine note beside it')],
    'case-clinic': [('work-vera', "Vera's site: consultation first, because your face is not a menu"),
                    ('work-vera-2', 'Treatments, with Consultation first in the list')],
    'case-puremed': [('work-puremed', 'puremed.uk, live: the home page the owner edits herself')],
})


def still(name, alt='', cls='', lazy=True):
    return (f'<img src="assets/still-{name}.webp" alt="{alt}" width="1440" height="810"'
            f'{f" class={chr(34)}{cls}{chr(34)}" if cls else ""}{" loading=lazy" if lazy else ""} decoding="async">')


def film(pid, cls=''):
    """A cue film: muted, looping, played by the page script only while it is on stage."""
    name, alt, _ = FILMS[pid]
    return (f'<video class="film{" " + cls if cls else ""}" muted loop playsinline preload="none" poster="assets/{name}.webp" aria-label="{alt}">'
            f'<source src="assets/{name}.webm" type="video/webm"><source src="assets/{name}.mp4" type="video/mp4"></video>')


def film_figure(pid, caption=True):
    cap = f'<figcaption class="cliprow"><span class="label">{FILMS[pid][2]}</span></figcaption>' if caption else ''
    return f'<figure class="clip-wrap" data-film><div class="framed"><div class="clip film-clip">{film(pid)}</div></div>{cap}</figure>'


def proof_media(m):
    """A proof card's picture, above its badge: a cue film id, or a (still name, alt) pair. The badge is the caption."""
    if not m:
        return ''
    if m in FILMS:
        return film_figure(m, caption=False)
    return f'<figure class="clip-wrap"><div class="framed"><div class="clip">{still(m[0], m[1], "on")}</div></div></figure>'


def gallery(pid, caption, only=None):
    """A framed still with thumbs that swap it. only: limit to these still names."""
    shots = [x for x in SHOTS[pid] if not only or x[0] in only]
    imgs = ''.join(still(n, a, 'on' if i == 0 else '', lazy=i > 0) for i, (n, a) in enumerate(shots))
    thumbs = ('<div class="g-thumbs">' + ''.join(
        f'<button type="button" aria-pressed="{"true" if i == 0 else "false"}" aria-label="Show: {a}">{still(n)}</button>'
        for i, (n, a) in enumerate(shots)) + '</div>') if len(shots) > 1 else ''
    return (f'<figure class="clip-wrap" data-gallery><div class="framed"><div class="clip">{imgs}</div></div>'
            f'<figcaption class="cliprow"><span class="label">{caption}</span>{thumbs}</figcaption></figure>')


REVIEW_PANEL = ('<div class="panel framed quiet"><p class="label">What lands at the end of the week</p><ol>'
                '<li><span>01</span><span>Findings</span></li><li><span>02</span><span>Brand guidelines</span></li><li><span>03</span><span>Campaign calendar</span></li>'
                '<li><span>04</span><span>The plan, costed</span></li><li><span>05</span><span>The walkthrough call</span></li></ol></div>')


def run_panel(title='The run, every month'):
    return ('<div class="panel framed quiet"><p class="label">' + title + '</p><ol>'
            '<li><span>01</span><span>Hosting</span></li><li><span>02</span><span>Backups</span></li><li><span>03</span><span>Security updates</span></li>'
            '<li><span>04</span><span>Email sending</span></li><li><span>05</span><span>Small changes, on request</span></li><li><span>06</span><span>The monthly check, written up</span></li></ol></div>')


def start_band(heading, label, href):
    return sec('start', f'<div class="split" style="align-items:center"><h2 class="d2">{heading}</h2>'
                        f'<div class="ctas"><a class="btn primary" href="{href}">{label} {ARROW}</a></div></div>')


def faq(items):
    return '<div class="faq">' + ''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in items) + '</div>'


def ticks(items):
    return '<ul class="ticks">' + ''.join(f'<li><span>{i}</span></li>' for i in items) + '</ul>'


# ── products ──────────────────────────────────────────────────────────────────
# (id, name, line, founding, target, unit, time, caption)
PRODUCTS = [
    ('identity', 'Identity', 'Who you are, said once and properly.', '750', '2,500', '', '3–4 weeks', 'Sable, self-initiated'),
    ('website', 'Website', 'A fast site you change yourself.', '540', '1,800', '10 pages', '3–5 weeks', 'Live editing in Stage, Vera demo site'),
    ('campaign', 'Campaign', 'A guide or quiz people sign up for, and emails that follow up for you.', '540', '1,800', '', '2–3 weeks', 'Guide sign-up to console, Vera demo'),
    ('content', 'Content', 'Your social channels, kept moving every week.', '1,050', '3,500', '/month', '3-month minimum', 'Carousel builder and checks, Vera demo'),
    ('platform', 'Platform', 'The system your business actually runs on.', '2,400', '8,000', '', '4–6 weeks', 'The console, Vera demo'),
    ('care', 'Care', 'Keeping it all running.', '105', '350', '/month, for a site', 'Monthly', 'What Care runs, every month'),
]



SHEET = '<div class="sheet" aria-hidden="true"><i>The run</i><span>Hosting</span><span>Backups</span><span>Updates</span><span>Monthly check</span></div>'


def lineup_spotlight():
    """Running order left, one lit stage right (desktop); inline stills on phones."""
    items, sets = '', ''
    for i, (pid, name, line, f, t, unit, time, cap) in enumerate(PRODUCTS):
        shots = SHOTS.get(pid, [])
        thumb = (f'<img src="assets/{FILMS[pid][0]}.webp" alt="" width="1600" height="1000" loading="lazy">' if pid in FILMS
                 else still(shots[0][0]) if shots else SHEET)
        items += (f'<li><a class="spot-item" href="{pid}.html"><div class="spot-thumb" aria-hidden="true">{thumb}</div>'
                  f'<span class="num">0{i + 2}</span><div><h3>{name}</h3><p>{line}</p>'
                  f'<div class="meta">{price(f, t, unit)}<span class="label">{time}</span></div></div><span class="go">{ARROW}</span></a></li>')
        inner = (film(pid) if pid in FILMS else
                 ''.join(still(n, a, 'on' if j == 0 else '') for j, (n, a) in enumerate(shots)) if shots else run_panel())
        sets += f'<div class="spot-set{" on" if i == 0 else ""}" data-cap="{name} · {FILMS[pid][2] if pid in FILMS else cap}">{inner}</div>'
    return (f'<div class="spot"><ol class="spot-list">{items}</ol>'
            f'<div class="spot-stage"><div class="framed"><div class="spot-win">{sets}</div></div>'
            f'<div class="spot-cap"><span class="label" aria-live="polite"></span><span class="bars" aria-hidden="true"></span></div></div></div>')


def home():
    rows = lineup_spotlight()
    cues = [('01 Soundcheck', 'One free call to find out what you actually need.'),
            ('02 Rehearsal', "You see all of it on one private link before it's real."),
            ('03 Your cue', "You approve it, or it doesn't ship."),
            ('04 Showtime', 'It goes live.'),
            ('05 The run', 'I keep it running, or you do.')]
    opts = ''.join(f'<a class="btn" href="start.html?p={o.lower().replace(" ", "-")}">{o}</a>'
                   for o in ['Review', 'Identity', 'Website', 'Campaign', 'Content', 'Platform', 'Care', 'Not sure yet'])
    body = (
        f'<section class="hero" data-stage-section="hero"><div class="beam-pos" aria-hidden="true"><div class="beam"></div></div><div class="wrap" style="width:100%">'
        f'<h1 class="d1">Run the <span class="marked">show.</span></h1>'
        f'<div class="sub"><p class="lede">Brand, website, content and the systems behind them. Built by one studio. Handed over with the controls.</p>'
        f'<div class="ctas"><a class="btn primary" href="#lineup">See what I build {ARROW}</a><a class="btn" href="start.html">Start a project</a></div></div>'
        f'</div></section>\n'
        + sec('problem', '<div class="split wide-left" style="align-items:center"><div><h2 class="d2">Most small businesses rent their own front door.</h2>'
              '<div class="body lede" style="margin-top:28px"><p>The designer you have to email to change a word. Four logins to send one newsletter. The agency that launched it and kept the keys.</p>'
              "<p>Looking professional shouldn't cost you control of your own business.</p></div></div>"
              # media plan H2: placeholder until the real PureMed edit is filmed (needs Nafisa's OK)
              + gallery('website', "Placeholder, Vera demo · Real image to come: an owner's edit, live on her site minutes later", only=['website-edit']) + '</div>', 'light')
        + sec('lineup', f'<div class="head"><p class="label">The lineup</p><h2 class="d2">Six products. Prices on the page.</h2></div>'
              f'{rows}{FOUNDING}'
              f'<div class="asides"><div><p class="label">Opening Night</p><p>Need a brand and a site together? <b>Opening Night</b> is Identity and Website as one project.</p>{price("1,290", "4,300")}</div>'
              f'<div><p class="label">The way in</p><p>Not sure where to start? A <b>Review</b> is one week: what\'s working, what isn\'t, and what to build next.</p>'
              f'{price("450", "1,500")}<p class="label">Credited if you buy within 8 weeks</p><a class="btn" href="review.html">About the Review {ARROW}</a></div></div>'
              f'<div class="ctas" style="margin-top:28px"><a class="btn" href="pricing.html">See all prices {ARROW}</a></div>')
        + sec('proof', f'<div class="split wide-left"><div><p>{badge("live", "Live · PureMed Aesthetics")}</p><h2 class="d2" style="margin-top:24px">A clinic that runs its own show.</h2></div>'
              f'<div class="body lede"><p>PureMed\'s owner edits her own website, writes and approves her own emails, and keeps every client record in one place she controls. Live on puremed.uk since 30 September 2026.</p>'
              f'<div class="ctas" style="margin-top:24px"><a class="btn" href="work-puremed.html">Read the case study {ARROW}</a></div></div></div>', 'light')
        + sec('how', '<div class="head"><p class="label">How it works</p><h2 class="d2">Nothing goes live until you give the cue.</h2></div>'
              '<div class="cues">' + ''.join(f'<div class="cue"><p class="label">{k}</p><p class="cue-line">{v}</p></div>' for k, v in cues) + '</div>'
              f'<div class="ctas" style="margin-top:28px"><a class="btn" href="how-it-works.html">How it works {ARROW}</a></div>', 'light')
        + sec('founder', '<div class="split lead"><h2 class="d2">Twenty years building systems that weren\'t allowed to fail.</h2>'
              '<div class="body lede"><p>TV channel launches across three continents. Banking and lending platforms. Onboarding for millions of customers. Systems like that used to need an enterprise budget. I founded Main Stage Studio to bring the same standard to founders: enterprise-grade systems and thinking, sized for a business that\'s still growing.</p>'
              f'<p>AI does the typing. I do the deciding. You do the approving.</p><div class="ctas" style="margin-top:24px"><a class="btn" href="about.html">About Os {ARROW}</a></div></div></div>', 'light')
        + sec('start', f'<div class="head"><p class="label">Start</p><h2 class="d2">What do you need?</h2></div><div class="ctas">{opts}</div>'
              '<p class="muted" style="margin-top:24px">I read everything that comes in and reply within two working days.</p>')
    )
    page('index.html', 'Main Stage Studio: brand, website, content and the systems behind them',
         'I build the brand, the website, the content and the systems behind them for owner-led businesses, then hand you the controls. Prices on the page.', body)


def proof_links(href, lbl):
    links = href if isinstance(href, list) else ([(href, lbl)] if href else [])
    return ('<div class="ctas">' + ''.join(f'<a class="btn" href="{h}">{l} {ARROW}</a>' for h, l in links) + '</div>') if links else ''


def product(pid, num, name, promise, who, get, own, price_html, notes, media, proofs, cue, faqs, start_label, title, desc):
    proofs_html = '<div class="proofs' + (' pair' if len(proofs) > 1 else '') + '">' + ''.join(
        f'<div>{proof_media(p[5] if len(p) > 5 else None)}<p>{badge(p[0], p[1])}</p><p class="lede">{p[2]}</p>{proof_links(p[3], p[4])}</div>'
        for p in proofs) + '</div>'  # a proof is (kind, badge, text, href, link label[, proof_media])
    body = (
        sec('promise', f'<p class="label">Product {num} of 7</p>'
                       f'<h1 class="d1" style="margin-top:20px;font-size:clamp(44px,9vw,136px)">{name}.</h1>'
                       f'<div class="split wide-left" style="margin-top:clamp(24px,3vw,40px)"><p class="lede">{promise}</p><div>{media}</div></div>', 'first')
        + sec('for', f'<div class="head"><p class="label">Who it\'s for</p><p class="d3" style="max-width:32ch">{who}</p></div>', 'light')
        + sec('get', f'<div class="split"><div><p class="label">What you get</p></div>{ticks(get)}</div>', 'light')
        + sec('own', f'<div class="split"><div><p class="label">What you own at the end</p></div><p class="d3">{own}</p></div>', 'light')
        + sec('price', f'<div class="split"><div><p class="label">Price and time</p></div><div>{price_html}'
                       + ''.join(f'<p class="label" style="margin-top:14px">{n}</p>' for n in notes) + f'{FOUNDING}</div></div>', 'light')
        + (sec('proof', f'<div class="head"><p class="label">The proof</p></div>{proofs_html}', 'light') if proofs else '')
        + sec('cue', f'<div class="split"><div><p class="label">How the cue works here</p></div><p class="lede">{cue}</p></div>', 'light')
        + sec('faq', f'<div class="split"><div><p class="label qlabel">Questions</p></div>{faq(faqs)}</div>', 'light')
        + sec('start', f'<div class="split" style="align-items:center"><h2 class="d2">{start_label}.</h2>'
                       f'<div class="ctas"><a class="btn primary" href="start.html?p={pid}">{start_label} {ARROW}</a><a class="btn" href="pricing.html">All prices</a></div></div>')
    )
    page(f'{pid}.html', title, desc, body)


def product_pages():
    PM = ('work-puremed.html', 'Read the case study')
    # Review
    product('review', 1, 'Review', "One week. What's working, what isn't, and what to build next.",
            "For an owner who knows something's off and isn't sure what to fix first.",
            ['A close look at your brand, website, social channels and the tools behind them', 'Written findings, in plain English',
             'Brand guidelines, tidied up or written down for the first time', 'A campaign calendar',
             'A plan: what to build, in what order, and what each part costs', 'A call to walk you through it'],
            "The findings, the guidelines, the calendar and the plan. Take them to anyone. You don't have to build any of it with me.",
            price('450', '1,500', 'one week', big=True), ['Buy any product within 8 weeks and the Review fee comes off it'],
            REVIEW_PANEL,
            [],  # no proof shown until the first paid Review is delivered
            "You see the findings in draft and tell me what I've got wrong. The final version only lands once you've said it's right.",
            [('How is this different from the Soundcheck?', 'The Soundcheck is a free call to work out what you need. A Review is a week of actual work, written down, that you keep.'),
             ('Do I have to buy something afterwards?', 'No. The plan is yours either way. If you do buy within 8 weeks, the fee comes off.'),
             ('What do you need from me?', 'Access to whatever you want looked at, and two short calls: one to start, one to walk through the findings.')],
            'Start a Review', 'Review: one week, and a plan for what to build | Main Stage Studio',
            'A week looking at your brand, site, channels and tools. Written findings, brand guidelines, a campaign calendar and a costed plan. Credited if you buy within 8 weeks.')
    # Identity
    product('identity', 2, 'Identity', 'Who you are, said once and properly.',
            "For a business that has outgrown the logo someone's cousin made, or never had one at all.",
            ['Your positioning, on one page', 'The story behind your name, and a line that holds it',
             'A tone of voice guide, with examples in your own words', 'Mark, colour, type and imagery rules',
             'A short brand book', 'A starter set of templates and images'],
            'Every source file. The brand book in a format you can edit. A note of every font licence, so nothing surprises you later.',
            price('750', '2,500', 'one-off · 3–4 weeks', big=True), [],
            film_figure('identity'),
            [('prog', 'In progress · Art by Ayesha Johar',
              'A painter\'s brand, built from her own work. The meaning of her name, the line "beauty is a form of resistance", and directions drawn from her paintings. In review with Ayesha now.', 'work-ayesha.html', 'Read the case study', 'ayesha'),
             ('self', 'Self-initiated · Sable',
              "A musician's brand built from one idea, soft and sharp at once: her name, her look, her album cover and her moving image.", 'work-sable.html', 'Read the case study',
              ('sable-presented', "Sable's homepage on Bone: the wordmark, with london beneath in gold"))],
            'You see each direction on a private link and comment on it there. I refine one. Nothing is final until you say so.',
            [('Do I need Identity before a Website?', "No. If you already have a brand you're happy with, I build the site around it. If you need both, Opening Night does them as one project: £1,290 founding, £4,300 target."),
             ('Will you rename my business?', 'Only if you ask. Most people keep their name; the work is in what it says.'),
             ('Do I get the logo files?', 'Every one, in every format, plus the files they came from.')],
            'Start an Identity', 'Identity: who you are, said once and properly | Main Stage Studio',
            'Positioning, name story, tone of voice, mark, colour and type, in a brand book you own. 3 to 4 weeks, prices on the page.')
    # Website
    product('website', 3, 'Website', 'A fast site you change yourself. Typo on a Sunday night? Fix it. No ticket, no invoice.',
            'For a business whose website is out of date because changing it means asking someone.',
            ['Ten pages, with the copy written in your voice', 'Live editing: change words and images on the page itself',
             'Search and AI-search basics: sitemap, structured data, clean addresses', 'Forms that land where you need them',
             'Launch and domain handled'],
            'The code, in your own repository. Your domain. Your content. If you leave, you take all of it.',
            price('540', '1,800', '10 pages · 3–5 weeks', big=True), ['Extra pages £22.50, target £75, each'],
            film_figure('website'),
            [('live', 'Live · PureMed Aesthetics',
              'puremed.uk, live since 30 September 2026. The owner changes her own pages through the same editor as in the clip, plus a consultation quiz and guide sign-ups that feed her client records.', *PM)],
            'You review every page on a private link before launch, and leave comments on the page itself. After launch, your edits go through the same check: you change it, you publish it.',
            [('What counts as a page?', 'A page design plus its words. Blog posts and repeating items, like treatments or services, count once.'),
             ('What if I need fewer than ten?', 'The price stays the same. Ten is the base.'),
             ('Can I leave?', 'Yes. The code is in your repository from day one. Take it to any developer you like.')],
            'Start a Website', 'Website: a fast site you change yourself | Main Stage Studio',
            'Ten pages, copy in your voice, live editing, search basics, launch handled. The code is yours. 3 to 5 weeks, prices on the page.')
    # Campaign
    product('campaign', 4, 'Campaign', 'A guide or quiz worth signing up for, and emails that follow up for you. Someone signs up, gets what they came for straight away, and your emails keep the conversation going until they get in touch.',
            'For a business with something worth giving away and no system to turn it into enquiries.',
            ['A guide or a quiz worth signing up for', 'Its landing and thank-you pages', "Consent wording that says what you'll actually do",
             'A follow-up series of 4 to 6 emails, written with you', 'Ad and social creative for launch', 'Click tracking, so you can see what worked'],
            'The pages, the emails and the list. The people who sign up are your contacts, not mine.',
            price('540', '1,800', 'one-off · 2–3 weeks', big=True),
            ['Attaches to a site (yours, or a Website from me) and needs somewhere to send email from (a Platform, or the tool you already use)'],
            film_figure('campaign'),
            [('live', 'Live · PureMed Aesthetics',
              'Two guides and a consultation quiz, each with its own sign-up and email series. The owner writes and approves every email in her own console before it sends.', *PM)],
            "You approve each email in the series before it goes live. Once you have, the series goes to every new sign-up on schedule. In my console, an email you haven't approved can't send.",
            [('Do I need a list already?', 'No. Building one is the point.'),
             ('Who writes the emails?', 'I draft them in your voice. You edit and approve them.'),
             ('What about GDPR?', 'Consent is captured and recorded at sign-up, in plain words that match what you send.')],
            'Start a Campaign', 'Campaign: a sign-up worth having, and emails that follow up | Main Stage Studio',
            'A guide or quiz, its pages, consent wording, an email series you approve, launch creative and tracking. 2 to 3 weeks.')
    # Content
    product('content', 5, 'Content', 'Your social channels, kept moving every week.',
            "For a business that knows it should post more and hasn't got the hours.",
            ['A monthly calendar', 'Designed posts and carousels', 'Edited reels and clips', 'Captions in your voice',
             'Every piece checked against your rules (claims, regulated words) before you see it',
             'Your approval on every post before it goes anywhere'],
            'Every asset and every source file, delivered to your own storage.',
            price('1,050', '3,500', '/month · 3-month minimum', big=True), [],
            film_figure('content'),
            [('prog', 'In progress · PureMed Aesthetics',
              'The content pipeline is built: posts and carousels drafted in her brand, checked against her rules, waiting for her approval. Publishing starts once her social accounts are connected.', None, None)],
            "You see the month before it starts, and every post before it goes out. The checks catch the words your industry can't use; you catch everything else.",
            [('Do you post for me?', "No. You post from your own accounts, so nothing goes out that you didn't send. I deliver the approved month ready to schedule."),
             ('Why three months?', 'The first month sets the rhythm. You judge it on the third.'),
             ('Can you film?', 'I edit what you shoot, and make clips from what you already have.')],
            'Start Content', 'Content: your social channels, kept moving every week | Main Stage Studio',
            'A monthly calendar, posts, carousels and reels in your voice, checked against your rules and approved by you.')
    # Platform
    product('platform', 6, 'Platform', 'The system your business actually runs on.',
            'For a business with customer details spread across four tools and nobody sure which one is right.',
            ['One record per customer, instead of four', 'Consent captured and kept properly',
             'Email campaigns and automations you write and approve yourself', 'Forms, quizzes and intake that feed it',
             'Migration from your old tools',
             'The data protection paperwork (data map, DPIA, data processing agreement) done as part of the build, not after it'],
            'Your data, in your own space, exportable whenever you want it.',
            '<p class="label" style="margin-bottom:10px">Foundation</p>' + price('2,400', '8,000', '4–6 weeks', big=True),
            ['Anything beyond the Foundation is scoped and quoted first'],
            film_figure('platform'),
            [('live', 'Live · PureMed Aesthetics',
              'Client records, a consent ledger, emails the owner writes herself, consultation scoring. 1,642 past appointments moved across from two old systems. DPIA signed and a data processing agreement in place before anything was imported.', *PM),
             ('demo', 'Demo, fictional clients',
              'Booking and intake journeys for a conveyancing firm, an accountancy practice and a clinic.',
              [('work-conveyancing.html', 'Conveyancing'), ('work-accountancy.html', 'Accountancy'), ('work-clinic.html', 'Clinic')], None)],
            "You approve the data map before any data moves. You approve every email before it sends. Old records only come across after you've signed off how they'll be kept.",
            [('Is this a CRM?', "It does what you'd want a CRM to do for a small business, without the forty features you'd never open."),
             ("Who can see my customers' data?", 'You. I act as your processor, under the agreement you sign. Any sub-processors are listed in it.'),
             ('Why should I trust you with this?', "I spent two decades building onboarding and identity systems for banks and lenders, where getting it wrong wasn't an option.")],
            'Start a Platform', 'Platform: the system your business actually runs on | Main Stage Studio',
            'One record per customer, consent kept properly, emails you approve, migration from your old tools, data protection paperwork done as part of the build.')
    # Care
    product('care', 7, 'Care', 'Keeping it all running.',
            "For anyone who'd rather run the business than the hosting.",
            ['Hosting', 'Backups', 'Security updates', 'Email sending', 'Small changes when you ask', 'A monthly check, written up in plain English'],
            "Everything you owned before. Care doesn't lock anything in: stop it and your site, code and data stay yours.",
            price('105', '350', '/month · for a site', big=True), ['With a Platform: priced when we scope it'],
            run_panel(),
            [('live', 'Live · PureMed Aesthetics',
              'Hosting, backups and updates run this way since puremed.uk went live on 30 September 2026.', None, None)],
            'Small changes still go through you. I make them, you see them, you say go.',
            [("What's a small change?", 'A new section, a fixed link, an updated price. Anything bigger, I quote first.'),
             ('Can I do the changes myself?', "Yes. That's the point of live editing. Care covers what you'd rather not."),
             ('Is there a contract?', 'Monthly. Stop when you like.')],
            'Start Care', 'Care: keeping it all running | Main Stage Studio',
            'Hosting, backups, security updates, email sending, small changes and a monthly check, for a fixed monthly price.')

def pricing():
    rows = [('Review', 'one week', '450', '1,500'), ('Identity', 'one-off', '750', '2,500'), ('Website', '10 pages', '540', '1,800'),
            ('Extra page', 'each, beyond 10', '22.50', '75'), ('Campaign', 'one-off', '540', '1,800'),
            ('Content', 'per month, 3-month minimum', '1,050', '3,500'), ('Platform Foundation', 'one-off', '2,400', '8,000'),
            ('Care', 'per month, for a site', '105', '350'), ('Opening Night (Identity + Website)', 'one-off', '1,290', '4,300')]
    table = ('<table class="table"><thead><tr><th>Product</th><th>Unit</th><th>Founding</th><th>Target</th></tr></thead><tbody>'
             + ''.join(f'<tr><td>{n}</td><td class="u">{u}</td><td class="f">£{f}</td><td class="t"><s>£{t}</s></td></tr>' for n, u, f, t in rows)
             + '</tbody></table>')
    body = (
        sec('intro', '<p class="label">Pricing</p><h1 class="d1" style="margin-top:20px;font-size:clamp(48px,8vw,120px)">Every price, on one page.</h1>'
                     '<p class="lede muted" style="margin-top:24px">Founding prices are for my first three clients on each product. After that, the target price applies. No hidden day rates.</p>', 'first')
        + sec('table', table + FOUNDING)
        + sec('faq', '<div class="split"><div><p class="label qlabel">Questions</p></div>' + faq([
            ('Why publish prices?', "Because you shouldn't need a call to find out whether you can afford something."),
            ('Why so low now?', "I'm trading margin for my first reference clients. Founding clients pay less and get the same work."),
            ("What isn't included?", 'Outside costs, like your domain, paid ads or an email-sending service, are paid by you. Which ones apply depends on the products you choose: Care, for example, covers hosting and email sending for a site. Your written scope lists every one before you commit.'),
            ('What if I start with a Review?', 'Buy any product within 8 weeks and the Review fee comes off it.')]) + '</div>')
        + start_band('Seen a price that fits?', 'Start a project', 'start.html')
    )
    page('pricing.html', 'Pricing | Main Stage Studio', "Every product's price, on one page. Founding prices for my first three clients on each product.", body)


def how():
    steps = [
        ('01 Soundcheck', 'One call.', 'We work out what you actually need, which might be less than you came in for. You get a written scope and a price before you commit to anything.', None),
        ('02 Rehearsal', 'One private link.', "Everything I build appears there before it's real. You click on anything and leave a comment where it sits.", gallery('website', 'Stage, Vera demo site', only=['website-edit'])),
        ('03 Your cue', "You approve it, or it doesn't ship.", "That isn't a courtesy. The tools refuse to publish without it.", gallery('platform', 'The console, Vera demo', only=['platform-email'])),
        ('04 Showtime', 'It goes live.', "Domain, launch, the first send. I handle it and tell you when it's done.", None),
        ('05 The run', 'I keep it running, or you do.', "You can edit your own site and write your own emails from day one. Care and Content are there if you'd rather not.", None),
    ]
    body = (
        sec('intro', '<p class="label">How it works</p><h1 class="d1" style="margin-top:20px;font-size:clamp(48px,8vw,120px)">Nothing goes live until you give the cue.</h1>', 'first')
        + sec('steps', '<div class="steps">' + ''.join(
            f'<div class="step"><p class="label">{k}</p><div><h2 class="d3">{h}</h2><p class="muted" style="margin-top:10px;max-width:46ch">{p}</p></div><div>{m or ""}</div></div>'
            for k, h, p, m in steps) + '</div>')
        + start_band('Start with the Soundcheck.', 'Start a project', 'start.html')
    )
    page('how-it-works.html', 'How it works | Main Stage Studio', 'Soundcheck, Rehearsal, Your cue, Showtime, The run. Nothing goes live until you approve it.', body)


def work():
    # (name, badge kind, badge, products, product label, line, href, link label, still or None)
    cards = [
        ('PureMed Aesthetics', 'live', 'Live', 'website campaign platform care', 'Website · Campaign · Platform · Care', 'A clinic that runs its own show.',
         'work-puremed.html', 'Read the case study', 'work-puremed'),
        ('Art by Ayesha Johar', 'prog', 'In progress', 'identity', 'Identity', "A painter's brand, built from her own work.",
         'work-ayesha.html', 'Read the case study', 'work-ayesha'),
        ('Sable', 'self', 'Self-initiated', 'identity', 'Identity', 'An identity built around a character and a world.',
         'work-sable.html', 'Read the case study', 'sable-presented'),
        ('Conveyancing onboarding', 'demo', 'Demo, fictional client', 'platform', 'Platform', 'A demo client journey with example checks.',
         'work-conveyancing.html', 'Read the case study', 'work-thackray'),
        ('Accountancy intake', 'demo', 'Demo, fictional client', 'platform', 'Platform', 'New-client intake without the email chain.',
         'work-accountancy.html', 'Read the case study', 'work-marbury'),
        ('Clinic booking', 'demo', 'Demo, fictional client', 'platform', 'Platform', 'A demo booking flow with example suitability questions.',
         'work-clinic.html', 'Read the case study', 'work-vera'),
    ]
    filt = ''.join(f'<button class="chip" type="button" data-filter="{f.lower()}" aria-pressed="{"true" if f == "All" else "false"}">{f}</button>'
                   for f in ['All', 'Identity', 'Website', 'Campaign', 'Content', 'Platform'])
    grid = ''.join(
        f'<a class="wcard" href="{href}" data-products="{prods}"><div class="wthumb">{still(img)}</div>'
        f'<div class="wbody"><p>{badge(k, lbl)}</p><h3>{name}</h3><p class="muted">{line}</p><p class="label prods">{plabel}</p>'
        f'<span class="wgo label">{go} {ARROW}</span></div></a>'
        for name, k, lbl, prods, plabel, line, href, go, img in cards)
    body = (
        sec('intro', '<p class="label">Work</p><h1 class="d1" style="margin-top:20px;font-size:clamp(48px,8vw,120px)">The work, labelled honestly.</h1>'
                     '<p class="lede muted" style="margin-top:24px">Live means a paying client is using it today. Demo means a fictional client, built to show how something works.</p>', 'first')
        + sec('grid', f'<div class="filters" role="group" aria-label="Filter by product">{filt}</div><div class="cards">{grid}</div>')
    )
    page('work.html', 'Work | Main Stage Studio', 'Live client work, work in progress, self-initiated pieces and labelled demos.', body)


def puremed():
    body = (
        sec('intro', f'<p>{badge("live", "Live · Website · Campaign · Platform · Care")}</p>'
                     '<h1 class="d1" style="margin-top:24px;font-size:clamp(48px,8vw,120px)">A clinic that runs its own show.</h1>', 'first')
        + sec('media', gallery('case-puremed', 'puremed.uk, live since 30 September 2026'))
        + sec('before', '<div class="split"><div><p class="label">Before</p></div><p class="lede">Before, one PureMed client could live in up to four places: the old website, the mailing list, the clinic records and the booking tool. Changing a price on the website meant asking someone and waiting.</p></div>')
        + sec('built', '<div class="split"><div><p class="label">What I built</p></div><div class="built">'
                       '<div><b>Website</b><p>puremed.uk, rebuilt as a fast static site she edits herself, page by page.</p></div>'
                       '<div><b>Campaign</b><p>Two guides and a consultation quiz, each with its own sign-up, consent wording and email series.</p></div>'
                       '<div><b>Platform</b><p>One record per client, a consent ledger, and a console where she writes and approves every email.</p></div>'
                       '<div><b>Migration</b><p>Her history from two old systems, moved across only after the data protection paperwork was signed.</p></div></div></div>')
        + sec('now', '<div class="split"><div><p class="label">Now</p></div><p class="d3">She changes her own pages. She writes and approves her own emails. Every client record sits in one place she controls.</p></div>')
        + sec('receipts', '<div class="head"><p class="label">The receipts</p></div><div class="receipts">'
                          '<div><span class="label">Live on puremed.uk</span><b>30 Sep 2026</b></div>'
                          '<div><span class="label">Past appointments migrated</span><b>1,642</b></div>'
                          '<div><span class="label">DPIA</span><b>Signed before import</b></div></div>')
        + start_band('Want this for your business?', 'Start a project like this', 'start.html')
    )
    page('work-puremed.html', 'PureMed Aesthetics: a clinic that runs its own show | Main Stage Studio',
         'Website, campaigns and the platform behind them for an aesthetics clinic. Live since 30 September 2026.', body, light=True)

DEMO_JOURNEY = 'https://mainstagestudio.co.uk/work/booking-engine/prototype/?tenant='


def case(slug, kind, badge_text, title, intro, facts, brief_label, brief, built, status, caption, product_id, try_href=None, seo='', film=None):
    """A case study: what was offered and why, what I built, where it stands, then the way in."""
    facts_html = '<div class="facts">' + ''.join(f'<div><span class="label">{k}</span><p>{v}</p></div>' for k, v in facts) + '</div>'
    built_html = '<div class="built">' + ''.join(f'<div><b>{h}</b><p>{t}</p></div>' for h, t in built) + '</div>'
    try_html = (f'<div class="ctas" style="margin-top:28px"><a class="btn primary" href="{try_href}" target="_blank" rel="noopener">Try the working demo {ARROW}</a></div>'
                '<p class="label" style="margin-top:14px">Opens in a new tab, in the fictional client\'s own branding</p>') if try_href else ''
    pname = product_id.capitalize()
    body = (
        sec('intro', f'<p>{badge(kind, badge_text)}</p><h1 class="d1" style="margin-top:24px;font-size:clamp(44px,8vw,120px)">{title}</h1>'
                     f'<div class="split wide-left" style="margin-top:clamp(24px,3vw,40px)"><p class="lede">{intro}</p>{facts_html}</div>', 'first')
        + sec('media', film_figure(film) if film else gallery(f'case-{slug}', caption))
        + sec('brief', f'<div class="split"><div><p class="label">{brief_label}</p></div><div class="body lede">{brief}</div></div>')
        + sec('built', f'<div class="split"><div><p class="label">What I built</p></div>{built_html}</div>')
        + sec('status', f'<div class="split"><div><p class="label">Where it stands</p></div><div><p class="d3">{status}</p>{try_html}</div></div>')
        + sec('start', f'<div class="split" style="align-items:center"><h2 class="d2">Want this for your business?</h2>'
                       f'<div class="ctas"><a class="btn primary" href="start.html?p={product_id}">Start {"an" if pname[0] in "AEIOU" else "a"} {pname} {ARROW}</a>'
                       f'<a class="btn" href="{product_id}.html">About {pname}</a></div></div>')
    )
    page(f'work-{slug}.html', f'{badge_text.split(" · ")[-1] if " · " in badge_text else title} | Main Stage Studio', seo or intro[:155], body, light=True)


def cases():
    case('ayesha', 'prog', 'In progress · Identity · Art by Ayesha Johar', "A painter's brand, built from her own work.",
         'Ayesha Johar is a painter, born in Mauritius and living in London. She asked for a website that sells her work and makes her a more visible artist. Before that, the brand needed saying properly: what her name means, what holds her paintings together, and how the site should feel.',
         [('Product', 'Identity, then Website'), ('Client', 'Art by Ayesha Johar'), ('Status', 'In review with Ayesha')],
         'The brief',
         '<p>In her words, the site is there "to sell, and to be a more visible artist". Someone landing on it should feel calm, like they are seeing something original and can relate to it. The look she asked for: colourful, elegant, sophisticated, and approachable at the same time.</p>'
         '<p>So the work had to start with the paintings, not with a template.</p>',
         [('The work, read closely', 'Five bodies of work found in her paintings: Sacred, Nature, World, Witness and Love. Each one becomes a room on the site.'),
          ('Her name and her line', 'Johar, in her own statement: jewel, courage and ultimate sacrifice. The line, in her own words: "Beauty is a form of resistance."'),
          ('A brand direction document', 'Written for her, now in its third version as her answers came in, so every decision traces back to something she said.'),
          ('Website directions', 'Several full directions, each with a home page, a room for every body of work, an about page and a way to buy. Colours are sampled from her paintings, not chosen for her.')],
         'Ayesha is choosing a direction on a private link now. Nothing is final until she says so.',
         'Art by Ayesha Johar: website directions, in review', 'identity', film='ayesha')
    case('sable', 'self', 'Self-initiated · Identity · Sable', 'An identity built around a character and a world.',
         'Sable is a character I created to run the Identity process end to end with no client in the room: a young musician from London, soft and sharp at once. The brief, the name, the look and the moving image all came out of one idea.',
         [('Product', 'Identity'), ('Client', 'None: self-initiated'), ('Made', 'May 2026')],
         'The idea',
         '<p>Sable contains contradictions and does not resolve them for you. Soul and grit. Open in the music, guarded in the world. The brand had to live in that tension instead of flattening it.</p>',
         [('The wordmark', 'Her name in a wide-tracked lowercase serif, with london beneath it in gold. No icon. The name carries itself.'),
          ('Colour', 'Bone leads, intimate and unguarded. Night takes over as the site deepens into the music. Gold runs through both, never in charge.'),
          ('The album cover', 'One thin line of light across black. The same restraint as the wordmark.'),
          ('The homepage and the walk-out', 'Her site and a short moving piece that ends on its hero, so the brand is shown in use, not on a board.')],
         'Self-initiated, so nobody paid for it. It shows the process and what comes out of it.',
         'Sable, self-initiated: homepage, album cover, homepage on Night', 'identity')
    case('conveyancing', 'demo', 'Demo, fictional client · Platform · Conveyancing', 'The whole cost, before they instruct.',
         'A client onboarding journey for Thackray Vane, a fictional firm of conveyancing solicitors. A buyer goes from enquiry to instructed matter in one sitting, with the checks the firm is obliged to run built into the journey instead of chased by email afterwards.',
         [('Product', 'Platform'), ('Sector', 'Residential conveyancing'), ('Status', 'Working demo, open to try')],
         'The problem',
         '<p>Before a firm can act on a purchase it has to check identity and source of funds, assess money-laundering risk, rule out a conflict, send a client care letter and take money on account. Get one wrong and it is a regulatory problem, not a design one.</p>'
         '<p>Done by hand, that is a person remembering every rule, for every enquiry, on a busy Friday. A nicer enquiry form does not change that. The rules have to live in the journey.</p>',
         [('The whole cost, up front', 'The fee and every disbursement, itemised with VAT, before a client commits to anything. There is no way for the page to show a headline fee instead.'),
          ('A conflict stops the journey', 'If the other side has already approached the firm, the journey ends there, with the reason on the page. No continue button.'),
          ('The chain, drawn as a sequence', 'A conveyance is five stages, so the site shows a numbered rail. The client always knows where they are and what happens next.'),
          ('Identity and source of funds, once', 'Done in the same sitting, with a signed record at the end, instead of a chase for documents over email.')],
         'A working demo, not a mock-up. The rules fire against what you choose, and the panel beside the journey shows which rule asked for what.',
         'Thackray Vane, a fictional firm: the journey, then the fees', 'platform', DEMO_JOURNEY + 'thackray')
    case('accountancy', 'demo', 'Demo, fictional client · Platform · Accountancy', 'Booked, signed and paid, in one sitting.',
         'A new-client intake journey for Marbury Hale, a fictional firm of chartered accountants. Becoming a client happens in one visit instead of five separate handoffs, and the line the practice must draw around regulated advice cannot quietly drop out of a proposal.',
         [('Product', 'Platform'), ('Sector', 'Chartered accountancy'), ('Status', 'Working demo, open to try')],
         'The problem',
         '<p>A practice rarely loses a new client to bad design. It loses them between the enquiry and the engagement: a call to book, an email with the engagement letter, a chase for the signature, another call for the deposit. Every extra step is a chance for someone with three other quotes open to not get round to it.</p>',
         [('One sitting, not five handoffs', 'Book a slot, pass the risk questions, read and sign the engagement letter and authorise the deposit, all in the same visit.'),
          ('The advice boundary, kept automatically', 'The practice cannot give investment, pension or insurance advice, so every advisory engagement carries a scope statement that cannot be removed at proposal stage.'),
          ('Every question traces to a rule', 'Beside the journey, each question the client was asked and the numbered rule that required it. Ask why something was asked, and the answer is on screen.'),
          ('The record commits when the client does', 'The signed letter is fingerprinted, timestamped and filed the moment the client sees their confirmation. Nothing waits for someone to file it later.')],
         'A working demo, not a mock-up. The rules fire against what you choose, the signature is real for the run, and so is the reference you get at the end.',
         'Marbury Hale, a fictional practice: the site, then the fee schedule', 'platform', DEMO_JOURNEY + 'marbury')
    case('clinic', 'demo', 'Demo, fictional client · Platform · Clinic', 'Consent that stands up in a file review.',
         'A booking and consent journey for Vera Aesthetics, a fictional nurse-led clinic. Not a scheduler with a form bolted on: signatures that hold up as evidence, a screening step that can decline or reroute a booking, and a rule that will not let anyone book a prescription treatment without a consultation first.',
         [('Product', 'Platform'), ('Sector', 'Medical aesthetics'), ('Status', 'Working demo, open to try')],
         'The problem',
         '<p>A clinic handles health data, consent that has to stand up later, and medicines it is not allowed to name in public. A generic booking tool with a PDF consent form does not touch any of that.</p>'
         '<p>The clinic needs to open the record for any booking and show exactly what was asked, what was signed, and when.</p>',
         [('Consultation before treatment', 'Pick a prescription treatment with no consultation on record and the journey sends you to a consultation instead, with the reason on the page.'),
          ('Signatures that stand up', 'A drawn or typed signature, each clause acknowledged and timestamped, and the signed document fingerprinted so it can be checked later.'),
          ('Photo consent kept separate', 'Consent to treatment and consent to before-and-after photos are two signatures, because refusing one must never mean losing the other.'),
          ('Medicines never named', 'Prescription medicines cannot be advertised, so the site, the journey and the confirmation use a public treatment name instead.')],
         'A working demo, not a mock-up. The rules fire against what you choose, and every booking ends with a record the clinic can open and show.',
         'Vera Aesthetics, a fictional clinic: the site, then the treatments', 'platform', DEMO_JOURNEY + 'vera')


# Career logos (make-logos.py, sources in brand/career-logos/SOURCES.md): broadcast, then financial services.
# Career history only: never shown as MSS clients. Optional third value: an optical size nudge for heavy or light marks.
CAREER = [('universal', 'Universal Pictures'), ('discovery', 'Discovery Channel'), ('bbc', 'BBC', .8), ('rte', 'RTÉ', .9),
          ('nickelodeon', 'Nickelodeon'), ('technicolor', 'Technicolor'), ('mobil', 'Mobil Oil', .75), ('barclays', 'Barclays'),
          ('lloyds-bank', 'Lloyds Bank'), ('virgin-money', 'Virgin Money'), ('chase-uk', 'Chase UK'), ('10x-banking', '10x Banking'),
          ('newday', 'NewDay', 1.15), ('argos-pay', 'Argos Pay', .7)]


def logo_h(f, k=1):
    """Display height for a logo: wide wordmarks shorter, compact marks taller, so each carries about the same weight."""
    from PIL import Image
    w, h = Image.open(os.path.join(A, f'logo-{f}.webp')).size
    return round(k * min(40, max(16, 24 * (3.2 / (w / h)) ** .5)))


def about():
    beliefs = ['Good technology should be accessible, not kept for the enterprise.', 'You should own what you pay for. Code, content, customer records.', 'Prices belong on the page.',
               'Nothing goes live until you give the cue.']
    body = (
        sec('intro', '<div class="split wide-left" style="align-items:end"><div><p class="label">About</p>'
                     '<h1 class="d1" style="margin-top:20px;font-size:clamp(48px,8vw,120px)">I\'m Os. I founded Main Stage Studio.</h1></div>'
                     '<div class="framed" style="max-width:420px"><img class="portrait" src="assets/os-akhtar-mono-4x5-oct26c.webp" alt="Os Akhtar, black and white portrait" width="800" height="1000"></div></div>', 'first')
        + sec('career', '<div class="split"><div><p class="label">Before MSS</p></div><div class="body lede">'
                        '<p>I spent ten years in broadcast technology, launching TV channels across three continents, where a mistake goes out live to everyone at once. Then over a decade in financial services: banking, lending and wealth platforms, building the onboarding and identity systems that millions of customers go through to open an account. Systems that weren\'t allowed to fail.</p>'
                        '<p>That same discipline goes into everything I build for you.</p>'
                        '<div class="logos"><p class="label">Worked for and with, before MSS</p>'
                        + ''.join(f'<img src="assets/logo-{f}.webp" alt="{n}" style="--h:{logo_h(f, *k)}px" loading="lazy">' for f, n, *k in CAREER) + '</div></div></div>')
        + sec('why', '<div class="split"><div><p class="label">Why MSS exists</p></div><div class="body lede">'
                     "<p>Big organisations run on systems that are checked, recorded and signed off before anything goes live. That standard shouldn't need a big organisation's budget. My mission is to put enterprise-grade systems, and the thinking behind them, in the hands of founders.</p>"
                     "<p>I kept seeing good businesses rent their own front door. Their site, their list and their records sat with someone else, and every change cost a ticket and an invoice. I'd rather build things you can run without me. If you keep paying me, it should be because the work is good, not because you're locked in.</p></div></div>")
        + sec('beliefs', '<div class="split"><div><p class="label">What I believe</p></div><ol class="beliefs">'
                         + ''.join(f'<li><span>0{i}</span><span>{b}</span></li>' for i, b in enumerate(beliefs, 1)) + '</ol></div>')
        + sec('one-studio', '<div class="split"><div><p class="label">Founder-led</p></div><div class="body lede">'
                             "<p>You work with me directly. I lead every project and make the calls that matter, from the first conversation to the handover.</p>"
                             "<p>The studio runs the way large organisations run their systems: the same tools, checks and sign-off on every job, so it grows with the work without the standard slipping. As it grows, you keep the founder. I'm drawn to people whose work means something beyond the commercial.</p></div></div>")
        + sec('close', f'<div class="split" style="align-items:center"><h2 class="d2">If what you\'re building matters to you, it matters here.</h2>'
                       f'<div class="ctas"><a class="btn primary" href="start.html">Start a project {ARROW}</a></div></div>')
    )
    page('about.html', 'About Os Akhtar | Main Stage Studio', "Twenty years building systems that weren't allowed to fail. Now the same standard, for founders.", body)


def start():
    opts = ''.join(f'<label class="opt"><input type="checkbox" name="need" value="{v}"><span>{n}</span></label>'
                   for n, v in [('Review', 'review'), ('Identity', 'identity'), ('Website', 'website'), ('Campaign', 'campaign'),
                                ('Content', 'content'), ('Platform', 'platform'), ('Care', 'care'), ('Not sure yet', 'not-sure-yet')])
    form = (
        '<form class="form" novalidate>'
        f'<fieldset><legend class="label">Choose one or more</legend><div class="opts">{opts}</div></fieldset>'
        '<div class="two"><div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" required></div>'
        '<div class="field"><label for="f-biz">Business name</label><input id="f-biz" name="business" autocomplete="organization"></div></div>'
        '<div class="two"><div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>'
        '<div class="field"><label for="f-site">Website, if you have one (optional)</label><input id="f-site" name="website" type="url" inputmode="url"></div></div>'
        '<div class="field"><label for="f-what">What\'s going on?</label><p class="hint" id="f-what-hint">A few lines is plenty. What\'s not working, and what you\'d like instead.</p>'
        '<textarea id="f-what" name="what" aria-describedby="f-what-hint"></textarea></div>'
        '<div class="field"><label for="f-when">When do you need it?</label><select id="f-when" name="when">'
        '<option>As soon as possible</option><option>In the next three months</option><option>Just looking</option></select></div>'
        f'<div><button class="btn primary" type="submit">Send {ARROW}</button>'
        '<p class="muted" style="margin-top:14px;font-size:14px">I\'ll use these details to reply to you and nothing else. <a class="inline-link" href="#">Privacy notice</a></p></div>'
        '</form>'
        '<div class="done" role="status"><p class="d3">Got it.</p><p class="muted" style="margin-top:10px">I read everything that comes in and reply within two working days. If it\'s simpler to talk, my reply will include a link to book a Soundcheck.</p></div>'
    )
    body = (
        sec('intro', '<p class="label">Start</p><h1 class="d1" style="margin-top:20px;font-size:clamp(48px,8vw,120px)">What do you need?</h1>', 'first')
        + sec('form', form)
    )
    page('start.html', 'Start a project | Main Stage Studio', 'Tell me what you need. I reply within two working days.', body)


home(); product_pages(); pricing(); how(); work(); puremed(); cases(); about(); start()
print('built:', ', '.join(sorted(f for f in os.listdir(HERE) if f.endswith('.html'))))
