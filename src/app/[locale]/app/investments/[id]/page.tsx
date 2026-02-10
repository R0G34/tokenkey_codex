import { selectBankAccounts } from '@/dal/bank-account'
import { selectOrderById } from '@/dal/orders'
import { verifySession } from '@/dal/session'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import InvestmentDetailRealtime from './investment-detail-realtime'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'App - Investment Details' }
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function InvestmentDetailPage(props: Props) {
  await verifySession()
  const params = await props.params
  const investmentId = parseInt(params.id, 10)
  if (isNaN(investmentId)) notFound()

  const [order, bankAccounts] = await Promise.all([
    selectOrderById(investmentId),
    selectBankAccounts(),
  ])

  if (!order) notFound()

  return (
    // <div className="mx-auto w-full max-w-5xl px-4 py-6">
    <InvestmentDetailRealtime
      bankAccounts={bankAccounts}
      selectedId={investmentId}
    />
    // </div>
  )
}
