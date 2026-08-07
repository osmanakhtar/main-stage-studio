// Re-records the review clip at a viewport that actually fits the feed column,
// so the frame is not two thirds empty page background.
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');

const RAW = path.join(__dirname, 'raw2');
const W = 940, H = 780;
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2,
    recordVideo: { dir: path.join(RAW, 'review'), size: { width: W, height: H } },
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:8899/index.html', { waitUntil: 'networkidle' });
  // Scale the feed up so it fills the frame rather than floating in whitespace.
  await page.addStyleTag({ content: 'body { zoom: 1.45; }' });
  await sleep(1200);

  const next = page.locator('.c-arrow.next').first();
  await sleep(900);

  // Through the five slides of the first post.
  for (let i = 0; i < 4; i++) {
    await next.click({ force: true });
    await sleep(1150);
  }
  await sleep(700);

  // Into the caption, then on through the feed.
  await page.evaluate(() => window.scrollBy({ top: 560, behavior: 'smooth' }));
  await sleep(2000);
  for (const y of [620, 640, 700, 640]) {
    await page.evaluate(t => window.scrollBy({ top: t, behavior: 'smooth' }), y);
    await sleep(1550);
  }
  await sleep(800);

  await page.close();
  await ctx.close();
  await browser.close();
  console.log('done');
})();
