import Polyglot from 'node-polyglot'

const defaultLocale = __I18N_CONFIG__.defaultLocale
const locales = __I18N_CONFIG__.locales
const dict = __I18N_CONFIG__.dict
const polyglots: { [locale: string]: Polyglot } = {}

// In development, require context for all locale translation files and add them to Polyglot so that
// they can be watched by Webpack.
if (process.env.NODE_ENV === 'development') {
  const localeReq = require.context('../../../config/locales', true, /^.*\.json$/)
  localeReq.keys().forEach(path => {
    const locale = path.replace('./', '').replace('.json', '')
    if (!~locales.indexOf(locale)) { return }
    dict[locale] = localeReq(path) as TranslationData
  })
}

// Instantiate one polyglot instance per locale.
for (const locale in dict) {
  if (!dict.hasOwnProperty(locale)) continue

  polyglots[locale] = new Polyglot({
    locale,
    phrases: dict[locale],
  })
}

/**
 * Gets the default locale of this app.
 *
 * @returns The default locale.
 */
export function getDefaultLocale(): string {
  return defaultLocale
}

/**
 * Infers the current locale from a URL.
 *
 * @param path - The URL path.
 *
 * @returns The inferred locale if it exists.
 */
export function getLocaleFromPath(path: string): string | null {
  const locales = __I18N_CONFIG__.locales
  const normalizedPath = path.replace(/\/*$/, '') + '/'
  const possibleLocale = normalizedPath.split('/')[1]

  if (~locales.indexOf(possibleLocale)) {
    return possibleLocale
  }
  else {
    return null
  }
}

/**
 * Returns the localized version of a URL.
 *
 * @param path - The URL path.
 * @param locale - The locale to use for the conversion.
 *
 * @returns The localized URL.
 */
export function getLocalizedPath(path: string, locale: string = __I18N_CONFIG__.defaultLocale): string {
  const t = path.split('/').filter(v => v)

  if (t.length > 0 && __I18N_CONFIG__.locales.indexOf(t[0]) >= 0) {
    t.shift()
  }

  switch (locale) {
  case __I18N_CONFIG__.defaultLocale:
    return `/${t.join('/')}`
  default:
    return `/${locale}/${t.join('/')}`
  }
}

/**
 * Returns the unlocalized version of a URL.
 *
 * @param path - The URL path.
 *
 * @returns The unlocalized path.
 */
export function getUnlocalizedPath(path: string): string {
  const locale = getLocaleFromPath(path)

  if (locale) {
    return path.replace(new RegExp(`^\\/${locale}\\b`, 'i'), '/')
  }
  else {
    return path
  }
}

/**
 * Returns the Polyglot instance associated to a locale.
 *
 * @param locale - The locale.
 *
 * @returns The Polyglot instance.
 */
export function getPolyglotByLocale(locale: string): Polyglot {
  const polyglot = polyglots[locale]

  if (!polyglot) throw new Error(`No Polyglot found for locale "${locale}"`)

  return polyglot
}
