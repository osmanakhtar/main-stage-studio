/* Hero film ("Source to stage"), step 1 of 2: gather the real sources, one folder, one manifest.

     node capture-hero.js   -> frames-hero/*.png + manifest.json

   Nothing here is drawn to look like a product. Every image is the client's own file or a capture of the
   real build:
     Identity  Ayesha: a painting, the colours her site kit samples from it (site_kit.sample, run for real),
               her name, and her five directions as built (agreed by Ayesha; she hasn't chosen, so the film
               never shows a cut for her).
     Website   PureMed: the retired MSS rebuild spec and the brand read from her own live site (her brand
               identity file), her mark, and the homepage as built (site/dist).
     Content   PureMed: one line of her real post copy (2026-08-05-trust) rendered by Content Studio's own
               slide builder in several of its styles, ending on Signature (the palette sampled from the
               carousel she approved, 5 Oct 2026). No photo: PureMed's imagery is generated, and the brand
               keeps generated people off MSS pages.
     Campaign  Vera (demo): the real opt-in page, the real email subjects from the tenant templates, and
               Hannah's record marked as booked, from the captured Campaign film. */
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../../../../..');                      // main-stage-studio
const MAIN = '/Users/osmanakhtar/workspace/main-stage-studio';              // git-ignored client builds live here
const AYESHA = path.join(ROOT, '02_clients/ayesha/web');
const PM_SITE = path.join(MAIN, '02_clients/puremed/site/dist');
const STUDIO = '/Users/osmanakhtar/workspace/carousel-studio';
const VERA_SITE = path.join(ROOT, '01_mss/demo-clinic/vera/site');
const VERA_TPL = '/Users/osmanakhtar/workspace/studio-platform/tenants/vera/templates';
const CAMPAIGN_FILM = path.join(__dirname, '..', 'out-v6', 'campaign-cue.mp4');
const OUT = path.join(__dirname, 'frames-hero');

const SAMPLE_FROM = 'dancing-trees';
const DIRECTIONS = [['ayesha-johar-v2.html', 'Version 2'], ['ayesha-johar-v3a.html', 'A'], ['ayesha-johar-v3b.html', 'B'], ['ayesha-johar-v3c.html', 'C'], ['ayesha-johar-v4.html', 'D']];
const POST_LINE = { kicker: 'Consultation first', headline: 'The most important part of any treatment happens *before it*.' };
const POST_STYLES = ['classic', 'editorial', 'statement', 'signature'];        // Signature last: the one she approved

// a tiny static server, so the Astro build's absolute /assets paths resolve
const serve = dir => new Promise(res => {
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.mp4': 'video/mp4' };
  const s = http.createServer((q, r) => {
    let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
    const f = path.join(dir, p);
    if (!f.startsWith(dir) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
  }).listen(0, () => res(s));
});

(async () => {
  for (const p of [AYESHA, PM_SITE, STUDIO, VERA_SITE, VERA_TPL, CAMPAIGN_FILM]) if (!fs.existsSync(p)) throw new Error('missing source: ' + p);
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
  const M = { ayesha: {}, puremed: {}, vera: {} };

  // Identity: her data, from her site kit (plain python3: -I would block the kit import)
  const K = JSON.parse(execFileSync('python3', ['-c', `
import json, site_kit as k
w = {x[0]: x[1] for x in k.WORKS}
print(json.dumps({"title": w["${SAMPLE_FROM}"], "arabic": k.ARABIC, "sample": k.sample("${SAMPLE_FROM}")}, ensure_ascii=False))`], { cwd: AYESHA }).toString());
  fs.copyFileSync(path.join(AYESHA, 'assets/art', SAMPLE_FROM + '.webp'), path.join(OUT, 'ayesha-painting.webp'));
  Object.assign(M.ayesha, { painting: 'ayesha-painting.webp', title: K.title, arabic: K.arabic, colours: K.sample.colours, directions: [] });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const settle = async () => page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });

  for (const [file, name] of DIRECTIONS) {
    await page.goto('file://' + path.join(AYESHA, file), { waitUntil: 'networkidle' });
    await page.waitForTimeout(1800);   // their own arrival motion settles
    const out = 'ayesha-dir-' + name.replace(/\s+/g, '').toLowerCase() + '.png';
    await page.screenshot({ path: path.join(OUT, out) }); M.ayesha.directions.push({ file: out, name });
    process.stdout.write('.');
  }

  // Website: PureMed homepage as built, her mark
  const srv = await serve(PM_SITE);
  await page.goto(`http://localhost:${srv.address().port}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500); await settle();
  await page.screenshot({ path: path.join(OUT, 'puremed-home.png') });
  srv.close();
  fs.copyFileSync(path.join(STUDIO, 'brands/puremed/logo.png'), path.join(OUT, 'puremed-logo.png'));
  Object.assign(M.puremed, {
    home: 'puremed-home.png', logo: 'puremed-logo.png',
    // both from 02_clients/puremed/.claude/puremed-brand-identity.md
    retired: { label: 'MSS rebuild spec', colours: ['#23476A'], display: 'Cormorant Garamond', body: 'Inter' },
    kept: { label: 'Her live brand', colours: ['#343a67', '#d0ac61'], display: 'Majesty', body: 'Hanken Grotesk' },
  });
  process.stdout.write('.');

  // Content: Content Studio's own slide builder, her brand pack, her copy
  const Slides = require(path.join(STUDIO, 'src/shared/slides.js'));
  const brand = JSON.parse(fs.readFileSync(path.join(STUDIO, 'brands/puremed/brand.json'), 'utf8'));
  const brandDir = path.join(STUDIO, 'brands/puremed');
  M.puremed.posts = [];
  for (const style of POST_STYLES) {
    const { w, h } = Slides.sizeOf(style);
    const doc = Slides.slideHtml({ template: 'cover', ...POST_LINE }, brand, { style, index: 0, total: 5 })
      .replace(/studio:\/\/brand\//g, 'file://' + brandDir + '/');
    const f = path.join(OUT, '.slide.html'); fs.writeFileSync(f, doc);
    const sp = await browser.newPage({ viewport: { width: w, height: h } });
    await sp.goto('file://' + f); await sp.evaluate(async () => { await document.fonts.ready; });
    await sp.waitForTimeout(300);
    const out = 'puremed-post-' + style + '.png';
    await sp.screenshot({ path: path.join(OUT, out) }); await sp.close();
    M.puremed.posts.push({ file: out, style, w, h }); process.stdout.write('.');
  }
  fs.rmSync(path.join(OUT, '.slide.html'));

  // Campaign: Vera's opt-in page as built, her real email subjects, the stop line from the captured film
  await page.goto('file://' + path.join(VERA_SITE, 'guide-opt-in.html'), { waitUntil: 'networkidle' });
  await page.waitForTimeout(800); await settle();
  await page.screenshot({ path: path.join(OUT, 'vera-optin.png') });
  const subjects = ['01-guide.md', '02-why-tired.md', '03-not-more-filler.md', '04-assessment.md'].map(f => {
    const m = fs.readFileSync(path.join(VERA_TPL, f), 'utf8').match(/^subject:\s*(?:\[DRAFT\]\s*)?(.+)$/m);
    if (!m) throw new Error('no subject in ' + f); return m[1].trim();
  });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '11.0', '-i', CAMPAIGN_FILM, '-frames:v', '1', path.join(OUT, 'vera-record.png')]);
  Object.assign(M.vera, { optin: 'vera-optin.png', subjects, record: 'vera-record.png' });

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(M, null, 2));
  console.log('\n' + fs.readdirSync(OUT).length + ' files ->', OUT);
})().catch(e => { console.error(e); process.exit(1); });
