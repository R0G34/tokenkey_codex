'use client'

import { Tables } from '@/lib/supabase/types/database.types'
import InboxMessageDetail from './inbox-message-detail'
import { useInboxRealtime } from './inbox-realtime-provider'

type Props = {
  selectedId?: Tables<'message'>['id']
}

export default function InboxMessageDetailRealtime({ selectedId }: Props) {
  const { getMessageById } = useInboxRealtime()

  const message = selectedId ? getMessageById(selectedId) : null

  return <InboxMessageDetail message={message} />
}
