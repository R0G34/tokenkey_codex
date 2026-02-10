'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import BackButton from './back-button'
import { LinkEOAButton } from './link-eoa-button'

export default function EOA() {
  const t = useTranslations('onboarding.custody.external')
  return (
    // <Card>
    //   <CardHeader>
    //     <CardTitle className="flex items-center gap-2">
    //       <Key className="size-6 text-primary" />
    //       Conecta tu wallet
    //     </CardTitle>
    //     <CardDescription>Conecta tu wallet de forma segura.</CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <Alert>
    //       <AlertCircle className="size-4" />
    //       <AlertTitle>Verificación requerida</AlertTitle>
    //       <AlertDescription>
    //         Necesitarás firmar un mensaje para probar que eres el propietario de
    //         esta wallet.
    //       </AlertDescription>
    //     </Alert>
    //   </CardContent>
    //   <CardFooter className="flex justify-between">
    //     <BackButton />
    //     <LinkEOAButton />
    //   </CardFooter>
    // </Card>
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p className="flex items-center gap-2 text-lg font-semibold">
          {t('title')}
        </p>
        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>
      <Alert>
        <AlertCircle className="size-4" />
        <AlertTitle>{t('alert.title')}</AlertTitle>
        <AlertDescription>{t('alert.description')}</AlertDescription>
      </Alert>

      <div className="flex items-center gap-1">
        <BackButton />
        <LinkEOAButton />
      </div>
    </div>
  )
}
