/**
 * @file Route definitions for React router.
 */

import { ComponentType } from 'react'
import Home from './containers/Home'

type RouteConfig = {
  component: ComponentType<any>
  path: string
}

const config: RouteConfig[] = [{
  component: Home,
  path: '/',
}]

export default config
