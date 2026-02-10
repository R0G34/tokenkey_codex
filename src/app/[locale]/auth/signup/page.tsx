import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { UserAuthForm } from './user-auth-form'

export async function generateMetadata() {
  const t = await getTranslations('auth.signUpPage')
  return { title: t('title') }
}

export default function SignUpPage() {
  const t = useTranslations('auth.signUpPage')
  return (
    <div className="space-y-6">
      <UserAuthForm />

      <div className="px-8 text-center text-sm text-muted-foreground">
        {t('text')}{' '}
        <Link href="/auth/signin" className="underline">
          {t('cta')}
        </Link>
      </div>
    </div>
  )
}
