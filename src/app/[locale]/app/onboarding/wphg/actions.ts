'use server'

import { upsertExperienceWithSelect } from '@/dal/experience'
import { verifySession } from '@/dal/session'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { getTranslations } from 'next-intl/server'
import { revalidatePath } from 'next/cache'
import {
  createWphgInitialFormSchema,
  WphgInitialFormSchemaDataType,
} from './wphg-initial-form-schema'

export async function saveWphgInitial(values: WphgInitialFormSchemaDataType) {
  try {
    const session = await verifySession()

    const tFormErrors = await getTranslations('onboarding.wphg.form.errors')

    const WphgInitialFormSchema = createWphgInitialFormSchema(tFormErrors)
    const result = WphgInitialFormSchema.safeParse(values)

    if (result.error) return { data: null, error: result.error.format() }

    const data = await upsertExperienceWithSelect({
      // If option yes or professional then upsert consent to null, consent will be saved when yes or professional form is submitted.
      consent:
        values.experienceOption === 'no' ? values.experienceOption : null,
      user_id: session.user.id,
    })

    const { user_id, ...restOfData } = data

    revalidatePath('/app/onboarding', 'layout')

    return { data: restOfData, error: null }
  } catch (error) {
    const message = getErrorMessage(error)
    console.log('❌ saveWphgInitial error', message, values)
    return {
      data: null,
      error: `could not save the data: ${message}`,
    }
  }
}
