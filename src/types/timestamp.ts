import { z } from 'zod'

// Numeric string refinement for id (timestamp-like)
export const timestampString = z
  .string()
  .refine((val) => /^\d{10,}$/.test(val) && !isNaN(Number(val)), {
    message: 'ID must be a numeric string from Date.now().toString()',
  })
