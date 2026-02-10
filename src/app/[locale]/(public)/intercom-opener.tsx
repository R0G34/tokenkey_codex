'use client'

import { show } from '@intercom/messenger-js-sdk'
import { useTranslations } from 'next-intl'

export default function IntercomOpener() {
  const t = useTranslations('intercom')
  return (
    <button
      className="text-muted-foreground hover:text-foreground"
      onClick={() => show()}
    >
      {t('opener')}
    </button>
  )
}
