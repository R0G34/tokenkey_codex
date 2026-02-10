import { Messages } from 'next-intl'
import * as z from 'zod'
import { createBankSchema } from '../personal-data/bank-schema'

export enum LegalFormType {
  AG = 'Aktiengesellschaft',
  eG = 'eingetragene Genossenschaft',
  // Gesellschaft mit beschränkter Haftung (GmbH)
  GmbH = 'Ges. M. beschr. Haftung',
  GmbH_CoKG = 'GmbH&Co. KG',
  KG = 'Kommanditgesellschaft',
  Ltd = 'Limited Company',
  Stiftung = 'Stiftung',
}

export const createCompanyFormSchema = (
  t: (key: keyof Messages['onboarding']['company']['form']['errors']) => string,
  tBank: (
    key: keyof Messages['onboarding']['bank']['form']['errors'],
  ) => string,
) => {
  return z
    .object({
      name: z.string().min(1, t('name')),
      street: z.string().min(1, t('street')),
      streetNumber: z.string().min(1, t('streetNumber')),
      postcode: z.string().min(1, t('postcode')),
      city: z.string().min(1, t('city')),
      country: z.string().min(1, t('country')),
      foundingDate: z.date({ required_error: t('foundingDate') }),
      registryCourt: z.string(),
      // legalForm: z.string().min(1, t('legalForm')),
      legalForm: z.enum(
        Object.keys(LegalFormType) as [keyof typeof LegalFormType],
        { required_error: t('legalForm') },
      ),
      // Tax number
      taxId: z.string().min(1, t('taxId')),
      // Registration number (if available)
      registryNo: z.string(),
      // VAT identification number
      registryNumber: z.string().min(1, t('registryNumber')),
    })
    .merge(createBankSchema(tBank))
}

export type CompanyFormSchemaDataType = z.infer<
  ReturnType<typeof createCompanyFormSchema>
>
