import { PersonType } from '@/app/[locale]/app/onboarding/account-type-form-schema'
import { Company, Customer } from '@/lib/condedus/types/customer'
import { InvestmentSurvey } from '@/lib/condedus/types/investment-survey'
import {
  LegalPerson,
  NaturalPerson,
  SubPerson,
} from '@/lib/condedus/types/person'
import { SubPersonRole } from '@/lib/condedus/types/sub-person-role'
import { Tables } from '@/lib/supabase/types/database.types'
import {
  DocumentType,
  documentTypeToCategory,
  documentTypeToSubject,
} from '@/types/document-type'
import { parseCompany } from '@/utils/supabase/parse-company'
import { parseExperience } from '@/utils/supabase/parse-experience'
import { parsePersonalData } from '@/utils/supabase/parse-personal-data'
import { parseRoles } from '@/utils/supabase/parse-roles'
import { FileObject } from '@supabase/storage-js'

const buildBankAccounts = (
  bankAccount: Tables<'bank_account'>,
  modified: string,
) => {
  return bankAccount
    ? [
        {
          accountHolder: bankAccount.holder,
          bic: bankAccount.swift,
          iban: bankAccount.iban,
          bank: bankAccount.bank,
          country: bankAccount.location,
          currency: bankAccount.currency,
          // sharedAccount: true,
          // type: '0',
          key: `BA_${bankAccount.user_id}-${bankAccount.iban}` as const,
          modified,
        },
      ]
    : undefined
}

const buildInvestmentSurveys = (
  experience: ReturnType<typeof parseExperience>,
  user: Tables<'user'>,
  modified: string,
) => {
  const investmentExperience: InvestmentSurvey['investmentExperience'] =
    experience.consent === 'yes' && experience.knowledge
      ? [
          {
            type: 0,
            knowledge: experience.knowledge.experiences.includes('1') || false,
          },
          {
            type: 3,
            knowledge: experience.knowledge.experiences.includes('2') || false,
          },
          {
            type: 5,
            knowledge: experience.knowledge.experiences.includes('3') || false,
          },
          {
            type: 17,
            knowledge: experience.knowledge.experiences.includes('4') || false,
          },
        ]
      : undefined

  const investorExperience: InvestmentSurvey['investorExperience'] =
    experience.consent === 'yes' && experience.knowledge
      ? [
          {
            name: 'AE1',
            value: experience.knowledge.answers['1'],
          },
          {
            name: 'AE2',
            value: experience.knowledge.answers['2'],
          },
          {
            name: 'AE3',
            value: experience.knowledge.answers['3'],
          },
          {
            name: 'AE4',
            value: experience.knowledge.answers['4'],
          },
          {
            name: 'AE5',
            value: experience.knowledge.answers['5'],
          },
          {
            name: 'AE6',
            value: experience.knowledge.answers['6'],
          },
          {
            name: 'AE7',
            value: experience.knowledge.answers['7'],
          },
          {
            name: 'AE8',
            value: experience.knowledge.answers['8'],
          },
        ]
      : undefined

  const customFields: InvestmentSurvey['customFields'] =
    experience.consent !== 'professional' && experience.risk_consent
      ? [{ name: 'ForceMissedKnowledge', value: 'true' }]
      : undefined

  return [
    {
      investmentExperience,
      investorExperience,
      customFields,
      key: `INVST_${user.id}` as const,
      modified, // user.experience.updated_at
    },
  ]
}

const buildProfessional = (
  experience: ReturnType<typeof parseExperience>,
  user: Tables<'user'>,
) => {
  if (
    experience.consent !== 'professional' ||
    !experience.professional?.consent
  )
    return

  // https://docs.concedus.com/other/professional-investors
  return {
    // if PersonType.Company
    assets: experience.professional.requirements.assets,
    experience: experience.professional.requirements.experience,
    transactions: experience.professional.requirements.transactions,
    // if PersonType.Company
    balance: experience.professional.requirements.balance,
    equity: experience.professional.requirements.equity,
    revenue: experience.professional.requirements.revenue,
  }
}

const buildImportCustomerPayload = (
  bankAccount: Tables<'bank_account'>,
  experience: ReturnType<typeof parseExperience>,
  personalData: Tables<'personal_data'>,
  user: Tables<'user'>,
) => {
  const modified = new Date().toISOString()

  const person: NaturalPerson = {
    type: Number(PersonType.Customer.valueOf()) as 0,
    professionell: buildProfessional(experience, user),
    precheckPep: personalData.pep ? 'True' : 'False',
    //
    // salutation: 'Frau',
    foreName: personalData.forename,
    surName: personalData.surname,
    birthDate: personalData.birthdate.split('T')[0],
    birthPlace: personalData.birthplace,
    // birthCountry: 'DE',
    // emailPriv: 'felizitas.birnbaum@web.de',
    nationality: personalData.nationality,
    // furtherNationalities: ['CO'],
    email: user.email,
    // mobile: '+495965946717769',
    // phone: ['+498318357334001'],
    // web: 'www.felizitas-birnbaum.de',
    //
    street: personalData.street,
    zip: personalData.postcode,
    city: personalData.city,
    country: personalData.country,
    bankAccounts: buildBankAccounts(bankAccount, modified),
    customFields: [{ name: 'KYC', value: 'WEBID' }],
    key: `PERS_${user.id}`,
    modified, // user.personal_data.updated_at
  }

  const investmentSurveys = buildInvestmentSurveys(experience, user, modified)

  const customer: Customer = {
    person,
    investmentSurveys,
    key: `CUSTO_${user.id}` as const,
    modified, // user.personal_data.updated_at
  }

  return { customers: [customer] }
}

const buildSubPersons = (
  companyBeneficialOwners: NonNullable<
    ReturnType<typeof parseCompany>['beneficial_owners']
  >,
  companyRepresentatives: NonNullable<
    ReturnType<typeof parseCompany>['representatives']
  >,
  personalData: Tables<'personal_data'>,
  roles: ReturnType<typeof parseRoles>,
  user: Tables<'user'>,
  modified: string,
) => {
  // https://docs.concedus.com/import-process/send-data-sets/send-company-record/company-roles

  // Waiting answer.
  const accountOwner: SubPerson = {
    role: Number(
      `10${roles.authorizedBeneficialOwner ? '60' : ''}${roles.representative ? (roles.representative.fictitiousBeneficialOwner ? '6170' : '70') : ''}`,
    ) as SubPersonRole,
    person: {
      type: Number(PersonType.Customer.valueOf()) as 0,
      // The standard case, the Investor is always a "retail client " within the meaning of the German Securities Trading Act (WpHG) and is therefore always transferred with "False". Classification as a "professional client" within the meaning of the German Securities Trading Act (WpHG) is only made by arrangement.
      // professionell
      precheckPep: personalData.pep ? 'True' : 'False',
      // salutation: 'Herr',
      foreName: personalData.forename,
      surName: personalData.surname,
      birthDate: personalData.birthdate.split('T')[0],
      birthPlace: personalData.birthplace,
      // birthCountry: 'DE',
      // emailPriv: 'kurt.fechner@gmx.de',
      nationality: personalData.nationality,
      // furtherNationalities: ['DO'],
      email: user.email,
      // mobile: '+490193265780223',
      // phone: ['+498744252847115'],
      // web: 'www.kurt-fechner.de',
      street: personalData.street,
      zip: personalData.postcode,
      city: personalData.city,
      country: personalData.country,
      customFields: [
        { name: 'KYC', value: 'WEBID' },
        // {
        //   name: 'votingShare',
        //   value: roles.authorizedBeneficialOwner
        //     ? roles.authorizedBeneficialOwner.votingRights.toString()
        //     : undefined,
        // },
        // {
        //   name: 'capitalShares',
        //   value: roles.authorizedBeneficialOwner
        //     ? roles.authorizedBeneficialOwner.capitalShares.toString()
        //     : undefined,
        // },
        // {
        //   name: 'fictitious',
        //   value: roles.representative
        //     ? roles.representative.fictitiousBeneficialOwner
        //     : undefined,
        // },
      ],
      key: `PERS_${user.id}`,
      modified, // user.personal_data.updated_at
    } as NaturalPerson,
  }

  // Waiting answer.
  const representatives: SubPerson[] = companyRepresentatives.map((r) => ({
    role: 70,
    person:
      r.type === 0
        ? {
            type: r.type,
            foreName: r.forename,
            surName: r.surname,
            key: `PERS_${r.key}`,
            modified,
          }
        : {
            type: r.type,
            companyName: r.name,
            legalForm: r.legalForm,
            registryCourt: r.courtOfRegistration,
            registryNumber: r.registryNumber,
            taxId: r.taxId,
            subPersons: [],
            street: `${r.street} ${r.streetNumber}`,
            zip: r.postcode,
            city: r.city,
            country: r.country,
            key: `RAND_${r.key}`,
            modified,
          },
  }))

  // Waiting answer.
  const beneficialOwners: SubPerson[] = companyBeneficialOwners.map((b) => ({
    role: b.isFictitiousUbo ? 61 : 60,
    person: {
      type: 0,
      precheckPep: b.isPep ? 'True' : 'False',
      foreName: b.forename,
      surName: b.surname,
      birthDate: b.birthdate.split('T')[0],
      birthPlace: b.birthplace,
      nationality: b.nationality,
      street: b.streetAndNumber,
      zip: b.postcode,
      city: b.city,
      country: b.country,
      customFields: [
        { name: 'votingShare', value: b.votingRights.toString() },
        { name: 'capitalShares', value: b.capitalShares.toString() },
        { name: 'fictitious', value: b.isFictitiousUbo },
      ],
      key: `PERS_${b.id}`,
      modified,
    },
  }))

  return [accountOwner, ...representatives, ...beneficialOwners]
}

const buildEvents = (
  files: Record<DocumentType, FileObject>,
  modified: string,
) => {
  // https://docs.concedus.com/import-process/send-data-sets/send-company-record#events-file-uploads

  return Object.entries(files).map(([type, file]) => ({
    date: new Date(file.created_at).toISOString(),
    subject: documentTypeToSubject[type as DocumentType],
    category: documentTypeToCategory[type as DocumentType],
    file: file.name,
    key: `ATT_${file.id}`,
    modified,
  }))
}

const buildImportCompanyPayload = (
  bankAccount: Tables<'bank_account'>,
  company: ReturnType<typeof parseCompany>,
  experience: ReturnType<typeof parseExperience>,
  files: { [key in DocumentType]: FileObject },
  personalData: ReturnType<typeof parsePersonalData>,
  user: Tables<'user'>,
) => {
  const modified = new Date().toISOString()

  const person: LegalPerson = {
    type: Number(PersonType.Company.valueOf()) as 1,
    professionell: buildProfessional(experience, user),
    // Waiting answer, because not present in miro nor tokenforge figma.
    // precheckPep: 'False',
    foundingDate: company.founding_date,
    registryNumber: company.registry_number,
    registryCourt: company.registry_court ?? undefined,
    legalForm: company.legal_form,
    taxId: company.tax_id,
    companyName: company.name,
    street: `${company.street} ${company.street_number}`,
    zip: company.postcode,
    city: company.city,
    country: company.country,
    bankAccounts: buildBankAccounts(bankAccount, modified),
    subPersons: buildSubPersons(
      company.beneficial_owners!,
      company.representatives!,
      personalData,
      personalData.roles!,
      user,
      modified,
    ),
    key: `RAND_${user.id}`,
    modified,
  }

  const investmentSurveys = buildInvestmentSurveys(experience, user, modified)

  const events = buildEvents(files, modified)

  const customer: Company = {
    person,
    investmentSurveys,
    events,
    key: `CUSTO_${user.id}` as const,
    modified,
  }

  return { customers: [customer] }
}

export const buildCustomerPayload = (
  bankAccount: Tables<'bank_account'>,
  company: ReturnType<typeof parseCompany> | null,
  experience: ReturnType<typeof parseExperience>,
  files: { [key in DocumentType]: FileObject },
  personalData: ReturnType<typeof parsePersonalData>,
  user: Tables<'user'>,
) => {
  return user.type === Number(PersonType.Company.valueOf())
    ? buildImportCompanyPayload(
        bankAccount,
        company!,
        experience,
        files,
        personalData,
        user,
      )
    : buildImportCustomerPayload(bankAccount, experience, personalData, user)
}
