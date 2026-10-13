/* Hero film ("Source to stage"), step 2 of 2: the score for frames-hero (capture-hero.js).

     node render-hero.js              -> ../out-v6/hero-cue.{mp4,webm,webp}
     node render-hero.js --still 11.6 -> ../out-v6/hero-cue-test.jpg

   Concept: 01_mss/website/prototype-v6/hero-film-concepts.md. Four chapters, each going source, options,
   the decision, lit result with one mono line. Opens and closes on the empty Spike mark so the loop joins.
     01 Identity   Ayesha: a painting, the colours sampled from it, five directions. No cut: she hasn't
                   chosen, so the chapter ends on "her call" with a Cue Red standby lamp.
     02 Website    PureMed: the retired rebuild spec against her own live brand; the cut keeps hers; her
                   homepage as built.
     03 Content    PureMed: one line of her copy in three Content Studio styles; the cut lands on Signature.
     04 Campaign   Vera (demo): the journey on House Lights, each step its real source.
   Client work keeps its own colours and type; MSS is only the light, the tape and the mono labels. */
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const FPS = 30, W = 1920, H = 1200, DUR = 29.0, POSTER = 11.9;
const SRC = path.join(__dirname, 'frames-hero');
const M = JSON.parse(fs.readFileSync(path.join(SRC, 'manifest.json'), 'utf8'));
const img = f => 'file://' + path.join(SRC, f);
const POSTS = M.puremed.posts.filter(p => p.style !== 'editorial');   // editorial draws an empty photo slot
const SPIKE_TL = '<path d="M5 17V5H17" stroke-width="5" stroke-linecap="square" fill="none"/>';
const SPIKE_BR = '<path d="M35 23V35H23" stroke-width="5" stroke-linecap="square" fill="none"/>';

// layout (px on the 1920 x 1200 frame)
const DIR = { w: 348, h: 218, gap: 18, top: 440 }; DIR.left = (W - (5 * DIR.w + 4 * DIR.gap)) / 2;
const SPEC = { w: 640, h: 440, top: 330, a: 220, b: 1060 };
const HOME = { w: 1300, top: 180, crop: 34 }; HOME.h = Math.round(HOME.w * (900 - HOME.crop) / 1440); HOME.left = (W - HOME.w) / 2;
const POST_H = 640, POST_TOP = 290;
const postW = p => Math.round(POST_H * p.w / p.h);
const postLefts = (() => { const ws = POSTS.map(postW), tot = ws.reduce((a, b) => a + b, 0) + 40 * (ws.length - 1); let x = (W - tot) / 2; return ws.map(w => { const l = x; x += w + 40; return l; }); })();
const CARD = { w: 400, top: 520, lefts: [110, 550, 990, 1430] };
const REC = { x: 70, y: 160, w: 700, h: 230 };           // Hannah's record, marked as booked (captured Campaign film)

const css = `
html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#12110F;color:#F3F1EC;font-family:Archivo}
*{box-sizing:border-box}
.a{position:absolute;opacity:0;will-change:transform,opacity}
.layer{position:absolute;inset:0;pointer-events:none}
.mono{font:500 22px/1.2 'Geist Mono',monospace;letter-spacing:.14em;text-transform:uppercase}
#label{left:80px;top:72px;font-size:32px;z-index:8}
#note{left:80px;bottom:60px;font-size:24px;color:#8C8981;z-index:8}
#line{left:80px;bottom:118px;font-size:46px;letter-spacing:.1em;z-index:8;display:flex;align-items:center;gap:22px}
#lamp{width:28px;height:28px;border-radius:50%;background:#E5402A;box-shadow:0 0 30px rgba(229,64,42,.55);display:none}
.spk{position:absolute;width:64px;height:64px;opacity:0;z-index:9;stroke:#FFB21A}
#black{background:#12110F;z-index:20}
#paint{left:150px;top:240px;height:640px;box-shadow:0 30px 80px rgba(0,0,0,.55)}
.sw{left:1130px;display:flex;align-items:center;gap:26px}
.sw i{display:block;width:112px;height:112px}
#swt{left:1130px;top:${260 + 4 * 140 + 10}px;color:#8C8981}
.dir{top:${DIR.top}px;width:${DIR.w}px}
.dir img{display:block;width:${DIR.w}px;height:${DIR.h}px;object-fit:cover;box-shadow:0 20px 50px rgba(0,0,0,.5)}
.dir p{margin:18px 0 0;color:#8C8981;font-size:24px}
#pmlogo{left:${(W - 420) / 2}px;top:${(H - 240) / 2}px;width:420px}
.spec{top:${SPEC.top}px;width:${SPEC.w}px;height:${SPEC.h}px;background:#1F1D1A;padding:44px 48px}
.spec .chips{display:flex;gap:18px;margin:34px 0 40px}.spec .chips i{display:block;width:120px;height:120px}
.spec p{margin:0 0 14px;color:#C9C5BC}.spec p b{display:inline-block;width:150px;font-weight:500;color:#8C8981}
#home{left:${HOME.left}px;top:${HOME.top}px;width:${HOME.w}px;height:${HOME.h}px;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.6)}
#home img{position:absolute;left:0;top:${-HOME.crop * HOME.w / 1440}px;width:${HOME.w}px;transform-origin:6% 52%}
#quote{left:180px;top:420px;width:1400px;font-weight:500;font-size:64px;line-height:1.15;font-stretch:100%;color:#F3F1EC}
#quote span{display:block;margin-top:36px;color:#8C8981}
.post{top:${POST_TOP}px;height:${POST_H}px;box-shadow:0 30px 80px rgba(0,0,0,.55);transform-origin:50% 50%}
#paper{background:#F3F1EC;z-index:5}
#rail{left:${CARD.lefts[0]}px;top:450px;width:${CARD.lefts[3] - CARD.lefts[0]}px;height:3px;background:#12110F;transform-origin:0 50%;z-index:6}
.node{top:441px;width:21px;height:21px;margin-left:-10px;border-radius:50%;background:#12110F;z-index:6}
.node.go{background:#FFB21A;box-shadow:0 0 0 3px #12110F}
.nl{top:388px;color:#12110F;z-index:6;font-size:22px}
.card{top:${CARD.top}px;width:${CARD.w}px;z-index:6;color:#12110F}
.card img.shot{display:block;width:${CARD.w}px;box-shadow:0 14px 40px rgba(18,17,15,.18)}
.card .subj{font-weight:600;font-size:34px;line-height:1.2;margin:0 0 18px}
.card .subj.sm{font-size:28px;font-weight:500;padding-bottom:16px;border-bottom:1px solid #D9D5CC}
.card .crop{position:relative;width:${CARD.w}px;height:${Math.round(REC.h * CARD.w / REC.w)}px;overflow:hidden;background:#fff;box-shadow:0 14px 40px rgba(18,17,15,.18)}
.card .crop img{position:absolute;left:${-REC.x * CARD.w / REC.w}px;top:${-REC.y * CARD.w / REC.w}px;width:${1600 * CARD.w / REC.w}px}
.card .cap{margin-top:16px;color:#5E5B55;font-size:22px}
`;

const html = `
<img id="paint" class="a" src="${img(M.ayesha.painting)}">
${M.ayesha.colours.map((c, i) => `<div class="a sw mono" id="sw${i}" style="top:${260 + i * 140}px"><i style="background:${c}"></i>${c}</div>`).join('')}
<div id="swt" class="a mono">Sampled from ${M.ayesha.title}</div>
${M.ayesha.directions.map((d, i) => `<div class="a dir" id="dir${i}" style="left:${DIR.left + i * (DIR.w + DIR.gap)}px"><img src="${img(d.file)}"><p class="mono">${d.name === 'Version 2' ? 'Version 2' : 'Direction ' + d.name}</p></div>`).join('')}

<img id="pmlogo" class="a" src="${img(M.puremed.logo)}">
${['retired', 'kept'].map((k, i) => { const s = M.puremed[k]; return `<div class="a spec" id="spec${i}" style="left:${i ? SPEC.b : SPEC.a}px">
<p class="mono" style="color:#F3F1EC">${s.label}</p><div class="chips">${s.colours.map(c => `<i style="background:${c}"></i>`).join('')}</div>
<p class="mono"><b>Colour</b>${s.colours.join(' · ')}</p><p class="mono"><b>Display</b>${s.display}</p><p class="mono"><b>Body</b>${s.body}</p></div>`; }).join('')}
<div id="home" class="a"><img src="${img(M.puremed.home)}"></div>

<div id="quote" class="a">"The most important part of any treatment happens before it."<span class="mono">From her post copy · 5 Aug 2026</span></div>
${POSTS.map((p, i) => `<img class="a post" id="post${i}" src="${img(p.file)}" style="left:${postLefts[i]}px;width:${postW(p)}px">`).join('')}

<div id="paper" class="layer a"></div>
<div id="rail" class="a"></div>
${CARD.lefts.map((x, i) => `<div class="a node${i === 3 ? ' go' : ''}" id="node${i}" style="left:${x}px"></div>`).join('')}
${['Day 0 · Sign-up', 'Day 0 · The guide', 'Days 2 to 6 · Follow-ups', 'She books · Series stops'].map((t, i) => `<div class="a nl mono" id="nl${i}" style="left:${CARD.lefts[i]}px">${t}</div>`).join('')}
<div class="a card" id="card0" style="left:${CARD.lefts[0]}px"><img class="shot" src="${img(M.vera.optin)}"><div class="cap mono">Her opt-in page</div></div>
<div class="a card" id="card1" style="left:${CARD.lefts[1]}px"><p class="subj">${M.vera.subjects[0]}</p><div class="cap mono">Sent the moment she signs up</div></div>
<div class="a card" id="card2" style="left:${CARD.lefts[2]}px">${M.vera.subjects.slice(1).map(s => `<p class="subj sm">${s}</p>`).join('')}<div class="cap mono">One a day or two apart</div></div>
<div class="a card" id="card3" style="left:${CARD.lefts[3]}px"><div class="crop"><img src="${img(M.vera.record)}"></div><div class="cap mono">Marked as booked · emails stop</div></div>

<div class="layer" id="spot" style="z-index:7"></div>
<svg class="spk" id="stl" viewBox="0 0 40 40">${SPIKE_TL}</svg><svg class="spk" id="sbr" viewBox="0 0 40 40">${SPIKE_BR}</svg>
<div id="label" class="a mono"></div><div id="note" class="a mono"></div>
<div id="line" class="a mono"><span id="lamp"></span><span id="lineText"></span></div>
<div class="layer" id="black"></div>`;

const script = `
const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const cl = (x, a=0, b=1) => Math.max(a, Math.min(b, x));
const k = (t, a, d=.4) => ease(cl((t - a) / d));
const win = (t, a, b, f=.35) => cl((t - a) / f) * (1 - cl((t - b + f) / f));
const $ = id => document.getElementById(id);
const set = (id, o, tf) => { const e = $(id); e.style.opacity = o; e.style.transform = tf || 'none'; };
const DIR = ${JSON.stringify(DIR)}, SPEC = ${JSON.stringify(SPEC)}, CARD = ${JSON.stringify(CARD)}, POST_H = ${POST_H}, POST_TOP = ${POST_TOP};
const postLefts = ${JSON.stringify(postLefts)}, postWs = ${JSON.stringify(POSTS.map(postW))}, NPOST = ${POSTS.length};
const W = ${W}, H = ${H};

const LABELS = [[1.6, 8.3, '01 Identity · Art by Ayesha Johar'], [8.6, 14.5, '02 Website · PureMed Aesthetics'],
  [14.8, 20.5, '03 Content · PureMed Aesthetics'], [20.9, 27.3, '04 Campaign and Platform · Vera']];
const NOTES = [[1.6, 8.3, 'Real work · in progress'], [8.6, 14.5, 'Real work · live'], [14.8, 20.5, 'Real work · live'], [20.9, 27.3, 'Demo · a fictional clinic']];
const LINES = [[6.0, 8.2, 'Five routes from her own work. Her call.', true], [11.4, 14.4, 'Kept her brand. Rebuilt the site.'],
  [17.6, 20.4, 'Her words. The style she approved.'], [25.1, 27.2, 'Designed like a page. Built like a system.']];

function spot(x, y, rx, ry, o) {
  const s = $('spot'); s.style.opacity = o;
  s.style.background = 'radial-gradient(ellipse '+rx+'px '+ry+'px at '+x+'px '+y+'px, rgba(18,17,15,0) 0%, rgba(18,17,15,0) 50%, rgba(18,17,15,.5) 80%, rgba(18,17,15,.9) 100%)';
}
// Spike corners round a box (x, y, w, h); they snap in from 1.35x like the hero tape
function spikes(b, o, colour, snap) {
  const sc = 1.35 - .35 * cl(snap), pad = 18;
  for (const id of ['stl', 'sbr']) { $(id).style.opacity = o; $(id).style.stroke = colour; }
  if (!b) return;
  $('stl').style.transform = 'translate(' + (b.x - pad - 8) + 'px,' + (b.y - pad - 8) + 'px) scale(' + sc + ')';
  $('sbr').style.transform = 'translate(' + (b.x + b.w + pad - 56) + 'px,' + (b.y + b.h + pad - 56) + 'px) scale(' + sc + ')';
}

window.frame = t => {
  const light = t < 27.4 ? 1 : 1;
  $('black').style.opacity = 1 - k(t, .1, .6) + k(t, 28.6, .4);

  // the mono layer
  const lab = LABELS.find(l => t >= l[0] && t < l[1]), note = NOTES.find(l => t >= l[0] && t < l[1]), line = LINES.find(l => t >= l[0] && t < l[1]);
  const onPaper = t > 20.8 && t < 27.3;
  $('label').textContent = lab ? lab[2] : ''; set('label', lab ? win(t, lab[0], lab[1], .25) : 0);
  $('label').style.color = onPaper ? '#12110F' : '#F3F1EC';
  $('note').textContent = note ? note[2] : ''; set('note', note ? win(t, note[0], note[1], .25) : 0);
  $('note').style.color = onPaper ? '#5E5B55' : '#8C8981';
  $('lineText').textContent = line ? line[2] : ''; set('line', line ? win(t, line[0], line[1], .3) : 0, 'translateY(' + (line ? 16 * (1 - k(t, line[0], .35)) : 0) + 'px)');
  $('line').style.color = onPaper ? '#12110F' : '#F3F1EC';
  $('lamp').style.display = line && line[3] ? 'block' : 'none';
  $('lamp').style.opacity = .5 + .5 * (Math.sin(t * 5) * .5 + .5);

  // open and close: the empty mark, lit
  const mark = { x: W / 2 - 180, y: H / 2 - 110, w: 360, h: 220 };
  let sp = null;
  if (t < 1.5) sp = [mark, win(t, .4, 1.5, .4), '#FFB21A', k(t, .4, .25)];
  else if (t > 27.5) sp = [mark, win(t, 27.7, 29.0, .4), '#FFB21A', k(t, 27.7, .25)];

  // 01 Identity: painting, swatches, five directions, her call
  const c1out = 1 - k(t, 8.0, .4);
  set('paint', k(t, 1.5, .5) * (1 - k(t, 4.0, .4)), 'translateX(' + (-30 * k(t, 4.0, .4)) + 'px)');
  for (let i = 0; i < 4; i++) set('sw' + i, k(t, 2.2 + .3 * i, .3) * (1 - k(t, 4.0, .4)), 'translateX(' + (-40 * (1 - k(t, 2.2 + .3 * i, .3))) + 'px)');
  set('swt', k(t, 3.4, .3) * (1 - k(t, 4.0, .4)));
  for (let i = 0; i < 5; i++) { const a = 4.3 + .3 * i; set('dir' + i, k(t, a, .45) * c1out, 'translateY(' + (50 * (1 - k(t, a, .45))) + 'px)'); }
  if (t < 4.2) spot(900, 560, 1800, 1000, k(t, 1.4, .4));
  else if (t < 8.4) { const sx = DIR.left + DIR.w / 2 + (5 * DIR.w + 4 * DIR.gap - DIR.w) * cl((t - 4.3) / 1.6); spot(t < 6 ? sx : W / 2, 560, t < 6 ? 800 : 1700, t < 6 ? 600 : 800, 1); }

  // 02 Website: her mark, two specs, the cut, her homepage
  set('pmlogo', win(t, 8.6, 9.9, .35));
  const cut2 = k(t, 11.2, .35), out2 = 1 - k(t, 12.0, .4);
  set('spec0', k(t, 9.8, .4) * (1 - .82 * cut2) * out2, 'translateY(' + (30 * (1 - k(t, 9.8, .4))) + 'px)');
  set('spec1', k(t, 10.0, .4) * out2, 'translateY(' + (30 * (1 - k(t, 10.0, .4))) + 'px)');
  if (t >= 11.2 && t < 12.3) sp = [{ x: SPEC.b, y: SPEC.top, w: SPEC.w, h: 440 }, cut2 * out2, '#FFB21A', k(t, 11.2, .25)];
  set('home', k(t, 12.2, .5) * (1 - k(t, 14.2, .4)));
  $('home').firstChild.style.transform = 'scale(' + (1 + .55 * k(t, 12.4, 2.2)) + ')';
  if (t >= 8.4 && t < 12.2) spot(t < 11.2 ? W / 2 : SPEC.b + SPEC.w / 2, 560, t < 11.2 ? 1700 : 1000, t < 11.2 ? 860 : 760, 1);
  else if (t >= 12.2 && t < 14.6) spot(W / 2, 580, 1700, 1000, 1);

  // 03 Content: her line, three styles, the cut, Signature lit
  set('quote', win(t, 14.8, 16.1, .35), 'translateY(' + (20 * (1 - k(t, 14.8, .35))) + 'px)');
  const cut3 = k(t, 17.4, .35), move = k(t, 18.3, .8), last = NPOST - 1;
  for (let i = 0; i < NPOST; i++) {
    const a = 16.0 + .25 * i, inn = k(t, a, .4), out3 = 1 - k(t, 20.2, .4);
    if (i < last) set('post' + i, inn * (1 - .85 * cut3) * (1 - k(t, 18.2, .4)) * out3, 'translateY(' + (40 * (1 - inn)) + 'px)');
    else {
      const dx = (W / 2 - (postLefts[i] + postWs[i] / 2)) * move, s = 1 + .12 * move;
      set('post' + i, inn * out3, 'translate(' + dx + 'px,' + (40 * (1 - inn)) + 'px) scale(' + s + ')');
      if (t >= 17.4 && t < 20.4) { const s2 = s, w = postWs[i] * s2, h = POST_H * s2, cx = postLefts[i] + postWs[i] / 2 + dx, cy = POST_TOP + POST_H / 2;
        sp = [{ x: cx - w / 2, y: cy - h / 2, w, h }, cut3 * out3, '#FFB21A', k(t, 17.4, .25)]; }
    }
  }
  if (t >= 14.6 && t < 20.7) spot(t < 17.4 ? W / 2 : postLefts[last] + postWs[last] / 2 + (W / 2 - (postLefts[last] + postWs[last] / 2)) * move, 610, t < 17.4 ? 1700 : 1100, t < 17.4 ? 900 : 950, 1);

  // 04 Campaign and Platform: House Lights, the journey drawn step by step
  const paper = k(t, 20.6, .4) * (1 - k(t, 27.0, .4));
  set('paper', paper);
  if (t >= 20.6 && t < 27.4) spot(W / 2, H / 2, 2000, 1400, 0);
  const rail = cl((t - 21.0) / 3.6);
  set('rail', paper, 'scaleX(' + rail + ')');
  for (let i = 0; i < 4; i++) {
    const a = 21.1 + 1.2 * i;
    set('node' + i, k(t, a, .2) * paper, 'scale(' + (.4 + .6 * k(t, a, .25)) + ')');
    set('nl' + i, k(t, a, .3) * paper);
    set('card' + i, k(t, a + .15, .45) * paper, 'translateY(' + (30 * (1 - k(t, a + .15, .45))) + 'px)');
  }
  if (t >= 25.0 && t < 27.4) { const e = $('card3'); sp = [{ x: CARD.lefts[3], y: CARD.top, w: CARD.w, h: e.offsetHeight }, k(t, 25.0, .25) * (1 - k(t, 27.0, .3)), '#12110F', k(t, 25.0, .25)]; }

  if (sp) spikes(sp[0], sp[1], sp[2], sp[3]); else spikes(null, 0, '#FFB21A', 0);
};`;

async function main() {
  const si = process.argv.indexOf('--still'), still = si > 0 ? +process.argv[si + 1] : null;
  const out = path.join(__dirname, '..', 'out-v6', 'hero-cue');
  const work = path.join(__dirname, '.render-hero');
  fs.rmSync(work, { recursive: true, force: true }); fs.mkdirSync(work);
  const doc = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..800&family=Geist+Mono:wght@400;500&display=block">
<style>${css}</style></head><body>${html}<script>${script}</script></body></html>`;
  fs.writeFileSync(path.join(work, 'film.html'), doc);
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
  ff(['-framerate', FPS, '-i', seq, '-vf', 'scale=1600:1000:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out + '.mp4']);
  ff(['-framerate', FPS, '-i', seq, '-vf', 'scale=1600:1000:flags=lanczos', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '39', '-row-mt', '1', '-an', out + '.webm']);
  execFileSync('cwebp', ['-quiet', '-q', '82', '-resize', '1600', '1000', path.join(work, String(Math.round(POSTER * FPS)).padStart(4, '0') + '.jpg'), '-o', out + '.webp']);
  fs.rmSync(work, { recursive: true, force: true });
  console.log('\n' + ['mp4', 'webm', 'webp'].map(e => `${out}.${e} ${Math.round(fs.statSync(out + '.' + e).size / 1024)}KB`).join('\n'));
}
main().catch(e => { console.error(e); process.exit(1); });
