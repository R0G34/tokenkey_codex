import { verifySession } from '@/dal/session'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'
import StepContentSkeleton from '../../step-content-skeleton'
import WphgKnowledgePageContent from './page-content'

export default function WphgKnowledgePage() {
  verifySession()
  const t = useTranslations('onboarding.wphg.knowledge')

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
        {t('title')}
      </h2>
      <Suspense fallback={<StepContentSkeleton />}>
        <WphgKnowledgePageContent />
      </Suspense>
    </div>
  )
}
