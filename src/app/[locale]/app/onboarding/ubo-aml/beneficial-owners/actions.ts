'use server'

import { updateCompany } from '@/dal/company'
import { verifySession } from '@/dal/session'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { BeneficialOwner } from './beneficial-owner-type'

export async function updateBeneficialOwners(
  beneficialOwners: BeneficialOwner[],
) {
  try {
    await verifySession()

    // const result = PersonalDataFormSchema.safeParse(data)

    // if (result.error) return { data: null, error: result.error.format() }

    await updateCompany({
      beneficial_owners: beneficialOwners.map((ben) => ({
        ...ben,
        birthdate: ben.birthdate.toISOString(),
      })),
    })

    return { data: null, error: null }
  } catch (error) {
    const message = getErrorMessage(error)
    console.log('❌ updateBeneficialOwners error', message, beneficialOwners)
    return {
      data: null,
      error: `could not save the data: ${message}`,
    }
  }
}
