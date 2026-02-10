import { isValidIBAN } from 'ibantools'
import { Messages } from 'next-intl'
import * as z from 'zod'

export const createBankSchema = (
  t: (key: keyof Messages['onboarding']['bank']['form']['errors']) => string,
) => {
  return z.object({
    holder: z.string().min(1, t('holder')),
    bank: z.string().min(1, t('bank')),
    swift: z.string().min(1, t('swift')),
    iban: z.custom<string>(
      (val) => {
        // return isValid(val as string)
        return isValidIBAN(val as string)
      },
      { message: t('iban') },
    ),
    location: z.string().min(1, t('location')),
    currency: z.string().min(1, t('currency')),
  })
}
