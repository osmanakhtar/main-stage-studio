/* Shared recorder kit for the v6 tool clips (build plan step 6).

   Same method as record-onboarding.js (a visible cursor, a ripple before every
   real click, an authored narrative panel), restyled in MSS v6 direction A and
   pulled out so every clip uses one overlay instead of a copy each.

   Rules for anything recorded with this:
     - real tools only, never a mock-up;
     - demo data only (the fictional Vera clinic, or MSS itself);
     - narration says what the tool is doing, never a claim the screen does not show;
     - no em dashes in narration (standing rule).

   Usage (see record-console.js):
     const kit = require('./clip-kit');
     const { browser, ctx, page, run } = await kit.open({ dir: 'raw-v6-console' });
     await run.go(url); await run.note('Label', 'What is happening.'); ...
     const webm = await kit.close({ browser, ctx, page });
     kit.encode(webm, 'out-v6/console', { loopFrom: 3, loopFor: 8 });
*/
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const VW = 1920, VH = 1080;
const PACE = Number(process.env.PACE || 1);
const sleep = ms => new Promise(r => setTimeout(r, Math.round(ms * PACE)));

/* Injected before page scripts. Draws a cursor, a click ring and the panel; touches nothing else. */
const OVERLAY = () => {
  window.__fx = {};
  const build = () => {
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..800&family=Geist+Mono:wght@400;500&display=swap';
    document.documentElement.appendChild(font);
    const style = document.createElement('style');
    style.textContent = `
      #fx-cursor{position:fixed;left:0;top:0;width:28px;height:28px;z-index:2147483647;pointer-events:none;
        transform:translate(-100px,-100px);transition:transform .45s cubic-bezier(.22,1,.36,1);
        filter:drop-shadow(0 2px 6px rgba(0,0,0,.45))}
      #fx-ring{position:fixed;left:0;top:0;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;
        border:2px solid #FFB21A;z-index:2147483646;pointer-events:none;opacity:0;transform:translate(-100px,-100px) scale(.35)}
      #fx-ring.go{animation:fxRing .5s cubic-bezier(.22,1,.36,1)}
      @keyframes fxRing{0%{opacity:.95;transform:var(--fxp) scale(.3)}100%{opacity:0;transform:var(--fxp) scale(1.5)}}
      #fx-note{position:fixed;left:40px;bottom:40px;width:460px;z-index:2147483645;pointer-events:none;
        background:#12110F;border:1px solid #2E2B27;border-left:3px solid #FFB21A;padding:26px 30px 24px;
        box-shadow:0 24px 60px rgba(0,0,0,.35);opacity:0;transform:translateY(12px);
        transition:opacity .35s ease,transform .5s cubic-bezier(.22,1,.36,1)}
      #fx-note.on{opacity:1;transform:none}
      #fx-note .fx-id{display:block;font:500 11px/1 'Geist Mono',ui-monospace,monospace;letter-spacing:.2em;
        text-transform:uppercase;color:#FFB21A;margin-bottom:14px}
      #fx-note .fx-t{display:block;font:400 18px/1.5 Archivo,system-ui,sans-serif;color:#F3F1EC}
      #fx-tag{position:fixed;right:24px;bottom:24px;z-index:2147483645;pointer-events:none;
        font:500 11px/1 'Geist Mono',ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;
        color:#A6A39B;background:rgba(18,17,15,.86);border:1px solid #2E2B27;padding:9px 12px;display:none}`;
    document.documentElement.appendChild(style);
    const add = html => { const d = document.createElement('div'); d.innerHTML = html; const el = d.firstElementChild; document.documentElement.appendChild(el); return el; };
    const cursor = add(`<svg id="fx-cursor" viewBox="0 0 24 24" fill="none"><path d="M5 2.5 19.5 11.2l-6.4.9-3.2 6.1z" fill="#F3F1EC" stroke="#12110F" stroke-width="1.3" stroke-linejoin="round"/></svg>`);
    const ring = add(`<div id="fx-ring"></div>`);
    const note = add(`<div id="fx-note"><span class="fx-id"></span><span class="fx-t"></span></div>`);
    const tag = add(`<div id="fx-tag"></div>`);
    window.__fx.moveTo = (x, y) => { cursor.style.transform = `translate(${x - 4}px, ${y - 3}px)`; };
    window.__fx.press = (x, y) => { const p = `translate(${x}px, ${y}px)`; ring.style.setProperty('--fxp', p); ring.style.transform = p; ring.classList.remove('go'); void ring.offsetWidth; ring.classList.add('go'); };
    window.__fx.note = (label, t) => { note.querySelector('.fx-id').textContent = label; note.querySelector('.fx-t').textContent = t; note.classList.add('on'); };
    window.__fx.clear = () => note.classList.remove('on');
    window.__fx.tag = t => { tag.textContent = t; tag.style.display = t ? 'block' : 'none'; };
    if (window.__fxPos) window.__fx.moveTo(window.__fxPos[0], window.__fxPos[1]);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build, { once: true }); else build();
};

class Run {
  constructor(page, opts = {}) { this.page = page; this.tag = opts.tag || ''; const w = opts.w || VW, h = opts.h || VH; this.pos = [w * 0.6, h * 0.6]; }
  async ready() {
    await this.page.waitForFunction(() => window.__fx && window.__fx.moveTo);
    await this.page.evaluate(([p, t]) => { window.__fx.moveTo(p[0], p[1]); window.__fx.tag(t); }, [this.pos, this.tag]);
  }
  async go(url, { settle = 900 } = {}) { await this.page.goto(url, { waitUntil: 'networkidle' }); await this.ready(); await sleep(settle); }
  async after(fn, { settle = 900 } = {}) { await Promise.all([this.page.waitForLoadState('networkidle'), fn()]); await this.ready(); await sleep(settle); }
  async moveTo(target) {
    const el = typeof target === 'string' ? this.page.locator(target).first() : target;
    await el.scrollIntoViewIfNeeded();
    const b = await el.boundingBox();
    if (!b) throw new Error('no box for ' + target);
    const x = b.x + Math.min(b.width / 2, 120), y = b.y + Math.min(b.height / 2, 24);
    this.pos = [x, y];
    await this.page.evaluate(([x, y]) => { window.__fxPos = [x, y]; window.__fx.moveTo(x, y); }, [x, y]);
    return { el, x, y };
  }
  async point(target, { hold = 700 } = {}) { await this.moveTo(target); await sleep(hold); }
  async click(target, { settle = 700, travel = 520, nav = false } = {}) {
    const { el, x, y } = await this.moveTo(target);
    await sleep(travel);
    await this.page.evaluate(([x, y]) => window.__fx.press(x, y), [x, y]);
    await sleep(120);
    if (nav) return this.after(() => el.click({ force: true }), { settle });
    await el.click({ force: true });
    await sleep(settle);
  }
  async type(target, value, { per = 34, clear = false } = {}) {
    const { el } = await this.moveTo(target);
    await sleep(240);
    await el.click({ force: true });
    if (clear) await el.fill('');
    await el.type(value, { delay: per });
    await sleep(260);
  }
  /* Pointer drag (mouse down, glide, up) with the overlay cursor following, for tools that
     drag with pointer events rather than HTML5 drag and drop. */
  async drag(from, to, { steps = 26, settle = 650 } = {}) {
    const a = await (typeof from === 'string' ? this.page.locator(from).first() : from).boundingBox();
    const c = await (typeof to === 'string' ? this.page.locator(to).first() : to).boundingBox();
    const x0 = a.x + a.width / 2, y0 = a.y + a.height / 2, x1 = c.x + c.width / 2, y1 = c.y + c.height / 2;
    await this.page.evaluate(([x, y]) => window.__fx.moveTo(x, y), [x0, y0]);
    await sleep(480);
    await this.page.mouse.move(x0, y0); await this.page.mouse.down();
    for (let i = 1; i <= steps; i++) {
      const t = i / steps, e = t * t * (3 - 2 * t), x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e;
      await this.page.mouse.move(x, y);
      await this.page.evaluate(([x, y]) => window.__fx.moveTo(x, y), [x, y]);
      await sleep(16);
    }
    await this.page.mouse.up(); this.pos = [x1, y1];
    await sleep(settle);
  }
  async scroll(px, { steps = 24, settle = 500 } = {}) {
    for (let i = 0; i < steps; i++) { await this.page.mouse.wheel(0, px / steps); await sleep(18); }
    await sleep(settle);
  }
  /* Authored narration. Hold follows reading speed so long lines stay up longer. */
  async note(label, text, { hold } = {}) {
    if (text.includes(String.fromCharCode(0x2014))) throw new Error('em dash in narration: ' + text);
    const words = text.trim().split(/\s+/).length;
    await this.page.evaluate(([l, t]) => window.__fx.note(l, t), [label, text]);
    await sleep(hold || Math.max(2200, 600 + words * 240));
    await this.page.evaluate(() => window.__fx.clear());
    await sleep(380);
  }
}

async function open({ dir, tag, storageState, colorScheme = 'dark', initScripts = [], size = { width: VW, height: VH } }) {
  const out = path.join(__dirname, dir);
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1, colorScheme, storageState,
    recordVideo: { dir: out, size } });
  await ctx.addInitScript(OVERLAY);
  for (const s of initScripts) await ctx.addInitScript(s);
  const page = await ctx.newPage();
  return { browser, ctx, page, run: new Run(page, { tag, w: size.width, h: size.height }) };
}

async function close({ browser, ctx, page }) {
  const video = page.video();
  await ctx.close(); await browser.close();
  return video ? await video.path() : null;
}

/* Two cuts from one capture: the full narrated clip, and a short silent loop for cards.
   H.264 MP4 + VP9 WebM + a WebP poster for each. */
function encode(webm, outBase, { trimStart = 0, trimEnd = 0.6, loopFrom = 0, loopFor = 8, posterAt = 1 } = {}) {
  fs.mkdirSync(path.dirname(outBase), { recursive: true });
  // Closing the context leaves a blank frame or two at the end; cut them.
  const total = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', webm]).toString());
  const len = ['-t', String(Math.max(1, total - trimStart - trimEnd))];
  const ff = args => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
  const h264 = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an'];
  const vp9 = ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '34', '-row-mt', '1', '-an'];
  const fps = ['-vf', 'fps=30'];
  ff(['-ss', String(trimStart), ...len, '-i', webm, ...fps, ...h264, outBase + '.mp4']);
  ff(['-ss', String(trimStart), ...len, '-i', webm, ...fps, ...vp9, outBase + '.webm']);
  const webp = (at, out, vf) => { const png = out.replace(/\.webp$/, '.png'); ff(['-ss', String(at), '-i', webm, '-frames:v', '1', ...(vf ? ['-vf', vf] : []), png]); execFileSync('magick', [png, '-quality', '86', out]); fs.unlinkSync(png); };
  webp(trimStart + posterAt, outBase + '.webp');
  const loopVf = ['-vf', 'fps=30,scale=1280:-2'];
  ff(['-ss', String(loopFrom), '-t', String(loopFor), '-i', webm, ...loopVf, ...h264, outBase + '-loop.mp4']);
  ff(['-ss', String(loopFrom), '-t', String(loopFor), '-i', webm, ...loopVf, ...vp9, outBase + '-loop.webm']);
  webp(loopFrom, outBase + '-loop.webp', 'scale=1280:-2');
  return ['.mp4', '.webm', '.webp', '-loop.mp4', '-loop.webm', '-loop.webp'].map(s => outBase + s);
}

module.exports = { open, close, encode, sleep, VW, VH };
