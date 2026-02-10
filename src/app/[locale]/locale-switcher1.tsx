import { routing } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import LocaleSwitcherSelect1 from './locale-switcher-select1'

export default function LocaleSwitcher1() {
  const t = useTranslations('LocaleSwitcher')
  const locale = useLocale()

  return (
    <LocaleSwitcherSelect1 defaultValue={locale} label={t('label')}>
      {routing.locales.map((cur) => {
        return (
          <option key={cur} value={cur}>
            {t('locale', { locale: cur })}
          </option>
        )
      })}
    </LocaleSwitcherSelect1>
  )
}
