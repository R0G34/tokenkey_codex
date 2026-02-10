import { Customer } from './customer'
import { ExternalRetailWallet } from './external-retail-wallet'
import { TokenizedAsset } from './tokenized-asset'

export interface Optin {
  amount: number
  approvedForDelivery: boolean
  created: string
  customerId: Customer['id']
  externalRetailWalletId: ExternalRetailWallet['id']
  id: string
  modified: string
  status: number
  tokenizedAssetId: TokenizedAsset['id']
}
