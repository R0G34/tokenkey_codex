import { Messages } from 'next-intl'
import * as z from 'zod'

export const createWphgRiskWarningFormSchema = (
  t: (
    key: keyof Messages['onboarding']['wphg']['risk-warning']['errors'],
  ) => string,
) => {
  return z.object({
    riskConsent: z.boolean().refine((val) => val === true, {
      message: t('read'),
    }),
  })
}

export type WphgRiskWarningFormSchemaDataType = z.infer<
  ReturnType<typeof createWphgRiskWarningFormSchema>
>
