'use client'

import { useAppKit } from '@reown/appkit/react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useDisconnect } from 'wagmi'
import { saveEOA } from './actions'
import { WalletConnectButton } from './wallet-connect-button'

export function LinkEOAButton() {
  const { disconnect } = useDisconnect()
  const { open, close } = useAppKit()
  const { data: session } = useSession()
  const t = useTranslations('onboarding.custody.external')

  if (!session) return null

  const handleClickConnect = () => {
    disconnect()
    open({ view: 'Connect' })
  }

  const handleSigned = async (message: string, signature: string) => {
    close()

    const { error } = await saveEOA(message, signature)

    if (error) toast.error(error)
  }

  return (
    <WalletConnectButton
      onClickConnect={handleClickConnect}
      onSigned={handleSigned}
      title={t('continue')}
      withSignature={true}
    />
  )
}
