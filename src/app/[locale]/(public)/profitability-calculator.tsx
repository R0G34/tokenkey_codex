'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'
import { currencyFormatter } from '@/utils/currency-formatter'
import { cn } from '@/utils/tailwind/cn'
import { BookDown, Landmark, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { calculateSavings } from './profitability-calculate-savings'
import ProfitabilityChart from './profitability-chart'
import SliderWithInput from './slider-with-input'

export default function ProfitabilityCalculator() {
  const [initialCapital, setInitialCapital] = useState(7000)
  const [monthlyContribution, setMonthlyContribution] = useState(100)
  const [years, setYears] = useState(15)
  const [data, setData] = useState<{
    totalSavings: number
    chartData: {
      initialCapital: number
      periodicDeposit: number
      totalInterest: number
      year: number
    }[]
  }>(calculateSavings(initialCapital, monthlyContribution, years))
  const t = useTranslations('home.page')

  useEffect(
    () => setData(calculateSavings(initialCapital, monthlyContribution, years)),
    [initialCapital, monthlyContribution, years],
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SliderWithInput
            id="initialCapital"
            color="var(--chart-1)"
            label={t('yieldSimulator.initialCapital')}
            value={initialCapital}
            setValue={setInitialCapital}
            min={0}
            max={100_000}
            step={1000}
            unit="€"
          />
          <SliderWithInput
            id="monthlyContribution"
            color="var(--chart-5)"
            label={t('yieldSimulator.monthlyContribution')}
            value={monthlyContribution}
            setValue={setMonthlyContribution}
            min={0}
            max={2_000}
            step={100}
            unit="€"
          />
          <SliderWithInput
            id="years"
            label={t('yieldSimulator.duration')}
            value={years}
            setValue={setYears}
            min={1}
            max={30}
            step={1}
            unit={t('yieldSimulator.years')}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="w-full md:w-2/3">
            <ProfitabilityChart chartData={data.chartData} />
          </div>
          <div className="mt-4 w-full md:mt-0 md:w-1/3">
            <h2 className="mb-2 text-xl font-semibold">
              {t('yieldSimulator.youCanSave')}
            </h2>
            <p className="mb-2 text-3xl font-bold text-primary">
              {currencyFormatter.format(data.totalSavings)}
            </p>
            <p className="mb-4 text-sm text-gray-600">
              {t('yieldSimulator.monthlySavings', {
                monthlyContribution:
                  currencyFormatter.format(monthlyContribution),
                years,
              })}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="size-4" color="var(--chart-1)" />
                  <span>{t('yieldSimulator.initialCapital')}</span>
                </div>
                <span className="font-semibold">
                  {currencyFormatter.format(initialCapital)}
                </span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <BookDown className="size-4" color="var(--chart-5)" />
                  <span>{t('yieldSimulator.depositPeriodic')}</span>
                </div>
                <span className="font-semibold">
                  {currencyFormatter.format(monthlyContribution * 12 * years)}
                </span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4" color="var(--chart-4)" />
                  <span>{t('yieldSimulator.totalInterest')}</span>
                </div>
                <span className="font-semibold">
                  {currencyFormatter.format(
                    data.totalSavings -
                      initialCapital -
                      monthlyContribution * 12 * years,
                  )}
                </span>
              </div>
            </div>
            <Alert className="mt-6">
              <AlertDescription>
                {t('yieldSimulator.resultNotice')}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          className={cn('mt-2 md:mt-6', buttonVariants({ size: 'lg' }))}
          href="/projects"
        >
          {t('cta')}
        </Link>
      </CardFooter>
    </Card>
  )
}
