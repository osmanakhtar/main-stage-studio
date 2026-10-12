// Screenshots for the Work page cards: the three live demo journeys, puremed.uk, and Ayesha's
// v3 "Love" room. Called by make-stills.sh with a temp dir; writes PNGs there for cwebp.
//   node work-shots.js <out-dir>
const path = require('path');
const { chromium } = require(require.resolve('playwright', { paths: [path.join(process.env.HOME, 'workspace/scripts')] }));
const AY = 'file://' + path.resolve(__dirname, '../../../02_clients/ayesha/web/ayesha-johar-v3a-room-love.html');
const J = 'https://mainstagestudio.co.uk/work/booking-engine/prototype/?tenant=';
const SHOTS = [['work-thackray', J + 'thackray'], ['work-marbury', J + 'marbury'], ['work-vera', J + 'vera'],
  ['work-puremed', 'https://puremed.uk/'], ['work-ayesha', AY]];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  for (const [name, url] of SHOTS) {
    await p.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await p.waitForTimeout(1200);
    await p.screenshot({ path: path.join(process.argv[2], name + '.png') });
  }
  await b.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
