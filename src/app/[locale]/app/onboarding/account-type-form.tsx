'use client'

import { Button } from '@/components/ui/button'
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
import { useRouter as i18nUseRouter } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { cn } from '@/utils/tailwind/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  AccountTypeFormSchemaDataType,
  createAccountTypeFormSchema,
  PersonType,
} from './account-type-form-schema'
import { saveAccountType } from './actions'

interface Props extends React.HTMLAttributes<HTMLFormElement> {
  readOnly?: boolean
  user: Tables<'user'>
}

export default function AccountTypeForm({
  className = '',
  readOnly = false,
  user,
}: Props) {
  const i18nRouter = i18nUseRouter()
  const t = useTranslations('onboarding')
  const tFormErrors = useTranslations('onboarding.personalData.form.errors')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const AccountTypeFormSchema = createAccountTypeFormSchema(tFormErrors)

  const form = useForm<AccountTypeFormSchemaDataType>({
    resolver: zodResolver(AccountTypeFormSchema),
    defaultValues: {
      type: user.type === 1 ? PersonType.Company : PersonType.Customer,
    },
  })

  async function onSubmit(values: AccountTypeFormSchemaDataType) {
    try {
      setIsSubmitting(true)
      const { data: result, error } = await saveAccountType(
        // user,
        values,
      )
      if (error || !result) throw Error(error as string)
      i18nRouter.push(
        values.type === PersonType.Company
          ? '/app/onboarding/company'
          : '/app/onboarding/personal-data',
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
        className={cn('flex flex-col gap-8', className)}
      >
        <div>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-bold">
                  {t('personalData.form.accountType.legend')}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col gap-1.5 sm:flex-row sm:gap-3"
                  >
                    <FormItem>
                      <FormControl>
                        <RadioGroupItem
                          className="sr-only"
                          value={PersonType.Customer}
                        />
                      </FormControl>
                      <FormLabel
                        className={cn(
                          'mt-0! flex items-center justify-between gap-2 rounded-md border-2 p-2 transition-colors hover:border-primary/20 hover:bg-primary/25',
                          field.value === PersonType.Customer
                            ? 'border-primary bg-primary/10'
                            : 'border-slate-200',
                        )}
                      >
                        <User className="size-4 text-primary" />
                        {t('personalData.form.accountType.naturalPerson')}
                      </FormLabel>
                    </FormItem>

                    <FormItem>
                      <FormControl>
                        <RadioGroupItem
                          className="sr-only"
                          value={PersonType.Company}
                        />
                      </FormControl>
                      <FormLabel
                        className={cn(
                          'mt-0! flex items-center justify-between gap-2 rounded-md border-2 p-2 transition-colors hover:border-primary/20 hover:bg-primary/25',
                          field.value === PersonType.Company
                            ? 'border-primary bg-primary/10'
                            : 'border-slate-200',
                        )}
                      >
                        <Building2 className="size-4 text-primary" />
                        {t('personalData.form.accountType.legalPerson')}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!readOnly && (
          <Button className="self-end" disabled={isSubmitting} type="submit">
            {t('personalData.form.submit')}
            {isSubmitting && <Icons.spinner className="animate-spin" />}
          </Button>
        )}
      </form>
    </Form>
  )
}
