/* Content checks clip: the terminal replay page (pipeline-terminal.html), which types back
   verbatim output from real runs of the content tools, with its own captions. No overlay
   narration; the page sets window.__done when the replay ends.
     node record-pipeline.js  -> raw-v6-pipeline/*.webm, then out-v6/pipeline{,-loop}.* */
const kit = require('./clip-kit');
const path = require('path');
(async () => {
  const s = await kit.open({ dir: 'raw-v6-pipeline', size: { width: 1440, height: 810 } });
  await s.page.goto('file://' + path.join(__dirname, 'pipeline-terminal.html'));
  await s.page.waitForFunction(() => window.__done === true, null, { timeout: 120000 });
  await s.page.waitForTimeout(800);
  const webm = await kit.close(s);
  console.log(kit.encode(webm, path.join(__dirname, 'out-v6', 'pipeline'), { trimStart: 0.3, loopFrom: 16, loopFor: 8 }).join('\n'));
})().catch(e => { console.error(e); process.exit(1); });
