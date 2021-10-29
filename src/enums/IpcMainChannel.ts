/**
 * @file Enum of IPC channels and payloads to be handled on the main process.
 */

export default {
  CHECK_UPDATES: '@ipcMain/CHECK_UPDATES',
  ENTER_IDLE_MODE: '@ipcMain/ENTER_IDLE_MODE',
  EXIT_IDLE_MODE: '@ipcMain/EXIT_IDLE_MODE',
  INSTALL_UPDATES: '@ipcMain/INSTALL_UPDATES',
  QUIT_APP: '@ipcMain/QUIT_APP',
  RELOAD_WINDOW: '@ipcMain/RELOAD_WINDOW',
  TOGGLE_DEBUG_MODE: '@ipcMain/TOGGLE_DEBUG_MODE',
}
