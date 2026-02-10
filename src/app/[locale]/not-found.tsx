import { Button, buttonVariants } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('not-found')
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">{t('h1')}</h1>
        <p className="text-gray-600">{t('text')}</p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link className={buttonVariants()} href="/">
            <ArrowLeft className="size-4" />
            {t('homeButton')}
          </Link>

          <Link href="/app/projects">
            <Button variant="outline">{t('marketplaceButton')}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
