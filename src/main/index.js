import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import path from 'path';
import fs from 'fs';
import shelljs from 'shelljs';


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,  // Ensure context isolation is true for security
      enableRemoteModule: false, // Best practice to keep this false
      nodeIntegration: false,
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// Handle terminal creation
ipcMain.on('terminal-input', (event,data) => {
  console.log(data);
  shelljs.exec(data, { silent: true }, (code, stdout, stderr) => {
    if (code === 0) {
      event.sender.send('terminal-output',stdout)
    } else {
      event.sender.send('terminal-error',stderr)
    }
  });

});

// Other existing IPC handlers remain unchanged...
ipcMain.handle('load-files', async (event, dirPath) => {
  try {
    const files = await fs.promises.readdir(dirPath);
    const fileList = files.map((fileName) => {
      const filePath = path.join(dirPath, fileName);
      try {
        const isDirectory = fs.lstatSync(filePath).isDirectory();
        return { name: fileName, path: filePath, isDirectory };
      } catch (error) {
        // Skip the file if there's an error (e.g., permissions issue)
        console.error(`Skipping file: ${filePath} due to error: ${error.message}`);
        return null; // Return null for inaccessible files
      }
    });

    return fileList.filter((file) => file !== null); // Filter out nulls from the result
  } catch (error) {
    console.error('Error loading files:', error);
    return { error: error.message };
  }
});

ipcMain.handle('get-content', async (event, filePath) => {
  const data = await fs.promises.readFile(filePath, 'utf8');
  return { content: data };
});

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process code.
// You can also put them in separate files and require them here.
