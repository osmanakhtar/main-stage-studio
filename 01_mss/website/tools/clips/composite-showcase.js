/* Composites a showcase recording with its narration column. Written 1 Oct 2026.

     node composite-showcase.js stage-editor
     node composite-showcase.js campaign-console

   Input:  raw-<name>/*.webm (1440x1080) + raw-<name>/<name>.narration.json
   Output: out/<name>.mp4 (1920x1080, H.264, +faststart) and out/<name>.webp poster

   The column is 480px on the left, in MSS house colours, one still per beat,
   crossfaded at each beat boundary. Beat text comes from the narration log the
   recorder wrote while it drove the product, so a line is on screen exactly
   while the thing it describes is happening.
*/
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CLIPS = {
  'stage-editor': {
    product: 'Stage',
    sub: 'Website editor',
    foot: "PureMed Aesthetics' live site, recorded in a sandbox copy of Stage. No change here reached the real site.",
  },
  'campaign-console': {
    product: 'Campaign console',
    sub: 'Clinic email automation',
    foot: 'Vera Aesthetics is a fictional MSS demonstration clinic. Every person in it is synthetic.',
  },
};

const name = process.argv[2];
const cfg = CLIPS[name];
if (!cfg) { console.error('usage: composite-showcase.js ' + Object.keys(CLIPS).join('|')); process.exit(2); }

const HERE = __dirname;
const FONTS = path.join(HERE, '../../site/public/fonts');
const OUT = path.join(HERE, 'out');
const WORK = path.join(HERE, 'raw-' + name, 'column');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(WORK, { recursive: true });

const narr = JSON.parse(fs.readFileSync(path.join(HERE, 'raw-' + name, name + '.narration.json'), 'utf8'));
const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', narr.video]).toString());
const beats = narr.beats;

const font = f => `data:font/woff2;base64,${fs.readFileSync(path.join(FONTS, f)).toString('base64')}`;
// Curly apostrophes on screen; the recorders keep plain ones so they stay greppable.
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/(\w)'(\w)/g, '$1\u2019$2');
const MARK = `<svg width="30" height="30" viewBox="0 0 40 40" fill="none"><rect x="2" y="16" width="24" height="22" rx="2.5" fill="#BF6B47"/><rect x="14" y="2" width="24" height="22" rx="2.5" fill="#F5EFE5"/><rect x="14" y="16" width="12" height="8" rx="1.5" fill="#1C1712"/></svg>`;

// Dark ground, so the mark's near-black top square is drawn in parchment and
// the cutout in near-black: the same inversion the site footer uses.
const column = (beat, i) => `<!doctype html><html><head><style>
@font-face{font-family:C;src:url(${font('cormorant-garamond-400-latin.woff2')})}
@font-face{font-family:J;font-weight:300;src:url(${font('plus-jakarta-sans-300-latin.woff2')})}
@font-face{font-family:J;font-weight:400;src:url(${font('plus-jakarta-sans-400-latin.woff2')})}
@font-face{font-family:J;font-weight:500;src:url(${font('plus-jakarta-sans-500-latin.woff2')})}
html,body{margin:0;width:480px;height:1080px;background:#1C1712;overflow:hidden}
body{box-sizing:border-box;padding:64px 56px 56px;display:flex;flex-direction:column;font-family:J;color:#F5EFE5;
  border-right:1px solid rgba(191,107,71,.35)}
.brand{display:flex;align-items:center;gap:12px;font-size:12px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:#C9BBAA}
h1{font-family:C;font-weight:400;font-size:56px;line-height:1.02;margin:56px 0 10px;letter-spacing:-.01em}
.sub{font-size:15px;font-weight:400;color:#E8C9AE;letter-spacing:.02em}
.rule{width:44px;height:2px;background:#BF6B47;margin:40px 0 0}
.beat{margin-top:auto;margin-bottom:auto;padding-top:40px}
.n{font-size:12px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:#E39B76;margin-bottom:18px}
.t{font-size:25px;line-height:1.55;font-weight:300;letter-spacing:0;word-spacing:.1em}
.dots{display:flex;gap:8px;margin-bottom:28px}
.dots i{width:22px;height:3px;border-radius:2px;background:rgba(245,239,229,.18)}
.dots i.on{background:#BF6B47}
.foot{font-size:12.5px;line-height:1.6;color:#A79C90;font-weight:400}
</style></head><body>
<div class="brand">${MARK}Main Stage Studio</div>
<h1>${esc(cfg.product)}</h1><div class="sub">${esc(cfg.sub)}</div><div class="rule"></div>
<div class="beat">${beat ? `<div class="n">${esc(beat.label)}</div><div class="t">${esc(beat.text)}</div>` : ''}</div>
<div class="dots">${beats.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div>
<div class="foot">${esc(cfg.foot)}</div>
</body></html>`;

(async () => {
  // One still per segment: the intro (no beat yet), then each beat.
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 480, height: 1080 } });
  const stills = [];
  for (let i = -1; i < beats.length; i++) {
    await page.setContent(column(beats[i], i), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const f = path.join(WORK, `col-${i + 1}.png`);
    await page.screenshot({ path: f });
    stills.push(f);
  }
  await browser.close();

  // Segment boundaries: intro until the first beat, each beat until the next
  // one starts, the last until the end of the recording. Each fade is centred
  // on its boundary.
  const FD = 0.45;
  const ends = [...beats.map(b => b.start), dur];
  const lens = ends.map((e, k) => e - (k ? ends[k - 1] : 0));
  const args = ['-y', '-loglevel', 'error'];
  stills.forEach((f, k) => {
    const len = k === 0 ? ends[0] + FD / 2 : lens[k] + FD;
    args.push('-loop', '1', '-framerate', '25', '-t', len.toFixed(3), '-i', f);
  });
  args.push('-i', narr.video);
  const V = stills.length;
  let chain = '', prev = '[0:v]';
  for (let k = 0; k < V - 1; k++) {
    const o = (ends[k] - FD / 2).toFixed(3);
    const outL = k === V - 2 ? '[col]' : `[x${k}]`;
    chain += `${prev}[${k + 1}:v]xfade=transition=fade:duration=${FD}:offset=${o}${outL};`;
    prev = outL;
  }
  chain += `[col]format=yuv420p,trim=0:${dur.toFixed(3)}[c];[${V}:v]fps=25,format=yuv420p,setpts=PTS-STARTPTS[v];[c][v]hstack=inputs=2,format=yuv420p[o]`;
  const mp4 = path.join(OUT, name + '.mp4');
  args.push('-filter_complex', chain, '-map', '[o]', '-an',
    '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'slow',
    '-movflags', '+faststart', mp4);
  execFileSync('ffmpeg', args, { stdio: 'inherit' });

  // Poster: a frame from the middle of the second beat, where the product is
  // visibly doing something, rather than frame 0 (a page still settling).
  const at = beats[1] ? (beats[1].start + beats[1].end) / 2 : dur / 2;
  const png = path.join(WORK, 'poster.png');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', at.toFixed(2), '-i', mp4, '-frames:v', '1', png]);
  execFileSync('cwebp', ['-quiet', '-q', '82', png, '-o', path.join(OUT, name + '.webp')]);
  const mb = (fs.statSync(mp4).size / 1048576).toFixed(1);
  console.log(`${mp4}  ${dur.toFixed(1)}s  ${mb}MB`);
})().catch(e => { console.error(e); process.exit(1); });
