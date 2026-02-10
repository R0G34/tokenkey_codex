'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useWeb3Auth } from '@/hooks/use-web3auth'
import { Tables } from '@/lib/supabase/types/database.types'
import { getEthPrivateKey } from '@/utils/web3auth/get-eth-privatekey'
import { Copy, Eye, EyeOff, Key, LogIn } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  wallet: Tables<'wallet'>
}

export default function Web3AuthPrivateKey({ wallet }: Props) {
  const [privateKey, setPrivateKey] = useState<string | undefined>()
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const { web3Auth } = useWeb3Auth()

  const handleClick = async () => {
    const app_scoped_privkey = await getEthPrivateKey(web3Auth!)
    setPrivateKey(app_scoped_privkey as string)
    toast('Clave privada recuperada', {
      description: 'La clave privada ha sido recuperada exitosamente.',
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast('Copiado', {
      description: 'La información ha sido copiada al portapapeles.',
    })
  }

  if (web3Auth?.status === undefined || web3Auth?.status === 'not_ready')
    return <Icons.spinner className="size-8 animate-spin text-[#83DAD5]" />

  if (!web3Auth?.connected)
    return (
      <div>
        <p className="mb-4 text-gray-600">
          Conectate con tu email {(wallet.web3auth_user_info as any).email} para
          recuperar tu clave privada
        </p>
        <Button
          disabled={!web3Auth}
          onClick={async () => {
            if (web3Auth?.connected) {
              await web3Auth?.logout({ cleanup: true })
              await web3Auth?.init()
            }
            web3Auth?.connect()
          }}
        >
          Conexión
        </Button>
      </div>
    )

  return privateKey ? (
    <div className="space-y-2">
      <div className="flex flex-col rounded-md bg-muted p-2 sm:flex-row sm:items-center sm:justify-between">
        <code className="font-mono text-sm break-all">
          {showPrivateKey ? privateKey : '••••••••••••••••'}
        </code>
        <div className="mt-2 flex space-x-2 sm:mt-0">
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
          Nunca compartas tu clave privada. Guárdala en un lugar seguro.
        </AlertDescription>
      </Alert>
    </div>
  ) : (
    <Button onClick={handleClick}>
      <LogIn className="mr-2 size-4" />
      Recuperar clave privada
    </Button>
  )
}
