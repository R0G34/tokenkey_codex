import { ExternalWalletPayload } from '@/lib/web3auth/types/external-wallet-payload'
import * as jose from 'jose'

export const verifyExternalWallet = async (
  publicAddress: string,
  idToken: string,
) => {
  let jwtPayload: ExternalWalletPayload | null = null
  try {
    const jwks = jose.createRemoteJWKSet(
      new URL('https://authjs.web3auth.io/jwks'), // for external wallets
    )
    const jwtDecoded = await jose.jwtVerify(idToken, jwks, {
      algorithms: ['ES256'],
    })
    jwtPayload = jwtDecoded.payload as ExternalWalletPayload
  } catch (error) {
    jwtPayload = null
  }

  if (
    !jwtPayload ||
    jwtPayload.wallets[0].address.toLowerCase() !== publicAddress.toLowerCase()
  )
    return null

  return { email: undefined, name: undefined, walletAddress: publicAddress }
}
