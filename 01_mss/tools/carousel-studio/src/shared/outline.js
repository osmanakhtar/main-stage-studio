// outline.js — turn pasted campaign content into slides, no AI needed.
//
// Write one block per slide, with a blank line between blocks:
//
//   How it works:            ← optional small heading (a short line ending in ":")
//   A pinpoint entry         ← headline
//   An ultrafine fibre is…   ← any further lines become the supporting text
//
// The first block becomes the cover, the middle blocks become numbered light
// cards, and the last block becomes the closing call to action when it reads
// like one (mentions booking, a consultation, the link in bio or a DM).
// If it doesn't, the brand's default closing slide is added.
(function (root) {
  'use strict';

  const CTA_RE = /\b(book|consultation|link in bio|dm|message us|get in touch|call us)\b/i;

  function parseBlocks(text) {
    return String(text || '')
      .replace(/\r\n/g, '\n')
      .split(/\n\s*\n/)
      .map((b) => b.split('\n').map((l) => l.trim()).filter(Boolean))
      .filter((lines) => lines.length);
  }

  function blockToFields(lines) {
    let kicker = '';
    if (lines.length > 1 && /:$/.test(lines[0]) && lines[0].length <= 40) {
      kicker = lines.shift().replace(/:$/, '');
    }
    const headline = lines.shift() || '';
    const body = lines.join(' ');
    return { kicker, headline, body };
  }

  function outlineToSlides(text, brand, opts) {
    opts = opts || {};
    const blocks = parseBlocks(text);
    const slides = [];
    let n = 0;
    blocks.forEach((lines, i) => {
      const f = blockToFields(lines.slice());
      const first = i === 0;
      const last = i === blocks.length - 1 && blocks.length > 1;
      if (first) {
        slides.push({ template: 'cover', ...f, media: opts.coverMedia || null });
      } else if (last && CTA_RE.test([f.headline, f.body].join(' '))) {
        slides.push({ template: 'cta', headline: f.headline, body: f.body });
      } else {
        n++;
        slides.push({ template: 'light', numeral: String(n).padStart(2, '0'), ...f });
      }
    });
    if (slides.length && slides[slides.length - 1].template !== 'cta' && brand.defaultCta) {
      slides.push({ template: 'cta', headline: brand.defaultCta.headline, body: brand.defaultCta.body });
    }
    return slides;
  }

  const api = { outlineToSlides, parseBlocks };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Outline = api;
})(typeof self !== 'undefined' ? self : this);
