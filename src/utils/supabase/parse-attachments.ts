import { Json } from '@/lib/supabase/types/database.types'
import { attachmentsSchema } from '@/types/attachments'
import { z } from 'zod'

export const parseAttachments = (attachments: Json) => {
  try {
    return attachmentsSchema.parse(attachments)
  } catch (error) {
    console.log('🔥', error)
    if (error instanceof z.ZodError)
      throw new Error(
        `Validation failed: ${error.errors.map((e) => e.message).join(', ')}`,
      )
    throw error
  }
}
