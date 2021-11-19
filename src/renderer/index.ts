import App from './App'
import { mountAdminPanel } from './utils/admin'
import { mount } from './utils/dom'
import log from './utils/log'

log.info('Starting renderer process... OK')

mountAdminPanel('admin')
mount(App, 'app')
