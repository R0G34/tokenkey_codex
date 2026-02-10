'use client'

import { useInvestmentRealtime } from './investment-realtime-provider'
import { InvestmentsPageContent } from './page-content'

export default function InvestmentListRealtime() {
  const { orders } = useInvestmentRealtime()

  return <InvestmentsPageContent orders={orders} />
}
