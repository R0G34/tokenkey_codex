'use client'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { saveWphgInitial } from './actions'
import {
  createWphgInitialFormSchema,
  WphgInitialFormSchemaDataType,
} from './wphg-initial-form-schema'

interface Props {
  initialConsent: Tables<'experience'>['consent'] | null
}

export default function WphgInitialForm({ initialConsent }: Props) {
  const router = useRouter()
  const t = useTranslations('onboarding')
  const tFormErrors = useTranslations('onboarding.wphg.form.errors')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const WphgInitialFormSchema = createWphgInitialFormSchema(tFormErrors)
  const form = useForm<WphgInitialFormSchemaDataType>({
    resolver: zodResolver(WphgInitialFormSchema),
    defaultValues: {
      experienceOption: initialConsent as 'yes' | 'no' | 'professional',
    },
  })

  async function onSubmit(values: WphgInitialFormSchemaDataType) {
    try {
      setIsSubmitting(true)
      const { data: result, error } = await saveWphgInitial(values)
      if (error || !result) throw Error(error as string)
      if (values.experienceOption === 'yes')
        return router.push('/app/onboarding/wphg/knowledge')
      if (values.experienceOption === 'professional')
        return router.push('/app/onboarding/wphg/professional')
      return router.push('/app/onboarding/wphg/risk-warning')
    } catch (error) {
      const message = getErrorMessage(error)
      setIsSubmitting(false)
      toast.error(t('toast.error'), { description: message })
    }
  }

  // v1: equal to the example of Concedus

  // return (
  //   <Form {...form}>
  //     <form
  //       onSubmit={form.handleSubmit(onSubmit)}
  //       className="flex flex-col gap-4"
  //     >
  //       <Card>
  //         <CardContent className="space-y-4">
  //           <h3 className="font-semibold text-gray-900 md:text-lg dark:text-white">
  //             {t('wphg.form.legend')}
  //           </h3>
  //           <FormField
  //             control={form.control}
  //             name="experienceOption"
  //             render={({ field }) => (
  //               <FormItem>
  //                 <FormControl>
  //                   <RadioGroup
  //                     onValueChange={field.onChange}
  //                     value={field.value}
  //                     className="flex flex-col space-y-1"
  //                   >
  //                     <FormItem className="flex items-center space-y-0 space-x-3">
  //                       <FormControl>
  //                         <RadioGroupItem value="yes" />
  //                       </FormControl>
  //                       <FormLabel className="font-normal">
  //                         {t('wphg.form.yes')}
  //                       </FormLabel>
  //                     </FormItem>
  //                     <FormItem className="flex items-center space-y-0 space-x-3">
  //                       <FormControl>
  //                         <RadioGroupItem value="no" />
  //                       </FormControl>
  //                       <FormLabel className="font-normal">
  //                         {t('wphg.form.no')}
  //                       </FormLabel>
  //                     </FormItem>
  //                     <FormItem className="flex items-center space-y-0 space-x-3">
  //                       <FormControl>
  //                         <RadioGroupItem value="professional" />
  //                       </FormControl>
  //                       <FormLabel className="font-normal">
  //                         {t('wphg.form.professional')}
  //                       </FormLabel>
  //                     </FormItem>
  //                   </RadioGroup>
  //                 </FormControl>
  //                 <FormMessage />
  //               </FormItem>
  //             )}
  //           />
  //         </CardContent>
  //       </Card>
  //       <Button className="self-center" disabled={isSubmitting} type="submit">
  //         {t('wphg.form.submit')}
  //         {isSubmitting && <Icons.spinner className="animate-spin" />}
  //       </Button>
  //     </form>
  //   </Form>
  // )

  // v2: improve ux removing one necessary click for the user

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Card>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="experienceOption"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>{t('wphg.form.legend')}</FormDescription>
                  <FormControl>
                    <RadioGroup
                      className="flex flex-col"
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.handleSubmit(onSubmit)()
                      }}
                      value={field.value}
                    >
                      {['yes', 'no', 'professional'].map((answer) => (
                        <FormItem key={answer.toString()}>
                          <FormControl>
                            <RadioGroupItem
                              disabled={isSubmitting}
                              hidden
                              value={answer}
                            />
                          </FormControl>
                          <FormLabel
                            className={cn(
                              buttonVariants({ variant: 'outline' }),
                              'h-auto min-h-10 cursor-pointer font-normal whitespace-pre-wrap',
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
                            {/* @ts-expect-error */}
                            {t(`wphg.form.${answer}`)}
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
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
