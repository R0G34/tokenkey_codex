export interface Customer {
  address: Address
  approvedForMonerium: boolean
  birthDate: string
  company: string
  email: string
  firstname: string
  gender: number
  id: string
  institutionId: string
  institutionName: string
  kycData: KycData
  lastname: string
  nationalityId: string
  nationalityIso: string
  phoneNumber: string
  salutation: string
  title: string
  type: number
  walletAccess: number
}

export interface Address {
  country: Country
  id: string
  postalCode: string
  street: string
  streetNo: string
  town: string
}

export interface Country {
  id: string
  iso: string
  isoCode3: string
  name: string
}

export interface KycData {
  address: {
    countryCodeIso2: string
    postalCode: string
    street: string
    streetNo: string
    town: string
  }
  bic: string | null
  company?: {
    email: string
    fullAddress: string
    name: string
    registerNumber: string
  }
  dateOfBirth: string
  email: string
  eulaAgreed: boolean
  firstname: string
  gender: number // 'NotSet' | 'Male' | 'Female' | 'Other'
  highCorruptionIndex: boolean
  identVerified: boolean
  identVerifiedType: string // 'None' | 'NotSet' | 'Normal' | 'Plain'
  lastname: string
  nationalityIso: string | null
  nonPepPerson: boolean
  nonSanctionedCountry: boolean
  nonUsTaxPerson: boolean
  phoneNumber: string | null
  placeOfBirth: string
  salutation: string | null
  tanganyIdentVerifiedType: any | null
  tanganyLegalPerson: any | null
  title: string | null
}
