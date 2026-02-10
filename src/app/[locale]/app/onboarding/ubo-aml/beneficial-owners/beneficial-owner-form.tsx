'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { CountryDropdown } from '@/components/ui/country-dropdown'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/utils/tailwind/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, subYears } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { updateBeneficialOwners } from './actions'
import {
  BeneficialOwner,
  createBeneficialOwnerFormSchema,
} from './beneficial-owner-type'
import { useBeneficialOwners } from './beneficial-owners-context'

export function BeneficialOwnerForm() {
  const router = useRouter()
  const { addingRepresentative, company, setFormState } = useBeneficialOwners()
  const t = useTranslations('onboarding.beneficialOwners.form')
  const tFormErrors = useTranslations('onboarding.beneficialOwners.form.errors')

  const BeneficialOwnerFormSchema = createBeneficialOwnerFormSchema(tFormErrors)
  const form = useForm<BeneficialOwner>({
    resolver: zodResolver(BeneficialOwnerFormSchema),
    defaultValues: addingRepresentative
      ? {
          id: addingRepresentative.key,
          forename: addingRepresentative.forename,
          surname: addingRepresentative.surname,
          // birthdate: ,
          nationality: '',
          birthplace: '',
          isPep: false,
          isFictitiousUbo: false,
          capitalShares: 0,
          votingRights: 0,
          streetAndNumber: '',
          postcode: '',
          city: '',
          country: '',
        }
      : {
          id: Date.now().toString(),
          forename: '',
          surname: '',
          // birthdate: ,
          nationality: '',
          birthplace: '',
          isPep: false,
          isFictitiousUbo: false,
          capitalShares: 0,
          votingRights: 0,
          streetAndNumber: '',
          postcode: '',
          city: '',
          country: '',
        },
  })

  const onSubmit = async (data: BeneficialOwner) => {
    const newBeneficialOwner: BeneficialOwner = {
      id: addingRepresentative?.key || Date.now().toString(),
      forename: data.forename,
      surname: data.surname,
      birthdate: new Date(data.birthdate),
      birthplace: data.birthplace,
      nationality: data.nationality,
      isPep: data.isPep,
      isFictitiousUbo: data.isFictitiousUbo,
      capitalShares: data.capitalShares,
      votingRights: data.votingRights,
      streetAndNumber: data.streetAndNumber,
      postcode: data.postcode,
      city: data.city,
      country: data.country,
    }

    const beneficialOwners = (
      company.beneficial_owners as BeneficialOwner[] | null
    )?.map((ben) => ({
      ...ben,
      birthdate: new Date(ben.birthdate),
    }))

    await updateBeneficialOwners(
      // editingBeneficialOwner && beneficialOwners
      //   ? beneficialOwners.map((ben) =>
      //       ben.id === editingBeneficialOwner.id ? newBeneficialOwner : ben,
      //     )
      //   : [...(beneficialOwners ?? []), newBeneficialOwner],
      [...(beneficialOwners ?? []), newBeneficialOwner],
    )

    setFormState('list')
    router.refresh()
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <p className="text-xl font-semibold">{t('title')}</p>
          <form
            className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="forename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('forename')}</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly={!!addingRepresentative} />
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
                  <FormLabel>{t('surname')}</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly={!!addingRepresentative} />
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
                  <FormLabel>{t('birthDate')}</FormLabel>
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
                            // field.value
                            <span>{t('birthDatePlaceholder')}</span>
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
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('nationality')}</FormLabel>
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
              name="birthplace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('placeOfBirth')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-6">
              <FormField
                control={form.control}
                name="isPep"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0! space-x-2">
                    <FormLabel>{t('isPep')}</FormLabel>
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
                name="isFictitiousUbo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0! space-x-2">
                    <FormLabel>{t('fictitiousUBO')}</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="capitalShares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('capitalShares')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="votingRights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('votingRights')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 lg:col-span-2 lg:col-start-1">
              <h3 className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-white">
                {t('address.title')}
              </h3>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <FormField
                  control={form.control}
                  name="streetAndNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('address.streetNumber')}</FormLabel>
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
                      <FormLabel>{t('address.postcode')}</FormLabel>
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
                      <FormLabel>{t('address.city')}</FormLabel>
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
                      <FormLabel>{t('address.country')}</FormLabel>
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

            <div className="flex justify-end space-x-2 lg:col-start-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormState('list')}
              >
                {t('cancel')}
              </Button>
              <Button type="submit">{t('save')}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
