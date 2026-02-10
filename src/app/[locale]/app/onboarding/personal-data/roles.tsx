export type Roles = {
  representative: { fictitiousBeneficialOwner: boolean } | false
  authorizedBeneficialOwner:
    | { capitalShares: number; votingRights: number }
    | false
  powerOfAttorney: boolean
}
