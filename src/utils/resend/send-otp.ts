import 'server-only'

import OTPEmail from '@/emails/otp-email'
import { getTranslations } from 'next-intl/server'
import { CreateEmailOptions } from 'resend'
import { getLocaleForAuthEmail } from '../authjs/get-locale-for-auth-email'
import { send } from './send'

export const sendOTP = async (
  from: CreateEmailOptions['from'],
  origin: string,
  to: CreateEmailOptions['to'],
  token: string,
) => {
  const locale = await getLocaleForAuthEmail()
  const t = await getTranslations({ locale, namespace: 'email.verify' })
  const tFooter = await getTranslations({ locale, namespace: 'email.footer' })
  await send({
    from,
    react: OTPEmail({
      email: {
        heading: t('otp.heading'),
        hint: t('otp.hint'),
        notice: t('notice'),
        noticeTitle: t('noticeTitle'),
        preview: t('preview'),
        text: t('otp.text'),
      },
      footerText: tFooter('footerText'),
      supportText: tFooter('supportText'),
      token,
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
    to,
  })
}
