export interface CustomerRequest {
  // address: Address
  // approvedForMonerium: boolean
  birthDate: string
  company?: {
    email: string
    fullAddress: string
    name: string
    registerNumber: string
  }
  countryIso: string
  email: string
  firstname: string
  gender: number // 'NotSet' | 'Male' | 'Female' | 'Other'
  id: string | null
  // institutionId: string
  // institutionName: string
  // kycData: KycData
  lastname: string
  // nationalityId: string
  nationalityIso: string | null
  phoneNumber: string
  postalCode: string
  salutation: string | null
  street: string
  streetNo: string
  title: string | null
  town: string
  type: number // 'Unknown' | 'Person' | 'LegalEntity'
  // walletAccess: number
}
