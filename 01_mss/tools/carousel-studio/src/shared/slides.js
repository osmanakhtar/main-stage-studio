// slides.js — builds one HTML document per slide (1080×1350, or the size the
// style declares, e.g. 1080×1080 for Signature). The editor
// preview and the PNG/clip export both render this exact document, so what
// Nafisa sees is what ships.
//
// Two axes:
//   slide type (slide.template): what the slide is for. Cover, numbered
//     point, photo and text, statement, key fact, three photos, icon list,
//     icon row, quote, closing call to action. Fixed set, fixed fields, so
//     copy never depends on the look.
//   Text fields accept markup: *accent* sets words in the style's accent
//     italic (copper in Signature), _italic_ in plain italic, and a new line
//     starts a new line.
//   style (post.style): how the whole carousel looks. Each style in styles.js
//     draws every slide type in its own layout and typography, but every
//     colour and font comes from the brand pack. Switching style keeps all
//     the content.
//
// Asset references:
//   brand:<path>  → a file inside the brand pack (studio://brand/<path>)
//   media:<file>  → a file she imported (studio://media/<file>)
//
// Works in both the renderer (window.Slides) and the main process (require).
(function (root) {
  'use strict';

  const NODE = typeof module !== 'undefined' && module.exports;
  const STYLES = NODE ? require('./styles') : root.SlideStyles;
  const ICONS = NODE ? require('./icons') : root.SlideIcons;

  // Default canvas. A style may declare its own size (style.size = [w, h]).
  const W = 1080;
  const H = 1350;
  const sizeOf = (styleId) => {
    const st = STYLES.get(styleId || DEFAULT_STYLE);
    return { w: (st.size && st.size[0]) || W, h: (st.size && st.size[1]) || H };
  };

  const TEMPLATES = [
    { id: 'cover', label: 'Cover', media: true, fields: ['kicker', 'headline', 'body'], hint: 'The opening slide. A photo or video with the hook headline.' },
    { id: 'light', label: 'Numbered point', media: false, fields: ['numeral', 'kicker', 'headline', 'body'], hint: 'One point per slide, with an optional number.' },
    { id: 'split', label: 'Photo and text', media: true, fields: ['numeral', 'kicker', 'headline', 'body'], hint: 'A point with a photo beside or above it.' },
    { id: 'brand', label: 'Statement', media: 'optional', fields: ['kicker', 'headline', 'body'], hint: 'A key message or summary, in a contrasting colour. Some styles (Signature) show a photo beside it.' },
    { id: 'fact', label: 'Key fact', media: false, fields: ['numeral', 'headline', 'body'], labels: { numeral: 'The figure', headline: 'What it measures' }, hint: 'One figure that matters, shown large: a timeline, a session count, a recovery time. Only use figures the treatment page states.' },
    { id: 'photos', label: 'Three photos', media: 3, fields: ['kicker', 'headline'], hint: 'A grid of three photos with a short caption. Pick each photo with the Photo 1, 2 and 3 buttons.' },
    { id: 'list', label: 'Icon list', media: 'optional', fields: ['headline', 'body', 'items', 'note'], itemFields: ['icon', 'title', 'text'], maxItems: 6, labels: { body: 'Intro line', note: 'Closing line' }, hint: 'A list of up to six points, each with an icon or a tick. Use the Tick icon for a checklist. Some styles (Signature) show a photo beside it.' },
    { id: 'row', label: 'Icon row', media: false, fields: ['headline', 'items', 'body'], itemFields: ['icon', 'title'], maxItems: 4, labels: { body: 'Callout box' }, hint: 'Up to four icons in a row with short labels, and an optional callout box underneath.' },
    { id: 'quote', label: 'Quote', media: false, fields: ['headline', 'kicker'], labels: { headline: 'Quote', kicker: 'Who said it' }, hint: 'A real patient or practitioner quote. The small heading is who said it.' },
    { id: 'cta', label: 'Closing call to action', media: false, fields: ['headline', 'body'], hint: 'The last slide. One consultation-led ask and the handle.' },
  ];

  const FIELD_LABELS = {
    numeral: 'Number', kicker: 'Small heading', headline: 'Headline', body: 'Supporting text',
    items: 'Points', note: 'Closing line', icon: 'Icon', title: 'Point', text: 'Detail',
  };
  const FIELD_LIMITS = { numeral: 8, kicker: 40, headline: 90, body: 220, note: 120, title: 40, text: 60 };

  const DEFAULT_STYLE = 'classic';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Escaped text with markup: *accent* → the style's accent italic (copper in
  // Signature); _italic_ → plain italic in the text colour; new line → break.
  function rich(s) {
    return esc(s)
      .replace(/\*([^*\n]+)\*/g, '<em class="em">$1</em>')
      .replace(/(^|[\s(>])_([^_\n]+)_(?=$|[\s).,!?:;<])/g, '$1<i class="ital">$2</i>')
      .replace(/\n/g, '<br>');
  }

  function assetUrl(ref) {
    if (!ref) return null;
    if (ref.startsWith('brand:')) return 'studio://brand/' + ref.slice(6).split('/').map(encodeURIComponent).join('/');
    if (ref.startsWith('media:')) return 'studio://media/' + encodeURIComponent(ref.slice(6));
    return null;
  }

  function fontCss(brand) {
    let css = '';
    for (const role of ['display', 'body']) {
      const f = brand.fonts[role];
      for (const face of f.faces || []) {
        css += `@font-face{font-family:'${f.family}';src:url('${assetUrl('brand:' + face.file)}') format('woff2');font-weight:${face.weight};font-style:${face.style || 'normal'};font-display:block;}\n`;
      }
    }
    return css;
  }

  // Headline size steps down as copy gets longer, so a long headline never
  // overflows. steps: [[maxChars, px], ...] on the 1080-wide canvas.
  function fit(text, steps) {
    const n = String(text || '').length;
    for (const [max, px] of steps) if (n <= max) return px;
    return steps[steps.length - 1][1];
  }

  function mediaTag(media, opts, cls) {
    if (!media || !media.ref) return '';
    if (opts.transparentMedia && media.kind === 'video') return '';
    const pos = `${Math.round((media.focusX != null ? media.focusX : 0.5) * 100)}% ${Math.round((media.focusY != null ? media.focusY : 0.5) * 100)}%`;
    if (media.kind === 'video') {
      if (opts.live) {
        return `<video class="${cls}" src="${assetUrl(media.ref)}" muted autoplay loop playsinline style="object-position:${pos}"></video>`;
      }
      const poster = assetUrl(media.poster);
      return poster ? `<img class="${cls}" src="${poster}" style="object-position:${pos}" alt="">` : '';
    }
    return `<img class="${cls}" src="${assetUrl(media.ref)}" style="object-position:${pos}" alt="">`;
  }

  const pad2 = (n) => String(n).padStart(2, '0');

  // Everything a style needs to draw a slide, so styles never touch raw input.
  function context(slide, brand, opts) {
    const P = brand.palette;
    const index = Number.isInteger(opts.index) ? opts.index : 0;
    const total = Math.max(1, Number.isInteger(opts.total) ? opts.total : 1);
    // Clip export of a video cover: the footage is laid under the rendered
    // graphics, so the media window must be see-through. A style marks its
    // media window with ctx.win(); in this mode the window becomes a hole and
    // everything around it is painted in the style's --hole colour.
    const hole = !!(opts.transparentMedia && slide.template === 'cover' && slide.media && slide.media.kind === 'video' && slide.media.ref);
    const s = slide;
    return {
      P, brand, s, opts, index, total, hole,
      isFirst: index === 0,
      isLast: index === total - 1,
      pager: `${pad2(index + 1)} / ${pad2(total)}`,
      logoUrl: assetUrl('brand:' + brand.logo),
      hasMedia: !!(s.media && s.media.ref),
      esc, fit,
      media: (cls) => mediaTag(s.media, opts, cls || 'fill'),
      // Photo n (1-3) of a Three photos slide; a soft placeholder if empty.
      photo: (n, cls) => mediaTag(s[n === 1 ? 'media' : `media${n}`], { ...opts, live: false }, cls || 'fill') || '<div class="fill" style="background:var(--bg2)"></div>',
      win: (cls, extra) => `<div class="mwin ${cls || ''}${hole ? ' hole' : ''}"${extra ? ` style="${extra}"` : ''}>${hole ? '' : mediaTag(s.media, opts, 'fill')}</div>`,
      // cls: class name; st: optional inline style for per-layout sizing
      kicker: (cls, st) => (s.kicker ? `<div class="${cls || 'kicker'}"${st ? ` style="${st}"` : ''}>${esc(s.kicker)}</div>` : ''),
      numeral: (cls, st) => (s.numeral ? `<div class="${cls || 'numeral'}"${st ? ` style="${st}"` : ''}>${esc(s.numeral)}</div>` : ''),
      body: (cls, st) => (s.body ? `<p class="${cls || 'body'}"${st ? ` style="${st}"` : ''}>${rich(s.body)}</p>` : ''),
      note: (cls) => (s.note ? `<p class="${cls || 'note'}">${rich(s.note)}</p>` : ''),
      items: () => (Array.isArray(s.items) ? s.items.filter((it) => it && (it.title || it.text)) : []),
      icon: (name, size, stroke) => ICONS.icon(name || 'check', size, stroke),
      rich,
      // The figure on a Key fact slide, sized by its length.
      fig: (steps, cls) => (s.numeral ? `<div class="${cls || 'fig'}" style="font-size:${fit(s.numeral, steps)}px">${esc(s.numeral)}</div>` : ''),
      h1: (steps, cls) => `<h1${cls ? ` class="${cls}"` : ''} style="font-size:${fit(s.headline, steps)}px">${rich(s.headline)}</h1>`,
      footer: () => `<div class="footer"><span class="f1">${esc(brand.footer.text)}</span> <span class="f2">${esc(brand.footer.accent || '')}</span></div>`,
      arrow: (color) => `<svg class="arrow" width="44" height="18" viewBox="0 0 44 18" aria-hidden="true"><path d="M0 9h40M32 1l8 8-8 8" fill="none" stroke="${color || 'currentColor'}" stroke-width="2"/></svg>`,
    };
  }

  // opts.style            → style id (post.style); default classic
  // opts.index, opts.total → this slide's position in the carousel (styles use
  //                          it for page numbers, progress bars and the
  //                          seamless line that runs across slides)
  // opts.live             → preview: video slides play inline
  // opts.transparentMedia → clip export: leave video out, see above
  function slideHtml(slide, brand, opts) {
    opts = opts || {};
    const style = STYLES.get(opts.style || DEFAULT_STYLE);
    const { w: W, h: H } = sizeOf(style.id);
    const ctx = context(slide, brand, opts);
    ctx.W = W; ctx.H = H;
    const role = TEMPLATES.some((t) => t.id === slide.template) ? slide.template : 'light';
    // Styles that don't draw the list and row types get the shared versions.
    const shared = (role === 'list' || role === 'row') && !(style.handles || []).includes(role);
    const out = shared ? STYLES.fallback(role, ctx) : style.render(role, ctx);
    const P = brand.palette;
    const sig = P.signature || {};
    const sigVars = Object.entries(sig).filter(([k]) => !k.startsWith('_')).map(([k, v]) => `--sig-${k}:${v};`).join('');
    return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontCss(brand)}
:root{
  --brand:${P.brand};--deep:${P.brandDeep};--accent:${P.accent};--gold:${P.accentOnDark};
  --bg:${P.bg};--bg2:${P.bg2};--ink:${P.ink};--muted:${P.muted};--line:${P.line};
  --display:'${brand.fonts.display.family}',${brand.fonts.display.fallback};
  --sans:'${brand.fonts.body.family}',${brand.fonts.body.fallback};
  --hole:${P.bg};${sigVars}
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${ctx.hole ? 'transparent' : P.bg}}
.slide{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:var(--sans);color:var(--ink);-webkit-font-smoothing:antialiased}
h1{font-family:var(--display);font-weight:300;overflow-wrap:break-word}
.fill{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.mwin{position:absolute;overflow:hidden;z-index:0}
.slide.tx{background:transparent!important}
.mwin.hole{box-shadow:0 0 0 3000px var(--hole);background:transparent!important}
.arrow{display:inline-block;vertical-align:middle}
.em{font-family:var(--display);font-style:italic;font-weight:300;color:var(--em,inherit)}
.ital{font-family:var(--display);font-style:italic}
.ico{display:block}
${STYLES.fallbackCss}
${style.css}
</style></head><body><div class="slide ${style.id} ${role} ${out.cls || ''}${ctx.hole ? ' tx' : ''}">${out.inner}</div></body></html>`;
  }

  // All public text on a slide, for the compliance check.
  function slideText(slide) {
    const items = Array.isArray(slide.items) ? slide.items.flatMap((it) => [it && it.title, it && it.text]) : [];
    return ['numeral', 'kicker', 'headline', 'body', 'note'].map((k) => slide[k]).concat(items)
      .filter(Boolean).join('\n').replace(/\*/g, '').replace(/(^|\s)_|_(?=\s|$|[.,!?])/g, '$1');
  }

  const api = {
    W, H, sizeOf, TEMPLATES, FIELD_LABELS, FIELD_LIMITS, DEFAULT_STYLE,
    STYLES: STYLES.list, ICONS: ICONS.ICONS, slideHtml, slideText, assetUrl, esc, rich,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Slides = api;
})(typeof self !== 'undefined' ? self : this);
