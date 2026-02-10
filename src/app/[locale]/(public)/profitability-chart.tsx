'use client'

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { numberFormatter } from '@/utils/number-formatter'
import { useTranslations } from 'next-intl'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

export default function ProfitabilityChart({
  chartData,
}: {
  chartData: {
    year: number
    initialCapital: number
    periodicDeposit: number
    totalInterest: number
  }[]
}) {
  const t = useTranslations('home.page')
  // https://ui.shadcn.com/docs/components/chart#theming
  const chartConfig = {
    initialCapital: {
      color: 'var(--chart-1)',
      label: t('yieldSimulator.initialCapital'),
    },
    periodicDeposit: {
      color: 'var(--chart-5)',
      label: t('yieldSimulator.depositPeriodic'),
    },
    totalInterest: {
      color: 'var(--chart-4)',
      label: t('yieldSimulator.totalInterest'),
    },
  } satisfies ChartConfig

  return (
    <ChartContainer
      className="h-[300px] w-full sm:h-[400px]"
      config={chartConfig}
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis axisLine={false} dataKey="year" tickLine={false} />
        <YAxis
          axisLine={false}
          tickFormatter={(value) => numberFormatter.format(value)}
          tickLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="initialCapital"
          fill="var(--color-initialCapital)"
          stackId="a"
        />
        <Bar
          dataKey="periodicDeposit"
          fill="var(--color-periodicDeposit)"
          stackId="a"
        />
        <Bar
          dataKey="totalInterest"
          fill="var(--color-totalInterest)"
          stackId="a"
        />
      </BarChart>
    </ChartContainer>
  )
}
