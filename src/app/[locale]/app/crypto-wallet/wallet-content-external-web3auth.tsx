'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Info, Key } from 'lucide-react'
import BackButton from './back-button'
import Web3AuthWallet from './web3auth-wallet'

export default function WalletContentExternalWeb3Auth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="size-6 text-primary" />
          Genera una nueva wallet
        </CardTitle>
        <CardDescription>
          Genera una nueva wallet de forma segura.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <Info className="size-4" />
          <AlertTitle>Wallet TokenKey</AlertTitle>
          <AlertDescription>
            La wallet TokenKey está protegida por tu cuenta de redes sociales o
            correo electrónico. Es segura y sencilla. Obtendrás control total de
            tus tokens.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-between">
        <BackButton />
        <Web3AuthWallet />
      </CardFooter>
    </Card>
  )
}
