/* Campaign cue film, step 1 of 2: one sign-up on the Vera demo site, then the real
   "Why do I look tired?" series running in Vera's console, until the owner marks her as
   booked and the series stops itself. Captured frame by frame.

   Filming setup (local only; never app.puremed.uk):
     SERVER_DIR=<sp worktree>/service bash ../film/film-setup.sh   (fresh studio_film_sandbox, console on :3451)
     (cd <sp worktree>/service && npm run sandbox:migrate)          (if the copy is behind the code)
     publish a filming copy of tenants/vera with sending.mode "test", test_allowlist
       ["hannah.demo@example.com"] and day_ms 30000 (one Vera day = 30 seconds), then restart :3451.
       The platform refuses day_ms in live mode; test mode is what makes it valid.
     node capture-campaign.js
   Emails go to <sp worktree>/service/outbox-sandbox as files and are never sent. Hannah is a
   made-up person (example.com). Re-running needs the setup again (she can only sign up once).
   -> frames-campaign/*.png + timeline.json (elapsed seconds and Vera days per frame) */
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync, spawn } = require('child_process');

const SITE = 'http://localhost:4322', CONSOLE = 'http://localhost:3451/console/vera';
const SITE_DIR = '/Users/osmanakhtar/workspace/.worktrees/mss-v6-copy/01_mss/demo-clinic/vera/site';
const OUTBOX = '/Users/osmanakhtar/workspace/.worktrees/sp-v6-reskin/service/outbox-sandbox';
const STATE = '/tmp/mss-film-console-state.json';
const OUT = path.join(__dirname, 'frames-campaign');
const NAME = 'Hannah', EMAIL = 'hannah.demo@example.com';
const DAY_S = 30, BOOK_AFTER_STEP = 4, END_DAY = 10.2;
const NOTE = 'Fresh-Face Assessment, Thu 10:30';
const W = 1440, H = 1700;

const up = url => { try { execFileSync('curl', ['-s', '-f', '-o', '/dev/null', '--max-time', '2', url]); return true; } catch { return false; } };

(async () => {
  if (!up(CONSOLE + '/login')) throw new Error('the filming console is not running on :3451 (see the setup above)');
  if (!up(SITE + '/guide-opt-in.html')) {
    spawn('python3', ['-m', 'http.server', '4322'], { cwd: SITE_DIR, detached: true, stdio: 'ignore' }).unref();
    for (let i = 0; i < 20 && !up(SITE + '/guide-opt-in.html'); i++) await new Promise(r => setTimeout(r, 300));
  }
  execFileSync('node', [path.join(__dirname, '..', 'film', 'console-auth.js'), STATE], { stdio: 'inherit' });
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, storageState: STATE });
  await ctx.addInitScript(() => { try { localStorage.setItem('console-theme', 'light'); } catch (e) {} });
  const page = await ctx.newPage();
  const frames = [];
  let n = 0, t0 = null;
  const shot = async (label, extra = {}, pg = page) => {
    const file = String(n++).padStart(3, '0') + '-' + label + '.png';
    await pg.screenshot({ path: path.join(OUT, file) });
    const elapsed = t0 ? (Date.now() - t0) / 1000 : null;
    frames.push({ file, label, elapsed, day: elapsed === null ? null : elapsed / DAY_S, url: pg.url(), ...extra });
    process.stdout.write('.');
  };
  const rects = sel => page.evaluate(s => [...document.querySelectorAll(s)].map(e => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y + scrollY, w: b.width, h: b.height, text: e.textContent.trim().slice(0, 140) }; }), sel);

  try {
    // the sign-up, on Vera's own site
    await page.goto(SITE + '/guide-opt-in.html', { waitUntil: 'networkidle' });
    const form = await rects('form'); if (!form.length) throw new Error('no form on the guide page');
    await shot('site', { form: form[0] });
    const typeIn = async (sel, text, label) => { await page.locator(sel).click(); for (let i = 3; i < text.length + 3; i += 3) { await page.keyboard.type(text.slice(i - 3, i)); await shot(label, { form: form[0] }); } };
    await typeIn('input[name=first_name]', NAME, 'name');
    await typeIn('input[name=email]', EMAIL, 'email');
    await page.locator('input[name=consent_marketing]').check(); await shot('consent', { form: form[0] });
    await page.locator('input[name=age_18]').check(); await shot('age', { form: form[0] });
    await shot('ready', { form: form[0], submit: (await rects('form button[type=submit]'))[0] });
    await Promise.all([page.waitForNavigation(), page.locator('form button[type=submit]').click()]);
    t0 = Date.now();
    await page.waitForTimeout(600);
    await shot('thanks', { heading: (await rects('main h1'))[0] });

    // her record in the console
    await page.goto(CONSOLE + '/people?q=' + encodeURIComponent(EMAIL));
    const link = page.locator('main a[href*="/people/"]', { hasText: NAME }).first();
    await link.waitFor({ timeout: 10000 });
    const personUrl = new URL(await link.getAttribute('href'), CONSOLE).toString();
    const record = async () => {
      await page.goto(personUrl); await page.waitForTimeout(250);
      const events = await rects('main .card ul li');
      return { events, sent: events.filter(e => /Message sent by email/.test(e.text)).length, stopped: events.some(e => /Series stopped/.test(e.text)),
        booked: (await rects('form[action$="/booked"]'))[0], bookingsHead: (await rects('main h2.sec'))[1], happened: (await rects('main .card ul'))[0] };
    };
    let last = '', emailShown = false, bookedAt = null;
    for (;;) {
      const r = await record();
      const key = r.events.map(e => e.text).join('|');
      if (key !== last) { await shot('record', { events: r.events, sent: r.sent, stopped: r.stopped, booked: r.booked, happened: r.happened, bookedAt }); last = key; }

      // a glimpse of the guide email itself, exactly as the platform wrote it (outbox file)
      if (r.sent >= 1 && !emailShown) {
        const f = fs.readdirSync(OUTBOX).filter(x => x.endsWith('.eml')).map(x => path.join(OUTBOX, x))
          .filter(x => fs.statSync(x).mtimeMs >= t0 - 2000 && fs.readFileSync(x, 'utf8').includes(EMAIL)).sort()[0];
        if (!f) throw new Error('the guide email is not in the outbox');
        const html = execFileSync('python3', ['-c', 'import email,sys;m=email.message_from_bytes(open(sys.argv[1],"rb").read());h=[p.get_payload(decode=True).decode() for p in m.walk() if p.get_content_type()=="text/html"];t=[p.get_payload(decode=True).decode() for p in m.walk() if p.get_content_type()=="text/plain"];print(h[0] if h else "<pre style=\\"font:16px/1.6 system-ui;white-space:pre-wrap;max-width:620px;margin:60px auto\\">"+t[0].replace("&","&amp;").replace("<","&lt;")+"</pre>");print("<!--subject:"+str(m["subject"])+"-->")', f]).toString();
        const mail = await ctx.newPage(); await mail.setContent(html); await mail.waitForTimeout(400);
        const box = await mail.evaluate(() => { const b = document.body.getBoundingClientRect(); return { x: 0, y: 0, w: innerWidth, h: Math.min(b.height, innerHeight) }; });
        await shot('email', { subject: (html.match(/<!--subject:(.*)-->/) || [])[1], box }, mail); await mail.close();
        emailShown = true; last = '';
      }
      // the owner's move: she has booked (by phone, off camera); mark it
      if (r.sent >= BOOK_AFTER_STEP && !bookedAt) {
        await page.waitForTimeout(4000);
        await page.locator('#booking_note').fill(NOTE); await shot('note', { booked: r.booked, events: r.events });
        await Promise.all([page.waitForNavigation(), page.locator('form[action$="/booked"] button').click()]);
        bookedAt = (Date.now() - t0) / 1000; await page.waitForTimeout(300);
        await shot('booked', { booked: (await rects('form[action$="/booked"]'))[0], flash: (await rects('main .flash'))[0], bookedAt });
        last = '';
      }
      if ((Date.now() - t0) / 1000 > END_DAY * DAY_S) break;
      await page.waitForTimeout(2000);
    }
    const r = await record();
    await shot('final', { events: r.events, sent: r.sent, stopped: r.stopped, happened: r.happened, bookedAt });
    if (r.sent !== BOOK_AFTER_STEP) throw new Error(`expected ${BOOK_AFTER_STEP} emails before the stop, the record shows ${r.sent}`);
    if (!r.stopped) throw new Error('the series did not stop after the booking');
    console.log(`\n${r.sent} emails, then stopped. Booked at ${bookedAt.toFixed(1)}s (day ${(bookedAt / DAY_S).toFixed(1)})`);
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(OUT, 'timeline.json'), JSON.stringify({ w: W, h: H, dayS: DAY_S, frames }, null, 2));
  console.log(frames.length + ' frames ->', OUT);
})().catch(e => { console.error('\n' + (e.stack || e)); process.exit(1); });
