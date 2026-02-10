import { Tables } from '@/lib/supabase/types/database.types'
import { beneficialOwnersSchema } from '@/types/beneficial-owner'
import { representativesSchema } from '@/types/representative'
import { z } from 'zod'

export const parseCompany = (company: Tables<'company'>) => {
  try {
    return {
      ...company,
      beneficial_owners: company.beneficial_owners
        ? beneficialOwnersSchema.parse(company.beneficial_owners)
        : null,
      representatives: company.representatives
        ? representativesSchema.parse(company.representatives)
        : null,
    }
  } catch (error) {
    if (error instanceof z.ZodError)
      throw new Error(
        `Validation failed: ${error.errors.map((e) => e.message).join(', ')}`,
      )
    throw error
  }
}
