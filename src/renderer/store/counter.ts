/**
 * @file This is a simple Redux counter example that uses `electron-store` for persistant storage.
 */

import { Action, Dispatch } from 'redux'
import cache from '../utils/cache'
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
  count: (cache.get('count') as number) ?? 0,
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
    cache.set('count', t)
    return { count: t }
  }
  case CounterActionType.RESET:
    cache.set('count', 0)
    return { count: 0 }
  default:
    return state
  }
}
