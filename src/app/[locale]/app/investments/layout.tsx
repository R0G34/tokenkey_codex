import { useTranslations } from 'next-intl'
import { PropsWithChildren, Suspense } from 'react'
import { InvestmentDataProvider } from './investment-data-provider'
import { InvestmentSkeleton } from './investment-skeleton'

export default function InvestmentLayout({ children }: PropsWithChildren) {
  const t = useTranslations('investment.list')

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <h1 className="text-lg font-semibold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <Suspense fallback={<InvestmentSkeleton />}>
        <InvestmentDataProvider>{children}</InvestmentDataProvider>
      </Suspense>
    </div>
  )
}
