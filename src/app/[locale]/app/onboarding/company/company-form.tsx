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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { saveCompanyInformation } from './actions'
import {
  CompanyFormSchemaDataType,
  createCompanyFormSchema,
  LegalFormType,
} from './company-form-schema'

interface Props extends React.HTMLAttributes<HTMLFormElement> {
  initialBankAccount: Tables<'bank_account'> | null
  initialCompany: Tables<'company'> | null
  readOnly?: boolean
}

export default function CompanyForm({
  className = '',
  initialBankAccount,
  initialCompany,
  readOnly = false,
}: Props) {
  const i18nRouter = i18nUseRouter()
  const t = useTranslations('onboarding')
  const tFormErrors = useTranslations('onboarding.company.form.errors')
  const tbankFormErrors = useTranslations('onboarding.bank.form.errors')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const PersonalDataFormSchema = createCompanyFormSchema(
    tFormErrors,
    tbankFormErrors,
  )
  const form = useForm<CompanyFormSchemaDataType>({
    resolver: zodResolver(PersonalDataFormSchema),
    defaultValues: {
      ...initialCompany,
      name: initialCompany?.name ?? '',
      foundingDate: initialCompany?.founding_date
        ? new Date(initialCompany.founding_date)
        : undefined,
      registryCourt: initialCompany?.registry_court ?? '',
      legalForm: initialCompany?.legal_form
        ? (initialCompany?.legal_form as keyof typeof LegalFormType)
        : undefined,
      taxId: initialCompany?.tax_id ?? '',
      registryNo: initialCompany?.registry_no ?? '',
      registryNumber: initialCompany?.registry_number ?? '',
      //
      street: initialCompany?.street ?? '',
      streetNumber: initialCompany?.street_number ?? '',
      postcode: initialCompany?.postcode ?? '',
      city: initialCompany?.city ?? '',
      country: initialCompany?.country ?? '',
      // Bank Account
      holder: initialBankAccount?.holder ?? '',
      bank: initialBankAccount?.bank ?? '',
      swift: initialBankAccount?.swift ?? '',
      iban: initialBankAccount?.iban ?? '',
      location: initialBankAccount?.location ?? '',
      currency: initialBankAccount?.currency ?? 'Euro',
    },
  })

  async function onSubmit(values: CompanyFormSchemaDataType) {
    try {
      setIsSubmitting(true)
      const { data: result, error } = await saveCompanyInformation(values)
      if (error || !result) throw Error(error as string)
      i18nRouter.push('/app/onboarding/personal-data')
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
            {t('company.form.companyInformation.legend')}
          </FormLabel>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('company.form.companyInformation.name')}
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
              name="legalForm"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>
                    {t('company.form.companyInformation.legalForm')}
                  </FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(value: string) => {
                      field.onChange(value)
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t(
                            'company.form.companyInformation.legalFormPlaceholder',
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(LegalFormType).map((key) => (
                        <SelectItem key={key} value={key}>
                          {/* @ts-ignore */}
                          {t(`company.legalForm.${key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('company.form.companyInformation.taxId')}
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
              name="registryNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('company.form.companyInformation.registryNumber')}
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
              name="registryCourt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('company.form.companyInformation.registryCourt')}
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
              name="registryNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('company.form.companyInformation.registryNo')}
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
              name="foundingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5 py-1">
                  <FormLabel>
                    {t('company.form.companyInformation.foundingDate')}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            // w-[240px]
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>
                              {t('company.form.companyInformation.pickADate')}
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
                    <Input
                      {...field}
                      // placeholder={t('personalData.form.address.street')}
                    />
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
                    <Input
                      {...field}
                      // placeholder={t('personalData.form.address.streetNumber')}
                    />
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
                    <Input
                      {...field}
                      // placeholder={t('personalData.form.address.postcode')}
                    />
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
                    <Input
                      {...field}
                      // placeholder={t('personalData.form.address.city')}
                    />
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

        <div className="space-y-4">
          <FormLabel className="text-base font-bold">
            {t('bank.form.legend')}
          </FormLabel>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="holder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('bank.form.holder')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      // placeholder={t('bank.form.holder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('bank.form.bank')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      // placeholder={t('bank.form.bank')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="swift"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('bank.form.swift')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      // placeholder={t('bank.form.swift')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iban"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('bank.form.iban')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      // placeholder={t('bank.form.iban')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('bank.form.location')}</FormLabel>
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

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('bank.form.currency')}</FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      {...field}
                      // placeholder={t('bank.form.currency')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
