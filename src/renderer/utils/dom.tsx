/**
 * @file Utility functions for DOM-related operations.
 */

import React, { ComponentType } from 'react'
import { hydrate, render } from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter, HashRouterProps } from 'react-router-dom'
import { Store } from 'redux'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { AppAction, AppState, createStore } from '../store'
import globalStyle from '../styles/global'
import * as theme from '../styles/theme'
import { I18nProvider } from './i18n'

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
export function markup(Component: ComponentType, { store = createStore(), hashRouter }: MarkupOptions = {}) {
  const GlobalStyle = createGlobalStyle`
    ${globalStyle}
  `

  return (
    <>
      <GlobalStyle/>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <HashRouter {...hashRouter}>
            <I18nProvider>
              <Component/>
            </I18nProvider>
          </HashRouter>
        </ThemeProvider>
      </Provider>
    </>
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
