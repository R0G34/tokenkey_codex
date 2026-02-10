import { getPublicCompressed } from '@toruslabs/eccrypto'

/**
 * https://web3auth.io/docs/features/server-side-verification#getting-app_pub_key-and-idtoken
 * @param privateKey
 * @returns
 */
export function getPublicKey(privateKey: string) {
  return getPublicCompressed(
    Buffer.from(privateKey.padStart(64, '0'), 'hex'),
  ).toString('hex')
}
