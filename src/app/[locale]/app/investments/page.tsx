import { verifySession } from '@/dal/session'
import { Metadata } from 'next'
import InvestmentListRealtime from './investment-list-realtime'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'App - My Investments' }
}

export default async function InvestmentsPage() {
  await verifySession()
  return <InvestmentListRealtime />
}
