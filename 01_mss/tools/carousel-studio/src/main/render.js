// render.js — turns slides into files.
//
//   PNG: each slide's HTML is loaded into an offscreen 1080×1350 window and
//        captured. Same HTML as the editor preview.
//   Clip: each slide becomes a short video segment (still slides get a slow
//        push-in, video slides play the footage under the slide graphics),
//        then ffmpeg joins them with crossfades into one mp4, 4:5 for the
//        feed or 9:16 for Reels and Stories.
//
// ffmpeg is the static build bundled with the app (ffmpeg-static), so there is
// nothing for her to install.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const { BrowserWindow } = require('electron');
const Slides = require('../shared/slides');
const store = require('./store');

const FPS = 30;
const XFADE = 0.5;

function ffmpegPath() {
  // Inside the packaged app the binary is unpacked next to app.asar.
  return require('ffmpeg-static').replace('app.asar', 'app.asar.unpacked');
}

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    execFile(ffmpegPath(), ['-hide_banner', '-loglevel', 'error', '-y', ...args], { maxBuffer: 1 << 26 }, (err, _out, stderr) => {
      if (err) reject(new Error(`ffmpeg failed: ${String(stderr || err.message).trim().slice(-600)}`));
      else resolve();
    });
  });
}

// ffmpeg prints the input's duration to stderr when given no output.
function probeDuration(file) {
  return new Promise((resolve) => {
    execFile(ffmpegPath(), ['-hide_banner', '-i', file], (_err, _out, stderr) => {
      const m = /Duration: (\d+):(\d+):(\d+(?:\.\d+)?)/.exec(String(stderr));
      resolve(m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : null);
    });
  });
}

async function videoPoster(videoFile, outJpg) {
  const dur = (await probeDuration(videoFile)) || 0;
  const at = dur > 2 ? 1 : 0;
  await ffmpeg(['-ss', String(at), '-i', videoFile, '-frames:v', '1', '-q:v', '3', outJpg]);
  return dur;
}

// ---- offscreen slide capture ----------------------------------------------

// Slide HTML is served through studio://render/<token> so it can load brand
// fonts and media from the same scheme as the editor.
const pending = new Map();
let tokenSeq = 0;
function registerHtml(html) {
  const token = `${Date.now().toString(36)}-${++tokenSeq}`;
  pending.set(token, html);
  return token;
}
function takeHtml(token) {
  const html = pending.get(token);
  pending.delete(token);
  return html;
}

// The capture window is driven through Chromium's DevTools protocol, which
// lays the page out at exactly 1080×1350 regardless of the window or screen
// size (a MacBook Air screen is shorter than one slide), and can capture
// with a transparent background for clip overlays.
let captureWin = null;
async function getCaptureWindow() {
  if (captureWin && !captureWin.isDestroyed()) return captureWin;
  captureWin = new BrowserWindow({
    width: 540,
    height: 675,
    show: false,
    transparent: true,
    webPreferences: { offscreen: true, sandbox: true, contextIsolation: true, backgroundThrottling: false },
  });
  // DevTools commands sent before the first page exists crash Electron.
  await captureWin.loadURL('about:blank');
  const dbg = captureWin.webContents.debugger;
  dbg.attach('1.3');
  await dbg.sendCommand('Emulation.setDeviceMetricsOverride', { width: Slides.W, height: Slides.H, deviceScaleFactor: 1, mobile: false });
  return captureWin;
}

async function captureSlide(slide, opts) {
  const win = await getCaptureWindow();
  const dbg = win.webContents.debugger;
  const transparent = !!opts.transparentMedia;
  await dbg.sendCommand('Emulation.setDefaultBackgroundColorOverride', transparent ? { color: { r: 0, g: 0, b: 0, a: 0 } } : {});
  const token = registerHtml(Slides.slideHtml(slide, store.brand, opts));
  await win.loadURL(`studio://render/${token}`);
  await win.webContents.executeJavaScript(`
    document.fonts.ready
      .then(() => Promise.all([...document.images].map((i) => i.decode().catch(() => null))))
      .then(() => true)`);
  const shot = await dbg.sendCommand('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: Slides.W, height: Slides.H, scale: 1 },
    captureBeyondViewport: false,
  });
  return Buffer.from(shot.data, 'base64');
}

function disposeCapture() {
  if (captureWin && !captureWin.isDestroyed()) captureWin.destroy();
  captureWin = null;
}

// ---- exports ---------------------------------------------------------------

// Style and position for slide i of a post: page numbers, progress bars and
// the seamless line all depend on where the slide sits in the carousel.
const placement = (post, i, extra) => ({ style: post.style, index: i, total: post.slides.length, ...extra });

async function exportPngs(post, outDir, onProgress) {
  fs.mkdirSync(outDir, { recursive: true });
  const files = [];
  for (let i = 0; i < post.slides.length; i++) {
    onProgress && onProgress({ step: `Slide ${i + 1} of ${post.slides.length}`, done: i, total: post.slides.length });
    const png = await captureSlide(post.slides[i], placement(post, i));
    const file = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
    fs.writeFileSync(file, png);
    files.push(file);
  }
  const cap = post.caption || {};
  const text = [
    cap.instagram ? `INSTAGRAM\n\n${cap.instagram.trim()}\n` : '',
    cap.facebook ? `FACEBOOK\n\n${cap.facebook.trim()}\n` : '',
  ].filter(Boolean).join('\n----------\n\n');
  if (text) fs.writeFileSync(path.join(outDir, 'caption.txt'), text);
  onProgress && onProgress({ step: 'Done', done: post.slides.length, total: post.slides.length });
  return files;
}

async function exportClip(post, outFile, opts, onProgress) {
  const seconds = Math.max(2, Math.min(10, Number(opts.secondsPerSlide) || 4));
  const zoom = opts.gentleZoom !== false;
  const vertical = opts.format === '9:16';
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'studio-clip-'));
  const total = post.slides.length + 1;
  try {
    const segs = [];
    const durs = [];
    for (let i = 0; i < post.slides.length; i++) {
      const slide = post.slides[i];
      onProgress && onProgress({ step: `Slide ${i + 1} of ${post.slides.length}`, done: i, total });
      const seg = path.join(tmp, `seg-${i}.mp4`);
      const isVideo = slide.media && slide.media.kind === 'video' && slide.media.ref;
      const dur = Number(slide.duration) > 0 ? Math.min(15, Number(slide.duration)) : seconds;
      if (isVideo && slide.template === 'cover') {
        const src = store.resolveRef(slide.media.ref);
        const overlay = path.join(tmp, `ovl-${i}.png`);
        fs.writeFileSync(overlay, await captureSlide(slide, placement(post, i, { transparentMedia: true })));
        const fx = slide.media.focusX != null ? slide.media.focusX : 0.5;
        const fy = slide.media.focusY != null ? slide.media.focusY : 0.5;
        await ffmpeg([
          '-stream_loop', '-1', '-i', src, '-i', overlay,
          '-filter_complex',
          `[0:v]scale=${Slides.W}:${Slides.H}:force_original_aspect_ratio=increase,` +
          `crop=${Slides.W}:${Slides.H}:(in_w-${Slides.W})*${fx}:(in_h-${Slides.H})*${fy},fps=${FPS},setsar=1[v];` +
          `[v][1:v]overlay=0:0,format=yuv420p[out]`,
          '-map', '[out]', '-t', String(dur), '-an',
          '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', seg,
        ]);
      } else {
        // A video placed on a split slide still exports as its poster frame.
        const png = path.join(tmp, `slide-${i}.png`);
        fs.writeFileSync(png, await captureSlide(slide, placement(post, i)));
        const frames = Math.round(dur * FPS);
        const vf = zoom
          // Upscale first so the push-in moves in sub-pixel steps without judder.
          ? `scale=${Slides.W * 2}:${Slides.H * 2},zoompan=z='1+0.04*on/${frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${Slides.W}x${Slides.H}:fps=${FPS},format=yuv420p`
          : `fps=${FPS},format=yuv420p`;
        await ffmpeg([
          '-loop', '1', '-framerate', String(FPS), '-i', png,
          '-vf', vf, '-frames:v', String(frames),
          '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', seg,
        ]);
      }
      segs.push(seg);
      durs.push(dur);
    }

    onProgress && onProgress({ step: 'Joining the clip', done: post.slides.length, total });
    const inputs = segs.flatMap((s) => ['-i', s]);
    const parts = [];
    let last = '[0:v]';
    let offset = 0;
    for (let i = 1; i < segs.length; i++) {
      offset += durs[i - 1] - XFADE;
      const label = `[x${i}]`;
      parts.push(`${last}[${i}:v]xfade=transition=fade:duration=${XFADE}:offset=${offset.toFixed(3)}${label}`);
      last = label;
    }
    const totalDur = durs.reduce((a, b) => a + b, 0) - XFADE * (segs.length - 1);
    const pad = vertical
      ? `,pad=${Slides.W}:1920:0:(1920-${Slides.H})/2:color=${store.brand.palette.brandDeep}`
      : '';
    parts.push(`${last}fade=t=in:st=0:d=0.3,fade=t=out:st=${Math.max(0, totalDur - 0.4).toFixed(3)}:d=0.4${pad},format=yuv420p[out]`);
    await ffmpeg([
      ...inputs,
      '-filter_complex', parts.join(';'),
      '-map', '[out]', '-r', String(FPS),
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart', outFile,
    ]);
    onProgress && onProgress({ step: 'Done', done: total, total });
    return { file: outFile, seconds: Math.round(totalDur * 10) / 10 };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

module.exports = { exportPngs, exportClip, captureSlide, takeHtml, disposeCapture, videoPoster, probeDuration, ffmpeg };
