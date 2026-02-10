import { Messages } from 'next-intl'
import { z } from 'zod'

export const createBeneficialOwnerFormSchema = (
  t: (
    key: keyof Messages['onboarding']['beneficialOwners']['form']['errors'],
  ) => string,
) => {
  return z.object({
    id: z.string({ required_error: t('id') }),
    forename: z.string().min(1, t('forename')),
    surname: z.string().min(1, t('surname')),
    birthdate: z.date({ required_error: t('birthdate') }),
    nationality: z.string().min(1, t('nationality')),
    birthplace: z.string().min(1, t('birthplace')),
    isPep: z.boolean(),
    isFictitiousUbo: z.boolean(),
    capitalShares: z.number().min(0).max(100),
    votingRights: z.number().min(0).max(100),
    streetAndNumber: z.string().min(1, t('streetAndNumber')),
    postcode: z.string().min(1, t('postcode')),
    city: z.string().min(1, t('city')),
    country: z.string().min(1, t('country')),
  })
}

export type BeneficialOwner = z.infer<
  ReturnType<typeof createBeneficialOwnerFormSchema>
>
