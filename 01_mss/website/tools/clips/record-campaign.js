/* Campaign clip: a real sign-up on the Vera demo site lands in Vera's console.
   The site (01_mss/demo-clinic/vera/site, served on :4322) posts its guide form to the
   studio-platform form endpoint; the console is the filming database (film/film-setup.sh).
   One synthetic person (an example.com address) is created in studio_film_sandbox only.

     cd 01_mss/demo-clinic/vera/site && python3 build-site.py && python3 -m http.server 4322
     SERVER_DIR=<worktree>/service bash film/film-setup.sh
     node record-campaign.js /tmp/mss-film-console-state.json
     -> raw-v6-campaign/*.webm, then out-v6/campaign{,-loop}.{mp4,webm,webp} */
const kit = require('./clip-kit');
const path = require('path');

const STATE = process.argv[2];
const SITE = process.env.SITE || 'http://localhost:4322';
const CONSOLE = (process.env.CONSOLE || 'http://localhost:3451') + '/console/vera';
const NAME = 'Hannah', EMAIL = 'hannah.demo@example.com';
if (!STATE) { console.error('usage: node record-campaign.js <console-state.json>'); process.exit(2); }

(async () => {
  const s = await kit.open({ dir: 'raw-v6-campaign', storageState: STATE, tag: 'Demo · fictional clinic', size: { width: 1440, height: 810 },
    initScripts: [() => { try { localStorage.setItem('console-theme', 'light'); } catch (e) {} }] });
  const { page, run } = s;

  await run.go(SITE + '/index.html', { settle: 1000 });
  await run.note('Campaign', 'One offer, built end to end: the page, the form, and the emails that follow.');

  await run.click('a.btn.ghost[href="guide-opt-in.html"]', { nav: true });
  await run.type('input[name=first_name]', NAME, { per: 60 });
  await run.type('input[name=email]', EMAIL, { per: 38 });
  await run.click('input[name=consent_marketing]', { settle: 400 });
  await run.click('input[name=age_18]', { settle: 400 });
  await run.note('Consent', 'The wording beside each tick is stored with the consent record, word for word.');

  await run.click('form button[type=submit]', { nav: true, settle: 1400 });
  await run.note('Signed up', 'A real sign-up. Now the clinic\'s side of it.', { hold: 2000 });

  await page.waitForTimeout(2500); // the worker sends the guide within seconds
  await run.go(CONSOLE + '/campaigns/why-do-i-look-tired/people', { settle: 1000 });
  await run.point(page.locator('main tr', { hasText: EMAIL }).first(), { hold: 600 });
  await run.note('In the series', 'She is in the guide series straight away, at the top of the list.');

  await run.go(CONSOLE + '/messages?from=s:why-do-i-look-tired', { settle: 1000 });
  await run.point(page.locator('main tr', { hasText: NAME }).first(), { hold: 600 });
  await run.note('Sent', 'The guide has already gone out, logged here with every other message the clinic sends.');

  const webm = await kit.close(s);
  console.log('raw:', webm);
  console.log(kit.encode(webm, path.join(__dirname, 'out-v6', 'campaign'), { trimStart: 0.4, loopFrom: 6, loopFor: 8 }).join('\n'));
})().catch(e => { console.error(e); process.exit(1); });
