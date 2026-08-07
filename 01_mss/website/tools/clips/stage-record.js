// Step 2 of 2 for recording Stage. Run stage-auth.js first.
//
//   node stage-record.js
//
// Records the client's view of the review tool, signed in as the client.
//
// SAFETY. This drives a LIVE engagement with real saved client decisions, so
// the script is strictly read-only. It navigates, scrolls, switches tabs, and
// opens the per-element review panel to show the three choices. It never
// clicks any of them, and never touches Approve all, Sign off, Done with
// images, or an image tile. Opening a panel displays the decision already
// saved against that element; it does not record a new one. Verified by hand
// before this script was written: the reviewed count was unchanged after
// opening a panel.
//
// If you extend this, keep that property. A case study is not worth
// overwriting a client's actual feedback.
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const STATE = path.join(__dirname, 'stage-state.json');
const RAW = path.join(__dirname, 'raw-stage');
const W = 1360, H = 850;

// Anything matching this must never be clicked.
const FORBIDDEN = /sign off|approve all|done with images|approve as written|i've made changes|i’ve made changes|flag for discussion|delete|remove|publish/i;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function safeClick(page, locator, why) {
  const text = ((await locator.first().innerText().catch(() => '')) || '').trim();
  if (FORBIDDEN.test(text)) {
    throw new Error(`Refusing to click "${text}" (${why}). This writes to a live engagement.`);
  }
  await locator.first().click({ force: true });
}

(async () => {
  if (!fs.existsSync(STATE)) {
    console.error('No stage-state.json. Run `node stage-auth.js` and sign in first.');
    process.exit(1);
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2,
    storageState: STATE,
    recordVideo: { dir: RAW, size: { width: W, height: H } },
  });
  const page = await ctx.newPage();

  // 1. Straight into the engagement.
  //
  // Deliberately NOT via /reviews. That list shows every engagement on the
  // account, including other clients by name, and this clip is going on a
  // public page. Skipping it is cheaper than blurring it.
  await page.goto('https://mss-review.duckdns.org/review/puremed', { waitUntil: 'networkidle' });
  await sleep(3000);

  // 2. Scroll the live site inside the tool. The preview is an iframe, so the
  // wheel has to land over it rather than over the chrome.
  await page.mouse.move(560, 500);
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, 620);
    await sleep(1300);
  }
  await sleep(700);
  await page.mouse.wheel(0, -1860);
  await sleep(1500);

  // 4. Desktop to mobile and back.
  const mobile = page.locator('text=MOBILE').first();
  if (await mobile.count()) {
    await safeClick(page, mobile, 'mobile preview');
    await sleep(3000);
    await safeClick(page, page.locator('text=DESKTOP').first(), 'back to desktop');
    await sleep(2000);
  }

  // 5. The second page in the engagement.
  const treatments = page.locator('text=Treatments').first();
  if (await treatments.count()) {
    await safeClick(page, treatments, 'treatments page');
    await sleep(3000);
  }

  // 6. Review Copy: the gate itself.
  await safeClick(page, page.locator('text=Review Copy').first(), 'review copy tab');
  await page.waitForLoadState('networkidle');
  await sleep(2600);

  // Open the panel on a few elements. Opening only reads: the panel shows the
  // decision already saved against that element. The reviewed count is
  // unchanged afterwards, which is how this was verified by hand.
  //
  // The reviewable elements live in the prototype iframe, not the top document.
  const frame = page.frames().find(f => /\/prototype\//.test(f.url()));
  if (frame) {
    const els = frame.locator('[data-stage-id]');
    const n = await els.count();
    for (const i of [1, 4, 7].filter(i => i < n)) {
      await els.nth(i).scrollIntoViewIfNeeded().catch(() => {});
      await sleep(500);
      await els.nth(i).click({ force: true }).catch(() => {});
      await sleep(3000);
    }
  }

  // 7. Image placement.
  await safeClick(page, page.locator('text=Choose Images').first(), 'choose images tab');
  await page.waitForLoadState('networkidle');
  await sleep(2800);
  for (let i = 0; i < 2; i++) {
    await page.mouse.wheel(0, 560);
    await sleep(1500);
  }
  await sleep(1200);

  await page.close();
  await ctx.close();
  await browser.close();
  console.log('recorded to', RAW);
})();
