declare const __APP_CONFIG__: Record<string, any>
declare const __I18N_CONFIG__: Readonly<{
  defaultLocale: string
  locales: string
  dict: TranslationDataDict
}>

declare module '*.svg'
declare module '*.jpg'
declare module '*.png'

type TranslationData = { [key: string]: string | TranslationData }
type TranslationDataDict = Record<string, TranslationData>

interface Window {
  __BUILD_NUMBER__: string
  __VERSION__: string
}
