/* Website clip: Stage's live editor on the Vera demo site (engagement vera-demo-site,
   admin-only, never published). Edits the hero headline and photo, shows the phone view,
   then the caller restores the page (see README: remove the edits from client-edits.json).
   Never presses Publish.

     node stage-auth.js                    (a human signs in as admin; session -> stage-state.json)
     node record-website.js
     rm stage-state.json                   (it is a live session token)
   -> raw-v6-website/*.webm, then out-v6/website{,-loop}.{mp4,webm,webp} */
const kit = require('./clip-kit');
const path = require('path');
const { execFileSync } = require('child_process');

/* vera-demo-site is MSS's own demo engagement: put its page back to the original before and
   after each take (saved edits backed up first, then emptied). Never run against a client. */
const ENG = 'vera-demo-site';
const RESET_PY = `
import json, os, sys, time
p = 'stage/engagements/' + sys.argv[1] + '/output/client-edits.json'
if os.path.exists(p):
    d = json.load(open(p))
    os.rename(p, p + '.bak-film-' + time.strftime('%Y%m%d-%H%M%S'))
    d.update(copy={}, images={}, repeatables={}, links={}, sections={'hidden': [], 'order': {}, 'clones': [], 'moved': []})
    json.dump(d, open(p, 'w'), indent=2)
`;
function resetEdits() { execFileSync('ssh', ['pi@192.168.1.106', 'python3', '-', ENG], { input: RESET_PY }); }

const STATE = path.join(__dirname, 'stage-state.json');
const URL = 'https://mss-review.duckdns.org/prototype/vera-demo-site/index';
const NEW_HEADLINE = 'Look like yourself, only rested.';

(async () => {
  resetEdits();
  const s = await kit.open({ dir: 'raw-v6-website', storageState: STATE, tag: 'Demo · fictional clinic', size: { width: 1440, height: 810 },
    initScripts: [() => { try { sessionStorage.clear(); } catch (e) {} }] });
  const { page, run } = s;
  try {
  await run.go(URL, { settle: 1600 });
  await run.note('Website', 'The clinic\'s own site, open in the editor. This is the real page, not a form that describes it.');

  // headline: click into it, select its words, type the new line
  const h1 = page.locator('main h1').first();
  await run.click(h1, { settle: 500 });
  await page.evaluate(() => { const el = document.querySelector('main h1'); const r = document.createRange(); r.selectNodeContents(el); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); });
  await page.keyboard.type(NEW_HEADLINE, { delay: 55 });
  await page.waitForTimeout(400);
  await run.click(page.locator('main .lede').first(), { settle: 1800 });
  await run.note('Edit in place', 'Click any line and type. It saves as you go.');

  // photo: open the image panel, choose another from the clinic's library
  const img = page.locator('main .hero img').first();
  await run.click(img, { settle: 900 });
  const lib = page.locator('#stage-imgpanel button', { hasText: /library/i }).first();
  if (!(await lib.count())) throw new Error('no Choose from library button');
  await run.click(lib, { settle: 1200 });
  const choice = page.locator('#stage-imglib img[src*="laser-room"]').first();
  await choice.waitFor({ state: 'visible', timeout: 15000 }); // the library loads after the panel opens
  await run.click(choice, { settle: 1600 });
  const done = page.locator('#stage-imgpanel button', { hasText: /^Done$/ }).first();
  if (await done.count() && await done.isVisible()) await run.click(done, { settle: 800 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' })); await page.waitForTimeout(1300);
  await run.point(page.locator('main .hero img').first(), { hold: 500 });
  await run.note('Photos', 'Swap a photo from the clinic\'s own library. It keeps the page\'s framing.');

  // phone view
  const phone = page.locator('#stage-dock button', { hasText: /phone/i }).first();
  if (await phone.count()) {
    await run.click(phone, { settle: 2200 });
    await run.note('Phone view', 'Check the change on a phone before anyone sees it.');
    const close = page.locator('#stage-mobile-close').first();
    if (await close.count()) await run.click(close, { settle: 800 });
  }

  } finally {
    var webm = await kit.close(s);
    resetEdits(); // always: the demo page goes back to the original even if a step failed
  }
  console.log('raw:', webm);
  console.log(kit.encode(webm, path.join(__dirname, 'out-v6', 'website'), { trimStart: 0.4, loopFrom: 7, loopFor: 8 }).join('\n'));
})().catch(e => { console.error(e); process.exit(1); });
