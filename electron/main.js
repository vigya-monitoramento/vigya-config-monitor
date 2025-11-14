const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const isDev = require('electron-is-dev');
const startAutoUpdateCheck = require('../update').default;
const TailScale = require('../tailScale');

let win;
let tray;

const createWindow = () => {
  // Keep the standard frame so OS-provided minimize/close buttons remain.
  // Hide the menu bar, disable maximize and resizing so only minimize and close are active.
  win = new BrowserWindow({
    width: 1024,
    height: 728,
    icon: path.join(__dirname, '../assets/icone_executavel_arredondado.png'),
    autoHideMenuBar: true,
    maximizable: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // Load from Vite dev server in development, or from dist in production
  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/renderer/index.html')}`

  win.loadURL(startUrl)

  // Open DevTools in development
  if (isDev) {
    win.webContents.openDevTools()
  }

  // Ensure menu bar is not visible (double-safety).
  try {
    win.setMenuBarVisibility(false);
  } catch (e) {
    // ignore if method not available
  }

  win.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide(); // esconde, mas não encerra
    }
    return false;
  });
}

app.whenReady().then(() => {
  // Remove the default application menu so the window shows no menu/options
  // but keep the tray context menu. This hides the menu bar on Windows.
  Menu.setApplicationMenu(null);

  createWindow();

  let icon = nativeImage.createFromPath(path.join(__dirname, '../assets/iconTemplate.png'));
  icon = icon.resize({ width: 16, height: 16 });

  tray = new Tray(icon);

  let tailScale = new TailScale();
  tailScale.start();

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Abrir',
      click: () => {
        win.show();
      },
    },
    {
      label: 'Sair',
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Vigya Control Monitor');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    win.show(); // mostra ao clicar no ícone
  });

  startAutoUpdateCheck(); // verifica e aplica atualização automática
})

autoUpdater.on('update-downloaded', () => {
  // Quando terminar de baixar a atualização
  autoUpdater.quitAndInstall();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
