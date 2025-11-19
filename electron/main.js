

const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const url = require('url');
const startAutoUpdateCheck = require('./update').default;
const TailScale = require('./tailScale');
const isDev = require('electron-is-dev');

let win;
let tray;

const createWindow = () => {
  // Keep the standard frame so OS-provided minimize/close buttons remain.
  // Hide the menu bar, disable maximize and resizing so only minimize and close are active.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, './assets/icone_executavel_arredondado.png'),
    autoHideMenuBar: true,
    // On Windows these keep the maximize button from being active.
    maximizable: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    // Em produção, extraResources fica em process.resourcesPath
    const indexPath = path.join(process.resourcesPath, 'dist', 'ui', 'index.html');
    console.log('Loading index from:', indexPath);
    console.log('process.resourcesPath:', process.resourcesPath);
    console.log('__dirname:', __dirname);
    win.loadFile(indexPath).catch(err => {
      console.error('Failed to load file:', err);
    });
  }
  win.webContents.openDevTools();

  // win.loadFile('index.html')

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

  let icon = nativeImage.createFromPath(path.join(__dirname, './assets/iconTemplate.png'));
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

  tray.setToolTip('Meu App Electron');
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