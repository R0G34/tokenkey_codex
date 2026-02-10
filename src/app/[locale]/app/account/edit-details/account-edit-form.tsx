'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CountryDropdown } from '@/components/ui/country-dropdown'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useRouter as i18nUseRouter } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { cn } from '@/utils/tailwind/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, subYears } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PersonType } from '../../onboarding/account-type-form-schema'
import {
  createPersonalDataFormSchema,
  PersonalDataFormSchemaDataType,
} from '../../onboarding/personal-data/personaldata-form-schema'
import { saveAccountPersonalInformation } from './actions'

interface Props extends React.HTMLAttributes<HTMLFormElement> {
  initialPersonalData: Tables<'personal_data'> | null
  user: Tables<'user'>
}

export default function AccountEditForm({
  className = '',
  initialPersonalData,
  user,
}: Props) {
  const i18nRouter = i18nUseRouter()
  const t = useTranslations('onboarding')
  const tAccount = useTranslations('account')
  const tFormErrors = useTranslations('onboarding.personalData.form.errors')
  const tbankFormErrors = useTranslations('onboarding.bank.form.errors')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const PersonalDataFormSchema = createPersonalDataFormSchema(
    tFormErrors,
    tbankFormErrors,
  )
  const form = useForm<PersonalDataFormSchemaDataType>({
    resolver: zodResolver(PersonalDataFormSchema),
    defaultValues: {
      ...initialPersonalData,
      type: user.type === 0 ? PersonType.Customer : PersonType.Company,
      forename: initialPersonalData?.forename ?? '',
      surname: initialPersonalData?.surname ?? '',
      birthdate: initialPersonalData?.birthdate
        ? new Date(initialPersonalData.birthdate)
        : undefined,
      birthplace: initialPersonalData?.birthplace ?? '',
      nationality: initialPersonalData?.nationality ?? '',
      street: initialPersonalData?.street ?? '',
      streetNumber: initialPersonalData?.street_number ?? '',
      postcode: initialPersonalData?.postcode ?? '',
      city: initialPersonalData?.city ?? '',
      country: initialPersonalData?.country ?? '',
      roles: (initialPersonalData?.roles as any) ?? {
        representative: false,
        authorizedBeneficialOwner: false,
        powerOfAttorney: false,
      },
    },
  })

  async function onSubmit(values: PersonalDataFormSchemaDataType) {
    try {
      setIsSubmitting(true)
      const { data: result, error } =
        await saveAccountPersonalInformation(values)
      if (error || !result) throw Error(error as string)

      toast.success(tAccount('messages.saveSuccess'))
      i18nRouter.push('/app/account')
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
        <div className="space-y-4">
          <FormLabel className="text-base font-bold">
            {t('personalData.form.personalInformation.legend')}
          </FormLabel>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="forename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('personalData.form.personalInformation.firstName')}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('personalData.form.personalInformation.lastName')}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5 py-1">
                  <FormLabel>
                    {t('personalData.form.personalInformation.birthDate')}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>
                              {t(
                                'personalData.form.personalInformation.pickADate',
                              )}
                            </span>
                          )}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        autoFocus
                        defaultMonth={subYears(new Date(), 24)}
                        disabled={(date) =>
                          date > subYears(new Date(), 18) ||
                          date < subYears(new Date(), 120)
                        }
                        mode="single"
                        onSelect={field.onChange}
                        selected={field.value}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthplace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('personalData.form.personalInformation.placeOfBirth')}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('personalData.form.personalInformation.nationality')}
                  </FormLabel>
                  <FormControl>
                    <CountryDropdown
                      defaultValue={field.value}
                      onChange={(country) => field.onChange(country.alpha2)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <FormLabel className="text-base font-bold">
            {t('personalData.form.address.legend')}
          </FormLabel>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('personalData.form.address.street')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="streetNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('personalData.form.address.streetNumber')}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('personalData.form.address.postcode')}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('personalData.form.address.city')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('personalData.form.address.country')}
                  </FormLabel>
                  <FormControl>
                    <CountryDropdown
                      defaultValue={field.value}
                      onChange={(country) => field.onChange(country.alpha2)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting} className="min-w-32">
            {isSubmitting && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {tAccount('editPage.saveButton')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
