import { Json } from '@/lib/supabase/types/database.types'
import { rolesSchema } from '@/types/roles'
import { z } from 'zod'

export const parseRoles = (roles: Json) => {
  try {
    return rolesSchema.parse(roles)
  } catch (error) {
    if (error instanceof z.ZodError)
      throw new Error(
        `Validation failed: ${error.errors.map((e) => e.message).join(', ')}`,
      )
    throw error
  }
}
