// Step 1 of 2 for recording Stage.
//
//   node stage-auth.js
//
// Opens a headed browser at the Stage login and waits for a human to sign in.
// Nothing is recorded here, so the password never lands in a video file. Once
// the reviews list appears it writes the session to stage-state.json, which
// stage-record.js then loads to record without ever seeing a credential.
//
// Delete stage-state.json when you are done. It is a live session token.
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const path = require('path');

const STATE = path.join(__dirname, 'stage-state.json');

(async () => {
  const browser = await chromium.launch({ headless: false, args: ['--window-size=1400,940'] });
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 860 } });
  const page = await ctx.newPage();

  await page.goto('https://mss-review.duckdns.org/', { waitUntil: 'domcontentloaded' });
  console.log('Sign in as Nafisa in the browser window that just opened.');
  console.log('Waiting for the reviews list...');

  // Wait for any post-login screen. An earlier version waited specifically for
  // **/reviews and sat there forever when the login landed somewhere else.
  // Poll for a session cookie instead, which is the thing we actually need.
  for (;;) {
    const cookies = await ctx.cookies();
    const url = page.url();
    if (cookies.length && !/\/login/.test(url)) break;
    await page.waitForTimeout(1000);
  }
  await page.waitForTimeout(1500);

  await ctx.storageState({ path: STATE });
  console.log('Session saved to', STATE);

  await ctx.close();
  await browser.close();
})();
