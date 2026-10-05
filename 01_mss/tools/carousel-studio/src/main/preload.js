// preload.js — the only bridge between the editor page and the disk.
'use strict';

const { contextBridge, ipcRenderer } = require('electron');

const call = (ch) => (...args) => ipcRenderer.invoke(ch, ...args);

contextBridge.exposeInMainWorld('studio', {
  brand: call('brand:get'),
  campaigns: { list: call('campaigns:list'), get: call('campaigns:get'), save: call('campaigns:save'), remove: call('campaigns:delete') },
  media: { list: call('media:list'), import: call('media:import') },
  exportPng: call('export:png'),
  exportClip: call('export:clip'),
  draft: call('claude:draft'),
  settings: { get: call('settings:get'), set: call('settings:set') },
  openWorkDir: call('shell:openWorkDir'),
  openExternal: call('shell:openExternal'),
  onProgress: (fn) => {
    const h = (_e, p) => fn(p);
    ipcRenderer.on('export:progress', h);
    return () => ipcRenderer.removeListener('export:progress', h);
  },
});
