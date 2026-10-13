/* Stage films: the cue films that have no tool to capture (13 Oct 2026, Os's call: code-directed).
   Same grammar as the captured films (engine.js): open on black, Tungsten finds one thing, a mono
   label top left, one action, the Spike corners, a closing card on black. No product UI is drawn:
   these are type, light and paper, so nothing here poses as a screenshot (media-plan rule 1).

     node render-stage.js door|care|review|cues [--still 4.2]

   door    home Problem: tickets slide under a locked door and pile up
   care    Care: a month's run, one line lit at a time
   review  Review: house lights up on the four things you keep
   cues    home How it works: five cue lamps; yours holds on standby until you press it

   Writes ../out-v6/<film>-cue.{mp4,webm,webp}. */
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const FPS = 30, W = 1920, H = 1200;
const SPIKE = '<svg viewBox="0 0 40 40"><path d="M5 17V5H17" stroke="#FFB21A" stroke-width="5" stroke-linecap="square" fill="none"/></svg>';
const SPIKE_BR = '<svg viewBox="0 0 40 40"><path d="M35 23V35H23" stroke="#FFB21A" stroke-width="5" stroke-linecap="square" fill="none"/></svg>';

// shared look: the spotlight, the mono label, the closing card (engine.js values)
const BASE = `
html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#12110F;color:#F3F1EC}
*{box-sizing:border-box}
.layer{position:absolute;inset:0;pointer-events:none}
#mono{position:absolute;left:80px;top:72px;font:500 26px/1 'Geist Mono',monospace;letter-spacing:.14em;color:#F3F1EC;opacity:0;z-index:5}
#note{position:absolute;left:80px;bottom:64px;font:500 20px/1 'Geist Mono',monospace;letter-spacing:.14em;color:#8C8981;opacity:0;z-index:5}
#black{background:#12110F;z-index:6}
#card{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding-left:180px;opacity:0;z-index:7}
#card p{margin:0 0 64px;font:500 24px/1 'Geist Mono',monospace;letter-spacing:.16em;color:#8C8981}
#card h2{margin:0;font-family:Archivo;font-weight:800;font-stretch:118%;font-size:200px;line-height:.92;letter-spacing:-.02em;color:#F3F1EC;position:relative;display:inline-block;align-self:flex-start;padding:0 20px 0 6px;white-space:pre-line}
#card h2 svg{position:absolute;width:56px;height:56px}
#card .tl{left:-34px;top:-30px}#card .br{right:-26px;bottom:-34px}
.spike{position:absolute;width:64px;height:64px;opacity:0}
`;
const CARD = `<div id="mono"></div><div id="note"></div><div class="layer" id="black"></div>
<div id="card"><p id="cardLabel"></p><h2><span id="cardWord"></span><span class="tl" style="position:absolute;width:56px;height:56px;left:-34px;top:-30px">${SPIKE}</span><span class="br" style="position:absolute;width:56px;height:56px;right:-26px;bottom:-34px">${SPIKE_BR}</span></h2></div>`;

// shared timing helpers, injected into the page
const HELPERS = `
const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const cl = (x, a=0, b=1) => Math.max(a, Math.min(b, x));
const k = (t, a, d=.4) => ease(cl((t - a) / d));          // 0 -> 1 from a over d
const win = (t, a, b, f=.3) => cl((t - a) / f) * (1 - cl((t - b + f) / f)); // on between a and b
const $ = id => document.getElementById(id);
function spot(el, x, y, rx, ry){ el.style.background = 'radial-gradient(ellipse '+rx+'px '+ry+'px at '+x+'px '+y+'px, rgba(18,17,15,0) 0%, rgba(18,17,15,0) 46%, rgba(18,17,15,.55) 78%, rgba(18,17,15,.93) 100%)'; }
function warm(el, x, y, rx, ry, o){ el.style.background = 'radial-gradient(ellipse '+rx+'px '+ry+'px at '+x+'px '+y+'px, rgba(255,178,26,0) 40%, rgba(255,178,26,.07) 70%, rgba(255,178,26,0) 96%)'; el.style.opacity = .55*o; }
function common(t, S){
  $('black').style.opacity = 1 - S.light(t);
  const lab = S.labels.find(l => t >= l[0] && t < l[1]);
  $('mono').textContent = lab ? lab[2] : ''; $('mono').style.opacity = lab ? win(t, lab[0], lab[1], .25) : 0;
  $('note').textContent = S.note ? S.note[2] : ''; $('note').style.opacity = S.note ? win(t, S.note[0], S.note[1]) : 0;
  const c = S.card, ck = cl((t - c.from)/.35) * (1 - cl((t - c.to)/.45));
  $('card').style.opacity = ck; $('card').style.transform = 'translateY(' + 24*(1 - cl((t - c.from)/.35)) + 'px)';
  $('cardLabel').textContent = c.label; $('cardWord').textContent = c.word;
}
`;

// ── the films ────────────────────────────────────────────────────────────────
const FILMS = {};

/* door: a locked door across the top, a line of light under it. Tickets slide out of the gap, faster
   and faster, and pile up in the spot. The lights go; the card answers the Problem headline. */
FILMS.door = {
  dur: 10, poster: 5.2,
  tickets: [
    ['#4471', 'Change the opening hours', 'Waiting 3 days'], ['#4472', 'Swap the hero photo', 'Waiting 2 days'],
    ['#4475', 'Add the new price', 'Quote attached'], ['#4478', 'Fix a typo on Treatments', 'In the queue'],
    ['#4480', 'Update the team page', 'Waiting'], ['#4483', 'Change one word', 'Invoice attached'],
    ['#4486', 'Add the Christmas hours', 'Waiting'], ['#4489', 'Move the booking button', 'Scoping'],
  ],
  html() {
    const slips = this.tickets.map((x, i) => `<div class="slip" id="s${i}"><b>TICKET ${x[0]}</b><span>${x[1]}</span><i>${x[2]}</i></div>`).join('');
    return `<style>
#door{position:absolute;left:0;right:0;top:0;height:300px;background:linear-gradient(#1F1D1A,#1A1816)}
#door:after{content:'';position:absolute;left:0;right:0;bottom:0;height:2px;background:#2E2B27}
#gap{position:absolute;left:0;right:0;top:300px;height:5px;background:#FFB21A;filter:blur(1.5px);opacity:0}
#gapglow{position:absolute;left:0;right:0;top:296px;height:160px;background:linear-gradient(rgba(255,178,26,.16),rgba(255,178,26,0));opacity:0}
#handle{position:absolute;left:1420px;top:150px;width:120px;height:18px;border-radius:9px;background:#3A3631;transform-origin:16px 9px}
#handle:before{content:'';position:absolute;left:-6px;top:-21px;width:44px;height:60px;border-radius:6px;background:#2E2B27}
.slip{position:absolute;left:0;top:0;width:520px;padding:26px 30px 24px;background:#ECE8DF;color:#12110F;box-shadow:0 18px 40px rgba(0,0,0,.45);display:grid;gap:12px;opacity:0;transform-origin:50% 0}
.slip b{font:500 18px/1 'Geist Mono',monospace;letter-spacing:.14em;color:#5E5B55}
.slip span{font:700 38px/1.05 Archivo;font-stretch:112%;letter-spacing:-.01em}
.slip i{font:500 18px/1 'Geist Mono',monospace;letter-spacing:.12em;text-transform:uppercase;font-style:normal;color:#5E5B55}
</style>
<div id="door"><div id="handle"></div></div><div id="gapglow"></div><div id="gap"></div>
${slips}<div class="layer" id="spot"></div><div class="layer" id="warm" style="mix-blend-mode:screen"></div>${CARD}`;
  },
  script: `
const T = [1.6, 2.5, 3.2, 3.75, 4.2, 4.55, 4.85, 5.1];
const LAND = [[700,560,-4],[1000,620,5],[620,700,2],[930,760,-7],[780,640,9],[1060,830,-3],[560,860,6],[860,900,-10]];
const S = {
  light: t => k(t, 0, .8) * (1 - k(t, 6.0, .7)),
  labels: [[.6, 2.6, 'MONDAY 09:12 · ONE WORD TO CHANGE'], [2.6, 4.3, 'WEDNESDAY · STILL WAITING'], [4.3, 6.2, 'FRIDAY · INVOICE ATTACHED']],
  card: { from: 6.9, to: 9.55, label: 'YOUR SITE · YOUR KEYS', word: 'Your own\\nfront door.' },
};
window.frame = t => {
  common(t, S);
  // the owner tries the handle: it dips and springs back, twice
  const h = Math.sin(cl((t - .9) / .5) * Math.PI) * 14 + Math.sin(cl((t - 1.15) / .4) * Math.PI) * 9;
  $('handle').style.transform = 'rotate(' + h + 'deg)';
  $('gap').style.opacity = .75 * S.light(t); $('gapglow').style.opacity = S.light(t);
  T.forEach((a, i) => {
    const e = $('s' + i), p = k(t, a, .7), [x, y, r] = LAND[i];
    e.style.opacity = cl((t - a) / .12) * S.light(t);
    // out of the gap (y 300, flat to the floor), then skid to where it lands
    e.style.transform = 'translate(' + (x - 260 + (1 - p) * 60) + 'px,' + (300 + (y - 300) * p - 40 * (1 - p)) + 'px) rotate(' + r * p + 'deg) scaleY(' + (.15 + .85 * p) + ')';
    e.style.zIndex = 2 + i;
  });
  const cy = 300 + 400 * k(t, 1.4, 3);
  spot($('spot'), 960, cy, 1150, 820); warm($('warm'), 960, cy, 1000, 700, S.light(t));
};`,
};

/* care: a month's run as a running order. A date ticks through October; each line lights in turn and
   gets its Tungsten tick and a plain mono word. The small change is the one that waits for "go". */
FILMS.care = {
  dur: 10, poster: 6.4,
  rows: [['Hosting', 'UP'], ['Backups', 'TAKEN'], ['Security updates', 'APPLIED'], ['Email sending', 'SENDING'],
         ['A small change: the new price', 'DONE · YOU SAID GO'], ['The monthly check', 'WRITTEN UP']],
  html() {
    const rows = this.rows.map((r, i) => `<div class="row" id="r${i}"><span class="n">0${i + 1}</span><span class="t">${r[0]}</span><span class="dot"></span><span class="w">${r[1]}</span></div>`).join('');
    return `<style>
#date{position:absolute;left:180px;top:300px;font:800 260px/1 Archivo;font-stretch:118%;letter-spacing:-.03em;color:#F3F1EC}
#month{position:absolute;left:190px;top:580px;font:500 30px/1 'Geist Mono',monospace;letter-spacing:.16em;color:#8C8981}
#list{position:absolute;left:760px;top:250px;width:1020px;border-top:1px solid #2E2B27}
.row{display:grid;grid-template-columns:60px 1fr 28px 250px;align-items:center;gap:20px;height:116px;border-bottom:1px solid #2E2B27}
.n{font:500 20px/1 'Geist Mono',monospace;color:#8C8981;letter-spacing:.1em}
.t{font:700 42px/1 Archivo;font-stretch:108%;white-space:nowrap;color:#5E5B55}
.dot{width:16px;height:16px;border-radius:50%;background:#FFB21A;opacity:0;justify-self:center}
.w{font:500 20px/1 'Geist Mono',monospace;letter-spacing:.14em;color:#8C8981;opacity:0;text-align:right}
</style><div id="date">01</div><div id="month">OCTOBER · THE RUN</div><div id="list">${rows}</div>
<div class="layer" id="spot"></div><div class="layer" id="warm" style="mix-blend-mode:screen"></div>${CARD}`;
  },
  script: `
const A = [1.2, 2.0, 2.8, 3.6, 4.4, 5.6];
const S = {
  light: t => k(t, 0, .8) * (1 - k(t, 6.6, .7)),
  labels: [[.6, 6.5, 'CARE · EVERY MONTH']],
  note: [4.4, 5.5, 'THE SMALL CHANGE WAITS FOR YOUR GO'],
  card: { from: 7.4, to: 9.55, label: 'EVERY MONTH · IN PLAIN ENGLISH', word: 'Kept\\nrunning.' },
};
window.frame = t => {
  common(t, S);
  const day = Math.round(1 + 30 * cl((t - .8) / 5.2));
  $('date').textContent = String(day).padStart(2, '0');
  A.forEach((a, i) => {
    const on = k(t, a, .35);
    $('r' + i).querySelector('.t').style.color = on > .5 ? '#F3F1EC' : '#5E5B55';
    $('r' + i).querySelector('.dot').style.opacity = on; $('r' + i).querySelector('.dot').style.transform = 'scale(' + (.4 + .6 * on) + ')';
    $('r' + i).querySelector('.w').style.opacity = on;
  });
  // the spot walks down the list, one line at a time
  const i = A.reduce((n, a, j) => t >= a - .2 ? j : n, 0), y = 250 + 58 + 116 * i;
  const prev = 250 + 58 + 116 * Math.max(0, i - 1), m = k(t, A[i] - .2, .35);
  const cy = prev + (y - prev) * m;
  spot($('spot'), 1300, cy, 1500, 520); warm($('warm'), 1300, cy, 1100, 300, S.light(t));
};`,
};

/* review: one spot in the dark on the week, then the house lights snap up on the four things you keep.
   Three lines answer the question; the last one is the point. */
FILMS.review = {
  dur: 10, poster: 4.8,
  docs: [['01', 'Findings', 'In plain English'], ['02', 'Brand guidelines', 'Tidied up or written down'], ['03', 'Campaign calendar', 'The next three months'], ['04', 'The plan', 'What to build, in order, costed']],
  html() {
    const docs = this.docs.map((d, i) => `<div class="doc" id="d${i}"><span class="sk tl">${SPIKE}</span><span class="sk br">${SPIKE_BR}</span><b>${d[0]}</b><h3>${d[1]}</h3><p>${d[2]}</p></div>`).join('');
    return `<style>
#week{position:absolute;left:0;right:0;top:540px;text-align:center;font:500 30px/1 'Geist Mono',monospace;letter-spacing:.2em;color:#F3F1EC}
#house{background:#1F1D1A}
#docs{position:absolute;left:180px;right:180px;top:250px;display:grid;grid-template-columns:repeat(4,1fr);gap:36px}
.doc{position:relative;height:430px;background:#26231F;border:1px solid #2E2B27;padding:38px 32px;display:flex;flex-direction:column;gap:18px;opacity:0}
.doc b{font:500 20px/1 'Geist Mono',monospace;color:#8C8981;letter-spacing:.12em}
.doc h3{margin:auto 0 0;font:800 50px/1 Archivo;font-stretch:116%;letter-spacing:-.01em;color:#F3F1EC}
.doc p{margin:0;font:400 24px/1.3 Archivo;color:#8C8981}
.sk{position:absolute;width:44px;height:44px;opacity:0}.sk.tl{left:-16px;top:-16px}.sk.br{right:-16px;bottom:-16px}
#lines{position:absolute;left:180px;top:780px;display:flex;gap:56px;font:800 64px/1 Archivo;font-stretch:118%;letter-spacing:-.02em}
#lines span{opacity:0;color:#8C8981}#lines span:last-child{color:#F3F1EC}
</style><div class="layer" id="house" style="opacity:0"></div><div id="week">WEEK ONE · REVIEW</div><div id="docs">${docs}</div>
<div id="lines"><span>What's working.</span><span>What isn't.</span><span>What's next.</span></div>
<div class="layer" id="spot"></div>${CARD}`;
  },
  script: `
const UP = 2.0;
const S = {
  light: t => k(t, 0, .8) * (1 - k(t, 6.7, .7)),
  labels: [[UP + .3, 6.6, 'ONE WEEK · FOUR THINGS YOU KEEP']],
  card: { from: 7.4, to: 9.55, label: 'ONE WEEK · YOURS TO KEEP', word: "What's\\nnext." },
};
window.frame = t => {
  common(t, S);
  // house lights: a hard snap with one flicker, the way working lights come on
  const fl = t < UP ? 0 : t < UP + .06 ? 1 : t < UP + .12 ? .35 : 1;
  $('house').style.opacity = fl * S.light(t);
  $('week').style.opacity = 1 - cl((t - UP) / .15);
  for (let i = 0; i < 4; i++) {
    const e = $('d' + i), on = t < UP ? 0 : 1;
    e.style.opacity = on; e.style.transform = 'translateY(' + 20 * (1 - k(t, UP + .1 + i * .12, .5)) + 'px)';
    e.querySelectorAll('.sk').forEach(s => { s.style.opacity = k(t, UP + .6 + i * .15, .2); s.style.transform = 'scale(' + (1.35 - .35 * k(t, UP + .6 + i * .15, .2)) + ')'; });
  }
  document.querySelectorAll('#lines span').forEach((s, i) => { const a = 3.6 + i * .7; s.style.opacity = k(t, a, .3); s.style.transform = 'translateY(' + 16 * (1 - k(t, a, .3)) + 'px)'; });
  // before the snap, one spot on the week; after it, the spot opens out
  const o = k(t, UP, .25);
  spot($('spot'), 960, 560 + 40 * o, 380 + 1600 * o, 220 + 1100 * o);
  $('spot').style.opacity = 1 - .7 * o;
};`,
};

/* cues: the five steps as cue lamps on a stage manager's panel. They light in turn; 03, yours,
   holds red on standby until it is pressed, then goes green, and the rest follow. */
FILMS.cues = {
  dur: 10, poster: 5.4,
  steps: [['01', 'Soundcheck'], ['02', 'Rehearsal'], ['03', 'Your cue'], ['04', 'Showtime'], ['05', 'The run']],
  html() {
    const lamps = this.steps.map((s, i) => `<div class="cue" id="c${i}"><div class="lamp"><i></i></div><b>${s[0]}</b><span>${s[1]}</span></div>`).join('');
    return `<style>
#panel{position:absolute;left:180px;right:180px;top:330px;display:grid;grid-template-columns:repeat(5,1fr);gap:0;border-top:1px solid #2E2B27;border-bottom:1px solid #2E2B27}
.cue{display:flex;flex-direction:column;gap:22px;padding:56px 0 52px 8px;border-left:1px solid #2E2B27}
.cue:first-child{border-left:0}
.lamp{width:96px;height:96px;border-radius:50%;background:#1F1D1A;border:2px solid #2E2B27;position:relative}
.lamp i{position:absolute;inset:-2px;border-radius:50%;opacity:0}
.cue b{font:500 22px/1 'Geist Mono',monospace;letter-spacing:.14em;color:#8C8981}
.cue span{font:800 40px/1 Archivo;font-stretch:116%;letter-spacing:-.01em;color:#5E5B55}
#state{position:absolute;left:180px;top:860px;font:500 28px/1 'Geist Mono',monospace;letter-spacing:.16em;color:#8C8981}
#ring{position:absolute;width:150px;height:150px;margin:-75px 0 0 -75px;border:3px solid #FFB21A;border-radius:50%;opacity:0}
#cursor{position:absolute;left:0;top:0;width:52px;height:52px;opacity:0}
</style><div id="panel">${lamps}</div><div id="state"></div><div id="ring"></div>
<svg id="cursor" viewBox="0 0 24 24" fill="none"><path d="M5 2.5 19.5 11.2l-6.4.9-3.2 6.1z" fill="#F3F1EC" stroke="#12110F" stroke-width="1.3" stroke-linejoin="round"/></svg>
<div class="layer" id="spot"></div>${CARD}`;
  },
  script: `
const ON = [1.0, 1.7, 2.4, 5.0, 5.6], GO = 4.6;
const TUNG = 'radial-gradient(circle at 50% 45%, #FFD27A 0%, #FFB21A 45%, rgba(255,178,26,.25) 100%)';
const RED = 'radial-gradient(circle at 50% 45%, #FF8A73 0%, #E5402A 45%, rgba(229,64,42,.25) 100%)';
const GREEN = 'radial-gradient(circle at 50% 45%, #CFF0C4 0%, #9BD48A 45%, rgba(155,212,138,.25) 100%)';
const S = {
  light: t => k(t, 0, .8) * (1 - k(t, 6.6, .7)),
  labels: [[.6, 6.5, 'HOW IT WORKS · FIVE CUES']],
  card: { from: 7.4, to: 9.55, label: 'NOTHING GOES LIVE WITHOUT YOU', word: 'Your cue.' },
};
const cx = i => 180 + 8 + 48 + i * (1560 / 5), cy = 330 + 56 + 48;
window.frame = t => {
  common(t, S);
  for (let i = 0; i < 5; i++) {
    const L = $('c' + i).querySelector('.lamp i'), name = $('c' + i).querySelector('span');
    let bg = TUNG, o = k(t, ON[i], .2);
    if (i === 2) {
      if (t < GO) { bg = RED; o = t < ON[2] ? 0 : .55 + .45 * (Math.sin((t - ON[2]) * 5) * .5 + .5); }
      else { bg = GREEN; o = 1; }
    }
    L.style.background = bg; L.style.opacity = o;
    L.style.boxShadow = o > .1 ? '0 0 ' + (60 * o) + 'px ' + (i === 2 ? (t < GO ? 'rgba(229,64,42,.45)' : 'rgba(155,212,138,.45)') : 'rgba(255,178,26,.4)') : 'none';
    name.style.color = o > .5 ? '#F3F1EC' : '#5E5B55';
  }
  $('state').textContent = t < ON[2] ? '' : t < GO ? '03 · STANDBY · WAITING FOR YOU' : '03 · GO';
  $('state').style.color = t < GO ? '#8C8981' : '#F3F1EC';
  $('state').style.opacity = t < ON[2] ? 0 : 1;
  // the press: a cursor comes in on standby, presses 03, leaves
  const p = k(t, 3.4, 1.0), out = k(t, 5.0, .6), x = cx(2) + 380 * (1 - p) + 300 * out, y = cy + 240 * (1 - p) + 200 * out;
  $('cursor').style.opacity = t > 3.3 && t < 5.7 ? 1 : 0; $('cursor').style.transform = 'translate(' + (x - 5) + 'px,' + (y - 4) + 'px)';
  const r = (t - GO) / .45; $('ring').style.opacity = r >= 0 && r < 1 ? 1 - r : 0;
  $('ring').style.left = cx(2) + 'px'; $('ring').style.top = cy + 'px'; $('ring').style.transform = 'scale(' + (.4 + Math.max(0, r)) + ')';
  const sx = t < GO ? cx(2) : cx(2) + (cx(4) - cx(2)) * k(t, 4.9, 1.0) * .5;
  spot($('spot'), sx, 520, 1250, 640);
};`,
};

async function main() {
  const name = process.argv[2], f = FILMS[name];
  if (!f) throw new Error('film: ' + Object.keys(FILMS).join('|'));
  const si = process.argv.indexOf('--still'), still = si > 0 ? +process.argv[si + 1] : null;
  const out = path.join(__dirname, '..', 'out-v6', name + '-cue');
  const work = path.join(__dirname, '.render-' + name);
  fs.rmSync(work, { recursive: true, force: true }); fs.mkdirSync(work);
  const doc = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..800&family=Geist+Mono:wght@400;500&display=block">
<style>${BASE}</style></head><body>${f.html()}<script>${HELPERS}${f.script}</script></body></html>`;
  fs.writeFileSync(path.join(work, 'film.html'), doc);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + path.join(work, 'film.html'));
  await page.evaluate(async () => { await document.fonts.ready; await document.fonts.load('800 200px Archivo'); await document.fonts.load('500 20px "Geist Mono"'); });
  await page.waitForTimeout(800);
  const shoot = async (t, file) => { await page.evaluate(t => window.frame(t), t); await page.screenshot({ path: file, type: 'jpeg', quality: 95 }); };
  if (still !== null) { await shoot(still, out + '-test.jpg'); await browser.close(); fs.rmSync(work, { recursive: true, force: true }); return console.log(out + '-test.jpg'); }
  const n = Math.round(f.dur * FPS);
  for (let i = 0; i < n; i++) { await shoot(i / FPS, path.join(work, String(i).padStart(4, '0') + '.jpg')); if (i % 30 === 0) process.stdout.write('.'); }
  await browser.close();
  const seq = path.join(work, '%04d.jpg');
  const ff = args => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args]);
  ff(['-framerate', FPS, '-i', seq, '-vf', 'scale=1600:1000:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out + '.mp4']);
  ff(['-framerate', FPS, '-i', seq, '-vf', 'scale=1600:1000:flags=lanczos', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-an', out + '.webm']);
  execFileSync('cwebp', ['-quiet', '-q', '82', '-resize', '1600', '1000', path.join(work, String(Math.round(f.poster * FPS)).padStart(4, '0') + '.jpg'), '-o', out + '.webp']);
  fs.rmSync(work, { recursive: true, force: true });
  console.log('\n' + ['mp4', 'webm', 'webp'].map(e => `${out}.${e} ${Math.round(fs.statSync(out + '.' + e).size / 1024)}KB`).join('\n'));
}
main().catch(e => { console.error(e); process.exit(1); });
