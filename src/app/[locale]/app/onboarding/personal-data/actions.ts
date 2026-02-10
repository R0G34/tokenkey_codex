'use server'

import { upsertBankAccount } from '@/dal/bank-account'
import { upsertPersonalDataWithSelect } from '@/dal/personaldata'
import { verifySession } from '@/dal/session'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { getTranslations } from 'next-intl/server'
import { revalidatePath } from 'next/cache'
import { PersonType } from '../account-type-form-schema'
import {
  createPersonalDataFormSchema,
  PersonalDataFormSchemaDataType,
} from './personaldata-form-schema'

export async function savePersonalInformation(
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

    // let newRepresentatives = null

    // if (
    //   data.type.valueOf() === PersonType.Company &&
    //   // @ts-expect-error
    //   data.roles.representative
    // ) {
    // }

    // if (data.type.valueOf() === PersonType.Company) {
    //   // @ts-expect-error
    //   if (data.roles.representative) {
    //     if (initialValues?.representatives as Representative[].) {
    //     }
    //   } else {
    //   }
    //  if initialRepresentatives includes owner in representative => update
    //  else add
    // else
    //  if initialRepresentatives includes owner in representative => remove
    //  else nothing
    //
    //  if roles includes representative
    //    if initialRepresentatives includes owner in representative => update
    //    else add
    // else
    //  if initialRepresentatives includes owner in representative => remove
    //  else nothing
    // } else {
    //   newRepresentatives = null
    // }

    // const initialRepresentatives = initialValues?.representatives ?? []

    // data.type.valueOf() === PersonType.Company ? data.roles : undefined

    // const accountOwnerRepresentative = {
    //   id: 'accountOwner',
    // }

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
      // nyala_customer_id: null,
      // optional
      // gender: 0,
      // salutation: null,
      // phone_number: 'string',
      roles:
        // @ts-expect-error
        data.type.valueOf() === PersonType.Company ? data.roles : undefined,
      // representatives: initialValues.representatives
      // representatives: representatives.map((rep) =>
      //   rep.id === editingId
      //     ? ({
      //         id: Date.now().toString(),
      //         type: RepresentativeType.Natural,
      //         forename: data.forename,
      //         surname: data.surname,
      //       } as Representative)
      //     : rep,
      // ),
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

    revalidatePath('/app/onboarding', 'layout')

    return { data: restOfPersonalData, error: null }
  } catch (error) {
    console.log('🔥', error)
    const message = getErrorMessage(error)
    console.log('❌ savePersonalInformation error', message, data)
    return {
      data: null,
      error: `could not save the data: ${message}`,
    }
  }
}
