'use server'

import { updatePersonalDataWithSelect } from '@/dal/personaldata'
import { verifySession } from '@/dal/session'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { PepFormSchema, PepFormSchemaDataType } from './pep-form-schema'
import { revalidatePath } from 'next/cache'

export async function savePep(data: PepFormSchemaDataType) {
  try {
    await verifySession()

    const result = PepFormSchema.safeParse(data)

    if (result.error) return { data: null, error: result.error.format() }

    const personalData = await updatePersonalDataWithSelect({ pep: data.isPep })

    const { user_id, ...restOfPersonalData } = personalData

    revalidatePath('/app/onboarding', 'layout')
    return { data: restOfPersonalData, error: null }
  } catch (error) {
    const message = getErrorMessage(error)
    console.log('❌ savePep error', message, data)
    return {
      data: null,
      error: `could not save the data: ${message}`,
    }
  }
}
