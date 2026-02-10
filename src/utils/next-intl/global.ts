import accountEn from '@/i18n/messages/account/en.json'
import appEn from '@/i18n/messages/app/en.json'
import authEn from '@/i18n/messages/auth/en.json'
import countryEn from '@/i18n/messages/country/en.json'
import emailEn from '@/i18n/messages/email/en.json'
import en from '@/i18n/messages/en.json'
import errorEn from '@/i18n/messages/error/en.json'
import faqEn from '@/i18n/messages/faq/en.json'
import homeEn from '@/i18n/messages/home/en.json'
import inboxEn from '@/i18n/messages/inbox/en.json'
import investmentEn from '@/i18n/messages/investment/en.json'
import legalsEn from '@/i18n/messages/legals/en.json'
import notFoundEn from '@/i18n/messages/not-found/en.json'
import onboardingEn from '@/i18n/messages/onboarding/en.json'
import projectEn from '@/i18n/messages/project/en.json'
import { routing } from '@/i18n/routing'

// Create a new type by combining all message types
type Messages = typeof en &
  typeof onboardingEn &
  typeof authEn &
  typeof emailEn &
  typeof homeEn &
  typeof projectEn &
  typeof notFoundEn &
  typeof errorEn &
  typeof countryEn &
  typeof faqEn &
  typeof inboxEn &
  typeof investmentEn &
  typeof legalsEn &
  typeof accountEn &
  typeof appEn

declare module 'next-intl' {
  interface AppConfig {
    // Locale: (typeof routing.locales)[number]
    Locale: (typeof routing.defaultLocale)[number]
    Messages: Messages
  }
}
