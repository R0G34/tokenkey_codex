'use client'

import { getErrorMessage } from '@/utils/error/get-error-message'
import { initWeb3AuthModal } from '@/utils/web3auth/init-web3auth-modal'
import { Web3Auth } from '@web3auth/modal'
import { useLocale } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

// https://web3auth.io/community/t/how-to-properly-wait-for-the-initialization/5991
/* web3auth.on(
  ADAPTER_EVENTS.CONNECTED,
  (data: CONNECTED_EVENT_DATA) => console.log('connected to wallet', data),
  // web3auth.provider will be available here after user is connected
)
web3auth.on(ADAPTER_EVENTS.CONNECTING, () => console.log('connecting'))
web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => console.log('disconnected'))
web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => console.log('error', error))
*/

export function useWeb3Auth(callbackUrl?: string) {
  const isMounted = useRef(false)
  const locale = useLocale()
  const [web3Auth, setWeb3Auth] = useState<Web3Auth | undefined>()

  useEffect(
    () => {
      if (isMounted.current) return

      const init = async () => {
        try {
          const _web3Auth = await initWeb3AuthModal(locale, callbackUrl)
          setWeb3Auth(_web3Auth)
        } catch (error) {
          const message = getErrorMessage(error)
          console.error(message)
        }
      }

      init()

      isMounted.current = true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callbackUrl],
  )

  return { web3Auth }
}
