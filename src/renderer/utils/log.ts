import { IpcRendererEvent } from 'electron'
import IpcRendererChannel, { IpcRendererChannelPayload } from '../../enums/IpcRendererChannel'
import app from './app'

let _isEnabled = false

app.ipcRenderer.on(IpcRendererChannel.DEBUG_MODE_CHANGED, (event: IpcRendererEvent, isEnabled: IpcRendererChannelPayload['DEBUG_MODE_CHANGED']) => {
  _isEnabled = isEnabled
})

const log = {
  error: (...args: any[]) => { if (_isEnabled) window.log.error(...args) },
  warn: (...args: any[]) => { if (_isEnabled) window.log.warn(...args) },
  info: (...args: any[]) => { if (_isEnabled) window.log.info(...args) },
  verbose: (...args: any[]) => { if (_isEnabled) window.log.verbose(...args) },
  debug: (...args: any[]) => { if (_isEnabled) window.log.debug(...args) },
  silly: (...args: any[]) => { if (_isEnabled) window.log.silly(...args) },
}

export default log
