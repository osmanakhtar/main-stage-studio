/* Website cue film, step 1 of 2: capture the real Stage editor, frame by frame, at 3x.

   No video recording. Each state of the edit is a still screenshot taken between real
   actions, so the film is sharp at any crop and the motion is added afterwards by
   render.js (camera, light, cursor, type). The tool on screen is the real Stage editor on
   the Vera demo site (engagement vera-demo-site, admin-only, never published).

     node ../stage-auth.js        (a human signs in as admin; session -> ../stage-state.json)
     node capture-website.js
     rm ../stage-state.json       (it is a live session token)

     node capture-website.js --local http://localhost:8911/index.html
       dev only: the plain Vera page with contenteditable standing in for the editor, to
       tune render.js without a Stage session. Never use local frames in a published film.

   The story: the headline has a typo on a Sunday night; the owner double-clicks the word,
   retypes it, presses Escape to finish, and the editor offers to send it for publishing. The typo is put
   in with the editor before filming and every edit is removed afterwards (same reset as
   record-website.js). Never presses Submit or Publish.
   -> frames-website/*.png + frames-website/timeline.json */
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const DSF = 3, VW = 1440, VH = 900;
const OUT = path.join(__dirname, 'frames-website');
const STATE = path.join(__dirname, '..', 'stage-state.json');
const ENG = 'vera-demo-site';
const STAGE_URL = 'https://mss-review.duckdns.org/prototype/vera-demo-site/index';
const TYPO = 'yourslef', FIX = 'yourself';
const ORIGINAL = 'Look like yourself, on a good day.';

const li = process.argv.indexOf('--local');
const LOCAL = li > -1 ? process.argv[li + 1] : null;

const RESET_PY = `
import json, os, sys, time
p = 'stage/engagements/' + sys.argv[1] + '/output/client-edits.json'
if os.path.exists(p):
    d = json.load(open(p))
    os.rename(p, p + '.bak-film-' + time.strftime('%Y%m%d-%H%M%S'))
    d.update(copy={}, images={}, repeatables={}, links={}, sections={'hidden': [], 'order': {}, 'clones': [], 'moved': []})
    json.dump(d, open(p, 'w'), indent=2)
`;
function resetEdits() { if (!LOCAL) execFileSync('ssh', ['pi@192.168.1.106', 'python3', '-', ENG], { input: RESET_PY }); }

/* Rects in CSS px: the headline, the typo word inside it, the lede (click-away target), the
   publish button in the dock if the editor shows one. */
const measure = (page, word = TYPO) => page.evaluate(word => {
  const r = el => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
  const h1 = document.querySelector('main h1');
  let wordRect = null;
  const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    const i = n.data.indexOf(word);
    if (i > -1) { const rg = document.createRange(); rg.setStart(n, i); rg.setEnd(n, i + word.length); wordRect = r(rg); break; }
  }
  const pub = [...document.querySelectorAll('#stage-dock button, #stage-dock a')].find(b => /publish|submit|send/i.test(b.textContent) && b.offsetParent);
  return { h1: r(h1), word: wordRect, lede: r(document.querySelector('main .lede')), publish: r(pub), dock: r(document.querySelector('#stage-dock')) };
}, word);

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
  if (!LOCAL && !fs.existsSync(STATE)) throw new Error('no stage-state.json: run node ../stage-auth.js and sign in as admin first');
  resetEdits();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: DSF, ...(LOCAL ? {} : { storageState: STATE }) });
  await ctx.addInitScript(() => { try { sessionStorage.clear(); } catch (e) {} });
  const page = await ctx.newPage();
  const frames = [];
  let n = 0;
  const shot = async (label, extra = {}) => {
    await page.waitForTimeout(250);
    const file = String(n++).padStart(3, '0') + '-' + label + '.png';
    await page.screenshot({ path: path.join(OUT, file) });
    frames.push({ file, label, rects: await measure(page, extra.word), ...extra });
    process.stdout.write('.');
  };
  const h1 = () => page.locator('main h1').first();
  const selectAll = () => page.evaluate(() => { const el = document.querySelector('main h1'); const rg = document.createRange(); rg.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(rg); });
  const settle = ms => page.waitForTimeout(ms);
  // Escape is the editor's own 'done with this line': it saves and deselects, leaving no outline on anything else
  const finishLine = async () => { await page.keyboard.press('Escape'); };

  try {
    await page.goto(LOCAL || STAGE_URL, { waitUntil: 'networkidle' });
    await settle(1500);
    if (LOCAL) await page.evaluate(() => { document.querySelector('main h1').contentEditable = 'true'; });

    // set up: put the typo in with the editor (not filmed), then reload so the page opens clean
    await h1().click(); await selectAll();
    await page.keyboard.type(ORIGINAL.replace(FIX, TYPO), { delay: 20 });
    await finishLine(); await settle(1500);
    if (!LOCAL) { await page.reload({ waitUntil: 'networkidle' }); await settle(1500); }
    await page.mouse.move(VW - 2, VH - 2); await settle(400);
    const head = (await h1().textContent()).trim();
    if (!head.includes(TYPO)) throw new Error('typo not in the headline after setup: ' + head);

    // the film: open on the page with the typo
    await shot('open');
    const w = (await measure(page)).word;
    if (!w) throw new Error('typo word not found in headline');
    await page.mouse.dblclick(w.x + w.w / 2, w.y + w.h / 2); // real double-click: the editor opens the line, the word is selected
    await settle(500);
    const sel = await page.evaluate(() => getSelection().toString().trim());
    if (sel !== TYPO) {                                   // some builds open the line on the first click and need the word picked again
      await page.mouse.dblclick(w.x + w.w / 2, w.y + w.h / 2); await settle(400);
    }
    await shot('selected', { word: TYPO });
    for (let i = 1; i <= FIX.length; i++) {
      await page.keyboard.type(FIX[i - 1]);
      await shot('type-' + i, { word: FIX.slice(0, i) });
    }
    await shot('typed', { word: FIX });
    await finishLine(); await settle(1600);
    await page.mouse.move(VW - 2, VH - 2);
    const outlined = await page.evaluate(() => document.activeElement && document.activeElement !== document.body ? document.activeElement.outerHTML.slice(0, 80) : null);
    if (outlined) throw new Error('still editing after Escape: ' + outlined);
    await shot('saved', { word: FIX });
    const done = (await h1().textContent()).trim();
    if (done !== ORIGINAL) throw new Error('headline after the fix is not the original: ' + done);
    const pub = frames[frames.length - 1].rects.publish;
    if (pub) {                                            // hover only, never press
      await page.mouse.move(pub.x + pub.w / 2, pub.y + pub.h / 2, { steps: 8 }); await settle(500);
      await shot('publish-hover', { word: FIX });
    }
  } finally {
    await browser.close();
    resetEdits(); // always: the demo page goes back to the original even if a step failed
  }
  fs.writeFileSync(path.join(OUT, 'timeline.json'), JSON.stringify({ dsf: DSF, vw: VW, vh: VH, local: !!LOCAL, frames }, null, 2));
  console.log('\n' + frames.length + ' frames ->', OUT);
})().catch(e => { console.error('\n' + (e.stack || e)); process.exit(1); });
