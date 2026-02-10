import { z } from 'zod'

export const attachmentsSchema = z.array(
  z.object({
    name: z.string(),
    url: z.string(),
  }),
)
