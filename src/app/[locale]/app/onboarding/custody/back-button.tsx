'use client'

import { Button } from '@/components/ui/button'

import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useWallet } from './wallet-context'

export default function BackButton() {
  const {
    config: { step },
    setConfig,
  } = useWallet()

  const t = useTranslations('onboarding.custody')

  return (
    <Button variant="ghost" onClick={() => setConfig({ step: step - 1 })}>
      <ArrowLeft className="mr-2 size-4" /> {t('back')}
    </Button>
  )
}
