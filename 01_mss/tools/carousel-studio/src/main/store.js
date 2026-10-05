// store.js — everything on disk. Her work lives in a plain folder she can see
// and back up: ~/Documents/<App name>/ with campaigns/ (one JSON per campaign),
// media/ (photos and videos she imports) and exports/.
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { app, safeStorage } = require('electron');

const BRAND_ID = require('../../package.json').studioBrand;
const BRAND_DIR = path.join(__dirname, '..', '..', 'brands', BRAND_ID);

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(tmp, file);
}

const brand = readJson(path.join(BRAND_DIR, 'brand.json'));
const lintRules = readJson(path.join(BRAND_DIR, 'lint-rules.json'), { errors: [], warnings: [] });
const pillars = readJson(path.join(BRAND_DIR, 'pillars.json'), { pillars: [] }).pillars;

function workDir() {
  if (process.env.STUDIO_WORK_DIR) return process.env.STUDIO_WORK_DIR;
  return path.join(app.getPath('documents'), brand.appName);
}
const dirs = () => {
  const root = workDir();
  return {
    root,
    campaigns: path.join(root, 'campaigns'),
    media: path.join(root, 'media'),
    exports: path.join(root, 'exports'),
  };
};
function ensureDirs() {
  for (const d of Object.values(dirs())) fs.mkdirSync(d, { recursive: true });
}

const newId = () => crypto.randomBytes(6).toString('hex');
const safeName = (s) => String(s || '').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').slice(0, 60) || 'untitled';

// ---- campaigns -------------------------------------------------------------

function listCampaigns() {
  const dir = dirs().campaigns;
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => readJson(path.join(dir, f)))
    .filter(Boolean)
    .sort((a, b) => String(b.updated).localeCompare(String(a.updated)));
}
function getCampaign(id) {
  return readJson(path.join(dirs().campaigns, `${id}.json`), null);
}
function saveCampaign(c) {
  if (!c.id) c.id = newId();
  c.updated = new Date().toISOString();
  writeJson(path.join(dirs().campaigns, `${c.id}.json`), c);
  return c;
}
function deleteCampaign(id) {
  fs.rmSync(path.join(dirs().campaigns, `${id}.json`), { force: true });
}

// First run: seed one worked example so the app opens on something real.
function seedExample() {
  if (listCampaigns().length) return;
  const example = readJson(path.join(BRAND_DIR, 'example-campaign.json'), null);
  if (example) saveCampaign({ ...example, id: newId() });
}

// ---- media library ---------------------------------------------------------

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic']);
const VIDEO_EXT = new Set(['.mp4', '.mov', '.m4v', '.webm']);

function mediaIndexPath() { return path.join(dirs().media, 'index.json'); }

function listMedia() {
  const items = [];
  const brandLib = path.join(BRAND_DIR, 'library');
  if (fs.existsSync(brandLib)) {
    for (const f of fs.readdirSync(brandLib).sort()) {
      if (IMAGE_EXT.has(path.extname(f).toLowerCase())) {
        items.push({ ref: `brand:library/${f}`, kind: 'image', name: f, source: 'brand' });
      }
    }
  }
  const idx = readJson(mediaIndexPath(), []);
  for (const m of idx) {
    if (fs.existsSync(path.join(dirs().media, m.file))) {
      items.push({ ref: `media:${m.file}`, kind: m.kind, name: m.name, poster: m.poster ? `media:${m.poster}` : null, duration: m.duration || null, source: 'mine' });
    }
  }
  return items.reverse();
}

function addMediaRecord(rec) {
  const idx = readJson(mediaIndexPath(), []);
  idx.push(rec);
  writeJson(mediaIndexPath(), idx);
}

function resolveRef(ref) {
  if (!ref) return null;
  if (ref.startsWith('brand:')) return path.join(BRAND_DIR, ref.slice(6));
  if (ref.startsWith('media:')) return path.join(dirs().media, ref.slice(6));
  return null;
}

// ---- settings (API key encrypted with the macOS keychain) -----------------

function settingsPath() { return path.join(app.getPath('userData'), 'settings.json'); }

function getSettings() {
  const s = readJson(settingsPath(), {});
  let apiKey = '';
  if (s.apiKeyEnc && safeStorage.isEncryptionAvailable()) {
    try { apiKey = safeStorage.decryptString(Buffer.from(s.apiKeyEnc, 'base64')); } catch { apiKey = ''; }
  }
  return { model: s.model || 'claude-opus-5-5', apiKey, clipSeconds: s.clipSeconds || 4, gentleZoom: s.gentleZoom !== false };
}
function setSettings(next) {
  const cur = readJson(settingsPath(), {});
  if (next.apiKey !== undefined) {
    if (!next.apiKey) delete cur.apiKeyEnc;
    else if (safeStorage.isEncryptionAvailable()) cur.apiKeyEnc = safeStorage.encryptString(next.apiKey).toString('base64');
    else throw new Error('This Mac cannot store the key securely, so it was not saved.');
  }
  for (const k of ['model', 'clipSeconds', 'gentleZoom']) if (next[k] !== undefined) cur[k] = next[k];
  writeJson(settingsPath(), cur);
  const s = getSettings();
  return { ...s, apiKey: s.apiKey ? 'saved' : '' };
}

// Post templates ("recipes"): a fixed slide sequence and style she can start
// a post from, in the brand pack's recipes/ folder.
function listRecipes() {
  const dir = path.join(BRAND_DIR, 'recipes');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
    .map((f) => readJson(path.join(dir, f), null)).filter(Boolean);
}

function readBrandFile(rel) {
  try { return fs.readFileSync(path.join(BRAND_DIR, rel), 'utf8'); } catch { return ''; }
}

module.exports = {
  BRAND_DIR, brand, lintRules, pillars, dirs, ensureDirs, newId, safeName,
  listCampaigns, getCampaign, saveCampaign, deleteCampaign, seedExample,
  listMedia, addMediaRecord, resolveRef, IMAGE_EXT, VIDEO_EXT,
  getSettings, setSettings, readBrandFile, listRecipes,
};
