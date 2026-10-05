// Unit tests for the parts with no Electron dependency. Run: npm test
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const Slides = require('../src/shared/slides');
const Lint = require('../src/shared/lint');
const Outline = require('../src/shared/outline');

const brandDir = path.join(__dirname, '..', 'brands', require('../package.json').studioBrand);
const brand = JSON.parse(fs.readFileSync(path.join(brandDir, 'brand.json'), 'utf8'));
const rules = JSON.parse(fs.readFileSync(path.join(brandDir, 'lint-rules.json'), 'utf8'));
const example = JSON.parse(fs.readFileSync(path.join(brandDir, 'example-campaign.json'), 'utf8'));

test('every style renders every slide type, with brand colours and escaped text', () => {
  assert.ok(Slides.STYLES.length >= 8);
  for (const st of Slides.STYLES) {
    for (const t of Slides.TEMPLATES) {
      const slide = { template: t.id, numeral: '01', kicker: 'K', headline: 'A <b>bold</b> claim', body: 'Body', items: [{ icon: 'face', title: 'Point <i>', text: 'Detail' }], note: 'Note', media: { ref: 'brand:library/x.webp', kind: 'image' }, media2: { ref: 'brand:library/y.webp', kind: 'image' } };
      const html = Slides.slideHtml(slide, brand, { style: st.id, index: 1, total: 5 });
      const where = `${st.id}/${t.id}`;
      assert.match(html, /^<!doctype html>/, where);
      assert.ok(html.includes(`--brand:${brand.palette.brand}`), `${where} takes the brand palette`);
      assert.ok(html.includes('A &lt;b&gt;bold&lt;/b&gt; claim'), `${where} escapes text`);
      assert.ok(!html.includes('<b>bold</b>'), `${where} never injects markup`);
      assert.ok(html.includes(`class="slide ${st.id} ${t.id}`), where);
    }
  }
});

test('styles take every colour from the palette (white aside)', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'shared', 'styles.js'), 'utf8');
  const hex = (src.match(/#[0-9a-fA-F]{3,8}\b/g) || []).filter((h) => h.toLowerCase() !== '#fff');
  assert.deepStrictEqual(hex, []);
});

test('an unknown style falls back to classic', () => {
  const html = Slides.slideHtml({ template: 'light', headline: 'H' }, brand, { style: 'nope' });
  assert.ok(html.includes('class="slide classic light'));
});

test('the seamless line meets at slide edges', () => {
  const pathAt = (index) => {
    const html = Slides.slideHtml({ template: 'light', headline: 'H' }, brand, { style: 'flow', index, total: 3 });
    const d = /<path d="([^"]+)"/.exec(html)[1];
    return d.split(/[ML]/).filter(Boolean).map((p) => p.split(' ').map(Number));
  };
  const a = pathAt(0).find(([x]) => x === 1080);
  const b = pathAt(1).find(([x]) => x === 0);
  assert.ok(a && b && Math.abs(a[1] - b[1]) < 0.11, 'y at the right edge of slide 1 equals y at the left edge of slide 2');
});

test('asset refs resolve only to the two studio hosts', () => {
  assert.strictEqual(Slides.assetUrl('brand:library/a b.webp'), 'studio://brand/library/a%20b.webp');
  assert.strictEqual(Slides.assetUrl('media:x.jpg'), 'studio://media/x.jpg');
  assert.strictEqual(Slides.assetUrl('file:///etc/passwd'), null);
});

test('video slides show the poster for export and the video in the live preview', () => {
  const s = { template: 'cover', headline: 'H', media: { ref: 'media:v.mp4', kind: 'video', poster: 'media:v.jpg' } };
  assert.ok(Slides.slideHtml(s, brand).includes('studio://media/v.jpg'));
  assert.ok(Slides.slideHtml(s, brand, { live: true }).includes('<video'));
  const overlay = Slides.slideHtml(s, brand, { transparentMedia: true });
  assert.ok(!overlay.includes('studio://media/v'), 'clip overlay leaves the footage out');
  assert.match(overlay, /background:transparent/);
});

test('the shipped example post passes compliance', () => {
  const issues = Lint.lintPost(rules, example.posts[0], Slides.slideText);
  assert.deepStrictEqual(issues.filter((i) => i.level === 'error'), []);
});

test('compliance blocks POM brand names, em dashes and guarantees, in slides and captions', () => {
  const post = {
    slides: [{ template: 'light', headline: 'Botox, explained' }, { template: 'light', headline: 'Results guaranteed' }],
    caption: { instagram: 'Fresh skin — fast', facebook: '' },
  };
  const errors = Lint.lintPost(rules, post, Slides.slideText).filter((i) => i.level === 'error');
  const where = errors.map((e) => `${e.where}:${e.match.toLowerCase()}`);
  assert.ok(where.includes('Slide 1:botox'));
  assert.ok(where.includes('Slide 2:guarante'));
  assert.ok(where.includes('Instagram caption:—'));
});

test('en dashes in ranges are allowed', () => {
  assert.deepStrictEqual(Lint.lintText(rules, 'Collagen builds over 3–6 months.').filter((i) => i.level === 'error'), []);
});

test('pasted content becomes cover, numbered cards and a closing slide', () => {
  const text = 'Laser Lift:\nLift without surgery\nHow it works.\n\nHow it works:\nA pinpoint entry\nAn ultrafine fibre.\n\nAn immediate lift\n\nNot sure?\nBook a consultation via the link in bio.';
  const slides = Outline.outlineToSlides(text, brand);
  assert.deepStrictEqual(slides.map((s) => s.template), ['cover', 'light', 'light', 'cta']);
  assert.strictEqual(slides[0].kicker, 'Laser Lift');
  assert.strictEqual(slides[0].headline, 'Lift without surgery');
  assert.strictEqual(slides[1].numeral, '01');
  assert.strictEqual(slides[2].numeral, '02');
  assert.strictEqual(slides[3].headline, 'Not sure?');
});

test('a closing slide is added when the content does not end with one', () => {
  const slides = Outline.outlineToSlides('First\n\nSecond point', brand);
  assert.strictEqual(slides[slides.length - 1].template, 'cta');
  assert.strictEqual(slides[slides.length - 1].headline, brand.defaultCta.headline);
});

test('three-photo slides show every photo, with a placeholder for a missing one', () => {
  for (const st of Slides.STYLES) {
    const html = Slides.slideHtml({ template: 'photos', headline: 'H', media: { ref: 'brand:library/a.webp', kind: 'image' }, media3: { ref: 'brand:library/c.webp', kind: 'image' } }, brand, { style: st.id });
    assert.ok(html.includes('library/a.webp') && html.includes('library/c.webp'), st.id);
    assert.ok(html.includes('background:var(--bg2)'), `${st.id} fills the empty slot`);
  }
});

test('*accent* and _italic_ markup render, and never reach the compliance text', () => {
  assert.strictEqual(Slides.rich("I *wouldn't* use _filler_ here"), 'I <em class="em">wouldn&#39;t</em> use <i class="ital">filler</i> here'.replace('&#39;', "'"));
  assert.strictEqual(Slides.slideText({ headline: "_Good aesthetics_ *adding more.*", items: [{ title: 'A *fresher* look' }] }), 'Good aesthetics adding more.\nA fresher look');
  assert.ok(!Slides.rich('<b>x</b> *y*').includes('<b>'));
});

test('list and row points are linted, so a banned word in a point blocks export', () => {
  const post = { slides: [{ template: 'list', headline: 'H', items: [{ icon: 'check', title: 'Results guaranteed' }] }], caption: {} };
  const errors = Lint.lintPost(rules, post, Slides.slideText).filter((i) => i.level === 'error');
  assert.strictEqual(errors.length, 1);
});

test('Signature is square and every other style is 4:5', () => {
  assert.deepStrictEqual(Slides.sizeOf('signature'), { w: 1080, h: 1080 });
  assert.deepStrictEqual(Slides.sizeOf('classic'), { w: 1080, h: 1350 });
  assert.match(Slides.slideHtml({ template: 'cover', headline: 'H' }, brand, { style: 'signature' }), /width:1080px;height:1080px/);
});

test('every post template uses known slide types and icons, and passes compliance', () => {
  const dir = path.join(brandDir, 'recipes');
  for (const f of fs.readdirSync(dir)) {
    const r = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    for (const sl of r.slides) {
      assert.ok(Slides.TEMPLATES.some((t) => t.id === sl.template), `${f}: ${sl.template}`);
      for (const it of sl.items || []) assert.ok(Slides.ICONS[it.icon], `${f}: icon ${it.icon}`);
    }
    const errors = Lint.lintPost(rules, r, Slides.slideText).filter((i) => i.level === 'error');
    assert.deepStrictEqual(errors, [], f);
  }
});

test('every icon draws, and every old icon name still resolves to a real icon', () => {
  const Icons = require('../src/shared/icons');
  assert.ok(Icons.names.length >= 40);
  for (const n of Icons.names) {
    const svg = Icons.icon(n, 64);
    assert.match(svg, /^<svg class="ico"/, n);
    assert.ok(!/NaN|undefined/.test(svg), n);
    assert.ok(Icons.ICONS[n].label && Icons.ICONS[n].group, n);
  }
  for (const [alias, target] of Object.entries(Icons.ALIASES)) assert.ok(Icons.ICONS[target], `${alias} -> ${target}`);
});
