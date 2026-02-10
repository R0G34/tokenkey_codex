import { Tables } from '@/lib/supabase/types/database.types'
import { z } from 'zod'
import { parseRoles } from './parse-roles'

export const parsePersonalData = (personalData: Tables<'personal_data'>) => {
  try {
    return {
      ...personalData,
      // roles: personalData.roles ? rolesSchema.parse(personalData.roles) : null,
      roles: personalData.roles ? parseRoles(personalData.roles) : null,
    }
  } catch (error) {
    if (error instanceof z.ZodError)
      throw new Error(
        `Validation failed: ${error.errors.map((e) => e.message).join(', ')}`,
      )
    throw error
  }
}
