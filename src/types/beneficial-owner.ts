import { z } from 'zod'
import { alpha2Code } from './country-codes'
import { timestampString } from './timestamp'

const beneficialOwnerSchema = z.object({
  id: timestampString,
  city: z.string(),
  isPep: z.boolean(),
  // country: z.string(), // Could refine to a country code from a list
  country: alpha2Code, // ISO 3166-1 alpha-2 code
  surname: z.string(),
  forename: z.string(),
  // birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, {
  //   message:
  //     "Birthdate must be in ISO 8601 format (e.g., '2024-12-31T23:00:00.000Z')",
  // }), // ISO 8601 date string
  birthdate: z.string().datetime({ offset: true }), // ISO 8601 with Zod's datetime utility
  birthplace: z.string(),
  postcode: z.string(),
  // nationality: z.string(), // Could refine to a country code from a list
  nationality: alpha2Code, // ISO 3166-1 alpha-2 code
  votingRights: z.number(),
  capitalShares: z.number(),
  isFictitiousUbo: z.boolean(),
  streetAndNumber: z.string(),
})

export const beneficialOwnersSchema = z.array(beneficialOwnerSchema)

export type BeneficialOwners = z.infer<typeof beneficialOwnersSchema>
