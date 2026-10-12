/* Cue film engine: turns captured stills (page px rects in a timeline.json) plus a score of
   keyframes into an exact-frame film. Used by render-content.js; the Website pilot (render.js)
   predates it and keeps its own copy of the same look.

   A score is plain data:
     dur, src (frames dir), page {w, h}, dsf
     frame(t)            -> index into timeline.frames
     camera  [[t, {x, y, w}], ...]        page px, centre and width; eased between keys
     spot    [[t, {x, y, rx, ry}], ...]   page px for the centre, screen px for the size
     cursor  [[t, {x, y} | null], ...]    page px; null hides it
     rings   [[t, {x, y}], ...]           a click
     corners [{ from, to, rect }]         Spike corners snap in at `from`, fade at `to`
     labels  [[from, to, text | (t) => text]]
     lights  [[t, 0..1], ...]             0 = black, 1 = lit
     card    { from, to, label, word }    the closing card on black */
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const FPS = 30, W = 1920, H = 1200;
const SPIKE_TL = '<path d="M5 17V5H17" stroke="#FFB21A" stroke-width="5" stroke-linecap="square" fill="none"/>';
const SPIKE_BR = '<path d="M35 23V35H23" stroke="#FFB21A" stroke-width="5" stroke-linecap="square" fill="none"/>';

const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;

/* Value of a keyframe track at t. Objects lerp field by field; a null key holds null. */
function track(keys, t) {
  if (!keys.length) return null;
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i], [t0, v0] = keys[i - 1];
    if (t <= t1) {
      if (v0 === null || v1 === null) return t < t1 ? v0 : v1;
      const k = ease(clamp((t - t0) / (t1 - t0 || 1)));
      if (typeof v0 === 'number') return lerp(v0, v1, k);
      const o = {}; for (const f of Object.keys(v0)) o[f] = lerp(v0[f], v1[f], k); return o;
    }
  }
  return keys[keys.length - 1][1];
}

function html(tl, src) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..800&family=Geist+Mono:wght@400;500&display=block">
<style>
  html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#12110F}
  #world{position:absolute;left:0;top:0;width:${tl.w}px;height:${tl.h}px;transform-origin:0 0}
  #world img{position:absolute;inset:0;width:100%;height:100%;visibility:hidden}
  #world img.on{visibility:visible}
  .layer{position:absolute;inset:0;pointer-events:none}
  #warm{mix-blend-mode:screen}
  #cursor{position:absolute;left:0;top:0;width:44px;height:44px}
  .ring{position:absolute;left:0;top:0;width:60px;height:60px;margin:-30px 0 0 -30px;border:3px solid #FFB21A;border-radius:50%;opacity:0}
  .corner{position:absolute;left:0;top:0;width:64px;height:64px;opacity:0}
  #mono{position:absolute;left:80px;top:72px;font:500 26px/1 'Geist Mono',monospace;letter-spacing:.14em;color:#F3F1EC;opacity:0;text-shadow:0 0 18px rgba(18,17,15,.9)}
  #card{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding-left:180px;opacity:0}
  #card p{margin:0 0 64px;font:500 24px/1 'Geist Mono',monospace;letter-spacing:.16em;color:#8C8981}
  #card h2{margin:0;font-family:Archivo;font-weight:800;font-stretch:118%;font-size:200px;line-height:.92;letter-spacing:-.02em;color:#F3F1EC;position:relative;display:inline-block;align-self:flex-start;padding:0 20px 0 6px}
  #card h2 svg{position:absolute;width:56px;height:56px}
  #card .tl{left:-34px;top:-30px}#card .br{right:-26px;bottom:-34px}
</style></head><body>
<div id="world">${tl.frames.map((f, i) => `<img src="file://${path.join(src, f.file)}">`).join('')}</div>
<div class="layer" id="spot"></div><div class="layer" id="warm"></div>
<svg class="corner" id="ctl" viewBox="0 0 40 40">${SPIKE_TL}</svg><svg class="corner" id="cbr" viewBox="0 0 40 40">${SPIKE_BR}</svg>
<div class="ring" id="r1"></div>
<svg id="cursor" viewBox="0 0 24 24" fill="none"><path d="M5 2.5 19.5 11.2l-6.4.9-3.2 6.1z" fill="#F3F1EC" stroke="#12110F" stroke-width="1.3" stroke-linejoin="round"/></svg>
<div id="mono"></div>
<div class="layer" id="black" style="background:#12110F"></div>
<div id="card"><p id="cardLabel"></p><h2><span id="cardWord"></span><svg class="tl" viewBox="0 0 40 40">${SPIKE_TL}</svg><svg class="br" viewBox="0 0 40 40">${SPIKE_BR}</svg></h2></div>
</body></html>`;
}

function state(score, tl, t) {
  const cam0 = track(score.camera, t);
  const ch = cam0.w * H / W;
  const cam = { x: clamp(cam0.x, cam0.w / 2, tl.w - cam0.w / 2), y: clamp(cam0.y, ch / 2, tl.h - ch / 2), w: cam0.w };
  const s = W / cam.w, ox = W / 2 - cam.x * s, oy = H / 2 - cam.y * s;
  const scr = p => p && { x: ox + p.x * s, y: oy + p.y * s };
  const sp = track(score.spot, t);
  const ring = score.rings.map(([rt, p]) => ({ k: (t - rt) / .45, p })).find(r => r.k >= 0 && r.k < 1);
  const c = score.corners.find(c => t >= c.from && t < c.to + .3);
  const ck = c ? clamp((t - c.from) / .22) * (1 - clamp((t - c.to) / .3)) : 0;
  const lab = score.labels.find(([a, b]) => t >= a && t < b);
  const card = score.card;
  return {
    world: `translate(${ox}px,${oy}px) scale(${s})`, img: score.frame(t),
    spot: { ...scr(sp), rx: sp.rx, ry: sp.ry }, light: track(score.lights, t),
    cursor: scr(track(score.cursor, t)),
    ring: ring ? { ...scr(ring.p), k: ring.k } : null,
    corners: ck, cbox: c ? { ...scr(c.rect), w: c.rect.w * s, h: c.rect.h * s } : null, cscale: 1.35 - .35 * clamp(c ? (t - c.from) / .22 : 0),
    mono: lab ? (typeof lab[2] === 'function' ? lab[2](t) : lab[2]) : '', monoOn: lab ? clamp((t - lab[0]) / .25) * (1 - clamp((t - lab[1] + .25) / .25)) : 0,
    card: clamp((t - card.from) / .35) * (1 - clamp((t - card.to) / .45)), cardY: 24 * (1 - clamp((t - card.from) / .35)),
    cardLabel: card.label, cardWord: card.word,
  };
}

const APPLY = st => {
  const $ = id => document.getElementById(id);
  $('world').style.transform = st.world;
  document.querySelectorAll('#world img').forEach((im, i) => im.classList.toggle('on', i === st.img));
  const g = (a, b) => `radial-gradient(ellipse ${st.spot.rx}px ${st.spot.ry}px at ${st.spot.x}px ${st.spot.y}px, ${a}, ${b})`;
  $('spot').style.background = g('rgba(18,17,15,0) 0%, rgba(18,17,15,0) 46%, rgba(18,17,15,.55) 78%', 'rgba(18,17,15,.93) 100%');
  $('warm').style.background = g('rgba(255,178,26,0) 40%, rgba(255,178,26,.07) 70%', 'rgba(255,178,26,0) 96%');
  $('warm').style.opacity = .55 * st.light;
  $('black').style.opacity = 1 - st.light;
  const c = $('cursor');
  if (st.cursor) { c.style.display = 'block'; c.style.transform = `translate(${st.cursor.x - 4}px,${st.cursor.y - 3}px)`; } else c.style.display = 'none';
  const r = $('r1');
  if (st.ring) { r.style.opacity = 1 - st.ring.k; r.style.transform = `translate(${st.ring.x}px,${st.ring.y}px) scale(${.4 + st.ring.k})`; } else r.style.opacity = 0;
  if (st.cbox) {
    const b = st.cbox, pad = 14;
    $('ctl').style.transform = `translate(${b.x - pad - 8}px,${b.y - pad - 8}px) scale(${st.cscale})`;
    $('cbr').style.transform = `translate(${b.x + b.w + pad - 56}px,${b.y + b.h + pad - 56}px) scale(${st.cscale})`;
  }
  $('ctl').style.opacity = st.corners; $('cbr').style.opacity = st.corners;
  $('mono').textContent = st.mono; $('mono').style.opacity = st.monoOn;
  $('card').style.opacity = st.card; $('card').style.transform = `translateY(${st.cardY}px)`;
  $('cardLabel').textContent = st.cardLabel; $('cardWord').textContent = st.cardWord;
};

/* Render the score. still: one time in seconds -> <out>-test.jpg; else the full film. */
async function render(score, out, { still = null, crf = [24, 38] } = {}) {
  const tl = JSON.parse(fs.readFileSync(path.join(score.src, 'timeline.json'), 'utf8'));
  tl.w = score.page.w; tl.h = score.page.h;
  const work = path.join(path.dirname(score.src), '.render');
  fs.rmSync(work, { recursive: true, force: true }); fs.mkdirSync(work);
  fs.writeFileSync(path.join(work, 'compositor.html'), html(tl, score.src));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + path.join(work, 'compositor.html'));
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });
  await page.evaluate(() => document.fonts.load('800 200px Archivo'));
  await page.waitForTimeout(800);
  const shoot = async (t, file) => { await page.evaluate(APPLY, state(score, tl, t)); await page.screenshot({ path: file, type: 'jpeg', quality: 95 }); };
  if (still !== null) { const f = out + '-test.jpg'; await shoot(still, f); await browser.close(); return [f]; }
  const n = Math.round(score.dur * FPS);
  for (let i = 0; i < n; i++) { await shoot(i / FPS, path.join(work, String(i).padStart(4, '0') + '.jpg')); if (i % 30 === 0) process.stdout.write('.'); }
  await browser.close();
  const seq = path.join(work, '%04d.jpg');
  const ff = args => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args]);
  ff(['-framerate', FPS, '-i', seq, '-vf', 'scale=1600:1000:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf[0]), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out + '.mp4']);
  ff(['-framerate', FPS, '-i', seq, '-vf', 'scale=1600:1000:flags=lanczos', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(crf[1]), '-row-mt', '1', '-an', out + '.webm']);
  execFileSync('cwebp', ['-quiet', '-q', '82', '-resize', '1600', '1000', path.join(work, String(Math.round(score.poster * FPS)).padStart(4, '0') + '.jpg'), '-o', out + '.webp']);
  fs.rmSync(work, { recursive: true, force: true });
  return ['mp4', 'webm', 'webp'].map(e => `${out}.${e} ${Math.round(fs.statSync(out + '.' + e).size / 1024)}KB`);
}

module.exports = { render, FPS };
