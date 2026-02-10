import 'server-only'

import WelcomeEmail from '@/emails/welcome-email'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { getErrorMessage } from '../error/get-error-message'
import { origin } from '../server-origin'
import { send } from './send'

export const sendWelcome = async (email: string) => {
  try {
    const cookieStore = await cookies()
    const locale = (cookieStore.get('NEXT_LOCALE')?.value ?? 'es') as Locale
    const t = await getTranslations({ locale, namespace: 'email.welcome' })
    const tFooter = await getTranslations({ locale, namespace: 'email.footer' })
    await send({
      from: 'TokenKey <no-reply@tokenkey.io>',
      react: WelcomeEmail({
        heading: t('heading'),
        greeting: t('greeting'),
        introText: t('introText'),
        nextStepsText: t('nextStepsText'),
        step1: t('step1'),
        step2: t('step2'),
        step3: t('step3'),
        ctaText: t('ctaText'),
        origin,
        locale,
        supportText: tFooter('supportText'),
        footerText: tFooter('footerText'),
        terms: {
          tokenKey: `https://www.tokenkey.io/${locale}/terms-and-conditions`,
          concedus: 'https://link.concedus.com/tcta',
          nyala:
            locale === 'de'
              ? 'https://tokenkey.io/external/nyala/20250327_Smart_Registry_AGB_Registerführung_DE.pdf'
              : 'https://tokenkey.io/external/nyala/20250509_Smart_Registry_AGB_Registerführung_ENG.pdf',
        },
      }),
      subject: t('subject'),
      // Fallback for email clients that don't render HTML, e.g. feature phones
      text: t('subject'),
      to: [email],
    })
  } catch (error) {
    const message = getErrorMessage(error)
    console.log('❌ could not send welcome:', message)
  }
}
