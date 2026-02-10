import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { verifySession } from '@/dal/session'
import { Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'
import StepContentSkeleton from '../../step-content-skeleton'
import { StepHeader } from '../../step-header'
import RepresentativesPageContent from './page-content'

export default function RepresentativesPage() {
  verifySession()
  const t = useTranslations('onboarding.representatives')

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="space-y-2">
        <StepHeader icon={Users} subtitle={t('subtitle')} title={t('title')} />
        <Separator />
      </CardHeader>
      <CardContent className="pt-2">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">{t('subject')}</h2>
          <p className="mb-4">{t('intro')}</p>
          <Suspense fallback={<StepContentSkeleton />}>
            <RepresentativesPageContent />
          </Suspense>
        </div>
      </CardContent>
    </Card>
  )
}
