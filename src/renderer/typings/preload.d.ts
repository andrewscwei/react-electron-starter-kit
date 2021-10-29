
interface Window {
  /**
   * Shared logging function with the main process.
   */
  log?: import('electron-log').ElectronLog

  app?: {

    /**
     * Opens a URL, app or executable, as supported by the package `open`.
     */
    open: (target: string, options?: import('open').Options) => void

    /**
     * Instructs the main process to check for available updates.
     */
    checkForUpdates: () => void

    /**
     * Instructs the app to enter idle mode.
     */
    enterIdleMode: () => void

    /**
      * Instructs the app to exit idle mode.
      */
    exitIdleMode: () => void

    /**
     * Instructs the main process to install updates (if they are available).
     */
    installUpdates: () => void

    /**
     * Reloads the main window.
     */
    reloadWindow: () => void

    /**
     * Toggles debug mode in the renderer process, enabling/disabling logs.
     */
    toggleDebugMode: () => void

    /**
     * Quits the Electron app.
     */
    quitApp: () => void

    ipcRenderer?: {
      on: import('electron').IpcRenderer['on']
      off: import('electron').IpcRenderer['off']
      send: import('electron').IpcRenderer['send']
    }
  }
}
