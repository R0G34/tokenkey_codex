'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useRouter } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { Status } from '@/services/concedus/status'
import { AlertCircle, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useTransition } from 'react'
import { getStatus } from '../actions'

interface Props {
  concedusIdentLink: Tables<'concedus_ident_link'>
}

export default function Pending({ concedusIdentLink }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const t = useTranslations('onboarding.kyc.pending')

  useEffect(() => {
    const interval = setInterval(async () => {
      startTransition(async () => {
        const [newIdentStatus] = await getStatus(concedusIdentLink.action_id)
        if (!newIdentStatus) return
        if (
          newIdentStatus !== Status.PENDING &&
          newIdentStatus !== Status.UPDATE_PENDING
        )
          router.refresh()
      })
    }, 10_000) // Poll every 10s

    return () => clearInterval(interval)
  }, [concedusIdentLink, router])

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4">
      <div className="flex size-24 items-center justify-center rounded-full bg-amber-50">
        <Clock className="size-12 text-amber-500" />
      </div>

      <h3 className="mb-2 text-center text-xl font-medium text-slate-800">
        {t('title')}
      </h3>
      {/* <p className="text-slate-600 text-center max-w-md mb-6">
        {t('subtitle')}
      </p> */}

      <Alert className="border border-amber-100 bg-amber-50">
        <AlertCircle className="size-4 text-amber-800!" />
        <AlertDescription>{t('alert')}</AlertDescription>
      </Alert>

      <a className={buttonVariants()} href={concedusIdentLink.url}>
        {t('cta')}
        {isPending && <Icons.spinner className="mr-2 size-4 animate-spin" />}
      </a>
    </div>
  )
}
