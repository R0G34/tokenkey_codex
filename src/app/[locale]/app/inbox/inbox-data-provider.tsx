import { selectMessages } from '@/dal/message'
import type React from 'react'
import { InboxRealtimeProvider } from './inbox-realtime-provider'

type InboxDataProviderProps = {
  children: React.ReactNode
}

export async function InboxDataProvider({ children }: InboxDataProviderProps) {
  const messages = await selectMessages()

  return (
    <InboxRealtimeProvider initialMessages={messages}>
      {children}
    </InboxRealtimeProvider>
  )
}
