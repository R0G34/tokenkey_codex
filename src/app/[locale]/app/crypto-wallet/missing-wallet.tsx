'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight, Key } from 'lucide-react'
import BackButton from './back-button'
import EOA from './eoa'
import WalletContentExternalWeb3Auth from './wallet-content-external-web3auth'
import { useWallet } from './wallet-context'

export default function MissingWallet() {
  const {
    config: { step, type },
    setConfig,
  } = useWallet()

  switch (step) {
    case 0:
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="size-4 text-primary" />
              Configuración de wallet
            </CardTitle>
            <CardDescription>
              Configura tu wallet para recibir y gestionar tus tokens de forma
              segura.
            </CardDescription>
          </CardHeader>
          <CardContent>
            Necesitarás una criptowallet para guardar tus inversiones de forma
            segura. Imagina que es como una caja fuerte virtual, pero para tus
            criptomonedas y nuestros tokens de activos financieros. Solo tú
            tendrás las llaves para acceder a tus activos.
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => setConfig({ step: 1 })}>
              Continuar <ArrowRight className="ml-2 size-4" />
            </Button>
          </CardFooter>
        </Card>
      )
    case 1:
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="size-4 text-primary" />
              Configuración de wallet
            </CardTitle>
            <CardDescription>
              Puedes usar una wallet existente o crear una nueva fácilmente.
              <p className="mt-4 font-medium">
                Una wallet es esencial para almacenar y gestionar tus tokens de
                forma segura. Te permite recibir, guardar y transferir tus
                activos digitales en la blockchain.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setConfig({ step: 2, type: 'web3auth' })}
              // className="w-full justify-start"
              className="flex h-24 w-full flex-col items-start gap-1 text-left whitespace-normal"
              variant="outline"
            >
              <div className="flex">
                <Key className="mr-2 size-4" />
                Generar una nueva wallet
              </div>
              <p className="text-xs font-normal">
                Esto es perfecto si eres nuevo en las wallets de criptomonedas.
              </p>
            </Button>
            <Button
              onClick={() => setConfig({ step: 2, type: 'external' })}
              // className="w-full justify-start"
              className="flex h-24 w-full flex-col items-start gap-1 text-left whitespace-normal"
              variant="outline"
            >
              <div className="flex">
                <Key className="mr-2 size-4" />
                Tengo una wallet
              </div>
              <p className="text-xs font-normal">
                Elige esta opción si ya tienes una wallet y conoces la clave
                privada.
              </p>
            </Button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <BackButton />
          </CardFooter>
        </Card>
      )
    case 2:
      if (type === 'external') return <EOA />
      if (type === 'web3auth') return <WalletContentExternalWeb3Auth />
    default:
      return null
  }
}
