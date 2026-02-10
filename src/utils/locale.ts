import { setDefaultOptions } from 'date-fns'
import { de, enGB } from 'date-fns/locale'
import { Locale } from 'next-intl'

export function setDateFnsDefaultOptions(locale: Locale) {
  setDefaultOptions({ locale: getDateFnsLocale(locale) })
}

export function getDateFnsLocale(locale: Locale) {
  // return locale === 'de' ? de : locale === 'es' ? es : enGB
  return locale === 'de' ? de : enGB
}
