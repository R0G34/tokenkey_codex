'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import BackButton from './back-button'
import Web3AuthWallet from './web3auth-wallet'

export default function WalletContentExternalWeb3Auth() {
  const t = useTranslations('onboarding.custody.web3auth')
  return (
    // <Card>
    //   <CardHeader>
    //     <CardTitle className="flex items-center gap-2">
    //       <Key className="size-6 text-primary" />
    //       Genera una nueva wallet
    //     </CardTitle>
    //     <CardDescription>
    //       Genera una nueva wallet de forma segura.
    //     </CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <Alert>
    //       <AlertCircle className="size-4" />
    //       <AlertTitle>Wallet TokenKey</AlertTitle>
    //       <AlertDescription>
    //         La wallet TokenKey está protegida por tu cuenta de redes sociales o
    //         correo electrónico. Es segura y sencilla. Obtendrás control total de
    //         tus tokens.
    //       </AlertDescription>
    //     </Alert>
    //   </CardContent>
    //   <CardFooter className="flex justify-between">
    //     <BackButton />
    //     <Web3AuthWallet />
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
        <Web3AuthWallet />
      </div>
    </div>
  )
}
