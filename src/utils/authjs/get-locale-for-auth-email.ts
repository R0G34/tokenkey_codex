'use server'

import { Locale } from 'next-intl'
import { cookies } from 'next/headers'
import { localeForAuthEmailCookieName } from './locale-for-auth-email-cookie-name'

export const getLocaleForAuthEmail = async () => {
  // api route /api/auth/... and the api is not within [locale] folder so the locale is not initialized and getLocale() is always returning defaultLocale.
  // so server side, we can simply directly read the cookie NEXT_LOCALE created by next-intl.
  // this cookie is not always present, so as a fallback, we use ou own cookie.
  const cookieStore = await cookies()
  return (cookieStore.get('NEXT_LOCALE')?.value ??
    cookieStore.get(localeForAuthEmailCookieName)?.value ??
    // 'es') as Locale
    'en') as Locale
}
