import { BankAccount } from './bank-account'
import { Professionell } from './professionell'
import { SubPersonRole } from './sub-person-role'

type KYCCustomField = { name: 'KYC'; value: 'IDNOW' | 'WEBID' | string }
type VotingShareCustomField = { name: 'votingShare'; value: string }
type CapitalSharesShareCustomField = { name: 'capitalShares'; value: string }
type FictitiousCustomField = { name: 'fictitious'; value: boolean }

type CustomFields = (
  | KYCCustomField
  | VotingShareCustomField
  | CapitalSharesShareCustomField
  | FictitiousCustomField
)[]

type BasePerson = {
  street: string
  zip: string
  city: string
  country: string // Country code ISO 3166 AL2
  email?: string
  phone?: string[]
  professionell?: Professionell
  bankAccounts?: BankAccount[]
  customFields?: CustomFields
  modified: string
}

export type NaturalPerson = BasePerson & {
  type: 0
  precheckPep: 'True' | 'False'
  birthCountry?: string
  birthDate: string
  birthPlace: string
  emailPriv?: string
  foreName: string
  furtherNationalities?: string[]
  key: `PERS_${string}`
  mobile?: string
  nationality: string
  phonePriv?: string[]
  salutation?: string
  surName: string
  title?: string
}

export type LegalPerson = BasePerson & {
  type: 1
  foundingDate: string
  key: `RAND_${string}`
  registryCourt?: string
  registryNo?: string
  registryNumber: string
  taxId: string
  legalForm: string
  companyName: string
  subPersons: SubPerson[]
}

export type SubPerson = {
  role: SubPersonRole
  person: NaturalPerson | Partial<NaturalPerson> | Partial<LegalPerson>
}
