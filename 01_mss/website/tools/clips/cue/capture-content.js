/* Content cue film, step 1 of 2: capture Main Stage Content Studio (PureMed's edition)
   planning and drafting a real week, frame by frame.

     node capture-content.js            (full run: plan, AI draft, review, export)
     node capture-content.js --dry      (stops before drafting: checks the form and the plan)

   The app runs from ~/workspace/carousel-studio in a throwaway film profile
   (STUDIO_USER_DATA / STUDIO_WORK_DIR under film-content/), so Os's own settings and
   campaigns, and anything of Nafisa's, are never touched. The photo library is PureMed's
   Dropbox, which Nafisa agreed on 11 Oct 2026 can be shown. The drafting is real: Claude,
   on the key saved in the film profile. On the first run the profile has no key, so the
   script opens the app's Settings and waits for a human to paste one in. The script never
   reads, prints or stores a key itself.

   Nothing is posted. The film ends on Export (slides, caption.txt and a clip land in the
   film work folder), which is honest about posting being manual today.
   -> frames-content/*.png + frames-content/timeline.json (with real elapsed times) */
const { _electron } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const APP = '/Users/osmanakhtar/workspace/carousel-studio';
const FILM = path.join(__dirname, 'film-content');
const USER_DATA = path.join(FILM, 'user-data');           // keeps the encrypted key between runs
const WORK = path.join(FILM, 'work');                     // fresh every run
const OUT = path.join(__dirname, 'frames-content');
const LIBRARY = '/Users/osmanakhtar/Library/CloudStorage/Dropbox';
const DRY = process.argv.includes('--dry');

const PLAN = {
  name: 'Autumn laser season', start: '2026-10-19', weeks: '1', type: 'treatment', topic: /co2 laser/i, topicMatch: /co2/i, topicId: 'co2-laser-resurfacing', folder: 'co2 laser',
  share: 75, hook: 'Autumn laser season',
  brief: 'Autumn is laser season: a week on CO2 resurfacing. Why autumn, what to expect, downtime, one myth.',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
};
const W = 1440, H = 900;

/* Rects (CSS px) of everything the compositor might point the camera or the light at. */
const MEASURE = () => {
  const r = el => { if (!el || !el.offsetParent && el.tagName !== 'BODY') return null; const b = el.getBoundingClientRect(); return b.width ? { x: b.x, y: b.y, w: b.width, h: b.height } : null; };
  const q = s => r(document.querySelector(s));
  const all = s => [...document.querySelectorAll(s)].map(r).filter(Boolean);
  return {
    brief: q('#planBrief'), preview: q('#planPreview'), table: q('#planPreviewBlock table'), createDraft: q('#planCreateDraft'),
    board: q('#boardBlock'), rows: all('#boardRows .board-row'), pills: all('#boardRows .pill.st'),
    strip: q('#strip'), stripItems: all('#strip > *'), slide: q('.preview-frame'), checkTab: q('.tab[data-tab="check"]'),
    checkBody: q('.tab-body[data-body="check"]'), exportPng: q('#exportPng'), exportClip: q('#exportClipBtn'),
    clipMenu: q('#clipMenu'), toast: q('#toast'), busy: q('#busy .busy-card'), lintPill: q('#lintPill'),
  };
};

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
  fs.rmSync(WORK, { recursive: true, force: true }); fs.mkdirSync(WORK, { recursive: true });
  fs.mkdirSync(USER_DATA, { recursive: true });
  // Set-up, as her guide says to: hand-tag the CO2 folder's photos with the treatment. The app only
  // guesses a treatment when the folder name holds its full name ("co2 laser" is not "CO2 Laser
  // Resurfacing"), so without this the drafts come back "Needs photos".
  fs.mkdirSync(path.join(WORK, 'media'), { recursive: true });
  const tagged = {};
  for (const f of fs.readdirSync(path.join(LIBRARY, PLAN.folder))) if (/\.(jpe?g|png|webp|heic)$/i.test(f)) tagged[`lib:${PLAN.folder}/${f}`] = { tags: ['treatment', `t:${PLAN.topicId}`], manual: true };
  fs.writeFileSync(path.join(WORK, 'media', 'tags.json'), JSON.stringify(tagged, null, 2));
  const sp = path.join(USER_DATA, 'settings.json');
  const settings = fs.existsSync(sp) ? JSON.parse(fs.readFileSync(sp, 'utf8')) : {};
  fs.writeFileSync(sp, JSON.stringify({ ...settings, libraryDir: LIBRARY, writer: 'claude', model: settings.model || 'claude-sonnet-5-5' }, null, 2));

  const app = await _electron.launch({
    executablePath: require(path.join(APP, 'node_modules', 'electron')), args: [APP], cwd: APP,
    env: { ...process.env, STUDIO_USER_DATA: USER_DATA, STUDIO_WORK_DIR: WORK },
  });
  const page = await app.firstWindow();
  await app.evaluate(({ BrowserWindow }, [w, h]) => { const win = BrowserWindow.getAllWindows()[0]; win.setContentSize(w, h); win.center(); }, [W, H]);
  await page.waitForLoadState('domcontentloaded');
  const settle = ms => page.waitForTimeout(ms);
  await settle(2500);

  const frames = [];
  let n = 0, t0 = null;
  const shot = async (label, extra = {}) => {
    await settle(200);
    const file = String(n++).padStart(3, '0') + '-' + label + '.png';
    await page.screenshot({ path: path.join(OUT, file) });
    frames.push({ file, label, elapsed: t0 ? (Date.now() - t0) / 1000 : null, rects: await page.evaluate(MEASURE), ...extra });
    process.stdout.write('.');
  };
  const click = async sel => { await page.locator(sel).first().scrollIntoViewIfNeeded(); await page.locator(sel).first().click(); };
  const setVal = (sel, v) => page.evaluate(([s, v]) => { const e = document.querySelector(s); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); }, [sel, v]);

  try {
    // a key in the film profile, entered by a human in the app's own Settings
    if (!DRY && !(await page.evaluate(() => writerReady('claude')))) {
      await click('#openSettings');
      console.log('\nThe film profile has no Claude key. Paste one into Settings in the app window and save it. Waiting...');
      const until = Date.now() + 15 * 60e3;
      while (!(await page.evaluate(() => writerReady('claude')))) { if (Date.now() > until) throw new Error('no key after 15 minutes'); await settle(2000); }
      console.log('Key saved. Starting the capture.');
      await page.reload(); await settle(2500);
    }
    // wait for the Dropbox library to be read
    for (let i = 0; i < 60 && (await page.evaluate(() => (state.media || []).length)) < 30; i++) await settle(1000);
    console.log('\nlibrary:', await page.evaluate(() => (state.media || []).length), 'files');

    // set up the form (not filmed): everything but the brief
    await click('#planPeriod'); await settle(800);
    await page.locator('#planName').fill(PLAN.name);
    await setVal('#planStart', PLAN.start);
    await page.locator('#planWeeks').selectOption(PLAN.weeks);
    await page.locator('#planType').selectOption(PLAN.type); await settle(300);
    await page.locator('#planTopics .chip', { hasText: PLAN.topic }).first().click();
    await setVal('#planShare', String(PLAN.share));
    await page.locator('#planHook').fill(PLAN.hook);
    for (const d of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
      const chip = page.locator('#planDays .chip', { hasText: new RegExp('^' + d + '$') }).first();
      const on = (await chip.getAttribute('class')).includes(' on');
      if (on !== PLAN.days.includes(d)) await chip.click();
    }
    await page.locator('#planClips').fill('1');
    await page.locator('#planBrief').scrollIntoViewIfNeeded();
    await page.evaluate(() => document.querySelector('#planBrief').scrollIntoView({ block: 'center' }));
    await page.locator('#planBrief').click(); await settle(300);

    // the film: the brief being written
    await shot('brief-0', { typed: 0 });
    for (let i = 4; i < PLAN.brief.length + 4; i += 4) {
      await page.keyboard.type(PLAN.brief.slice(i - 4, i), { delay: 15 });
      await shot('brief-' + Math.min(i, PLAN.brief.length), { typed: Math.min(i, PLAN.brief.length) });
    }
    await click('#planPreview'); await settle(900);
    await page.evaluate(() => document.querySelector('#planPreviewBlock').scrollIntoView({ block: 'center' }));
    const rows = await page.locator('#planRows tr').count();
    if (rows !== 5) throw new Error('expected 5 planned posts, the plan has ' + rows);
    await shot('plan');
    if (DRY) { console.log('\ndry run: stopped before drafting'); return; }

    // create and draft: real Claude calls, captured as they land, with real elapsed time
    await page.evaluate(() => document.querySelector('#planCreateDraft').scrollIntoView({ block: 'center' }));
    await click('#planCreateDraft');
    t0 = Date.now();
    await settle(600);
    const status = () => page.evaluate(() => [...document.querySelectorAll('#boardRows .pill.st')].map(p => p.textContent));
    for (;;) {
      await shot('board');
      const st = await status();
      if (st.length === 5 && !st.some(s => /Planned|Drafting/.test(s))) break;
      if (Date.now() - t0 > 6 * 60e3) throw new Error('drafting took over 6 minutes: ' + st.join(', '));
      await settle(1200);
    }
    const final = await status();
    console.log('\ndrafted in', ((Date.now() - t0) / 1000).toFixed(1) + 's:', final.join(', '));
    await settle(800); await shot('board-done');
    t0 = null;

    // review one post: a campaign post about the spotlight treatment that came back Ready. Never an everyday post
    const pickAny = await page.evaluate(src => { const re = new RegExp(src, 'i');
      return [...document.querySelectorAll('#boardRows .board-row')].findIndex(r => r.classList.contains('st-ready') && /campaign/i.test(r.querySelector('.board-when').textContent) && re.test(r.querySelector('.board-what').textContent)); }, PLAN.topicMatch.source);
    if (pickAny < 0) throw new Error('no CO2 campaign post came back Ready: ' + final.join(', '));
    await page.locator('#boardRows .board-row').nth(pickAny).locator('.board-thumb').click(); await settle(1500);
    await shot('post', { picked: pickAny });
    const slides = await page.locator('#strip > *').count();
    for (let i = 1; i < Math.min(slides, 5); i++) { await page.locator('#strip > *').nth(i).click(); await settle(700); await shot('slide-' + i); }
    await page.locator('#strip > *').first().click(); await settle(500);
    await click('.tab[data-tab="check"]'); await settle(500);
    await shot('check');

    // export: the slides and caption.txt, then the feed clip
    await click('#exportPng');
    await page.locator('#toast:not([hidden])').waitFor({ timeout: 60e3 });
    await shot('exported-slides');
    await page.locator('#toast').waitFor({ state: 'hidden', timeout: 10e3 }).catch(() => {});
    await click('#exportClipBtn'); await settle(400);
    await shot('clip-menu');
    await page.locator('#clipMenu button[data-format="feed"]').click(); await settle(500);
    await shot('clip-busy');
    await page.locator('#busy').waitFor({ state: 'hidden', timeout: 5 * 60e3 });
    await page.locator('#toast:not([hidden])').waitFor({ timeout: 10e3 }).catch(() => {});
    await shot('exported-clip');
    await click('#backToCampaign'); await settle(1200);
    await shot('board-exported');
  } finally {
    await app.close();
  }
  const exports = fs.existsSync(path.join(WORK, 'exports')) ? fs.readdirSync(path.join(WORK, 'exports'), { recursive: true }) : [];
  fs.writeFileSync(path.join(OUT, 'timeline.json'), JSON.stringify({ w: W, h: H, plan: PLAN, exports, frames }, null, 2));
  console.log('\n' + frames.length + ' frames ->', OUT, '\nexports:', exports.join(', '));
})().catch(e => { console.error('\n' + (e.stack || e)); process.exit(1); });
