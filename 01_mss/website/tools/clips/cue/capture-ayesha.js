/* Ayesha cue film, step 1 of 2: built from her own work.

     node capture-ayesha.js   -> frames-ayesha/*.png + timeline.json

   Her paintings, the five bodies of work found in them (Sacred and Love are still being photographed, and
   the film says so), her name and her line in her own words, the colours her site kit samples from a
   painting (site_kit.sample, run for real), then the five directions on her private link, captured from the
   local builds and shown in the order she sees them, none favoured. Agreed with Ayesha (Os, 12 Oct 2026). */
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync } = require('child_process');

const WEB = path.resolve(__dirname, '../../../../../02_clients/ayesha/web');
const ART = path.join(WEB, 'assets/art');
const OUT = path.join(__dirname, 'frames-ayesha');
const W = 1440, H = 900;
const SHOW = ['forts', 'dancing-trees', 'skyline', 'earth', 'water', 'tower'];
const SAMPLE_FROM = 'dancing-trees';
const DIRECTIONS = [['ayesha-johar-v2.html', 'Version 2'], ['ayesha-johar-v3a.html', 'A'], ['ayesha-johar-v3b.html', 'B'], ['ayesha-johar-v3c.html', 'C'], ['ayesha-johar-v4.html', 'D']];

// her data, from her site kit (plain python3: -I would block the kit import)
const K = JSON.parse(execFileSync('python3', ['-c', `
import json, site_kit as k
print(json.dumps({"works": {w[0]: {"title": w[1], "room": w[2]} for w in k.WORKS}, "rooms": [{"key": r["key"], "name": r["name"], "line": r["line"]} for r in k.ROOMS],
  "name": k.NAME_PARAS[1], "beauty": k.BEAUTY, "arabic": k.ARABIC, "sample": k.sample("${SAMPLE_FROM}")}, ensure_ascii=False))`], { cwd: WEB }).toString());

const page0 = body => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..800&family=Geist+Mono:wght@400;500&family=Aref+Ruqaa:wght@400;700&display=block">
<style>html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#12110F;color:#F3F1EC;font-family:Archivo}
.mono{font:500 15px 'Geist Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:#8C8981}</style></head><body>${body}</body></html>`;
const img = s => 'file://' + path.join(ART, s + '.webp');

const SPREADS = [];
const add = (label, html, extra = {}) => SPREADS.push([label, html, extra]);
// 1. the paintings, one at a time, as large as the frame allows
for (const s of SHOW) add('painting', page0(`<img id="p" src="${img(s)}" style="position:absolute;left:50%;top:70px;transform:translateX(-50%);max-width:1100px;max-height:680px;box-shadow:0 30px 80px rgba(0,0,0,.55)">
<p class="mono" style="position:absolute;left:0;right:0;top:790px;text-align:center;margin:0">${K.works[s].title}</p>`), { slug: s });
// 2. five bodies of work
const thumbs = key => Object.entries(K.works).filter(([, w]) => w.room === key).slice(0, 3);
const bodies = n => page0(`<div style="position:absolute;left:90px;right:90px;top:150px;display:grid;grid-template-columns:repeat(5,1fr);gap:22px">${K.rooms.map((r, i) => {
  const t = thumbs(r.key);
  return `<div style="opacity:${i < n ? 1 : 0}"><p class="mono" style="margin:0 0 14px">${['I', 'II', 'III', 'IV', 'V'][i]}</p>
<h2 style="margin:0;font-weight:800;font-stretch:112%;font-size:40px;line-height:1">${r.name.replace(/^The /, '')}</h2>
<p style="margin:12px 0 22px;font-size:17px;line-height:1.35;color:#C9C5BC;min-height:46px">${r.line}</p>
${t.length ? t.map(([s]) => `<img src="${img(s + '-sm')}" style="display:block;width:100%;height:150px;object-fit:cover;margin-bottom:10px">`).join('')
    : '<div style="height:150px;border:1px dashed #2E2B27;display:grid;place-items:center"><p class="mono" style="margin:0;font-size:12px">being photographed</p></div>'}</div>`; }).join('')}</div>`);
for (let n = 1; n <= 5; n++) add('bodies-' + n, bodies(n));
// 3. her name, 4. her line
const quote = K.name.match(/a statement that we live by our principles, unapologetically and at all costs\./)[0];
const name = n => page0(`<div style="position:absolute;left:150px;top:230px"><h1 style="margin:0;font-weight:800;font-stretch:118%;font-size:170px;line-height:.9">Johar</h1>
<p style="margin:10px 0 0;font-family:'Aref Ruqaa';font-size:120px;line-height:1.2;color:#FFB21A" lang="ar">${K.arabic}</p></div>
${n > 1 ? `<p style="position:absolute;left:150px;right:200px;top:640px;margin:0;font-size:30px;line-height:1.35;color:#C9C5BC">"Being a Johar… was ${quote}"<br><span class="mono" style="display:inline-block;margin-top:18px">Ayesha Johar</span></p>` : ''}`);
add('name-1', name(1)); add('name-2', name(2));
const line = K.beauty.match(/^For me, (beauty is a form of resistance)\./)[1];
add('line', page0(`<p style="position:absolute;left:150px;right:150px;top:300px;margin:0;font-weight:800;font-stretch:112%;font-size:104px;line-height:.98">${line[0].toUpperCase() + line.slice(1)}.</p>
<p class="mono" style="position:absolute;left:150px;top:640px;margin:0">In her own words</p>`));
// 5. colour from the canvas: site_kit.sample, swatch by swatch
const cols = K.sample.colours;
const colour = n => page0(`<img id="p" src="${img(SAMPLE_FROM)}" style="position:absolute;left:110px;top:130px;height:640px">
<div style="position:absolute;left:1000px;top:130px;width:330px;display:grid;gap:14px">${cols.map((c, i) => `<div style="display:flex;align-items:center;gap:18px;opacity:${i < n ? 1 : 0}">
<span style="width:96px;height:96px;background:${c};flex:none"></span><span class="mono" style="color:#F3F1EC">${c}</span></div>`).join('')}</div>
<p class="mono" style="position:absolute;left:1000px;top:${150 + cols.length * 110}px;margin:0;opacity:${n > cols.length ? 1 : 0}">Sampled from ${K.works[SAMPLE_FROM].title}</p>`);
for (let n = 0; n <= cols.length + 1; n++) add('colour-' + n, colour(n));

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ayesha-film-'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  const frames = [];
  let n = 0;
  const shot = async (label, extra = {}) => {
    const file = String(n++).padStart(3, '0') + '-' + label + '.png';
    await page.screenshot({ path: path.join(OUT, file) });
    frames.push({ file, label, ...extra }); process.stdout.write('.');
  };
  for (const [label, html, extra] of SPREADS) {
    const f = path.join(tmp, 's.html'); fs.writeFileSync(f, html);
    await page.goto('file://' + f); await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; }))); });
    await shot(label, extra);
  }
  // 6. the directions, as built, in the order her private link shows them
  for (const [file, name] of [['ayesha-johar-v3-choose.html', 'Five ways'], ...DIRECTIONS]) {
    await page.goto('file://' + path.join(WEB, file), { waitUntil: 'networkidle' });
    await page.waitForTimeout(1800);   // their own arrival motion settles
    await shot(file === 'ayesha-johar-v3-choose.html' ? 'choose' : 'direction', { name });
  }
  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.writeFileSync(path.join(OUT, 'timeline.json'), JSON.stringify({ w: W, h: H, swatches: cols.length, frames }, null, 2));
  console.log('\n' + frames.length + ' frames ->', OUT);
})().catch(e => { console.error(e); process.exit(1); });
