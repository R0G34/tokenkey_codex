import { auth } from '@/auth/auth'
import { redirect } from '@/i18n/navigation'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

export default async function AuthLayout(
  props: Readonly<{
    children: React.ReactNode
    params: Promise<{ locale: Locale }>
  }>,
) {
  const params = await props.params

  const { locale } = params

  const { children } = props

  const session = await auth()
  if (session) return redirect({ href: '/', locale })
  const t = await getTranslations('auth')
  return (
    <div className="relative container grid min-h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-96">
          <div className="flex flex-col items-center text-center">
            <Image
              alt="TokenKey's logo"
              height={78}
              src="/img/logo-tokenkey.png"
              width={234}
            />
          </div>
          {children}
        </div>
      </div>
      <div className="relative hidden h-full flex-col justify-center overflow-hidden bg-muted p-10 text-center text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <Image
          alt="TokenKey's logo"
          className="absolute top-0 -left-24"
          height={447}
          src="/img/logo-tokenkey-2.png"
          width={410}
        />
        <Image
          alt="TokenKey's logo"
          className="absolute -right-24 bottom-0"
          height={447}
          src="/img/logo-tokenkey-2.png"
          width={410}
        />
        <div className="relative text-4xl leading-snug font-semibold">
          {t('layout.text2')}
        </div>
      </div>
    </div>
  )
}
