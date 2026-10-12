/* Content cue film, step 2 of 2: the score for frames-content (capture-content.js).

     node render-content.js              -> ../out-v6/content-cue.{mp4,webm,webp}
     node render-content.js --still 6.2  -> ../out-v6/content-cue-test.jpg

   Brief, plan, the real drafting run (the clock shows the real elapsed time of each captured
   frame), review one post and its compliance check, export, back to the board, then the card.
   Beats in brand-video-concepts.md §6 (Content). */
const path = require('path');
const fs = require('fs');
const { render } = require('./engine');

const SRC = path.join(__dirname, 'frames-content');
const tl = JSON.parse(fs.readFileSync(path.join(SRC, 'timeline.json'), 'utf8'));
const F = tl.frames;
const at = l => { const i = F.findIndex(f => f.label === l); if (i < 0) throw new Error('no frame ' + l); return i; };
const R = l => F[at(l)].rects;
const C = r => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

const briefs = F.map((f, i) => [f, i]).filter(([f]) => f.label.startsWith('brief-'));
const boards = F.map((f, i) => [f, i]).filter(([f]) => f.label === 'board');
const drafted = F[at('board-done')], draftSecs = boards[boards.length - 1][0].elapsed;
const picked = F[at('post')].picked;
const rows = drafted.rects.rows, row = rows[picked];
const thumbOf = r => ({ x: r.x + 52, y: r.y + r.h / 2 });
const post = R('post'), strip = post.stripItems, chk = R('check'), menu = R('clip-menu');
const pills = R('board-exported').pills;
const TOAST = { x: 720, y: 860 };                     // the app's toast sits bottom centre (fixed, so not measured)
const slides = F.map((f, i) => [f, i]).filter(([f]) => /^slide-\d$/.test(f.label));

// beats (seconds)
const T = { up: [0.3, 1.0], type: [0.9, 2.6], plan: 2.9, create: 4.0, draft: [4.3, 7.0], done: 7.0, open: 7.8,
  slides: 8.2, check: 9.6, export: 10.3, out: 14.6, card: [15.0, 16.4], dur: 16.9 };
const slideStep = (T.check - .35 - T.slides) / slides.length;

function frame(t) {
  if (t < T.type[0]) return briefs[0][1];
  if (t < T.plan) { const k = Math.min(1, (t - T.type[0]) / (T.type[1] - T.type[0])); return briefs[Math.round(k * (briefs.length - 1))][1]; }
  if (t < T.draft[0]) return at('plan');
  if (t < T.done) { const e = (t - T.draft[0]) / (T.draft[1] - T.draft[0]) * draftSecs; let i = boards[0][1]; for (const [f, j] of boards) if (f.elapsed <= e) i = j; return i; }
  if (t < T.open) return at('board-done');
  if (t < T.slides) return at('post');
  if (t < T.check) { const k = Math.floor((t - T.slides) / slideStep); return k < slides.length ? slides[k][1] : at('post'); }
  if (t < T.export + .15) return at('check');
  if (t < T.export + 1.0) return at('exported-slides');
  if (t < T.export + 1.35) return at('check');
  if (t < T.export + 1.7) return at('clip-menu');
  if (t < T.export + 2.2) return at('clip-busy');
  if (t < T.export + 2.8) return at('exported-clip');
  return at('board-exported');
}

const brief = R('brief-0').brief, plan = R('plan');
const dp = drafted.rects.pills, readyBox = { x: dp[0].x, y: dp[0].y, w: dp[0].w, h: dp[4].y + dp[4].h - dp[0].y };
const rowsBox = { x: rows[0].x, y: rows[0].y, w: rows[0].w, h: rows[4].y + rows[4].h - rows[0].y };
const score = {
  src: SRC, page: { w: tl.w, h: tl.h }, dur: T.dur, poster: T.done + .5, frame,
  lights: [[0, 0], [T.up[0], 0], [T.up[1], 1], [T.out - .5, 1], [T.out, 0]],
  camera: [
    [0, { x: brief.x - 30 + 280, y: brief.y + 40, w: 560 }], [T.type[0], { x: brief.x - 30 + 280, y: brief.y + 40, w: 560 }], [T.type[1], { x: brief.x - 30 + 400, y: brief.y + 50, w: 800 }], [T.plan - .01, { x: brief.x - 30 + 410, y: brief.y + 50, w: 820 }],
    [T.plan, { x: 840, y: 640, w: 1260 }], [T.draft[0] - .01, { x: 840, y: 650, w: 1200 }],
    [T.draft[0], { x: 850, y: 600, w: 1240 }], [T.open - .01, { x: 850, y: 640, w: 1120 }],
    [T.open, { x: 700, y: 470, w: 1300 }], [T.check - .5, { x: 700, y: 470, w: 1240 }], [T.check, { x: 850, y: 470, w: 1240 }],
    [T.export - .01, { x: 860, y: 470, w: 1240 }], [T.export, { x: 720, y: 450, w: 1440 }],
    [T.export + 2.8, { x: 720, y: 450, w: 1440 }], [T.export + 2.81, { x: 850, y: 640, w: 1180 }], [T.dur, { x: 850, y: 640, w: 1150 }],
  ],
  spot: [
    [0, { x: brief.x + 200, y: brief.y + 30, rx: 1350, ry: 600 }], [T.type[1], { x: brief.x + 330, y: brief.y + 30, rx: 1350, ry: 600 }], [T.plan - .01, { x: brief.x + 330, y: brief.y + 30, rx: 1350, ry: 600 }],
    [T.plan, { x: 846, y: 680, rx: 1250, ry: 650 }], [T.draft[0] - .01, { x: 846, y: 680, rx: 1250, ry: 650 }],
    [T.draft[0], { ...C(rowsBox), rx: 1300, ry: 720 }], [T.open - .01, { ...C(rowsBox), rx: 1300, ry: 720 }],
    [T.open, { ...C(post.slide), rx: 1100, ry: 700 }], [T.check - .4, { ...C(post.slide), rx: 1100, ry: 700 }], [T.check, { x: (post.slide.x + chk.checkBody.x + chk.checkBody.w) / 2, y: 470, rx: 1300, ry: 700 }],
    [T.export - .01, { x: 900, y: 470, rx: 1300, ry: 700 }], [T.export, { ...C(post.exportPng), rx: 760, ry: 380 }],
    [T.export + .5, { x: 720, y: 600, rx: 1200, ry: 700 }], [T.export + 1.2, { x: 720, y: 600, rx: 1200, ry: 700 }],
    [T.export + 1.4, { ...C(post.exportClip), rx: 760, ry: 380 }], [T.export + 2.2, { x: 720, y: 600, rx: 1200, ry: 700 }],
    [T.export + 2.8, { x: 720, y: 600, rx: 1200, ry: 700 }], [T.export + 2.81, { ...C(pills[picked]), rx: 900, ry: 420 }],
  ],
  cursor: [
    [0, null], [T.plan + .2, null], [T.plan + .21, { x: plan.createDraft.x + 520, y: plan.createDraft.y + 260 }],
    [T.create, C(plan.createDraft)], [T.draft[0] - .01, C(plan.createDraft)], [T.draft[0], null],
    [T.done + .3, null], [T.done + .31, { x: thumbOf(row).x + 420, y: thumbOf(row).y + 240 }], [T.open - .15, thumbOf(row)], [T.open, thumbOf(row)],
    [T.open + .01, { x: C(strip[0]).x + 60, y: C(strip[0]).y + 140 }],
    ...slides.flatMap(([, ], k) => [[T.slides + k * slideStep - .2, C(strip[k + 1])], [T.slides + (k + 1) * slideStep - .2, C(strip[k + 1])]]),
    [T.check - .1, C(chk.checkTab)], [T.export - .4, C(chk.checkTab)],
    [T.export - .05, C(post.exportPng)], [T.export + 1.05, C(post.exportPng)], [T.export + 1.3, C(post.exportClip)],
    [T.export + 1.5, C(menu.clipMenu)], [T.export + 1.65, { x: menu.clipMenu.x + 100, y: menu.clipMenu.y + 22 }],
    [T.export + 2.5, { x: menu.clipMenu.x + 260, y: menu.clipMenu.y + 260 }], [T.export + 2.8, null],
  ],
  rings: [
    [T.create, C(plan.createDraft)], [T.open - .1, thumbOf(row)],
    ...slides.map(([, ], k) => [T.slides + k * slideStep - .15, C(strip[k + 1])]),
    [T.check - .1, C(chk.checkTab)], [T.export, C(post.exportPng)], [T.export + 1.33, C(post.exportClip)],
    [T.export + 1.68, { x: menu.clipMenu.x + 100, y: menu.clipMenu.y + 22 }],
  ],
  corners: [
    { from: T.done + .05, to: T.done + .7, rect: readyBox },
    { from: T.export + 3.1, to: T.out, rect: pills[picked] },
  ],
  labels: [
    [T.up[0] + .3, T.plan, '01 BRIEF'],
    [T.plan, T.draft[0], '02 PLAN · NO AI YET'],
    [T.draft[0], T.done, t => { const e = Math.min(draftSecs, (t - T.draft[0]) / (T.draft[1] - T.draft[0]) * draftSecs); return `03 DRAFTING · ${e.toFixed(1)}s REAL TIME`; }],
    [T.done, T.open, `03 FIVE POSTS · ${draftSecs.toFixed(1)}s`],
    [T.open, T.export, '04 SHE REVIEWS'],
    [T.export, T.export + 2.8, '05 EXPORT'],
    [T.export + 2.8, T.out - .4, '06 READY TO POST'],
  ],
  card: { from: T.card[0], to: T.card[1], label: `AUTUMN LASER SEASON · 5 POSTS · ${draftSecs.toFixed(1)} SECONDS`, word: 'A week, drafted.' },
};

const si = process.argv.indexOf('--still');
render(score, path.join(__dirname, '..', 'out-v6', 'content-cue'), { still: si > -1 ? Number(process.argv[si + 1]) : null, crf: [27, 41] })
  .then(r => console.log(r.join('\n'))).catch(e => { console.error(e); process.exit(1); });
