'use server'

import { upsertBankAccount } from '@/dal/bank-account'
import { upsertPersonalDataWithSelect } from '@/dal/personaldata'
import { verifySession } from '@/dal/session'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { getTranslations } from 'next-intl/server'
import { revalidatePath } from 'next/cache'
import { PersonType } from '../../onboarding/account-type-form-schema'
import {
  createPersonalDataFormSchema,
  PersonalDataFormSchemaDataType,
} from '../../onboarding/personal-data/personaldata-form-schema'

export async function saveAccountPersonalInformation(
  data: PersonalDataFormSchemaDataType,
) {
  try {
    const session = await verifySession()

    const tFormErrors = await getTranslations(
      'onboarding.personalData.form.errors',
    )

    const tbankFormErrors = await getTranslations('onboarding.bank.form.errors')

    const PersonalDataFormSchema = createPersonalDataFormSchema(
      tFormErrors,
      tbankFormErrors,
    )
    const result = PersonalDataFormSchema.safeParse(data)

    if (result.error) return { data: null, error: result.error.format() }

    const personalData = await upsertPersonalDataWithSelect({
      forename: data.forename,
      surname: data.surname,
      birthdate: data.birthdate.toISOString(),
      birthplace: data.birthplace,
      nationality: data.nationality,
      street: data.street,
      street_number: data.streetNumber,
      city: data.city,
      postcode: data.postcode,
      country: data.country,
      user_id: session.user.id,
      roles:
        // @ts-expect-error
        data.type.valueOf() === PersonType.Company ? data.roles : undefined,
    })

    if (data.type.valueOf() === PersonType.Customer) {
      await upsertBankAccount({
        // @ts-expect-error
        bank: data.bank,
        // @ts-expect-error
        currency: data.currency,
        // @ts-expect-error
        holder: data.holder,
        // @ts-expect-error
        iban: data.iban,
        is_default: true,
        // @ts-expect-error
        location: data.location,
        // @ts-expect-error
        swift: data.swift,
        user_id: session.user.id,
        verification_amount: 0,
      })
    }

    const { user_id, ...restOfPersonalData } = personalData

    revalidatePath('/app/account', 'page')

    return { data: restOfPersonalData, error: null }
  } catch (error) {
    const message = getErrorMessage(error)
    console.log('❌ saveAccountPersonalInformation error', message, data)
    return {
      data: null,
      error: `could not save the data: ${message}`,
    }
  }
}
