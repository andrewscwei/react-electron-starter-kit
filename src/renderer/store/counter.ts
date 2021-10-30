/**
 * @file This is a simple Redux counter example that uses `electron-store` for persistant storage.
 */

import { Action, Dispatch } from 'redux'
import log from '../utils/log'

export type CounterState = {
  count: number
}

export enum CounterActionType {
  CHANGED = 'counter/CHANGED',
  RESET = 'counter/RESET'
}

export interface CounterAction extends Action<CounterActionType> {
  change?: number
}

const initialState: CounterState = {
  count: 0,
}

export function increment() {
  log.info('Incrementing count by 1... OK')

  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: CounterActionType.CHANGED,
      change: 1,
    })
  }
}

export function reset() {
  log.info('Resetting count... OK')

  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: CounterActionType.RESET,
    })
  }
}

export default function reducer(state = initialState, action: CounterAction): CounterState {
  switch (action.type) {
  case CounterActionType.CHANGED: {
    const t = state.count + (action.change ?? 0)
    return { count: t }
  }
  case CounterActionType.RESET:
    return { count: 0 }
  default:
    return state
  }
}
