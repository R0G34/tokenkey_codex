export interface TokenizedAsset {
  id: string
  assetId: string
  toiFilePathS3: string
  name: string
  unitName: string
  totalSupply: number
  decimals: number
  enableFreeze: boolean
  enableClawback: boolean
  url: string | null
  metaData: any | null
  issuerAddress: `0x${string}` | null
  distributionAddress: `0x${string}` | null
  blockchain: number
  reviewDecision: number
  reviewedAt: string | null
  reviewer: string
  issuingMemo: string | null
  isFungible: boolean
  projectId: string
  isin: string
  isRegulatedSecurity: boolean
  isManuallyCreated: boolean
  agentWalletId?: any
  claimIssuerWalletId?: any
  issuerTxId?: any
  issuerAccountIndex: number
  agentTxId?: any
  agentAccountIndex: number
  agentAddress: `0x${string}` | null
  cissuerAdress?: `0x${string}` | null
  tokeFactoryAddress?: `0x${string}` | null
  projectName: string | null
  issuerWallet: `0x${string}` | null
  project: any | null
  reportEnable: boolean
  created: string | null
  hashValue: string
  hasAIPSupport: boolean
  aipSetup: boolean
  aipLastBatchRun: string
  aipBatchInterval: number
  aiperC20TokenAddress: `0x${string}` | null
  aipInterestRate: number
  customAttributes: any
  firstCouponDate: string
  interestPaymentPeriod: number
  numberOfPayments: number
  price: string
  nominalAmountPerToken: string
  issuerName: string
  interestRate: string
  duration: string
  metaDataUrl: string
}
