/**
 * @file Utility functions for DOM-related operations.
 */

import React, { ComponentType } from 'react'
import { hydrate, render } from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter, HashRouterProps } from 'react-router-dom'
import { Store } from 'redux'
import { ThemeProvider } from 'styled-components'
import { AppAction, AppState, createStore } from '../store'
import * as theme from '../styles/theme'

type MarkupOptions = {
  store?: Store<AppState, AppAction>
  hashRouter?: HashRouterProps
}

/**
* Factory function for generating base React app markup.
*
* @param Component - The React component to wrap around.
* @param options - @see MarkupOptions
*
* @returns The JSX markup.
*/
export function markup(Component: ComponentType, { store = createStore(), hashRouter }: MarkupOptions = {}): JSX.Element {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <HashRouter {...hashRouter}>
          <Component/>
        </HashRouter>
      </ThemeProvider>
    </Provider>
  )
}

/**
* Mounts a React component to a DOM element.
*
* @param Component - The React component to mount.
* @param elementId - The ID of the DOM element to mount the React component to.
*/
export function mount(Component: ComponentType, elementId = 'app') {
  if (process.env.NODE_ENV === 'development') {
    render(markup(Component), document.getElementById(elementId))
  }
  else {
    hydrate(markup(Component), document.getElementById(elementId))
  }
}
