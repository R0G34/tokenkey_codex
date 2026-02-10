import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import { useTranslations } from 'next-intl'

export const metadata: Metadata = {
  title: 'Cookie Policy',
}

export default function CookiePolicyPage() {
  const t = useTranslations('legals.cookie')

  return (
    <div className="container prose pt-6">
      <h1>{t('title')}</h1>
      <h2>{t('subtitle1')}</h2>
      <p>{t('p1')}</p>
      <p>{t('p2')}</p>
      <h2>{t('subtitle2')}</h2>
      <p>{t('p3')}</p>
      <p>{t('p4')}</p>
      <h2>{t('subtitle3')}</h2>
      {/* CookieYes script fills the table */}
      <div className="cky-audit-table-element" />
      <h2>{t('subtitle4')}</h2>
      {/* CookieYes script adds the event listener */}
      <Button className="cky-banner-element" variant="outline">
        {t('cookiePreferences')}
      </Button>
      <p>{t('p5')}</p>
      <p>{t('p6')}</p>
      <p className="break-words">
        Chrome:&nbsp;
        <a
          target="_blank"
          href="https://support.google.com/accounts/answer/32050"
        >
          https://support.google.com/accounts/answer/32050
        </a>
      </p>
      <p className="break-words">
        Safari:&nbsp;
        <a
          target="_blank"
          href="https://support.apple.com/guide/safari/sfri11471/mac"
        >
          https://support.apple.com/guide/safari/sfri11471/mac
        </a>
      </p>
      <p className="break-words">
        Firefox:&nbsp;
        <a
          target="_blank"
          href="https://support.mozilla.org/kb/clear-cookies-and-site-data-firefox?redirectslug=delete-cookies-remove-info-websites-stored&redirectlocale=en-US"
        >
          https://support.mozilla.org/kb/clear-cookies-and-site-data-firefox?redirectslug=delete-cookies-remove-info-websites-stored&redirectlocale=en-US
        </a>
      </p>
      <p className="break-words">
        Internet Explorer:&nbsp;
        <a
          target="_blank"
          href="https://support.microsoft.com/topic/how-to-delete-cookie-files-in-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc"
        >
          https://support.microsoft.com/topic/how-to-delete-cookie-files-in-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc
        </a>
      </p>
      <p>{t('p7')}</p>
    </div>
  )
}
