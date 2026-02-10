import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { verifySession } from '@/dal/session'
import { Building } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'
import StepContentSkeleton from '../../step-content-skeleton'
import { StepHeader } from '../../step-header'
import BeneficialOwnersPageContent from './page-content'

export default function BeneficialOwnersPage() {
  verifySession()
  const t = useTranslations('onboarding.beneficialOwners')

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="space-y-2">
        <StepHeader
          icon={Building}
          subtitle={t('subtitle')}
          title={t('title')}
        />
        <Separator />
      </CardHeader>
      <CardContent className="pt-2">
        <h2 className="mb-4 text-2xl font-semibold">{t('subject')}</h2>
        <p className="mb-4 text-sm">{t('intro')}</p>
        <Suspense fallback={<StepContentSkeleton />}>
          <BeneficialOwnersPageContent />
        </Suspense>
      </CardContent>
    </Card>
  )
}
