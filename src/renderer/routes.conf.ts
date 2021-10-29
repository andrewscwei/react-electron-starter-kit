/**
 * @file Route definitions for React router.
 */

import { RouteConfig } from 'react-router-config'
import Home from './containers/Home'

const config: RouteConfig[] = [{
  path: '/',
  exact: true,
  component: Home,
}]

export default config
