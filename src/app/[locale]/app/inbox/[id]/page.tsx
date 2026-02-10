import { selectMessageById } from '@/dal/message/queries/select-message-by-id'
import { Tables } from '@/lib/supabase/types/database.types'
import { notFound } from 'next/navigation'
import InboxListRealtime from '../inbox-list-realtime'
import InboxMessageDetailRealtime from '../inbox-message-detail-realtime'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function InboxMessagePage(props: PageProps) {
  const params = await props.params

  const id = Number(params.id) as Tables<'message'>['id']

  if (isNaN(id)) notFound()

  const message = await selectMessageById(id)

  if (!message) notFound()

  return (
    <div className="grid gap-4 md:grid-cols-[360px_1fr]">
      <div className="hidden md:sticky md:top-4 md:block md:h-[calc(100vh-12rem)] md:overflow-auto">
        <InboxListRealtime selectedId={id} />
      </div>
      <div className="overflow-x-hidden">
        <InboxMessageDetailRealtime selectedId={id} />
      </div>
    </div>
  )
}
