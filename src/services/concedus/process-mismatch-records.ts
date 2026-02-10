import { adminUpdatePersonalData } from '@/dal/admin/personaldata'
import { NaturalPerson } from '@/lib/condedus/types/person'
import { TablesUpdate } from '@/lib/supabase/types/database.types'
import { MismatchRecord } from '@/services/concedus/schema'

const concedusNaturalPersonToPersonalData: {
  [K in keyof NaturalPerson]?: keyof TablesUpdate<'personal_data'>
} = {
  street: 'street',
  zip: 'postcode',
  city: 'city',
  country: 'country',
  phone: 'phone_number',
  precheckPep: 'pep',
  birthDate: 'birthdate',
  birthPlace: 'birthplace',
  foreName: 'forename',
  mobile: 'phone_number',
  nationality: 'nationality',
  salutation: 'salutation',
  surName: 'surname',
} as const

export async function processMismatchRecords(
  records: MismatchRecord[],
): Promise<void> {
  for (const record of records) {
    if (!record.PersonKey.startsWith('PERS_'))
      throw new Error(`Invalid PersonKey format: ${record.PersonKey}`)

    const userId = record.PersonKey.replace('PERS_', '')

    if (!userId)
      throw new Error(`Invalid PersonKey format: ${record.PersonKey}`)

    const updates: TablesUpdate<'personal_data'> = {}

    for (const mismatch of record.Mismatches) {
      const personFieldName =
        mismatch.FieldName.charAt(0).toLowerCase() + mismatch.FieldName.slice(1)

      const column =
        concedusNaturalPersonToPersonalData[
          personFieldName as keyof typeof concedusNaturalPersonToPersonalData
        ]

      if (!column)
        throw new Error(`Unknown mismatch field name "${mismatch.FieldName}"`)

      updates[column] =
        column === 'pep'
          ? mismatch.KycValue === 'True'
          : (mismatch.KycValue as any)
    }

    await adminUpdatePersonalData(userId, updates)
  }
}
