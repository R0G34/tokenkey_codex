'use client'

import { Tables } from '@/lib/supabase/types/database.types'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { CountryFlag } from '../../country-flag'
import { ProjectProvider } from '../project-context'
import { MIN_INVESTMENT } from './constant'
import { InvestmentStep1 } from './step-1-amount/investment-step1'
import { InvestmentStep2 } from './step-2-confirmation/investment-step2'
import { InvestmentStep3 } from './step-3-payment/investment-step3'

type Props = {
  project: Tables<'project'>
  translations: Tables<'project_translation'>
  bankAccounts: Tables<'bank_account'>[]
}

export function InvestPageContent({
  project,
  translations,
  bankAccounts,
}: Props) {
  const t = useTranslations('investment')
  const [investmentAmountWatched, setInvestmentAmountWatched] =
    useState(MIN_INVESTMENT)
  const [investmentStep, setInvestmentStep] = useState(1)

  const projectProfitability = project.profitability / 100

  return (
    <ProjectProvider>
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">
            {t('dialog.title', { name: translations.name })}
          </h1>
          <p className="text-sm text-muted-foreground">
            {translations.city}, {translations.state}, {translations.country}{' '}
            <CountryFlag code="es" /> • {t('dialog.description')}{' '}
            {projectProfitability}%
          </p>
        </div>

        {investmentStep === 1 ? (
          <InvestmentStep1
            investmentAmountWatched={investmentAmountWatched}
            project={project}
            setInvestmentAmountWatched={setInvestmentAmountWatched}
            setInvestmentStep={setInvestmentStep}
          />
        ) : investmentStep === 2 ? (
          <InvestmentStep2
            investmentAmountWatched={investmentAmountWatched}
            project={project}
            setInvestmentStep={setInvestmentStep}
          />
        ) : (
          <InvestmentStep3
            investmentAmountWatched={investmentAmountWatched}
            project={project}
            bankAccounts={bankAccounts}
            setInvestmentStep={setInvestmentStep}
          />
        )}
      </div>
    </ProjectProvider>
  )
}
