import { applyMiddleware, combineReducers, createStore as _createStore } from 'redux'
import thunk from 'redux-thunk'
import counter from './counter'
import i18n from './i18n'

export type AppState = NonNullable<Parameters<typeof reducer>[0]>

export type PartialAppState = {
  [P in keyof AppState]?: AppState[P]
}

export type AppAction = NonNullable<Parameters<typeof reducer>[1]>

export const reducer = combineReducers({
  counter,
  i18n,
})

export function createStore(initialState: PartialAppState = {}) {
  return _createStore(reducer, initialState, applyMiddleware(thunk))
}
