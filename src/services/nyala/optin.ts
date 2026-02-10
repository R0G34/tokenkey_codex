import { Customer } from '@/lib/nyala/types/customer'
import { Optin } from '@/lib/nyala/types/optin'
import { api } from './api'

const PATH = '/customers'

export async function createExternalAssetClassRetailWalletOptIn({
  amount,
  customerId,
  externalRetailWalletId,
  tokenizedAssetId,
  update = false,
}: {
  amount: number
  customerId: Customer['id']
  externalRetailWalletId: string
  tokenizedAssetId: string
  update?: boolean
}) {
  const result = await api({
    body: {
      tokenizedAssetId,
      approvedForDelivery: true,
      amount,
    },
    method: update ? 'PATCH' : 'POST',
    path: `${PATH}/${customerId}/retail-wallets/${externalRetailWalletId}/external-asset-class-opt-in`,
  })
  return result.data as Optin['id']
}

export async function updateAssetClassOptIn({
  amount,
  customerId,
  tokenizedAssetId,
}: {
  amount: number
  customerId: Customer['id']
  tokenizedAssetId: string
}) {
  const result: { errorMessageCodes: string | null; data: boolean } = await api(
    {
      body: {
        tokenizedAssetId,
        approvedForDelivery: true,
        amount,
      },
      method: 'PATCH',
      path: `${PATH}/${customerId}/asset-class-opt-in`,
    },
  )
  return result.data
}
