import 'server-only'

import TransactionCompletedEmail from '@/emails/transaction-completed-email'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { currencyFormatter } from '../currency-formatter'
import { origin } from '../server-origin'
import { send } from './send'

export const sendTransactionCompleted = async (
  amount: number,
  email: string,
  firstname: string,
  locale: Locale,
  reference: string,
) => {
  // Here, locale has not been initialized based on url.
  const t = await getTranslations({
    locale,
    namespace: 'email.transaction-completed',
  })
  const tFooter = await getTranslations({ locale, namespace: 'email.footer' })
  await send({
    from: 'TokenKey <no-reply@tokenkey.io>',
    react: TransactionCompletedEmail({
      heading: t('heading'),
      greeting: t('greeting'),
      mainText: t('mainText'),
      amount,
      amountText: t('amountText'),
      referenceText: t('referenceText'),
      nextStepsText: t('nextStepsText'),
      step1: t('step1'),
      step2: t('step2'),
      step3: t('step3'),
      ctaText: t('ctaText'),
      origin,
      locale,
      supportText: tFooter('supportText'),
      footerText: tFooter('footerText'),
      reference,
      terms: {
        tokenKey: `https://www.tokenkey.io/${locale}/terms-and-conditions`,
        concedus: 'https://link.concedus.com/tcta',
        nyala:
          locale === 'de'
            ? 'https://tokenkey.io/external/nyala/20250327_Smart_Registry_AGB_Registerführung_DE.pdf'
            : 'https://tokenkey.io/external/nyala/20250509_Smart_Registry_AGB_Registerführung_ENG.pdf',
      },
    }),
    subject: t('subject', {
      amount: currencyFormatter.format(amount),
      firstname,
    }),
    // Fallback for email clients that don't render HTML, e.g. feature phones
    text: t('subject', { amount: currencyFormatter.format(amount), firstname }),
    to: [email],
  })
}
