import { api } from './api'

export async function getRetailWallets(customerId: string) {
  const result = await api({
    method: 'GET',
    path: `/customers/${customerId}/retail-wallets`,
  })
  return result.data
}
