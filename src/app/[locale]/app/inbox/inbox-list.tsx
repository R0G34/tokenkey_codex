'use client'

import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { Link } from '@/i18n/navigation'
import { Tables } from '@/lib/supabase/types/database.types'
import { dateFormatter } from '@/utils/date-formatter'
import { cn } from '@/utils/tailwind/cn'
import { useTranslations } from 'next-intl'

type InboxListProps = {
  messages: Tables<'message'>[]
  selectedId?: Tables<'message'>['id']
}

export default function InboxList({
  messages = [],
  selectedId,
}: InboxListProps) {
  const t = useTranslations('inbox')

  if (messages.length === 0) {
    return (
      <div className="border p-8">
        <Empty>
          <EmptyTitle>{t('empty.title')}</EmptyTitle>
          <EmptyDescription>{t('empty.description')}</EmptyDescription>
        </Empty>
      </div>
    )
  }

  return (
    <nav aria-label="Inbox messages" className="w-full">
      <ul className="divide-y rounded-xl border">
        {messages.map((m, index) => {
          const active = m.id === selectedId
          return (
            <li key={m.id}>
              <Link
                href={{
                  pathname: '/app/inbox/[id]',
                  params: { id: m.id },
                }}
                className={cn(
                  'flex gap-3 p-4 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  active && 'bg-muted',
                  index === 0
                    ? 'rounded-t-xl'
                    : index === messages.length - 1
                      ? 'rounded-b-xl'
                      : '',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <span
                  aria-hidden
                  className={cn(
                    'mt-1 h-2 w-2 flex-shrink-0 rounded-full',
                    m.read ? 'bg-muted-foreground/30' : 'bg-primary',
                  )}
                  title={m.read ? 'Read' : 'Unread'}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={cn(
                        'truncate text-sm',
                        m.read ? 'font-medium' : 'font-semibold',
                      )}
                    >
                      {m.title}
                    </h3>
                    {!m.read && (
                      <span className="sr-only">{'Unread message'}</span>
                    )}
                    <time
                      className="ml-auto shrink-0 text-xs text-muted-foreground"
                      dateTime={m.created_at}
                      aria-label={`Received ${dateFormatter.format(new Date(m.created_at))}`}
                      title={dateFormatter.format(new Date(m.created_at))}
                    >
                      {dateFormatter.format(new Date(m.created_at))}
                    </time>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {m.preview}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
