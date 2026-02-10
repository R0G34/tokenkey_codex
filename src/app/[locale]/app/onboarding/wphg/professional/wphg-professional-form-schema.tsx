import en from '@/i18n/messages/onboarding/en.json'
import { Messages } from 'next-intl'
import * as z from 'zod'

const requirements = en.onboarding.wphg.professional.form.requirements

export const createWphgProfessionalFormSchema = (
  t: (
    key: keyof Messages['onboarding']['wphg']['professional']['errors'],
  ) => string,
) => {
  return z.object({
    consent: z.boolean().refine((val) => val === true, {
      message: t('read'),
    }),
    requirements: z
      .array(z.boolean())
      .length(requirements.length)
      .refine((val) => val.filter((v) => v).length >= 2, {
        message: t('answer-min'),
      }),
  })
}

export type WphgProfessionalFormSchemaDataType = z.infer<
  ReturnType<typeof createWphgProfessionalFormSchema>
>
