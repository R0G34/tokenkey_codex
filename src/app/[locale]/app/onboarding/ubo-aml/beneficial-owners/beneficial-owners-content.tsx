'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Separator } from '@/components/ui/separator'
import { useRouter } from '@/i18n/navigation'
import { Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { updateBeneficialOwners } from './actions'
import { BeneficialOwnerForm } from './beneficial-owner-form'
import { useBeneficialOwners } from './beneficial-owners-context'
import { BeneficialOwnersList } from './beneficial-owners-list'
import { RepresentativesList } from './representatives-list'

export function BeneficialOwnersContent() {
  const { company, formState } = useBeneficialOwners()
  const router = useRouter()
  const t = useTranslations('onboarding.beneficialOwners')
  const [isPending, startTransition] = useTransition()

  const handleAcceptAndContinue = async () => {
    startTransition(async () => {
      if (!company.beneficial_owners) await updateBeneficialOwners([])
      router.push('/app/onboarding/ubo-aml/documents')
    })
  }

  return (
    <div className="space-y-2">
      <Alert className="bg-muted text-muted-foreground">
        <Info className="size-4" />
        <AlertTitle>{t('alert.title')}</AlertTitle>
        <AlertDescription>
          <div className="mt-2 space-y-2">
            <ul className="list-inside list-disc space-y-1">
              {(t.raw('alert.list') as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p>{t('alert.p1')}</p>
            <p>{t('alert.p2')}</p>
            <p>{t('alert.p3')}</p>
          </div>
        </AlertDescription>
      </Alert>

      <div className="mt-6 flex flex-col justify-around gap-4 md:flex-row">
        <div className="flex-1">
          <h2 className="mb-4 text-lg font-semibold">
            {t('personRegistrable')}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {t('personRegistrableDescription')}
          </p>
          <RepresentativesList />
        </div>
        <Separator className="hidden !h-80 md:block" orientation="vertical" />
        <div className="flex-1">
          <h2 className="mb-4 text-lg font-semibold">{t('list.title')}</h2>
          <BeneficialOwnersList />
        </div>
      </div>

      {formState === 'form' && (
        <div className="mt-6">
          <BeneficialOwnerForm />
        </div>
      )}

      {formState === 'list' && (
        <div className="mt-6 flex justify-end">
          <Button disabled={isPending} onClick={handleAcceptAndContinue}>
            {t('acceptAndContinue')}
            {isPending && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
