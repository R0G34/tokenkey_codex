'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRouter } from '@/i18n/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Messages, useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { updateRepresentative, updateRepresentatives } from './actions'
import { Representative, RepresentativePersonType } from './representative-type'
import { useRepresentatives } from './representatives-context'

export const createNaturalPersonFormSchema = (
  t: (
    key: keyof Messages['onboarding']['representatives']['naturalPersonForm']['errors'],
  ) => string,
) => {
  return z.object({
    forename: z.string().min(1, t('forename')),
    surname: z.string().min(1, t('surname')),
  })
}

type NaturalPersonFormValues = z.infer<
  ReturnType<typeof createNaturalPersonFormSchema>
>

export const RepresentativeNaturalPersonForm = () => {
  const router = useRouter()
  const { company, setFormState, editingNaturalRepresentative } =
    useRepresentatives()
  const t = useTranslations('onboarding.representatives')
  const tFormErrors = useTranslations(
    'onboarding.representatives.naturalPersonForm.errors',
  )
  const schema = createNaturalPersonFormSchema(tFormErrors)
  const form = useForm<NaturalPersonFormValues>({
    resolver: zodResolver(schema),
    defaultValues: editingNaturalRepresentative ?? {
      forename: '',
      surname: '',
    },
  })

  const onSubmit = async (data: NaturalPersonFormValues) => {
    const newRepresentative: Representative = {
      key: editingNaturalRepresentative?.key || Date.now().toString(),
      type: RepresentativePersonType.Natural,
      forename: data.forename,
      surname: data.surname,
      // details: 'Natural Person',
    }

    const representatives = company.representatives as Representative[] | null

    if (editingNaturalRepresentative && representatives)
      await updateRepresentative(company, newRepresentative)
    else
      await updateRepresentatives([
        ...(representatives ?? []),
        newRepresentative,
      ])

    setFormState('list')
    router.refresh()
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <p className="text-xl font-semibold">{t('addMember')}</p>
          <form
            className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="forename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('naturalPersonForm.forename')}</FormLabel>
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
                  <FormLabel>{t('naturalPersonForm.surname')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
