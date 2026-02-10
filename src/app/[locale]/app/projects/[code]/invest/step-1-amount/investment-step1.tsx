'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Link } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { currencyFormatter } from '@/utils/currency-formatter'
import { numberFormatter } from '@/utils/number-formatter'
import { cn } from '@/utils/tailwind/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { MAX_INVESTMENT, MIN_INVESTMENT } from '../constant'
import { InvestmentSummary } from '../investment-summary'
import { sendLegals } from '../step-2-confirmation/actions'

interface Props {
  investmentAmountWatched: number
  project: Tables<'project'>
  setInvestmentAmountWatched: Dispatch<SetStateAction<number>>
  setInvestmentStep: Dispatch<SetStateAction<number>>
}

export const InvestmentStep1 = ({
  investmentAmountWatched,
  project,
  setInvestmentAmountWatched,
  setInvestmentStep,
}: Props) => {
  const t = useTranslations('investment')

  const projectTokenPrice = project.token_price / 100
  const userMaxInvestment =
    Math.floor(MAX_INVESTMENT / projectTokenPrice) * projectTokenPrice

  const formSchema = z.object({
    investmentAmount: z
      .number()
      .min(MIN_INVESTMENT, {
        message: t('dialog.step1.form.errors.min', {
          minInvestment: currencyFormatter.format(MIN_INVESTMENT),
        }),
      })
      .max(userMaxInvestment, {
        message: t('dialog.step1.form.errors.max', {
          maxInvestment: currencyFormatter.format(userMaxInvestment),
        }),
      })
      .refine((val) => val % projectTokenPrice === 0, {
        message: t('dialog.step1.form.errors.amount', {
          projectTokenPrice: numberFormatter.format(projectTokenPrice),
        }),
      })
      .default(0),
  })
  const form = useForm({
    defaultValues: { investmentAmount: investmentAmountWatched },
    resolver: zodResolver(formSchema),
  })

  const projectProfitability = project.profitability / 100

  const newExpectedReturn =
    (investmentAmountWatched * projectProfitability) / 100
  const newTokens = investmentAmountWatched / projectTokenPrice

  const handleSubmitStep1 = (_: z.infer<typeof formSchema>) => {
    setInvestmentStep(2)
    sendLegals()
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(handleSubmitStep1)}
        className="space-y-8"
      >
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-1 sm:space-y-3">
              <FormField
                control={form.control}
                name="investmentAmount"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>{t('dialog.step1.form.amount')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                            €
                          </span>
                          <Input
                            className="w-40 pl-7"
                            id="investment-amount"
                            max={MAX_INVESTMENT}
                            min={MIN_INVESTMENT}
                            step={projectTokenPrice}
                            type="number"
                            {...field}
                            onChange={(a) => {
                              field.onChange(Number(a.target.value))
                              setInvestmentAmountWatched(Number(a.target.value))
                            }}
                          />
                          <Button
                            className="absolute top-1/2 right-6 -translate-y-1/2"
                            onClick={() => {
                              const quantity =
                                Math.floor(MAX_INVESTMENT / projectTokenPrice) *
                                projectTokenPrice
                              form.setValue('investmentAmount', quantity)
                              setInvestmentAmountWatched(Number(quantity))
                            }}
                            type="button"
                            variant="link"
                          >
                            max
                          </Button>
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {t('dialog.step1.form.minimum')}:
                  </span>
                  <span className="font-medium">
                    {currencyFormatter.format(MIN_INVESTMENT)}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-muted-foreground">
                    {t('dialog.step1.form.maximum')}:
                  </span>
                  <span className="font-medium">
                    {currencyFormatter.format(MAX_INVESTMENT)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <InvestmentSummary
            newExpectedReturn={newExpectedReturn}
            newInvestment={investmentAmountWatched}
            newTokens={newTokens}
          />

          <div className="flex gap-3">
            <Link
              className={cn('flex-1', buttonVariants({ variant: 'outline' }))}
              href={{
                pathname: '/app/projects/[code]',
                params: { code: project.code.toLowerCase() },
              }}
            >
              {t('dialog.step2.formCommon.buttons.back')}
            </Link>
            <Button className="flex-1" size="lg" type="submit">
              {t('dialog.step1.form.alert.continue')}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
