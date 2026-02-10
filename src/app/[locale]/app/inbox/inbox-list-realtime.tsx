'use client'

import { Tables } from '@/lib/supabase/types/database.types'
import InboxList from './inbox-list'
import { useInboxRealtime } from './inbox-realtime-provider'

type InboxListProps = {
  selectedId?: Tables<'message'>['id']
}

export default function InboxListRealtime({ selectedId }: InboxListProps) {
  const { messages } = useInboxRealtime()

  return <InboxList messages={messages} selectedId={selectedId} />
}
