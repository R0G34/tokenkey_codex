import { selectOrders } from '@/dal/orders'
import type React from 'react'
import { InvestmentRealtimeProvider } from './investment-realtime-provider'

type Props = {
  children: React.ReactNode
}

export async function InvestmentDataProvider({ children }: Props) {
  const orders = await selectOrders()
  return (
    <InvestmentRealtimeProvider initialOrders={orders}>
      {children}
    </InvestmentRealtimeProvider>
  )
}
