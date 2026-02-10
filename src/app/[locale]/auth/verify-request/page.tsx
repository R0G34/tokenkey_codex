import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('auth.verifyRequestPage')
  return { title: t('meta-title') }
}

export default async function VerifyRequestPage() {
  const t = await getTranslations('auth')
  return (
    <div className="space-y-2 text-center">
      <h1 className="text-3xl font-bold">{t('verifyRequestPage.title')}</h1>
      <p className="text-gray-500 dark:text-gray-400">
        {t('verifyRequestPage.text')}
      </p>
    </div>
  )
}
