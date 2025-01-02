const {app, BrowserWindow, Menu} = require('electron')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
const settings = require('electron-settings')
const updateTitle = require('./utils/updateTitle')
const axios = require('axios')
const fs = require('fs')
const { spawn } = require('child_process')
require('dotenv').config()

const APP_ENV = 'PRO' //Change this Value to swith environment ['DEV', 'TEST', 'PRO']
const APP_URL = 'https://controlsuite.pro'

const CS_UPDATE = 'C:\\ControlSuite\\App\\ControlSuiteUpdate.exe'
const CHECK_INTERVAL = 5000
let csUpdateProcess

const configurations = {
    DEV: {
        name: 'DEV',
        url: APP_URL,
        devTools: false,
        toolsFromStart: false,
        exeName: 'ControlSuiteDevInstaller.exe'
    },
    PRE: {
        name: 'PRE',
        url: APP_URL,
        devTools: false,
        toolsFromStart: false,
        exeName: 'ControlSuitePreInstaller.exe'
    },
    PRO: {
        name: 'PRO',
        url: APP_URL,
        devTools: false,
        toolsFromStart: false,
        exeName: 'ControlSuiteProInstaller.exe'
    },
    TEST: {
        name: 'CLOUD',
        url: APP_URL,
        devTools: false,
        toolsFromStart: false,
        exeName: 'ControlSuiteCloudInstaller.exe'
    },
}
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

const config = configurations[APP_ENV]
let win
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
        }
    })

    const createWindow = () => {
        win = new BrowserWindow({
            width: 1920,
            height: 1080,
            icon: './assets/images/logo-512x512.png',
            webPreferences: {
                devTools: false,
            }
        });

        win.loadURL(APP_URL);

        win.webContents.on('did-finish-load', () => {
            updateTitle(win, config);
            win.webContents.executeJavaScript(`
                document.addEventListener('click', (event) => {
                    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }, true);
            `);
        })
        win.webContents.on('did-navigate', () => updateTitle(win, config))
        win.webContents.on('did-navigate-in-page', () => updateTitle(win, config))

        config.toolsFromStart && win.webContents.openDevTools()
        if (!config.devTools) {
            const menu = Menu.buildFromTemplate([])
            config.devTools || Menu.setApplicationMenu(menu)
        }

        autoUpdater.on('update-available', (info) => {
            log.info('Update available.');
        });
          
          autoUpdater.on('update-downloaded', (info) => {
            log.info('Update downloaded; will install in 5 seconds');
            setTimeout(() => {
              autoUpdater.quitAndInstall();
            }, 5000);
        });

    }

    const checkAndExecuteCSUpdate = () => {
        setInterval(() => {
            if (fs.existsSync(CS_UPDATE)) {
                if (!csUpdateProcess || csUpdateProcess.killed) {
                    csUpdateProcess = spawn(CS_UPDATE, [], { detached: true, stdio: 'ignore' }).unref();
                }
            }
        }, CHECK_INTERVAL)
    }

    app.whenReady().then(async () => {
        try {
        createWindow()
        checkAndExecuteCSUpdate()
        autoUpdater.checkForUpdatesAndNotify()
        settings.set('autoLaunch', true);
        app.setLoginItemSettings({
            openAtLogin: true,
            path: app.getPath('exe'),
        })
        } catch (error) {
            log.error('Error al inicializar configuraciones:', error)
            app.quit()
        }
    })

    app.on('window-all-closed', () => {
        process.platform !== 'darwin' && app.quit()
    })

    app.on('activate', () => {
        BrowserWindow.getAllWindows().length === 0 && createWindow()
    })

    autoUpdater.on('update-available', () => {
        log.info('Update available.')
      })
    
      autoUpdater.on('update-downloaded', () => {
        autoUpdater.quitAndInstall()
      })
   
}