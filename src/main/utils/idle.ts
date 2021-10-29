import { ipcMain } from 'electron'
import IpcMainChannel from '../../enums/IpcMainChannel'
import log from './log'

let _isRendererIdle = false

/**
 * Indicates whether the renderer process is currently in idle mode.
 *
 * @returns `true` if the renderer process is currently in idle mode, `false` otherwise.
 */
export function isRendererIdle() {
  return _isRendererIdle
}

export function initRendererIdleModeEvents(onEnterIdleMode?: () => void, onExitIdleMode?: () => void) {
  ipcMain.on(IpcMainChannel.ENTER_IDLE_MODE, () => {
    log.info('Entering idle mode... OK')

    _isRendererIdle = true

    onEnterIdleMode?.()
  })

  ipcMain.on(IpcMainChannel.EXIT_IDLE_MODE, () => {
    if (_isRendererIdle) {
      log.info('Exiting idle mode... OK')
      _isRendererIdle = false
    }

    onExitIdleMode?.()
  })
}
