import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { verifySession } from '@/dal/session'
import { Info, UserCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'
import StepContentSkeleton from '../step-content-skeleton'
import { StepHeader } from '../step-header'
import PepPageContent from './page-content'

export default function PepPage() {
  verifySession()
  const t = useTranslations('onboarding.pepStatus')

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="space-y-2">
        <StepHeader
          icon={UserCheck}
          subtitle={t('subtitle')}
          title={t('title')}
        />
        <Separator />
      </CardHeader>
      <CardContent className="pt-2">
        <Alert className="mb-4 border border-blue-100 bg-blue-50">
          <Info className="size-4 text-blue-500!" />
          <AlertDescription className="text-xs md:text-sm">
            {t('intro')}
          </AlertDescription>
        </Alert>
        <Suspense fallback={<StepContentSkeleton />}>
          <PepPageContent />
        </Suspense>
      </CardContent>
    </Card>
  )
}
