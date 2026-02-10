import { SelectItem } from '@/components/ui/select'
import { routing } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import LocaleSwitcherSelect from './locale-switcher-select'

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher')
  const locale = useLocale()

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t('label')}>
      {routing.locales.map((cur) => {
        return (
          <SelectItem key={cur} value={cur}>
            {t('locale', { locale: cur })}
          </SelectItem>
        )
      })}
    </LocaleSwitcherSelect>
  )
}
