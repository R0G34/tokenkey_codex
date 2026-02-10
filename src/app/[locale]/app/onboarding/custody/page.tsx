import { verifySession } from '@/dal/session'
import { Suspense } from 'react'
import StepContentSkeleton from '../step-content-skeleton'
import CustodyPageContent from './page-content'

export default function CustodyPage() {
  verifySession()

  return (
    <Suspense fallback={<StepContentSkeleton />}>
      <CustodyPageContent />
    </Suspense>
  )
}
