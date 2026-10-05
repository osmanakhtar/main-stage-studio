// slides.js — the slide templates. One function, slideHtml(), builds a full
// 1080×1350 HTML document for a slide. The editor preview and the PNG/clip
// export both render this exact document, so what Nafisa sees is what ships.
//
// Brand values (palette, fonts, logo, footer) come from the brand pack's
// brand.json; templates never hardcode a colour. Asset references:
//   brand:<path>  → a file inside the brand pack (studio://brand/<path>)
//   media:<file>  → a file she imported (studio://media/<file>)
//
// Works in both the renderer (window.Slides) and the main process (require).
(function (root) {
  'use strict';

  const W = 1080;
  const H = 1350;

  const TEMPLATES = [
    { id: 'cover', label: 'Cover photo', media: true, fields: ['kicker', 'headline', 'body'], hint: 'Opening slide. Full-bleed photo or video with the headline over a soft scrim.' },
    { id: 'light', label: 'Light card', media: false, fields: ['numeral', 'kicker', 'headline', 'body'], hint: 'Warm white with the gold hairline frame. For explaining one point.' },
    { id: 'split', label: 'Split photo', media: true, fields: ['numeral', 'kicker', 'headline', 'body'], hint: 'Photo panel beside a light text panel.' },
    { id: 'brand', label: 'Brand card', media: false, fields: ['kicker', 'headline', 'body'], hint: 'Deep navy card. For a key message or a summary.' },
    { id: 'quote', label: 'Quote', media: false, fields: ['headline', 'kicker'], hint: 'A patient or practitioner quote. Kicker is the attribution.' },
    { id: 'cta', label: 'Closing call to action', media: false, fields: ['headline', 'body'], hint: 'Last slide. One consultation-led ask and the handle.' },
  ];

  const FIELD_LABELS = {
    numeral: 'Number', kicker: 'Small heading', headline: 'Headline', body: 'Supporting text',
  };
  const FIELD_LIMITS = { numeral: 4, kicker: 40, headline: 90, body: 220 };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
  // overflows the card. Sizes are in px on the 1080-wide canvas.
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

  function footer() {
    return '<div class="footer"><span class="f1"></span> <span class="f2"></span></div>';
  }

  // opts.live            → preview: video slides play inline
  // opts.transparentMedia → clip export: leave video out and the page clear, so
  //                         the graphics can be laid over the moving footage
  function slideHtml(slide, brand, opts) {
    opts = opts || {};
    const P = brand.palette;
    const display = `'${brand.fonts.display.family}',${brand.fonts.display.fallback}`;
    const body = `'${brand.fonts.body.family}',${brand.fonts.body.fallback}`;
    const t = slide.template || 'light';
    const s = slide;
    const logoUrl = assetUrl('brand:' + brand.logo);
    let inner = '';
    let cls = t;

    const kicker = s.kicker ? `<div class="kicker">${esc(s.kicker)}</div>` : '';
    const numeral = s.numeral ? `<div class="numeral">${esc(s.numeral)}</div>` : '';
    const bodyP = s.body ? `<p class="body">${esc(s.body)}</p>` : '';

    if (t === 'cover') {
      const hasMedia = s.media && s.media.ref;
      const hpx = fit(s.headline, [[24, 112], [40, 96], [60, 82], [999, 70]]);
      inner = `
        ${mediaTag(s.media, opts, 'bg')}
        <div class="scrim ${hasMedia ? '' : 'solid'}"></div>
        <div class="content bottom">
          ${kicker}
          <h1 style="font-size:${hpx}px">${esc(s.headline)}</h1>
          ${bodyP}
        </div>
        ${footer()}`;
    } else if (t === 'light') {
      const hpx = fit(s.headline, [[28, 84], [50, 72], [999, 60]]);
      inner = `
        <div class="frame"></div>
        <div class="content center">
          ${numeral}${kicker}
          <h1 style="font-size:${hpx}px">${esc(s.headline)}</h1>
          ${bodyP}
        </div>
        ${footer()}`;
    } else if (t === 'split') {
      const hpx = fit(s.headline, [[24, 62], [44, 54], [999, 46]]);
      const img = `<div class="panel-img">${mediaTag(s.media, opts, 'fill')}</div>`;
      const txt = `<div class="panel-txt"><div class="content center">${numeral}${kicker}<h1 style="font-size:${hpx}px">${esc(s.headline)}</h1>${bodyP}</div>${footer()}</div>`;
      inner = s.side === 'right' ? txt + img : img + txt;
      cls += s.side === 'right' ? ' img-right' : ' img-left';
    } else if (t === 'brand') {
      const hpx = fit(s.headline, [[28, 92], [50, 78], [999, 64]]);
      inner = `
        <div class="content center">
          ${kicker}
          <h1 style="font-size:${hpx}px">${esc(s.headline)}</h1>
          ${bodyP}
        </div>
        ${footer()}`;
    } else if (t === 'quote') {
      const hpx = fit(s.headline, [[60, 68], [110, 58], [999, 48]]);
      inner = `
        <div class="frame"></div>
        <div class="content center">
          <div class="qmark">&ldquo;</div>
          <h1 style="font-size:${hpx}px">${esc(s.headline)}</h1>
          ${s.kicker ? `<div class="attr">${esc(s.kicker)}</div>` : ''}
        </div>
        ${footer()}`;
    } else if (t === 'cta') {
      const hpx = fit(s.headline, [[28, 88], [50, 74], [999, 62]]);
      inner = `
        <img class="logo-mid" src="${logoUrl}" alt="">
        <div class="content cta-body">
          <h1 style="font-size:${hpx}px">${esc(s.headline)}</h1>
          ${bodyP}
          ${brand.handle ? `<div class="handle">${esc(brand.handle)}</div>` : ''}
        </div>
        ${footer()}`;
    }

    const transparent = opts.transparentMedia && s.media && s.media.kind === 'video';

    return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontCss(brand)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${transparent ? 'transparent' : P.bg}}
.slide{position:relative;width:${W}px;height:${H}px;overflow:hidden;font-family:${body};color:${P.ink};-webkit-font-smoothing:antialiased}
h1{font-family:${display};font-weight:300;line-height:1.06;letter-spacing:.005em;overflow-wrap:break-word}
.kicker{font-size:24px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;margin-bottom:26px}
.body{font-size:32px;line-height:1.5;margin-top:28px;max-width:30ch}
.numeral{font-family:${display};font-weight:300;font-size:150px;line-height:.9;color:${P.accent};margin-bottom:22px}
.content{position:absolute;left:104px;right:104px;z-index:3}
.content.center{top:0;bottom:120px;display:flex;flex-direction:column;justify-content:center}
.footer{position:absolute;left:0;right:0;bottom:46px;text-align:center;font-size:17px;font-weight:600;letter-spacing:.34em;z-index:4}
.footer .f1::before{content:'${esc(brand.footer.text)}'}
.footer .f2::before{content:'${esc(brand.footer.accent || '')}';font-weight:400;opacity:.7}
.frame{position:absolute;inset:30px;border:2px solid ${P.accent}99;z-index:1;pointer-events:none}

/* cover */
.cover{background:${transparent ? 'transparent' : P.brandDeep}}
.cover .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.cover .scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,${P.brandDeep}8C 0%,${P.brandDeep}00 24%,${P.brandDeep}00 42%,${P.brandDeep}B3 70%,${P.brandDeep}F0 100%)}
.cover .scrim.solid{background:linear-gradient(155deg,${P.brandDeep} 0%,${P.brand} 100%)}
.cover .content.bottom{bottom:150px}
.cover .kicker{color:${P.accentOnDark}}
.cover h1{color:#fff}
.cover .body{color:rgba(255,255,255,.86)}
.cover .footer{color:${P.accentOnDark}}

/* light */
.light{background:${P.bg}}
.light .kicker{color:${P.brand}}
.light h1{color:${P.brand}}
.light .body{color:${P.ink}}
.light .footer{color:${P.muted}}

/* split */
.split{display:flex;background:${P.bg}}
.split .panel-img{flex:0 0 44%;position:relative;overflow:hidden;background:${P.bg2}}
.split .panel-img .fill{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.split.img-left .panel-img{border-right:2px solid ${P.accent}99}
.split.img-right .panel-img{border-left:2px solid ${P.accent}99}
.split .panel-txt{flex:1;position:relative}
.split .content{left:64px;right:64px}
.split .numeral{font-size:110px}
.split .kicker{color:${P.brand};font-size:21px}
.split h1{color:${P.brand}}
.split .body{color:${P.ink};font-size:28px}
.split .footer{color:${P.muted};font-size:15px;letter-spacing:.28em}

/* brand */
.brand{background:linear-gradient(155deg,${P.brandDeep} 0%,${P.brand} 100%)}
.brand .kicker{color:${P.accentOnDark}}
.brand h1{color:#fff}
.brand .body{color:rgba(255,255,255,.84)}
.brand .footer{color:${P.accentOnDark}}

/* quote */
.quote{background:${P.bg}}
.quote .qmark{font-family:${display};font-weight:300;font-size:240px;line-height:.6;height:110px;color:${P.accent}}
.quote h1{font-style:italic;color:${P.brand};line-height:1.16}
.quote .attr{margin-top:40px;font-size:23px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:${P.muted}}
.quote .footer{color:${P.muted}}

/* cta */
.cta{background:linear-gradient(155deg,${P.brandDeep} 0%,${P.brand} 100%)}
.cta .logo-mid{position:absolute;top:150px;left:50%;transform:translateX(-50%);width:300px;z-index:3}
.cta .cta-body{top:420px;bottom:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.cta h1{color:#fff}
.cta .body{color:rgba(255,255,255,.84);margin-left:auto;margin-right:auto}
.cta .handle{margin-top:48px;padding:16px 40px;border:2px solid ${P.accentOnDark};color:${P.accentOnDark};font-size:26px;font-weight:600;letter-spacing:.12em}
.cta .footer{color:${P.accentOnDark}}
</style></head><body><div class="slide ${cls}">${inner}</div></body></html>`;
  }

  // All public text on a slide, for the compliance check.
  function slideText(slide) {
    return ['numeral', 'kicker', 'headline', 'body'].map((k) => slide[k]).filter(Boolean).join('\n');
  }

  const api = { W, H, TEMPLATES, FIELD_LABELS, FIELD_LIMITS, slideHtml, slideText, assetUrl, esc };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Slides = api;
})(typeof self !== 'undefined' ? self : this);
