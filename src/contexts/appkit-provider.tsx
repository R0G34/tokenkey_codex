'use client'

import { defaultNetwork, projectId, wagmiAdapter } from '@/config/wagmi'
import { createAppKit } from '@reown/appkit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { type Config, cookieToInitialState, WagmiProvider } from 'wagmi'

// Setup queryClient
const queryClient = new QueryClient()

if (!projectId) throw new Error('Project ID is not defined')

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  debug: process.env.VERCEL_ENV !== 'production',
  defaultNetwork,
  // enableWalletConnect: false,
  enableWalletGuide: false,
  features: {
    analytics: process.env.VERCEL_ENV === 'production',
    email: false,
    legalCheckbox: false,
    onramp: false,
    socials: false,
    swaps: false,
  },
  metadata: {
    description:
      'TokenKey El presente de la inversión en el sector inmobiliario. Invierte como los grandes inversores. Nuestro sistema de tokenización, permite […]',
    icons: [
      // 'https://avatars.githubusercontent.com/u/37784886'
    ],
    name: 'TokenKey',
    url: 'https://tokenkey.io', // origin must match your domain & subdomain
  },
  networks: [defaultNetwork],
  // privacyPolicyUrl: 'https://tokenkey.io/privacy',
  projectId,
  // termsConditionsUrl: 'https://tokenkey.io/terms-and-conditions',
})

export default function AppKitProvider({
  children,
  cookies,
}: {
  children: ReactNode
  cookies: string | null
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies,
  )
  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
