'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Check, FileText, Info, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
// eslint-disable-next-line no-restricted-imports
import { redirect } from 'next/navigation'
import { useTransition } from 'react'
import { startKyc } from '../actions'

export default function Initial() {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations('onboarding.kyc')

  const items = [
    {
      description: t('initial.items.file.description'),
      icon: FileText,
      title: t('initial.items.file.title'),
    },
    {
      description: t('initial.items.lock.description'),
      icon: Lock,
      title: t('initial.items.lock.title'),
    },
    {
      description: t('initial.items.check.description'),
      icon: Check,
      title: t('initial.items.check.title'),
    },
  ]

  return (
    <>
      <Alert className="border border-blue-100 bg-blue-50">
        <Info className="size-4 text-blue-500!" />
        {/* <AlertTitle></AlertTitle> */}
        <AlertDescription>{t('intro')}</AlertDescription>
      </Alert>

      <form
        action={() => {
          startTransition(async () => {
            const kycLink = await startKyc()
            if (kycLink) redirect(kycLink)
          })
        }}
        className="flex flex-col items-center space-y-8"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((item) => (
            <div
              className="flex flex-col items-center rounded-lg border border-slate-100 bg-slate-50 p-5 text-center"
              key={item.title}
            >
              <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100">
                <item.icon className="size-6 text-slate-600" />
              </div>
              <h3 className="mb-2 font-medium text-slate-800">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
        <Button disabled={isPending} type="submit">
          {t('initial.cta')}
          {isPending && <Icons.spinner className="mr-2 size-4 animate-spin" />}
        </Button>
      </form>
    </>
  )
}
