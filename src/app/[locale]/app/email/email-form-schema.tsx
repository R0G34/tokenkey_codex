import { z } from 'zod'

export type EmailFormSchemaDataType = z.infer<typeof EmailFormSchema>

export const EmailFormSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: 'Email must be at least 2 characters.',
    })
    .email(),
})
