import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { verifySession } from '@/dal/session'
import { User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'
import OnboardingPageContent from './page-content'
import StepContentSkeleton from './step-content-skeleton'
import { StepHeader } from './step-header'

export default function OnboardingPage() {
  verifySession()
  const t = useTranslations('onboarding.personalData')

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="space-y-2">
        <StepHeader icon={User} subtitle={t('subtitle')} title={t('title')} />
        <Separator />
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <Suspense fallback={<StepContentSkeleton />}>
          <OnboardingPageContent />
        </Suspense>
      </CardContent>
    </Card>
  )
}
