import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer'
import reload from 'electron-reload'
import path from 'path'
import log from './log'

export function initDevEnvironment() {
  log.debug(`Debug environment detected, enabling auto reloading enabled for directory ${__dirname} and main module ${__filename}... OK`)

  reload(__dirname, {
    electron: path.join(__dirname, '../', 'node_modules', '.bin', 'electron'),
    electronArgv: ['-r', 'dotenv/config', __filename] as any,
    forceHardReset: true,
    hardResetMethod: 'exit',
  })

  // installExtension(REACT_DEVELOPER_TOOLS)
  //   .then((name: string) => log.debug(`Added DevTools extension: ${name}`))
  //   .catch((err: Error) => log.error('An error occured while installing devtools:', err))

  installExtension(REDUX_DEVTOOLS)
    .then((name: string) => log.debug(`Added DevTools extension: ${name}`))
    .catch((err: Error) => log.error('An error occured while installing devtools:', err))
}
