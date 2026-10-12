/* Platform cue film, step 2 of 2: the score for frames-platform (capture-platform.js).

     node render-platform.js              -> ../out-v6/platform-cue.{mp4,webm,webp}
     node render-platform.js --still 8.4  -> ../out-v6/platform-cue-test.jpg

   Four places a clinic's clients live, the DPIA signed first, the import's own report, one record
   (an old note opened, and the opening logged), then a batch recall across the old notes. */
const path = require('path');
const fs = require('fs');
const { render } = require('./engine');

const SRC = path.join(__dirname, 'frames-platform');
const tl = JSON.parse(fs.readFileSync(path.join(SRC, 'timeline.json'), 'utf8'));
const F = tl.frames;
const at = l => { const i = F.findIndex(f => f.label === l); if (i < 0) throw new Error('no frame ' + l); return i; };
const all = re => F.map((f, i) => [f, i]).filter(([f]) => re.test(f.label));
const C = r => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

const src = all(/^sources-\d$/), term = all(/^term-\d+$/), typing = all(/^recall-type$/);
const dp = F[at('dp')], daisy = F[at('daisy')], note = F[at('daisy-note')], recall = F[at('recall')];
const visitAt = { x: daisy.visit.x + 96, y: daisy.visit.y + daisy.visit.h / 2 };
const topLines = { x: note.brought.x, y: note.brought.y - 44, w: note.brought.w, h: note.brought.h + 44 };   // "notes opened" sits above "Brought in"
const people = new Set(recall.people.map(p => p.trim())).size;

const T = { up: [0.3, 1.0], src: 0.55, srcStep: 0.5, dp: 3.0, term: 4.4, termEnd: 6.3, daisy: 6.9, click: 7.9, glide: 9.3, recall: 10.5,
  type: [10.9, 11.6], search: 11.9, out: 14.0, card: [14.4, 16.0], dur: 16.5 };

function frame(t) {
  if (t < T.dp) { const k = Math.max(0, Math.min(src.length - 1, Math.floor((t - T.src) / T.srcStep) + 1)); return t < T.src ? src[0][1] : src[k][1]; }
  if (t < T.term) return at('dp');
  if (t < T.daisy) { const k = Math.min(term.length - 1, Math.floor((t - T.term) / ((T.termEnd - T.term) / term.length))); return term[Math.max(0, k)][1]; }
  if (t < T.click + .08) return at('daisy');
  if (t < T.recall) return at('daisy-note');
  if (t < T.type[0]) return at('recall-empty');
  if (t < T.search + .08) { const k = Math.min(typing.length - 1, Math.floor((t - T.type[0]) / ((T.type[1] - T.type[0]) / typing.length))); return typing[Math.max(0, k)][1]; }
  return at('recall');
}

const score = {
  src: SRC, page: { w: tl.w, h: tl.h }, dur: T.dur, poster: T.search + .9, frame,
  lights: [[0, 0], [T.up[0], 0], [T.up[1], 1], [T.out - .5, 1], [T.out, 0]],
  camera: [
    [0, { x: 720, y: 800, w: 1380 }], [T.dp - .01, { x: 720, y: 790, w: 1300 }],
    [T.dp, { x: 720, y: 520, w: 1060 }], [T.term - .01, { x: 720, y: 500, w: 1000 }],
    [T.term, { x: 720, y: 640, w: 1260 }], [T.daisy - .01, { x: 720, y: 640, w: 1200 }],
    [T.daisy, { x: 720, y: 1330, w: 1240 }], [T.glide, { x: 720, y: 1390, w: 1180 }], [T.recall - .01, { x: 720, y: 1640, w: 1180 }],
    [T.recall, { x: 720, y: 420, w: 1240 }], [T.dur, { x: 720, y: 460, w: 1160 }],
  ],
  spot: [
    [0, { x: 720, y: 790, rx: 1500, ry: 820 }], [T.dp - .01, { x: 720, y: 790, rx: 1500, ry: 820 }],
    [T.dp, { ...C(dp.approved), rx: 1100, ry: 460 }], [T.dp + .6, { ...C(dp.approved), rx: 1100, ry: 460 }], [T.term - .1, { x: 600, y: (dp.approved.y + dp.accepted.y) / 2 + 10, rx: 1100, ry: 700 }],
    [T.term, { x: 720, y: 640, rx: 1500, ry: 760 }], [T.daisy - .01, { x: 720, y: 640, rx: 1500, ry: 760 }],
    [T.daisy, { ...C(daisy.before), rx: 1350, ry: 560 }], [T.click, { ...C(daisy.visit), rx: 1250, ry: 420 }], [T.glide - .2, { ...C(note.opened), rx: 1300, ry: 440 }],
    [T.glide + .5, { ...C(topLines), rx: 1300, ry: 440 }], [T.recall - .01, { ...C(topLines), rx: 1300, ry: 440 }],
    [T.recall, { ...C(recall.input), rx: 1200, ry: 420 }], [T.search, { ...C(recall.input), rx: 1200, ry: 420 }], [T.search + .4, { ...C(recall.table), rx: 1400, ry: 560 }],
  ],
  cursor: [
    [0, null], [T.daisy + .2, null], [T.daisy + .21, { x: visitAt.x + 420, y: visitAt.y - 240 }], [T.click, visitAt], [T.click + .6, visitAt],
    [T.glide, { x: visitAt.x + 520, y: visitAt.y + 300 }], [T.glide + .01, null],
    [T.type[1] - .2, null], [T.type[1] - .19, { x: C(recall.button).x - 260, y: C(recall.button).y + 220 }], [T.search, C(recall.button)], [T.search + .7, C(recall.button)],
    [T.search + 1.3, { x: C(recall.button).x + 200, y: C(recall.button).y + 420 }], [T.search + 1.31, null],
  ],
  rings: [[T.click, visitAt], [T.search, C(recall.button)]],
  corners: [{ from: T.search + .55, to: T.out - .3, rect: recall.table }],
  labels: [
    [T.up[0] + .3, T.dp, '01 FOUR PLACES HER CLIENTS LIVE TODAY'],
    [T.dp, T.term, "02 SIGNED FIRST · THE IMPORT WON'T RUN WITHOUT IT"],
    [T.term, T.daisy, '03 THE IMPORT · ITS OWN REPORT'],
    [T.daisy, T.glide, '04 ONE RECORD · THE OLD NOTES, READ-ONLY'],
    [T.glide, T.recall, '04 ONE RECORD · EVEN OPENING A NOTE IS LOGGED'],
    [T.recall, T.out - .3, `05 A BATCH RECALL · ${people} PATIENTS, ONE SEARCH`],
  ],
  note: { from: T.up[1], to: T.out - .3, text: 'VERA DEMO · FICTIONAL PATIENTS' },
  card: { from: T.card[0], to: T.card[1], label: `VERA DEMO · ${tl.counts.faces} PATIENTS · ${tl.counts.appts} APPOINTMENTS · DPIA SIGNED FIRST`, word: 'Four tools.\nOne record.' },
};

const si = process.argv.indexOf('--still');
render(score, path.join(__dirname, '..', 'out-v6', 'platform-cue'), { still: si > -1 ? Number(process.argv[si + 1]) : null, crf: [27, 41] })
  .then(r => console.log(r.join('\n'))).catch(e => { console.error(e); process.exit(1); });
