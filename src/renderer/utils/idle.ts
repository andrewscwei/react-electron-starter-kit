import app from './app'

let _isIdle = false
let idleTimeout: number | undefined
let enterIdleModeHandler: (() => void) | undefined
let exitIdleModeHandler: (() => void) | undefined

/**
 * Initiallizes the idler.
 */
export function initIdler(onEnterIdleMode?: () => void, onExitIdleMode?: () => void) {
  enterIdleModeHandler = onEnterIdleMode
  exitIdleModeHandler = onExitIdleMode

  document.addEventListener('pointerup', onWindowPointerUp)
  document.addEventListener('keyup', onWindowKeyUp)

  restartIdleTimeout()
}

/**
 * Deinitializes the idler.
 */
export function deinitIdler() {
  enterIdleModeHandler = undefined
  exitIdleModeHandler = undefined

  clearIdleTimeout()

  document.removeEventListener('pointerup', onWindowPointerUp)
  document.removeEventListener('keyup', onWindowKeyUp)
}

/**
 * Indicates if the app is currently in idle mode.
 *
 * @returns `true` if idle, `false` otherwise.
 */
export function isIdle() {
  return _isIdle
}

/**
 * Enters idle mode.
 */
export function enterIdleMode() {
  if (isIdle() && !idleTimeout) return
  clearIdleTimeout()
  enterIdleModeHandler?.()
  app?.enterIdleMode?.()
}

/**
 * Exits idle mode.
 */
export function exitIdleMode() {
  if (!isIdle() && !idleTimeout) return
  clearIdleTimeout()
  exitIdleModeHandler?.()
  app?.exitIdleMode?.()
}

/**
 * Restarts the idle timeout.
 */
function restartIdleTimeout() {
  exitIdleMode()
  idleTimeout = window.setTimeout(() => enterIdleMode(), __APP_CONFIG__.idleTimeout)
}

/**
 * Clears the idle timeout.
 */
function clearIdleTimeout() {
  if (!idleTimeout) return
  window.clearTimeout(idleTimeout)
  idleTimeout = undefined
}

/**
 * Method invoked when the window detects a pointer up event. Pointer up events help determine if
 * the app is idle.
 *
 * @param event - The `PointerEvent`.
 */
function onWindowPointerUp(event: PointerEvent) {
  restartIdleTimeout()
}

/**
 * Method invoked when the window detects a key up event. Key up events help determine if the app
 * is idle.
 *
 * @param event - The `KeyboardEvent`.
 */
function onWindowKeyUp(event: KeyboardEvent) {
  restartIdleTimeout()
}
