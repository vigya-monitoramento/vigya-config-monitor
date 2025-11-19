const { autoUpdater } = require('electron-updater');
const path = require('path');


const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos

function startAutoUpdateCheck() {
  autoUpdater.checkForUpdatesAndNotify();

  // agenda nova verificação
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, CHECK_INTERVAL);
}

module.exports.default = startAutoUpdateCheck;