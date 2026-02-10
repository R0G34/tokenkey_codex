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
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useRouter as i18nUseRouter } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { cn } from '@/utils/tailwind/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, subYears } from 'date-fns'
import { CalendarIcon, InfoIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PersonType } from '../account-type-form-schema'
import { savePersonalInformation } from './actions'
import {
  createPersonalDataFormSchema,
  PersonalDataFormSchemaDataType,
} from './personaldata-form-schema'
import { Roles } from './roles'

interface Props extends React.HTMLAttributes<HTMLFormElement> {
  initialBankAccount: Tables<'bank_account'> | null
  initialPersonalData: Tables<'personal_data'> | null
  readOnly?: boolean
  user: Tables<'user'>
}

export default function PersonalDataForm({
  className = '',
  initialBankAccount,
  initialPersonalData,
  readOnly = false,
  user,
}: Props) {
  const i18nRouter = i18nUseRouter()
  const t = useTranslations('onboarding')
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
      roles: (initialPersonalData?.roles as Roles) ?? {
        representative: false,
        authorizedBeneficialOwner: false,
        powerOfAttorney: false,
      },
      // Bank Account
      holder: initialBankAccount?.holder ?? '',
      bank: initialBankAccount?.bank ?? '',
      swift: initialBankAccount?.swift ?? '',
      iban: initialBankAccount?.iban ?? '',
      location: initialBankAccount?.location ?? '',
      currency: initialBankAccount?.currency ?? 'Euro',
    },
  })

  async function onSubmit(values: PersonalDataFormSchemaDataType) {
    try {
      setIsSubmitting(true)
      const { data: result, error } = await savePersonalInformation(values)
      if (error || !result) throw Error(error as string)
      i18nRouter.push('/app/onboarding/pep')
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
            {/* <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a title" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="mrs">Mrs.</SelectItem>
                      <SelectItem value="ms">Ms.</SelectItem>
                      <SelectItem value="dr">Dr.</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
                            // w-[240px]
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

        {user.type === Number(PersonType.Customer) && (
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
        )}

        {/* <fieldset className="grid grid-cols-1 gap-6 rounded-lg border p-4 lg:grid-cols-2">
            <legend className="-ml-1 px-1 text-sm font-medium">Contacto</legend>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone</FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      value={field.value}
                      placeholder="Enter your number"
                      // onCountryChange={setCountryData}
                    />
                  </FormControl>
                  <FormDescription>
                    Include country code (e.g. +44)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset> */}

        {user.type === Number(PersonType.Company) && (
          <div className="space-y-4">
            <FormLabel className="text-base font-bold">
              {t('personalData.form.roles.legend')}
            </FormLabel>
            <div className="grid grid-cols-1 gap-4">
              <p className="text-sm text-muted-foreground">
                {t('personalData.form.roles.desc')}
              </p>

              <FormField
                control={form.control}
                name="roles.representative"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="font-normal">
                          {t('personalData.form.roles.representative')}
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value !== false}
                          onCheckedChange={(checked) => {
                            field.onChange(
                              checked
                                ? { fictitiousBeneficialOwner: false }
                                : false,
                            )
                          }}
                        />
                      </FormControl>
                    </div>

                    {field.value !== false && (
                      <FormField
                        control={form.control}
                        name="roles.representative.fictitiousBeneficialOwner"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg bg-muted p-4">
                            <div className="flex items-center space-y-0.5">
                              <FormLabel className="mr-2 font-normal">
                                {t(
                                  'personalData.form.roles.fictitiousBeneficialOwner.label',
                                )}
                              </FormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger type="button">
                                    <InfoIcon className="size-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">
                                      {t(
                                        'personalData.form.roles.fictitiousBeneficialOwner.tooltip',
                                      )}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
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
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roles.authorizedBeneficialOwner"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="font-normal">
                          {t(
                            'personalData.form.roles.authorizedBeneficialOwner.label',
                          )}
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value !== false}
                          onCheckedChange={(checked) => {
                            field.onChange(
                              checked
                                ? { capitalShares: 0, votingRights: 0 }
                                : false,
                            )
                          }}
                        />
                      </FormControl>
                    </div>

                    {field.value !== false && (
                      <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4">
                        <FormField
                          control={form.control}
                          name="roles.authorizedBeneficialOwner.capitalShares"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t(
                                  'personalData.form.roles.authorizedBeneficialOwner.capitalShares',
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="roles.authorizedBeneficialOwner.votingRights"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t(
                                  'personalData.form.roles.authorizedBeneficialOwner.votingRights',
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roles.powerOfAttorney"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="font-normal">
                        {t('personalData.form.roles.powerOfAttorney')}
                      </FormLabel>
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

              <FormField
                control={form.control}
                name="roles"
                render={() => <FormMessage />}
              />

              {/* @ts-expect-error */}
              {form.formState.errors.roles?.root && (
                <p className="text-sm font-medium text-destructive">
                  {/* @ts-expect-error */}
                  {form.formState.errors.roles.root.message}
                </p>
              )}
            </div>
          </div>
        )}

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
