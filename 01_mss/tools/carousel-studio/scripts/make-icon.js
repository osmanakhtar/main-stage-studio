// make-icon.js — builds packaging/icon.png (1024×1024) from the brand pack: the
// logo's mark on the brand's deep colour, in the macOS rounded-square shape.
// electron-builder turns it into the .icns. Run: npx electron scripts/make-icon.js
'use strict';

const fs = require('fs');
const path = require('path');
const { app, BrowserWindow } = require('electron');

const root = path.join(__dirname, '..');
const brandId = require(path.join(root, 'package.json')).studioBrand;
const brandDir = path.join(root, 'brands', brandId);
const brand = JSON.parse(fs.readFileSync(path.join(brandDir, 'brand.json'), 'utf8'));
// Which part of the logo is the mark, as fractions of the logo image.
const crop = brand.iconCrop || { x: 0, y: 0, w: 1, h: 1 };
const logoBuf = fs.readFileSync(path.join(brandDir, brand.logo));
const aspect = logoBuf.readUInt32BE(16) / logoBuf.readUInt32BE(20); // PNG IHDR width / height
// Scale the logo so the cropped region fits a 440px box, centred.
const BOX = 440;
const scale = Math.min(BOX / crop.h, BOX / (crop.w * aspect)); // px per unit of logo height
const dispH = scale;
const dispW = scale * aspect;
const left = -crop.x * dispW + (BOX - crop.w * dispW) / 2;
const top = -crop.y * dispH + (BOX - crop.h * dispH) / 2;

const html = `<!doctype html><style>
html,body{margin:0;width:1024px;height:1024px;background:transparent}
.sq{position:absolute;left:100px;top:100px;width:824px;height:824px;border-radius:185px;
  background:linear-gradient(155deg,${brand.palette.brandDeep},${brand.palette.brand});
  box-shadow:0 10px 24px rgba(0,0,0,.25);overflow:hidden}
.mark{position:absolute;left:50%;top:50%;width:${BOX}px;height:${BOX}px;transform:translate(-50%,-50%);overflow:hidden}
.mark img{position:absolute;width:${dispW.toFixed(1)}px;height:${dispH.toFixed(1)}px;left:${left.toFixed(1)}px;top:${top.toFixed(1)}px}
</style><div class="sq"><div class="mark"><img src="data:image/png;base64,${logoBuf.toString('base64')}"></div></div>`;

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 512, height: 512, show: false, transparent: true, webPreferences: { offscreen: true } });
  await win.loadURL('about:blank');
  const dbg = win.webContents.debugger;
  dbg.attach('1.3');
  await dbg.sendCommand('Emulation.setDeviceMetricsOverride', { width: 1024, height: 1024, deviceScaleFactor: 1, mobile: false });
  await dbg.sendCommand('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
  await win.loadURL(`data:text/html;base64,${Buffer.from(html).toString('base64')}`);
  await win.webContents.executeJavaScript('document.images[0].decode().then(() => true)');
  const shot = await dbg.sendCommand('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1024, height: 1024, scale: 1 } });
  fs.mkdirSync(path.join(root, 'packaging'), { recursive: true });
  fs.writeFileSync(path.join(root, 'packaging', 'icon.png'), Buffer.from(shot.data, 'base64'));
  console.log('wrote packaging/icon.png');
  app.exit(0);
});
