import { z } from 'zod'
import { alpha2Code } from './country-codes'
import { timestampString } from './timestamp'

const naturalPersonSchema = z.object({
  key: timestampString,
  surname: z.string(),
  forename: z.string(),
  type: z.literal(0), // Must be exactly 0
})

const legalEntitySchema = z.object({
  key: timestampString,
  city: z.string(),
  name: z.string(),
  country: alpha2Code, // 2-letter country code from CountryDropdown
  postcode: z.string(),
  legalForm: z.string(),
  street: z.string(),
  streetNumber: z.string(),
  courtOfRegistration: z.string().optional(),
  registryNo: z.string().optional(),
  registryNumber: z.string(),
  taxId: z.string(),
  type: z.literal(1), // Must be exactly 1
})

const representativeSchema = z.discriminatedUnion('type', [
  naturalPersonSchema,
  legalEntitySchema,
])

export const representativesSchema = z.array(representativeSchema)

// export type Representative = z.infer<typeof representativeSchema>

// export type Representatives = z.infer<typeof representativesSchema>
