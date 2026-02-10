import { Messages } from 'next-intl'
import * as z from 'zod'

export enum PersonType {
  Customer = '0',
  Company = '1',
}

export const createAccountTypeFormSchema = (
  t: (
    key: keyof Messages['onboarding']['personalData']['form']['errors'],
  ) => string,
) => {
  return z.object({
    type: z.enum(Object.values(PersonType) as [string, ...string[]]),
  })
}

export type AccountTypeFormSchemaDataType = z.infer<
  ReturnType<typeof createAccountTypeFormSchema>
>
