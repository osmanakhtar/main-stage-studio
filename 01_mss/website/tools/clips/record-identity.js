/* Identity clip: a scroll through MSS's own brand book (01_mss/brand/mss-brand-book.html,
   built from specimen A by build-brand-book.py). The honest demo for the Identity product
   until a client identity is signed off and can be shown.
     node record-identity.js  -> raw-v6-identity/*.webm, then out-v6/identity{,-loop}.* */
const kit = require('./clip-kit');
const path = require('path');
const BOOK = 'file://' + path.resolve(__dirname, '../../../brand/mss-brand-book.html');
(async () => {
  const s = await kit.open({ dir: 'raw-v6-identity', tag: 'MSS’s own identity', size: { width: 1440, height: 810 },
    initScripts: [() => { try { matchMedia('(prefers-reduced-motion: reduce)'); } catch (e) {} }] });
  const { page, run } = s;
  const to = async (sel, settle = 900) => { await page.locator(sel).first().evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'start' })); await page.waitForTimeout(settle); };
  await run.go(BOOK, { settle: 1400 });
  await run.note('Identity', 'Who you are, said once and properly: the mark, the colour, the type and the voice, in one book.');
  await to('[data-stage-section="mark"]');
  await run.note('The mark', 'A mark with a reason behind it, shown on every surface it will live on.');
  await to('[data-stage-section="colour"]', 1400);
  await page.locator('#ratios').evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' })); await page.waitForTimeout(1100);
  await run.note('Colour', 'A palette with rules, including the contrast each pairing passes or fails.');
  await to('[data-stage-section="type"]');
  await run.note('Type', 'Type set at every size it will be used, from headline to price.');
  await to('[data-stage-section="voice"]');
  await run.note('Voice', 'And the words: the lines the brand says, ready to use.');
  const webm = await kit.close(s);
  console.log(kit.encode(webm, path.join(__dirname, 'out-v6', 'identity'), { trimStart: 0.4, loopFrom: 6, loopFor: 8 }).join('\n'));
})().catch(e => { console.error(e); process.exit(1); });
