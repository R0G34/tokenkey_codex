'use server'

import { insertOptinWithSelect, updateOptinWithSelect } from '@/dal/optin'
import { insertTransaction } from '@/dal/transaction'
import { Tables } from '@/lib/supabase/types/database.types'
import {
  createExternalAssetClassRetailWalletOptIn,
  updateAssetClassOptIn,
} from './optin'

export async function syncOptin(
  amount: Tables<'optin'>['amount'],
  customerId: NonNullable<Tables<'personal_data'>['nyala_customer_id']>,
  externalRetailWalletId: NonNullable<
    Tables<'wallet'>['nyala_external_retail_wallet_id']
  >,
  tokenizedAssetId: NonNullable<
    Tables<'wallet'>['nyala_external_retail_wallet_id']
  >,
  userId: Tables<'user'>['id'],
  userOptin: Tables<'optin'> | null,
  project: Pick<Tables<'project'>, 'id' | 'code' | 'token_price'>,
) {
  const transactionAmount = amount * project.token_price
  const optinAmount = userOptin ? userOptin.amount + amount : amount

  let nyalaOptinId

  if (userOptin) {
    nyalaOptinId = userOptin.nyala_optin_id!
    await updateAssetClassOptIn({
      amount: optinAmount,
      customerId,
      tokenizedAssetId,
    })
  } else
    nyalaOptinId = await createExternalAssetClassRetailWalletOptIn({
      amount: optinAmount,
      customerId,
      externalRetailWalletId,
      tokenizedAssetId,
    })

  await Promise.all([
    insertTransaction({
      amount: transactionAmount,
      currency: 'EUR',
      method: 'optin',
      reference: project.code,
      status: 'completed',
      type: 'investment',
      user_id: userId,
    }),
    userOptin
      ? updateOptinWithSelect(userOptin.id, {
          amount: optinAmount,
        })
      : insertOptinWithSelect({
          amount: optinAmount,
          project_id: project.id,
          token_price: project.token_price,
          user_id: userId,
          nyala_optin_id: nyalaOptinId,
        }),
  ])

  return nyalaOptinId
}
