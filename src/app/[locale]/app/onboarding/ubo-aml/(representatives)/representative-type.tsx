import { LegalFormType } from '../../company/company-form-schema'

export enum RepresentativePersonType {
  Natural = 0,
  Legal = 1,
}

export type NaturalRepresentative = {
  key: string
  type: 0
  forename: string
  surname: string
}

export type LegalRepresentative = {
  key: string
  type: 1
  name: string
  legalForm: keyof typeof LegalFormType
  street: string
  streetNumber: string
  postcode: string
  city: string
  country: string
  courtOfRegistration?: string
  registryNo?: string
  registryNumber: string
  taxId: string
}

export type Representative = NaturalRepresentative | LegalRepresentative
