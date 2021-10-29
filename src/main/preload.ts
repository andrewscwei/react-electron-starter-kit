/**
 * @file Preload script to execute before the renderer process is fully loaded. Here we have access
 *       to both renderer process globals (i.e. `window` and `document`) and main process Node.js
 *       environment. Note that this script is executed on the renderer process, so invoking
 *       `console.log`, for example, will result in logs in the dev tools of the browser window.
 */

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import open from 'open'
import IpcMainChannel from '../enums/IpcMainChannel'
import log, { isRendererLoggingEnabled } from './utils/log'

if (isRendererLoggingEnabled()) {
  // eslint-disable-next-line no-console
  for (const dependency of ['Node', 'Electron', 'Chrome']) console.log(`${dependency}:`, `v${process.versions[dependency.toLowerCase()]}`)
}

contextBridge.exposeInMainWorld('log', log.functions)

contextBridge.exposeInMainWorld('app', {
  open: (target: string, options?: open.Options) => open(target, options),
  enterIdleMode: () => ipcRenderer.send(IpcMainChannel.ENTER_IDLE_MODE),
  exitIdleMode: () => ipcRenderer.send(IpcMainChannel.EXIT_IDLE_MODE),
  checkForUpdates: () => ipcRenderer.send(IpcMainChannel.CHECK_FOR_UPDATES),
  installUpdates: () => ipcRenderer.send(IpcMainChannel.INSTALL_UPDATES),
  quitApp: () => ipcRenderer.send(IpcMainChannel.QUIT_APP),
  reloadWindow: () => ipcRenderer.send(IpcMainChannel.RELOAD_WINDOW),
  toggleDebugMode: () => ipcRenderer.send(IpcMainChannel.TOGGLE_DEBUG_MODE),
  ipcRenderer: {
    on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on(channel, listener),
    off: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.off(channel, listener),
    send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
  },
})
