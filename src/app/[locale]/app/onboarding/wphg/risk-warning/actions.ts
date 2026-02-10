'use server'

import { upsertExperienceWithSelect } from '@/dal/experience'
import { verifySession } from '@/dal/session'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { getTranslations } from 'next-intl/server'
import { revalidatePath } from 'next/cache'
import {
  createWphgRiskWarningFormSchema,
  WphgRiskWarningFormSchemaDataType,
} from './wphg-risk-warning-form-schema'

export async function saveWphgRiskWarning(
  values: WphgRiskWarningFormSchemaDataType,
) {
  try {
    const session = await verifySession()

    const t = await getTranslations('onboarding.wphg.professional.errors')
    const WphgProfessionalFormSchema = createWphgRiskWarningFormSchema(t)
    const result = WphgProfessionalFormSchema.safeParse(values)

    if (result.error) return { data: null, error: result.error.format() }

    const data = await upsertExperienceWithSelect({
      risk_consent: result.data.riskConsent,
      user_id: session.user.id,
    })

    revalidatePath('/app/onboarding', 'layout')
    return { data: data.risk_consent, error: null }
  } catch (error) {
    const message = getErrorMessage(error)
    console.log('❌ saveWphgProfessional error', message, values)
    return { data: null, error: `could not save the data: ${message}` }
  }
}
