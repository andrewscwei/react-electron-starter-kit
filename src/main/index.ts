/**
 * @file Main Electron process.
 */

import { app, BrowserWindow, ipcMain } from 'electron'
import ip from 'ip'
import path from 'path'
import appConf from '../../config/app.conf'
import IpcMainChannel from '../enums/IpcMainChannel'
import IpcRendererChannel, { IpcRendererChannelPayload } from '../enums/IpcRendererChannel'
import log, { disableIpcLogging, disableRendererLogging, enableIpcLogging, enableRendererLogging, isRendererLoggingEnabled } from './utils/log'

const isDev = process.env.NODE_ENV === 'development'

let currentWindow: BrowserWindow | undefined

/**
 * Creates a new Electron main window.
 *
 * @returns The window.
 *
 * @see https://electron.atom.io/docs/api/browser-window/
 */
export default function createWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
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
    mainWindow.loadURL(`http://localhost:${Number(process.env.PORT ?? 8080)}`)
    mainWindow.webContents.openDevTools()

    log.debug(`Debug environment detected, enabling auto reloading enabled for directory ${__dirname} and main module ${__filename}... OK`)

    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '../', 'node_modules', '.bin', 'electron'),
      electronArgv: ['-r', 'dotenv/config', __filename],
      forceHardReset: true,
      hardResetMethod: 'exit',
    })
  }
  else {
    mainWindow.loadURL(`file://${__dirname}/index.html`)
  }

  // Send initial IPC events when window is finished loading.
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send(IpcRendererChannel.APP_INFO_READY, {
      name: app.name,
      version: app.getVersion(),
      ip: ip.address(),
    })
    mainWindow.webContents.send(IpcRendererChannel.DEBUG_MODE_CHANGED, isRendererLoggingEnabled())
  })

  log.info('Building main window... OK')

  return mainWindow
}

app.whenReady().then(() => {
  log.info('Starting main process... OK')

  currentWindow = createWindow()
  currentWindow?.on('closed', () => { currentWindow = undefined })

  ipcMain.on(IpcMainChannel.TOGGLE_DEBUG_MODE, () => {
    if (isRendererLoggingEnabled()) {
      disableRendererLogging()
      disableIpcLogging()
      const payload: IpcRendererChannelPayload['DEBUG_MODE_CHANGED'] = false
      currentWindow?.webContents.send(IpcRendererChannel.DEBUG_MODE_CHANGED, payload)
      currentWindow?.webContents.closeDevTools()
    }
    else {
      enableRendererLogging()
      enableIpcLogging()
      const payload: IpcRendererChannelPayload['DEBUG_MODE_CHANGED'] = true
      currentWindow?.webContents.send(IpcRendererChannel.DEBUG_MODE_CHANGED, payload)
      currentWindow?.webContents.openDevTools()
    }
  })

  ipcMain.on(IpcMainChannel.RELOAD_WINDOW, () => currentWindow?.reload())
  ipcMain.on(IpcMainChannel.QUIT_APP, () => app.quit())

  currentWindow?.webContents.send(IpcRendererChannel.DEBUG_MODE_CHANGED, isDev)

  // On macOS it's common to re-create a window in the app when the dock icon is clicked and there
  // are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      currentWindow = createWindow()
      currentWindow?.on('closed', () => { currentWindow = undefined })
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common for applications and their
// menu bar to stay active until the user quits explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
