'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utils/tailwind/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2 } from 'lucide-react'
import { Messages, useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { subscribeToNewsletter } from './actions'

export const createNewsletterFormSchema = (
  t: (key: keyof Messages['home']['newsletter']['errors']) => string,
) => {
  return z.object({
    email: z.string().email({ message: t('email') }),
    terms: z
      .boolean({ message: t('terms') })
      .refine((value) => value === true, t('terms')),
  })
}

type NewsletterSubscribeFormData = z.infer<
  ReturnType<typeof createNewsletterFormSchema>
>

interface Props {
  buttonText: string
  variant: 'hero' | 'footer'
}

export default function NewsletterSubscribeForm({
  buttonText,
  variant,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const tFormErrors = useTranslations('home.newsletter.errors')
  const schema = createNewsletterFormSchema(tFormErrors)
  const form = useForm<NewsletterSubscribeFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      terms: false,
    },
  })
  const t = useTranslations('home.newsletter')

  const onSubmit = async (data: NewsletterSubscribeFormData) => {
    setIsSubmitting(true)
    try {
      await subscribeToNewsletter(data.email, data.terms)
      toast(t('toast.success.title'), {
        description: t('toast.success.description'),
        icon: <CheckCircle2 className="size-4 text-green-500" />,
      })
      form.reset()
    } catch (error) {
      toast.error(t('toast.error.title'), {
        description: t('toast.error.description'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="grow">
                {/* {variant === 'hero' && (
                <FormDescription>
                  {t('formDescription')}
                </FormDescription>
              )} */}
                <FormControl>
                  <Input
                    className="text-sm"
                    placeholder={t('placeholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs md:text-sm" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant={variant === 'hero' ? 'secondary' : 'default'}
            className={cn(
              variant === 'hero'
                ? ''
                : 'border border-white hover:bg-white hover:text-primary',
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('isFetching') : buttonText}
          </Button>
        </div>
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  className={variant === 'hero' ? '' : 'border-white'}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel
                className={cn(
                  'block text-xs font-normal md:text-sm',
                  variant === 'hero' ? 'text-muted-foreground' : 'text-white',
                )}
              >
                {t.rich('consent', {
                  privacy: (chunks) => (
                    <Link
                      className="font-medium"
                      href="/privacy"
                      target="_blank"
                    >
                      {chunks}
                    </Link>
                  ),
                  terms: (chunks) => (
                    <Link
                      className="font-medium"
                      href="/terms-and-conditions"
                      target="_blank"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </FormLabel>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
