'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Icons } from '@/components/ui/icons'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Link, useRouter } from '@/i18n/navigation'
import { Knowledge } from '@/types/experience'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { saveWphgKnowledge } from './actions'
import {
  createWphgKnowledgeFormSchema,
  WphgKnowledgeFormSchemaDataType,
} from './wphg-knowledge-form-schema'

interface Props {
  initialKnowledge: Knowledge | null
}

type Questions = {
  id: number
  text: string
  answers: { id: number; text: string }[]
}[]

type Experience = {
  text: string
  answers: { id: number; text: string }[]
}

export default function WphgKnowledgeForm({ initialKnowledge }: Props) {
  const router = useRouter()
  const t = useTranslations('onboarding')
  const tFormErrors = useTranslations('onboarding.wphg.knowledge.errors')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const questions = t.raw('wphg.knowledge.form.questions') as Questions
  const experience = t.raw('wphg.knowledge.form.experience') as Experience

  const WphgKnowledgeFormSchema = createWphgKnowledgeFormSchema(tFormErrors)
  const form = useForm<WphgKnowledgeFormSchemaDataType>({
    resolver: zodResolver(WphgKnowledgeFormSchema),
    defaultValues: {
      answers: initialKnowledge?.answers
        ? questions.map(({ id }) => initialKnowledge.answers[id])
        : Array(questions.length).fill(''),
      experiences: initialKnowledge?.experiences ?? [],
    },
  })

  async function onSubmit(values: WphgKnowledgeFormSchemaDataType) {
    try {
      setIsSubmitting(true)
      const { data, error } = await saveWphgKnowledge(values)
      if (error || !data) throw Error(error as string)
      if (data.score < 7)
        return router.push('/app/onboarding/wphg/risk-warning')
      router.push('/app/onboarding/custody')
    } catch (error) {
      const message = getErrorMessage(error)
      setIsSubmitting(false)
      toast.error(t('toast.error'), { description: message })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {questions.map(({ answers, id, text }) => (
          <Card className="border border-slate-100 bg-slate-50" key={id}>
            <CardHeader>
              <CardTitle className="text-base">{text}</CardTitle>
              <CardDescription>
                {t('wphg.knowledge.form.description', {
                  id,
                  length: questions.length,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name={`answers.${id - 1}`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {answers.map((answer) => (
                          <FormItem
                            className="flex items-center space-y-0 space-x-3"
                            key={answer.id}
                          >
                            <FormControl>
                              <RadioGroupItem value={answer.id.toString()} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {answer.text}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        {form.formState.errors.answers?.root && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.answers.root.message}
          </p>
        )}

        <Card className="border border-slate-100 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-base">{experience.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="experiences"
              render={() => (
                <FormItem>
                  {experience.answers.map((answer) => (
                    <FormField
                      key={answer.id}
                      control={form.control}
                      name="experiences"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={answer.id}
                            className="flex flex-row items-start space-y-0 space-x-3"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  answer.id.toString(),
                                )}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        answer.id.toString(),
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) =>
                                            value !== answer.id.toString(),
                                        ),
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {answer.text}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between space-x-4">
          <Link
            className={buttonVariants({ variant: 'outline' })}
            href="/app/onboarding/wphg"
          >
            {t('wphg.knowledge.form.back')}
          </Link>
          <Button disabled={isSubmitting} type="submit">
            {t('wphg.knowledge.form.submit')}
            {isSubmitting && <Icons.spinner className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  )
}
