import { Event } from './event'
import { InvestmentSurvey } from './investment-survey'
import { LegalPerson, NaturalPerson } from './person'

export type Customer = {
  person: NaturalPerson
  investmentSurveys: InvestmentSurvey[]
  key: `CUSTO_${string}`
  modified: string
}

export type Company = {
  person: LegalPerson
  investmentSurveys: InvestmentSurvey[]
  events: Event[]
  key: `CUSTO_${string}`
  modified: string
}

export type ICustomer = Customer | Company
