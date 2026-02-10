'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { useRouter } from '@/i18n/navigation'
import { localeForAuthEmailCookieName } from '@/utils/authjs/locale-for-auth-email-cookie-name'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export function UserAuthForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [emailNotFound, setEmailNotFound] = useState<boolean>(
    error === 'EmailNotFound',
  )
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const t = useTranslations('auth')
  const UserAuthFormSchema = z.object({
    email: z
      .string()
      .min(1, t('UserAuthForm.schema.required_error'))
      .email(t('UserAuthForm.schema.email')),
  })
  const router = useRouter()
  const locale = useLocale()

  const form = useForm<z.infer<typeof UserAuthFormSchema>>({
    defaultValues: { email: '' },
    resolver: zodResolver(UserAuthFormSchema),
  })

  async function onSubmit(data: z.infer<typeof UserAuthFormSchema>) {
    try {
      setEmailNotFound(false)
      setIsLoading(true)
      // with magicLinkConfig
      // await signIn('resend', { email: data.email, callbackUrl })
      // with magicCodeConfig
      const res = await signIn(
        'resend',
        {
          email: data.email,
          // https://github.com/nextauthjs/next-auth/issues/709#issuecomment-861028401
          redirect: false,
          // relative or same origin: https://authjs.dev/reference/nextjs#example
          redirectTo: callbackUrl,
        },
        // https://github.com/nextauthjs/next-auth/pull/823
        // We need to send this param to know in the ResendProvider sendVerificationRequest function the locale to use to send the email.
        // The param is read in next-auth api route /api/auth/[...nextauth] and placed in cookie to be accessible in the sendVerificationRequest function.
        { [localeForAuthEmailCookieName]: locale },
      )
      if (!res?.ok) throw new Error(res?.error ?? 'could not signin the user')
      if (res?.error === 'EmailNotFound') {
        setIsLoading(false)
        setEmailNotFound(true)
        return
      }
      router.push({
        pathname: '/auth/verify-otp',
        query: { email: data.email },
      })
    } catch (error) {
      const message = getErrorMessage(error)
      console.log('❌ onSubmit', message)
      toast.error(t('toast.error'))
      setIsLoading(false)
      setEmailNotFound(false)
    }
  }

  const handleGoogleSignIn = async () => {
    signIn('google', {
      // relative or same origin: https://authjs.dev/reference/nextjs#example
      redirectTo: callbackUrl,
    })
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        {emailNotFound && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>
              {t('UserAuthForm.alertEmailNotFound')}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          <FormField
            control={form.control}
            disabled={isLoading}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    placeholder={t('UserAuthForm.emailPlaceholder')}
                    // type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {t('signInForm.emailButton')}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t('UserAuthForm.or')}
            </span>
          </div>
        </div>

        <Button
          disabled={isLoading}
          onClick={handleGoogleSignIn}
          type="button"
          variant="outline"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 size-4" />
          )}{' '}
          {t('signInForm.googleButton')}
        </Button>

        {/* <Button
        disabled={isLoading}
        onClick={(_) => signIn('github')}
        type="button"
        variant="outline"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 size-4" />
        )}{' '}
        Entrar con GitHub
      </Button> */}
        {/* <Button
        disabled={isLoading}
        onClick={(_) => signIn('apple')}
        type="button"
        variant="outline"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <Icons.apple className="mr-2 size-4" />
        )}{' '}
        Entrar con Apple
      </Button> */}
      </form>
    </Form>
  )
}
