import { applyMiddleware, combineReducers, createStore as _createStore } from 'redux'
import thunk from 'redux-thunk'
import counter from './counter'

export type AppState = NonNullable<Parameters<typeof reducer>[0]>

export type AppAction = NonNullable<Parameters<typeof reducer>[1]>

export const reducer = combineReducers({
  counter,
})

export function createStore(initialState: Partial<AppState> = {}) {
  return _createStore(reducer, initialState, applyMiddleware(thunk))
}
