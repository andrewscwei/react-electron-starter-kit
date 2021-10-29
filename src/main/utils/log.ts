/**
 * @file Custom logger.
 */

import log from 'electron-log'

const isDev = process.env.NODE_ENV === 'development'

/**
 * In-memory flag to determine if renderer logs are enabled.
 */
let _isRendererLoggingEnabled = isDev

/**
 * Customize logging to console (for both main and renderer processes).
 */
log.transports.console.format = '{h}:{i}:{s} [{level}] {text}'
log.transports.console.level = isDev ? 'silly' : false

/**
 * Customize logging to file (for both main and renderer processes). By default the logs are output
 * to the following locations:
 *   - on Linux: `~/.config/{app name}/logs/{process type}.log`
 *   - on OS X: `~/Library/Logs/{app name}/{process type}.log`
 *   - on Windows: `%USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log`
 */
log.transports.file.format = '{h}:{i}:{s} [{level}] {text}'
log.transports.file.level = isDev ? 'silly' : 'info'

if (log.transports.ipc) {
  log.transports.ipc.level = false
}

export default log

/**
 * Enables logs in the renderer process.
 */
export function enableRendererLogging() {
  if (_isRendererLoggingEnabled) return
  log.info('Enabling logs in rendering process... OK')
  _isRendererLoggingEnabled = true
}

/**
 * Disables logs in the renderer process.
 */
export function disableRendererLogging() {
  if (!_isRendererLoggingEnabled) return
  log.info('Disabling logs in rendering process... OK')
  _isRendererLoggingEnabled = false
}

/**
 * Indicates if logs are enabled in the renderer process.
 *
 * @returns `true` if enabled, `false` otherwise.
 */
export function isRendererLoggingEnabled(): boolean {
  return _isRendererLoggingEnabled
}

/**
 * Enables IPC logging. IPC logging allows for displaying main and renderer logs to both the
   DevTools console and the main console. If `level` is set to `false`, the logs will not be
   combined and will only be sent to the respective console of the process.
 */
export function enableIpcLogging() {
  if (!log.transports.ipc) return
  log.transports.ipc.level = 'silly'
}

/**
 * Disables IPC logging. IPC logging allows for displaying main and renderer logs to both the
   DevTools console and the main console. If `level` is set to `false`, the logs will not be
   combined and will only be sent to the respective console of the process.
 */
export function disableIpcLogging() {
  if (!log.transports.ipc) return
  log.transports.ipc.level = false
}
