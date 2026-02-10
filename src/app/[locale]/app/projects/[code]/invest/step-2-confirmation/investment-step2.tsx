'use client'

import { Card, CardContent } from '@/components/ui/card'

import { Tables } from '@/lib/supabase/types/database.types'
import { currencyFormatter } from '@/utils/currency-formatter'
import { Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dispatch, SetStateAction } from 'react'
import { InvestmentSummary } from '../investment-summary'
import DocumentsList from './documents-list'
import Investment0Form from './investment-0-form'
import Investment1000Form from './investment-1000-form'
import Investment10000Form from './investment-10000-form'
import Investment25000Form from './investment-25000-form'

interface Props {
  investmentAmountWatched: number
  project: Tables<'project'>
  setInvestmentStep: Dispatch<SetStateAction<number>>
}

export const InvestmentStep2 = ({
  investmentAmountWatched,
  project,
  setInvestmentStep,
}: Props) => {
  const t = useTranslations('investment')

  const projectTokenPrice = project.token_price / 100
  const projectProfitability = project.profitability / 100

  const newExpectedReturn =
    (investmentAmountWatched * projectProfitability) / 100
  const newTokens = investmentAmountWatched / projectTokenPrice

  // Navigate to Step 3 for payment authorization
  const handleContinueToPayment = () => {
    setInvestmentStep(3)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Info className="size-5" />
            <span className="font-medium">{t('dialog.step2.title')}</span>
          </div>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              {t('dialog.step2.investmentTextNoOptin', {
                amount: currencyFormatter.format(investmentAmountWatched),
                tokenCount: newTokens,
              })}
            </p>
            {/* <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="mt-1 size-4 text-green-600" />
                    <p className="text-muted-foreground">
                      {t.rich('step2.investmentProtected', {
                        link: (chunks) => (
                          <span className="cursor-pointer text-primary hover:underline">
                            {chunks}
                          </span>
                        ),
                      })}
                    </p>
                  </div> */}
          </div>
        </CardContent>
      </Card>

      <InvestmentSummary
        newExpectedReturn={newExpectedReturn}
        newInvestment={investmentAmountWatched}
        newTokens={newTokens}
      />

      {/* <p className="mt-2 text-xs">
        {t.rich('warning', {
          strong: (chunks) => (
            <strong className="font-semibold">{chunks}</strong>
          ),
        })}
      </p> */}

      <Card>
        <CardContent className="space-y-4 text-muted-foreground">
          <p className="whitespace-pre-wrap">
            {t('dialog.step2.formCommon.intro')}
          </p>
          <DocumentsList />
        </CardContent>
      </Card>

      {investmentAmountWatched <= 1000 ? (
        <Investment0Form
          isInvesting={false}
          onClickCancel={() => setInvestmentStep(1)}
          onFormSubmit={handleContinueToPayment}
        />
      ) : investmentAmountWatched > 1000 &&
        investmentAmountWatched <= 10_000 ? (
        <Investment1000Form
          isInvesting={false}
          onClickCancel={() => setInvestmentStep(1)}
          onFormSubmit={handleContinueToPayment}
        />
      ) : investmentAmountWatched > 10_000 &&
        investmentAmountWatched <= 25_000 ? (
        <Investment10000Form
          isInvesting={false}
          onClickCancel={() => setInvestmentStep(1)}
          onFormSubmit={handleContinueToPayment}
        />
      ) : (
        <Investment25000Form
          isInvesting={false}
          onClickCancel={() => setInvestmentStep(1)}
          onFormSubmit={handleContinueToPayment}
        />
      )}
    </div>
  )
}
