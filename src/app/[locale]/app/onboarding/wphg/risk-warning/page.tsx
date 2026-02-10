import { verifySession } from '@/dal/session'
import { Suspense } from 'react'
import StepContentSkeleton from '../../step-content-skeleton'
import WphgRiskWarningPageContent from './page-content'

export default function WphgRiskWarningPage() {
  verifySession()

  return (
    <Suspense fallback={<StepContentSkeleton />}>
      <WphgRiskWarningPageContent />
    </Suspense>
  )
}
