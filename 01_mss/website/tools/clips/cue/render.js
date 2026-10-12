/* Website cue film, step 2 of 2: direct the captured frames into a 10s loop.

     node render.js                 -> ../out-v6/website-cue.{mp4,webm,webp}
     node render.js --still 5.4     -> one frame as out-v6/website-cue-test.jpg, for checking

   Every frame is rendered on its own (Playwright screenshot of a compositor page at time t),
   then ffmpeg joins them. No screen video is ever recorded, so there is no dropped frame,
   no cursor wobble and no compression smear: the cursor is drawn on an eased path, the
   camera moves over 3x stills, and the page under it is exactly what the editor showed.

   Grammar (brand-video-concepts.md §5): opens on black, Tungsten finds one thing, one
   action, one result, Spike corners snap in once, a five-word card, back to black. */
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const FPS = 30, W = 1920, H = 1200;
const SRC = path.join(__dirname, 'frames-website');
const OUTDIR = path.join(__dirname, '..', 'out-v6');
const tl = JSON.parse(fs.readFileSync(path.join(SRC, 'timeline.json'), 'utf8'));
const si = process.argv.indexOf('--still');
const STILL = si > -1 ? Number(process.argv[si + 1]) : null;

const COMPOSITOR = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..800&family=Geist+Mono:wght@400;500&display=block">
<style>
  html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#12110F}
  #world{position:absolute;left:0;top:0;width:${tl.vw}px;height:${tl.vh}px;transform-origin:0 0}
  #world img{position:absolute;inset:0;width:100%;height:100%;visibility:hidden}
  #world img.on{visibility:visible}
  .layer{position:absolute;inset:0;pointer-events:none}
  #warm{mix-blend-mode:screen}
  #cursor{position:absolute;left:0;top:0;width:44px;height:44px;transform-origin:4px 3px}
  .ring{position:absolute;left:0;top:0;width:60px;height:60px;margin:-30px 0 0 -30px;border:3px solid #FFB21A;border-radius:50%;opacity:0}
  .corner{position:absolute;width:72px;height:72px;opacity:0;transform-origin:center}
  #mono{position:absolute;left:80px;top:72px;font:500 26px/1 'Geist Mono',monospace;letter-spacing:.14em;color:#F3F1EC;opacity:0}
  #card{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding-left:180px;opacity:0}
  #card p{margin:0 0 64px;font:500 24px/1 'Geist Mono',monospace;letter-spacing:.16em;color:#8C8981}
  #card h2{margin:0;font-family:Archivo;font-weight:800;font-stretch:118%;font-size:260px;line-height:.9;letter-spacing:-.02em;color:#F3F1EC;position:relative;display:inline-block;align-self:flex-start;padding:0 20px 0 6px}
  #card .tl,#card .br{position:absolute;width:56px;height:56px}
  #card .tl{left:-34px;top:-30px}#card .br{right:-26px;bottom:-34px}
</style></head><body>
<div id="world">${tl.frames.map((f, i) => `<img id="f${i}" src="file://${path.join(SRC, f.file)}">`).join('')}</div>
<div class="layer" id="spot"></div>
<div class="layer" id="warm"></div>
<svg class="corner" id="ctl" viewBox="0 0 40 40"><path d="M5 17V5H17" stroke="#FFB21A" stroke-width="5" stroke-linecap="square" fill="none"/></svg>
<svg class="corner" id="cbr" viewBox="0 0 40 40"><path d="M35 23V35H23" stroke="#FFB21A" stroke-width="5" stroke-linecap="square" fill="none"/></svg>
<div class="ring" id="r1"></div><div class="ring" id="r2"></div>
<svg id="cursor" viewBox="0 0 24 24" fill="none"><path d="M5 2.5 19.5 11.2l-6.4.9-3.2 6.1z" fill="#F3F1EC" stroke="#12110F" stroke-width="1.3" stroke-linejoin="round"/></svg>
<div id="mono">SUN 21:47</div>
<div class="layer" id="black" style="background:#12110F"></div>
<div id="card"><p>SUN 21:47 · NO TICKET</p><h2>Fixed.
  <svg class="tl" viewBox="0 0 40 40"><path d="M5 17V5H17" stroke="#FFB21A" stroke-width="5" stroke-linecap="square" fill="none"/></svg>
  <svg class="br" viewBox="0 0 40 40"><path d="M35 23V35H23" stroke="#FFB21A" stroke-width="5" stroke-linecap="square" fill="none"/></svg></h2></div>
</body></html>`;

/* ---------- the score: everything below runs in Node and hands the page plain numbers ---------- */
const F = tl.frames, idx = l => F.findIndex(f => f.label === l);
const R = (l, k) => F[idx(l)].rects[k];
const ease = {
  io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  out: t => 1 - Math.pow(1 - t, 3),
  sine: t => -(Math.cos(Math.PI * t) - 1) / 2,
};
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const seg = (t, a, b, e = ease.io) => e(clamp((t - a) / (b - a)));
const lerp = (a, b, k) => a + (b - a) * k;
const centre = r => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

const h1 = R('open', 'h1'), typo = R('open', 'word'), fixed = R('saved', 'word'), lede = R('saved', 'lede');
const pub = idx('publish-hover') > -1 ? R('publish-hover', 'publish') : null;
const nType = F.filter(f => f.label.startsWith('type-')).length;

// beats (seconds)
const B = { up: [0.3, 1.5], enter: [1.3, 2.2], dbl: 2.3, typeA: 2.65, typeB: 3.75, away: [4.25, 4.8], click: 4.85,
            exit: [5.0, 5.7], corners: 5.25 };
B.pubCut = pub ? 6.1 : null; B.pubGlide = pub ? [6.35, 7.05] : null;
B.down = pub ? [7.6, 8.0] : [6.3, 6.8];
B.card = [B.down[1] + 0.15, B.down[1] + 0.5]; B.out = [9.35, 9.9]; const DUR = 10;

// camera: centre + width in page px. Shot A pushes in slowly on the headline.
const a0 = { x: centre(h1).x, y: centre(h1).y + 30, w: h1.w * 1.75 }, a1 = { x: centre(h1).x, y: centre(h1).y + 10, w: h1.w * 1.5 };
let pubCam = null;
if (pub) pubCam = { x: centre(pub).x - 160, y: centre(pub).y - 200, w: 1080 };
const inPage = c => ({ ...c, x: clamp(c.x, c.w / 2, tl.vw - c.w / 2), y: clamp(c.y, c.w * H / W / 2, tl.vh - c.w * H / W / 2) });
function camera(t) { return inPage(rawCamera(t)); }
function rawCamera(t) {
  if (pub && t >= B.pubCut) { const k = seg(t, B.pubCut, B.down[1], ease.sine); return { ...pubCam, w: pubCam.w * (1.04 - .04 * k) }; }
  const k = seg(t, 0, (pub ? B.pubCut : B.down[1]), ease.sine);
  return { x: lerp(a0.x, a1.x, k), y: lerp(a0.y, a1.y, k), w: lerp(a0.w, a1.w, k) };
}
function state(t) {
  if (pub && t >= B.pubGlide[1]) return idx('publish-hover');
  if (t >= B.click + 0.08) return idx('saved');
  if (t >= B.typeB) return idx('typed');
  if (t >= B.typeA) { const i = Math.min(nType, 1 + Math.floor((t - B.typeA) / ((B.typeB - B.typeA) / nType))); return idx('type-' + i); }
  if (t >= B.dbl + 0.1) return idx('selected');
  return idx('open');
}
function cursorAt(t) { // page px, or null when off screen
  const wc = centre(typo), rest = { x: wc.x + 34, y: wc.y + 52 }, lc = { x: lede.x + lede.w * .62, y: lede.y + lede.h * .5 };
  if (t < B.enter[0]) return null;
  if (t < B.enter[1]) { const k = seg(t, ...B.enter, ease.out); return { x: lerp(wc.x + 420, wc.x, k), y: lerp(wc.y + 300, wc.y, k) }; }
  if (t < B.dbl + 0.3) return wc;
  if (t < B.away[0]) { const k = seg(t, B.dbl + 0.3, B.dbl + 0.7, ease.out); return { x: lerp(wc.x, rest.x, k), y: lerp(wc.y, rest.y, k) }; }
  if (!pub || t < B.pubCut) { if (t > B.away[1] + .3) return null; const k = seg(t, B.away[0], B.away[1] + .3, ease.io); return { x: lerp(rest.x, rest.x + 560, k), y: lerp(rest.y, rest.y + 420, k) }; }
  const pc = centre(pub), start = { x: pc.x - 380, y: pc.y - 120 };
  const k = seg(t, ...B.pubGlide, ease.out); return { x: lerp(start.x, pc.x, k), y: lerp(start.y, pc.y, k) };
}
function frame(t) {
  const cam = camera(t), s = W / cam.w, ox = W / 2 - cam.x * s, oy = H / 2 - cam.y * s;
  const toScreen = p => p && { x: ox + p.x * s, y: oy + p.y * s };
  const spotP = pub && t >= B.pubCut ? toScreen(centre(pub)) : toScreen({ x: lerp(centre(h1).x, centre(t >= B.click ? fixed : typo).x, .5), y: centre(h1).y });
  const up = seg(t, ...B.up, ease.sine), down = seg(t, ...B.down, ease.sine);
  const dbl = t - B.dbl, clk = t - B.click;
  const ring = d => (d >= 0 && d < .45) ? { k: d / .45 } : null;
  const fx = toScreen(fixed), cornerK = seg(t, B.corners, B.corners + .22, ease.out);
  return {
    world: `translate(${ox}px,${oy}px) scale(${s})`, img: state(t),
    spot: { x: spotP.x, y: spotP.y, rx: pub && t >= B.pubCut ? 560 : 1150, ry: pub && t >= B.pubCut ? 230 : 640 },
    warm: .55 * up,
    black: 1 - up + down,
    cursor: toScreen(cursorAt(t)),
    rings: [ring(dbl), ring(dbl - .16)],
    ringAt: toScreen(centre(typo)),
    corners: (pub && t >= B.pubCut) ? 0 : cornerK, cornerBox: { x: fx.x, y: fx.y, w: fixed.w * s, h: fixed.h * s },
    mono: seg(t, .9, 1.4) * (1 - seg(t, B.down[0] - .3, B.down[0])),
    card: seg(t, ...B.card, ease.out) * (1 - seg(t, ...B.out, ease.sine)), cardY: 24 * (1 - seg(t, ...B.card, ease.out)),
  };
}

const APPLY = st => {
  const $ = id => document.getElementById(id);
  document.getElementById('world').style.transform = st.world;
  document.querySelectorAll('#world img').forEach((im, i) => im.classList.toggle('on', i === st.img));
  $('spot').style.background = `radial-gradient(ellipse ${st.spot.rx}px ${st.spot.ry}px at ${st.spot.x}px ${st.spot.y}px, rgba(18,17,15,0) 0%, rgba(18,17,15,0) 46%, rgba(18,17,15,.55) 78%, rgba(18,17,15,.93) 100%)`;
  $('warm').style.background = `radial-gradient(ellipse ${st.spot.rx}px ${st.spot.ry}px at ${st.spot.x}px ${st.spot.y}px, rgba(255,178,26,0) 40%, rgba(255,178,26,.07) 70%, rgba(255,178,26,0) 96%)`;
  $('warm').style.opacity = st.warm;
  $('black').style.opacity = Math.min(1, Math.max(0, st.black));
  const c = $('cursor');
  if (st.cursor) { c.style.display = 'block'; c.style.transform = `translate(${st.cursor.x - 4}px,${st.cursor.y - 3}px)`; } else c.style.display = 'none';
  ['r1', 'r2'].forEach((id, i) => { const r = st.rings[i], el = $(id);
    if (!r) { el.style.opacity = 0; return; }
    el.style.opacity = 1 - r.k; el.style.transform = `translate(${st.ringAt.x}px,${st.ringAt.y}px) scale(${.4 + r.k})`; });
  const k = st.corners, b = st.cornerBox, pad = 14, sc = 1.35 - .35 * k;
  $('ctl').style.opacity = k; $('cbr').style.opacity = k;
  $('ctl').style.transform = `translate(${b.x - pad - 8}px,${b.y - pad - 2}px) scale(${sc})`;
  $('cbr').style.transform = `translate(${b.x + b.w + pad - 62}px,${b.y + b.h + pad - 60}px) scale(${sc})`;
  $('mono').style.opacity = st.mono;
  $('card').style.opacity = st.card; $('card').style.transform = `translateY(${st.cardY}px)`;
};

(async () => {
  const work = path.join(__dirname, '.render');
  fs.rmSync(work, { recursive: true, force: true }); fs.mkdirSync(work);
  fs.writeFileSync(path.join(work, 'compositor.html'), COMPOSITOR);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + path.join(work, 'compositor.html'));
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });
  await page.waitForTimeout(800);
  await page.evaluate(() => document.fonts.load("800 220px Archivo"));
  const render = async (t, file) => { await page.evaluate(APPLY, frame(t)); await page.screenshot({ path: file, type: 'jpeg', quality: 95 }); };
  if (STILL !== null) {
    const f = path.join(OUTDIR, 'website-cue-test.jpg'); await render(STILL, f); await browser.close(); console.log(f); return;
  }
  const n = Math.round(DUR * FPS);
  for (let i = 0; i < n; i++) { await render(i / FPS, path.join(work, String(i).padStart(4, '0') + '.jpg')); if (i % 30 === 0) process.stdout.write('.'); }
  await browser.close();
  // local frames are a stand-in editor: never publish them
  const out = path.join(OUTDIR, tl.local ? 'website-cue-LOCALDEV' : 'website-cue'), seq = path.join(work, '%04d.jpg');
  const ff = args => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args]);
  ff(['-framerate', FPS, '-i', seq, '-vf', 'scale=1600:1000:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out + '.mp4']);
  ff(['-framerate', FPS, '-i', seq, '-vf', 'scale=1600:1000:flags=lanczos', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-an', out + '.webm']);
  const posterT = (B.corners + .5).toFixed(2);
  execFileSync('cwebp', ['-quiet', '-q', '82', '-resize', '1600', '1000', path.join(work, String(Math.round(posterT * FPS)).padStart(4, '0') + '.jpg'), '-o', out + '.webp']);
  fs.rmSync(work, { recursive: true, force: true });
  for (const e of ['mp4', 'webm', 'webp']) console.log(out + '.' + e, Math.round(fs.statSync(out + '.' + e).size / 1024) + 'KB');
})().catch(e => { console.error(e); process.exit(1); });
