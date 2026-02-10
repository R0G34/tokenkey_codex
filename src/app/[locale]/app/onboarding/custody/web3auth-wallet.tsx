'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Skeleton } from '@/components/ui/skeleton'
import { useWeb3Auth } from '@/hooks/use-web3auth'
import { useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { upsertUserInAuth0 } from './actions'

export default function Web3AuthWallet() {
  const t = useTranslations('onboarding.custody.web3auth')
  const { web3Auth } = useWeb3Auth(
    `${window.location.protocol}//${window.location.host}/app/onboarding/custody/validate`,
  )
  const [isPending, startTransition] = useTransition()

  if (web3Auth?.status === undefined || web3Auth?.status === 'not_ready')
    return <Skeleton className="h-9 w-32" />

  return (
    <Button
      disabled={!web3Auth || isPending}
      onClick={() => {
        startTransition(async () => {
          await upsertUserInAuth0()

          if (web3Auth?.connected) {
            await web3Auth?.logout({ cleanup: true })
            await web3Auth?.init()
          }
          web3Auth?.connect()
        })
      }}
    >
      {isPending && <Icons.spinner className="animate-spin" />}
      {t('continue')}
    </Button>
  )
}
