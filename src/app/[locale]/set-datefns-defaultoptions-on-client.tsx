'use client'

import { setDateFnsDefaultOptions } from '@/utils/locale'
import { Locale } from 'next-intl'

export default function SetDateFnsDefaultOptionsOnClient({
  locale,
}: Readonly<{ locale: Locale }>) {
  setDateFnsDefaultOptions(locale)
  return null
}
