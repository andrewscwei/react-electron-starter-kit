/**
 * @file The global admin panel. Once added, you can toggle this panel by clicking the top left
 *       corner of the screen 5x consecutively within 500ms (default) intervals. This component
 *       handles the following for you:
 *         1. Toggling on-screen debugging
 *         2. Checks/installs app updates manually or automatically whenever the app is idle
 *            (override the default timeout in `app.conf.ts`)
 *         3. Other useful debugging features such as refreshing the app and quitting the app
 *
 *       This component renders `Settings.tsx` as a child component, which can be customized to
 *       include app-specific settings.
 */

import classNames from 'classnames'
import { IpcRendererEvent } from 'electron'
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import IpcRendererChannel, { IpcRendererChannelPayload } from '../../enums/IpcRendererChannel'
import UpdateStatus from '../../enums/UpdateStatus'
import Settings from '../components/Settings'
import app from '../utils/app'
import log from '../utils/log'

/**
 * Width of the admin panel.
 */
const PANEL_WIDTH = 300

/**
 * Timeout in between click intervals when activating the admin panel, in ms.
 */
const ACTIVATION_TIMEOUT_INTERVAL = 500

/**
 * Number of times to click on the top left corner of the screen to activate the admin panel.
 */
const ACTIVATION_MAX_TRIGGER_COUNT = 5

/**
 * Main accent color for the admin panel.
 */
const ACCENT_COLOR = '#b50e0e'

type Props = {

}

type State = {
  activationCount: number
  activationTimeout?: number
  appInfo?: IpcRendererChannelPayload['APP_INFO_READY']
  appStatus: string
  debugEnabled: boolean
  idleTimeout?: number
  isActive: boolean
  isUpdateReady: boolean
}

class Admin extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      activationCount: 0,
      activationTimeout: undefined,
      appInfo: undefined,
      appStatus: 'WARNING: For devs only',
      debugEnabled: false,
      idleTimeout: undefined,
      isActive: false,
      isUpdateReady: false,
    }
  }

  componentDidMount() {
    app.ipcRenderer.on(IpcRendererChannel.UPDATE_STATUS_CHANGED, this.onUpdateStatusChanged)
    app.ipcRenderer.on(IpcRendererChannel.APP_INFO_READY, this.onAppInfoReady)
    app.ipcRenderer.on(IpcRendererChannel.DEBUG_MODE_CHANGED, this.onDebugModeChanged)

    document.addEventListener('pointerup', this.onWindowPointerUp)
    document.addEventListener('keyup', this.onWindowKeyUp)

    this.restartIdleTimeout()
  }

  componentWillUnmount() {
    app.ipcRenderer.off(IpcRendererChannel.UPDATE_STATUS_CHANGED, this.onUpdateStatusChanged)
    app.ipcRenderer.off(IpcRendererChannel.APP_INFO_READY, this.onAppInfoReady)
    app.ipcRenderer.off(IpcRendererChannel.DEBUG_MODE_CHANGED, this.onDebugModeChanged)

    document.removeEventListener('pointerup', this.onWindowPointerUp)
    document.removeEventListener('keyup', this.onWindowKeyUp)

    if (this.state.idleTimeout) clearTimeout(this.state.idleTimeout)
    if (this.state.activationTimeout) clearTimeout(this.state.activationTimeout)
  }

  render() {
    const { appInfo, appStatus, debugEnabled, isUpdateReady, isActive } = this.state

    return (
      <StyledRoot isActive={isActive}>
        <StyledStatus>
          <span>{appStatus}</span>
        </StyledStatus>
        <StyledHeader>
          <h1>{appInfo?.name ?? 'asdfsadfasdfasfjaksdfjdas;fjad;lsf;adlsjfks;a'}</h1>
          <aside>
            <span>{`v${appInfo?.version ?? '???'}`}</span>
            <span>{appInfo?.ip ?? '???.???.???.???'}</span>
          </aside>
        </StyledHeader>
        <StyledSettings/>
        <StyledControls>
          <StyledControlButton className={classNames({ active: debugEnabled })} onClick={() => app.toggleDebugMode()}>Debug Mode</StyledControlButton>
          <StyledControlButton onClick={() => app.checkUpdates()}>Check Updates</StyledControlButton>
          <StyledControlButton onClick={() => app.installUpdates()} disabled={!isUpdateReady}>Install updates</StyledControlButton>
          <StyledControlButton onClick={() => app.reloadWindow()}>Reload Window</StyledControlButton>
          <StyledControlButton onClick={() => app.quitApp()}>Quit App</StyledControlButton>
          <StyledControlButton onClick={() => this.deactivate()}>Close Panel</StyledControlButton>
        </StyledControls>
      </StyledRoot>
    )
  }

  /**
   * Activates the admin panel.
   */
  private activate() {
    this.cancelPendingActivation()
    this.setState({ isActive: true })
  }

  /**
   * Deactivates the admin panel.
   */
  private deactivate() {
    this.setState({ isActive: false })
  }

  /**
   * Method invoked when the app info is ready to be read. This event is emitted via IPC from the
   * main process.
   *
   * @param event - The IPC event.
   * @param appInfo - The app info.
   */
  private onAppInfoReady = (event: IpcRendererEvent, appInfo: IpcRendererChannelPayload['APP_INFO_READY']) => {
    this.setState({ appInfo })
  }

  /**
   * Method invoked when the debug mode of the renderer process is changed. This event is emitted
   * via IPC from the main process.
   *
   * @param event - The IPC event.
   * @param isEnabled - Whether debug mode is enabled after the change.
   */
  private onDebugModeChanged = (event: IpcRendererEvent, isEnabled: IpcRendererChannelPayload['DEBUG_MODE_CHANGED']) => {
    this.setState({ debugEnabled: isEnabled })
  }

  /**
   * Method invoked when the update status changes. This event is emitted via IPC from the main
   * process.
   *
   * @param event - The IPC event
   * @param data - The emitted by this event.
   */
  private onUpdateStatusChanged = (event: IpcRendererEvent, data: IpcRendererChannelPayload['UPDATE_STATUS_CHANGED']) => {
    switch (data.status) {
    case UpdateStatus.AVAILABLE:
      log.info('Checking for updates... OK: Update is available')
      this.setState({ appStatus: 'Update is available' })
      break
    case UpdateStatus.NOT_AVAILABLE:
      log.info('Checking for updates... OK: App is up-to-date')
      this.setState({ appStatus: 'App is up-to-date' })
      break
    case UpdateStatus.CHECKING:
      log.info('Checking for updates...')
      this.setState({ appStatus: 'Checking for updates...' })
      break
    case UpdateStatus.ERROR:
      log.error(`Checking for updates... ERR: ${data.error}`)
      this.setState({ appStatus: `${data.error}` })
      break
    case UpdateStatus.DOWNLOADING: {
      const toMB = (b: number) => ((b/(1024*1024)).toFixed(2))
      const progress = data.progress ? ` (${Math.floor(data.progress.percent)}% of ${toMB(data.progress.total)}MB at ${toMB(data.progress.bytesPerSecond)}MB/s)` : ''

      this.setState({
        isUpdateReady: false,
        appStatus: `Downloading... ${progress}`,
      })

      log.info(`Checking for updates... OK: Downloading ${progress}`)
      break
    }
    case UpdateStatus.DOWNLOADED:
      log.info('Checking for updates... OK: Successfully downloaded update')

      this.setState({
        isUpdateReady: true,
        appStatus: 'Update is ready to be installed',
      })
      break
    }
  }

  /**
   * Method invoked when the window detects a pointer up event. This component listens for this
   * event to determine if the active state of the component should be enabled. Active state is only
   * triggered if a pointer up event is detected within the 100px x 100px square region at the top
   * left corner of the window, after `ACTIVATION_MAX_TRIGGER_COUNT` consecutive times within a
   * certain time interval as specifiec by `ACTIVATION_TIMEOUT_INTERVAL`.
   *
   * @param event - The `PointerEvent`.
   */
  private onWindowPointerUp = ({ clientX: x, clientY: y }: PointerEvent) => {
    this.restartIdleTimeout()

    if (x > 100 || y > 100) return this.cancelPendingActivation()

    this.setState({ activationCount: this.state.activationCount + 1 })
    this.waitForActivation()

    if (this.state.activationCount < ACTIVATION_MAX_TRIGGER_COUNT) return

    this.activate()
  }

  /**
   * Method invoked when the window detects a key up event. Key up events help determine if the app
   * is idle.
   *
   * @param event - The `KeyboardEvent`.
   */
  private onWindowKeyUp = (event: KeyboardEvent) => {
    this.restartIdleTimeout()
  }

  /**
   * Initiates the activation process. Begin counting the number of pointer up events and ensure
   * that consecutive events are within a specified time interval.
   */
  private waitForActivation() {
    if (this.state.activationTimeout) clearTimeout(this.state.activationTimeout)

    this.setState({
      activationTimeout: window.setTimeout(() => this.cancelPendingActivation(), ACTIVATION_TIMEOUT_INTERVAL),
    })
  }

  /**
   * Cancels the activation process altogether, resets the click count to 0.
   */
  private cancelPendingActivation() {
    if (this.state.activationTimeout) clearTimeout(this.state.activationTimeout)

    this.setState({
      activationTimeout: undefined,
      activationCount: 0,
    })
  }

  /**
   * Restarts the idle timeout.
   */
  private restartIdleTimeout() {
    if (this.state.idleTimeout) clearTimeout(this.state.idleTimeout)

    app.exitIdleMode()

    const timeout = window.setTimeout(() => {
      app.enterIdleMode()
      if (this.state.idleTimeout) clearTimeout(this.state.idleTimeout)
      this.setState({ idleTimeout: undefined })
    }, __APP_CONFIG__.idleTimeout)

    this.setState({
      idleTimeout: timeout,
    })
  }
}

export default Admin

const StyledStatus = styled.div`
  align-items: center;
  background: ${ACCENT_COLOR};
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: row;
  height: 50px;
  justify-content: center;
  padding: 0 10px;

  span {
    font-size: 12px;
    max-width: 100%;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }
`

const StyledHeader = styled.div`
  padding: 20px 12px;

  h1 {
    color: #fff;
    font-size: 16px;
    margin: 0;
    text-align: left;
    text-transform: uppercase;
    word-break: break-all;
  }

  > aside {
    align-items: center;
    display: flex;
    margin: 5px -5px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;

    > span {
      align-items: center;
      background: ${ACCENT_COLOR};
      color: #fff;
      display: flex;
      font-size: 12px;
      height: 20px;
      justify-content: center;
      margin: 5px;
      padding: 0 8px;
    }
  }
`

const StyledSettings = styled(Settings)`
  flex-grow: 1;
  height: auto;
  padding: 20px 10px;
  width: 100%;
`

const StyledControls = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: auto;
  padding: 2.5px;
  width: 100%;
`

const StyledControlButton = styled.button`
  background: #000;
  border: 0;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  font-family: sans-serif;
  font-size: 10px;
  font-style: normal;
  font-weight: 100;
  height: ${(PANEL_WIDTH - (5 * 4)) / 3}px;
  hyphens: auto;
  letter-spacing: 2px;
  line-height: 1.4em;
  margin: 2.5px;
  outline: 0;
  padding: 20px;
  text-transform: uppercase;
  transition: all 200ms ease-out;
  width: ${(PANEL_WIDTH - (5 * 4)) / 3}px;

  &:hover {
    opacity: .8;
  }

  &[disabled] {
    opacity: .4;
    pointer-events: none;
  }

  &.active {
    background: ${ACCENT_COLOR};
  }
`

const StyledRoot = styled.div<{ isActive: boolean}>`
  background: #111;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  font-family: RobotoMono, monospace;
  font-size: 16px;
  font-weight: 400;
  height: 100%;
  left: 0;
  margin: 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  transform: ${props => props.isActive ? 'translate3d(0, 0, 0)' : 'translate3d(-100%, 0, 0)'};
  transition: transform 200ms ease-out;
  width: ${PANEL_WIDTH}px;
  z-index: 16777271;
`
