import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer

//todo 
// add apis for save open folder and add file and folder

const api = {
  loadFiles: (dirPath) => ipcRenderer.invoke('load-files', dirPath),
  getContent: (filePath) => ipcRenderer.invoke('get-content',filePath),
  createTerminal: () => ipcRenderer.send('terminal-create'),
  onTerminalOutput: (callback) => {
    if (typeof callback === 'function') {
      ipcRenderer.on('terminal-output', (event, data) => callback(data));
    } else {
      console.error('onTerminalOutput: callback is not a function\n',callback);
    }
  },
  onTerminalError: (callback) => {
    if (typeof callback === 'function') {
      ipcRenderer.on('terminal-error', (event, data) => callback(data));
    } else {
      console.error('onTerminalError: callback is not a function\n',callback);
    }
  },
  sendTerminalInput: (input) => ipcRenderer.send('terminal-input', input),
  onTerminalExit: (callback) => ipcRenderer.on('terminal-exit', (event, code) => callback(code)),
}



// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
