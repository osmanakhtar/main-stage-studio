// main.js — Electron entry point. Serves the app, brand pack and her media over
// a private studio:// scheme, and handles everything that touches the disk.
'use strict';

const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain, dialog, protocol, shell, net } = require('electron');
const { pathToFileURL } = require('url');
const store = require('./store');
const render = require('./render');
const claude = require('./claude');
const Slides = require('../shared/slides');
const Lint = require('../shared/lint');

app.setName(store.brand.appName);

protocol.registerSchemesAsPrivileged([
  { scheme: 'studio', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true, corsEnabled: true } },
]);

const RENDERER_DIR = path.join(__dirname, '..', 'renderer');
const SHARED_DIR = path.join(__dirname, '..', 'shared');

// Only files inside the expected folder are ever served.
function inside(base, rel) {
  const p = path.resolve(base, rel);
  return p.startsWith(path.resolve(base) + path.sep) ? p : null;
}

// Every studio:// host is its own origin, so fonts and media loaded across
// hosts (slide HTML pulling brand fonts) need a CORS header.
async function serveFile(file, req) {
  if (!file || !fs.existsSync(file)) return new Response('Not found', { status: 404 });
  const res = await net.fetch(pathToFileURL(file).toString(), { headers: req.headers });
  const headers = new Headers(res.headers);
  headers.set('access-control-allow-origin', '*');
  return new Response(res.body, { status: res.status, headers });
}

function registerProtocol() {
  protocol.handle('studio', (req) => {
    const url = new URL(req.url);
    const rel = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
    switch (url.hostname) {
      case 'app': return serveFile(inside(RENDERER_DIR, rel || 'index.html'), req);
      case 'shared': return serveFile(inside(SHARED_DIR, rel), req);
      case 'brand': return serveFile(inside(store.BRAND_DIR, rel), req);
      case 'media': return serveFile(inside(store.dirs().media, rel), req);
      case 'render': {
        const html = render.takeHtml(rel);
        return html
          ? new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } })
          : new Response('Expired', { status: 404 });
      }
      default: return new Response('Not found', { status: 404 });
    }
  });
}

let mainWin = null;
function createWindow() {
  mainWin = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    title: store.brand.appName,
    backgroundColor: store.brand.palette.bg,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  mainWin.loadURL('studio://app/index.html');
  // Links (e.g. the API key console) open in her browser, never in the app.
  mainWin.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWin.webContents.on('will-navigate', (e) => e.preventDefault());
}

const progress = (channel) => (p) => {
  if (mainWin && !mainWin.isDestroyed()) mainWin.webContents.send(channel, p);
};

function lintErrors(post) {
  return Lint.lintPost(store.lintRules, post, Slides.slideText).filter((i) => i.level === 'error');
}

function exportFolderFor(campaign, post) {
  const date = new Date().toISOString().slice(0, 10);
  return path.join(store.dirs().exports, store.safeName(campaign.name), `${date}-${store.safeName(post.title)}`);
}

function registerIpc() {
  ipcMain.handle('brand:get', () => ({
    brand: store.brand,
    lintRules: store.lintRules,
    pillars: store.pillars,
    models: claude.MODELS,
    workDir: store.dirs().root,
  }));

  ipcMain.handle('campaigns:list', () => store.listCampaigns());
  ipcMain.handle('campaigns:get', (_e, id) => store.getCampaign(id));
  ipcMain.handle('campaigns:save', (_e, c) => store.saveCampaign(c));
  ipcMain.handle('campaigns:delete', async (_e, id) => {
    const { response } = await dialog.showMessageBox(mainWin, {
      type: 'warning', buttons: ['Delete', 'Cancel'], defaultId: 1, cancelId: 1,
      message: 'Delete this campaign?', detail: 'Its posts are deleted too. Exported files are kept.',
    });
    if (response !== 0) return false;
    store.deleteCampaign(id);
    return true;
  });

  ipcMain.handle('media:list', () => store.listMedia());
  ipcMain.handle('media:import', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWin, {
      title: 'Add photos or videos',
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Photos and videos', extensions: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'mp4', 'mov', 'm4v'] }],
    });
    if (canceled) return store.listMedia();
    const mediaDir = store.dirs().media;
    for (const src of filePaths) {
      const ext = path.extname(src).toLowerCase();
      const base = `${Date.now().toString(36)}-${store.safeName(path.basename(src, ext))}`;
      try {
        if (ext === '.heic') {
          // iPhone photos. Chromium can't show HEIC, so convert with macOS's own sips.
          const out = `${base}.jpg`;
          await new Promise((res, rej) => require('child_process').execFile('sips', ['-s', 'format', 'jpeg', src, '--out', path.join(mediaDir, out)], (err) => (err ? rej(err) : res())));
          store.addMediaRecord({ file: out, kind: 'image', name: path.basename(src) });
        } else if (store.IMAGE_EXT.has(ext)) {
          fs.copyFileSync(src, path.join(mediaDir, base + ext));
          store.addMediaRecord({ file: base + ext, kind: 'image', name: path.basename(src) });
        } else if (store.VIDEO_EXT.has(ext)) {
          fs.copyFileSync(src, path.join(mediaDir, base + ext));
          const poster = `${base}.poster.jpg`;
          const duration = await render.videoPoster(path.join(mediaDir, base + ext), path.join(mediaDir, poster));
          store.addMediaRecord({ file: base + ext, kind: 'video', name: path.basename(src), poster, duration });
        }
      } catch (err) {
        dialog.showErrorBox('Could not add a file', `${path.basename(src)}: ${err.message}`);
      }
    }
    return store.listMedia();
  });

  ipcMain.handle('export:png', async (_e, { campaignId, postId }) => {
    const c = store.getCampaign(campaignId);
    const post = c && c.posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found. Save and try again.');
    const errors = lintErrors(post);
    if (errors.length) return { blocked: errors };
    const dir = exportFolderFor(c, post);
    const files = await render.exportPngs(post, dir, progress('export:progress'));
    shell.showItemInFolder(files[0]);
    return { dir, count: files.length };
  });

  ipcMain.handle('export:clip', async (_e, { campaignId, postId, format }) => {
    const c = store.getCampaign(campaignId);
    const post = c && c.posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found. Save and try again.');
    const errors = lintErrors(post);
    if (errors.length) return { blocked: errors };
    const dir = exportFolderFor(c, post);
    fs.mkdirSync(dir, { recursive: true });
    const settings = store.getSettings();
    const outFile = path.join(dir, `clip-${format === '9:16' ? 'reel-9x16' : 'feed-4x5'}.mp4`);
    const res = await render.exportClip(post, outFile, { format, secondsPerSlide: settings.clipSeconds, gentleZoom: settings.gentleZoom }, progress('export:progress'));
    shell.showItemInFolder(outFile);
    return res;
  });

  ipcMain.handle('claude:draft', (_e, input) => claude.draft(input));

  ipcMain.handle('settings:get', () => {
    const s = store.getSettings();
    return { ...s, apiKey: s.apiKey ? 'saved' : '' };
  });
  ipcMain.handle('settings:set', (_e, next) => store.setSettings(next));

  ipcMain.handle('shell:openWorkDir', () => shell.openPath(store.dirs().root));
  ipcMain.handle('shell:openExternal', (_e, url) => {
    if (/^https:\/\//.test(url)) shell.openExternal(url);
  });
}

// Headless check used in development and CI: renders the example campaign's
// first post in every style (slides plus a quote and a statement slide, so
// every slide type is covered), and both clip formats, then quits.
async function selfTest(outDir) {
  const c = store.listCampaigns()[0];
  const post = c.posts[0];
  const errors = lintErrors(post);
  if (errors.length) throw new Error(`example post fails lint: ${JSON.stringify(errors)}`);
  const allTypes = {
    ...post,
    slides: [
      ...post.slides.slice(0, -1),
      { template: 'fact', numeral: '18–24', headline: 'Months results typically last', body: 'Collagen keeps building for months after treatment.' },
      { template: 'photos', kicker: 'Inside the clinic', headline: 'Consultation first, always', media: { ref: 'brand:library/puremed-hero-consultation.webp', kind: 'image' }, media2: { ref: 'brand:library/puremed-skin-glow-closeup-hf-v1.webp', kind: 'image' }, media3: { ref: 'brand:library/puremed-patient-clinic-relaxed-hf-v1.webp', kind: 'image' } },
      { template: 'quote', headline: 'I wanted a lift that still looked like me.', kicker: 'Example quote' },
      { template: 'brand', kicker: 'In short', headline: 'Tighter, without the scalpel', body: 'Results build gradually over the months after treatment.' },
      post.slides[post.slides.length - 1],
    ],
  };
  let pngs = 0;
  for (const st of Slides.STYLES) {
    pngs += (await render.exportPngs({ ...allTypes, style: st.id }, path.join(outDir, st.id))).length;
  }
  const feed = await render.exportClip({ ...post, style: 'flow' }, path.join(outDir, 'clip-feed-4x5.mp4'), { format: '4:5', secondsPerSlide: 3 });
  const reel = await render.exportClip({ ...post, style: 'statement' }, path.join(outDir, 'clip-reel-9x16.mp4'), { format: '9:16', secondsPerSlide: 3 });
  console.log(`selftest ok: ${pngs} png across ${Slides.STYLES.length} styles, feed ${feed.seconds}s, reel ${reel.seconds}s -> ${outDir}`);
}

app.whenReady().then(async () => {
  store.ensureDirs();
  store.seedExample();
  registerProtocol();
  registerIpc();
  const st = process.argv.find((a) => a.startsWith('--selftest='));
  if (st) {
    try {
      await selfTest(path.resolve(st.split('=')[1]));
      app.exit(0);
    } catch (err) {
      console.error('selftest failed:', err);
      app.exit(1);
    }
    return;
  }
  createWindow();
  // Development aid: --ui-shot=<file.png> saves a screenshot of the editor and quits.
  const shot = process.argv.find((a) => a.startsWith('--ui-shot='));
  if (shot) {
    mainWin.webContents.once('did-finish-load', () => setTimeout(async () => {
      const img = await mainWin.webContents.capturePage();
      fs.writeFileSync(path.resolve(shot.split('=')[1]), img.toPNG());
      app.exit(0);
    }, 2500));
  }
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => {
  render.disposeCapture();
  if (process.platform !== 'darwin') app.quit();
});
