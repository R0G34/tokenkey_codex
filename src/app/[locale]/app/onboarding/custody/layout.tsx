import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Wallet } from 'lucide-react'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { PropsWithChildren } from 'react'
import { StepHeader } from '../step-header'

interface Props {
  params: Promise<{ locale: Locale }>
}

export default async function CryptoWalletLayout({
  children,
}: PropsWithChildren<Props>) {
  const t = await getTranslations('onboarding.custody')

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="space-y-2">
        <StepHeader icon={Wallet} subtitle={t('subtitle')} title={t('title')} />
        <Separator />
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  )
}
