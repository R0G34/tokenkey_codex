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
import { AlertCircle, Key } from 'lucide-react'
import BackButton from './back-button'
import { LinkEOAButton } from './link-eoa-button'

export default function EOA() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="size-6 text-primary" />
          Conecta tu wallet
        </CardTitle>
        <CardDescription>Conecta tu wallet de forma segura.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="size-4" />
          <AlertTitle>Verificación requerida</AlertTitle>
          <AlertDescription>
            Necesitarás firmar un mensaje para probar que eres el propietario de
            esta wallet.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-between">
        <BackButton />
        <LinkEOAButton />
      </CardFooter>
    </Card>
  )
}
