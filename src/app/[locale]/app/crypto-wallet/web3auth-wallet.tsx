'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { useWeb3Auth } from '@/hooks/use-web3auth'

export default function Web3AuthWallet() {
  const { web3Auth } = useWeb3Auth()

  if (web3Auth?.status === undefined || web3Auth?.status === 'not_ready')
    return (
      <div className="space-y-6 border-2 border-dashed p-4">
        <Icons.spinner className="size-16 animate-spin text-[#83DAD5]" />
      </div>
    )

  return (
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
      Generar wallet
    </Button>
  )
}
