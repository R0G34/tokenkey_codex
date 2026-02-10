'use server'

import { upsertExperienceWithSelect } from '@/dal/experience'
import { verifySession } from '@/dal/session'
import { scoreInvestorexperience } from '@/services/concedus/score-investor-experience'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { getTranslations } from 'next-intl/server'
import {
  createWphgKnowledgeFormSchema,
  WphgKnowledgeFormSchemaDataType,
} from './wphg-knowledge-form-schema'

export async function saveWphgKnowledge(
  values: WphgKnowledgeFormSchemaDataType,
) {
  try {
    const session = await verifySession()

    const tFormErrors = await getTranslations(
      'onboarding.wphg.knowledge.errors',
    )
    const WphgKnowledgeFormSchema = createWphgKnowledgeFormSchema(tFormErrors)
    const result = WphgKnowledgeFormSchema.safeParse(values)

    if (result.error) return { data: null, error: result.error.format() }

    const { score } = await scoreInvestorexperience({
      investorExperience: [
        { name: 'AE1', value: result.data.answers[0] },
        { name: 'AE2', value: result.data.answers[1] },
        { name: 'AE3', value: result.data.answers[2] },
        { name: 'AE4', value: result.data.answers[3] },
        { name: 'AE5', value: result.data.answers[4] },
        { name: 'AE6', value: result.data.answers[5] },
        { name: 'AE7', value: result.data.answers[6] },
        { name: 'AE8', value: result.data.answers[7] },
      ],
    })

    const data = await upsertExperienceWithSelect({
      consent: 'yes',
      knowledge: {
        answers: Object.fromEntries(values.answers.map((v, i) => [i + 1, v])),
        experiences: values.experiences,
      },
      score,
      user_id: session.user.id,
    })

    const { knowledge } = data

    return { data: { knowledge, score }, error: null }
  } catch (error) {
    const message = getErrorMessage(error)
    console.log('❌ saveWphgKnowledge error', message, values)
    return {
      data: null,
      error: `could not save the data: ${message}`,
    }
  }
}
