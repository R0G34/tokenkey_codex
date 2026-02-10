'use server'

import { verifySession } from '@/dal/session'
import { verifyUser } from '@/dal/user'
import { deleteWallet, insertWallet, selectWallet } from '@/dal/wallet'
import { SocialLoginPayload } from '@/lib/web3auth/types/social-login-payload'
import { createUser } from '@/services/auth0/services'
import { verifySocialLogin } from '@/utils/web3auth/verify-social-login'
import {
  getAddressFromMessage,
  getChainIdFromMessage,
  verifySignature,
} from '@reown/appkit-siwe'
import { UserInfo } from '@web3auth/base'
import { getLocale, getTranslations } from 'next-intl/server'
import { revalidatePath } from 'next/cache'

/**
 * So that Auth0 sends the email in the user's language.
 */
export async function upsertUserInAuth0() {
  try {
    const user = await verifyUser()
    const locale = await getLocale()
    await createUser(user.email, locale)
    return { data: null, error: null }
  } catch (e) {
    console.error(e)
    const t = await getTranslations('onboarding.custody.errors')
    return { data: null, error: t('unknown-error') }
  }
}

export async function saveEOA(message: string, signature: string) {
  const t = await getTranslations('onboarding.custody.errors')

  try {
    await verifySession()

    const walletAddress = getAddressFromMessage(message)

    const isValid = await verifySignature({
      address: walletAddress,
      chainId: getChainIdFromMessage(message),
      message,
      projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
      signature,
    })

    if (!isValid) return { data: null, error: t('signature') }

    const result = await insertWallet({
      address: walletAddress,
      type: 'external',
      web3auth_user_info: null,
    })

    if (result === null) return { data: null, error: t('already-used') }

    revalidatePath('/app/onboarding', 'layout')
    return { data: result, error: null }
  } catch (e) {
    console.error(e)
    return { data: null, error: t('unknown-error') }
  }
}

export async function saveWeb3AuthWallet(
  appPubKey: string,
  userInfo: Partial<UserInfo>,
) {
  await verifySession()

  const t = await getTranslations('onboarding.custody.errors')

  const {
    appState,
    dappShare,
    idToken,
    isMfaEnabled,
    oAuthAccessToken,
    oAuthIdToken,
    touchIDPreference,
    ...rest
  } = userInfo

  if (!idToken) return { data: null, error: t('id-token') }

  const payload = await verifySocialLogin(appPubKey, idToken)

  if (!payload) return { data: null, error: t('crypto-wallet') }

  // If user already has a wallet, if web3auth login email doesn't match wallet email, return error.

  const userWallet = await selectWallet()

  if (userWallet)
    if (
      (userWallet.web3auth_user_info as SocialLoginPayload).email !== rest.email
    )
      return {
        data: null,
        error: t('same-email', {
          email: (userWallet.web3auth_user_info as any).email,
        }),
      }
    else return { data: userWallet, error: null }

  // If no, generate wallet and insert.

  const result = await insertWallet({
    address: payload.walletAddress,
    type: 'web3auth',
    web3auth_user_info: rest,
  })

  // Queue syncNyalaExternalRetailWallet here or only on user optin.

  revalidatePath('/app/onboarding', 'layout')
  return { data: result, error: null }
}

export async function unlinkWallet() {
  await verifySession()
  await deleteWallet()
  return { data: null, error: null }
}
