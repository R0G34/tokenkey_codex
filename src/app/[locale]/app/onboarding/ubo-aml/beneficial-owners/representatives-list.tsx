'use client'

import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import {
  NaturalRepresentative,
  RepresentativePersonType,
} from '../(representatives)/representative-type'
import { Roles } from '../../personal-data/roles'
import { BeneficialOwner } from './beneficial-owner-type'
import { useBeneficialOwners } from './beneficial-owners-context'

export function RepresentativesList() {
  const {
    company,
    formState,
    setFormState,
    setAddingRepresentative,
    personalData,
  } = useBeneficialOwners()

  const handleAddAsBeneficialOwner = (
    representative: NaturalRepresentative,
  ) => {
    setAddingRepresentative(representative)
    setFormState('form')
  }

  const naturalRepresentatives = (
    company.representatives as NaturalRepresentative[] | null
  )?.filter(({ type }) => type === RepresentativePersonType.Natural)

  const accountOwnerRepresentative = (personalData.roles as Roles)
    .representative
    ? { forename: personalData.forename, surname: personalData.surname }
    : null

  return (
    <div className="space-y-2">
      {accountOwnerRepresentative && (
        <div className="flex items-center justify-between rounded-lg bg-muted p-3">
          <p className="font-medium">
            {accountOwnerRepresentative.forename}{' '}
            {accountOwnerRepresentative.surname}
          </p>
        </div>
      )}
      {naturalRepresentatives?.map((representative) => (
        <div
          key={representative.key}
          className="flex items-center justify-between rounded-lg bg-muted p-3"
        >
          <p className="font-medium">
            {/* {representative.representativePersonType ===
            RepresentativePersonType.Natural
              ? `${representative.forename} ${representative.surname}`
              : representative.name} */}
            {representative.forename} {representative.surname}
          </p>
          {!(company.beneficial_owners as BeneficialOwner[] | null)?.find(
            ({ id }) => id === representative.key,
          ) &&
            formState === 'list' && (
              <Button
                className="h-6"
                size="sm"
                variant="ghost"
                onClick={() => handleAddAsBeneficialOwner(representative)}
              >
                <UserPlus className="size-4" />
              </Button>
            )}
        </div>
      ))}
    </div>
  )
}
