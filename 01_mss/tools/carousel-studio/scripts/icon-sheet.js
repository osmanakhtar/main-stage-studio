// icon-sheet.js — renders every icon in the suite to one PNG for review,
// grouped, at slide size inside the Signature style's copper circles.
//   npx electron scripts/icon-sheet.js <out.png>
'use strict';

const fs = require('fs');
const path = require('path');
const { app, BrowserWindow } = require('electron');
const { ICONS, icon } = require('../src/shared/icons');

const out = path.resolve(process.argv.find((a) => a.endsWith('.png')) || 'icon-sheet.png');
const groups = {};
for (const [name, i] of Object.entries(ICONS)) (groups[i.group] = groups[i.group] || []).push([name, i]);
const html = `<!doctype html><style>
body{margin:0;background:#efece5;font:15px -apple-system,Helvetica,sans-serif;color:#18203a;padding:36px 40px;width:1520px}
h2{font:500 20px Georgia,serif;margin:26px 0 14px;color:#18203a}
.g{display:flex;flex-wrap:wrap;gap:22px 18px}
.c{width:132px;display:flex;flex-direction:column;align-items:center;gap:10px}
.r{width:104px;height:104px;border-radius:50%;border:2px solid #a8796a;color:#a8796a;display:flex;align-items:center;justify-content:center}
.n{font-size:13px;text-align:center}.n b{display:block;font-weight:600}.n span{color:#7a7f95}
</style><body>${Object.entries(groups).map(([g, list]) => `<h2>${g}</h2><div class="g">${list.map(([n, i]) => `<div class="c"><div class="r">${icon(n, 76)}</div><div class="n"><b>${i.label}</b><span>${n}</span></div></div>`).join('')}</div>`).join('')}</body>`;

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 800, height: 600, show: false, webPreferences: { offscreen: true } });
  await win.loadURL('about:blank');
  const dbg = win.webContents.debugger;
  dbg.attach('1.3');
  await win.loadURL(`data:text/html;base64,${Buffer.from(html).toString('base64')}`);
  const h = await win.webContents.executeJavaScript('document.body.scrollHeight');
  await dbg.sendCommand('Emulation.setDeviceMetricsOverride', { width: 1600, height: h, deviceScaleFactor: 1, mobile: false });
  const shot = await dbg.sendCommand('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1600, height: h, scale: 1 } });
  fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
  console.log(`wrote ${out}`);
  app.exit(0);
});
