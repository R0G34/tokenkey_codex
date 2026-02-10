'use server'

import { upsertBankAccount } from '@/dal/bank-account'
import { upsertCompanyWithSelect } from '@/dal/company'
import { verifySession } from '@/dal/session'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { getTranslations } from 'next-intl/server'
import { revalidatePath } from 'next/cache'
import {
  CompanyFormSchemaDataType,
  createCompanyFormSchema,
} from './company-form-schema'

export async function saveCompanyInformation(data: CompanyFormSchemaDataType) {
  try {
    const session = await verifySession()

    const tFormErrors = await getTranslations('onboarding.company.form.errors')
    const tbankFormErrors = await getTranslations('onboarding.bank.form.errors')

    const CompanyFormSchema = createCompanyFormSchema(
      tFormErrors,
      tbankFormErrors,
    )
    const result = CompanyFormSchema.safeParse(data)

    if (result.error) return { data: null, error: result.error.format() }

    const company = await upsertCompanyWithSelect({
      name: data.name,
      founding_date: data.foundingDate.toISOString(),
      registry_court: data.registryCourt,
      legal_form: data.legalForm,
      tax_id: data.taxId,
      registry_no: data.registryNo,
      registry_number: data.registryNumber,
      //
      street: data.street,
      street_number: data.streetNumber,
      city: data.city,
      postcode: data.postcode,
      country: data.country,
      user_id: session.user.id,
    })

    await upsertBankAccount({
      bank: data.bank,
      currency: data.currency,
      holder: data.holder,
      iban: data.iban,
      is_default: true,
      location: data.location,
      swift: data.swift,
      user_id: session.user.id,
      verification_amount: 0,
    })

    const { user_id, ...restOfCompany } = company

    revalidatePath('/app/onboarding', 'layout')

    return { data: restOfCompany, error: null }
  } catch (error) {
    const message = getErrorMessage(error)
    console.log('❌ saveCompanyInformation error', message, data)
    return {
      data: null,
      error: `could not save the data: ${message}`,
    }
  }
}
