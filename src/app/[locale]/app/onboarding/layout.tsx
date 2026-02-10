import { Locale, useTranslations } from 'next-intl'
import { PropsWithChildren } from 'react'
import StepperController from './stepper-controller'

type Props = PropsWithChildren & {
  params: Promise<{ locale: Locale }>
}

export default function OnboardingLayout({ children }: Props) {
  const t = useTranslations('onboarding')

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
        <h1 className="text-center text-3xl font-bold tracking-tight">
          {t('layout.title')}
        </h1>
        <StepperController />
      </div>
      {children}
    </div>
  )
}
