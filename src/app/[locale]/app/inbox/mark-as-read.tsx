'use client'

import { Tables } from '@/lib/supabase/types/database.types'
import { useEffect } from 'react'
import { markAsRead } from './[id]/actions'

type Props = {
  messageId: Tables<'message'>['id']
}

export function MarkAsRead({ messageId }: Props) {
  useEffect(() => {
    // Small delay to ensure user actually viewed the message.
    const timer = setTimeout(() => markAsRead(messageId), 500)
    return () => clearTimeout(timer)
  }, [messageId])

  return null
}
