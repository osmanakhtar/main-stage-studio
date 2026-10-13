/* Hero film v2, "the mark does the work": same sources as v1 (frames-hero, capture-hero.js), one actor.

     node render-hero-v2.js              -> ../out-v6/hero-cue-v2.{mp4,webm,webp}
     node render-hero-v2.js --still 3.2  -> ../out-v6/hero-cue-v2-test.jpg

   The two Spike corners never leave the screen and nothing cuts. The film opens on the 40-grid mark, the
   corners pull apart and do the design work: a sampling frame over Ayesha's painting (each stop is the real
   pixel nearest a colour her site kit sampled), a selection box across her five directions, the box that
   keeps PureMed's own brand, a crop that reshapes for each Content Studio style, then a marker running
   Vera's journey. Everything collapses back into the mark, so the loop joins. The corners are the only
   thing that moves at any moment; everything else lights or dims around them.
   Concept and honesty notes: 01_mss/website/prototype-v6/hero-film-concepts.md. */
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

// --format 4x5: the phone cut, same score and sources, its own layout (portrait frame, bigger type)
const PORTRAIT = process.argv.includes('--format') && process.argv[process.argv.indexOf('--format') + 1] === '4x5';
const FPS = 30, W = PORTRAIT ? 1200 : 1920, H = PORTRAIT ? 1500 : 1200, DUR = 21.4, POSTER = 6.4;
const OUT_W = PORTRAIT ? 800 : 1600, OUT_H = PORTRAIT ? 1000 : 1000;
const SRC = path.join(__dirname, 'frames-hero');
const M = JSON.parse(fs.readFileSync(path.join(SRC, 'manifest.json'), 'utf8'));
const img = f => 'file://' + path.join(SRC, f);
const post = s => { const p = M.puremed.posts.find(x => x.style === s); if (!p) throw new Error('no post style ' + s); return p; };

// ---- layout (px on the frame: 1920 x 1200, or 1200 x 1500 for the phone cut) ----
const R = (x, y, w, h) => ({ x, y, w, h });
const L = PORTRAIT ? {
  MARK: R(510, 660, 180, 180), PAINT: R(64, 190, 1072, 807),
  sw: i => ({ x: 64 + i * 272, y: 1040 }), swSize: 150, swt: { x: 64, y: 1250 },
  dir: { w: 480, h: 300 }, dirXY: [[100, 180], [620, 180], [100, 525], [620, 525], [360, 870]], ALLDIR: R(100, 180, 1000, 990),
  LOGO: R(300, 578, 600, 344), SPEC_A: R(64, 230, 1072, 420), SPEC_B: R(64, 720, 1072, 420),
  HOME: R(64, 190, 1072, 960), homeImgW: 1750, homeOrigin: '0% 40%', HEAD: R(220, 495, 500, 290),
  QUOTE: R(64, 400, 1072, 520), quoteSize: 76, P45: R(240, 200, 720, 900), P11: R(150, 200, 900, 900),
  rows: [220, 520, 700, 960], cardX: 500, cardW: 636, shotW: 380,
  CARDS: [R(500, 220, 380, 238), R(500, 520, 636, 110), R(500, 700, 636, 232), R(500, 960, 636, 209)],
  RAIL: { x: 120, y: 238, h: 740, vertical: true },
  type: { label: 40, note: 30, line: 52, small: 26, spec: 28, subj: 38, subjSm: 30, cap: 24, pad: 64 },
} : {
  MARK: R(885, 525, 150, 150), PAINT: R(150, 240, 850, 640),
  sw: i => ({ x: 1130, y: 260 + i * 140 }), swSize: 112, swt: { x: 1130, y: 260 + 4 * 140 + 10 },
  dir: { w: 348, h: 218 }, dirXY: [0, 1, 2, 3, 4].map(i => [(W - (5 * 348 + 4 * 18)) / 2 + i * (348 + 18), 440]), ALLDIR: R((W - (5 * 348 + 4 * 18)) / 2, 440, 5 * 348 + 4 * 18, 218),
  LOGO: R(750, 480, 420, 241), SPEC_A: R(220, 330, 640, 440), SPEC_B: R(1060, 330, 640, 440),
  HOME: R(310, 180, 1300, 782), homeImgW: 1300, homeOrigin: '6% 52%', HEAD: R(380, 300, 470, 260),
  QUOTE: R(160, 430, 1500, 230), quoteSize: 64, P45: R(680, 230, 560, 700), P11: R(640, 260, 640, 640),
  rows: null, cardX: null, cardW: 400, shotW: 400, cardL: [110, 550, 990, 1430], cardT: 520,
  CARDS: [R(110, 520, 400, 250), R(550, 520, 400, 96), R(990, 520, 400, 290), R(1430, 520, 400, 131)],
  RAIL: { x: 110, y: 450, w: 1320 },
  type: { label: 32, note: 24, line: 46, small: 24, spec: 22, subj: 34, subjSm: 28, cap: 22, pad: 80 },
};
const { MARK, PAINT, ALLDIR, LOGO, SPEC_A, SPEC_B, HOME, HEAD, QUOTE, P45, P11, CARDS, RAIL } = L, HOME_CROP = 34;
const DIR = L.dir, dirR = i => R(L.dirXY[i][0], L.dirXY[i][1], DIR.w, DIR.h);
const SWP = [0, 1, 2, 3].map(L.sw);
const REC = { x: 70, y: 160, w: 700, h: 230 };
const CARD_W = L.cardW;
// Vera's journey: a row across the frame, or a column down the phone frame
const cardXY = i => PORTRAIT ? [L.cardX, L.rows[i]] : [L.cardL[i], L.cardT];
const nodeXY = i => PORTRAIT ? [RAIL.x, L.rows[i] + 18] : [L.cardL[i], RAIL.y + 1];
const labelXY = i => PORTRAIT ? [RAIL.x + 44, L.rows[i]] : [L.cardL[i], RAIL.y - 62];

// ---- where the sampled colours really are in the painting (nearest pixel, inner 80%) ----
function samplePoints() {
  const sw = 200, sh = Math.round(sw * 1506 / 2000);
  const raw = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', path.join(SRC, M.ayesha.painting), '-vf', `scale=${sw}:${sh}`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']);
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const used = [];
  return M.ayesha.colours.map(c => {
    const [r, g, b] = hex(c); let best = null;
    for (let y = Math.round(sh * .1); y < sh * .9; y++) for (let x = Math.round(sw * .1); x < sw * .9; x++) {
      if (used.some(u => Math.hypot(u[0] - x, u[1] - y) < 28)) continue;   // keep the stops apart
      const o = (y * sw + x) * 3, d = (raw[o] - r) ** 2 + (raw[o + 1] - g) ** 2 + (raw[o + 2] - b) ** 2;
      if (!best || d < best[2]) best = [x, y, d];
    }
    used.push(best);
    return { x: PAINT.x + best[0] / sw * PAINT.w, y: PAINT.y + best[1] / sh * PAINT.h };
  });
}
const PTS = samplePoints();
const S = 110, sR = p => R(p.x - S / 2, p.y - S / 2, S, S);

// ---- the score: the actor's keyframes ----
const T = { open: 1.1, opened: 1.8, stops: [2.2, 2.65, 3.1, 3.55], hold: .22, dirs: [4.0, 4.35, 4.7, 5.05, 5.4], all: 5.9,
  logo: 7.0, specA: 8.0, specB: 8.8, home: 9.9, quote: 12.0, p45: 13.0, p11: 14.1, cards: [16.2, 17.0, 17.7, 18.4], mark: 20.6 };
const BOX = [
  [0, MARK], [T.open, MARK], [T.opened, PAINT],
  ...T.stops.flatMap((a, i) => [[a, sR(PTS[i])], [a + T.hold, sR(PTS[i])]]),
  ...T.dirs.flatMap((a, i) => [[a, dirR(i)], [a + .12, dirR(i)]]), [T.all, ALLDIR], [6.7, ALLDIR],
  [T.logo, LOGO], [7.6, LOGO], [T.specA, SPEC_A], [8.4, SPEC_A], [T.specB, SPEC_B], [9.3, SPEC_B], [9.55, HEAD], [T.home, HOME], [11.4, HOME],
  [T.quote, QUOTE], [12.6, QUOTE], [T.p45, P45], [13.6, P45], [T.p11, P11], [15.6, P11],
  ...T.cards.flatMap((a, i) => [[a, CARDS[i]], [a + .3, CARDS[i]]]), [20.0, CARDS[3]],
  [T.mark, MARK], [DUR, MARK],
];
const LOGOW = [[0, 1], [T.open, 1], [1.5, 0], [20.1, 0], [T.mark, 1], [DUR, 1]];   // 1 = the mark's own proportions
const INK = [[0, 0], [15.7, 0], [16.0, 1], [20.0, 1], [20.3, 0], [DUR, 0]];         // 0 Tungsten, 1 Stage Black (on paper)

const css = `
html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#12110F;color:#F3F1EC;font-family:Archivo}
*{box-sizing:border-box}
.a{position:absolute;opacity:0}
.mono{font:500 22px/1.2 'Geist Mono',monospace;letter-spacing:.14em;text-transform:uppercase}
#label{left:${L.type.pad}px;top:${L.type.pad - 8}px;font-size:${L.type.label}px;z-index:8;max-width:${W - 2 * L.type.pad}px}
#note{left:${L.type.pad}px;bottom:60px;font-size:${L.type.note}px;z-index:8}
#line{left:${L.type.pad}px;bottom:${PORTRAIT ? 112 : 118}px;font-size:${L.type.line}px;line-height:1.2;max-width:${W - 2 * L.type.pad}px;letter-spacing:.1em;z-index:8;display:flex;align-items:center;gap:22px}
#lamp{flex:none}
#lamp{width:28px;height:28px;border-radius:50%;background:#E5402A;box-shadow:0 0 30px rgba(229,64,42,.55)}
#actor{position:absolute;inset:0;z-index:9;overflow:visible}
#glow,#spot{position:absolute;inset:0;pointer-events:none}
#spot{z-index:4}#glow{z-index:3;mix-blend-mode:screen}
#paper{position:absolute;inset:0;background:#F3F1EC;z-index:5;opacity:0}
.sh{box-shadow:0 30px 80px rgba(0,0,0,.55)}
.sw{display:flex;align-items:center;gap:26px;z-index:2}
.sw i{display:block;width:${L.swSize}px;height:${L.swSize}px}
${PORTRAIT ? '.sw{flex-direction:column;align-items:flex-start;gap:14px;font-size:' + L.type.small + 'px}' : ''}
.dir{z-index:2}.dir img{display:block;width:${DIR.w}px;height:${DIR.h}px;object-fit:cover}
.dir p{margin:18px 0 0;color:#8C8981;font-size:${L.type.small}px}
.spec{background:#1F1D1A;padding:44px 48px;z-index:2}
.spec .chips{display:flex;gap:18px;margin:34px 0 40px}.spec .chips i{display:block;width:120px;height:120px}
.spec p{margin:0 0 14px;color:#C9C5BC;font-size:${L.type.spec}px}.spec p b{display:inline-block;width:150px;font-weight:500;color:#8C8981}
#home{overflow:hidden;z-index:2}
#home img{position:absolute;left:0;top:${-HOME_CROP * L.homeImgW / 1440}px;width:${L.homeImgW}px;transform-origin:${L.homeOrigin}}
#quote{font-weight:500;font-size:${L.quoteSize}px;line-height:1.15;color:#F3F1EC;padding:24px 30px;z-index:2}
#quote span{display:block;margin-top:30px;color:#8C8981}
.post{z-index:2}
.rail{height:3px;background:#12110F;transform-origin:0 50%;z-index:6}
.node{width:21px;height:21px;margin:-9px 0 0 -10px;border-radius:50%;background:#12110F;z-index:6}
.node.go{background:#FFB21A;box-shadow:0 0 0 3px #12110F}
.nl{color:#12110F;z-index:6;font-size:${L.type.small - 2}px;${PORTRAIT ? 'max-width:300px;line-height:1.35' : ''}}
${PORTRAIT ? '.rail{width:3px;height:' + RAIL.h + 'px;transform-origin:50% 0}' : ''}
.card{z-index:6;color:#12110F}
.card img.shot{display:block;width:${L.shotW}px;box-shadow:0 14px 40px rgba(18,17,15,.18)}
.card .subj{font-weight:600;font-size:${L.type.subj}px;line-height:1.2;margin:0 0 18px}
.card .subj.sm{font-size:${L.type.subjSm}px;font-weight:500;padding-bottom:16px;border-bottom:1px solid #D9D5CC}
.card .crop{position:relative;width:${CARD_W}px;height:${CARDS[3].h}px;overflow:hidden;box-shadow:0 14px 40px rgba(18,17,15,.18)}
.card .crop img{position:absolute;left:${-REC.x * CARD_W / REC.w}px;top:${-REC.y * CARD_W / REC.w}px;width:${1600 * CARD_W / REC.w}px}
.card .cap{margin-top:16px;color:#5E5B55;font-size:${L.type.cap}px}
`;
const at = r => `left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px`;
const html = `
<div id="glow"></div>
<img id="paint" class="a sh" src="${img(M.ayesha.painting)}" style="${at(PAINT)};z-index:2">
${M.ayesha.colours.map((c, i) => `<div class="a sw mono" id="sw${i}" style="left:${SWP[i].x}px;top:${SWP[i].y}px"><i style="background:${c}"></i>${c}</div>`).join('')}
<div id="swt" class="a mono" style="left:${L.swt.x}px;top:${L.swt.y}px;color:#8C8981">Sampled from ${M.ayesha.title}</div>
${M.ayesha.directions.map((d, i) => `<div class="a dir" id="dir${i}" style="left:${dirR(i).x}px;top:${dirR(i).y}px;width:${DIR.w}px"><img class="sh" src="${img(d.file)}"><p class="mono">${d.name === 'Version 2' ? 'Version 2' : 'Direction ' + d.name}</p></div>`).join('')}
<img id="pmlogo" class="a" src="${img(M.puremed.logo)}" style="${at(LOGO)};z-index:2">
${['retired', 'kept'].map((k, i) => { const s = M.puremed[k]; return `<div class="a spec" id="spec${i}" style="${at(i ? SPEC_B : SPEC_A)}">
<p class="mono" style="color:#F3F1EC">${s.label}</p><div class="chips">${s.colours.map(c => `<i style="background:${c}"></i>`).join('')}</div>
<p class="mono"><b>Colour</b>${s.colours.join(' · ')}</p><p class="mono"><b>Display</b>${s.display}</p><p class="mono"><b>Body</b>${s.body}</p></div>`; }).join('')}
<div id="home" class="a sh" style="${at(HOME)}"><img src="${img(M.puremed.home)}"></div>
<div id="quote" class="a" style="${at(QUOTE)}">"The most important part of any treatment happens before it."<span class="mono">From her post copy · 5 Aug 2026</span></div>
<img id="postA" class="a post sh" src="${img(post('classic').file)}" style="${at(P45)}">
<img id="postB" class="a post sh" src="${img(post('statement').file)}" style="${at(P45)}">
<img id="postC" class="a post sh" src="${img(post('signature').file)}" style="${at(P11)}">
<div id="spot"></div>
<div id="paper"></div>
<div id="rail" class="a rail" style="left:${RAIL.x - (PORTRAIT ? 1 : 0)}px;top:${RAIL.y}px;${PORTRAIT ? "" : "width:" + RAIL.w + "px"}"></div>
${[0, 1, 2, 3].map(i => `<div class="a node${i === 3 ? ' go' : ''}" id="node${i}" style="left:${nodeXY(i)[0]}px;top:${nodeXY(i)[1]}px"></div>`).join('')}
${['Day 0 · Sign-up', 'Day 0 · The guide', 'Days 2 to 6 · Follow-ups', 'She books · Series stops'].map((t, i) => `<div class="a nl mono" id="nl${i}" style="left:${labelXY(i)[0]}px;top:${labelXY(i)[1]}px">${t}</div>`).join('')}
<div class="a card" id="card0" style="left:${cardXY(0)[0]}px;top:${cardXY(0)[1]}px;width:${CARD_W}px"><img class="shot" src="${img(M.vera.optin)}"><div class="cap mono">Her opt-in page</div></div>
<div class="a card" id="card1" style="left:${cardXY(1)[0]}px;top:${cardXY(1)[1]}px;width:${CARD_W}px"><p class="subj">${M.vera.subjects[0]}</p><div class="cap mono">Sent the moment she signs up</div></div>
<div class="a card" id="card2" style="left:${cardXY(2)[0]}px;top:${cardXY(2)[1]}px;width:${CARD_W}px">${M.vera.subjects.slice(1).map(s => `<p class="subj sm">${s}</p>`).join('')}<div class="cap mono">One a day or two apart</div></div>
<div class="a card" id="card3" style="left:${cardXY(3)[0]}px;top:${cardXY(3)[1]}px;width:${CARD_W}px"><div class="crop"><img src="${img(M.vera.record)}"></div><div class="cap mono">Marked as booked · emails stop</div></div>
<svg id="actor" viewBox="0 0 ${W} ${H}"><path id="ctl" fill="none" stroke-linecap="square"/><path id="cbr" fill="none" stroke-linecap="square"/></svg>
<div id="label" class="a mono"></div><div id="note" class="a mono"></div>
<div id="line" class="a mono"><span id="lamp"></span><span id="lineText"></span></div>`;

const script = `
const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const cl = (x, a=0, b=1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const k = (t, a, d=.35) => ease(cl((t - a) / d));
const win = (t, a, b, f=.3) => cl((t - a) / f) * (1 - cl((t - b + f) / f));
const $ = id => document.getElementById(id);
const set = (id, o, tf) => { const e = $(id); e.style.opacity = o; e.style.transform = tf || 'none'; };
function track(keys, t) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i], [t0, v0] = keys[i - 1];
    if (t <= t1) { const e = ease(cl((t - t0) / (t1 - t0 || 1)));
      if (typeof v0 === 'number') return lerp(v0, v1, e);
      const o = {}; for (const f in v0) o[f] = lerp(v0[f], v1[f], e); return o; }
  }
  return keys[keys.length - 1][1];
}
const BOX = ${JSON.stringify(BOX)}, LOGOW = ${JSON.stringify(LOGOW)}, INK = ${JSON.stringify(INK)}, T = ${JSON.stringify(T)};
const PTS = ${JSON.stringify(PTS)}, SWP = ${JSON.stringify(SWP)}, RAIL = ${JSON.stringify(RAIL)}, S = ${S};
const W = ${W}, H = ${H};
const mix = (a, b, e) => { const p = h => [1,3,5].map(i => parseInt(h.slice(i, i+2), 16)), A = p(a), B = p(b); return 'rgb(' + A.map((v, i) => Math.round(lerp(v, B[i], e))).join(',') + ')'; };
// reveal an element only inside the actor's box while it opens
const clip = (id, r, b) => { $(id).style.clipPath = 'inset(' + Math.max(0, b.y - r.y) + 'px ' + Math.max(0, r.x + r.w - b.x - b.w) + 'px ' + Math.max(0, r.y + r.h - b.y - b.h) + 'px ' + Math.max(0, b.x - r.x) + 'px)'; };
const unclip = id => { $(id).style.clipPath = 'none'; };
const R = ${JSON.stringify({ PAINT, HOME, P45, P11 })};

const LABELS = [[1.4, 6.9, '01 Identity · Art by Ayesha Johar'], [7.0, 11.5, '02 Website · PureMed Aesthetics'],
  [11.7, 15.6, '03 Content · PureMed Aesthetics'], [15.9, 19.9, '04 Campaign and Platform · Vera']];
const NOTES = [[1.4, 6.9, 'Real work · in progress'], [7.0, 11.5, 'Real work · live'], [11.7, 15.6, 'Real work · live'], [15.9, 19.9, 'Demo · a fictional clinic']];
const LINES = [[5.9, 6.9, 'Five routes from her own work. Her call.', true], [8.9, 11.4, 'Kept her brand. Rebuilt the site.'],
  [14.2, 15.5, 'Her words. The style she approved.'], [18.5, 19.9, 'Designed like a page. Built like a system.']];

window.frame = t => {
  const b = track(BOX, t), lw = track(LOGOW, t), ink = track(INK, t);
  // House Lights grow out of the frame and shrink back into it (a wipe, never a grey crossfade)
  const pe = k(t, 15.6, .55) * (1 - k(t, 19.95, .5)), paperOn = pe > 0 ? 1 : 0;
  $('paper').style.opacity = paperOn;
  $('paper').style.clipPath = 'inset(' + lerp(b.y, 0, pe) + 'px ' + lerp(W - b.x - b.w, 0, pe) + 'px ' + lerp(H - b.y - b.h, 0, pe) + 'px ' + lerp(b.x, 0, pe) + 'px)';

  // the actor: two corners round the box; at lw = 1 they are exactly the mark (arms .4d, stroke d/6)
  const d = Math.min(b.w, b.h), arm = lerp(Math.min(.4 * d, 64), .4 * d, lw), sw = lerp(Math.min(d / 6, 8), d / 6, lw), pad = lerp(16, 0, lw);
  const x0 = b.x - pad, y0 = b.y - pad, x1 = b.x + b.w + pad, y1 = b.y + b.h + pad;
  const col = mix('#FFB21A', '#12110F', ink);
  for (const [id, dd] of [['ctl', 'M' + x0 + ' ' + (y0 + arm) + 'V' + y0 + 'H' + (x0 + arm)], ['cbr', 'M' + x1 + ' ' + (y1 - arm) + 'V' + y1 + 'H' + (x1 - arm)]]) {
    const p = $(id); p.setAttribute('d', dd); p.setAttribute('stroke', col); p.setAttribute('stroke-width', sw); }

  // light follows the actor: a soft stage around the box, a warm wash on the mark
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2, rx = b.w * .85 + 820, ry = b.h * .85 + 560;
  $('spot').style.background = 'radial-gradient(ellipse ' + rx + 'px ' + ry + 'px at ' + cx + 'px ' + cy + 'px, rgba(18,17,15,0) 0%, rgba(18,17,15,0) 55%, rgba(18,17,15,.45) 82%, rgba(18,17,15,.85) 100%)';
  $('spot').style.opacity = 1;
  $('glow').style.background = 'radial-gradient(ellipse ' + (b.w * .6 + 260) + 'px ' + (b.h * .6 + 220) + 'px at ' + cx + 'px ' + cy + 'px, rgba(255,178,26,.10) 0%, rgba(255,178,26,0) 70%)';
  $('glow').style.opacity = .4 + .6 * lw;

  // mono layer
  const lab = LABELS.find(l => t >= l[0] && t < l[1]), note = NOTES.find(l => t >= l[0] && t < l[1]), line = LINES.find(l => t >= l[0] && t < l[1]);
  const dark = t > 15.85 && t < 20.2;
  $('label').textContent = lab ? lab[2] : ''; set('label', lab ? win(t, lab[0], lab[1], .25) : 0); $('label').style.color = dark ? '#12110F' : '#F3F1EC';
  $('note').textContent = note ? note[2] : ''; set('note', note ? win(t, note[0], note[1], .25) : 0); $('note').style.color = dark ? '#5E5B55' : '#8C8981';
  $('lineText').textContent = line ? line[2] : ''; set('line', line ? win(t, line[0], line[1], .25) : 0, 'translateY(' + (line ? 14 * (1 - k(t, line[0], .3)) : 0) + 'px)');
  $('line').style.color = dark ? '#12110F' : '#F3F1EC';
  $('lamp').style.display = line && line[3] ? 'block' : 'none'; $('lamp').style.opacity = .5 + .5 * (Math.sin(t * 5) * .5 + .5);

  // 01 the painting opens out of the mark; the frame samples it; five directions, each lit as it is framed
  const paintOut = 1 - k(t, 3.8, .3);
  set('paint', cl((t - T.open) / .15) * paintOut);
  if (t < T.opened) clip('paint', R.PAINT, b); else unclip('paint');
  for (let i = 0; i < 4; i++) {
    const a = T.stops[i] + T.hold * .5, f = k(t, a, .35), p = PTS[i];
    const tx = (p.x - S / 2) - SWP[i].x, ty = (p.y - S / 2) - SWP[i].y;
    set('sw' + i, cl((t - a) / .08) * (1 - k(t, 3.9, .3)), 'translate(' + tx * (1 - f) + 'px,' + ty * (1 - f) + 'px)');
  }
  set('swt', k(t, 3.6, .2) * (1 - k(t, 3.9, .3)));
  for (let i = 0; i < 5; i++) {
    const lit = k(t, T.dirs[i] - .15, .25);
    set('dir' + i, (k(t, 3.75, .3) * (.28 + .72 * lit)) * (1 - k(t, 6.7, .3)));
  }

  // 02 her mark; the box picks the retired spec, crosses to hers and keeps it; her homepage opens from it
  set('pmlogo', k(t, 6.8, .3) * (1 - k(t, 7.6, .3)));
  const specIn = k(t, 7.6, .35), specOut = 1 - k(t, 9.3, .3);
  set('spec0', specIn * (1 - .8 * k(t, 8.4, .4)) * specOut);
  set('spec1', specIn * (t < 8.4 ? .55 : .55 + .45 * k(t, 8.5, .3)) * specOut);
  set('home', cl((t - 9.5) / .1) * (1 - k(t, 11.4, .3)));
  if (t < T.home) clip('home', R.HOME, b); else unclip('home');
  $('home').firstChild.style.transform = 'scale(' + (1 + .5 * k(t, 9.9, 1.6)) + ')';

  // 03 her words, then the crop reshapes for each style; Signature holds
  set('quote', k(t, 11.7, .3) * (1 - k(t, 12.6, .3)));
  set('postA', cl((t - 12.75) / .12) * (1 - k(t, 13.45, .3))); if (t < T.p45) clip('postA', R.P45, b); else unclip('postA');
  set('postB', k(t, 13.45, .3) * (1 - k(t, 13.85, .3)));
  set('postC', k(t, 13.85, .3) * (1 - k(t, 15.6, .3)));

  // 04 the box runs the journey; the rail draws behind it, each step lights as it is framed
  const rail = cl(RAIL.vertical ? (b.y - RAIL.y) / RAIL.h : (b.x - RAIL.x) / RAIL.w) * (t > 16.0 && t < 20.2 ? 1 : 0);
  set('rail', paperOn * (1 - k(t, 19.85, .25)), (RAIL.vertical ? 'scaleY(' : 'scaleX(') + rail + ')');
  for (let i = 0; i < 4; i++) {
    const a = T.cards[i] - .1, on = k(t, a, .3) * paperOn * (1 - k(t, 19.85, .25));
    set('node' + i, on, 'scale(' + (.4 + .6 * k(t, a, .25)) + ')');
    set('nl' + i, on);
    set('card' + i, on, 'translateY(' + (20 * (1 - k(t, a, .35))) + 'px)');
  }
};`;

async function main() {
  const si = process.argv.indexOf('--still'), still = si > 0 ? +process.argv[si + 1] : null;
  const out = path.join(__dirname, '..', 'out-v6', PORTRAIT ? 'hero-cue-v2-4x5' : 'hero-cue-v2');
  const work = path.join(__dirname, '.render-hero-v2');
  fs.rmSync(work, { recursive: true, force: true }); fs.mkdirSync(work);
  fs.writeFileSync(path.join(work, 'film.html'), `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..800&family=Geist+Mono:wght@400;500&display=block">
<style>${css}</style></head><body>${html}<script>${script}</script></body></html>`);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + path.join(work, 'film.html'));
  await page.evaluate(async () => { await document.fonts.ready; await document.fonts.load('800 200px Archivo'); await document.fonts.load('500 20px "Geist Mono"');
    await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });
  await page.waitForTimeout(800);
  const shoot = async (t, file) => { await page.evaluate(t => window.frame(t), t); await page.screenshot({ path: file, type: 'jpeg', quality: 95 }); };
  if (still !== null) { await shoot(still, out + '-test.jpg'); await browser.close(); fs.rmSync(work, { recursive: true, force: true }); return console.log(out + '-test.jpg'); }
  const n = Math.round(DUR * FPS);
  for (let i = 0; i < n; i++) { await shoot(i / FPS, path.join(work, String(i).padStart(4, '0') + '.jpg')); if (i % 30 === 0) process.stdout.write('.'); }
  await browser.close();
  const seq = path.join(work, '%04d.jpg');
  const ff = args => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args]);
  ff(['-framerate', FPS, '-i', seq, '-vf', `scale=${OUT_W}:${OUT_H}:flags=lanczos`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out + '.mp4']);
  ff(['-framerate', FPS, '-i', seq, '-vf', `scale=${OUT_W}:${OUT_H}:flags=lanczos`, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '39', '-row-mt', '1', '-an', out + '.webm']);
  execFileSync('cwebp', ['-quiet', '-q', '82', '-resize', String(OUT_W), String(OUT_H), path.join(work, String(Math.round(POSTER * FPS)).padStart(4, '0') + '.jpg'), '-o', out + '.webp']);
  fs.rmSync(work, { recursive: true, force: true });
  console.log('\n' + ['mp4', 'webm', 'webp'].map(e => `${out}.${e} ${Math.round(fs.statSync(out + '.' + e).size / 1024)}KB`).join('\n'));
}
main().catch(e => { console.error(e); process.exit(1); });
