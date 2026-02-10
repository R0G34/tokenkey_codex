'use client'

import { Button } from '@/components/ui/button'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from '@/i18n/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Messages, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { LegalFormType } from '../../company/company-form-schema'
import { updateRepresentatives } from './actions'
import { Representative, RepresentativePersonType } from './representative-type'
import { useRepresentatives } from './representatives-context'

export const createLegalPersonFormSchema = (
  t: (key: keyof Messages['onboarding']['company']['form']['errors']) => string,
) => {
  return z.object({
    name: z.string().min(1, t('name')),
    legalForm: z.enum(
      Object.keys(LegalFormType) as [keyof typeof LegalFormType],
      { required_error: t('legalForm') },
    ),
    // streetAndNumber: z.string().min(1, t('streetAndNumber')),
    street: z.string().min(1, t('street')),
    streetNumber: z.string().min(1, t('streetNumber')),
    postcode: z.string().min(1, t('postcode')),
    city: z.string().min(1, t('city')),
    country: z.string().min(1, t('country')),
    // courtOfRegistration: z.string().min(1, t('courtOfRegistration')),
    courtOfRegistration: z.string(),
    registryNo: z.string(),
    registryNumber: z.string().min(1, t('registryNumber')),
    taxId: z.string().min(1, t('taxId')),
  })
}

type LegalPersonFormValues = z.infer<
  ReturnType<typeof createLegalPersonFormSchema>
>

export const RepresentativeLegalPersonForm = () => {
  const router = useRouter()
  const { company, setFormState, editingLegalRepresentative } =
    useRepresentatives()
  const t = useTranslations('onboarding')
  const tFormErrors = useTranslations('onboarding.company.form.errors')
  const schema = createLegalPersonFormSchema(tFormErrors)

  const form = useForm<LegalPersonFormValues>({
    resolver: zodResolver(schema),
    defaultValues: editingLegalRepresentative
      ? {
          ...editingLegalRepresentative,
          legalForm: editingLegalRepresentative.legalForm
            ? (editingLegalRepresentative.legalForm as keyof typeof LegalFormType)
            : undefined,
        }
      : {
          name: '',
          legalForm: undefined,
          street: '',
          streetNumber: '',
          postcode: '',
          city: '',
          country: '',
          courtOfRegistration: '',
          registryNo: '',
          registryNumber: '',
          taxId: '',
        },
  })

  const onSubmit = async (data: LegalPersonFormValues) => {
    const newRepresentative: Representative = {
      key: editingLegalRepresentative?.key || Date.now().toString(),
      type: RepresentativePersonType.Legal,
      name: data.name,
      legalForm: data.legalForm,
      street: data.street,
      streetNumber: data.streetNumber,
      postcode: data.postcode,
      city: data.city,
      country: data.country,
      courtOfRegistration: data.courtOfRegistration,
      registryNo: data.registryNo,
      registryNumber: data.registryNumber,
      taxId: data.taxId,
    }

    const representatives = company.representatives as Representative[] | null

    await updateRepresentatives(
      editingLegalRepresentative && representatives
        ? representatives.map((rep) =>
            rep.key === editingLegalRepresentative.key
              ? newRepresentative
              : rep,
          )
        : [...(representatives ?? []), newRepresentative],
    )

    setFormState('list')
    router.refresh()
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <p className="text-xl font-semibold">
            {t('representatives.addMember')}
          </p>
          <form
            className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
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
              name="courtOfRegistration"
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
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('company.form.address.street')}</FormLabel>
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
                    {t('company.form.address.streetNumber')}
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
                  <FormLabel>{t('company.form.address.postcode')}</FormLabel>
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
                  <FormLabel>{t('company.form.address.city')}</FormLabel>
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
                  <FormLabel>{t('company.form.address.country')}</FormLabel>
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

            <div className="flex justify-end space-x-2 lg:col-start-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormState('list')}
              >
                {t('representatives.cancel')}
              </Button>
              <Button type="submit">{t('representatives.save')}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
