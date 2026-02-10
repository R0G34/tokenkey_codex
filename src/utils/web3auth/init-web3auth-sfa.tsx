import 'server-only'

import { WEB3AUTH_NETWORK } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Web3Auth } from '@web3auth/single-factor-auth'
import { chains } from './chains'

// https://web3auth.io/docs/sdk/sfa/sfa-js/initialize
// https://web3auth.io/docs/guides/sfa-web-aggregate#using-the-web3auth-sfa-js-sdk
// https://web3auth.io/docs/guides/next-auth

export const initWeb3AuthSFA = async () => {
  const web3Auth = new Web3Auth({
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
    // enableLogging: true,
    privateKeyProvider: new EthereumPrivateKeyProvider({
      config: {
        chainConfig:
          process.env.VERCEL_ENV === 'production'
            ? chains.Polygon
            : chains.PolygonAmoy,
      },
    }),
    // https://web3auth.io/docs/features/session-management#customizing-session-duration
    // max value 7 days (86400 * 7) and min 1 day (86400)
    // sessionTime: 60 * 60 * 24 * 1,
    // what does it do? default is web
    // mode: '', // "react-native" | "web" | "node"
    usePnPKey: true, // By default, this SDK returns CoreKitKey. Setting this to true returns the same key as web SDK (i.e., plug-n-play key).
    web3AuthNetwork:
      process.env.VERCEL_ENV === 'production'
        ? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET
        : WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  })
  await web3Auth.init()
  return web3Auth
}
