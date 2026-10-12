/* Identity cue film (Sable, self-initiated), step 1 of 2: her identity assembling itself, spread by spread.

     node capture-identity.js   -> frames-identity/*.png + timeline.json

   Every value on screen is Sable's brand brief word for word (portfolio/sable/brand/sable-brand-brief.md):
   the insight, the wordmark and descriptor, the five colours and their roles, the two typefaces and the
   rules. The images are her existing ones: portrait, album cover, her homepage, and three seconds of her
   moving image with no crowd in it (her brief: "what is never in frame: crowds, stages, spectacle"). */
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync } = require('child_process');

const SABLE = path.resolve(__dirname, '../../../../portfolio/sable/brand');
const SITE = path.resolve(__dirname, '../../../prototype-v6/assets');
const OUT = path.join(__dirname, 'frames-identity');
const W = 1440, H = 900;
const MOVE = { file: 'sable-hero-15-secs-02.mp4', from: 5.0, secs: 3.0, fps: 12 };   // backstage, over the shoulder, nobody else
const COLOURS = [['bone', '#F0E8D8', 'primary ground'], ['night', '#0D0C0B', 'deep ground'], ['coal', '#1C1A18', 'secondary dark'], ['ash', '#3D3530', 'texture within dark'], ['gold', '#C89442', 'accent, punctuation']];
const url = f => 'file://' + f;

const page0 = (bg, body, extra = '') => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Plus+Jakarta+Sans:wght@300;400&display=block">
<style>html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:${bg}}
.serif{font-family:'Cormorant Garamond',serif;font-weight:300}.sans{font-family:'Plus Jakarta Sans',sans-serif;font-weight:300}
.lab{position:absolute;left:120px;top:96px;font:300 15px 'Plus Jakarta Sans',sans-serif;letter-spacing:.32em;color:#8a7f72}
${extra}</style></head><body>${body}</body></html>`;

const SPREADS = [];
const add = (label, html) => SPREADS.push([label, html]);
// 01 the idea, on night
add('idea-0', page0('#0D0C0B', ''));
add('idea-1', page0('#0D0C0B', `<p class="lab">the idea</p><h1 class="serif" style="position:absolute;left:120px;top:330px;margin:0;font-size:150px;color:#F0E8D8;letter-spacing:.01em">soft and sharp.</h1>
<p class="sans" style="position:absolute;left:126px;top:560px;margin:0;font-size:22px;color:#8a7f72">she doesn't resolve the contradiction for you.</p>`));
// 02 the name, on bone
add('name-0', page0('#F0E8D8', ''));
const name = d => page0('#F0E8D8', `<p class="lab">the name</p><h1 class="serif" style="position:absolute;left:112px;top:300px;margin:0;font-size:220px;color:#0D0C0B;letter-spacing:.12em">sable</h1>
${d ? '<p class="sans" style="position:absolute;left:124px;top:560px;margin:0;font-size:20px;letter-spacing:.42em;color:#C89442">london</p>' : ''}`);
add('name-1', name(false)); add('name-2', name(true));
// 03 the colour
const colour = (n, rule) => page0('#F0E8D8', `<p class="lab">the colour</p><div style="position:absolute;left:120px;right:120px;top:250px;display:grid;grid-template-columns:repeat(5,1fr);gap:18px">
${COLOURS.map(([nm, hex, role], i) => `<div style="opacity:${i < n ? 1 : 0}"><div style="height:330px;background:${hex};${nm === 'bone' ? 'box-shadow:inset 0 0 0 1px #d9cfbd' : ''}"></div>
<p class="sans" style="margin:18px 0 4px;font-size:20px;color:#0D0C0B">${nm}</p><p class="sans" style="margin:0;font-size:15px;color:#8a7f72;letter-spacing:.08em">${hex.toLowerCase()} · ${role}</p></div>`).join('')}</div>
${rule ? '<p class="serif" style="position:absolute;left:120px;top:720px;margin:0;font-size:44px;color:#0D0C0B">one accent. never two.</p>' : ''}`);
for (let n = 1; n <= 5; n++) add('colour-' + n, colour(n, false));
add('colour-rule', colour(5, true));
// 04 the type, on night
const type = n => page0('#0D0C0B', `<p class="lab">the type</p>
<div style="position:absolute;left:120px;top:230px;width:560px"><p class="serif" style="margin:0;font-size:230px;line-height:1;color:#F0E8D8">Aa</p>
<p class="sans" style="margin:26px 0 0;font-size:19px;color:#F0E8D8">cormorant garamond, 300 to 400</p><p class="sans" style="margin:6px 0 0;font-size:16px;color:#8a7f72">the name and every headline</p></div>
<div style="position:absolute;left:760px;top:230px;width:560px;opacity:${n > 1 ? 1 : 0}"><p class="sans" style="margin:0;font-size:230px;line-height:1;color:#F0E8D8">Aa</p>
<p class="sans" style="margin:26px 0 0;font-size:19px;color:#F0E8D8">plus jakarta sans, 300 to 400</p><p class="sans" style="margin:6px 0 0;font-size:16px;color:#8a7f72">body, navigation, labels</p></div>
${n > 2 ? '<p class="serif" style="position:absolute;left:120px;top:730px;margin:0;font-size:44px;color:#C89442">lowercase, always.</p>' : ''}`);
add('type-1', type(1)); add('type-2', type(2)); add('type-3', type(3));
// 05 the light
add('light', page0('#0D0C0B', `<img src="${url(path.join(SABLE, 'sable-portrait-eyes-closed-03.webp'))}" style="position:absolute;right:0;top:0;height:900px;width:900px;object-fit:cover">
<p class="lab">the light</p><p class="serif" style="position:absolute;left:120px;top:560px;margin:0;width:420px;font-size:40px;line-height:1.15;color:#F0E8D8">close. warm.<br>low available light.</p>`));

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
  // 06 the moving image: frames of the crowd-free moment
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sable-move-'));
  execFileSync('ffmpeg', ['-loglevel', 'error', '-ss', String(MOVE.from), '-t', String(MOVE.secs), '-i', path.join(SABLE, MOVE.file), '-vf', `fps=${MOVE.fps},scale=1600:-2`, '-q:v', '2', path.join(tmp, 'm-%03d.jpg')]);
  for (const f of fs.readdirSync(tmp).sort()) add('move', page0('#0D0C0B', `<img src="${url(path.join(tmp, f))}" style="position:absolute;inset:0;width:${W}px;height:${H}px;object-fit:cover">`));
  // 07 every surface: the album cover, then her homepage beside it
  const surfaces = n => page0('#0D0C0B', `<p class="lab">every surface</p>
<img id="cover" src="${url(path.join(SABLE, 'sable-album-cover-01.webp'))}" style="position:absolute;left:120px;top:250px;width:440px;height:440px">
<img id="home" src="${url(path.join(SITE, 'still-sable-presented.webp'))}" style="position:absolute;left:600px;top:250px;width:720px;height:405px;object-fit:cover;opacity:${n > 1 ? 1 : 0}">
<p class="sans" style="position:absolute;left:120px;top:716px;margin:0;font-size:15px;letter-spacing:.08em;color:#8a7f72">the album cover</p>
<p class="sans" style="position:absolute;left:600px;top:681px;margin:0;font-size:15px;letter-spacing:.08em;color:#8a7f72;opacity:${n > 1 ? 1 : 0}">the homepage</p>`);
  add('surfaces-1', surfaces(1)); add('surfaces-2', surfaces(2));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  const frames = [];
  for (const [i, [label, html]] of SPREADS.entries()) {
    const f = path.join(tmp, 'spread.html'); fs.writeFileSync(f, html);
    await page.goto(url(f)); await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; }))); });
    const file = String(i).padStart(3, '0') + '-' + label + '.png';
    await page.screenshot({ path: path.join(OUT, file) });
    const r = await page.evaluate(() => { const q = id => { const e = document.getElementById(id); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }; return { cover: q('cover'), home: q('home') }; });
    frames.push({ file, label, ...r }); process.stdout.write('.');
  }
  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.writeFileSync(path.join(OUT, 'timeline.json'), JSON.stringify({ w: W, h: H, moveFps: MOVE.fps, frames }, null, 2));
  console.log('\n' + frames.length + ' frames ->', OUT);
})().catch(e => { console.error(e); process.exit(1); });
