import { z } from 'zod'

export const rolesSchema = z.object({
  representative: z.union([
    z.object({ fictitiousBeneficialOwner: z.boolean() }),
    z.literal(false),
  ]),
  powerOfAttorney: z.boolean(),
  authorizedBeneficialOwner: z.union([
    z.object({ votingRights: z.number(), capitalShares: z.number() }),
    z.literal(false),
  ]),
})

export type Roles = z.infer<typeof rolesSchema>
