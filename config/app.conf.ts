/**
 * @file App configuration, defines various behaviors of the app.
 */

export default {
  /**
   * Default locale to use. This is only used if there is more than one locale file in your config.
   */
  locales: ['en', 'ja'],

  /**
   * Time interval to check for updates in milliseconds. Defaults to 2 hours.
   */
  checkForUpdatesInterval: 60 * 1000,

  /**
   * Specifies if auto updater should be enabled.
   */
  autoUpdate: false,

  /**
   * Time it takes for the app to be marked as idle so auto update can kick in, in milliseconds.
   * Defaults to 1 hour.
   */
  idleTimeout: 60 * 60 * 1000,

  /**
   * Specifies if the app window should launch to fullscreen in production.
   */
  autoFullscreen: process.env.APP_FULLSCREEN === 'true' ? true : false,

  /**
   * Sets the window position at launch.
   */
  windowPosition: {
    x: process.env.APP_WINDOW_X ? Number(process.env.APP_WINDOW_X) : undefined,
    y: process.env.APP_WINDOW_Y ? Number(process.env.APP_WINDOW_Y) : undefined,
  },

  /**
   * Sets the window size at launch.
   */
  windowSize: {
    width: process.env.APP_WINDOW_WIDTH ? Number(process.env.APP_WINDOW_WIDTH) : undefined,
    height: process.env.APP_WINDOW_HEIGHT ? Number(process.env.APP_WINDOW_HEIGHT) : undefined,
  },
}
