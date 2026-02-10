import {
  AuthAdapter,
  AuthAdapterOptions,
  LANGUAGE_TYPE,
  WHITE_LABEL_THEME,
  WhiteLabelData,
} from '@web3auth/auth-adapter'
import {
  CustomChainConfig,
  UX_MODE,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { ModalConfig, Web3Auth, Web3AuthOptions } from '@web3auth/modal'
import { Locale } from 'next-intl'
import { chains } from './chains'

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!

const chainConfig: CustomChainConfig =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? chains.Polygon
    : chains.PolygonAmoy

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  privateKeyProvider,
  // https://web3auth.io/docs/features/session-management#customizing-session-duration
  // max value 7 days (86400 * 7) and min 1 day (86400)
  // sessionTime: 60 * 60 * 24 * 1,
  uiConfig: {
    appName: 'TokenKey',
    appUrl: typeof window === 'undefined' ? undefined : window.location.origin,
    logoDark:
      typeof window === 'undefined'
        ? undefined
        : 'https://www.tokenkey.io/favicon.ico',
    logoLight:
      typeof window === 'undefined'
        ? undefined
        : 'https://www.tokenkey.io/favicon.ico',
    mode: 'light',
    privacyPolicy:
      typeof window === 'undefined'
        ? undefined
        : {
            de: `${window.location.origin}/de/datenschutz`,
            en: `${window.location.origin}/en/privacy`,
            es: `${window.location.origin}/es/privacidad`,
          },
    theme: { onPrimary: '#fff', primary: '#299d90' },
    tncLink:
      typeof window === 'undefined'
        ? undefined
        : {
            de: `${window.location.origin}/de/impressum`,
            en: `${window.location.origin}/en/imprint`,
            es: `${window.location.origin}/es/aviso-legal`,
          },
    useLogoLoader: true,
  },
  web3AuthNetwork:
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
      ? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET
      : WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
}

const authAdapterOptions: AuthAdapterOptions = {
  adapterSettings: {
    loginConfig: {
      google: {
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        typeOfLogin: 'google',
        verifier: 'w3a-aggregated',
        verifierSubIdentifier: 'w3a-google',
      },
      // auth0emailpasswordless: {
      email_passwordless: {
        clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
        jwtParameters: {
          domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
          isVerifierIdCaseSensitive: false,
          // login_hint: 'develop@tessermint.com', // email to send the OTP to
          // this corresponds to the field inside jwt which must be used to uniquely identify the user. This is mapped b/w google and email passwordless logins of Auth0
          verifierIdField: 'email',
        },
        typeOfLogin: 'jwt', // For Auth0, it's jwt and not Auth0.
        verifier: 'w3a-aggregated',
        verifierSubIdentifier: 'w3a-emailpasswordless-via-auth0',
      },
    },
    redirectUrl:
      typeof window === 'undefined'
        ? undefined
        : `${window.location.origin}/app/crypto-wallet/validate`,
    uxMode: UX_MODE.REDIRECT,
    whiteLabel: {
      appName: 'TokenKey',
      appUrl:
        typeof window === 'undefined' ? undefined : window.location.origin,
      logoDark:
        typeof window === 'undefined'
          ? undefined
          : 'https://www.tokenkey.io/favicon.ico',
      logoLight:
        typeof window === 'undefined'
          ? undefined
          : 'https://www.tokenkey.io/favicon.ico',
      mode: 'light', // whether to enable dark mode. defaultValue: auto
      privacyPolicy:
        typeof window === 'undefined'
          ? undefined
          : `${window.location.origin}/privacy`,
      theme: { onPrimary: '#fff', primary: '#299d90' } as WHITE_LABEL_THEME,
      tncLink:
        typeof window === 'undefined'
          ? undefined
          : `${window.location.origin}/imprint`,
      useLogoLoader: true,
    } as WhiteLabelData,
  },
  loginSettings: { curve: 'secp256k1', mfaLevel: 'none' },
  privateKeyProvider,
}

// https://web3auth.io/community/t/how-to-remove-all-social-login-email-login-option-from-modal-only-keep-external-wallet-option/6598/11
const modalConfig: Record<string, ModalConfig> = {
  [WALLET_ADAPTERS.AUTH]: {
    label: 'auth',
    loginMethods: {
      apple: { name: 'apple', showOnModal: false },
      discord: { name: 'discord', showOnModal: false },
      // email_passwordless: { name: 'email_passwordless', showOnModal: false },
      facebook: { name: 'facebook', showOnModal: false },
      farcaster: { name: 'farcaster', showOnModal: false },
      github: { name: 'github', showOnModal: false },
      // google: { name: 'google', showOnModal: false },
      kakao: { name: 'kakao', showOnModal: false },
      line: { name: 'line', showOnModal: false },
      linkedin: { name: 'linkedin', showOnModal: false },
      reddit: { name: 'reddit', showOnModal: false },
      sms_passwordless: { name: 'sms_passwordless', showOnModal: false },
      twitch: { name: 'twitch', showOnModal: false },
      twitter: { name: 'twitter', showOnModal: false },
      wechat: { name: 'wechat', showOnModal: false },
      weibo: { name: 'weibo', showOnModal: false },
    },
  },
  // [WALLET_ADAPTERS.TORUS_EVM]: { label: 'TORUS_EVM', showOnModal: false },
  // [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
  //   label: 'WALLET_CONNECT_V2',
  //   showOnModal: false,
  // },
}

export const initWeb3AuthModal = async (
  locale: Locale,
  callbackUrl?: string,
) => {
  web3AuthOptions.uiConfig!.defaultLanguage = locale as LANGUAGE_TYPE
  const _web3Auth = new Web3Auth(web3AuthOptions)

  authAdapterOptions.adapterSettings!.whiteLabel!.defaultLanguage =
    locale as LANGUAGE_TYPE
  authAdapterOptions.adapterSettings!.loginConfig!.email_passwordless!.jwtParameters!.ui_locales =
    locale
  if (callbackUrl) authAdapterOptions.adapterSettings!.redirectUrl = callbackUrl
  const authAdapter = new AuthAdapter(authAdapterOptions)

  _web3Auth.configureAdapter(authAdapter)

  // const adapters = await getInjectedAdapters({ options: web3AuthOptions })
  // const metamaskAdapter = adapters.find((e) => e.name == 'metamask')
  // _web3Auth.configureAdapter(metamaskAdapter)

  // const defaultWcSettings = await getWalletConnectV2Settings(
  //   CHAIN_NAMESPACES.EIP155,
  //   [chainConfig.chainId],
  //   process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
  // )
  // const walletConnectAdapter = new WalletConnectV2Adapter({
  //   adapterSettings: { ...defaultWcSettings.adapterSettings },
  //   loginSettings: { ...defaultWcSettings.loginSettings },
  // })
  // _web3Auth.configureAdapter(walletConnectAdapter)

  await _web3Auth.initModal({ modalConfig })

  return _web3Auth
}
