/* Shared driver for the product showcase clips (record-stage-editor.js,
   record-campaign-console.js). Written 1 Oct 2026.

   Same idea as record-onboarding.js (a visible cursor, deliberate pacing),
   with two differences forced by the products:

     - Both UIs fill the screen, so there is no empty page to put a narrative
       panel on. The product is recorded at 1440x1080 and the narration is
       composited beside it afterwards (composite-showcase.js), from a log of
       when each line was on screen. The recorder never draws captions.
     - The console is server-rendered, so a click often loads a new page. The
       cursor is re-installed on every document and restored to where it was,
       via sessionStorage, so it does not jump to the corner on navigation.
*/
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const VW = 1440, VH = 1080;
const PACE = Number(process.env.PACE || 1);
const sleep = ms => new Promise(r => setTimeout(r, Math.round(ms * PACE)));

// Injected before any page script. Inert: draws a cursor and a click ripple.
const CURSOR = () => {
  const build = () => {
    if (document.getElementById('fx-cursor')) return;
    const style = document.createElement('style');
    style.textContent = `
      #fx-cursor{position:fixed;left:0;top:0;width:26px;height:26px;z-index:2147483647;
        pointer-events:none;transition:transform .5s cubic-bezier(.22,1,.36,1);
        filter:drop-shadow(0 2px 6px rgba(0,0,0,.45))}
      #fx-cursor.jump{transition:none}
      #fx-ring{position:fixed;left:0;top:0;width:44px;height:44px;margin:-22px 0 0 -22px;
        border-radius:50%;border:2px solid #BF6B47;z-index:2147483646;pointer-events:none;
        opacity:0}
      #fx-ring.go{animation:fxRing .5s cubic-bezier(.22,1,.36,1)}
      @keyframes fxRing{0%{opacity:.95;transform:var(--fxp) scale(.3)}100%{opacity:0;transform:var(--fxp) scale(1.5)}}`;
    document.documentElement.appendChild(style);
    const wrap = document.createElement('div');
    wrap.innerHTML = `<svg id="fx-cursor" viewBox="0 0 24 24" fill="none"><path d="M5 2.5 19.5 11.2l-6.4.9-3.2 6.1z" fill="#F5EFE5" stroke="#1C1712" stroke-width="1.3" stroke-linejoin="round"/></svg><div id="fx-ring"></div>`;
    const cursor = wrap.children[0], ring = wrap.children[1];
    document.documentElement.appendChild(cursor);
    document.documentElement.appendChild(ring);
    const place = (x, y) => { cursor.style.transform = `translate(${x - 4}px, ${y - 3}px)`; };
    let start = [-60, -60];
    try { start = JSON.parse(sessionStorage.getItem('fxpos')) || start; } catch (e) {}
    cursor.classList.add('jump'); place(start[0], start[1]);
    void cursor.offsetWidth; cursor.classList.remove('jump');
    window.__fx = {
      moveTo(x, y) { place(x, y); try { sessionStorage.setItem('fxpos', JSON.stringify([x, y])); } catch (e) {} },
      press(x, y) {
        const p = `translate(${x}px, ${y}px)`;
        ring.style.setProperty('--fxp', p); ring.style.transform = p;
        ring.classList.remove('go'); void ring.offsetWidth; ring.classList.add('go');
      },
    };
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build, { once: true });
  else build();
};

class Run {
  constructor(page, t0) { this.page = page; this.t0 = t0; this.log = []; this.open = null; }

  t() { return (Date.now() - this.t0) / 1000; }

  // Narration. Logged with the video clock; drawn later by the compositor.
  say(label, text) {
    this.hush();
    this.open = { start: this.t(), label, text };
  }
  hush() {
    if (!this.open) return;
    this.log.push({ ...this.open, end: this.t() });
    this.open = null;
  }

  async ready() { await this.page.waitForFunction(() => window.__fx && window.__fx.moveTo); }

  async point(x, y, travel = 520) {
    await this.ready();
    await this.page.evaluate(([x, y]) => window.__fx.moveTo(x, y), [x, y]);
    await this.page.mouse.move(x, y, { steps: 12 });   // real hover states fire too
    await sleep(travel);
  }

  async box(target) {
    const el = typeof target === 'string' ? this.page.locator(target).first() : target;
    await el.scrollIntoViewIfNeeded();
    const b = await el.boundingBox();
    if (!b) throw new Error('no box for ' + target);
    return { el, b };
  }

  async moveTo(target, { dx = 0.5, dy = 0.5, travel } = {}) {
    const { el, b } = await this.box(target);
    const x = b.x + b.width * dx, y = b.y + Math.min(b.height * dy, b.height - 4);
    await this.point(x, y, travel);
    return { el, x, y };
  }

  async click(target, { settle = 700, travel, dx, dy, nav = false } = {}) {
    const { el, x, y } = await this.moveTo(target, { travel, dx, dy });
    await this.page.evaluate(([x, y]) => window.__fx.press(x, y), [x, y]);
    await sleep(140);
    if (nav) await Promise.all([this.page.waitForNavigation({ waitUntil: 'networkidle' }), el.click()]);
    else await el.click({ position: { x: x - (await el.boundingBox()).x, y: y - (await el.boundingBox()).y } });
    await sleep(settle);
  }

  // Smooth scroll by a distance, in steps, so it reads as a person scrolling.
  async scroll(dy, ms = 1400) {
    const steps = Math.max(8, Math.round(ms / 40));
    for (let i = 0; i < steps; i++) {
      await this.page.mouse.wheel(0, dy / steps);
      await new Promise(r => setTimeout(r, Math.round((ms * PACE) / steps)));
    }
    await sleep(300);
  }
}

// Opens a recording context. Returns { run, done } where done() closes the
// context, saves the narration log next to the video, and returns both paths.
async function record({ name, storageState, rawDir }) {
  fs.mkdirSync(rawDir, { recursive: true });
  for (const f of fs.readdirSync(rawDir)) if (f.endsWith('.webm')) fs.unlinkSync(path.join(rawDir, f));
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: VW, height: VH },
    storageState,
    recordVideo: { dir: rawDir, size: { width: VW, height: VH } },
  });
  await ctx.addInitScript(CURSOR);
  const page = await ctx.newPage();
  const run = new Run(page, Date.now());
  page.on('dialog', d => d.accept());   // native confirm(): never drawn in a headless capture
  return {
    run, page,
    async done() {
      run.hush();
      const video = await page.video().path();
      await ctx.close();
      await browser.close();
      const log = path.join(rawDir, name + '.narration.json');
      fs.writeFileSync(log, JSON.stringify({ video, beats: run.log }, null, 2));
      return { video, log };
    },
  };
}

module.exports = { record, sleep, VW, VH };
