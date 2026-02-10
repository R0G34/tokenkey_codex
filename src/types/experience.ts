import { z } from 'zod'

const numericString = z.string().refine((val) => /^\d+$/.test(val), {
  message: "String must represent a number (e.g., '123', '0', but not 'abc')",
})

export const knowledgeSchema = z.object({
  answers: z.record(numericString), // Keys strings, values numeric strings
  experiences: z.array(numericString),
})

export type Knowledge = z.infer<typeof knowledgeSchema>

export const professionalSchema = z.object({
  consent: z.boolean(),
  requirements: z.object({
    // if PersonType.Customer
    assets: z.boolean(),
    experience: z.boolean(),
    transactions: z.boolean(),
    // if PersonType.Company
    balance: z.boolean(),
    equity: z.boolean(),
    revenue: z.boolean(),
  }),
})

export type Professional = z.infer<typeof professionalSchema>
