'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import EOA from './eoa'
import WalletContentExternalWeb3Auth from './wallet-content-external-web3auth'
import { useWallet } from './wallet-context'

export default function MissingWallet() {
  const {
    config: { step, type },
    setConfig,
  } = useWallet()

  const t = useTranslations('onboarding.custody.missingWallet')

  switch (step) {
    case 0:
      return (
        // <Card>
        //   <CardHeader>
        //     <CardTitle className="flex items-center gap-2">
        //       <Key className="size-6 text-primary" />
        //       Configuración de wallet
        //     </CardTitle>
        //     <CardDescription>
        //       Configura tu wallet para recibir y gestionar tus tokens de forma
        //       segura.
        //     </CardDescription>
        //   </CardHeader>
        //   <CardContent>
        //     <Alert>
        //       <AlertCircle className="size-4" />
        //       <AlertTitle>¿Por qué necesito una wallet?</AlertTitle>
        //       <AlertDescription>
        //         Una wallet es esencial para almacenar y gestionar tus tokens de
        //         forma segura. Te permite recibir, guardar y transferir tus
        //         activos digitales en la blockchain.
        //       </AlertDescription>
        //     </Alert>
        //   </CardContent>
        //   <CardFooter className="flex justify-end">
        //     <Button onClick={() => setConfig({ step: 1 })}>
        //       Continuar <ArrowRight className="ml-2 size-4" />
        //     </Button>
        //   </CardFooter>
        // </Card>
        <Button onClick={() => setConfig({ step: 1 })}>
          {t('step0.continue')} <ArrowRight className="ml-2 size-4" />
        </Button>
      )
    case 1:
      return (
        // <Card>
        //   <CardHeader>
        //     <CardTitle className="flex items-center gap-2">
        //       <Key className="size-6 text-primary" />
        //       Elige tu opción
        //     </CardTitle>
        //     <CardDescription>
        //       Puedes usar una wallet existente o crear una nueva fácilmente.
        //     </CardDescription>
        //   </CardHeader>
        //   <CardContent className="space-y-4">
        //     <Button
        //       onClick={() => setConfig({ step: 2, type: 'external' })}
        //       // className="w-full justify-start"
        //       className="flex h-24 w-full flex-col items-start gap-1 whitespace-normal text-left"
        //       variant="outline"
        //     >
        //       <div className="flex">
        //         <Key className="mr-2 size-4" />
        //         Tengo una wallet
        //       </div>
        //       <p className="text-xs font-normal">
        //         Elige esta opción si ya tienes una wallet y conoces la clave
        //         privada.
        //       </p>
        //     </Button>
        //     <Button
        //       onClick={() => setConfig({ step: 2, type: 'web3auth' })}
        //       // className="w-full justify-start"
        //       className="flex h-24 w-full flex-col items-start gap-1 whitespace-normal text-left"
        //       variant="outline"
        //     >
        //       <div className="flex">
        //         <Key className="mr-2 size-4" />
        //         Generar una nueva wallet
        //       </div>
        //       <p className="text-xs font-normal">
        //         Esto es perfecto si eres nuevo en las wallets de criptomonedas.
        //       </p>
        //     </Button>
        //   </CardContent>
        //   <CardFooter className="flex justify-between">
        //     <BackButton />
        //   </CardFooter>
        // </Card>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="flex items-center gap-2 text-xl font-semibold">
              {t('step1.title')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('step1.subtitle')}
            </p>
          </div>
          <Button
            onClick={() => setConfig({ step: 2, type: 'web3auth' })}
            // className="w-full justify-start"
            className="flex h-24 w-full flex-col items-start gap-1 text-left whitespace-normal"
            variant="outline"
          >
            <div className="flex">{t('step1.generate.title')}</div>
            <p className="text-xs font-normal">
              {t('step1.generate.subtitle')}
            </p>
          </Button>
          <Button
            onClick={() => setConfig({ step: 2, type: 'external' })}
            // className="w-full justify-start"
            className="flex h-24 w-full flex-col items-start gap-1 text-left whitespace-normal"
            variant="outline"
          >
            <div className="flex">{t('step1.connect.title')}</div>
            <p className="text-xs font-normal">{t('step1.connect.subtitle')}</p>
          </Button>
        </div>
      )
    case 2:
      if (type === 'external') return <EOA />
      if (type === 'web3auth') return <WalletContentExternalWeb3Auth />
    default:
      return null
  }
}
