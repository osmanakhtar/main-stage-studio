// node film-copy.js <state.json>
// Off camera, filming database only (studio_film_sandbox): give the Vera series real copy.
const { chromium } = require('/Users/osmanakhtar/workspace/scripts/node_modules/playwright');
const FOOT = "You're getting this because you asked for the guide at vera-aesthetics.example. Unsubscribe: {{unsubscribe_url}}";
const BODY = {
  "01-guide": `Hi {{first_name|there}},

Here's your guide, as promised.

Read your guide: {{guide_url}}

Over the next week I'll send a few short notes: why faces start to look tired, why more filler isn't always the answer, and what our £25 Fresh-Face Assessment involves. No pressure, and you can stop them any time.

{{sender_name}}

${FOOT}`,
  "02-why-tired": `Hi {{first_name|there}},

When someone tells us they look tired, it's rarely one thing.

Usually it's a mix: a little volume lost in the cheeks, hollows under the eyes, skin that has lost some of its bounce, or pigment that makes the face look uneven. Sleep and stress play their part too.

So the useful question isn't "what can I have done?" It's "which of these is actually happening to me?"

That's what the Fresh-Face Assessment is for. It costs £25, and you leave knowing what's behind the change and what, if anything, would help.

See what the Fresh-Face Assessment includes: https://vera-aesthetics.example/fresh-face-assessment/

{{sender_name}}

${FOOT}`,
};
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ storageState: process.argv[2] }); const p = await ctx.newPage();
  for (const id of ["01-guide","02-why-tired","03-not-more-filler","04-assessment","05-reassurance","06-final-reminder"]) {
    await p.goto("http://localhost:3451/console/vera/emails/" + id); await p.waitForLoadState("networkidle");
    const subj = (await p.inputValue("input[name=subject]")).replace(/^\[DRAFT\]\s*/, "");
    await p.fill("input[name=subject]", subj);
    if (BODY[id]) await p.fill("textarea[name=body]", BODY[id]);
    await Promise.all([p.waitForLoadState("networkidle"), p.locator('button[name=action][value=approve]').click()]);
    const msg = await p.locator("main").innerText();
    console.log(id, "|", subj, "|", (msg.match(/Approved[^\n]*/) || ["?"])[0].slice(0, 80));
  }
  await b.close(); })();
