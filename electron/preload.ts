import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  saveFile: (options: { defaultName: string; filters: { name: string; extensions: string[] }[]; data: string }) =>
    ipcRenderer.invoke('save-file', options),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  fetchUrlMetadata: (url: string) => ipcRenderer.invoke('fetch-url-metadata', url),
})
