'use client'

import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { formatMessage } from '@reown/appkit-siwe'
import { Check } from 'lucide-react'
import { getCsrfToken } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { MouseEvent, MouseEventHandler, useState } from 'react'
import {
  Connector,
  useAccount,
  useAccountEffect,
  useDisconnect,
  useSignMessage,
} from 'wagmi'

export function WalletConnectButton({
  disabled,
  onClickConnect,
  onSigned,
  title,
  withSignature = false,
}: {
  disabled?: boolean
  onClickConnect?: MouseEventHandler<HTMLButtonElement>
  onSigned?: (message: string, signature: string) => void
  title: string
  withSignature?: boolean
}) {
  const {
    address,
    chainId,
    connector,
    isConnected,
    // isDisconnected,
    isConnecting,
    isReconnecting,
  } = useAccount()
  const { disconnect } = useDisconnect()
  const { isPending, isSuccess, signMessageAsync } = useSignMessage()
  const [clicked, setClicked] = useState(false)
  const t = useTranslations('onboarding.custody.external.walletConnect')

  const sign = async (
    address: `0x${string}`,
    chainId: number,
    connector: Connector,
  ) => {
    const nonce = await getCsrfToken()

    if (!nonce) throw new Error(t('nonceError'))

    const messageParams = {
      domain: typeof window === 'undefined' ? '' : window.location.host,
      uri: typeof window === 'undefined' ? '' : window.location.origin,
      statement: t('prompt'),
    }

    const message = formatMessage(
      {
        domain: messageParams.domain,
        iat: new Date().toISOString(),
        nonce: nonce!,
        statement: messageParams.statement,
        uri: messageParams.uri,
        version: '1',
      },
      `eip155:${chainId}:${address}`,
    )

    try {
      // https://github.com/RabbyHub/Rabby/issues/2146
      await new Promise((resolve) => setTimeout(resolve, 300))

      const signature = await signMessageAsync({
        account: address,
        connector,
        message,
      })
      onSigned?.(message, signature)
    } catch (error) {
      disconnect()
    }

    setClicked(false)
  }

  const handleClickConnect = (event: MouseEvent<HTMLButtonElement>) => {
    setClicked(true)
    onClickConnect?.(event)
  }

  const handleClickSign = () => {
    sign(address!, chainId!, connector!)
  }

  useAccountEffect({
    onConnect: ({ address, chainId, connector }) =>
      clicked && withSignature && sign(address, chainId, connector),
  })

  return clicked &&
    withSignature &&
    isConnected &&
    address &&
    chainId &&
    connector ? (
    <Button disabled={isPending || isSuccess} onClick={handleClickSign}>
      <span className="flex items-center gap-2">
        {t('button')}{' '}
        {isPending ? (
          <Icons.spinner className="animate-spin" />
        ) : isSuccess ? (
          <Check />
        ) : null}
      </span>
    </Button>
  ) : (
    <Button disabled={disabled} onClick={handleClickConnect}>
      {title}{' '}
      {isConnecting || isReconnecting ? (
        <Icons.spinner className="animate-spin" />
      ) : null}
    </Button>
  )
}
