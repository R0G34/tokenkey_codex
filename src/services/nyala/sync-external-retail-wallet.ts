'use server'

import { updateWallet } from '@/dal/wallet'
import { Tables } from '@/lib/supabase/types/database.types'
import { createExternalRetailWallet } from '@/services/nyala/external-wallet'

export async function syncExternalRetailWallet(
  customerId: NonNullable<Tables<'personal_data'>['nyala_customer_id']>,
  wallet: Tables<'wallet'>,
) {
  const externalRetailWalletId = await createExternalRetailWallet(
    customerId,
    wallet.address,
  )

  await updateWallet({
    nyala_external_retail_wallet_id: externalRetailWalletId,
  })

  // TEST
  // const [wallets, externalWallets] = await Promise.all([
  //   getRetailWallets(customerId),
  //   getExternalRetailWallets(),
  // ])
  // console.log('🔥 wallets', wallets, externalWallets)

  return externalRetailWalletId
}
