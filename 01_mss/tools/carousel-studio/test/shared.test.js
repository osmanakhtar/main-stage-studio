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

test('every template renders a full document with brand colours and escaped text', () => {
  for (const t of Slides.TEMPLATES) {
    const html = Slides.slideHtml({ template: t.id, numeral: '01', kicker: 'K', headline: 'A <b>bold</b> claim', body: 'Body' }, brand);
    assert.match(html, /^<!doctype html>/);
    assert.ok(html.includes(brand.palette.brand), `${t.id} uses the brand colour`);
    assert.ok(html.includes('A &lt;b&gt;bold&lt;/b&gt; claim'), `${t.id} escapes text`);
    assert.ok(!html.includes('<b>bold</b>'), `${t.id} never injects markup`);
  }
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
