import Polyglot from 'node-polyglot'
import { Action } from 'redux'
import { getPolyglotByLocale } from '../utils/i18n'

export type I18nState = {
  locale: string
  ltxt: typeof Polyglot.prototype.t
}

export enum I18nActionType {
  CHANGE_LOCALE = 'i18n/CHANGE_LOCALE'
}

export interface I18nAction extends Action<I18nActionType> {
  payload: Partial<I18nState>
}

const defaultLocale = __I18N_CONFIG__.defaultLocale

const initialState: I18nState = {
  locale: defaultLocale,
  ltxt: (...args) => getPolyglotByLocale(defaultLocale).t(...args),
}

export function changeLocale(locale: string): I18nAction {
  return {
    type: I18nActionType.CHANGE_LOCALE,
    payload: {
      locale,
      ltxt: (...args) => getPolyglotByLocale(locale).t(...args),
    },
  }
}

export default function reducer(state: I18nState = initialState, action: I18nAction): I18nState {
  switch (action.type) {
  case I18nActionType.CHANGE_LOCALE:
    return {
      ...state,
      ...action.payload,
    }
  default:
    return state
  }
}
