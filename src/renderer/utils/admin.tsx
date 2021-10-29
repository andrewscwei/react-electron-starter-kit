import React from 'react'
import { hydrate, render } from 'react-dom'
import Admin from '../containers/Admin'

/**
 * Mounts the admin panel to a DOM element.
 *
 * @param elementId The ID of the DOM element to mount the admin panel to.
 */
export function mountAdminPanel(elementId = 'admin') {
  if (process.env.NODE_ENV === 'development') {
    render(<Admin/>, document.getElementById(elementId))
  }
  else {
    hydrate(<Admin/>, document.getElementById(elementId))
  }
}
