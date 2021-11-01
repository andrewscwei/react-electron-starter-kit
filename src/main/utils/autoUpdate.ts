import { autoUpdater, BrowserWindow, ipcMain } from 'electron'
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

const isDev = process.env.NODE_ENV === 'development'

const feedUrl = appConf.autoUpdateFeedUrl

/**
 * Indicates if the auto updater is already checking for updates.
 */
let isChecking = false

/**
 * Indicates whether the app has a new update. This is used by the autoUpdater.
 */
let _hasUpdate = false

/**
 * Instance of the interval used for checking updates repeatedly.
 */
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
  else if (!isChecking) {
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
  if (!feedUrl) return

  log.info('Stopping periodic update check... OK')
  clearUpdateTimer()
}

/**
 * Checks for updates periodically, as defined by `checkForUpdatesInterval` property in app config file.
 */
export function startPeriodicUpdateCheck() {
  if (isDev || appConf.checkForUpdatesInterval <= 0 || !feedUrl) return clearInterval()

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
export function initAutoUpdater({ onError, onChecking, onAvailable, onUnavailable, onDownloaded }: Options = {}) {
  if (!feedUrl) return

  autoUpdater.setFeedURL({
    url: feedUrl,
  })

  autoUpdater.on('error', (err: Error) => {
    log.error(`Checking for updates... ERR: ${err}`)
    isChecking = false
    onError?.(err)
  })

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for updates...')
    isChecking = true
    onChecking?.()
  })

  autoUpdater.on('update-available', () => {
    log.info('Checking for updates... OK: Began downloading update')
    isChecking = false
    clearUpdateTimer()
    onAvailable?.()
  })

  autoUpdater.on('update-not-available', () => {
    log.info('Checking for updates... SKIP')
    isChecking = false
    onUnavailable?.()
  })

  autoUpdater.on('update-downloaded', (event: Electron.Event, releaseNotes: string, releaseName: string, releaseDate: Date, updateUrl: string) => {
    log.info(`Downloading update... OK: name=${releaseName}, date=${releaseDate}`)

    _hasUpdate = true

    clearUpdateTimer()

    onDownloaded?.()
  })

  ipcMain.on(IpcMainChannel.CHECK_FOR_UPDATES, () => checkForUpdates())
  ipcMain.on(IpcMainChannel.INSTALL_UPDATES, () => quitAndInstallUpdate())

  checkForUpdates()
}
