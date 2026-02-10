import * as z from 'zod'

export const PepFormSchema = z.object({
  isPep: z.boolean(),
})

export type PepFormSchemaDataType = z.infer<typeof PepFormSchema>
