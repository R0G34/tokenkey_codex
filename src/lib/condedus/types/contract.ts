import { Event } from './event'

export type Contract = {
  product: string // Project name/code
  share: number // Nominal value in EUR
  origin: 'P' | 'V' // P = Primary market, V = Secondary market
  signed: string // Date contract was signed (YYYY-MM-DD)
  customer: {
    person: {
      key: `PERS_${string}`
      modified: string // ISO 8601 timestamp
    }
    key: `CUSTO_${string}`
    modified: string // ISO 8601 timestamp
  } // Customer reference (customer already exists from onboarding)
  key: `CONTR_${string}`
  modified: string // ISO 8601 timestamp
  events: Event[]
}

export type SendContractPayload = {
  contracts: Contract[]
}
