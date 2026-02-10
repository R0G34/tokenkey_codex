import { useTranslations } from 'next-intl'

export default function ErrorPage(/* {
  searchParams,
}: {
  searchParams: { error: string }
} */) {
  // const searchParams = useSearchParams()
  // const error = searchParams.error as Error
  const t = useTranslations('auth.errorPage')
  return (
    <div>
      {/* {error === 'AccountExists' && (
        <p>
          An account with this email already exists. Please sign in instead.
        </p>
      )} */}
      {/* Optionally, redirect users back to the login page */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/signin">{t('cta')}</a>
    </div>
  )
}
