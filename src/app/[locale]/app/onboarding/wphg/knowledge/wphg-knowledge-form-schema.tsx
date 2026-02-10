import en from '@/i18n/messages/onboarding/en.json'
import { Messages } from 'next-intl'
import * as z from 'zod'

const questions = en.onboarding.wphg.knowledge.form.questions

export const createWphgKnowledgeFormSchema = (
  t: (
    key: keyof Messages['onboarding']['wphg']['knowledge']['errors'],
  ) => string,
) => {
  return z.object({
    experiences: z.array(z.string()).min(0).max(4),
    answers: z
      .array(z.string())
      .length(questions.length)
      .refine(
        (val) => val.filter((v) => !!v?.length).length === questions.length,
        { message: t('answer-all') },
      ),
  })
}

export type WphgKnowledgeFormSchemaDataType = z.infer<
  ReturnType<typeof createWphgKnowledgeFormSchema>
>
