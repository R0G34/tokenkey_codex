import { Alert, AlertDescription } from '@/components/ui/alert'
import AppKitProvider from '@/contexts/appkit-provider'
import { selectUserWithPersonalDataAndExperience } from '@/dal/onboarding/queries/select-user-with-personaldata-and-experience'
import { selectWallet } from '@/dal/wallet'
import { redirect } from '@/i18n/navigation'
import { Info } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'
import MissingWallet from './missing-wallet'
import { WalletProvider } from './wallet-context'
import { WalletLinked } from './wallet-linked'

export default async function CustodyPageContent() {
  const [locale, user, wallet, t] = await Promise.all([
    getLocale(),
    selectUserWithPersonalDataAndExperience(),
    selectWallet(),
    getTranslations('onboarding.custody'),
  ])

  if (
    !user.experience?.consent ||
    (user.experience.consent === 'no' && !user.experience.risk_consent) ||
    (user.experience.consent === 'yes' &&
      (user.experience.score === null ||
        (user.experience.score < 7 && !user.experience.risk_consent)))
  )
    return redirect({ href: '/app/onboarding/wphg', locale })

  if (!wallet) {
    return (
      <WalletProvider>
        <AppKitProvider cookies={(await headers()).get('cookie')}>
          <div className="mx-auto max-w-6xl space-y-4">
            <Alert className="border border-blue-100 bg-blue-50">
              <Info className="size-4 text-blue-500" />
              <AlertDescription>{t('intro')}</AlertDescription>
            </Alert>
            <MissingWallet />
          </div>
        </AppKitProvider>
      </WalletProvider>
    )
  }

  return <WalletLinked wallet={wallet} />
}
