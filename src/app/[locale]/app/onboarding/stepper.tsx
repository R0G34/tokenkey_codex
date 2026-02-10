'use client'

import { usePathname } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { cn } from '@/utils/tailwind/cn'
import {
  Building2,
  Coins,
  Files,
  Shield,
  TrendingUp,
  User,
  UserCheck,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PersonType } from './account-type-form-schema'
import StepIndicator from './step-indicator'

type Props = {
  areAllFilesUploaded: boolean
  className?: string
  compact?: boolean
  user: Tables<'user'> & {
    company: Tables<'company'> | null
    personal_data: Tables<'personal_data'> | null
    experience: Tables<'experience'> | null
    wallet: Tables<'wallet'> | null
  }
}

export default function Stepper({
  areAllFilesUploaded,
  className,
  compact = false,
  user,
}: Props) {
  const pathname = usePathname()
  const t = useTranslations('onboarding')

  const completed =
    user.experience?.consent &&
    ((user.experience.consent === 'no' && user.experience.risk_consent) ||
      (user.experience.consent === 'yes' &&
        (user.experience.score === null ||
          user.experience.score >= 7 ||
          user.experience.risk_consent)))

  const steps = [
    {
      icon: User,
      isActive:
        user.type === Number(PersonType.Customer.valueOf()) || !!user.company,
      id: 'personal-data',
      path: '/app/onboarding/personal-data',
      status:
        user.type === Number(PersonType.Customer.valueOf()) || user.company
          ? user.personal_data
            ? 'completed'
            : 'in-progress'
          : 'locked',
      title: t('menu.personalData.title'),
    },
    {
      icon: UserCheck,
      id: 'pep',
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
      icon: TrendingUp,
      id: 'wphg',
      isActive:
        user.type === Number(PersonType.Company)
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
      status: user.personal_data
        ? // ? user.experience?.consent
          user.experience?.consent &&
          ((user.experience.consent === 'no' && user.experience.risk_consent) ||
            (user.experience.consent === 'yes' &&
              (user.experience.score === null ||
                user.experience.score >= 7 ||
                user.experience.risk_consent)))
          ? 'completed'
          : 'in-progress'
        : 'locked',
      title: t('menu.wphg.title'),
    },
    {
      icon: Coins,
      id: 'wallet',
      isActive:
        !!user.personal_data &&
        user.personal_data.pep !== undefined &&
        user.personal_data.pep !== null &&
        // !!user.experience?.consent
        !!user.experience?.consent &&
        ((user.experience.consent === 'no' && !!user.experience.risk_consent) ||
          (user.experience.consent === 'yes' &&
            (user.experience.score === null ||
              user.experience.score >= 7 ||
              !!user.experience.risk_consent))),
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
      icon: Shield,
      id: 'identification',
      isActive:
        (user.type !== Number(PersonType.Company.valueOf()) ||
          !!user.company) &&
        !!user.personal_data &&
        user.personal_data.pep !== undefined &&
        user.personal_data.pep !== null &&
        !!user.experience?.consent &&
        ((user.experience.consent === 'no' && !!user.experience.risk_consent) ||
          (user.experience.consent === 'yes' &&
            (user.experience.score === null ||
              user.experience.score >= 7 ||
              !!user.experience.risk_consent))) &&
        !!user.wallet,
      path: '/app/onboarding/identification',
      status:
        (user.type !== Number(PersonType.Company.valueOf()) ||
          !!user.company) &&
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

  if (user.type === Number(PersonType.Company)) {
    steps.splice(0, 0, {
      icon: Building2,
      isActive: user.type === Number(PersonType.Company),
      id: 'company',
      path: '/app/onboarding/company',
      status: user.company ? 'completed' : 'in-progress',
      title: t('menu.company.title'),
    })

    steps.splice(
      3,
      0,
      // {
      //   icon: Users,
      //   id: 'representatives',
      //   isActive:
      //     !!user.personal_data &&
      //     !user.personal_data.pep !== undefined &&
      //     user.personal_data.pep !== null,
      //   path: '/app/onboarding/ubo-aml',
      //   status: user.personal_data
      //     ? user.personal_data.representatives
      //       ? 'completed'
      //       : 'in-progress'
      //     : 'locked',
      //   title: t('menu.representatives.title'),
      // },
      // {
      //   icon: Building,
      //   id: 'beneficial-owners',
      //   isActive:
      //     !!user.personal_data &&
      //     !user.personal_data.pep !== undefined &&
      //     user.personal_data.pep !== null &&
      //     !!user.personal_data.representatives,
      //   path: '/app/onboarding/ubo-aml/beneficial-owners',
      //   status: user.personal_data
      //     ? user.personal_data.beneficial_owners
      //       ? 'completed'
      //       : 'in-progress'
      //     : 'locked',
      //   title: t('menu.beneficialOwners.title'),
      // },
      // {
      //   icon: Files,
      //   id: 'ubo-aml',
      //   isActive:
      //     !!user.personal_data &&
      //     !user.personal_data.pep !== undefined &&
      //     user.personal_data.pep !== null &&
      //     !!user.personal_data.representatives &&
      //     !!user.personal_data.beneficial_owners,
      //   path: '/app/onboarding/ubo-aml/documents',
      //   status: user.personal_data
      //     ? areAllFilesUploaded
      //       ? 'completed'
      //       : 'in-progress'
      //     : 'locked',
      //   title: t('menu.uboAml.title'),
      // },
      {
        icon: Files,
        id: 'ubo-aml',
        isActive:
          !!user.company &&
          !!user.personal_data &&
          user.personal_data.pep !== undefined &&
          user.personal_data.pep !== null,
        // path: '/app/onboarding/ubo-aml/documents',
        path: '/app/onboarding/ubo-aml',
        status:
          !!user.company &&
          !!user.personal_data &&
          user.personal_data.pep !== undefined &&
          user.personal_data.pep !== null
            ? !!user.company.representatives &&
              !!user.company.beneficial_owners &&
              areAllFilesUploaded
              ? 'completed'
              : 'in-progress'
            : 'locked',
        title: t('menu.uboAml.title'),
      },
    )
  }

  return (
    <div className={className}>
      <div
        className={cn(
          'grid gap-0',
          steps.length === 5 ? 'grid-cols-5' : 'grid-cols-8',
        )}
      >
        {steps.map((step, index) => (
          <StepIndicator
            index={index}
            isClickable={step.isActive}
            isCompact={compact}
            isCompleted={step.status === 'completed'}
            isCurrent={pathname.startsWith(step.path)}
            key={step.id}
            step={step}
            stepsLength={steps.length}
          />
        ))}
      </div>
    </div>
  )
}
