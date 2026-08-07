// Records the two tooling clips for the PureMed case study.
//   node record.js
// Output: raw .webm into ./raw/, one directory per clip.
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');

const RAW = path.join(__dirname, 'raw');
const W = 1280, H = 800;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function record(name, url, drive) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2,
    recordVideo: { dir: path.join(RAW, name), size: { width: W, height: H } },
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await sleep(900);
  await drive(page);
  await sleep(700);
  await page.close();
  await ctx.close();
  await browser.close();
  console.log('recorded', name);
}

// Clip 1 — the review preview the clinic actually sees.
async function driveReview(page) {
  // Settle at the top so the header reads.
  await sleep(1400);

  // Scroll to the first post card.
  await page.evaluate(() => window.scrollTo({ top: 120, behavior: 'smooth' }));
  await sleep(1500);

  // Step through the first carousel: this is the five-slide post.
  const next = page.locator('.c-arrow.next').first();
  for (let i = 0; i < 4; i++) {
    await next.click({ force: true });
    await sleep(1250);
  }
  await sleep(600);

  // Down to the caption beneath it.
  await page.evaluate(() => window.scrollBy({ top: 620, behavior: 'smooth' }));
  await sleep(2200);

  // Continue through the feed, pausing on each post.
  for (const y of [700, 700, 800, 700, 700]) {
    await page.evaluate(t => window.scrollBy({ top: t, behavior: 'smooth' }), y);
    await sleep(1600);
  }
  await sleep(900);
}

// Clip 2 — the pipeline, replaying real captured stdout.
async function driveTerminal(page) {
  await page.waitForFunction(() => window.__done === true, { timeout: 60000 });
  await sleep(500);
}

(async () => {
  await record('review', 'http://localhost:8899/index.html', driveReview);
  await record('pipeline', 'file://' + path.join(__dirname, 'terminal.html'), driveTerminal);
})();
