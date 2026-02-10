'use server'

import { updateCompany } from '@/dal/company'
import { verifySession } from '@/dal/session'
import { Tables } from '@/lib/supabase/types/database.types'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { BeneficialOwner } from '../beneficial-owners/beneficial-owner-type'
import { Representative, RepresentativePersonType } from './representative-type'

export async function deleteRepresentative(
  company: Tables<'company'>,
  representativeId: Representative['key'],
) {
  try {
    await verifySession()

    const representatives = company.representatives as Representative[]
    const beneficialOwners = company.beneficial_owners as
      | BeneficialOwner[]
      | null

    await updateCompany({
      representatives: representatives.filter(
        ({ key: id }) => id !== representativeId,
      ),
      beneficial_owners: beneficialOwners
        ?.filter(({ id }) => id !== representativeId)
        .map((ben) => ({
          ...ben,
          birthdate: new Date(ben.birthdate).toISOString(),
        })),
    })

    return { data: null, error: null }

    // const { user_id, ...restOfPersonalInformation } = personalInformation

    // return { data: restOfPersonalInformation, error: null }
  } catch (error) {
    const message = getErrorMessage(error)
    console.log('❌ deleteRepresentative error', message, representativeId)
    return {
      data: null,
      error: `could not save the data: ${message}`,
    }
  }
}

export async function updateRepresentative(
  company: Tables<'company'>,
  representative: Representative,
) {
  try {
    await verifySession()

    const representatives = (
      company.representatives as Representative[] | null
    )?.map((rep) => (rep.key === representative.key ? representative : rep))

    const beneficialOwners = (
      company.beneficial_owners as BeneficialOwner[] | null
    )?.map((ben) =>
      ben.id === representative.key &&
      RepresentativePersonType.Natural === representative.type
        ? {
            ...ben,
            forename: representative.forename,
            surname: representative.surname,
            birthdate: new Date(ben.birthdate).toISOString(),
          }
        : {
            ...ben,
            birthdate: new Date(ben.birthdate).toISOString(),
          },
    )

    await updateCompany({
      representatives,
      beneficial_owners: beneficialOwners,
    })

    return { data: null, error: null }

    // const { user_id, ...restOfPersonalInformation } = personalInformation

    // return { data: restOfPersonalInformation, error: null }
  } catch (error) {
    const message = getErrorMessage(error)
    console.log('❌ updateRepresentative error', message, representative.key)
    return {
      data: null,
      error: `could not save the data: ${message}`,
    }
  }
}

export async function updateRepresentatives(representatives: Representative[]) {
  try {
    await verifySession()

    // const result = PersonalDataFormSchema.safeParse(data)

    // if (result.error) return { data: null, error: result.error.format() }

    // representatives edited + in beneficial_owners then update => compare ids
    // representatives deleted + in beneficial_owners then delete => how to know??

    await updateCompany({ representatives: representatives })

    return { data: null, error: null }

    // const { user_id, ...restOfPersonalInformation } = personalInformation

    // return { data: restOfPersonalInformation, error: null }
  } catch (error) {
    const message = getErrorMessage(error)
    console.log('❌ updateRepresentatives error', message, representatives)
    return {
      data: null,
      error: `could not save the data: ${message}`,
    }
  }
}
