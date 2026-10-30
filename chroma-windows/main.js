const {app, BrowserWindow, shell} = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1180, height: 850, minWidth: 780, minHeight: 650,
    backgroundColor: '#0d111b', title: 'CHROMA Color Translator',
    autoHideMenuBar: true,
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true }
  });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.webContents.setWindowOpenHandler(() => ({action: 'deny'}));
  win.webContents.on('will-navigate', e => e.preventDefault());
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
