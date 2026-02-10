import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { UserAuthForm } from './user-auth-form'

interface Props {
  searchParams?: Promise<{
    callbackUrl?: string
  }>
}

export async function generateMetadata() {
  const t = await getTranslations('auth.signInPage')
  return { title: t('title') }
}

export default async function SignInPage(props: Props) {
  const t = await getTranslations('auth.signInPage')
  const searchParams = await props.searchParams
  const href = searchParams?.callbackUrl
    ? `/auth/signup?callbackUrl=${encodeURIComponent(searchParams.callbackUrl)}`
    : '/auth/signup'
  return (
    <div className="space-y-6">
      <UserAuthForm />
      <div className="px-8 text-center text-sm text-muted-foreground">
        {t('text')}{' '}
        <Link
          className="underline"
          // @ts-ignore
          href={href}
        >
          {t('cta')}
        </Link>
      </div>
    </div>
  )
}
