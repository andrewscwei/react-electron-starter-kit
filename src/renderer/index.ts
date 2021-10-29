// import { webFrame } from 'electron'
import App from './containers/App'
import { mountAdminPanel } from './utils/admin'
import { mount } from './utils/dom'
import log from './utils/log'

log.info('Starting renderer process... OK')

// window.electron.webFrame.setZoomFactor(1)
// window.electron.webFrame.setVisualZoomLevelLimits(1, 1)

mountAdminPanel('admin')
mount(App, 'app')
