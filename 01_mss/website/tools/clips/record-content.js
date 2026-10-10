/* Content clip: Studio's Carousel Builder building a Vera post (the fictional
   demo clinic, MSS's own Studio client). Builds one draft post, films it, then
   removes it and rebuilds the derived index, so nothing is left behind.

     node content-review-server.js --client vera --port 4503   (in ~/workspace/scripts)
     node record-content.js [base-url]
     -> raw-v6-content/*.webm, then out-v6/content{,-loop}.{mp4,webm,webp}

   Not filmed on purpose: Render. While it runs, Studio prints the render command
   with local file paths across the top, which does not belong in a public clip. */
const kit = require('./clip-kit');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const BASE = process.argv[2] || 'http://127.0.0.1:4503';
const POST = '2026-10-20-experience';
const POSTS = '/Users/osmanakhtar/workspace/main-stage-studio/01_mss/demo-clinic/vera/content/posts';

(async () => {
  if (fs.existsSync(path.join(POSTS, POST))) throw new Error(POST + ' already exists; remove it first');
  const s = await kit.open({ dir: 'raw-v6-content', tag: 'Demo · fictional clinic', size: { width: 1440, height: 810 },
    initScripts: [() => { try { localStorage.setItem('brandMode:vera', '0'); } catch (e) {} }] });
  const { page, run } = s;
  try {
    await run.go(BASE + '/', { settle: 900 });
    if (!(await page.locator('#car-post-select').isVisible())) {
      await run.click(page.getByRole('button', { name: /^Carousel Builder/ }), { settle: 900 });
    }
    await run.note('Content', 'Posts are built in Studio, from the clinic\'s own photo library.');

    await run.click('#car-new-post-btn', { settle: 500 });
    await page.fill('#car-new-date', POST.slice(0, 10));
    await page.selectOption('#car-new-pillar', 'experience');
    await run.click('#car-new-form button[type=submit]', { settle: 1200 });

    const cards = page.locator('#car-lib-list .lib-card');
    await run.note('Slides', 'Drag photos into slides. Each one snaps into the clinic\'s own templates.', { hold: 2600 });
    await run.drag(cards.nth(0), page.locator('#car-strip .car-frame, #car-add-tile').first());
    await run.drag(cards.nth(2), '#car-add-tile');
    await run.drag(cards.nth(4), '#car-add-tile');

    await run.click(page.locator('#car-strip .car-frame').first(), { settle: 700 });
    await run.type(page.locator('#car-inspector .ins-zone').first(), 'What happens at your first visit', { per: 45 });
    await run.note('Words', 'Add the words for each slide. The template keeps them within the brand.');

    await run.click('#car-save-btn', { settle: 1400 });
    await run.note('Draft', 'Saved as a draft, ready for the clinic to review before anything is posted.');
  } finally {
    const webm = await kit.close(s);
    // leave nothing behind: remove the filmed post and rebuild the derived index
    fs.rmSync(path.join(POSTS, POST), { recursive: true, force: true });
    execFileSync('node', ['/Users/osmanakhtar/workspace/scripts/content-generate.js', '--client', 'vera', '--reindex']);
    if (webm) {
      console.log('raw:', webm);
      console.log(kit.encode(webm, path.join(__dirname, 'out-v6', 'content'), { trimStart: 0.4, loopFrom: 12, loopFor: 8 }).join('\n'));
    }
  }
})().catch(e => { console.error(e); process.exit(1); });
