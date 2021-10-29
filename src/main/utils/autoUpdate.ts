import { BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import appConf from '../../../config/app.conf'
import IpcMainChannel from '../../enums/IpcMainChannel'
import IpcRendererChannel from '../../enums/IpcRendererChannel'
import UpdateStatus from '../../enums/UpdateStatus'
import log from './log'

type Options = {

  /**
   * Handler invoked when checking for updates starts.
   */
  onChecking?: () => void

  /**
   * Handler invoked when checking for updates is complete and an update is available.
   */
  onAvailable?: () => void

  /**
   * Handler invoked when checking for updates is complete but there is no update available.
   */
  onUnavailable?: () => void

  /**
   * Handler invoked when downloading an update.
   *
   * @param progress - A type that describes the progress of the download.
   */
  onDownloading?: (progress: ProgressInfo) => void

  /**
   * Handler invoked when an update is successfully downloaded.
   */
  onDownloaded?: () => void

  /**
   * Handler invoked whenever there is an error checking, downloading or applying an update.
   *
   * @param error - The error.
   */
  onError?: (error: Error) => void
}

export type ProgressInfo = {

  /**
   * The transfer speed in terms of bytes per second.
   */
  bytesPerSecond: number

  /**
   * Total number of bytes of the update.
   */
  bytesTotal: number

  /**
   * Number of bytes transferred so far.
   */
  bytesTransferred: number

  /**
   * Decimal percentage completed (number between 0 - 1, inclusive).
   */
  percent: number
}

const isDev = process.env.NODE_ENV === 'development'

// Indicates whether the app has a new update. This is used by the autoUpdater.
let _hasUpdate = false

// Instance of the interval used for checking updates repeatedly.
let updateTimer: NodeJS.Timer | undefined

/**
 * CLears the update interval.
 */
function clearUpdateTimer() {
  if (!updateTimer) return
  clearInterval(updateTimer)
  updateTimer = undefined
}

/**
 * Checks to see if there is an available update for this app.
 */
function checkForUpdates(window?: BrowserWindow) {
  if (hasUpdate()) {
    window?.webContents.send(IpcRendererChannel.UPDATE_STATUS_CHANGED, { status: UpdateStatus.DOWNLOADED })
    clearUpdateTimer()
  }
  else {
    autoUpdater.checkForUpdates()
  }
}

/**
 * Indicates if there is an available update (that is already downloaded and ready to be installed).
 *
 * @returns `true` if there is an available update, `false` otherwise.
 */
export function hasUpdate() {
  return _hasUpdate
}

/**
 * Stops checking for updates periodically.
 */
export function stopPeriodicUpdateCheck() {
  log.info('Stopping periodic update check... OK')
  clearUpdateTimer()
}

/**
 * Checks for updates periodically, as defined by `checkForUpdatesInterval` property in app config file.
 */
export function startPeriodicUpdateCheck() {
  if (isDev || appConf.checkForUpdatesInterval <= 0) return clearInterval()

  log.info('Starting periodic update check... OK')

  checkForUpdates()
  updateTimer = setInterval(() => checkForUpdates(), appConf.checkForUpdatesInterval)
}

/**
 * Quits the app and installs the update.
 */
export function quitAndInstallUpdate() {
  if (!hasUpdate()) return
  log.info('Update is available, quitting app and applying update now... OK')
  autoUpdater.quitAndInstall()
}

/**
 * Initializes the auto updater module.
 *
 * @param options - @see Options
 */
export function initAutoUpdater({ onError, onChecking, onAvailable, onUnavailable, onDownloading, onDownloaded }: Options = {}) {
  autoUpdater.on('error', (err: Error) => {
    log.error(`Checking for updates... ERR: ${err}`)
    onError?.(err)
  })

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for updates...')
    onChecking?.()
  })

  autoUpdater.on('update-available', (info: any) => {
    log.info(`Checking for updates... OK: ${info}`)
    onAvailable?.()
  })

  autoUpdater.on('update-not-available', (info: any) => {
    log.info(`Checking for updates... SKIP: ${info}`)
    onUnavailable?.()
  })

  autoUpdater.on('download-progress', (info: any) => {
    const mappedProgressInfo: ProgressInfo = {
      bytesPerSecond: info.bytesPerSecond ?? NaN,
      bytesTransferred: info.transferred ?? NaN,
      bytesTotal: info.bytesTotal ?? NaN,
      percent: info.percent ?? NaN,
    }

    log.info('Downloading update...', mappedProgressInfo)

    clearUpdateTimer()

    onDownloading?.(mappedProgressInfo)
  })

  autoUpdater.on('update-downloaded', () => {
    log.info('Downloading update... OK')

    _hasUpdate = true

    onDownloaded?.()
  })

  ipcMain.on(IpcMainChannel.CHECK_FOR_UPDATES, () => checkForUpdates())
  ipcMain.on(IpcMainChannel.INSTALL_UPDATES, () => quitAndInstallUpdate())

  checkForUpdates()
}
