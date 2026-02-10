import { Messages } from 'next-intl'
import * as z from 'zod'

export type ExperienceOption = 'yes' | 'no' | 'professional'

export const createWphgInitialFormSchema = (
  t: (key: keyof Messages['onboarding']['wphg']['form']['errors']) => string,
) => {
  return z.object({
    experienceOption: z.enum(['yes', 'no', 'professional'], {
      message: t('answer-min'),
    }),
  })
}

export type WphgInitialFormSchemaDataType = z.infer<
  ReturnType<typeof createWphgInitialFormSchema>
>
