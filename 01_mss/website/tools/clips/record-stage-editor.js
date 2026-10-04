/* Records the Stage website-editor showcase clip. Written 1 Oct 2026.

     node record-stage-editor.js          -> raw-stage-editor/*.webm + stage-editor.narration.json
     node composite-showcase.js stage-editor

   SANDBOX ONLY. This makes real edits (copy, a photo, an FAQ, a feedback pin,
   a submission), so it must never point at the Pi. It runs against a local
   copy of Stage restored from the nightly backup, with its users.json and
   session secret replaced by demo values (see README, "Recording the
   showcase clips"). STAGE_URL defaults to localhost and the script refuses
   anything else.

   PureMed's real site, real photo library and real overlay are what you see;
   the edits made here go nowhere.
*/
const path = require('path');
const { record, sleep } = require('./showcase-lib');

const BASE = process.env.STAGE_URL || 'http://localhost:3000';
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(BASE)) {
  throw new Error(`Refusing to record against ${BASE}: this script edits, so it only runs on a local sandbox.`);
}
const STATE = process.env.STAGE_STATE || path.join(__dirname, 'stage-sandbox-state.json');
const RAW = path.join(__dirname, 'raw-stage-editor');

// Types with insertText rather than key presses. FAQ questions sit inside an
// accordion toggle that swallows the space key, and insertText is also what
// a paste or an IME produces, so the editor handles it the same way.
async function typeIn(page, text, per = 60) {
  for (const ch of text) { await page.keyboard.insertText(ch); await new Promise(r => setTimeout(r, per)); }
}
// Caret to the end of an element's text, the way a click after the last word lands.
const caretToEnd = el => {
  el.focus();
  const r = document.createRange(); r.selectNodeContents(el); r.collapse(false);
  const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
};

(async () => {
  const { run, page, done } = await record({ name: 'stage-editor', storageState: STATE, rawDir: RAW });

  await page.goto(`${BASE}/prototype/puremed-site`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.getElementById('stage-submit'));
  await sleep(600);

  // 1. The page itself.
  run.say('The website editor', "This is PureMed's own website, open in Stage. The clinic edits the real page, not a form that describes it.");
  await run.point(520, 470, 900);
  await run.point(380, 560, 1300);
  await sleep(2600);

  // 2. Copy, in place.
  run.say('Edit in place', 'Click any line and type. Changes save as you go, and nothing reaches the live site yet.');
  const line = page.locator('[data-stage-id="personalised-treatment-plans"]');
  await run.click(line, { dx: 0.97, settle: 300 });
  await line.evaluate(caretToEnd);
  await typeIn(page, ', reviewed at every visit', 65);
  await sleep(500);
  await line.evaluate(el => el.blur());
  await run.point(470, 900, 600);
  await sleep(1800);

  // 3. A photo, from the clinic's own library.
  run.say('Swap a photo', "Choose from the clinic's own photo library. The framing and effects the designer set stay exactly as they were.");
  await run.click('[data-stage-img="img-puremed-hero-consultation"]', { dx: 0.45, dy: 0.32, settle: 900 });
  await run.click('#stage-img-library', { settle: 1300 });
  await run.click('#stage-imglib-search', { settle: 200 });
  await page.keyboard.type('nafisa-smiling', { delay: 70 });
  await sleep(900);
  const pick = page.locator('.stage-lib-item img[data-file="client-mu3wo5p4-0-nafisa-smiling.webp"]');
  await run.click(pick, { settle: 1400 });
  await run.click('#stage-img-done', { settle: 500 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(1200);
  await run.point(1080, 520, 600);
  await sleep(2200);

  // 4. Add what's missing: a repeatable block.
  run.say("Add what's missing", 'Questions, reviews and treatment cards each have an Add button. One click, then just type.');
  await page.evaluate(() => {
    const s = document.querySelector('[data-stage-section="section-faq"]');
    window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY - 40, behavior: 'smooth' });
  });
  await sleep(1800);
  const addQ = page.locator('.stage-addrow:has-text("Add question")').first();
  await run.click(addQ, { settle: 1200 });
  const qs = page.locator('[data-stage-section="section-faq"] [data-stage-id]').filter({ hasText: 'Are the treatments safe?' });
  const fresh = qs.last();
  await run.click(fresh, { dx: 0.3, settle: 250 });
  await fresh.evaluate(el => {
    el.focus();
    const r = document.createRange(); r.selectNodeContents(el);
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  });
  await sleep(350);
  await typeIn(page, 'Can I bring someone with me?', 60);
  await fresh.evaluate(el => el.blur());
  // The clone carries the original's answer, so rewrite that too.
  const answer = page.locator('[data-stage-section="section-faq"] [data-stage-id]')
    .filter({ hasText: 'All treatments are carried out by' }).last();
  await run.click(answer, { dx: 0.2, dy: 0.3, settle: 250 });
  await answer.evaluate(el => {
    el.focus();
    const r = document.createRange(); r.selectNodeContents(el);
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  });
  await sleep(300);
  await typeIn(page, "Of course. Plenty of people do, and they're welcome in the consultation with you.", 32);
  await answer.evaluate(el => el.blur());
  await sleep(2000);

  // 5. Or hand it to MSS, pinned to the spot.
  run.say('Or ask us', "Anything the clinic would rather not change itself gets a note pinned to the exact spot. It reaches MSS as a task that knows where it is.");
  await page.evaluate(() => {
    const s = document.querySelector('[data-stage-section="section-final-cta"]');
    window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
  });
  await sleep(1500);
  await run.click('#stage-feedback-toggle', { settle: 700 });
  const heading = page.locator('[data-stage-section="section-final-cta"] h2').first();
  await run.click(heading, { dx: 0.62, dy: 0.4, settle: 700 });
  await typeIn(page, 'Could we use the new clinic photo behind this?', 45);
  await sleep(500);
  await run.click('#stage-pin-save', { settle: 1500 });
  await run.click('#stage-feedback-toggle', { settle: 800 });

  // 6. Send it.
  run.say('Send for publishing', 'One button sends every change to MSS. We check it, then it goes live on the clinic site.');
  await run.click('#stage-submit', { settle: 2600 });
  await sleep(1800);

  const out = await done();
  console.log('video', out.video);
  console.log('narration', out.log);
})().catch(e => { console.error(e); process.exit(1); });
