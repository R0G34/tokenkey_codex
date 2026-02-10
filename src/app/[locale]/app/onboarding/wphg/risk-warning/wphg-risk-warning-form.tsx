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
import { Link, useRouter } from '@/i18n/navigation'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { saveWphgRiskWarning } from './actions'
import {
  createWphgRiskWarningFormSchema,
  WphgRiskWarningFormSchemaDataType,
} from './wphg-risk-warning-form-schema'

interface Props {
  initialRiskConsent: boolean | null
  name: string
}

export default function WphgRiskWarningForm({
  initialRiskConsent,
  name,
}: Props) {
  const router = useRouter()
  const t = useTranslations('onboarding')
  const tFormErrors = useTranslations('onboarding.wphg.risk-warning.errors')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const WphgProfessionalFormSchema =
    createWphgRiskWarningFormSchema(tFormErrors)
  const form = useForm<WphgRiskWarningFormSchemaDataType>({
    resolver: zodResolver(WphgProfessionalFormSchema),
    defaultValues: {
      riskConsent: initialRiskConsent ?? false,
    },
  })

  async function onSubmit(values: WphgRiskWarningFormSchemaDataType) {
    try {
      setIsSubmitting(true)
      const { data, error } = await saveWphgRiskWarning(values)
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
        <FormField
          control={form.control}
          name="riskConsent"
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
                  {t('wphg.risk-warning.form.description', { name })}
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
