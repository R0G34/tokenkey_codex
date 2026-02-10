import { TokenizedAsset } from './tokenized-asset'

export interface Transfer {
  id: string
  amount: number
  created: string
  fromAddress: number
  receiverRetailWalletId: string
  status: number
  txId: number
  toAddress: number
  tokenizedAsset: TokenizedAsset
  // modified: string
}
