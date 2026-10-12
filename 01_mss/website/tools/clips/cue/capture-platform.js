/* Platform cue film, step 1 of 2: four old sources become one record, then a batch recall.

   Setup (filming database only, all fictional; see film-platform-setup.sh):
     the Campaign filming setup, Vera's own old-records DPIA questions, Vera Hale signs the DPIA and
     DPA (vera-dp-sign.mts), fictional old-system exports (gen-vera-legacy.py), the real reconcile.py
     and the real legacy importer, committed. Its output is kept as import-commit.txt in the data folder.
     node capture-platform.js <data folder>
   Scenes: the four sources (counts from the real reconcile report), the signed DPIA in the console,
   the importer's real output typed out, Daisy's record (one old note opened), the notes search.
   -> frames-platform/*.png + timeline.json */
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const DATA = process.argv[2];
if (!DATA || !fs.existsSync(path.join(DATA, 'import-commit.txt'))) { console.error('usage: node capture-platform.js <data folder with import-commit.txt>'); process.exit(2); }
const CONSOLE = 'http://localhost:3451/console/vera';
const STATE = '/tmp/mss-film-console-state.json';
const OUT = path.join(__dirname, 'frames-platform');
const W = 1440, H = 1800;
const HERO = 'daisy.russell@example.com', NOTE_DAY = '2 Apr 2024', LOT = 'SB-4471';

// the real numbers, from the files the import ran on
const rec = fs.readdirSync(DATA).find(d => d.startsWith('reconciliation-'));
const summary = fs.readFileSync(path.join(DATA, rec, 'summary.md'), 'utf8');
const num = re => { const m = summary.match(re); if (!m) throw new Error('summary.md has no ' + re); return m[1]; };
const faces = num(/Faces (\d+)/), appts = num(/Acuity (\d+) appointments/), mc = num(/Mailchimp (\d+)/), unsub = num(/unsubscribed or cleaned email \(M9\): (\d+)/);
const onPlatform = fs.readFileSync(path.join(DATA, 'platform-people.csv'), 'utf8').trim().split('\n').length - 1;
const out = fs.readFileSync(path.join(DATA, 'import-commit.txt'), 'utf8');
const job = (out.match(/COMMITTED, migration job ([0-9a-f-]+)/) || [])[1];
if (!job) throw new Error('import-commit.txt is not a committed run');
const row = k => { const m = out.match(new RegExp('│ ' + k + ' +│ (\\d+) +│')); if (!m) throw new Error('no ' + k + ' in the import output'); return m[1]; };
const ROWS = ['attached_platform', 'records_imported', 'appointments_imported', 'notes_imported', 'suppressions_applied', 'consent_created'];

const SOURCES = [
  ['Old booking system', `${appts} appointments, every note`],
  ['Client records', `${faces} clients`],
  ['Mailing list', `${mc} addresses, ${unsub} unsubscribed`],
  ['Website', `${onPlatform} people already signed up`],
];
const brandPage = body => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..800&family=Geist+Mono:wght@400;500&display=block">
<style>html,body{margin:0;width:${W}px;height:${H}px;background:#12110F;color:#F3F1EC}
.src{position:absolute;left:220px;right:220px;top:520px;display:grid;gap:34px}
.src div{display:grid;grid-template-columns:44px 1fr auto;align-items:baseline;gap:28px;border-top:1px solid #2E2B27;padding-top:30px;opacity:.16;transition:none}
.src div.on{opacity:1}.src i{font:500 22px 'Geist Mono',monospace;color:#8C8981;font-style:normal}
.src b{font:800 64px/1 Archivo;font-stretch:118%;letter-spacing:-.01em}.src span{font:500 24px 'Geist Mono',monospace;letter-spacing:.06em;color:#8C8981;text-transform:uppercase}
.term{position:absolute;left:200px;right:200px;top:430px;font:500 25px/1.75 'Geist Mono',monospace;color:#F3F1EC;white-space:pre}
.term .p{color:#8C8981}.term .k{color:#8C8981}.term .z{color:#FFB21A}</style></head><body>${body}</body></html>`;
const sourcesHtml = lit => brandPage('<div class="src">' + SOURCES.map(([a, b], i) => `<div class="${i < lit ? 'on' : ''}"><i>0${i + 1}</i><b>${a}</b><span>${b}</span></div>`).join('') + '</div>');
const termLines = [
  `<span class="p">$</span> npx tsx src/cli/import-legacy.ts \\`,
  `    --tenant vera --bundle import-bundle.json \\`,
  `    --actor "Vera Hale (owner)" --commit`,
  `COMMITTED, migration job ${job.slice(0, 8)}`,
  '',
  ...ROWS.map(k => `<span class="k">${k.padEnd(22)}</span>${k === 'consent_created' ? `<span class="z">${row(k)}</span>` : row(k)}`),
];
const termHtml = n => brandPage(`<div class="term">${termLines.slice(0, n).join('\n')}</div>`);

(async () => {
  execFileSync('node', [path.join(__dirname, '..', 'film', 'console-auth.js'), STATE], { stdio: 'inherit' });
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, storageState: STATE });
  await ctx.addInitScript(() => { try { localStorage.setItem('console-theme', 'light'); } catch (e) {} });
  const page = await ctx.newPage();
  const frames = [];
  let n = 0;
  const shot = async (label, extra = {}) => {
    const file = String(n++).padStart(3, '0') + '-' + label + '.png';
    await page.screenshot({ path: path.join(OUT, file) });
    frames.push({ file, label, ...extra }); process.stdout.write('.');
  };
  const rect = sel => page.evaluate(s => { const e = typeof s === 'string' ? document.querySelector(s) : null; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y + scrollY, w: b.width, h: b.height }; }, sel);
  const rectOf = loc => loc.evaluate(e => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y + scrollY, w: b.width, h: b.height, text: e.textContent.trim().slice(0, 200) }; });

  try {
    // 1. the four places her clients live today
    for (let lit = 0; lit <= SOURCES.length; lit++) {
      await page.setContent(sourcesHtml(lit)); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200);
      await shot('sources-' + lit, { box: await rect('.src') });
    }
    // 2. the DPIA, signed before anything moves (the importer refuses otherwise)
    await page.goto(CONSOLE + '/data-protection'); await page.waitForTimeout(400);
    await shot('dp', { approved: await rectOf(page.getByText(/Version \d+ approved by Vera Hale/).first()), accepted: await rectOf(page.getByText(/^Accepted by Vera Hale/).first()) });
    // 3. the import's own report, verbatim
    for (let k = 1; k <= termLines.length; k++) {
      await page.setContent(termHtml(k)); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(120);
      await shot('term-' + k, { box: await rect('.term') });
    }
    // 4. one record: Daisy
    await page.goto(CONSOLE + '/people?q=' + encodeURIComponent(HERO));
    const href = await page.locator('main a[href*="/people/"]', { hasText: 'Daisy' }).first().getAttribute('href');
    await page.goto(new URL(href, CONSOLE).toString()); await page.waitForTimeout(400);
    const before = page.locator('main h2.sec', { hasText: 'Before the platform' }).locator('xpath=following-sibling::div[1]');
    const visit = before.locator('summary', { hasText: NOTE_DAY }).first();
    const brought = page.locator('main .card ul li', { hasText: 'Brought in' }).first();
    const base = { agreements: await rectOf(page.locator('main section.card').first()), before: await rectOf(before), visit: await rectOf(visit), brought: await rectOf(brought) };
    await shot('daisy', base);
    await visit.click(); await page.waitForTimeout(300);
    const opened = visit.locator('xpath=..');
    await shot('daisy-note', { ...base, before: await rectOf(before), opened: await rectOf(opened), brought: await rectOf(brought) });
    // 5. the recall: search the old notes for the lot number
    await page.goto(CONSOLE + '/history'); await page.waitForTimeout(300);
    const input = page.locator('main input[name=q]');
    const ui = { input: await rectOf(input), button: await rectOf(page.locator('main form button').first()) };
    await shot('recall-empty', ui);
    await input.click();
    for (let i = 2; i <= LOT.length; i += 2) { await page.keyboard.type(LOT.slice(i - 2, i)); await shot('recall-type', ui); }
    if (LOT.length % 2) { await page.keyboard.type(LOT.slice(-1)); await shot('recall-type', ui); }
    await Promise.all([page.waitForNavigation(), page.locator('main form button').first().click()]);
    await page.waitForTimeout(300);
    const table = page.locator('main table').first();
    const people = await page.locator('main table tbody tr td:first-child').allTextContents();
    await shot('recall', { ...ui, table: await rectOf(table), count: await rectOf(page.locator('main p', { hasText: /match/ }).first()), people });
    if (!people.length) throw new Error('the recall search found nothing');
    console.log(`\nrecall: ${people.length} notes, ${new Set(people.map(p => p.trim())).size} people`);
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(OUT, 'timeline.json'), JSON.stringify({ w: W, h: H, counts: { faces, appts, mc, unsub, onPlatform }, frames }, null, 2));
  console.log(frames.length + ' frames ->', OUT);
})().catch(e => { console.error('\n' + (e.stack || e)); process.exit(1); });
