/* Identity cue film (Sable), step 2 of 2: the score for frames-identity (capture-identity.js).

     node render-identity.js              -> ../out-v6/identity-cue.{mp4,webm,webp}
     node render-identity.js --still 12.6 -> ../out-v6/identity-cue-test.jpg

   Spread by spread: the idea, the name, the colour, the type, the light, three seconds of her moving
   image, then every surface. Her spreads carry their own labels, so the film adds none of its own. */
const path = require('path');
const fs = require('fs');
const { render } = require('./engine');

const SRC = path.join(__dirname, 'frames-identity');
const tl = JSON.parse(fs.readFileSync(path.join(SRC, 'timeline.json'), 'utf8'));
const F = tl.frames;
const at = l => { const i = F.findIndex(f => f.label === l); if (i < 0) throw new Error('no frame ' + l); return i; };
const moves = F.map((f, i) => [f, i]).filter(([f]) => f.label === 'move').map(([, i]) => i);
const s2 = F[at('surfaces-2')];
const both = { x: s2.cover.x, y: s2.cover.y, w: s2.home.x + s2.home.w - s2.cover.x, h: s2.cover.h };

// [time, frame label] in order; the moving image runs at its own frame rate
const T = { idea: 0, name: 2.0, colour: 3.6, type: 5.6, light: 7.1, move: 8.4, surfaces: 8.4 + moves.length / tl.moveFps, out: 13.9, card: [14.3, 15.9], dur: 16.4 };
T.out = T.surfaces + 2.4;
T.card = [T.out + .4, T.out + 2.0]; T.dur = T.out + 2.5;
const CUES = [
  [T.idea, 'idea-1'], [T.name, 'name-0'], [T.name + .12, 'name-1'], [T.name + .9, 'name-2'],
  [T.colour, 'colour-1'], [T.colour + .22, 'colour-2'], [T.colour + .44, 'colour-3'], [T.colour + .66, 'colour-4'], [T.colour + .88, 'colour-5'], [T.colour + 1.2, 'colour-rule'],
  [T.type, 'type-1'], [T.type + .45, 'type-2'], [T.type + .9, 'type-3'], [T.light, 'light'],
  [T.surfaces, 'surfaces-1'], [T.surfaces + .5, 'surfaces-2'],
];
function frame(t) {
  if (t >= T.move && t < T.surfaces) return moves[Math.min(moves.length - 1, Math.floor((t - T.move) * tl.moveFps))];
  let l = CUES[0][1];
  for (const [ct, cl] of CUES) if (t >= ct) l = cl;
  return at(l);
}
// a slow push on each spread, reset on each cut
const starts = [T.idea, T.name, T.colour, T.type, T.light, T.move, T.surfaces, T.dur];
const camera = starts.slice(0, -1).flatMap((s, i) => [[s, { x: 720, y: 450, w: 1440 }], [starts[i + 1] - .01, { x: 720, y: 450, w: i === 5 ? 1400 : 1370 }]]);
const wide = { x: 720, y: 450, rx: 1900, ry: 1150 };

const score = {
  src: SRC, page: { w: tl.w, h: tl.h }, dur: T.dur, poster: T.surfaces + 1.2, frame,
  lights: [[0, 0], [.2, 0], [.9, 1], [T.out - .5, 1], [T.out, 0]],
  camera,
  spot: [[0, wide], [T.surfaces, wide], [T.surfaces + .6, { x: both.x + both.w / 2, y: both.y + both.h / 2, rx: 1500, ry: 900 }]],
  cursor: [[0, null]],
  rings: [],
  corners: [{ from: T.surfaces + 1.0, to: T.out - .3, rect: both }],
  labels: [],
  note: { from: .9, to: T.out - .3, text: 'SELF-INITIATED · SABLE' },
  card: { from: T.card[0], to: T.card[1], label: 'SABLE · THE IDEA, THE NAME, THE COLOUR, THE TYPE, THE LIGHT', word: 'Said once.\nProperly.' },
};

const si = process.argv.indexOf('--still');
render(score, path.join(__dirname, '..', 'out-v6', 'identity-cue'), { still: si > -1 ? Number(process.argv[si + 1]) : null, crf: [27, 41] })
  .then(r => console.log(r.join('\n'))).catch(e => { console.error(e); process.exit(1); });
