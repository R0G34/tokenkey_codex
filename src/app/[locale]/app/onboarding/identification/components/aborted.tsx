'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { AlertCircle, OctagonMinus } from 'lucide-react'
import { useTranslations } from 'next-intl'
// eslint-disable-next-line no-restricted-imports
import { redirect } from 'next/navigation'
import { useTransition } from 'react'
import { startKyc } from '../actions'

export default function Aborted() {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations('onboarding.kyc.aborted')

  return (
    <form
      action={() => {
        startTransition(async () => {
          const kycLink = await startKyc()
          if (kycLink) redirect(kycLink)
        })
      }}
      className="mx-auto flex max-w-md flex-col items-center justify-center gap-4"
    >
      <div className="flex size-24 items-center justify-center rounded-full bg-orange-50">
        <OctagonMinus className="size-12 text-orange-500" />
      </div>

      <h3 className="mb-2 text-center text-xl font-medium text-slate-800">
        {t('title')}
      </h3>

      <Alert className="border border-slate-200 bg-slate-50">
        <AlertCircle className="size-4 text-slate-500!" />
        <AlertDescription>{t('subtitle')}</AlertDescription>
      </Alert>

      <Button type="submit">
        {t('cta')}
        {isPending && <Icons.spinner className="mr-2 size-4 animate-spin" />}
      </Button>
    </form>
  )
}
