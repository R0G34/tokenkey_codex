import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { polygon, polygonAmoy } from '@reown/appkit/networks'
import { cookieStorage, createStorage } from '@wagmi/core'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

export const defaultNetwork =
  process.env.VERCEL_ENV === 'production' ? polygon : polygonAmoy

export const wagmiAdapter = new WagmiAdapter({
  networks: [defaultNetwork],
  projectId,
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
})
