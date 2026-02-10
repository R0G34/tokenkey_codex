import { redirect } from '@/i18n/navigation'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import OTPForm from './otp-form'

export async function generateMetadata() {
  const t = await getTranslations('auth.verifyOtpPage')
  return { title: t('title') }
}

export default async function VerifyOTPPage(props: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ email: string }>
}) {
  const searchParams = await props.searchParams
  const params = await props.params

  const { locale } = params

  if (!searchParams.email) redirect({ href: '/auth/signin', locale })

  const t = await getTranslations('auth')
  const cookieStore = await cookies()
  const secure = !!process.env.VERCEL_ENV
  const key = secure ? '__Secure-authjs.callback-url' : 'authjs.callback-url'
  const redirectTo = cookieStore.get(key)?.value || '/'

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <p className="text-gray-500 dark:text-gray-400">
          {t('verifyOtpPage.text', { email: searchParams.email })}
        </p>
      </div>

      <OTPForm email={searchParams.email} redirectTo={redirectTo} />
    </div>
  )
}
