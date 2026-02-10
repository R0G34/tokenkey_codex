import 'server-only'

import { adminInsertWallet } from '@/dal/auth'
import { Account } from 'next-auth'
import { getErrorMessage } from '../error/get-error-message'
import { generateJWT } from './generate-jwt'
import { getEthAccounts } from './get-eth-accounts'
import { initWeb3AuthSFA } from './init-web3auth-sfa'

export const generateWalletWithWeb3Auth = async (
  account: Account,
  email: string,
  userId: string,
) => {
  try {
    let idToken: string
    let subVerifier: string

    switch (account.provider) {
      case 'resend':
        idToken = await generateJWT(email)
        subVerifier = 'w3a-custom-jwt'
        break
      case 'google':
        if (!account.id_token) throw new Error('account.id_token missing')
        idToken = account.id_token
        subVerifier = 'w3a-google'
        break
      default:
        throw new Error('unknown provider')
    }

    const web3Auth = await initWeb3AuthSFA()

    await web3Auth.connect({
      idToken,
      subVerifierInfoArray: [{ idToken, verifier: subVerifier }],
      verifier: 'w3a-aggregated',
      verifierId: email,
    })

    const userInfo = await web3Auth.getUserInfo()
    // const privateKey = await getEthPrivateKey(web3Auth)
    // const appPubKey = getPublicKey(privateKey as string)
    const accounts = await getEthAccounts(web3Auth)

    await adminInsertWallet({
      address: accounts[0],
      type: 'web3auth',
      user_id: userId,
      web3auth_user_info: userInfo,
    })
  } catch (error) {
    const message = getErrorMessage(error)
    console.log('❌ could not generate w3a wallet:', message)
  }
}
