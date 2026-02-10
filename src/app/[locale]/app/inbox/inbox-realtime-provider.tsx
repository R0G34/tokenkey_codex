'use client'

import { selectMessages } from '@/dal/message'
import { createClient } from '@/utils/supabase/client'
import { useSession } from 'next-auth/react'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type Message = Awaited<ReturnType<typeof selectMessages>>[number]

type InboxRealtimeContextType = {
  getMessageById: (id: number) => Message | undefined
  messages: Message[]
  unreadCount: number
}

const InboxRealtimeContext = createContext<InboxRealtimeContextType | null>(
  null,
)

type InboxRealtimeProviderProps = {
  children: ReactNode
  initialMessages: Message[]
}

export function InboxRealtimeProvider({
  children,
  initialMessages,
}: InboxRealtimeProviderProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const { data: session } = useSession()

  const supabase = createClient()
  supabase.realtime.setAuth(session?.supabaseAccessToken)

  const unreadCount = messages.filter((m) => !m.read).length

  const getMessageById = (id: number) => messages.find((m) => m.id === id)

  useEffect(() => {
    const channel = supabase
      .channel('message_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          filter: `user_id=eq.${session?.user.id}`,
          schema: 'public',
          table: 'message',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message
            setMessages((prev) => [newMessage, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            const updatedMessage = payload.new as Message
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg,
              ),
            )
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id
            setMessages((prev) => prev.filter((msg) => msg.id !== deletedId))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session?.user.id, supabase])

  // Update messages when initialMessages change (shouldn't happen often)
  useEffect(() => setMessages(initialMessages), [initialMessages])

  return (
    <InboxRealtimeContext.Provider
      value={{ getMessageById, messages, unreadCount }}
    >
      {children}
    </InboxRealtimeContext.Provider>
  )
}

export function useInboxRealtime() {
  const context = useContext(InboxRealtimeContext)
  if (!context) {
    throw new Error(
      'useInboxRealtime must be used within InboxRealtimeProvider',
    )
  }
  return context
}
