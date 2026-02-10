'use server'

import { verifySession } from '@/dal/session'
import { updateUser } from '@/dal/user'
import { renewSession } from '@/utils/authjs/renew-session'
import { Locale } from 'next-intl'

export const updateLocale = async (locale: Locale) => {
  await verifySession()
  await Promise.all([updateUser({ locale }), renewSession({ locale })])
}
