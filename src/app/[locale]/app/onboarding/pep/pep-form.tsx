'use client'

import { buttonVariants } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Icons } from '@/components/ui/icons'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useRouter } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { cn } from '@/utils/tailwind/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PersonType } from '../account-type-form-schema'
import { savePep } from './actions'
import { PepFormSchema, PepFormSchemaDataType } from './pep-form-schema'

interface Props {
  personalData: Tables<'personal_data'>
  user: Tables<'user'>
}

export default function PepForm({ personalData, user }: Props) {
  const router = useRouter()
  // const tToast = useTranslations('toast')
  // const t = useTranslations('onboarding.pepStatus.form')
  const t = useTranslations('onboarding')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PepFormSchemaDataType>({
    resolver: zodResolver(PepFormSchema),
    defaultValues: {
      isPep: personalData.pep === null ? undefined : personalData.pep,
    },
  })

  async function onSubmit(values: PepFormSchemaDataType) {
    try {
      setIsSubmitting(true)
      const { data: result, error } = await savePep(values)
      if (error || !result) throw Error(error as string)
      form.reset({ isPep: !!result.pep })
      router.push(
        user.type === Number(PersonType.Customer.valueOf())
          ? '/app/onboarding/wphg'
          : '/app/onboarding/ubo-aml',
      )
    } catch (error) {
      const message = getErrorMessage(error)
      setIsSubmitting(false)
      toast.error(t('toast.error'), {
        description: message,
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* v1: equal to the example of Concedus */}

        {/* <FormField
          control={form.control}
          name="isPep"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start justify-between gap-1 space-y-0 rounded-lg border p-4">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-base font-normal!">
                {t('pepStatus.form.status')}
              </FormLabel>
            </FormItem>
          )}
        />
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600 italic">
            {t('pepStatus.form.submitHint')}
          </p>
          <Button disabled={isSubmitting} type="submit">
            {t('pepStatus.form.submit')}
            {isSubmitting && <Icons.spinner className="animate-spin" />}
          </Button>
        </div> */}

        {/* v2: improve ux removing one necessary click for the user */}

        <FormField
          control={form.control}
          name="isPep"
          render={({ field }) => (
            <FormItem>
              <FormDescription>{t('pepStatus.form.status')}</FormDescription>
              <FormControl>
                <RadioGroup
                  className="flex justify-center gap-4"
                  onValueChange={(value) => {
                    field.onChange(value === 'true')
                    form.handleSubmit(onSubmit)()
                  }}
                  value={field.value?.toString()}
                >
                  {[false, true].map((answer) => (
                    <FormItem key={answer.toString()}>
                      <FormControl>
                        <RadioGroupItem
                          disabled={isSubmitting}
                          hidden
                          value={answer.toString()}
                        />
                      </FormControl>
                      <FormLabel
                        className={cn(
                          buttonVariants({ variant: 'outline' }),
                          'cursor-pointer font-normal',
                          field.value !== null
                            ? field.value === answer
                              ? 'border-2 border-primary bg-primary/10'
                              : 'text-muted-foreground'
                            : '',
                          isSubmitting ? 'pointer-events-none' : '',
                        )}
                        onClick={() =>
                          field.value === answer &&
                          form.handleSubmit(onSubmit)()
                        }
                      >
                        {answer
                          ? t('pepStatus.form.yes')
                          : t('pepStatus.form.no')}
                        {field.value === answer && isSubmitting && (
                          <Icons.spinner className="animate-spin" />
                        )}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-sm text-gray-600 italic">
          {t('pepStatus.form.submitHint')}
        </p>
      </form>
    </Form>
  )
}
