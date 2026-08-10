/* Records the Booking Engine clip that leads the What We Do section on the
   MSS home page, and the still that posters it.

     node record-onboarding.js          # video  -> raw-onboarding/*.webm
     node record-onboarding.js --shot   # still  -> shots/intake-rule-trace.png

   Both drive the *published* prototype over HTTP, not a mock:
   site/public/work/booking-engine/prototype/index.html, served by the site's
   own dev/preview server. If that file changes, re-run this rather than
   editing the clip, which is the whole point of keeping it scripted.

   Three things this adds on top of a plain screen capture, per Osman
   10 Aug 2026:

     - a visible cursor, so a click reads as a click rather than the UI
       changing on its own;
     - an annotation card after every system decision point, naming the rule
       that just fired and the condition that satisfied it. The text is READ
       OUT OF THE LIVE RULE TRACE (#trace), never written here, so the clip
       cannot drift from what the prototype actually says;
     - brisk pacing. The previous cut ran 61s at 8fps; this one is ~40s at
       25fps and is the same journey.

   The journey is Marbury Hale (chartered accountants), Year End Accounts:
   the one service that exercises screening, three signed documents and a
   deposit in a single run.
*/

const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');
const fs = require('fs');

// ?tenant= opens straight onto the accountancy practice, so the clip never
// spends its opening seconds toggling away from a conveyancer: the tenant
// switch is a point about the engine, not about this journey, and it was the
// first thing a viewer saw. ?coach=0 suppresses the prototype's own first-run
// tips, which are there for someone driving it by hand and would fight the
// narrative panel here. Both flags live in the prototype, so this records the
// shipped file rather than a special build of it.
const BASE = process.env.PROTO_URL || 'http://localhost:4321/work/booking-engine/prototype/';
const URL  = BASE + (BASE.includes('?') ? '&' : '?') + 'tenant=marbury&coach=0';
const RAW  = path.join(__dirname, 'raw-onboarding');
const SHOTS = path.join(__dirname, 'shots');
const SHOT_ONLY = process.argv.includes('--shot');

// Captured and delivered at 1920x1080, per Osman 10 Aug 2026. The earlier cut
// recorded at 1080 and wrote down to 720, which put a resample on top of VP8's
// own loss and left the widget copy soft. Recording 1:1 removes one of those
// two steps; the H.264 pass then runs at a low CRF rather than a small frame.
// 1080 is also the height the documents step needs to fit without scrolling.
const VW = 1920, VH = 1080;
const OW = 1920, OH = 1080;

// One dial for the whole cut. 0.7 was tried and read as rushed, so the beats
// now run at their written length and the panel's hold is derived from its own
// word count. Drop it only to preview a long cut quickly, never to ship one.
const PACE = Number(process.env.PACE || 0.92);
const sleep = ms => new Promise(r => setTimeout(r, Math.round(ms * PACE)));

/* ── The overlay ──────────────────────────────────────────────────────────
   Injected before any page script runs, and deliberately inert: it draws a
   cursor and a caption and touches nothing else. Everything it says about a
   rule is scraped from the trace the prototype rendered itself. */
const OVERLAY = () => {
  window.__fx = {};

  // addInitScript runs before the document exists, so the nodes below cannot
  // be attached yet. Build on DOMContentLoaded and keep the driver waiting on
  // __fx.moveTo rather than assuming it is there.
  const build = () => {

  const style = document.createElement('style');
  style.textContent = `
    #fx-cursor{position:fixed;left:0;top:0;width:26px;height:26px;z-index:2147483647;
      pointer-events:none;transform:translate(-100px,-100px);
      transition:transform .42s cubic-bezier(.22,1,.36,1);
      filter:drop-shadow(0 2px 6px rgba(0,0,0,.45))}
    #fx-ring{position:fixed;left:0;top:0;width:44px;height:44px;margin:-22px 0 0 -22px;
      border-radius:50%;border:2px solid #BF6B47;z-index:2147483646;pointer-events:none;
      opacity:0;transform:translate(-100px,-100px) scale(.35)}
    #fx-ring.go{animation:fxRing .5s cubic-bezier(.22,1,.36,1)}
    @keyframes fxRing{
      0%{opacity:.95;transform:var(--fxp) scale(.3)}
      100%{opacity:0;transform:var(--fxp) scale(1.5)}}
    /* The narrative panel. The widget is 720px centred, so with the rule
       trace docked there is ~575px of empty page down the left of every
       step. That is where the commentary goes: same place every time, so
       the eye learns where to look and the journey itself is never covered. */
    #fx-note{position:fixed;left:78px;top:50%;width:452px;z-index:2147483645;
      pointer-events:none;background:#14110E;
      border:1px solid rgba(191,107,71,.30);border-left:3px solid #BF6B47;
      padding:30px 34px 28px;
      box-shadow:0 24px 60px rgba(28,23,18,.30);
      font-family:'Plus Jakarta Sans',system-ui,sans-serif;
      opacity:0;transform:translateY(-50%) translateX(-18px);
      transition:opacity .38s ease,transform .52s cubic-bezier(.22,1,.36,1)}
    #fx-note.on{opacity:1;transform:translateY(-50%) translateX(0)}
    #fx-note .fx-id{display:block;font-size:10px;font-weight:600;letter-spacing:.22em;
      text-transform:uppercase;color:#E39B76;margin-bottom:15px}
    #fx-note .fx-t{display:block;font-size:19px;line-height:1.62;font-weight:300;
      color:#F5EFE5;letter-spacing:-.002em}
    #fx-note .fx-in{display:block;margin-top:19px;padding-top:15px;
      border-top:1px solid rgba(245,239,229,.15);
      font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
      font-size:11.5px;line-height:1.5;color:#A79C90;word-break:break-word}`;
  document.documentElement.appendChild(style);

  const add = html => {
    const d = document.createElement('div');
    d.innerHTML = html;
    const el = d.firstElementChild;
    document.documentElement.appendChild(el);
    return el;
  };

  const cursor = add(`<svg id="fx-cursor" viewBox="0 0 24 24" fill="none">
      <path d="M5 2.5 19.5 11.2l-6.4.9-3.2 6.1z" fill="#F5EFE5" stroke="#1C1712" stroke-width="1.3" stroke-linejoin="round"/>
    </svg>`);
  const ring = add(`<div id="fx-ring"></div>`);
  const note = add(`<div id="fx-note"><span class="fx-id"></span><span class="fx-t"></span><span class="fx-in"></span></div>`);

  window.__fx.moveTo = (x, y) => {
    cursor.style.transform = `translate(${x - 4}px, ${y - 3}px)`;
  };
  window.__fx.press = (x, y) => {
    const p = `translate(${x}px, ${y}px)`;
    ring.style.setProperty('--fxp', p);
    ring.style.transform = p;
    ring.classList.remove('go');
    void ring.offsetWidth;
    ring.classList.add('go');
  };

  /* Pull a rule straight out of the trace the prototype rendered. Returns
     null when the rule has not fired, so a caption can never claim a rule
     the engine did not actually apply. */
  window.__fx.rule = id => {
    const rows = Array.from(document.querySelectorAll('#trace .tr'));
    const hit = rows.reverse().find(r => r.querySelector('.tr-id').textContent.trim() === id);
    if (!hit) return null;
    return {
      id,
      t: hit.querySelector('.tr-t').textContent.trim(),
      in: (hit.querySelector('.tr-in') || {}).textContent || '',
    };
  };

  window.__fx.note = (label, t, foot) => {
    note.querySelector('.fx-id').textContent = label;
    note.querySelector('.fx-t').textContent = t;
    const inEl = note.querySelector('.fx-in');
    inEl.textContent = foot || '';
    inEl.style.display = foot ? 'block' : 'none';
    note.classList.add('on');
  };
  window.__fx.clear = () => note.classList.remove('on');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build, { once: true });
  } else {
    build();
  }
};

/* ── Driver ─────────────────────────────────────────────────────────────── */
class Run {
  constructor(page) { this.page = page; }

  async moveTo(sel, nth) {
    const el = nth === undefined ? this.page.locator(sel).first() : this.page.locator(sel).nth(nth);
    await el.scrollIntoViewIfNeeded();
    const b = await el.boundingBox();
    if (!b) throw new Error('no box for ' + sel);
    const x = b.x + b.width / 2, y = b.y + Math.min(b.height / 2, 26);
    await this.page.evaluate(([x, y]) => window.__fx.moveTo(x, y), [x, y]);
    return { el, x, y };
  }

  // Move the cursor, ripple, then click for real. The pause before the click
  // is what makes the pointer read as deliberate rather than teleporting.
  async click(sel, nth, { settle = 420, travel = 340 } = {}) {
    const { el, x, y } = await this.moveTo(sel, nth);
    await sleep(travel);
    await this.page.evaluate(([x, y]) => window.__fx.press(x, y), [x, y]);
    await sleep(110);
    await el.click({ force: true });
    await sleep(settle);
  }

  async type(sel, value, { per = 26 } = {}) {
    const { el } = await this.moveTo(sel);
    await sleep(200);
    await el.click({ force: true });
    await el.fill('');            // type() appends; the signature field is reused
    await el.type(value, { delay: per });
    await sleep(120);
  }

  /* Narrate a decision point.
     The prose is authored (see NARRATIVE): the raw trace rows are written for
     a compliance reader, not for someone meeting the idea for the first time,
     and the clip's job is to explain what the system is checking and putting
     in order. What is NOT authored is the claim that the rule fired. Every
     beat still names a rule, still looks it up in the live trace, and still
     throws if that rule is absent, so the commentary cannot describe a check
     the engine did not actually run. The footer prints the engine's own
     condition string verbatim.

     Hold defaults to reading speed rather than a fixed number, so a longer
     line is not on screen for the same time as a short one. */
  async note(id, { label, text, hold, foot = true, fade = 340 } = {}) {
    const r = await this.page.evaluate(i => window.__fx.rule(i), id);
    if (!r) throw new Error(`rule ${id} never fired — the journey or the prototype changed`);
    const words = text.trim().split(/\s+/).length;
    const ms = hold || Math.max(2400, 700 + words * 235);
    await this.page.evaluate(
      ([l, t, f]) => window.__fx.note(l, t, f),
      [label, text, foot && r.in ? r.id + '  ·  ' + r.in : (foot ? r.id : '')]
    );
    await sleep(ms);
    await this.page.evaluate(() => window.__fx.clear());
    await sleep(fade);
  }

  async sign(name, { fast = false } = {}) {
    const page = this.page;
    // Clause count varies by document: Terms and CDD carry two, the Letter of
    // Engagement three. Tick whatever this one has, or the sign button stays
    // disabled and the journey stalls on the documents step.
    const clauses = await page.locator('[data-clause]').count();
    for (let i = 0; i < clauses; i++) {
      await this.click(`[data-clause="${i}"]`, undefined, { settle: fast ? 140 : 260, travel: fast ? 220 : 320 });
    }

    const pad = await page.locator('#sigpad').first();
    await pad.scrollIntoViewIfNeeded();
    const b = await pad.boundingBox();
    const y0 = b.y + b.height * 0.66, x0 = b.x + b.width * 0.08;
    await page.evaluate(([x, y]) => window.__fx.moveTo(x, y), [x0, y0]);
    await sleep(280);
    await page.mouse.move(x0, y0);
    await page.mouse.down();
    const steps = fast ? 14 : 30, span = b.width * 0.42;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x0 + span * t;
      const y = y0 - Math.sin(t * Math.PI * 2.1) * b.height * 0.24 - t * b.height * 0.06;
      await page.mouse.move(x, y);
      if (!fast || i % 2 === 0) await page.evaluate(([x, y]) => window.__fx.moveTo(x, y), [x, y]);
      await sleep(fast ? 6 : 10);
    }
    await page.mouse.up();
    await sleep(fast ? 200 : 340);

    await this.type('#sig-name', name, { per: fast ? 14 : 22 });
    await this.click('#btn-sign', undefined, { settle: fast ? 520 : 700 });
  }
}

/* ── The narrative ──────────────────────────────────────────────────────
   What the panel says at each beat. Written to explain what the system is
   checking and putting in order, in the order a first-time viewer meets it.
   Each entry names the rule it belongs to; note() verifies that rule actually
   fired before it will show the line. */
const N = {
  service: [
    'THE CHOICE SETS THE REQUIREMENTS',
    'Year end accounts is anti-money-laundering work. Before asking a single question, the system has decided this client gets risk-assessed, signs three documents, and pays 25% at booking.',
  ],
  sanctions: [
    'A CHECK THAT CAN STOP EVERYTHING',
    'Sanctions is the one answer that ends the journey. No time offered, no payment taken, no negotiating it.',
  ],
  pep: [
    'A CHECK THAT CHANGES THE PATH',
    'A politically exposed person is not a refusal. It routes the booking for enhanced checks and partner approval instead.',
  ],
  clearance: [
    'AND ONE THAT CREATES AN OBLIGATION',
    'Changing accountants means the practice owes the previous adviser a clearance request. The system raises it as work to do, not as a reason to say no.',
  ],
  hold: [
    'THE SLOT IS HELD, NOT PENCILLED IN',
    'Choosing a time leases it immediately, buffer included. Nobody else is offered it while the client finishes. Most booking forms get this wrong.',
  ],
  clause: [
    'EACH CLAUSE, ON ITS OWN',
    'Every clause is acknowledged and stamped separately. One tick at the bottom of a long page will not survive being questioned later.',
  ],
  sign: [
    'SIGNED, RENDERED, HASHED',
    'The signature is captured, the PDF rendered and hashed. Version, method, time and every clause event are stored with it.',
  ],
  payment: [
    'AUTHORISED, NOT YET TAKEN',
    'The deposit is authorised, not captured. If the commit that follows fails, it is released and nothing exists.',
  ],
  commit: [
    'ONE TRANSACTION, OR NONE',
    'Now it commits at once: slot locked, documents sealed, payment captured, calendar written, pack sent. The client is a client, in one sitting.',
  ],
};

/* ── The journey ────────────────────────────────────────────────────────── */
async function drive(page, { shot = false } = {}) {
  const r = new Run(page);

  await page.waitForSelector('#cta-hero');
  await sleep(shot ? 400 : 1400);

  // The dock auto-opens on load to show the disclaimer once. Put it away and
  // let the practice site be the first thing the clip is actually about.
  await r.click('#dock-pill', undefined, { settle: 420 });

  // The rule trace stays docked for the whole clip, per Osman 10 Aug 2026. It
  // is the compliance artefact and it belongs in the prototype; on a 40-second
  // introduction it is a wall of small type competing with the journey, and
  // the left-hand panel is saying the same thing in a way a stranger can read.

  // Into the journey from the practice site, so the service context carries in.
  await r.click('#cta-hero', undefined, { settle: 620 });

  await r.click('.cat-chip[data-cat="compliance"]', undefined, { settle: 340 });
  await r.click('.svc[data-svc="ltd-accounts"]', undefined, { settle: 560 });

  if (shot) {
    // The still is the same journey the clip shows, framed on the step that
    // carries it best. Runs silent: no cursor, no panel.
    await r.click('#btn-next', undefined, { settle: 420 });
    for (const q of ['sanctions', 'pep', 'overseas', 'clearance']) {
      await page.click(`[data-q="${q}"][data-v="0"]`, { force: true });
      await sleep(120);
    }
    await r.click('#btn-next', undefined, { settle: 420 });
    await page.click('.slot >> nth=6', { force: true });
    await sleep(200);
    await r.click('#btn-next', undefined, { settle: 380 });
    for (const [s, v] of FIELDS) await page.fill(s, v);
    await sleep(200);
    await r.click('#btn-next', undefined, { settle: 900 });
    // Same frame the clip shows: the documents step with the narrative panel
    // beside it and the rule trace docked. The still and the clip have to be
    // the same journey, or the thumbnail is advertising a different product
    // to the one that plays.
    await page.evaluate(([l, t]) => {
      document.getElementById('fx-cursor').style.opacity = 0;
      window.__fx.note(l, t, '');
    }, [N.clause[0], N.clause[1]]);
    await sleep(900);
    return;
  }

  await r.note('RULE-010', { label: N.service[0], text: N.service[1] });

  await r.click('#btn-next', undefined, { settle: 700 });

  // Every answer is its own decision, but the four make two points between
  // them: one answer can stop the journey, the rest reroute it. Sanctions and
  // PEP carry those; overseas and clearance are answered without a line, so
  // the step does not restate itself twice more.
  for (const [q, id, key] of [
    ['sanctions', 'RULE-011', 'sanctions'],
    ['pep',       'RULE-012', 'pep'],
    ['overseas',  'RULE-013', null],
    ['clearance', 'RULE-014', null],
  ]) {
    await r.click(`[data-q="${q}"][data-v="0"]`, undefined, { settle: key ? 260 : 420, travel: 380 });
    if (key) await r.note(id, { label: N[key][0], text: N[key][1] });
  }

  await r.click('#btn-next', undefined, { settle: 800 });

  await r.click('.slot', 6, { settle: 520 });
  await r.note('HOLD', { label: N.hold[0], text: N.hold[1] });

  await r.click('#btn-next', undefined, { settle: 620 });

  for (const [s, v] of FIELDS) await r.type(s, v, { per: 18 });
  await r.click('#btn-next', undefined, { settle: 900 });

  // Three documents. Only the first is narrated: the second and third run at
  // speed because the point has been made and repeating it is dead air.
  await r.sign('Rebecca Ellery');
  await r.note('CLAUSE', { label: N.clause[0], text: N.clause[1] });
  await r.note('SIGN', { label: N.sign[0], text: N.sign[1] });

  await r.sign('Rebecca Ellery', { fast: true });
  await r.sign('Rebecca Ellery', { fast: true });
  await sleep(400);

  if (!await page.$('#btn-auth')) await r.click('#btn-next', undefined, { settle: 800 });
  if (!await page.$('#btn-auth')) {
    const where = await page.evaluate(() => ({
      step: (document.querySelector('#steps .step.on') || {}).textContent,
      tabs: Array.from(document.querySelectorAll('.doc-tab')).map(t => t.className + '|' + t.textContent.trim().slice(0, 30)),
      title: (document.querySelector('#w-body .w-title') || {}).textContent,
    }));
    throw new Error('never reached payment: ' + JSON.stringify(where));
  }

  await r.click('#btn-auth', undefined, { settle: 900 });
  await r.note('PAYMENT', { label: N.payment[0], text: N.payment[1] });

  await r.click('#btn-next', undefined, { settle: 1200 });
  await r.note('COMMIT', { label: N.commit[0], text: N.commit[1], hold: 5600 });
  await sleep(1300);
}

const FIELDS = [
  ['#f-first', 'Rebecca'],
  ['#f-last', 'Ellery'],
  ['#f-email', 'r.ellery@northgatejoinery.co.uk'],
  ['#f-mobile', '07700 900412'],
];

(async () => {
  fs.mkdirSync(RAW, { recursive: true });
  fs.mkdirSync(SHOTS, { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: VW, height: VH },
    deviceScaleFactor: SHOT_ONLY ? 2 : 1,
    reducedMotion: 'no-preference',
    ...(SHOT_ONLY ? {} : { recordVideo: { dir: RAW, size: { width: OW, height: OH } } }),
  });
  const page = await ctx.newPage();
  await page.addInitScript(OVERLAY);
  page.on('pageerror', e => console.log('PAGE ERROR:', e.message));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await drive(page, { shot: SHOT_ONLY });

  if (SHOT_ONLY) {
    // Cropped to the narrative panel plus the widget, at roughly the shape the
    // Work card renders (~1.45:1), so the card's object-cover has almost
    // nothing to trim. Captured wide and cropped rather than recorded at a
    // narrow viewport: below ~1300px the widget reflows and this same drive
    // cannot be trusted to reach the documents step.
    const crop = await page.evaluate(() => {
      const note = document.getElementById('fx-note').getBoundingClientRect();
      const w = document.querySelector('.widget').getBoundingClientRect();
      const pad = 46;
      const x = Math.max(0, Math.round(note.left - pad));
      const width = Math.min(window.innerWidth - x, Math.round(w.right - x + pad));
      const height = Math.min(window.innerHeight, Math.round(width / 1.45));
      // The panel is centred on the viewport, not on the crop, so recentre it
      // before the shot or it sits low with a dead band above it.
      document.getElementById('fx-note').style.top = Math.round(height / 2) + 'px';
      return { x, y: 0, width, height };
    });
    await sleep(500);
    await page.screenshot({ path: path.join(SHOTS, 'intake-rule-trace.png'), clip: crop });
    console.log('crop', JSON.stringify(crop));
    console.log('still ->', path.join(SHOTS, 'intake-rule-trace.png'));
  }

  await page.close();
  await ctx.close();
  await browser.close();
  if (!SHOT_ONLY) console.log('video ->', RAW);
})();
