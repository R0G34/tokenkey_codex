import { Alert, AlertDescription } from '@/components/ui/alert'
import { verifySession } from '@/dal/session'
import { AlertCircle, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'
import StepContentSkeleton from '../step-content-skeleton'
import WphgPageContent from './page-content'

export default function WphgPage() {
  verifySession()
  const t = useTranslations('onboarding.wphg')

  return (
    <div className="space-y-4">
      <Alert className="border border-blue-100 bg-blue-50">
        <Info className="size-4 text-blue-500!" />
        <AlertDescription className="text-xs whitespace-pre-line md:text-sm">
          {t('p1')}
        </AlertDescription>
      </Alert>
      <Alert className="border border-amber-100 bg-amber-50">
        <AlertCircle className="size-4 text-amber-800!" />
        <AlertDescription className="text-xs md:text-sm">
          {t('p2')}
        </AlertDescription>
      </Alert>
      {/* <p className="mb-4">{t('p1')}</p>
      <p className="mb-4">{t('p2')}</p> */}
      <Suspense fallback={<StepContentSkeleton />}>
        <WphgPageContent />
      </Suspense>
    </div>
  )
}
