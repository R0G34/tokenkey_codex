import { Tables } from '@/lib/supabase/types/database.types'
import { knowledgeSchema, professionalSchema } from '@/types/experience'
import { z } from 'zod'

export const parseExperience = (experience: Tables<'experience'>) => {
  try {
    return {
      ...experience,
      knowledge: experience.knowledge
        ? knowledgeSchema.parse(experience.knowledge)
        : null,
      professional: experience.professional
        ? professionalSchema.parse(experience.professional)
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
