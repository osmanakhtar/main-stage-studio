// styles.js — the carousel styles. Each one draws every slide type (cover,
// light = numbered point, split = photo and text, brand = statement, fact,
// photos, quote, cta) with its own layout, typography and ornament.
//
// Rules every style keeps:
//   - colours only from the brand palette, via the CSS variables slides.js
//     sets (--brand --deep --accent --gold --bg --bg2 --ink --muted --line),
//     fonts only via --display and --sans
//   - gold (--accent, --gold) as accent only, never a large fill
//   - text inside Instagram's safe area: 72px+ side margins, nothing critical
//     in the bottom 120px apart from the footer
//   - the cover's photo or video sits in ctx.win(), ahead of everything
//     except background-only layers, so a video cover can be exported as a
//     clip (see slides.js, "hole")
//   - glyphs limited to Latin; arrows are drawn, not typed
(function (root) {
  'use strict';

  const styles = [];
  const add = (s) => styles.push(s);

  // ---------------------------------------------------------------- Classic
  // The original look: warm white cards with a gold hairline frame, serif
  // headlines, gold numerals, navy statement and closing cards.
  add({
    id: 'classic',
    label: 'Classic',
    description: 'Warm white cards, gold hairline frame, light serif headlines. Calm and familiar.',
    css: `
.kicker{font-size:24px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;margin-bottom:26px}
.body{font-size:32px;line-height:1.5;margin-top:28px;max-width:30ch}
.numeral{font-family:var(--display);font-weight:300;font-size:150px;line-height:.9;color:var(--accent);margin-bottom:22px}
h1{line-height:1.06;letter-spacing:.005em}
.content{position:absolute;left:104px;right:104px;z-index:3}
.content.center{top:0;bottom:120px;display:flex;flex-direction:column;justify-content:center}
.footer{position:absolute;left:0;right:0;bottom:46px;text-align:center;font-size:17px;font-weight:600;letter-spacing:.34em;z-index:4}
.footer .f2{font-weight:400;opacity:.7}
.frame{position:absolute;inset:30px;border:2px solid color-mix(in srgb,var(--accent) 60%,transparent);z-index:1}
.cover{background:var(--deep);--hole:var(--deep)}
.cover .mwin{inset:0}
.cover .scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,color-mix(in srgb,var(--deep) 55%,transparent) 0%,transparent 24%,transparent 42%,color-mix(in srgb,var(--deep) 70%,transparent) 70%,color-mix(in srgb,var(--deep) 94%,transparent) 100%)}
.cover .scrim.solid{background:linear-gradient(155deg,var(--deep),var(--brand))}
.cover .content{bottom:150px}
.cover .kicker{color:var(--gold)} .cover h1{color:#fff} .cover .body{color:rgba(255,255,255,.86)} .cover .footer{color:var(--gold)}
.light{background:var(--bg)}
.light .kicker{color:var(--brand)} .light h1{color:var(--brand)} .light .footer{color:var(--muted)}
.split{display:flex;background:var(--bg)}
.split .pimg{flex:0 0 44%;position:relative;overflow:hidden;background:var(--bg2)}
.split.img-left .pimg{border-right:2px solid color-mix(in srgb,var(--accent) 60%,transparent)}
.split.img-right .pimg{border-left:2px solid color-mix(in srgb,var(--accent) 60%,transparent)}
.split .ptxt{flex:1;position:relative}
.split .content{left:64px;right:64px}
.split .numeral{font-size:110px}
.split .kicker{color:var(--brand);font-size:21px} .split h1{color:var(--brand)} .split .body{font-size:28px}
.split .footer{color:var(--muted);font-size:15px;letter-spacing:.28em}
.brand{background:linear-gradient(155deg,var(--deep),var(--brand))}
.brand .kicker{color:var(--gold)} .brand h1{color:#fff} .brand .body{color:rgba(255,255,255,.84)} .brand .footer{color:var(--gold)}
.quote{background:var(--bg)}
.quote .qmark{font-family:var(--display);font-weight:300;font-size:240px;line-height:.6;height:110px;color:var(--accent)}
.quote h1{font-style:italic;color:var(--brand);line-height:1.16}
.quote .attr{margin-top:40px;font-size:23px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
.quote .footer{color:var(--muted)}
.cta{background:linear-gradient(155deg,var(--deep),var(--brand))}
.cta .logo{position:absolute;top:150px;left:50%;transform:translateX(-50%);width:300px;z-index:3}
.cta .content{top:420px;bottom:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.cta h1{color:#fff} .cta .body{color:rgba(255,255,255,.84);margin-left:auto;margin-right:auto}
.cta .handle{margin-top:48px;padding:16px 40px;border:2px solid var(--gold);color:var(--gold);font-size:26px;font-weight:600;letter-spacing:.12em}
.cta .footer{color:var(--gold)}
.fact{background:var(--bg)}
.fact .fig{font-family:var(--display);font-weight:300;line-height:.9;color:var(--accent);margin-bottom:10px;letter-spacing:-.01em}
.fact h1{color:var(--brand)} .fact .body{color:var(--ink)} .fact .footer{color:var(--muted)}
.photos{background:var(--bg)}
.photos .ph{position:absolute;overflow:hidden;background:var(--bg2)}
.photos .cap{position:absolute;left:72px;right:72px;top:1060px;z-index:3}
.photos .kicker{color:var(--brand);margin-bottom:14px;font-size:21px} .photos h1{color:var(--brand)} .photos .footer{color:var(--muted)}`,
    render(role, c) {
      const s = c.s;
      if (role === 'cover') {
        return { inner: `${c.hasMedia ? c.win() : ''}<div class="scrim${c.hasMedia ? '' : ' solid'}"></div>
          <div class="content">${c.kicker()}${c.h1([[24, 112], [40, 96], [60, 82], [999, 70]])}${c.body()}</div>${c.footer()}` };
      }
      if (role === 'light') {
        return { inner: `<div class="frame"></div><div class="content center">${c.numeral()}${c.kicker()}${c.h1([[28, 84], [50, 72], [999, 60]])}${c.body()}</div>${c.footer()}` };
      }
      if (role === 'split') {
        const img = `<div class="pimg">${c.media('fill')}</div>`;
        const txt = `<div class="ptxt"><div class="content center">${c.numeral()}${c.kicker()}${c.h1([[24, 62], [44, 54], [999, 46]])}${c.body()}</div>${c.footer()}</div>`;
        return { cls: s.side === 'right' ? 'img-right' : 'img-left', inner: s.side === 'right' ? txt + img : img + txt };
      }
      if (role === 'brand') {
        return { inner: `<div class="content center">${c.kicker()}${c.h1([[28, 92], [50, 78], [999, 64]])}${c.body()}</div>${c.footer()}` };
      }
      if (role === 'quote') {
        return { inner: `<div class="frame"></div><div class="content center"><div class="qmark">&ldquo;</div>${c.h1([[60, 68], [110, 58], [999, 48]])}${c.kicker('attr')}</div>${c.footer()}` };
      }
      if (role === 'fact') {
        return { inner: `<div class="frame"></div><div class="content center">${c.fig([[3, 300], [5, 240], [999, 180]])}${c.h1([[28, 64], [50, 56], [999, 48]])}${c.body()}</div>${c.footer()}` };
      }
      if (role === 'photos') {
        return { inner: `<div class="ph" style="left:72px;top:72px;width:520px;height:950px">${c.photo(1)}</div>
          <div class="ph" style="left:616px;top:72px;width:392px;height:463px">${c.photo(2)}</div>
          <div class="ph" style="left:616px;top:559px;width:392px;height:463px">${c.photo(3)}</div>
          <div class="frame" style="inset:44px 44px auto 44px;height:1006px"></div>
          <div class="cap">${c.kicker()}${c.h1([[30, 60], [60, 50], [999, 42]])}</div>${c.footer()}` };
      }
      return { inner: `<img class="logo" src="${c.logoUrl}" alt=""><div class="content">${c.h1([[28, 88], [50, 74], [999, 62]])}${c.body()}${c.brand.handle ? `<div class="handle">${c.esc(c.brand.handle)}</div>` : ''}</div>${c.footer()}` };
    },
  });

  // ---------------------------------------------------------------- Editorial
  // A magazine feature: masthead and page numbers, rules, a gold-ruled label,
  // drop caps, photos set in the column with a caption line.
  add({
    id: 'editorial',
    label: 'Editorial',
    description: 'Magazine pages: masthead, page numbers, fine rules and drop caps. For considered, educational posts.',
    css: `
.slide{background:var(--bg)}
.mast{position:absolute;left:72px;right:72px;top:58px;display:flex;justify-content:space-between;align-items:baseline;padding-bottom:18px;border-bottom:2px solid var(--brand);font-size:19px;font-weight:600;letter-spacing:.32em;color:var(--brand);z-index:3}
.mast .pg{letter-spacing:.14em;font-weight:500;color:var(--muted)}
.foot{position:absolute;left:72px;right:72px;bottom:54px;display:flex;justify-content:space-between;align-items:center;padding-top:16px;border-top:1px solid var(--line);font-size:19px;font-weight:500;letter-spacing:.12em;color:var(--muted);z-index:3}
.foot .swipe{display:flex;align-items:center;gap:12px;text-transform:uppercase;letter-spacing:.2em;font-weight:600;color:var(--brand)}
.label{display:flex;align-items:center;gap:18px;font-size:21px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--brand)}
.label::before{content:'';width:46px;height:2px;background:var(--accent)}
h1{color:var(--brand);line-height:1.02;letter-spacing:-.005em}
.lede{font-family:var(--display);font-weight:300;font-style:italic;font-size:38px;line-height:1.3;color:var(--muted)}
.dc{font-size:30px;line-height:1.55;color:var(--ink);max-width:33ch}
.dc::first-letter{float:left;font-family:var(--display);font-weight:500;font-size:124px;line-height:.8;padding:10px 16px 0 0;color:var(--brand)}
.col{position:absolute;left:72px;right:72px;z-index:2;display:flex;flex-direction:column;gap:28px}
.big-n{font-family:var(--display);font-weight:300;font-style:italic;font-size:250px;line-height:.78;color:var(--accent)}
.cover{--hole:var(--bg)}
.cover .mwin{left:72px;right:72px;top:150px;height:640px;background:var(--bg2)}
.cover .col{top:830px;gap:22px}
.split .mwin{left:72px;right:72px;height:520px;background:var(--bg2)}
.cap{position:absolute;left:72px;right:72px;font-family:var(--display);font-style:italic;font-weight:300;font-size:24px;color:var(--muted);z-index:2}
.brand{background:var(--brand)}
.brand .mast{color:var(--gold);border-color:var(--gold)} .brand .mast .pg{color:rgba(255,255,255,.6)}
.brand .foot{border-color:rgba(255,255,255,.2);color:rgba(255,255,255,.6)} .brand .foot .swipe{color:var(--gold)}
.brand .label{color:var(--gold)} .brand h1{color:#fff;font-style:italic} .brand .lede{color:rgba(255,255,255,.8)}
.quote{background:var(--bg2)}
.quote .qm{font-family:var(--display);font-weight:300;font-size:300px;line-height:.55;height:130px;color:var(--accent)}
.quote h1{font-style:italic;line-height:1.14}
.cta .handle{align-self:flex-start;border:2px solid var(--brand);padding:18px 34px;font-size:26px;font-weight:600;letter-spacing:.1em;color:var(--brand)}
.fact .fig{font-family:var(--display);font-weight:300;font-style:italic;line-height:.82;color:var(--brand);letter-spacing:-.02em}
.photos .ph{position:absolute;overflow:hidden;background:var(--bg2);z-index:1}`,
    render(role, c) {
      const s = c.s;
      const mast = (left) => `<div class="mast"><span>${c.esc(left || c.brand.footer.text)}</span><span class="pg">${c.pager}</span></div>`;
      const foot = () => `<div class="foot"><span>${c.esc(c.brand.handle || '')}</span>${c.isLast ? '' : `<span class="swipe">Swipe ${c.arrow()}</span>`}</div>`;
      if (role === 'cover') {
        return { inner: `${c.hasMedia ? c.win() : '<div class="mwin" style="left:72px;right:72px;top:150px;height:640px;background:var(--bg2)"></div>'}${mast()}
          <div class="col">${c.kicker('label')}${c.h1([[24, 100], [40, 86], [60, 72], [999, 60]])}${c.body('lede')}</div>${foot()}` };
      }
      if (role === 'light') {
        return { inner: `${mast()}<div class="col" style="top:190px;bottom:150px;justify-content:center">${c.numeral('big-n')}${c.kicker('label')}${c.h1([[28, 92], [50, 78], [999, 64]])}${c.body('dc')}</div>${foot()}` };
      }
      if (role === 'split') {
        const top = s.side !== 'right';
        const img = `<div class="mwin" style="top:${top ? 150 : 680}px">${c.media('fill')}</div>`;
        const cap = s.kicker ? `<div class="cap" style="top:${top ? 686 : 1214}px">${c.esc(s.kicker)}</div>` : '';
        const col = `<div class="col" style="top:${top ? 760 : 170}px;gap:20px">${c.numeral('big-n', 'font-size:150px')}${c.h1([[24, 70], [44, 60], [999, 50]])}${c.body('dc', 'font-size:27px')}</div>`;
        return { inner: `${img}${mast()}${cap}${col}${foot()}` };
      }
      if (role === 'brand') {
        return { inner: `${mast()}<div class="col" style="top:190px;bottom:150px;justify-content:center">${c.kicker('label')}${c.h1([[28, 104], [50, 88], [999, 70]])}${c.body('lede')}</div>${foot()}` };
      }
      if (role === 'quote') {
        return { inner: `${mast()}<div class="col" style="top:190px;bottom:150px;justify-content:center"><div class="qm">&ldquo;</div>${c.h1([[60, 76], [110, 64], [999, 52]])}${c.kicker('label')}</div>${foot()}` };
      }
      if (role === 'fact') {
        return { inner: `${mast()}<div class="col" style="top:190px;bottom:150px;justify-content:center">${c.fig([[3, 380], [5, 290], [999, 210]])}<div class="label" style="margin-top:10px">${c.esc(s.headline || '')}</div>${c.body('dc')}</div>${foot()}` };
      }
      if (role === 'photos') {
        return { inner: `${mast()}<div class="ph" style="left:72px;top:150px;width:580px;height:760px">${c.photo(1)}</div>
          <div class="ph" style="left:676px;top:150px;width:332px;height:368px">${c.photo(2)}</div>
          <div class="ph" style="left:676px;top:542px;width:332px;height:368px">${c.photo(3)}</div>
          <div class="cap" style="top:926px">${c.esc(s.kicker || '')}</div>
          <div class="col" style="top:990px">${c.h1([[30, 66], [60, 54], [999, 44]])}</div>${foot()}` };
      }
      return { inner: `${mast()}<div class="col" style="top:190px;bottom:150px;justify-content:center">${c.h1([[28, 96], [50, 82], [999, 66]])}${c.body('lede')}${c.brand.handle ? `<div class="handle">${c.esc(c.brand.handle)}</div>` : ''}</div>${foot()}` };
    },
  });

  // ---------------------------------------------------------------- Clinical grid
  // Swiss-style: sans-serif headlines on a visible column grid, a square
  // accent, a page index and a progress bar that fills as she swipes.
  add({
    id: 'clinical',
    label: 'Clinical grid',
    description: 'Clean sans-serif on a column grid with a progress bar. Precise and modern, good for facts and steps.',
    css: `
.slide{background:var(--bg)}
.grid{position:absolute;inset:0;z-index:0;background-image:linear-gradient(to right,var(--line) 1px,transparent 1px);background-size:234px 100%;background-position:72px 0;opacity:.7}
h1{font-family:var(--sans);font-weight:600;letter-spacing:-.025em;line-height:1.04;color:var(--brand)}
.idx{position:absolute;top:66px;left:72px;font-size:24px;font-weight:600;letter-spacing:.06em;color:var(--brand);z-index:3}
.idx span{color:var(--muted);font-weight:400}
.tag{position:absolute;top:68px;right:72px;font-size:19px;font-weight:600;letter-spacing:.28em;color:var(--muted);z-index:3}
.k{display:flex;align-items:center;gap:16px;font-size:22px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.k::before{content:'';width:20px;height:20px;background:var(--accent);flex:0 0 auto}
.body{font-size:31px;line-height:1.5;color:var(--ink);max-width:31ch}
.num{font-family:var(--sans);font-weight:400;font-size:190px;letter-spacing:-.05em;line-height:.85;color:var(--brand)}
.box{position:absolute;left:72px;right:72px;z-index:2;display:flex;flex-direction:column;gap:30px}
.prog{position:absolute;left:72px;right:72px;bottom:66px;display:flex;gap:10px;z-index:3}
.prog i{flex:1;height:6px;border-radius:3px;background:var(--line)}
.prog i.on{background:var(--brand)}
.prog i.done{background:color-mix(in srgb,var(--brand) 35%,var(--line))}
.cover{--hole:var(--bg)}
.cover .mwin{left:0;right:0;top:0;height:760px;background:var(--bg2)}
.cover .box{top:810px;gap:24px}
.split{background:var(--bg)}
.split .mwin{top:0;bottom:0;width:50%;background:var(--bg2)}
.split .box{gap:24px}
.split .num{font-size:130px}
.brand{background:var(--brand)}
.brand .grid{background-image:linear-gradient(to right,rgba(255,255,255,.09) 1px,transparent 1px);opacity:1}
.brand h1{color:#fff} .brand .k{color:var(--gold)} .brand .body{color:rgba(255,255,255,.84)}
.brand .idx{color:#fff} .brand .idx span,.brand .tag{color:rgba(255,255,255,.55)}
.brand .prog i{background:rgba(255,255,255,.18)} .brand .prog i.on{background:var(--gold)} .brand .prog i.done{background:rgba(255,255,255,.4)}
.quote .qm{font-family:var(--sans);font-weight:600;font-size:200px;line-height:.7;height:110px;color:var(--accent)}
.quote h1{font-weight:500;letter-spacing:-.015em;line-height:1.18}
.cta .btn{align-self:flex-start;background:var(--brand);color:#fff;border-radius:999px;padding:26px 46px;font-size:28px;font-weight:600;letter-spacing:.04em}
.fact .fig{font-family:var(--sans);font-weight:400;letter-spacing:-.06em;line-height:.85;color:var(--brand)}
.photos .ph{position:absolute;overflow:hidden;background:var(--bg2)}`,
    render(role, c) {
      const s = c.s;
      const prog = () => `<div class="prog">${Array.from({ length: c.total }, (_, i) => `<i class="${i === c.index ? 'on' : i < c.index ? 'done' : ''}"></i>`).join('')}</div>`;
      const head = () => `<div class="idx">${String(c.index + 1).padStart(2, '0')}<span> / ${String(c.total).padStart(2, '0')}</span></div><div class="tag">${c.esc(c.brand.footer.text)}</div>`;
      if (role === 'cover') {
        return { inner: `${c.hasMedia ? c.win() : '<div class="mwin" style="left:0;right:0;top:0;height:760px;background:var(--brand)"></div>'}
          <div class="box">${c.kicker('k')}${c.h1([[24, 88], [40, 76], [60, 64], [999, 54]])}${c.body()}</div>${prog()}` };
      }
      if (role === 'light') {
        return { inner: `<div class="grid"></div>${head()}<div class="box" style="top:170px;bottom:150px;justify-content:center">${c.numeral('num')}${c.kicker('k')}${c.h1([[28, 80], [50, 68], [999, 56]])}${c.body()}</div>${prog()}` };
      }
      if (role === 'split') {
        const left = s.side !== 'right';
        const img = `<div class="mwin" style="${left ? 'left:0' : 'right:0'}">${c.media('fill')}</div>`;
        const box = `<div class="box" style="top:170px;bottom:150px;justify-content:center;${left ? 'left:612px;right:64px' : 'left:72px;right:612px'}">${c.numeral('num')}${c.kicker('k')}${c.h1([[24, 58], [44, 50], [999, 42]])}${c.body('body', 'font-size:27px')}</div>`;
        const panel = left ? 'left:612px;right:64px' : 'left:72px;right:612px';
        const idx = `<div class="idx" style="${panel}">${String(c.index + 1).padStart(2, '0')}<span> / ${String(c.total).padStart(2, '0')}</span></div>`;
        const pg = prog().replace('class="prog"', `class="prog" style="${panel}"`);
        return { inner: img + idx + box + pg };
      }
      if (role === 'brand') {
        return { inner: `<div class="grid"></div>${head()}<div class="box" style="top:170px;bottom:150px;justify-content:center">${c.kicker('k')}${c.h1([[28, 92], [50, 78], [999, 64]])}${c.body()}</div>${prog()}` };
      }
      if (role === 'quote') {
        return { inner: `<div class="grid"></div>${head()}<div class="box" style="top:170px;bottom:150px;justify-content:center"><div class="qm">&ldquo;</div>${c.h1([[60, 62], [110, 52], [999, 44]])}${c.kicker('k')}</div>${prog()}` };
      }
      if (role === 'fact') {
        return { inner: `<div class="grid"></div>${head()}<div class="box" style="top:170px;bottom:150px;justify-content:center">${c.fig([[3, 340], [5, 250], [999, 180]])}<div class="k">${c.esc(s.headline || '')}</div>${c.body()}</div>${prog()}` };
      }
      if (role === 'photos') {
        return { inner: `<div class="ph" style="left:0;top:0;width:538px;height:860px">${c.photo(1)}</div>
          <div class="ph" style="left:546px;top:0;width:534px;height:426px">${c.photo(2)}</div>
          <div class="ph" style="left:546px;top:434px;width:534px;height:426px">${c.photo(3)}</div>
          <div class="box" style="top:910px;gap:22px">${c.kicker('k')}${c.h1([[30, 64], [60, 52], [999, 44]])}</div>${prog()}` };
      }
      return { inner: `<div class="grid"></div>${head()}<div class="box" style="top:170px;bottom:150px;justify-content:center">${c.h1([[28, 86], [50, 72], [999, 60]])}${c.body()}${c.brand.handle ? `<div class="btn">${c.esc(c.brand.handle)}</div>` : ''}</div>${prog()}` };
    },
  });

  // ---------------------------------------------------------------- Soft arch
  // Arch-shaped photo windows, pill labels, rounded cards on the warm second
  // neutral, centred serif type. Soft and spa-like, echoing the site's
  // rounded-card system.
  add({
    id: 'arch',
    label: 'Soft arch',
    description: 'Arched photo windows, pill labels and rounded cards on warm neutrals. Soft, feminine and calm.',
    css: `
.slide{background:var(--bg2)}
h1{color:var(--brand);line-height:1.08;text-align:center}
.pill{display:inline-block;border:2px solid var(--brand);color:var(--brand);border-radius:999px;padding:11px 28px;font-size:20px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}
.body{font-size:30px;line-height:1.55;color:var(--ink);text-align:center;max-width:29ch}
.stack{position:absolute;left:96px;right:96px;z-index:2;display:flex;flex-direction:column;align-items:center;gap:26px}
.circ{width:150px;height:150px;border-radius:50%;border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:300;font-size:70px;color:var(--brand)}
.card{position:absolute;left:72px;right:72px;top:80px;bottom:150px;background:var(--bg);border-radius:48px;z-index:1}
.footer{position:absolute;left:0;right:0;bottom:56px;text-align:center;font-size:17px;font-weight:600;letter-spacing:.34em;color:var(--muted);z-index:3}
.footer .f2{font-weight:400;opacity:.75}
.cover{--hole:var(--bg2)}
.cover .mwin{left:170px;top:90px;width:740px;height:770px;border-radius:370px 370px 0 0;background:var(--bg)}
.cover .stack{top:900px;gap:22px}
.split .mwin{top:150px;width:430px;height:1010px;border-radius:215px 215px 0 0;background:var(--bg)}
.split .stack{top:150px;bottom:190px;justify-content:center;gap:22px}
.split .stack h1,.split .stack .body{text-align:left}
.split .stack{align-items:flex-start}
.split .circ{width:120px;height:120px;font-size:56px}
.brand{background:var(--brand)}
.brand .arcline{position:absolute;left:150px;top:110px;width:780px;height:1180px;border:2px solid var(--gold);border-bottom:0;border-radius:390px 390px 0 0;opacity:.6;z-index:1}
.brand h1{color:#fff} .brand .pill{border-color:var(--gold);color:var(--gold)} .brand .body{color:rgba(255,255,255,.84)} .brand .footer{color:var(--gold)}
.quote .qm{font-family:var(--display);font-weight:300;font-size:220px;line-height:.6;height:100px;color:var(--accent)}
.quote h1{font-style:italic}
.cta .archfill{position:absolute;left:120px;top:110px;width:840px;height:1240px;border-radius:420px 420px 0 0;background:linear-gradient(170deg,var(--deep),var(--brand));z-index:1}
.cta .logo{width:260px}
.cta h1{color:#fff} .cta .body{color:rgba(255,255,255,.84)} .cta .pill{border-color:var(--gold);color:var(--gold);text-transform:none;letter-spacing:.08em;font-size:24px}
.cta .footer{color:var(--gold)}
.fact .ring{width:520px;height:520px;border-radius:50%;border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;background:var(--bg2)}
.fact .fig{font-family:var(--display);font-weight:300;line-height:1;color:var(--brand)}
.photos .ph{position:absolute;overflow:hidden;background:var(--bg);top:150px;width:290px;height:720px;border-radius:145px 145px 0 0}`,
    render(role, c) {
      const s = c.s;
      if (role === 'cover') {
        return { inner: `${c.hasMedia ? c.win() : '<div class="mwin" style="left:170px;top:90px;width:740px;height:770px;border-radius:370px 370px 0 0;background:var(--brand)"></div>'}
          <div class="stack">${c.kicker('pill')}${c.h1([[24, 84], [40, 72], [60, 62], [999, 52]])}${c.body()}</div>${c.footer()}` };
      }
      if (role === 'light') {
        return { inner: `<div class="card"></div><div class="stack" style="top:80px;bottom:150px;justify-content:center">${c.numeral('circ')}${c.kicker('pill')}${c.h1([[28, 74], [50, 64], [999, 54]])}${c.body()}</div>${c.footer()}` };
      }
      if (role === 'split') {
        const left = s.side !== 'right';
        const img = `<div class="mwin" style="${left ? 'left:72px' : 'right:72px'}">${c.media('fill')}</div>`;
        const st = `<div class="stack" style="${left ? 'left:556px;right:72px' : 'left:72px;right:556px'}">${c.numeral('circ')}${c.kicker('pill')}${c.h1([[24, 56], [44, 48], [999, 42]])}${c.body('body', 'font-size:27px')}</div>`;
        return { inner: img + st + c.footer() };
      }
      if (role === 'brand') {
        return { inner: `<div class="arcline"></div><div class="stack" style="top:300px;bottom:170px;justify-content:center">${c.kicker('pill')}${c.h1([[28, 86], [50, 72], [999, 60]])}${c.body()}</div>${c.footer()}` };
      }
      if (role === 'quote') {
        return { inner: `<div class="card"></div><div class="stack" style="top:80px;bottom:150px;justify-content:center"><div class="qm">&ldquo;</div>${c.h1([[60, 64], [110, 54], [999, 46]])}${c.kicker('pill')}</div>${c.footer()}` };
      }
      if (role === 'fact') {
        return { inner: `<div class="card"></div><div class="stack" style="top:80px;bottom:150px;justify-content:center"><div class="ring">${c.fig([[3, 220], [5, 150], [999, 110]])}</div>${c.h1([[28, 60], [50, 52], [999, 44]])}${c.body()}</div>${c.footer()}` };
      }
      if (role === 'photos') {
        return { inner: `<div class="ph" style="left:72px;top:190px">${c.photo(1)}</div>
          <div class="ph" style="left:395px;top:110px">${c.photo(2)}</div>
          <div class="ph" style="left:718px;top:190px">${c.photo(3)}</div>
          <div class="stack" style="top:960px;gap:20px">${c.kicker('pill')}${c.h1([[30, 62], [60, 52], [999, 44]])}</div>${c.footer()}` };
      }
      return { inner: `<div class="archfill"></div><div class="stack" style="top:250px;bottom:170px;justify-content:center"><img class="logo" src="${c.logoUrl}" alt="">${c.h1([[28, 80], [50, 68], [999, 56]])}${c.body()}${c.brand.handle ? `<div class="pill">${c.esc(c.brand.handle)}</div>` : ''}</div>${c.footer()}` };
    },
  });

  // ---------------------------------------------------------------- Bold statement
  // Dark and confident: oversized headlines anchored low, a thick gold rule,
  // giant outline numerals, duotone photos. Statement slides flip to light.
  add({
    id: 'statement',
    label: 'Bold statement',
    description: 'Deep navy, oversized headlines, outline numerals and duotone photos. Confident and high contrast.',
    css: `
.slide{background:linear-gradient(160deg,var(--deep),var(--brand))}
h1{font-weight:500;color:#fff;line-height:.98;letter-spacing:-.012em}
.bar{width:140px;height:10px;background:var(--gold);flex:0 0 auto}
.k{font-size:22px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--gold)}
.body{font-size:31px;line-height:1.5;color:rgba(255,255,255,.84);max-width:31ch}
.ghost{position:absolute;right:-24px;top:-70px;font-family:var(--display);font-weight:300;font-size:560px;line-height:1;color:transparent;-webkit-text-stroke:3px var(--gold);opacity:.5;z-index:1}
.count{position:absolute;top:66px;left:80px;font-size:22px;font-weight:600;letter-spacing:.22em;color:var(--gold);z-index:3}
.low{position:absolute;left:80px;right:80px;bottom:160px;z-index:3;display:flex;flex-direction:column;gap:30px}
.footer{position:absolute;left:80px;bottom:62px;font-size:17px;font-weight:600;letter-spacing:.34em;color:var(--gold);z-index:3}
.footer .f2{font-weight:400;opacity:.7}
.swipe{position:absolute;right:80px;bottom:56px;color:var(--gold);z-index:3}
.duo{filter:grayscale(1) contrast(1.05) brightness(1.15)}
.tone{position:absolute;inset:0;background:var(--brand);mix-blend-mode:multiply;opacity:.75;z-index:1}
.shade{position:absolute;inset:0;z-index:2;background:linear-gradient(180deg,transparent 30%,color-mix(in srgb,var(--deep) 92%,transparent) 88%)}
.cover{--hole:var(--deep)}
.cover .mwin{inset:0}
.tx .tone{mix-blend-mode:normal;opacity:.45}
.split .mwin{top:0;bottom:0;width:46%}
.split .low{bottom:170px}
.brand{background:var(--bg)}
.brand h1{color:var(--brand)} .brand .k{color:var(--brand)} .brand .bar{background:var(--accent)} .brand .body{color:var(--ink)}
.brand .count,.brand .footer,.brand .swipe{color:var(--muted)}
.quote .ghostq{position:absolute;left:40px;top:40px;font-family:var(--display);font-weight:300;font-size:640px;line-height:.8;color:transparent;-webkit-text-stroke:3px var(--gold);opacity:.45;z-index:1}
.quote h1{font-weight:300;font-style:italic;line-height:1.1}
.cta .logo{position:absolute;top:66px;left:80px;width:200px;z-index:3}
.cta .handle{font-size:34px;font-weight:600;letter-spacing:.06em;color:var(--gold);border-bottom:3px solid var(--gold);align-self:flex-start;padding-bottom:6px}
.fact .fig{font-family:var(--display);font-weight:500;line-height:.85;color:#fff;letter-spacing:-.02em}
.photos .ph{position:absolute;overflow:hidden}`,
    render(role, c) {
      const s = c.s;
      const count = () => `<div class="count">${c.pager}</div>`;
      const swipe = () => (c.isLast ? '' : `<div class="swipe">${c.arrow()}</div>`);
      if (role === 'cover') {
        const media = c.hasMedia ? c.win().replace('class="fill"', 'class="fill duo"') : '';
        return { inner: `${media}${c.hasMedia ? '<div class="tone"></div><div class="shade"></div>' : ''}${count()}
          <div class="low">${c.kicker('k')}${c.h1([[24, 128], [40, 108], [60, 90], [999, 74]])}<div class="bar"></div>${c.body()}</div>${c.footer()}${swipe()}` };
      }
      if (role === 'light') {
        return { inner: `${s.numeral ? `<div class="ghost">${c.esc(s.numeral)}</div>` : ''}${count()}<div class="low">${c.kicker('k')}${c.h1([[28, 104], [50, 86], [999, 70]])}<div class="bar"></div>${c.body()}</div>${c.footer()}${swipe()}` };
      }
      if (role === 'split') {
        const left = s.side !== 'right';
        const img = `<div class="mwin" style="${left ? 'left:0' : 'right:0'}">${c.media('fill duo')}<div class="tone"></div></div>`;
        const low = `<div class="low" style="${left ? 'left:560px;right:64px' : 'left:80px;right:560px'}">${s.numeral ? `<div class="k">${c.esc(s.numeral)}</div>` : ''}${c.kicker('k')}${c.h1([[24, 66], [44, 56], [999, 46]])}<div class="bar" style="width:100px;height:8px"></div>${c.body('body', 'font-size:27px')}</div>`;
        return { inner: img + low + (left ? '' : count()) + c.footer().replace('class="footer"', `class="footer" style="left:${left ? 560 : 80}px"`) + swipe() };
      }
      if (role === 'brand') {
        return { inner: `${count()}<div class="low">${c.kicker('k')}${c.h1([[28, 120], [50, 98], [999, 78]])}<div class="bar"></div>${c.body()}</div>${c.footer()}${swipe()}` };
      }
      if (role === 'quote') {
        return { inner: `<div class="ghostq">&ldquo;</div>${count()}<div class="low">${c.h1([[60, 80], [110, 66], [999, 54]])}<div class="bar"></div>${c.kicker('k')}</div>${c.footer()}${swipe()}` };
      }
      if (role === 'fact') {
        return { inner: `${count()}<div class="low">${c.fig([[3, 420], [5, 300], [999, 210]])}<div class="bar"></div><div class="k">${c.esc(s.headline || '')}</div>${c.body()}</div>${c.footer()}${swipe()}` };
      }
      if (role === 'photos') {
        return { inner: `<div class="ph" style="left:0;top:0;width:538px;height:1350px">${c.photo(1, 'fill duo')}<div class="tone"></div></div>
          <div class="ph" style="left:546px;top:0;width:534px;height:671px">${c.photo(2, 'fill duo')}<div class="tone"></div></div>
          <div class="ph" style="left:546px;top:679px;width:534px;height:671px">${c.photo(3, 'fill duo')}<div class="tone"></div></div>
          <div class="shade"></div>${count()}
          <div class="low">${c.kicker('k')}${c.h1([[30, 90], [60, 74], [999, 60]])}<div class="bar"></div></div>${c.footer()}${swipe()}` };
      }
      return { inner: `<img class="logo" src="${c.logoUrl}" alt=""><div class="low">${c.h1([[28, 104], [50, 86], [999, 70]])}<div class="bar"></div>${c.body()}${c.brand.handle ? `<div class="handle">${c.esc(c.brand.handle)}</div>` : ''}</div>${c.footer()}` };
    },
  });

  // ---------------------------------------------------------------- Seamless flow
  // One continuous gold line and soft shapes run across the whole carousel,
  // so each swipe visibly continues the last slide. Each slide draws its own
  // 1080px window onto one long canvas, which is why styles get index/total.
  const WAVE_Y = 1168;
  const waveY = (x) => WAVE_Y + 44 * Math.sin((2 * Math.PI * x) / 1500 + 0.7);
  // layer 'back': the soft circles, drawn behind photos; 'front': the line.
  function flowSvg(c, dark, layer) {
    // Video cover exported as a clip: the window is a hole onto the footage,
    // and a circle behind it would show through, so leave the circles out.
    if (layer === 'back' && c.hole) return '';
    const x0 = c.index * 1080;
    let d = '';
    for (let x = -20; x <= 1100; x += 20) d += `${d ? 'L' : 'M'}${x} ${waveY(x0 + x).toFixed(1)}`;
    let blobs = '';
    // A soft circle on every boundary between slides, half on each side.
    for (let k = 1; k < c.total; k++) {
      const cx = k * 1080 - x0;
      if (cx < -300 || cx > 1380) continue;
      const cy = k % 2 ? 210 : 1100;
      blobs += `<circle cx="${cx}" cy="${cy}" r="250" fill="${dark ? 'rgba(255,255,255,.06)' : 'var(--bg2)'}"/>`;
    }
    const end = c.isLast ? `<circle cx="1000" cy="${waveY(x0 + 1000).toFixed(1)}" r="12" fill="${dark ? 'var(--gold)' : 'var(--accent)'}"/>` : '';
    const line = c.isLast ? d.split('L').filter((_, i) => i * 20 - 20 <= 1000).join('L') : d;
    const content = layer === 'back' ? blobs : `<path d="${line}" fill="none" stroke="${dark ? 'var(--gold)' : 'var(--accent)'}" stroke-width="3"/>${end}`;
    return `<svg class="flow ${layer}" width="1080" height="1350" viewBox="0 0 1080 1350" aria-hidden="true">${content}</svg>`;
  }
  add({
    id: 'flow',
    label: 'Seamless flow',
    description: 'A gold line and soft shapes run unbroken from slide to slide, inviting the swipe. Light and elegant.',
    css: `
.slide{background:var(--bg)}
.flow{position:absolute;inset:0;z-index:1}
.flow.back{z-index:0}
h1{color:var(--brand);line-height:1.06}
.k{font-size:22px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
.body{font-size:31px;line-height:1.52;color:var(--ink);max-width:31ch}
.n{font-family:var(--display);font-weight:300;font-size:170px;line-height:.85;color:var(--accent)}
.txt{position:absolute;left:84px;right:84px;z-index:3;display:flex;flex-direction:column;gap:26px}
.footer{position:absolute;left:84px;bottom:60px;font-size:16px;font-weight:600;letter-spacing:.34em;color:var(--muted);z-index:3}
.footer .f2{font-weight:400;opacity:.75}
.swipe{position:absolute;right:84px;bottom:52px;display:flex;align-items:center;gap:12px;font-size:18px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--brand);z-index:3}
.cover{--hole:var(--bg)}
.cover .mwin{left:400px;top:60px;width:720px;height:720px;border-radius:50%;background:var(--bg2)}
.cover .txt{top:810px;gap:20px}
.cover h1{text-shadow:0 0 30px var(--bg),0 0 12px var(--bg)}
.split .mwin{top:120px;width:440px;height:960px;border-radius:220px;background:var(--bg2)}
.brand{background:linear-gradient(160deg,var(--deep),var(--brand))}
.brand h1{color:#fff} .brand .k{color:var(--gold)} .brand .body{color:rgba(255,255,255,.84)}
.brand .footer,.brand .swipe{color:var(--gold)}
.quote .qm{font-family:var(--display);font-weight:300;font-size:240px;line-height:.6;height:100px;color:var(--accent)}
.quote h1{font-style:italic;line-height:1.14}
.cta .handle{align-self:flex-start;border-radius:999px;border:2px solid var(--brand);padding:16px 36px;font-size:26px;font-weight:600;letter-spacing:.08em;color:var(--brand)}
.fact .fig{font-family:var(--display);font-weight:300;line-height:.85;color:var(--accent)}
.photos .ph{position:absolute;overflow:hidden;border-radius:50%;background:var(--bg2);z-index:2}`,
    render(role, c) {
      const s = c.s;
      const swipe = () => (c.isLast ? '' : `<div class="swipe">Swipe ${c.arrow()}</div>`);
      if (role === 'cover') {
        return { inner: `${flowSvg(c, false, 'back')}${c.hasMedia ? c.win() : '<div class="mwin" style="left:400px;top:60px;width:720px;height:720px;border-radius:50%;background:var(--brand)"></div>'}${flowSvg(c, false, 'front')}
          <div class="txt">${c.kicker('k')}${c.h1([[24, 96], [40, 82], [60, 70], [999, 58]])}${c.body()}</div>${c.footer()}${swipe()}` };
      }
      if (role === 'light') {
        return { inner: `${flowSvg(c, false, 'back')}${flowSvg(c, false, 'front')}<div class="txt" style="top:150px;bottom:240px;justify-content:center">${c.numeral('n')}${c.kicker('k')}${c.h1([[28, 82], [50, 70], [999, 58]])}${c.body()}</div>${c.footer()}${swipe()}` };
      }
      if (role === 'split') {
        const left = s.side !== 'right';
        const img = `<div class="mwin" style="${left ? 'left:72px' : 'right:72px'}">${c.media('fill')}</div>`;
        const txt = `<div class="txt" style="top:150px;bottom:240px;justify-content:center;${left ? 'left:568px;right:64px' : 'left:84px;right:568px'}">${c.numeral('n', 'font-size:120px')}${c.kicker('k')}${c.h1([[24, 58], [44, 50], [999, 42]])}${c.body('body', 'font-size:27px')}</div>`;
        return { inner: flowSvg(c, false, 'back') + img + flowSvg(c, false, 'front') + txt + c.footer() + swipe() };
      }
      if (role === 'brand') {
        return { inner: `${flowSvg(c, true, 'back')}${flowSvg(c, true, 'front')}<div class="txt" style="top:150px;bottom:240px;justify-content:center">${c.kicker('k')}${c.h1([[28, 90], [50, 76], [999, 62]])}${c.body()}</div>${c.footer()}${swipe()}` };
      }
      if (role === 'quote') {
        return { inner: `${flowSvg(c, false, 'back')}${flowSvg(c, false, 'front')}<div class="txt" style="top:150px;bottom:240px;justify-content:center"><div class="qm">&ldquo;</div>${c.h1([[60, 66], [110, 56], [999, 46]])}${c.kicker('k')}</div>${c.footer()}${swipe()}` };
      }
      if (role === 'fact') {
        return { inner: `${flowSvg(c, false, 'back')}${flowSvg(c, false, 'front')}<div class="txt" style="top:150px;bottom:240px;justify-content:center">${c.fig([[3, 330], [5, 250], [999, 180]])}${c.h1([[28, 64], [50, 54], [999, 46]])}${c.body()}</div>${c.footer()}${swipe()}` };
      }
      if (role === 'photos') {
        return { inner: `${flowSvg(c, false, 'back')}<div class="ph" style="left:60px;top:150px;width:540px;height:540px">${c.photo(1)}</div>
          <div class="ph" style="left:560px;top:80px;width:420px;height:420px">${c.photo(2)}</div>
          <div class="ph" style="left:600px;top:470px;width:360px;height:360px">${c.photo(3)}</div>
          ${flowSvg(c, false, 'front')}<div class="txt" style="top:840px;gap:18px">${c.kicker('k')}${c.h1([[30, 62], [60, 52], [999, 44]])}</div>${c.footer()}${swipe()}` };
      }
      return { inner: `${flowSvg(c, false, 'back')}${flowSvg(c, false, 'front')}<div class="txt" style="top:150px;bottom:240px;justify-content:center">${c.h1([[28, 88], [50, 74], [999, 62]])}${c.body()}${c.brand.handle ? `<div class="handle">${c.esc(c.brand.handle)}</div>` : ''}</div>${c.footer()}${swipe()}` };
    },
  });

  // ---------------------------------------------------------------- Gallery
  // After Marp's MIT "border" theme and Apple Basic's photo layouts: the
  // whole slide is a framed mount. A navy outer frame, a warm mat, photos
  // set in white boards with a gold hairline like framed prints, and text
  // set like a museum wall label with a catalogue number.
  add({
    id: 'gallery',
    label: 'Gallery',
    description: 'Framed like prints on a gallery wall: a navy frame, warm mat, photos in white mounts and museum-label text. Polished and premium.',
    css: `
.slide{background:var(--bg2)}
.outer{position:absolute;inset:0;border:26px solid var(--brand);z-index:5;pointer-events:none}
.board{position:absolute;border:30px solid var(--bg);z-index:2;box-shadow:0 14px 34px rgba(0,0,0,.12)}
.board::after{content:'';position:absolute;inset:0;border:2px solid color-mix(in srgb,var(--accent) 70%,transparent)}
.label{position:absolute;z-index:3;background:var(--bg);border:1px solid var(--line);padding:56px 60px;display:flex;flex-direction:column;gap:22px;box-shadow:0 10px 26px rgba(0,0,0,.08)}
.cat{display:flex;justify-content:space-between;align-items:baseline;font-size:19px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--line);padding-bottom:16px}
.cat b{font-weight:600;color:var(--brand)}
h1{color:var(--brand);line-height:1.08}
.k{font-size:20px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--brand)}
.body{font-size:29px;line-height:1.55;color:var(--ink)}
.n{font-family:var(--display);font-weight:300;font-size:120px;line-height:.85;color:var(--accent)}
.footer{position:absolute;left:0;right:0;bottom:52px;text-align:center;font-size:16px;font-weight:600;letter-spacing:.34em;color:var(--muted);z-index:6}
.footer .f2{font-weight:400;opacity:.75}
.cover{--hole:var(--bg2)}
.cover .label{left:110px;right:110px;top:880px;bottom:120px;padding:40px 56px;gap:16px;justify-content:center}
.brand .inner{position:absolute;inset:26px;background:var(--brand);z-index:1}
.brand .inner::after{content:'';position:absolute;inset:40px;border:2px solid color-mix(in srgb,var(--gold) 70%,transparent)}
.brand .stack{position:absolute;left:150px;right:150px;top:200px;bottom:200px;z-index:3;display:flex;flex-direction:column;justify-content:center;gap:28px}
.brand h1{color:#fff} .brand .k{color:var(--gold)} .brand .body{color:rgba(255,255,255,.84)} .brand .footer{color:var(--gold)}
.brand .footer{bottom:100px}
.quote h1{font-style:italic;line-height:1.14}
.quote .qm{font-family:var(--display);font-weight:300;font-size:200px;line-height:.55;height:80px;color:var(--accent)}
.fact .fig{font-family:var(--display);font-weight:300;line-height:.85;color:var(--brand)}
.cta .handle{align-self:flex-start;border:2px solid var(--brand);padding:16px 34px;font-size:25px;font-weight:600;letter-spacing:.1em;color:var(--brand)}`,
    render(role, c) {
      const s = c.s;
      const cat = (left) => `<div class="cat"><span>${c.esc(left || c.brand.footer.text)}</span><b>No. ${String(c.index + 1).padStart(2, '0')}</b></div>`;
      const board = (x, y, w, h) => `<div class="board" style="left:${x - 30}px;top:${y - 30}px;width:${w + 60}px;height:${h + 60}px"></div>`;
      const frame = `<div class="outer"></div>`;
      if (role === 'cover') {
        const [x, y, w, h] = [140, 130, 800, 680];
        const win = c.hasMedia ? c.win('', `left:${x}px;top:${y}px;width:${w}px;height:${h}px`) : `<div class="mwin" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:var(--brand)"></div>`;
        return { inner: `${win}${board(x, y, w, h)}<div class="label">${c.kicker('k')}${c.h1([[24, 74], [40, 64], [60, 54], [999, 46]])}${c.body('body', 'font-size:26px')}</div>${frame}` };
      }
      const labelBox = (inner, pos) => `<div class="label" style="${pos || 'left:110px;right:110px;top:150px;bottom:170px;justify-content:center'}">${inner}</div>`;
      if (role === 'light') {
        return { inner: labelBox(`${cat(s.kicker)}${c.numeral('n')}${c.h1([[28, 74], [50, 64], [999, 54]])}${c.body()}`) + frame + c.footer() };
      }
      if (role === 'split') {
        const left = s.side !== 'right';
        const [x, y, w, h] = [left ? 110 : 600, 170, 370, 1000];
        const img = `<div class="mwin" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${c.media('fill')}</div>${board(x, y, w, h)}`;
        const box = labelBox(`${cat(s.kicker)}${c.numeral('n', 'font-size:90px')}${c.h1([[24, 52], [44, 46], [999, 40]])}${c.body('body', 'font-size:25px')}`,
          `${left ? 'left:540px;right:100px' : 'left:100px;right:540px'};top:300px;bottom:300px;padding:40px 40px;justify-content:center`);
        return { inner: img + box + frame + c.footer() };
      }
      if (role === 'brand') {
        return { inner: `<div class="inner"></div><div class="stack">${c.kicker('k')}${c.h1([[28, 86], [50, 72], [999, 60]])}${c.body()}</div>${frame}${c.footer()}` };
      }
      if (role === 'quote') {
        return { inner: labelBox(`<div class="qm">&ldquo;</div>${c.h1([[60, 62], [110, 52], [999, 44]])}${c.kicker('k')}`) + frame + c.footer() };
      }
      if (role === 'fact') {
        return { inner: labelBox(`${cat()}${c.fig([[3, 300], [5, 220], [999, 160]])}<div class="k">${c.esc(s.headline || '')}</div>${c.body()}`) + frame + c.footer() };
      }
      if (role === 'photos') {
        const ph = (n, x, y, w, h) => `<div class="mwin" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${c.photo(n)}</div>${board(x, y, w, h)}`;
        return { inner: `${ph(1, 120, 130, 420, 620)}${ph(2, 610, 130, 350, 270)}${ph(3, 610, 480, 350, 270)}
          ${labelBox(`${c.kicker('k')}${c.h1([[30, 56], [60, 48], [999, 40]])}`, 'left:110px;right:110px;top:860px;bottom:150px;padding:36px 56px;justify-content:center')}${frame}${c.footer()}` };
      }
      return { inner: labelBox(`${cat()}${c.h1([[28, 80], [50, 68], [999, 56]])}${c.body()}${c.brand.handle ? `<div class="handle">${c.esc(c.brand.handle)}</div>` : ''}`) + frame + c.footer() };
    },
  });

  const byId = new Map(styles.map((s) => [s.id, s]));
  const api = {
    list: styles.map(({ id, label, description }) => ({ id, label, description })),
    get: (id) => byId.get(id) || byId.get('classic'),
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SlideStyles = api;
})(typeof self !== 'undefined' ? self : this);
