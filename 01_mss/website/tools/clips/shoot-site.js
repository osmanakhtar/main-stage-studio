// Captures the go-live PureMed site for the case study.
//
//   cd ~/workspace/main-stage-studio/02_clients/puremed/site && npx astro build
//   cd dist && python3 -m http.server 8901
//   node shoot-site.js
//
// The site going live is two pages: Home, and a single Treatments page carrying
// one anchored section per treatment, deep-linked from the nav. That is the
// version Nafisa reviewed element by element on Stage, so it is the version the
// case study shows. The standalone per-treatment prototypes in the client
// folder's web/ directory were explored and dropped; shooting those overstates
// the build by nine pages, which is what an earlier pass of this script did.
//
// Outputs to ./shots/:
//   home.png, home-full.png            viewport + whole scroll
//   treatments.png, treatments-full.png
//   tx-<id>.png                        one shot per treatment section
//   home-mobile.png, treatments-mobile.png
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'shots');
const BASE = 'http://localhost:8901';

const pages = [
  { url: '/',            n: 'home' },
  { url: '/treatments/', n: 'treatments' },
];

// Section ids, in page order. Sourced from src/pages/treatments.astro, where
// each is a `section.tx-section` with the same id the nav deep-links to.
const sections = [
  'laser-lift', 'liquid-facelift', 'anti-wrinkle', 'polynucleotides',
  'rf-microneedling', 'skin-boosters', 'plasma-fibroblast', 'body-sculpting',
  'skin-peels', 'dermaplaning', 'sculptra',
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

// The page uses fade-up scroll reveals. Scrolling the full height once resolves
// every reveal and every lazy image, so nothing shoots mid-transition or blank.
async function settle(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await sleep(900);
}

async function open(page, url) {
  try {
    await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle', timeout: 45000 });
  } catch {
    await page.goto(`${BASE}${url}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  }
  await settle(page);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  for (const p of pages) {
    await open(page, p.url);
    await page.screenshot({ path: path.join(OUT, `${p.n}.png`) });
    await page.screenshot({ path: path.join(OUT, `${p.n}-full.png`), fullPage: true });
    console.log('shot', p.n);
  }

  // Section shots. The page is already open and settled on /treatments/.
  for (const id of sections) {
    const el = await page.$(`section#${id}`);
    if (!el) {
      console.warn('MISSING section', id);
      continue;
    }
    await el.scrollIntoViewIfNeeded();
    await sleep(400);
    await el.screenshot({ path: path.join(OUT, `tx-${id}.png`) });
    console.log('shot section', id);
  }

  await ctx.close();

  // Most of the clinic's traffic lands on a phone, so both pages get shot at
  // phone width. Viewport only: a full-scroll shot of eleven stacked sections
  // is unreadable at this width.
  const m = await browser.newContext({
    viewport: { width: 414, height: 896 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const mp = await m.newPage();
  for (const p of pages) {
    await mp.goto(`${BASE}${p.url}`, { waitUntil: 'domcontentloaded' });
    await sleep(1400);
    await mp.screenshot({ path: path.join(OUT, `${p.n}-mobile.png`) });
    console.log('shot', p.n, 'mobile');
  }

  await m.close();
  await browser.close();
})();
