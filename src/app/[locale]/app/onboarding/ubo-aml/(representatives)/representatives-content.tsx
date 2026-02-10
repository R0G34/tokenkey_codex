'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useRouter } from '@/i18n/navigation'
import { Building2, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { updateRepresentatives } from './actions'
import { RepresentativeLegalPersonForm } from './representative-legalperson-form'
import { RepresentativeNaturalPersonForm } from './representative-naturalperson-form'
import { useRepresentatives } from './representatives-context'
import { RepresentativesList } from './representatives-list'

export function RepresentativesContent() {
  const {
    company,
    formState,
    setFormState,
    setEditingNaturalRepresentative,
    setEditingLegalRepresentative,
  } = useRepresentatives()
  const router = useRouter()
  const t = useTranslations('onboarding.representatives')
  const [isPending, startTransition] = useTransition()

  const handleAddNaturalPerson = () => {
    setEditingNaturalRepresentative(null)
    setFormState('natural')
  }
  const handleAddLegalPerson = () => {
    setEditingLegalRepresentative(null)
    setFormState('legal')
  }
  const handleAcceptAndContinue = () => {
    startTransition(async () => {
      if (!company.representatives) await updateRepresentatives([])
      router.push('/app/onboarding/ubo-aml/beneficial-owners')
    })
  }

  return (
    <div className="space-y-6">
      <RepresentativesList />

      {formState === 'natural' && <RepresentativeNaturalPersonForm />}

      {formState === 'legal' && <RepresentativeLegalPersonForm />}

      {formState === 'list' && (
        <>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAddNaturalPerson}>
              <User className="mr-2 size-4" /> {t('addNaturalPerson')}
            </Button>
            <Button onClick={handleAddLegalPerson}>
              <Building2 className="mr-2 size-4" /> {t('addLegalPerson')}
            </Button>
          </div>
          <div className="flex justify-end">
            <Button disabled={isPending} onClick={handleAcceptAndContinue}>
              {t('acceptAndContinue')}
              {isPending && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
