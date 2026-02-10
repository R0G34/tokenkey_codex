import 'server-only'

import MagicLinkEmail from '@/emails/magic-link-email'
import { getTranslations } from 'next-intl/server'
import { CreateEmailOptions } from 'resend'
import { getLocaleForAuthEmail } from '../authjs/get-locale-for-auth-email'
import { send } from './send'

export const sendMagicLink = async (
  from: CreateEmailOptions['from'],
  origin: string,
  to: CreateEmailOptions['to'],
  url: string,
) => {
  const locale = await getLocaleForAuthEmail()
  const t = await getTranslations({ locale, namespace: 'email.verify' })
  const tFooter = await getTranslations({ locale, namespace: 'email.footer' })
  await send({
    from,
    react: MagicLinkEmail({
      email: {
        button: t('button'),
        heading: t('heading'),
        preview: t('preview'),
        text: t('text'),
        text2: t('text2'),
        notice: t('notice'),
        noticeTitle: t('noticeTitle'),
      },
      footerText: tFooter('footerText'),
      supportText: tFooter('supportText'),
      url,
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
