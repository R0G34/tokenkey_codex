import { verifySession } from '@/dal/session'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'
import StepContentSkeleton from '../../step-content-skeleton'
import WphgProfessionalPageContent from './page-content'

export default function WphgProfessionalPage() {
  verifySession()
  const t = useTranslations('onboarding.wphg.professional')

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-2 text-lg font-bold text-gray-900 md:text-2xl dark:text-white">
          {t('title')}
        </h2>
      </div>
      <Suspense fallback={<StepContentSkeleton />}>
        <WphgProfessionalPageContent />
      </Suspense>
    </>
  )
}
