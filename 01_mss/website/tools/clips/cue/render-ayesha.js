/* Ayesha cue film, step 2 of 2: the score for frames-ayesha (capture-ayesha.js).

     node render-ayesha.js              -> ../out-v6/ayesha-cue.{mp4,webm,webp}
     node render-ayesha.js --still 7.2  -> ../out-v6/ayesha-cue-test.jpg

   Her paintings, the five bodies of work, her name, her line, colour sampled from a canvas, then the five
   directions on her private link, all given the same time (none favoured: she hasn't chosen). */
const path = require('path');
const fs = require('fs');
const { render } = require('./engine');

const SRC = path.join(__dirname, 'frames-ayesha');
const tl = JSON.parse(fs.readFileSync(path.join(SRC, 'timeline.json'), 'utf8'));
const F = tl.frames;
const idx = l => F.map((f, i) => [f, i]).filter(([f]) => typeof l === 'string' ? f.label === l : l.test(f.label)).map(([, i]) => i);
const one = l => { const i = idx(l); if (!i.length) throw new Error('no frame ' + l); return i[0]; };

const paintings = idx('painting'), bodies = idx(/^bodies-\d$/), colours = idx(/^colour-\d+$/), directions = idx('direction');
const T = { paint: 0.3, paintStep: 0.5, bodies: 3.3, name: 5.1, line: 6.7, colour: 7.9, choose: 9.9, dirs: 10.9, dirStep: 0.6 };
T.out = T.dirs + directions.length * T.dirStep + 0.4;
T.card = [T.out + .4, T.out + 2.0]; T.dur = T.out + 2.5;
const LINE = { x: 150, y: 300, w: 830, h: 212 };

const step = (list, from, dt, t) => list[Math.max(0, Math.min(list.length - 1, Math.floor((t - from) / dt)))];
function frame(t) {
  if (t < T.bodies) return step(paintings, T.paint, T.paintStep, t);
  if (t < T.name) return step(bodies, T.bodies + .2, .25, t);
  if (t < T.line) return one(t < T.name + .5 ? 'name-1' : 'name-2');
  if (t < T.colour) return one('line');
  if (t < T.choose) return step(colours, T.colour + .3, .25, t);
  if (t < T.dirs) return one('choose');
  return step(directions, T.dirs, T.dirStep, t);
}
const cuts = [T.paint, ...paintings.map((_, i) => T.paint + i * T.paintStep).slice(1), T.bodies, T.name, T.line, T.colour, T.choose, ...directions.map((_, i) => T.dirs + i * T.dirStep), T.dur];
const camera = [[0, { x: 720, y: 450, w: 1440 }], ...cuts.slice(0, -1).flatMap((s, i) => [[s, { x: 720, y: 450, w: 1440 }], [cuts[i + 1] - .01, { x: 720, y: 450, w: 1385 }]])];
const wide = { x: 720, y: 450, rx: 1900, ry: 1150 };

const score = {
  src: SRC, page: { w: tl.w, h: tl.h }, dur: T.dur, poster: T.line + .9, frame,
  lights: [[0, 0], [.2, 0], [.9, 1], [T.out - .5, 1], [T.out, 0]],
  camera,
  spot: [[0, wide]],
  cursor: [[0, null]],
  rings: [],
  corners: [{ from: T.line + .45, to: T.colour - .25, rect: LINE }],
  labels: [
    [T.paint + .3, T.bodies, '01 HER PAINTINGS'],
    [T.bodies, T.name, '02 FIVE BODIES OF WORK, FOUND IN THEM'],
    [T.name, T.line, '03 HER NAME'],
    [T.line, T.colour, '04 HER LINE'],
    [T.colour, T.choose - .1, '05 COLOUR, SAMPLED FROM THE CANVAS'],
  ],
  // her chooser names itself, and her pages have their own headers: no film captions over them
  note: { from: .9, to: T.choose - .1, text: 'IN PROGRESS · ART BY AYESHA JOHAR' },
  card: { from: T.card[0], to: T.card[1], label: 'ART BY AYESHA JOHAR · FIVE DIRECTIONS, IN REVIEW', word: 'Built from\nher own work.' },
};

const si = process.argv.indexOf('--still');
render(score, path.join(__dirname, '..', 'out-v6', 'ayesha-cue'), { still: si > -1 ? Number(process.argv[si + 1]) : null, crf: [27, 41] })
  .then(r => console.log(r.join('\n'))).catch(e => { console.error(e); process.exit(1); });
