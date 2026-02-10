'use client'

import { Tables } from '@/lib/supabase/types/database.types'
import { useInvestmentRealtime } from '../investment-realtime-provider'
import { InvestmentDetailPageContent } from './page-content'

type Props = {
  bankAccounts: Tables<'bank_account'>[]
  selectedId: Tables<'order'>['id']
}

export default function InvestmentDetailRealtime({
  bankAccounts,
  selectedId,
}: Props) {
  const { getOrderById } = useInvestmentRealtime()

  const order = getOrderById(selectedId)

  if (!order) throw new Error('Impossible')

  return (
    <InvestmentDetailPageContent bankAccounts={bankAccounts} order={order} />
  )
}
