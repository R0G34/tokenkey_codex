'use server'

import { upsertExperienceWithSelect } from '@/dal/experience'
import { verifySession } from '@/dal/session'
import { getErrorMessage } from '@/utils/error/get-error-message'
import {
  createWphgProfessionalFormSchema,
  WphgProfessionalFormSchemaDataType,
} from './wphg-professional-form-schema'
// import { requirements } from './requirements'
import en from '@/i18n/messages/onboarding/en.json'
import { getTranslations } from 'next-intl/server'
import { revalidatePath } from 'next/cache'

const requirements = en.onboarding.wphg.professional.form.requirements

export async function saveWphgProfessional(
  values: WphgProfessionalFormSchemaDataType,
) {
  try {
    const session = await verifySession()

    const t = await getTranslations('onboarding.wphg.professional.errors')
    const WphgProfessionalFormSchema = createWphgProfessionalFormSchema(t)
    const result = WphgProfessionalFormSchema.safeParse(values)

    if (result.error) return { data: null, error: result.error.format() }

    const data = await upsertExperienceWithSelect({
      consent: 'professional',
      professional: {
        requirements: Object.fromEntries(
          requirements.map(({ id, title }) => [
            title,
            values.requirements[id - 1],
          ]),
        ),
        consent: values.consent,
      },
      user_id: session.user.id,
    })

    const { user_id, professional } = data

    revalidatePath('/app/onboarding', 'layout')
    return { data: professional, error: null }
  } catch (error) {
    const message = getErrorMessage(error)
    console.log('❌ saveWphgProfessional error', message, values)
    return { data: null, error: `could not save the data: ${message}` }
  }
}
