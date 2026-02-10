import { Locale } from 'next-intl'
import { api } from './api'

export const createUser = async (email: string, locale: Locale) => {
  return api('users', 'POST', {
    connection: 'email',
    email,
    email_verified: true,
    user_metadata: { preferredLanguage: locale },
    verify_email: false,
  })
}
