'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Icons } from '@/components/ui/icons'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { localeForAuthEmailCookieName } from '@/utils/authjs/locale-for-auth-email-cookie-name'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { signIn } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface Props {
  email: string
  redirectTo: string
}

export default function OTPForm({ email, redirectTo }: Props) {
  const t = useTranslations('auth')
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()

  const formSchema = z.object({
    code: z.string().min(8, { message: t('verifyOtpPage.form.errors.code') }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { code: '' },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const url = new URL('/api/auth/callback/resend', window.location.href)
        url.searchParams.append('email', email)
        url.searchParams.append('token', data.code)
        url.searchParams.append('callbackUrl', redirectTo)
        const response = await fetch(url.href)

        if (!response.ok) throw new Error('Error during code verification')

        // router.push(new URL(response.url).pathname)
        // mobile needs router.refresh so:
        window.location.href = response.url
      } catch (error) {
        const message = getErrorMessage(error)
        console.log('❌ onSubmit', message)
        toast.error(t('verifyOtpPage.toast.error.title'), {
          description: t('verifyOtpPage.toast.error.description'),
        })
      }
    })
  }

  const handleChange = async () => {
    const isValid = await form.trigger('code')
    if (!isValid) return
    form.handleSubmit(onSubmit)()
  }

  async function handleResend() {
    startTransition(async () => {
      try {
        const res = await signIn(
          'resend',
          {
            email,
            // https://github.com/nextauthjs/next-auth/issues/709#issuecomment-861028401
            redirect: false,
            // relative or same origin: https://authjs.dev/reference/nextjs#example
            redirectTo,
          },
          // https://github.com/nextauthjs/next-auth/pull/823
          // We need to send this param to know in the ResendProvider sendVerificationRequest function the locale to use to send the email.
          // The param is read in next-auth api route /api/auth/[...nextauth] and placed in cookie to be accessible in the sendVerificationRequest function.
          { [localeForAuthEmailCookieName]: locale },
        )
        if (!res?.ok) throw new Error(res?.error ?? 'could not send código')
        form.reset()
        form.setFocus('code')
        toast(t('verifyOtpPage.resend.toast.success'))
      } catch (error) {
        const message = getErrorMessage(error)
        console.log('❌ onSubmit', message)
        toast.error(t('verifyOtpPage.resend.toast.error'))
      }
    })
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-6"
        >
          <FormField
            control={form.control}
            disabled={isPending}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center gap-2 space-y-0">
                {/* <FormLabel>One-Time Password</FormLabel> */}
                <FormControl>
                  <InputOTP
                    autoFocus
                    inputMode="text"
                    maxLength={8}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    {...field}
                    onChange={(newValue) => {
                      field.onChange(newValue)
                      handleChange()
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                {/* <FormDescription>
                  Please enter the one-time password sent to your phone.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit">
            {isPending && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {t('verifyOtpPage.submit')}
          </Button>
        </form>
      </Form>

      <div className="mt-2 flex items-center text-center text-sm text-gray-600">
        <p>{t('verifyOtpPage.resend.title')}</p>
        <Button
          className="font-medium"
          disabled={isPending}
          onClick={handleResend}
          variant="link"
        >
          {t('verifyOtpPage.resend.submit')}
        </Button>
      </div>
    </>
  )
}
