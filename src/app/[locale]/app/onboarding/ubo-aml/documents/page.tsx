import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { verifySession } from '@/dal/session'
import { FilesIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'
import StepContentSkeleton from '../../step-content-skeleton'
import { StepHeader } from '../../step-header'
import UboAmlPageContent from './page-content'

export default function UboAmlPage() {
  verifySession()
  const t = useTranslations('onboarding.uboAml')

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="space-y-2">
        <StepHeader
          icon={FilesIcon}
          subtitle={t('subtitle')}
          title={t('title')}
        />
        <Separator />
      </CardHeader>
      <CardContent className="pt-2">
        <h2 className="mb-4 text-2xl font-semibold">{t('subject')}</h2>
        <p className="mb-4">{t('p1')}</p>
        <p className="mb-4">{t('p2')}</p>
        <Suspense fallback={<StepContentSkeleton />}>
          <UboAmlPageContent />
        </Suspense>
      </CardContent>
    </Card>
  )
}
