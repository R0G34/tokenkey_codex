'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { selectMessageById } from '@/dal/message/queries/select-message-by-id'
import { dateTimeFormatter } from '@/utils/date-formatter'
import { FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { MarkAsRead } from './mark-as-read'

type Props = {
  message?: Awaited<ReturnType<typeof selectMessageById>>
}

export default function InboxMessageDetail({ message }: Props) {
  const t = useTranslations('inbox.detail')

  if (!message) {
    return (
      <Card className="hidden h-full md:flex">
        <CardHeader>
          <CardTitle className="text-base">{t('noSelection.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('noSelection.description')}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">{message.title}</CardTitle>
            <time
              className="block text-xs text-muted-foreground"
              dateTime={message.created_at}
            >
              {dateTimeFormatter.format(new Date(message.created_at))}
            </time>
          </div>
          {!message.read && (
            <>
              <MarkAsRead messageId={message.id} />
              <span
                className="inline-flex h-2 w-2 translate-y-2 rounded-full bg-primary"
                aria-label={t('unread')}
              />
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <article className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-sm leading-6">{message.content}</p>
        </article>

        <section aria-label={t('attachments')} className="space-y-2">
          <h4 className="text-sm font-medium">{t('attachments')}</h4>
          {message.attachments?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t('noAttachments')}
            </p>
          ) : (
            <ul className="space-y-2">
              {message.attachments?.map((a) => (
                <li key={a.url}>
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    aria-label={`Open ${a.name} in a new tab`}
                  >
                    <FileText className="h-4 w-4" aria-hidden />
                    <span className="truncate">{a.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      (PDF)
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </CardContent>
    </Card>
  )
}
