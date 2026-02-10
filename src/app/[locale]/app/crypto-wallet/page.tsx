import AppKitProvider from '@/contexts/appkit-provider'
import { verifySession } from '@/dal/session'
import { selectWallet } from '@/dal/wallet'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { PropsWithChildren } from 'react'
import MissingWallet from './missing-wallet'
import { WalletProvider } from './wallet-context'
import { WalletLinked } from './wallet-linked'
import WalletStepper from './wallet-stepper'

export const metadata: Metadata = {
  title: 'App - Wallet',
}

const Layout = ({ children }: PropsWithChildren) => (
  // <div className="space-y-6">
  <div className="mx-auto w-full max-w-4xl space-y-6 pb-8">
    <h1 className="text-3xl font-bold">Wallet</h1>
    {children}
  </div>
)

export default async function WalletPage() {
  await verifySession()

  const wallet = await selectWallet()

  // if (!data?.personal_data)
  //   return (
  //     <Layout>
  //       <MissingPersonalData />
  //     </Layout>
  //   )

  if (!wallet)
    return (
      <WalletProvider>
        <AppKitProvider cookies={(await headers()).get('cookie')}>
          <div className="container mx-auto max-w-4xl px-4 py-8">
            <WalletStepper />
            <div className="mt-8">
              <MissingWallet />
            </div>
          </div>
        </AppKitProvider>
      </WalletProvider>
    )

  return (
    <Layout>
      <WalletLinked wallet={wallet} />
    </Layout>
  )
}
