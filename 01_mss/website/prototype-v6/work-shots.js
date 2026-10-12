// Screenshots for the Work cards and case studies: the three live demo journeys, puremed.uk, and
// Ayesha's v3 site. Called by make-stills.sh with a temp dir; writes PNGs there for cwebp.
//   node work-shots.js <out-dir>
const path = require('path');
const { chromium } = require(require.resolve('playwright', { paths: [path.join(process.env.HOME, 'workspace/scripts')] }));
const AY = 'file://' + path.resolve(__dirname, '../../../02_clients/ayesha/web/ayesha-johar-v3a-room-love.html');
const J = 'https://mainstagestudio.co.uk/work/booking-engine/prototype/?tenant=';
const AYW = 'file://' + path.resolve(__dirname, '../../../02_clients/ayesha/web/');
// [name, url, scroll y]: a second, scrolled shot shows more of each journey
const SHOTS = [['work-thackray', J + 'thackray', 0], ['work-thackray-2', J + 'thackray', 760],
  ['work-marbury', J + 'marbury', 0], ['work-marbury-2', J + 'marbury', 700],
  ['work-vera', J + 'vera', 0], ['work-vera-2', J + 'vera', 620],
  ['work-puremed', 'https://puremed.uk/', 0], ['work-ayesha', AY, 0],
  ['work-ayesha-about', AYW + '/ayesha-johar-v3a-about.html', 0], ['work-ayesha-choose', AYW + '/ayesha-johar-v3-choose.html', 0]];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  for (const [name, url, y] of SHOTS) {
    await p.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    if (y) await p.evaluate((y) => window.scrollTo(0, y), y);
    await p.waitForTimeout(1200);
    await p.screenshot({ path: path.join(process.argv[2], name + '.png') });
  }
  await b.close();
})().catch((e) => { console.error(e.message); process.exit(1); });
