'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Icons } from '@/components/ui/icons'
import { Switch } from '@/components/ui/switch'
import en from '@/i18n/messages/onboarding/en.json'
import { Link, useRouter } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { saveWphgProfessional } from './actions'
import { ProfessionalRequirements } from './professional-requirements'
import {
  createWphgProfessionalFormSchema,
  WphgProfessionalFormSchemaDataType,
} from './wphg-professional-form-schema'

interface Props {
  initialData: {
    requirements: ProfessionalRequirements
    consent: boolean
  } | null
  name:
    | `${Tables<'personal_data'>['forename']} ${Tables<'personal_data'>['surname']}`
    | Tables<'company'>['name']
  userType: NonNullable<Tables<'user'>['type']>
}

type Requirements = {
  id: number
  personType: number
  title: keyof ProfessionalRequirements
  text: string
}[]

const requirementsEn = en.onboarding.wphg.professional.form
  .requirements as Requirements

export default function WphgProfessionalForm({
  initialData,
  name,
  userType,
}: Props) {
  const router = useRouter()
  const t = useTranslations('onboarding')
  const tFormErrors = useTranslations('onboarding.wphg.professional.errors')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const requirements = t.raw(
    'wphg.professional.form.requirements',
  ) as Requirements

  const WphgProfessionalFormSchema =
    createWphgProfessionalFormSchema(tFormErrors)
  const form = useForm<WphgProfessionalFormSchemaDataType>({
    resolver: zodResolver(WphgProfessionalFormSchema),
    defaultValues: {
      consent: initialData?.consent ?? false,
      requirements: initialData?.requirements
        ? requirementsEn.map(({ title }) => initialData.requirements[title])
        : Array(requirementsEn.length).fill(false),
    },
  })

  async function onSubmit(values: WphgProfessionalFormSchemaDataType) {
    try {
      setIsSubmitting(true)
      const { data, error } = await saveWphgProfessional(values)
      if (error || !data) throw Error(error as string)
      router.push('/app/onboarding/custody')
    } catch (error) {
      const message = getErrorMessage(error)
      setIsSubmitting(false)
      toast.error(t('toast.error'), { description: message })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {requirements
          .filter(({ personType }) => personType === userType)
          .map(({ id, text }) => (
            <FormField
              key={id}
              control={form.control}
              name={`requirements.${id - 1}`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-normal text-muted-foreground">
                      {text}
                    </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ))}

        {form.formState.errors.requirements?.root && (
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.requirements.root.message}
          </p>
        )}

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg p-4">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-0.5">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  {/* @ts-expect-error */}
                  {t(`wphg.professional.form.description.${userType}`, {
                    name,
                  })}
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-between space-x-4">
          <Link
            className={buttonVariants({ variant: 'outline' })}
            href="/app/onboarding/wphg"
          >
            {t('wphg.professional.form.back')}
          </Link>
          <Button disabled={isSubmitting} type="submit">
            {t('wphg.professional.form.submit')}
            {isSubmitting && <Icons.spinner className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  )
}
