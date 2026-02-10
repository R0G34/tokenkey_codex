'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tables } from '@/lib/supabase/types/database.types'
import { format } from 'date-fns'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Copy,
  Key,
  LogIn,
  Mail,
} from 'lucide-react'
import { toast } from 'sonner'
import Web3AuthPrivateKey from './web3auth-privatekey'

interface Props {
  wallet: Tables<'wallet'>
}

export function WalletLinked({ wallet }: Props) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast('Copiado', {
      description: 'La información ha sido copiada al portapapeles.',
    })
  }

  return (
    <>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-6 text-green-500" />
            Wallet conectada
          </CardTitle>
          <CardDescription className="text-lg">
            {/* Tu wallet ha sido vinculada exitosamente a tu cuenta. */}
            Tu wallet está lista para usar en la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* <Alert>
            <CheckCircle2 className="size-5" />
            <AlertTitle>Wallet verificada y activa</AlertTitle>
            <AlertDescription>
              <p>Tu wallet está lista para usar en la plataforma.</p>
              <p>Recibes tus tokens de inversión en esta dirección.</p>
            </AlertDescription>
          </Alert> */}

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Dirección de wallet
              </h3>
              <div className="flex flex-col rounded-md bg-muted p-2 sm:flex-row sm:items-center sm:justify-between">
                <code className="font-mono text-sm break-all">
                  {wallet.address}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(wallet.address)}
                  className="mt-2 sm:mt-0"
                >
                  <Copy className="mr-2 size-4" />
                  Copiar
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Fecha de conexión
                </h3>
                <div className="flex items-center gap-2 rounded-md bg-muted p-2">
                  <Calendar className="size-4 text-primary" />
                  <span className="font-medium">
                    {format(wallet.created_at, 'PPP')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Tipo de wallet
                </h3>
                <div className="flex items-center gap-2 rounded-md bg-muted p-2">
                  <Key className="size-4 text-primary" />
                  <span className="font-medium">
                    {wallet.type === 'web3auth'
                      ? 'Hemos creado esta wallet para tí'
                      : 'Wallet autocustodiada'}
                  </span>
                  {/* <span className="">
                  {wallet.type === 'web3auth'
                    ? 'Hemos creado esta wallet para tí. Puedes recuperar tu clave privada cuando la necesites.'
                    : 'Es una wallet autocustodiada. Tú posees la clave privada de esta wallet.'}
                </span> */}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        {/* <CardFooter className="flex-col space-y-4">
        <Alert>
          <AlertCircle className="size-4" />
          <AlertTitle>Cambio de wallet</AlertTitle>
          <AlertDescription>
            Para cambiar tu wallet, por favor contáctanos.
          </AlertDescription>
        </Alert>
      </CardFooter> */}
      </Card>

      {wallet.type === 'web3auth' && (
        <Card>
          <CardHeader>
            <CardTitle>Recuperación de la clave privada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Email asociado
                </h4>
                <div className="flex items-center gap-2 rounded-md bg-muted p-2">
                  <Mail className="size-4 text-primary" />
                  <span className="font-medium break-all">
                    {(wallet.web3auth_user_info as any).email}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Método de login
                </h4>
                <div className="flex items-center gap-2 rounded-md bg-muted p-2">
                  <LogIn className="size-4 text-primary" />
                  <span className="font-medium">
                    {(wallet.web3auth_user_info as any).typeOfLogin ===
                    'email_passwordless'
                      ? 'email'
                      : (wallet.web3auth_user_info as any).typeOfLogin}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Clave privada
              </h4>
              {/* <Web3AuthPrivateKey wallet={wallet} /> */}
              {/* {privateKey ? (
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-muted rounded-md">
                    <code className="text-sm font-mono break-all">
                      {showPrivateKey ? privateKey : '••••••••••••••••'}
                    </code>
                    <div className="flex mt-2 sm:mt-0 space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                      >
                        {showPrivateKey ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(privateKey)}
                      >
                        <Copy className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <Alert>
                    <Key className="size-4" />
                    <AlertTitle>Importante</AlertTitle>
                    <AlertDescription>
                      Nunca compartas tu clave privada. Guárdala en un lugar
                      seguro.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <Button onClick={retrievePrivateKey} disabled={isProcessing}>
                  <LogIn className="mr-2 size-4" />
                  {isProcessing ? 'Recuperando...' : 'Recuperar clave privada'}
                </Button>
              )} */}
              <Web3AuthPrivateKey wallet={wallet} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Alert>
            <AlertCircle className="size-4" />
            <AlertTitle>Cambio de wallet</AlertTitle>
            <AlertDescription>
              Para cambiar tu wallet, por favor contáctanos.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </>
  )
}
