/**
 * @file Main Electron process.
 */

import { app, BrowserWindow, ipcMain } from 'electron'
import ip from 'ip'
import path from 'path'
import appConf from '../../config/app.conf'
import IpcMainChannel from '../enums/IpcMainChannel'
import IpcRendererChannel from '../enums/IpcRendererChannel'
import { initRendererIdleModeEvents } from './utils/idle'
import log, { disableIpcLogging, disableRendererLogging, enableIpcLogging, enableRendererLogging, isRendererLoggingEnabled } from './utils/log'

const isDev = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow | undefined

app.whenReady().then(() => {
  log.info('Starting main process... OK')

  initWindow()
  initIpcComm()
  initRendererIdleModeEvents()

  // On macOS it's common to re-create a window in the app when the dock icon is clicked and there
  // are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) initWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common for applications and their
// menu bar to stay active until the user quits explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

/**
 * Initializes the main window.
 *
 * @see https://electron.atom.io/docs/api/browser-window/
 */
function initWindow() {
  const window = new BrowserWindow({
    fullscreen: appConf.autoFullscreen,
    x: appConf.windowPosition.x,
    y: appConf.windowPosition.y,
    width: appConf.windowSize.width,
    height: appConf.windowSize.height,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isDev) {
    window.loadURL(`http://localhost:${Number(process.env.PORT ?? 8080)}`)
    window.webContents.openDevTools()

    log.debug(`Debug environment detected, enabling auto reloading enabled for directory ${__dirname} and main module ${__filename}... OK`)

    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '../', 'node_modules', '.bin', 'electron'),
      electronArgv: ['-r', 'dotenv/config', __filename],
      forceHardReset: true,
      hardResetMethod: 'exit',
    })
  }
  else {
    window.loadURL(`file://${__dirname}/index.html`)
  }

  // Send initial IPC events when window is finished loading.
  window.webContents.on('did-finish-load', () => seedIpcComm())

  // Garbage collect the window when it is closed.
  window.on('closed', () => { mainWindow = undefined })

  log.info('Building main window... OK')

  mainWindow = window
}

/**
 * Sends initial IPC events when the window is finished loading.
 */
function seedIpcComm() {
  if (!mainWindow) return

  mainWindow.webContents.send(IpcRendererChannel.DEBUG_MODE_CHANGED, isRendererLoggingEnabled())

  mainWindow.webContents.send(IpcRendererChannel.APP_INFO_READY, {
    name: app.name,
    version: app.getVersion(),
    ip: ip.address(),
  })
}

/**
 * Initializes IPC communication channels.
 */
function initIpcComm() {
  ipcMain.on(IpcMainChannel.TOGGLE_DEBUG_MODE, () => {
    if (isRendererLoggingEnabled()) {
      disableRendererLogging()
      disableIpcLogging()
      mainWindow?.webContents.send(IpcRendererChannel.DEBUG_MODE_CHANGED, false)
      mainWindow?.webContents.closeDevTools()
    }
    else {
      enableRendererLogging()
      enableIpcLogging()
      mainWindow?.webContents.send(IpcRendererChannel.DEBUG_MODE_CHANGED, true)
      mainWindow?.webContents.openDevTools()
    }
  })

  ipcMain.on(IpcMainChannel.RELOAD_WINDOW, () => mainWindow?.reload())

  ipcMain.on(IpcMainChannel.QUIT_APP, () => app.quit())
}
