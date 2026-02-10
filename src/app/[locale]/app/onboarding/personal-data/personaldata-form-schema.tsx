import { Messages } from 'next-intl'
import * as z from 'zod'
import { PersonType } from '../account-type-form-schema'
import { createBankSchema } from './bank-schema'

const createBaseSchema = (
  t: (
    key: keyof Messages['onboarding']['personalData']['form']['errors'],
  ) => string,
) => {
  return z.object({
    // salutation: z.string().min(1, 'Salutation is required'),
    // title: z.string().min(1, 'Title is required'),
    // birthDate: z.string().min(1, 'Birth date is required'),
    // birthCountry: z.string().min(1, 'Country of birth is required'),
    // phone: phoneSchema,
    //
    forename: z.string().min(1, t('forename')),
    surname: z.string().min(1, t('surname')),
    birthdate: z.date({ required_error: t('birthdate') }),
    birthplace: z.string().min(1, t('birthplace')),
    nationality: z.string().min(1, t('nationality')),
    street: z.string().min(1, t('street')),
    streetNumber: z.string().min(1, t('streetNumber')),
    postcode: z.string().min(1, t('postcode')),
    city: z.string().min(1, t('city')),
    country: z.string().min(1, t('country')),
  })
}

const createCustomerSchema = (
  t: (
    key: keyof Messages['onboarding']['personalData']['form']['errors'],
  ) => string,
  tBank: (
    key: keyof Messages['onboarding']['bank']['form']['errors'],
  ) => string,
) => {
  return createBaseSchema(t)
    .merge(
      z.object({
        type: z.literal(PersonType.Customer),
      }),
    )
    .merge(createBankSchema(tBank))
}

const createRolesSchema = (
  t: (
    key: keyof Messages['onboarding']['personalData']['form']['errors'],
  ) => string,
) => {
  return z
    .object({
      representative: z.union([
        z.object({ fictitiousBeneficialOwner: z.boolean() }),
        z.literal(false),
      ]),
      authorizedBeneficialOwner: z.union([
        z.object({
          capitalShares: z.number().min(0).max(100),
          votingRights: z.number().min(0).max(100),
        }),
        z.literal(false),
      ]),
      powerOfAttorney: z.boolean(),
    })
    .refine(
      (data) => {
        return (
          data.representative !== false ||
          data.authorizedBeneficialOwner !== false ||
          data.powerOfAttorney === true
        )
      },
      {
        message: t('roles'),
        // path: []
      },
    )
  // .refine(
  //   (data) =>
  //     !data.authorizedBeneficialOwner ||
  //     (data.authorizedBeneficialOwner.capitalShares !== undefined &&
  //       data.authorizedBeneficialOwner.votingRights !== undefined),
  //   {
  //     message:
  //       'If authorized beneficial owner is selected, capitalShares and votingRights are required',
  //     path: ['authorizedBeneficialOwner'],
  //   },
  // )
}

const createCompanySchema = (
  t: (
    key: keyof Messages['onboarding']['personalData']['form']['errors'],
  ) => string,
) => {
  return createBaseSchema(t).merge(
    z.object({
      type: z.literal(PersonType.Company),
      roles: createRolesSchema(t),
    }),
  )
}

export const createPersonalDataFormSchema = (
  t: (
    key: keyof Messages['onboarding']['personalData']['form']['errors'],
  ) => string,
  tBank: (
    key: keyof Messages['onboarding']['bank']['form']['errors'],
  ) => string,
) => {
  return z.discriminatedUnion('type', [
    createCustomerSchema(t, tBank),
    createCompanySchema(t),
  ])
}

export type PersonalDataFormSchemaDataType = z.infer<
  ReturnType<typeof createPersonalDataFormSchema>
>
