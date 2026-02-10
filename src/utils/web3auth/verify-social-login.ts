import { SocialLoginPayload } from '@/lib/web3auth/types/social-login-payload'
import { SUPPORTED_KEY_CURVES } from '@web3auth/auth-adapter'
import * as jose from 'jose'

const publicKeyToAddress = require('ethereum-public-key-to-address')

export const verifySocialLogin = async (appPubKey: string, idToken: string) => {
  let jwtPayload: SocialLoginPayload | null = null
  try {
    const jwks = jose.createRemoteJWKSet(
      new URL(
        'https://api-auth.web3auth.io/jwks', // for social logins
        // 'https://authjs.web3auth.io/jwks' // for external wallets
      ),
    )
    const jwtDecoded = await jose.jwtVerify(idToken, jwks, {
      algorithms: ['ES256'],
    })
    jwtPayload = jwtDecoded.payload as SocialLoginPayload
  } catch (error) {
    jwtPayload = null
  }

  // https://web3auth.io/docs/features/server-side-verification#verifying-idtoken
  if (
    !jwtPayload ||
    jwtPayload.wallets
      .find(
        ({ curve, type }) =>
          type === 'web3auth_app_key' &&
          curve === SUPPORTED_KEY_CURVES.SECP256K1,
      )
      ?.public_key.toLowerCase() !== appPubKey.toLowerCase()
  )
    return null

  const address = publicKeyToAddress(
    jwtPayload.wallets
      .find(
        ({ curve, type }) =>
          type === 'web3auth_app_key' &&
          curve === SUPPORTED_KEY_CURVES.SECP256K1,
      )!
      .public_key.toLowerCase(),
  )

  return {
    email: jwtPayload.email,
    name: jwtPayload.name,
    walletAddress: address,
  }
}
