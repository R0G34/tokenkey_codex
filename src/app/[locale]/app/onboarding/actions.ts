'use server'

import { verifySession } from '@/dal/session'
import { updateUserWithSelect } from '@/dal/user'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { getTranslations } from 'next-intl/server'
import { revalidatePath } from 'next/cache'
import {
  AccountTypeFormSchemaDataType,
  createAccountTypeFormSchema,
} from './account-type-form-schema'

export async function saveAccountType(data: AccountTypeFormSchemaDataType) {
  try {
    await verifySession()

    const tFormErrors = await getTranslations(
      'onboarding.personalData.form.errors',
    )

    const AccountTypeFormSchema = createAccountTypeFormSchema(tFormErrors)

    const result = AccountTypeFormSchema.safeParse(data)

    if (result.error) return { data: null, error: result.error.format() }

    const user = await updateUserWithSelect({
      type: Number(data.type.valueOf()),
    })

    const { id, ...restOfUser } = user

    revalidatePath('/app/onboarding', 'layout')

    return { data: restOfUser, error: null }
  } catch (error) {
    const message = getErrorMessage(error)
    console.log('❌ saveAccountType error', message, data)
    return {
      data: null,
      error: `could not save the data: ${message}`,
    }
  }
}
