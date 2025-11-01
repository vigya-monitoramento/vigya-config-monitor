

const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const startAutoUpdateCheck = require('./update').default;
const TailScale = require('./tailScale');

let win;
let tray;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, './assets/icone_executavel_arredondado.png'),
  })

  win.loadFile('index.html')

  

  win.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      win.hide(); // esconde, mas não encerra
    }
    return false;
  });
}

app.whenReady().then(() => {
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