import { verifySession } from '@/dal/session'
import { Suspense } from 'react'
import StepContentSkeleton from '../step-content-skeleton'
import IdentificationPageContent from './page-content'

export default function IdentificationPage() {
  verifySession()

  return (
    <Suspense fallback={<StepContentSkeleton />}>
      <IdentificationPageContent />
    </Suspense>
  )
}
