import { TokenizedAsset } from './tokenized-asset'

export interface Project {
  id: string
  name: string
  institutionId: string
  userId: string
  creatorFirstName: string
  creatorLastName: string
  startOfSubscription: string
  endOfSubscription: string
  targetIssuanceDate: string
  dueDateOfPayments?: any
  terminationRights: string
  issueSize: string
  entryType: number
  status: number
  created: string
  registryExtract: boolean
  errorMessage: string | null
  tokenizedAsset: TokenizedAsset
}
