/* Campaign cue film, step 2 of 2: the score for frames-campaign (capture-campaign.js).

     node render-campaign.js              -> ../out-v6/campaign-cue.{mp4,webm,webp}
     node render-campaign.js --still 9.8  -> ../out-v6/campaign-cue-test.jpg

   One sign-up, the guide, the follow-ups landing in her record, the owner marks a booking,
   the series stops itself. The day labels are the days the series schedules each email
   (why-do-i-look-tired: 0, 1, 3, 5, then 7 and 9 that never go). On film the days are
   compressed (30s each) and the caption says so. */
const path = require('path');
const fs = require('fs');
const { render } = require('./engine');

const SRC = path.join(__dirname, 'frames-campaign');
const tl = JSON.parse(fs.readFileSync(path.join(SRC, 'timeline.json'), 'utf8'));
const F = tl.frames;
const idxs = l => F.map((f, i) => [f, i]).filter(([f]) => f.label === l);
const at = l => { const i = F.findIndex(f => f.label === l); if (i < 0) throw new Error('no frame ' + l); return i; };
const C = r => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

const typing = F.map((f, i) => [f, i]).filter(([f]) => ['name', 'email'].includes(f.label) && !f.box);   // 'email' is also the field being typed
const MAILF = F.findIndex(f => f.label === 'email' && f.box);              // the guide email itself
const form = F[at('ready')].form, submit = F[at('ready')].submit;
const records = idxs('record');
const bySent = n => { const r = records.find(([f]) => f.sent === n); if (!r) throw new Error('no record with ' + n + ' sent'); return r; };
const s1 = records.filter(([f]) => f.sent === 1).pop(), s2 = bySent(2), s3 = bySent(3), s4 = bySent(4);
const fin = F[at('final')], stopLine = fin.events.find(e => /Series stopped/.test(e.text));
const noteF = F[at('note')], bookedF = F[at('booked')];
const button = { x: noteF.booked.x + 62, y: noteF.booked.y + noteF.booked.h - 26 };
const consent = { x: form.x + 24, y: form.y + 258 }, age = { x: form.x + 24, y: form.y + 315 };
const MAIL = { x: 717, y: 272, w: 580 };              // the message itself, below the logo band
const line = f => f.events[0];                       // What happened is newest first

const T = { up: [0.3, 1.0], type: [0.9, 2.5], consent: 2.75, age: 3.05, submit: 3.45, thanks: 3.55, mail: 4.2,
  rec: 5.8, d1: 6.6, d3: 7.5, d5: 8.4, note: 9.4, book: 10.5, stop: 11.7, out: 13.9, card: [14.3, 15.9], dur: 16.4 };

function frame(t) {
  if (t < T.type[0]) return at('site');
  if (t < T.consent) { const k = Math.min(1, (t - T.type[0]) / (T.type[1] - T.type[0])); return typing[Math.round(k * (typing.length - 1))][1]; }
  if (t < T.age) return at('consent');
  if (t < T.submit) return at('age');
  if (t < T.thanks) return at('ready');
  if (t < T.mail) return at('thanks');
  if (t < T.rec) return MAILF;
  if (t < T.d1) return s1[1];
  if (t < T.d3) return s2[1];
  if (t < T.d5) return s3[1];
  if (t < T.note) return s4[1];
  if (t < T.book + .08) return at('note');
  if (t < T.stop) return at('booked');
  return at('final');
}

const happenedCam = (f, w = 1080) => ({ x: line(f).x - 24 + w / 2, y: line(f).y + 200, w });
const score = {
  src: SRC, page: { w: tl.w, h: tl.h }, dur: T.dur, poster: T.stop + .8, frame,
  lights: [[0, 0], [T.up[0], 0], [T.up[1], 1], [T.out - .5, 1], [T.out, 0]],
  camera: [
    [0, { ...C(form), w: 960 }], [T.thanks - .01, { ...C(form), w: 880 }],
    [T.thanks, { x: 720, y: 330, w: 1300 }], [T.mail - .01, { x: 720, y: 330, w: 1260 }],
    [T.mail, MAIL], [T.rec - .01, { ...MAIL, y: MAIL.y + 6, w: 540 }],
    [T.rec, happenedCam(s1[0])], [T.note - .01, happenedCam(s4[0], 1000)],
    [T.note, { x: 640, y: 520, w: 1000 }], [T.book + .08, { x: 640, y: 540, w: 960 }], [T.book + .09, { x: 720, y: 430, w: 1320 }], [T.stop - .01, { x: 720, y: 430, w: 1260 }],
    [T.stop, happenedCam(fin, 1060)], [T.dur, happenedCam(fin, 980)],
  ],
  spot: [
    [0, { ...C(form), rx: 1000, ry: 700 }], [T.thanks - .01, { ...C(form), rx: 1000, ry: 700 }],
    [T.thanks, { x: 720, y: 230, rx: 1300, ry: 600 }], [T.mail - .01, { x: 720, y: 230, rx: 1300, ry: 600 }],
    [T.mail, { x: MAIL.x, y: MAIL.y, rx: 1300, ry: 700 }], [T.rec - .01, { x: MAIL.x, y: MAIL.y, rx: 1300, ry: 700 }],
    [T.rec, { ...C(line(s1[0])), rx: 1250, ry: 420 }], [T.d1, { ...C(line(s2[0])), rx: 1250, ry: 420 }],
    [T.d3, { ...C(line(s3[0])), rx: 1250, ry: 420 }], [T.d5, { ...C(line(s4[0])), rx: 1250, ry: 420 }], [T.note - .01, { ...C(line(s4[0])), rx: 1250, ry: 420 }],
    [T.note, { ...C(noteF.booked), rx: 900, ry: 520 }], [T.book, { ...C(noteF.booked), rx: 900, ry: 520 }],
    [T.book + .3, { x: 720, y: bookedF.flash.y + 60, rx: 1500, ry: 640 }], [T.stop - .01, { x: 720, y: bookedF.flash.y + 60, rx: 1500, ry: 640 }],
    [T.stop, { ...C(stopLine), rx: 1300, ry: 460 }],
  ],
  cursor: [
    [0, null], [T.type[1] - .2, null], [T.type[1] - .19, { x: consent.x + 300, y: consent.y + 220 }],
    [T.consent, consent], [T.age - .1, age], [T.age + .1, age], [T.submit - .05, C(submit)], [T.thanks + .2, C(submit)], [T.thanks + .21, null],
    [T.note + .3, null], [T.note + .31, { x: button.x + 380, y: button.y + 200 }], [T.book, button], [T.book + .6, button],
    [T.stop - .3, { x: button.x + 420, y: button.y + 260 }], [T.stop, null],
  ],
  rings: [[T.consent, consent], [T.age, age], [T.submit, C(submit)], [T.book, button]],
  corners: [{ from: T.stop + .45, to: T.out - .3, rect: { x: stopLine.x + 6, y: stopLine.y + 4, w: 440, h: stopLine.h - 8 } }],
  labels: [
    [T.up[0] + .3, T.thanks, 'DAY 0 · SHE ASKS FOR THE GUIDE'],
    [T.thanks, T.rec, 'DAY 0 · THE GUIDE, STRAIGHT AWAY'],
    [T.rec, T.d1, 'DAY 0 · IN HER RECORD'],
    [T.d1, T.d3, "DAY 1 · IT'S USUALLY NOT JUST ONE THING"],
    [T.d3, T.d5, "DAY 3 · WHY MORE FILLER ISN'T ALWAYS THE ANSWER"],
    [T.d5, T.note, 'DAY 5 · THE £25 FRESH-FACE ASSESSMENT'],
    [T.note, T.stop, 'SHE BOOKS BY PHONE · YOU MARK IT'],
    [T.stop, T.out - .3, 'DAY 7 AND DAY 9 · NEVER SENT'],
  ],
  note: { from: T.rec, to: T.out - .3, text: 'VERA DEMO · DAYS COMPRESSED FOR FILMING' },
  card: { from: T.card[0], to: T.card[1], label: 'ONE SIGN-UP · FOUR EMAILS · ONE BOOKING', word: 'Followed up. Then stopped.' },
};

const si = process.argv.indexOf('--still');
render(score, path.join(__dirname, '..', 'out-v6', 'campaign-cue'), { still: si > -1 ? Number(process.argv[si + 1]) : null, crf: [27, 41] })
  .then(r => console.log(r.join('\n'))).catch(e => { console.error(e); process.exit(1); });
