'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { Tables } from '@/lib/supabase/types/database.types'
import {
  Building,
  ChevronDown,
  ChevronUp,
  Coins,
  Files,
  Shield,
  TrendingUp,
  User,
  UserCheck,
  Users,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { PersonType } from './account-type-form-schema'
import { StepCardIcon } from './step-card-icon'

type Props = {
  areAllFilesUploaded: boolean
  user: Tables<'user'> & {
    company: Tables<'company'> | null
    personal_data: Tables<'personal_data'> | null
    experience: Tables<'experience'> | null
    wallet: Tables<'wallet'> | null
  }
}

export default function OnboardingContent({
  areAllFilesUploaded,
  user,
}: Props) {
  const t = useTranslations('onboarding')

  const steps = [
    {
      description: t('menu.personalData.description'),
      icon: User,
      id: 'personal-data',
      image: '',
      isActive: true,
      path: '/app/onboarding/personal-data',
      status: user.personal_data ? 'completed' : 'in-progress',
      title: t('menu.personalData.title'),
    },
    {
      description: t('menu.pep.description'),
      icon: UserCheck,
      id: 'pep',
      image: '',
      isActive: !!user.personal_data,
      path: '/app/onboarding/pep',
      status: user.personal_data
        ? user.personal_data.pep !== undefined &&
          user.personal_data.pep !== null
          ? 'completed'
          : 'in-progress'
        : 'locked',
      title: t('menu.pep.title'),
    },
    {
      description: t('menu.wphg.description'),
      icon: TrendingUp,
      id: 'wphg',
      image: '',
      isActive:
        user.type === Number(PersonType.Company.valueOf())
          ? !!user.personal_data &&
            user.personal_data.pep !== undefined &&
            user.personal_data.pep !== null &&
            !!user.company &&
            !!user.company.representatives &&
            !!user.company.beneficial_owners &&
            areAllFilesUploaded
          : !!user.personal_data &&
            !user.personal_data.pep !== undefined &&
            user.personal_data.pep !== null,
      path: '/app/onboarding/wphg',
      status:
        user.personal_data &&
        !user.personal_data.pep !== undefined &&
        user.personal_data.pep !== null
          ? user.experience?.consent
            ? 'completed'
            : 'in-progress'
          : 'locked',
      title: t('menu.wphg.title'),
    },
    {
      description: t('menu.custody.description'),
      icon: Coins,
      id: 'wallet',
      image: '',
      isActive:
        !!user.personal_data &&
        user.personal_data.pep !== undefined &&
        user.personal_data.pep !== null &&
        !!user.experience?.consent,
      path: '/app/onboarding/custody',
      status:
        user.personal_data &&
        user.personal_data.pep !== undefined &&
        user.personal_data.pep !== null &&
        user.experience?.consent
          ? user.wallet
            ? 'completed'
            : 'in-progress'
          : 'locked',
      title: t('menu.custody.title'),
    },
    {
      description: t('menu.kyc.description'),
      icon: Shield,
      id: 'identification',
      image: '',
      isActive:
        !!user.personal_data &&
        user.personal_data.pep !== undefined &&
        user.personal_data.pep !== null &&
        !!user.experience?.consent &&
        !!user.wallet,
      path: '/app/onboarding/identification',
      status:
        user.personal_data &&
        user.personal_data.pep !== undefined &&
        user.personal_data.pep !== null &&
        user.experience?.consent &&
        user.wallet
          ? user.personal_data.kyc
            ? 'completed'
            : 'in-progress'
          : 'locked',
      title: t('menu.kyc.title'),
    },
  ]

  if (user.type === Number(PersonType.Company.valueOf()))
    steps.splice(
      2,
      0,
      {
        description: t('menu.representatives.description'),
        icon: Users,
        id: 'representatives',
        image: '',
        isActive:
          !!user.personal_data &&
          !user.personal_data.pep !== undefined &&
          user.personal_data.pep !== null,
        path: '/app/onboarding/ubo-aml',
        status: user.company
          ? user.company.representatives
            ? 'completed'
            : 'in-progress'
          : 'locked',
        title: t('menu.representatives.title'),
      },
      {
        description: t('menu.beneficialOwners.description'),
        icon: Building,
        id: 'beneficial-owners',
        image: '',
        isActive:
          !!user.personal_data &&
          !user.personal_data.pep !== undefined &&
          user.personal_data.pep !== null &&
          !!user.company &&
          !!user.company.representatives,
        path: '/app/onboarding/ubo-aml/beneficial-owners',
        status: user.company
          ? user.company.beneficial_owners
            ? 'completed'
            : 'in-progress'
          : 'locked',
        title: t('menu.beneficialOwners.title'),
      },
      {
        description: t('menu.uboAml.description'),
        icon: Files,
        id: 'ubo-aml',
        image: '',
        isActive:
          !!user.personal_data &&
          !user.personal_data.pep !== undefined &&
          user.personal_data.pep !== null &&
          !!user.company &&
          !!user.company.representatives &&
          !!user.company.beneficial_owners,
        path: '/app/onboarding/ubo-aml/documentos',
        status: user.personal_data
          ? areAllFilesUploaded
            ? 'completed'
            : 'in-progress'
          : 'locked',
        title: t('menu.uboAml.title'),
      },
    )

  const isMobile = useIsMobile()
  const [showCompletedSteps, setShowCompletedSteps] = useState(true)

  const visibleSteps = steps.filter((step) => {
    if (!isMobile) return true
    if (showCompletedSteps) return true
    return step.status !== 'completed'
  })

  const completedStepsCount = steps.filter(
    (step) => step.status === 'completed',
  ).length

  return (
    <div className="mx-auto max-w-4xl">
      {isMobile && completedStepsCount > 0 && (
        <button
          onClick={() => setShowCompletedSteps(!showCompletedSteps)}
          className="mb-4 flex w-full items-center justify-between rounded-lg border bg-muted/50 p-3"
        >
          <span className="font-medium">
            {showCompletedSteps ? t('menu.hide') : t('menu.show')}{' '}
            {t('menu.completeSteps')} ({completedStepsCount})
          </span>
          {showCompletedSteps ? (
            <ChevronUp className="size-5" />
          ) : (
            <ChevronDown className="size-5" />
          )}
        </button>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {visibleSteps.map((step) => (
          // <StepCard
          <StepCardIcon key={step.id} step={step} isMobile={isMobile} />
        ))}
      </div>
    </div>
  )
}
