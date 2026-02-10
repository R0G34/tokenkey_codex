'use client'

import { Icons } from '@/components/ui/icons'
import { useWeb3Auth } from '@/hooks/use-web3auth'
import { useRouter as i18nUseRouter } from '@/i18n/navigation'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { getEthPrivateKey } from '@/utils/web3auth/get-eth-privatekey'
import { getPublicKey } from '@/utils/web3auth/get-publickey'
import { Web3Auth } from '@web3auth/modal'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
// eslint-disable-next-line no-restricted-imports
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { saveWeb3AuthWallet } from '../actions'

export default function OnboardingWalletValidatePage() {
  const router = useRouter()
  const i18nRouter = i18nUseRouter()
  const { web3Auth } = useWeb3Auth()
  const { data: session } = useSession()
  const t = useTranslations('onboarding')

  useEffect(() => {
    if (!session) return router.push('/api/auth/signin')

    // Do nothing if web3Auth is not initialized.
    if (!web3Auth) return

    if (!web3Auth.connected) {
      toast.error(t('custody.web3auth.error'))
      return i18nRouter.push('/app/onboarding/custody')
    }

    const saveWallet = async (_web3Auth: Web3Auth) => {
      try {
        const userInfo = await _web3Auth.getUserInfo()

        if (!userInfo.idToken) {
          toast.error(t('custody.web3auth.errorUser'))
          return i18nRouter.push('/app/onboarding/custody')
        }

        const appScopedPrivkey = await getEthPrivateKey(_web3Auth)
        const appPubKey = getPublicKey(appScopedPrivkey as string)

        const { error } = await saveWeb3AuthWallet(appPubKey, userInfo)

        if (error) {
          toast.error(t('custody.web3auth.error'), { description: error })
          await web3Auth?.logout({ cleanup: true })
        }

        i18nRouter.push('/app/onboarding/custody')
      } catch (error) {
        const message = getErrorMessage(error)
        console.log('❌', message)
        if (message) toast.error(message)
        else toast.error(t('custody.web3auth.error'))
        i18nRouter.push('/app/onboarding/custody')
      }
    }

    saveWallet(web3Auth)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Auth])

  return (
    // <div className="flex size-full min-h-screen flex-col items-center justify-center gap-8">
    <div className="flex flex-col items-center justify-center gap-8">
      <Icons.spinner className="size-16 animate-spin text-[#83DAD5]" />
      <p>{t('custody.web3auth.validating')}</p>
    </div>
  )
}
