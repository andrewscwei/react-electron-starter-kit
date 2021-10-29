/**
 * @file Enum of IPC channels and payloads to be handled on the renderer process.
 */

import UpdateStatus from './UpdateStatus'

export type IpcRendererChannelPayload = {
  APP_INFO_READY: {
    name: string
    version: string
    ip: string
  }
  DEBUG_MODE_CHANGED: boolean
  UPDATE_STATUS_CHANGED: {
    status: UpdateStatus
    progress?: {
      percent: number
      total: number
      bytesPerSecond: number
    }
    error?: Error
  }
}

export default {
  APP_INFO_READY: '@ipcRenderer/APP_INFO_READY',
  DEBUG_MODE_CHANGED: '@ipcRenderer/DEBUG_MODE_CHANGED',
  UPDATE_STATUS_CHANGED: '@ipcRenderer/UPDATE_STATUS_CHANGED',
}
