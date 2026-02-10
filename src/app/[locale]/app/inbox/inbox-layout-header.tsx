'use client'

import { Button } from '@/components/ui/button'
import { Link, usePathname } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function InboxLayoutHeader() {
  const pathname = usePathname()
  const isDetailPage = pathname !== '/app/inbox'
  const t = useTranslations('inbox')

  return (
    <div className="mb-4 flex h-9 items-center justify-between">
      <h1 className="text-lg font-semibold">Inbox</h1>
      {isDetailPage && (
        <Button asChild variant="ghost" className="md:hidden">
          <Link href="/app/inbox" aria-label="Back to inbox list">
            <ArrowLeft className="mr-2 size-4" />
            {t('back')}
          </Link>
        </Button>
      )}
    </div>
  )
}
