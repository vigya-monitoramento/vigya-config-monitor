const { autoUpdater } = require('electron-updater');
const path = require('path');


const CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutos

function startAutoUpdateCheck() {
  autoUpdater.checkForUpdatesAndNotify();

  // agenda nova verificação
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, CHECK_INTERVAL);
}

module.exports.default = startAutoUpdateCheck;