/* Platform clip: the client console, recorded against the fictional Vera
   clinic in the local studio-platform sandbox (SOP-PLAT-004). Read only: it
   opens pages and scrolls, it never saves, approves or pauses anything.

   1. Start a sandbox server (any port) and sign in off camera, saving the
      session to a storage-state file (the sign-in email is never filmed).
   2. node record-console.js <storage-state.json> [base-url]
      -> raw-v6-console/*.webm, then out-v6/console{,-loop}.{mp4,webm,webp}

   Narration is authored and must describe only what is on screen. */
const kit = require('./clip-kit');
const path = require('path');

const STATE = process.argv[2];
const BASE = (process.argv[3] || 'http://localhost:3451') + '/console/vera';
if (!STATE) { console.error('usage: node record-console.js <storage-state.json> [base-url]'); process.exit(2); }

(async () => {
  const s = await kit.open({ dir: 'raw-v6-console', storageState: STATE, tag: 'Demo · fictional clinic', size: { width: 1440, height: 810 },
    initScripts: [() => { try { localStorage.setItem('console-theme', 'light'); } catch (e) {} }] });
  const { page, run } = s;

  await run.go(BASE + '/dashboard', { settle: 1200 });
  await run.note('Platform', 'One place for every person the clinic has met: who can be reached, what went out, and where people came from.');
  await run.point('main h2.sec, main .card', { hold: 600 });

  await run.click('header nav a[href$="/console/vera"]', { nav: true });
  await run.note('Campaigns', 'Every automated email series in plain English: what starts it, who is in it, and whether it is approved.');

  await run.click('a[href$="/campaigns/why-do-i-look-tired"]', { nav: true });
  await run.note('A series', 'Open one and it explains itself. Someone downloads the guide, and six emails follow over nine days.');
  await run.scroll(520);
  await run.point('a[href$="/emails/02-why-tired"]', { hold: 500 });

  await run.click('a[href$="/emails/02-why-tired"]', { nav: true });
  await run.note('The clinic writes it', 'The words are the clinic\'s own, written and approved here by the owner.');
  await run.click('button[name=action][value=preview]', { nav: true, settle: 1200 });
  await run.note('Preview', 'Press Preview and the email appears exactly as a patient will receive it.');
  await run.scroll(380, { settle: 900 });

  await run.click('header nav a[href$="/data-protection"]', { nav: true });
  await run.note('Data protection', 'Consent records and the assessment live in the same console. Until the paperwork is signed, every page says so.');

  const webm = await kit.close(s);
  console.log('raw:', webm);
  const files = kit.encode(webm, path.join(__dirname, 'out-v6', 'console'), { trimStart: 0.4, loopFrom: 9, loopFor: 8 });
  console.log(files.join('\n'));
})().catch(e => { console.error(e); process.exit(1); });
