'use client'

import { Card, CardContent } from '@/components/ui/card'
import { currencyFormatter } from '@/utils/currency-formatter'
import { useTranslations } from 'next-intl'

interface Props {
  newExpectedReturn: number
  newTokens: number
  newInvestment: number
}

export const InvestmentSummary = ({
  newExpectedReturn,
  newTokens,
  newInvestment,
}: Props) => {
  const t = useTranslations('investment.dialog')

  // version short

  return (
    <Card>
      <CardContent className="space-y-2">
        <h3 className="font-semibold">{t('step1.form.investmentSummary')}</h3>
        <div className="space-y-1 sm:space-y-3">
          <div className="flex justify-between sm:items-center">
            <p className="text-muted-foreground">
              {t('step1.form.investment')}
            </p>
            <div className="text-right">
              <span className="ml-2 font-medium">
                {currencyFormatter.format(newInvestment)}
              </span>
            </div>
          </div>
          <div className="flex justify-between sm:items-center">
            <p className="text-muted-foreground">Tokens</p>
            <div className="text-right">
              <span className="ml-2 font-medium">{newTokens}</span>
            </div>
          </div>
          <div className="flex justify-between sm:items-center">
            <p className="text-muted-foreground">
              {t('step1.form.expectedReturn')}
            </p>
            <div className="text-right">
              <span className="ml-2 font-medium">
                {currencyFormatter.format(newExpectedReturn)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // version very high

  /* return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h3 className="font-semibold">Resumen de la inversión</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Inversión actual</span>
            <span className="font-medium line-through">
              {currencyFormatter.format(
                (userOptin?.amount ?? 0) * projectTokenPrice,
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nueva inversión</span>
            <span className="font-medium">
              +{currencyFormatter.format(newInvestment - currentInvestment)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total inversión</span>
            <span className="font-medium">
              {currencyFormatter.format(newInvestment)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tokens actuales</span>
            <span className="font-medium line-through">{currentTokens}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nuevos tokens</span>
            <span className="font-medium">+{newTokens - currentTokens}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total tokens</span>
            <span className="font-medium">{newTokens}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Retorno esperado actual
            </span>
            <span className="font-medium text-green-600 line-through">
              {currencyFormatter.format(currentExpectedReturn)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Nuevo retorno esperado
            </span>
            <span className="font-medium text-green-600">
              +
              {currencyFormatter.format(
                newExpectedReturn - currentExpectedReturn,
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Total retorno esperado
            </span>
            <span className="font-medium text-green-600">
              {currencyFormatter.format(newExpectedReturn)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  ) */

  // version mix

  /* return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h3 className="font-semibold">Resumen de la inversión</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Inversión actual</span>
            <span className="font-medium line-through">
              {currencyFormatter.format(
                (userOptin?.amount ?? 0) * projectTokenPrice,
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nueva inversión</span>
            <div className="flex gap-1">
              <span className="font-medium">
                {currencyFormatter.format(newInvestment)}
              </span>
              <span className="ml-1 align-top text-xs text-green-600">
                +{currencyFormatter.format(newInvestment - currentInvestment)}
              </span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tokens actuales</span>
            <span className="font-medium line-through">{currentTokens}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nuevos tokens</span>
            <div className="flex gap-1">
              <span className="font-medium">
                <span className="font-medium">{newTokens}</span>
              </span>
              <span className="ml-1 align-top text-xs text-green-600">
                +{newTokens - currentTokens}
              </span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Retorno esperado actual
            </span>
            <span className="font-medium line-through">
              {currencyFormatter.format(currentExpectedReturn)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Nuevo retorno esperado
            </span>
            <div className="flex gap-1">
              <span className="font-medium">
                {currencyFormatter.format(newExpectedReturn)}
              </span>
              <span className="ml-1 align-top text-xs text-green-600">
                +
                {(newExpectedReturn - currentExpectedReturn).toLocaleString(
                  'es-ES',
                )}
                €
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ) */
}
