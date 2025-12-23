const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    switchView: (viewName) => ipcRenderer.send('switch-view', viewName)
});
