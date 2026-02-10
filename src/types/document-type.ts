export type DocumentType =
  | 'commercialRegister'
  | 'shareholdersAgreement'
  | 'shareholdersList'
  | 'transparencyRegister'
  | 'powerOfAttorney'

export const documentTypeToSubject: Record<DocumentType, string> = {
  commercialRegister: 'CommercialRegister',
  shareholdersAgreement: 'ShareholdersAgreement',
  shareholdersList: 'ShareholdersList',
  transparencyRegister: 'TransparencyRegister',
  powerOfAttorney: 'PowerOfAttorney',
}

export const documentTypeToCategory: Record<DocumentType, string> = {
  commercialRegister: 'Extract',
  shareholdersAgreement: 'Contract',
  shareholdersList: 'Register',
  transparencyRegister: 'Extract',
  powerOfAttorney: 'Authorization',
}
