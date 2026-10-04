/* Records the campaign console showcase clip. Written 1 Oct 2026.

     vera-console-tenant/seed-demo.sh            # fresh demo DB + server on :3402
     node record-campaign-console.js             -> raw-campaign-console/*.webm + narration
     node composite-showcase.js campaign-console

   Runs the real console (studio-platform/service) against Vera Aesthetics, the
   fictional MSS demonstration clinic, in its own local database with
   synthetic example.com sign-ups. Never PureMed: the console holds a real
   clinic's patients and approved emails, and none of that belongs in a
   public clip. Outbox transport only, so nothing is ever emailed.

   Signs in the way the clinic does, by magic link. On localhost the console
   shows the link on the page instead of emailing it.
*/
const path = require('path');
const { record, sleep } = require('./showcase-lib');

const BASE = process.env.CONSOLE_URL || 'http://localhost:3402';
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(BASE)) {
  throw new Error(`Refusing to record against ${BASE}: this script edits and approves emails, so it only runs locally.`);
}
const C = `${BASE}/console/vera`;
const RAW = path.join(__dirname, 'raw-campaign-console');

async function typeIn(page, text, per = 55) {
  for (const ch of text) { await page.keyboard.insertText(ch); await new Promise(r => setTimeout(r, per)); }
}

(async () => {
  // Sign in off camera, then record from the campaigns list.
  const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
  const b = await chromium.launch();
  const pre = await (await b.newContext()).newPage();
  await pre.goto(`${C}/login`);
  await pre.fill('#email', 'hello@vera-aesthetics.example');
  await pre.click('form button');
  await pre.click('text=Open your sign-in link');
  const confirm = pre.locator('form button');
  if (await confirm.count()) await Promise.all([pre.waitForNavigation(), confirm.first().click()]);
  const state = await pre.context().storageState();
  await b.close();

  const { run, page, done } = await record({ name: 'campaign-console', storageState: state, rawDir: RAW });
  await page.goto(C, { waitUntil: 'networkidle' });
  await sleep(500);

  // 1. Every automated email, in one place.
  run.say('The campaign console', 'Every automated email the clinic sends, in one place and in plain English: what starts it, how many people are in it, and whether it is approved.');
  await run.point(330, 420, 900);
  await run.point(300, 620, 1200);
  await run.point(720, 420, 1000);
  await sleep(2600);

  // 2. A campaign explains itself.
  run.say('No flowcharts', 'Open a campaign and it explains itself: who gets it, when, and what stops it early. One button pauses the whole thing.');
  await run.click('a[href$="/campaigns/first-visit-guide"]', { nav: true, settle: 600 });
  await run.point(720, 560, 900);
  await run.point(640, 640, 1500);
  await run.moveTo('text=Pause campaign', { travel: 900 });
  await sleep(1600);

  // 3. The clinic writes its own emails.
  run.say('The clinic writes them', 'Open any email and change it. Details that differ for each person, like their first name, go in with one click.');
  await run.click('a[href$="/emails/03-consultation"]', { nav: true, settle: 700 });
  const subject = page.locator('#subject');
  await run.click(subject, { dx: 0.08, settle: 200 });
  await subject.evaluate(el => { el.focus(); el.setSelectionRange(0, el.value.length); });
  await sleep(250);
  await page.keyboard.press('Backspace');
  await run.click('.fields button[data-f="{{first_name}}"]', { settle: 300 });
  await subject.evaluate(el => { el.focus(); el.setSelectionRange(el.value.length, el.value.length); });
  await typeIn(page, ", here's why our consultations take so long", 45);
  await sleep(700);

  const body = page.locator('#body');
  const anchor = 'think about for as long as you like.';
  await run.click(body, { dx: 0.5, dy: 0.62, settle: 200 });
  await body.evaluate((el, a) => { const i = el.value.indexOf(a) + a.length; el.focus(); el.setSelectionRange(i, i); }, anchor);
  await typeIn(page, ' Bring someone with you if it helps.', 45);
  await sleep(900);

  // 4. Preview exactly as a patient sees it.
  run.say('See it as they will', 'Preview renders the email exactly as a patient receives it, in the clinic’s own branding.');
  await run.click('button[value="preview"]', { nav: true, settle: 900 });
  await run.moveTo('#preview', { dy: 0.25, travel: 900 });
  await sleep(1200);
  await page.mouse.move(1060, 600);
  for (let i = 0; i < 2; i++) { await page.mouse.wheel(0, 260); await sleep(900); }
  await sleep(1400);

  // 5. Nothing sends until it is approved.
  run.say('Nothing sends unapproved', 'Only the clinic owner can approve. New sign-ups get the new version, and anyone part-way through keeps the one they started with.');
  await run.click('button[value="approve"]', { nav: true, settle: 900 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(700);
  await run.moveTo('h1', { travel: 900 });
  await sleep(2600);

  const out = await done();
  console.log('video', out.video);
  console.log('narration', out.log);
})().catch(e => { console.error(e); process.exit(1); });
