// app.js — the editor. Plain DOM, no framework. State is one campaign object
// in memory, saved to disk (debounced) after every edit.
/* global Slides, Lint, Outline */
'use strict';

const $ = (id) => document.getElementById(id);
const api = window.studio;

const state = {
  brand: null, lintRules: null, pillars: [], models: [],
  campaigns: [], campaign: null, postId: null, slideIdx: 0,
  media: [], settings: null,
  mediaSlot: 'media', // which photo the media grid fills on a Three photos slide
};

// ---------------------------------------------------------------- helpers

function toast(msg, isErr) {
  const t = $('toast');
  t.textContent = msg;
  t.className = isErr ? 'err' : '';
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { t.hidden = true; }, isErr ? 7000 : 3500);
}

function busy(text) {
  $('busy').hidden = !text;
  if (text) $('busyText').textContent = text;
}

function el(tag, attrs, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') n.className = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else if (v !== undefined && v !== null && v !== false) n.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null) n.append(kid.nodeType ? kid : document.createTextNode(kid));
  return n;
}

const post = () => state.campaign && state.campaign.posts.find((p) => p.id === state.postId);
const slide = () => { const p = post(); return p && p.slides[state.slideIdx]; };
const newId = () => Math.random().toString(36).slice(2, 10);
const mediaUrl = (ref) => Slides.assetUrl(ref);
const placeOf = (p, i, style) => ({ style: style || p.style || Slides.DEFAULT_STYLE, index: i, total: p.slides.length });

// A slide drawn into a box of the given width (scaled iframe). place carries
// the post's style and the slide's position (see placeOf).
function thumb(s, width, live, place) {
  const { w, h } = Slides.sizeOf(place && place.style);
  const scale = width / w;
  const box = el('div', { class: 'thumb', style: `width:${width}px;height:${Math.round(h * scale)}px` });
  const f = el('iframe', { tabindex: '-1', 'aria-hidden': 'true', style: `width:${w}px;height:${h}px;transform:scale(${scale})` });
  f.srcdoc = Slides.slideHtml(s, state.brand, { live: !!live, ...(place || {}) });
  box.append(f);
  return box;
}

// ---------------------------------------------------------------- saving

let saveTimer = null;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 500);
}
async function saveNow() {
  clearTimeout(saveTimer);
  if (!state.campaign) return;
  const saved = await api.campaigns.save(state.campaign);
  state.campaign.id = saved.id;
  state.campaign.updated = saved.updated;
  const i = state.campaigns.findIndex((c) => c.id === saved.id);
  if (i >= 0) state.campaigns[i] = state.campaign; else state.campaigns.unshift(state.campaign);
}

// ---------------------------------------------------------------- sidebar

function renderSidebar() {
  const list = $('campaignList');
  list.innerHTML = '';
  for (const c of state.campaigns) {
    const on = state.campaign && c.id === state.campaign.id;
    const wrap = el('div', { class: `camp${on ? ' on' : ''}` },
      el('button', { onclick: () => openCampaign(c.id) }, c.name || 'Untitled campaign'));
    if (on && c.posts.length) {
      wrap.append(el('div', { class: 'posts' }, c.posts.map((p) =>
        el('button', { class: p.id === state.postId ? 'on' : '', onclick: () => openPost(p.id) }, p.title || 'Untitled post'))));
    }
    list.append(wrap);
  }
}

function showPane(id) {
  for (const p of ['empty', 'campaignPane', 'postPane']) $(p).hidden = p !== id;
}

// ---------------------------------------------------------------- campaign

async function openCampaign(id) {
  await saveNow();
  state.campaign = await api.campaigns.get(id);
  state.postId = null;
  renderCampaign();
}

function renderCampaign() {
  const c = state.campaign;
  showPane('campaignPane');
  $('campaignName').value = c.name || '';
  $('campaignTopic').value = c.topic || '';
  $('campaignPillar').value = c.pillar || '';
  $('campaignBrief').value = c.brief || '';
  const hasKey = state.settings && state.settings.apiKey;
  $('draftWithClaude').disabled = !hasKey;
  $('draftNote').textContent = hasKey ? '' : 'Add an API key in Settings to use this.';
  const cards = $('postCards');
  cards.innerHTML = '';
  if (!c.posts.length) cards.append(el('p', { class: 'note' }, 'No posts yet. Make one from the content above.'));
  for (const p of c.posts) {
    const issues = Lint.lintPost(state.lintRules, p, Slides.slideText).filter((i) => i.level === 'error').length;
    cards.append(el('button', { class: 'post-card', onclick: () => openPost(p.id) },
      p.slides[0] ? thumb(p.slides[0], 190, false, placeOf(p, 0)) : el('div', { class: 'thumb', style: 'width:190px;height:237px' }),
      el('div', { class: 'meta' }, el('strong', {}, p.title || 'Untitled post'),
        el('span', {}, `${p.slides.length} slides${issues ? ` · ${issues} to fix` : ''}`))));
  }
  renderSidebar();
}

function bindCampaignFields() {
  $('campaignName').addEventListener('input', (e) => { state.campaign.name = e.target.value; scheduleSave(); renderSidebar(); });
  $('campaignTopic').addEventListener('change', (e) => { state.campaign.topic = e.target.value; scheduleSave(); });
  $('campaignPillar').addEventListener('change', (e) => { state.campaign.pillar = e.target.value; scheduleSave(); });
  $('campaignBrief').addEventListener('input', (e) => { state.campaign.brief = e.target.value; scheduleSave(); });

  $('buildFromBrief').addEventListener('click', () => {
    const text = state.campaign.brief || '';
    if (!text.trim()) return toast('Write or paste the campaign content first.', true);
    const firstImage = state.media.find((m) => m.kind === 'image');
    const slides = Outline.outlineToSlides(text, state.brand, {
      coverMedia: firstImage ? { ref: firstImage.ref, kind: 'image' } : null,
    });
    if (slides.length < 2) return toast('Put an empty line between slides so each block becomes its own slide.', true);
    addPost({ title: slides[0].headline || 'New post', slides, caption: { instagram: '', facebook: '' } });
  });

  $('draftWithClaude').addEventListener('click', async () => {
    const c = state.campaign;
    if (!(c.brief || '').trim()) return toast('Write the campaign brief first.', true);
    busy('Claude is drafting the slides and captions');
    try {
      const d = await api.draft({ brief: c.brief, topic: c.topic, pillar: c.pillar, slideCount: $('draftCount').value });
      const cover = d.slides.find((s) => s.template === 'cover');
      const firstImage = state.media.find((m) => m.kind === 'image');
      if (cover && firstImage) cover.media = { ref: firstImage.ref, kind: 'image' };
      addPost({ title: d.title || 'Claude draft', slides: d.slides, caption: d.caption });
      toast('Draft ready. Read it through and check the Compliance tab before exporting.');
    } catch (err) {
      toast(cleanErr(err), true);
    } finally {
      busy(null);
    }
  });

  $('deleteCampaign').addEventListener('click', async () => {
    if (!(await api.campaigns.remove(state.campaign.id))) return;
    state.campaigns = state.campaigns.filter((c) => c.id !== state.campaign.id);
    state.campaign = null;
    renderSidebar();
    showPane('empty');
  });
}

async function newCampaign() {
  await saveNow();
  state.campaign = {
    id: null, name: 'New campaign', topic: state.brand.topics[0] ? state.brand.topics[0].id : '',
    pillar: state.pillars[0] ? state.pillars[0].id : '', brief: '', posts: [], created: new Date().toISOString(),
  };
  state.postId = null;
  await saveNow();
  renderCampaign();
  $('campaignName').select();
}

function addPost(p) {
  // A new post starts in the style the campaign's latest post uses.
  const last = state.campaign.posts[state.campaign.posts.length - 1];
  const np = { id: newId(), style: (last && last.style) || Slides.DEFAULT_STYLE, ...p };
  state.campaign.posts.push(np);
  scheduleSave();
  openPost(np.id);
}

// ---------------------------------------------------------------- post editor

function openPost(id) {
  state.postId = id;
  state.slideIdx = 0;
  showPane('postPane');
  $('backName').textContent = state.campaign.name || 'Campaign';
  $('postTitle').value = post().title || '';
  const cap = post().caption || (post().caption = { instagram: '', facebook: '' });
  $('capIg').value = cap.instagram || '';
  $('capFb').value = cap.facebook || '';
  renderSidebar();
  renderPost();
}

function renderPost() {
  renderStrip();
  renderPreview();
  renderInspector();
  if (!$('styleList').closest('.tab-body').hidden) renderStyles();
  renderLint();
}

// The Style tab: her own post shown in every style (cover plus the slide
// she's on), so she chooses by seeing her content, not a generic sample.
function renderStyles() {
  const p = post();
  const list = $('styleList');
  list.innerHTML = '';
  const current = p.style || Slides.DEFAULT_STYLE;
  const second = state.slideIdx > 0 ? state.slideIdx : Math.min(1, p.slides.length - 1);
  for (const st of Slides.STYLES) {
    const shots = [0, second].filter((v, i, a) => a.indexOf(v) === i)
      .map((i) => thumb(p.slides[i], 128, false, placeOf(p, i, st.id)));
    list.append(el('button', {
      class: `style-card${st.id === current ? ' on' : ''}`,
      onclick: () => { p.style = st.id; scheduleSave(); renderPost(); toast(`${st.label} applied to every slide`); },
    }, el('div', { class: 'style-shots' }, shots),
    el('strong', {}, st.label, st.id === current ? el('span', { class: 'cur' }, 'In use') : null),
    el('span', {}, st.description)));
  }
}

function renderStrip() {
  const strip = $('strip');
  strip.innerHTML = '';
  const p = post();
  p.slides.forEach((s, i) => {
    const flagged = Lint.lintText(state.lintRules, Slides.slideText(s)).some((x) => x.level === 'error');
    strip.append(el('button', { class: `slot${i === state.slideIdx ? ' on' : ''}`, title: `Slide ${i + 1}`, onclick: () => { state.slideIdx = i; state.mediaSlot = 'media'; renderPost(); } },
      el('span', { class: 'n' }, String(i + 1)), flagged ? el('span', { class: 'flag', title: 'Has something to fix' }) : null, thumb(s, 104, false, placeOf(p, i))));
  });
  if (p.slides.length < 10) {
    strip.append(el('button', { class: 'add', onclick: addSlide }, '+ Add slide'));
  }
}

function refreshCurrentThumb() {
  const slot = $('strip').children[state.slideIdx];
  if (!slot) return;
  const old = slot.querySelector('.thumb');
  old.replaceWith(thumb(slide(), 104, false, placeOf(post(), state.slideIdx)));
  const flagged = Lint.lintText(state.lintRules, Slides.slideText(slide())).some((x) => x.level === 'error');
  const f = slot.querySelector('.flag');
  if (flagged && !f) slot.append(el('span', { class: 'flag', title: 'Has something to fix' }));
  if (!flagged && f) f.remove();
}

function fitPreview() {
  const stage = document.querySelector('.stage');
  const frame = document.querySelector('.preview-frame');
  const { w, h } = Slides.sizeOf(post() && post().style);
  const maxH = stage.clientHeight - 70;
  const maxW = stage.clientWidth - 40;
  const scale = Math.max(0.2, Math.min(maxH / h, maxW / w));
  frame.style.width = `${Math.round(w * scale)}px`;
  frame.style.height = `${Math.round(h * scale)}px`;
  $('preview').style.width = `${w}px`;
  $('preview').style.height = `${h}px`;
  $('preview').style.transform = `scale(${scale})`;
}

function renderPreview() {
  const s = slide();
  if (!s) return;
  $('preview').srcdoc = Slides.slideHtml(s, state.brand, { live: true, ...placeOf(post(), state.slideIdx) });
  fitPreview();
  $('moveLeft').disabled = state.slideIdx === 0;
  $('moveRight').disabled = state.slideIdx === post().slides.length - 1;
  $('delSlide').disabled = post().slides.length <= 1;
}

let previewTimer = null;
function slideChanged() {
  scheduleSave();
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => { renderPreview(); refreshCurrentThumb(); renderLint(); if (!$('styleList').closest('.tab-body').hidden) renderStyles(); }, 120);
}

function renderInspector() {
  const s = slide();
  if (!s) return;
  const tpl = Slides.TEMPLATES.find((t) => t.id === s.template) || Slides.TEMPLATES[0];
  $('tplSelect').value = tpl.id;
  $('tplHint').textContent = tpl.hint;

  const fields = $('fields');
  fields.innerHTML = '';
  for (const f of tpl.fields) {
    if (f === 'items') { fields.append(itemsEditor(s, tpl)); continue; }
    const limit = Slides.FIELD_LIMITS[f];
    const label = (tpl.labels && tpl.labels[f]) || Slides.FIELD_LABELS[f];
    const count = el('span', { class: 'count' });
    const setCount = () => {
      const n = (s[f] || '').length;
      count.textContent = `${n}/${limit}`;
      count.classList.toggle('over', n > limit);
    };
    const input = f === 'body' || f === 'note' || (f === 'headline' && tpl.id === 'quote')
      ? el('textarea', { rows: f === 'body' ? 4 : 2 })
      : el('input', { type: 'text' });
    input.value = s[f] || '';
    input.addEventListener('input', () => { s[f] = input.value; setCount(); slideChanged(); });
    setCount();
    fields.append(el('label', {}, label, count, input));
  }

  $('mediaBlock').hidden = !tpl.media;
  if (tpl.media) renderMediaGrid();
}

// The points on an Icon list or Icon row slide: icon, point, optional detail.
function itemsEditor(s, tpl) {
  if (!Array.isArray(s.items)) s.items = [];
  const wrap = el('div', { class: 'items' }, el('div', { class: 'sub-head' }, el('span', {}, 'Points'),
    el('span', { class: 'note' }, 'Use *stars* round words to put them in italics')));
  // Icons grouped as in the suite: face and body, skin, treatments, results, care.
  const iconOptions = (cur) => {
    const groups = {};
    for (const [name, i] of Object.entries(Slides.ICONS)) (groups[i.group] = groups[i.group] || []).push([name, i]);
    const current = Slides.ICONS[cur] ? cur : (Slides.ICON_ALIASES[cur] || 'check');
    return Object.entries(groups).map(([g, list]) => el('optgroup', { label: g },
      list.map(([name, i]) => el('option', { value: name, selected: name === current }, i.label))));
  };
  s.items.forEach((it, i) => {
    const icon = el('select', { title: 'Icon' }, iconOptions(it.icon));
    icon.addEventListener('change', () => { it.icon = icon.value; slideChanged(); });
    const title = el('input', { type: 'text', placeholder: 'Point', maxlength: '60' });
    title.value = it.title || '';
    title.addEventListener('input', () => { it.title = title.value; slideChanged(); });
    const row = el('div', { class: 'item' }, icon, title);
    if (tpl.itemFields.includes('text')) {
      const text = el('input', { type: 'text', placeholder: 'Detail (optional)', maxlength: '80' });
      text.value = it.text || '';
      text.addEventListener('input', () => { it.text = text.value; slideChanged(); });
      row.append(text);
    }
    row.append(el('button', { class: 'ghost small danger', title: 'Remove this point', onclick: () => { s.items.splice(i, 1); slideChanged(); renderInspector(); } }, 'Remove'));
    wrap.append(row);
  });
  if (s.items.length < (tpl.maxItems || 6)) {
    wrap.append(el('button', { class: 'ghost small', onclick: () => { s.items.push({ icon: 'check', title: '' }); slideChanged(); renderInspector(); } }, '+ Add point'));
  }
  return wrap;
}

const SLOTS = [['media', 'Photo 1'], ['media2', 'Photo 2'], ['media3', 'Photo 3']];
function slotKey() {
  const s = slide();
  return s && s.template === 'photos' ? state.mediaSlot : 'media';
}

function renderMediaGrid() {
  const s = slide();
  const key = slotKey();
  const slots = $('mediaSlots');
  slots.innerHTML = '';
  slots.hidden = s.template !== 'photos';
  if (s.template === 'photos') {
    for (const [k, label] of SLOTS) {
      slots.append(el('button', { class: `chip${k === key ? ' on' : ''}`, onclick: () => { state.mediaSlot = k; renderMediaGrid(); } }, label));
    }
  }
  const grid = $('mediaGrid');
  grid.innerHTML = '';
  const cur = s[key];
  const current = cur && cur.ref;
  grid.append(el('button', { class: !current ? 'on' : '', title: 'No photo', onclick: () => { s[key] = null; slideChanged(); renderMediaGrid(); } },
    el('span', { class: 'none' }, 'None')));
  for (const m of state.media) {
    grid.append(el('button', {
      class: m.ref === current ? 'on' : '', title: m.name,
      onclick: () => {
        s[key] = { ref: m.ref, kind: m.kind, poster: m.poster || null, focusX: 0.5, focusY: 0.5 };
        if (key === 'media' && m.kind === 'video' && m.duration && !s.duration) s.duration = Math.min(8, Math.max(3, Math.round(m.duration)));
        slideChanged(); renderMediaGrid();
      },
    }, el('img', { src: mediaUrl(m.kind === 'video' ? m.poster : m.ref), loading: 'lazy', alt: '' }),
    m.kind === 'video' ? el('span', { class: 'vid' }, m.duration ? `${Math.round(m.duration)}s` : 'video') : null));
  }
  const has = !!current;
  $('mediaAdjust').hidden = !has;
  $('sideRow').hidden = s.template !== 'split';
  $('durRow').hidden = !(has && cur.kind === 'video' && s.template === 'cover');
  if (has) {
    $('focusX').value = cur.focusX != null ? cur.focusX : 0.5;
    $('focusY').value = cur.focusY != null ? cur.focusY : 0.5;
    $('sideSelect').value = s.side || 'left';
    $('durInput').value = s.duration || '';
  }
}

function bindInspector() {
  const sel = $('tplSelect');
  for (const t of Slides.TEMPLATES) sel.append(el('option', { value: t.id }, t.label));
  sel.addEventListener('change', () => {
    const s = slide();
    s.template = sel.value;
    const tpl = Slides.TEMPLATES.find((t) => t.id === s.template);
    // Fill empty photo slots with library images so the layout shows at once.
    const images = state.media.filter((m) => m.kind === 'image');
    const used = new Set(SLOTS.map(([k]) => s[k] && s[k].ref).filter(Boolean));
    // Optional photos (Statement, Icon list) start empty; she adds one if wanted.
    const slotsNeeded = tpl.media === 3 ? SLOTS.map(([k]) => k) : tpl.media === true ? ['media'] : [];
    if ((s.template === 'list' || s.template === 'row') && !Array.isArray(s.items)) {
      s.items = [{ icon: 'check', title: 'First point' }, { icon: 'check', title: 'Second point' }, { icon: 'check', title: 'Third point' }];
    }
    for (const k of slotsNeeded) {
      if (s[k]) continue;
      const img = images.find((m) => !used.has(m.ref));
      if (!img) break;
      used.add(img.ref);
      s[k] = { ref: img.ref, kind: 'image', focusX: 0.5, focusY: 0.5 };
    }
    state.mediaSlot = 'media';
    slideChanged();
    renderInspector();
  });
  $('focusX').addEventListener('input', (e) => { slide()[slotKey()].focusX = Number(e.target.value); slideChanged(); });
  $('focusY').addEventListener('input', (e) => { slide()[slotKey()].focusY = Number(e.target.value); slideChanged(); });
  $('sideSelect').addEventListener('change', (e) => { slide().side = e.target.value; slideChanged(); });
  $('durInput').addEventListener('input', (e) => { slide().duration = Number(e.target.value) || null; scheduleSave(); });
  $('importMedia').addEventListener('click', async () => {
    busy('Adding to your library');
    try { state.media = await api.media.import(); } finally { busy(null); }
    renderMediaGrid();
  });

  document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => showTab(t.dataset.tab)));

  $('capIg').addEventListener('input', (e) => { post().caption.instagram = e.target.value; capCount(); scheduleSave(); renderLintSoon(); });
  $('capFb').addEventListener('input', (e) => { post().caption.facebook = e.target.value; scheduleSave(); renderLintSoon(); });
  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    await navigator.clipboard.writeText($(b.dataset.copy).value);
    toast('Copied');
  }));

  $('postTitle').addEventListener('input', (e) => { post().title = e.target.value; scheduleSave(); renderSidebar(); });
  $('backToCampaign').addEventListener('click', async () => { await saveNow(); state.postId = null; renderCampaign(); });

  $('moveLeft').addEventListener('click', () => moveSlide(-1));
  $('moveRight').addEventListener('click', () => moveSlide(1));
  $('dupSlide').addEventListener('click', () => {
    const p = post();
    if (p.slides.length >= 10) return toast('Instagram carousels allow up to 10 slides.', true);
    p.slides.splice(state.slideIdx + 1, 0, JSON.parse(JSON.stringify(slide())));
    state.slideIdx++;
    scheduleSave(); renderPost();
  });
  $('delSlide').addEventListener('click', () => {
    const p = post();
    if (p.slides.length <= 1) return;
    p.slides.splice(state.slideIdx, 1);
    state.slideIdx = Math.max(0, state.slideIdx - 1);
    scheduleSave(); renderPost();
  });
}

function showTab(name) {
  document.querySelectorAll('.tab').forEach((x) => x.classList.toggle('on', x.dataset.tab === name));
  document.querySelectorAll('.tab-body').forEach((b) => { b.hidden = b.dataset.body !== name; });
  if (name === 'captions') capCount();
  if (name === 'style') renderStyles();
}

function capCount() {
  const v = $('capIg').value;
  const hook = v.split('\n')[0] || '';
  $('igCount').textContent = `${v.length} characters · first line ${hook.length}/125`;
}

function addSlide() {
  const p = post();
  const lightCount = p.slides.filter((s) => s.template === 'light' || s.template === 'split').length;
  const at = p.slides.length && p.slides[p.slides.length - 1].template === 'cta' ? p.slides.length - 1 : p.slides.length;
  p.slides.splice(at, 0, { template: 'light', numeral: String(lightCount + 1).padStart(2, '0'), kicker: '', headline: 'New slide', body: '' });
  state.slideIdx = at;
  scheduleSave(); renderPost();
}

function moveSlide(d) {
  const p = post();
  const j = state.slideIdx + d;
  if (j < 0 || j >= p.slides.length) return;
  [p.slides[state.slideIdx], p.slides[j]] = [p.slides[j], p.slides[state.slideIdx]];
  state.slideIdx = j;
  scheduleSave(); renderPost();
}

// ---------------------------------------------------------------- compliance

let lintTimer = null;
function renderLintSoon() { clearTimeout(lintTimer); lintTimer = setTimeout(renderLint, 200); }

function renderLint() {
  const p = post();
  if (!p) return [];
  const issues = Lint.lintPost(state.lintRules, p, Slides.slideText);
  const errors = issues.filter((i) => i.level === 'error');
  const warns = issues.filter((i) => i.level === 'warning');
  const pill = $('lintPill');
  if (errors.length) { pill.className = 'pill bad'; pill.textContent = `${errors.length} to fix before export`; }
  else if (warns.length) { pill.className = 'pill warn'; pill.textContent = `Ready · ${warns.length} to check`; }
  else { pill.className = 'pill ok'; pill.textContent = 'Ready to export'; }
  $('checkCount').textContent = errors.length ? String(errors.length) : '';
  const ul = $('issues');
  ul.innerHTML = '';
  if (!issues.length) ul.append(el('li', { class: 'clear' }, 'Nothing to fix. Every slide and both captions pass the rules.'));
  for (const i of [...errors, ...warns]) {
    ul.append(el('li', { class: i.level },
      el('div', { class: 'lvl' }, i.level === 'error' ? 'Must fix' : 'Check'),
      el('div', {}, el('q', {}, i.match), ` ${i.reason}`),
      el('div', { class: 'where' }, i.where)));
  }
  return errors;
}

// ---------------------------------------------------------------- export

function exportBlocked(res) {
  if (!res || !res.blocked) return false;
  showTab('check');
  toast(`Export stopped: ${res.blocked.length} thing${res.blocked.length > 1 ? 's' : ''} to fix in the Compliance tab.`, true);
  return true;
}

function cleanErr(err) {
  return String((err && err.message) || err).replace(/^Error invoking remote method '[^']+': (Error: )?/, '');
}

async function doExportPng() {
  await saveNow();
  if (renderLint().length) return exportBlocked({ blocked: renderLint() });
  busy('Exporting slides');
  try {
    const res = await api.exportPng({ campaignId: state.campaign.id, postId: state.postId });
    if (!exportBlocked(res)) toast(`${res.count} slides exported, with the captions in caption.txt.`);
  } catch (err) { toast(cleanErr(err), true); } finally { busy(null); }
}

async function doExportClip(format) {
  $('clipMenu').hidden = true;
  await saveNow();
  if (renderLint().length) return exportBlocked({ blocked: renderLint() });
  busy('Making the clip');
  try {
    const res = await api.exportClip({ campaignId: state.campaign.id, postId: state.postId, format });
    if (!exportBlocked(res)) toast(`Clip exported (${res.seconds}s).`);
  } catch (err) { toast(cleanErr(err), true); } finally { busy(null); }
}

// ---------------------------------------------------------------- settings

async function openSettings() {
  const s = await api.settings.get();
  $('setSeconds').value = s.clipSeconds;
  $('setZoom').checked = s.gentleZoom;
  $('setKey').value = '';
  $('setKey').placeholder = s.apiKey ? 'Saved. Type a new key to replace, or clear to remove.' : 'sk-ant-...';
  $('setModel').value = s.model;
  $('settingsDlg').showModal();
}

async function saveSettings() {
  const next = { clipSeconds: Number($('setSeconds').value) || 4, gentleZoom: $('setZoom').checked, model: $('setModel').value };
  const key = $('setKey').value.trim();
  if (key) next.apiKey = key;
  try {
    state.settings = await api.settings.set(next);
    toast('Settings saved');
    if (state.campaign && !state.postId) renderCampaign();
  } catch (err) { toast(cleanErr(err), true); }
}

// ---------------------------------------------------------------- start

async function init() {
  const b = await api.brand();
  Object.assign(state, { brand: b.brand, lintRules: b.lintRules, pillars: b.pillars, models: b.models, recipes: b.recipes || [] });
  const P = b.brand.palette;
  const root = document.documentElement.style;
  root.setProperty('--brand', P.brand); root.setProperty('--brand-deep', P.brandDeep); root.setProperty('--accent', P.accent);
  root.setProperty('--bg', P.bg); root.setProperty('--bg-2', P.bg2); root.setProperty('--ink', P.ink);
  root.setProperty('--muted', P.muted); root.setProperty('--line', P.line);
  document.title = b.brand.appName;
  $('appName').textContent = 'Studio';
  $('brandLogo').src = Slides.assetUrl('brand:' + b.brand.logo);
  document.querySelectorAll('.brandName').forEach((n) => { n.textContent = b.brand.name; });
  $('workDir').textContent = b.workDir;

  for (const t of b.brand.topics) $('campaignTopic').append(el('option', { value: t.id }, t.name));
  $('campaignTopic').append(el('option', { value: '' }, 'Not about one treatment'));
  for (const p of b.pillars) $('campaignPillar').append(el('option', { value: p.id }, p.name));
  for (const m of b.models) $('setModel').append(el('option', { value: m.id }, m.label));

  state.settings = await api.settings.get();
  state.media = await api.media.list();
  state.campaigns = await api.campaigns.list();

  for (const r of state.recipes) $('recipeSelect').append(el('option', { value: r.id }, r.name));
  const showRecipeHint = () => { const r = state.recipes.find((x) => x.id === $('recipeSelect').value); $('recipeHint').textContent = r ? r.description : ''; };
  $('recipeSelect').addEventListener('change', showRecipeHint);
  showRecipeHint();
  $('useRecipe').disabled = !state.recipes.length;
  $('useRecipe').addEventListener('click', () => {
    const r = state.recipes.find((x) => x.id === $('recipeSelect').value);
    if (!r) return;
    const copy = JSON.parse(JSON.stringify(r));
    addPost({ title: copy.title, style: copy.style, slides: copy.slides, caption: copy.caption || { instagram: '', facebook: '' } });
    toast(`${r.name} added. Replace the text in brackets and add the photos.`);
  });
  bindCampaignFields();
  bindInspector();
  $('newCampaign').addEventListener('click', newCampaign);
  $('emptyNew').addEventListener('click', newCampaign);
  $('openFolder').addEventListener('click', () => api.openWorkDir());
  $('openSettings').addEventListener('click', openSettings);
  $('saveSettings').addEventListener('click', saveSettings);
  $('getKey').addEventListener('click', () => api.openExternal('https://console.anthropic.com/settings/keys'));
  $('exportPng').addEventListener('click', doExportPng);
  $('exportClipBtn').addEventListener('click', (e) => { e.stopPropagation(); $('clipMenu').hidden = !$('clipMenu').hidden; });
  document.querySelectorAll('#clipMenu button').forEach((b2) => b2.addEventListener('click', () => doExportClip(b2.dataset.format)));
  document.addEventListener('click', () => { $('clipMenu').hidden = true; });
  $('lintPill').addEventListener('click', () => showTab('check'));
  window.addEventListener('resize', () => { if (!$('postPane').hidden) fitPreview(); });
  window.addEventListener('beforeunload', () => { saveNow(); });
  api.onProgress((p) => { if (!$('busy').hidden) $('busyText').textContent = p.step; });

  if (state.campaigns.length) {
    await openCampaign(state.campaigns[0].id);
    if (state.campaign.posts.length) openPost(state.campaign.posts[0].id);
  } else {
    renderSidebar();
    showPane('empty');
  }
}

init().catch((err) => toast(cleanErr(err), true));
