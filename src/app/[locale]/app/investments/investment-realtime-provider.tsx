'use client'

import { selectOrders } from '@/dal/orders'
import { createClient } from '@/utils/supabase/client'
import { useSession } from 'next-auth/react'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type Order = Awaited<ReturnType<typeof selectOrders>>[number]

type InvestmentRealtimeContextType = {
  getOrderById: (id: number) => Order | undefined
  orders: Order[]
}

const InvestmentRealtimeContext =
  createContext<InvestmentRealtimeContextType | null>(null)

type InvestmentRealtimeProviderProps = {
  children: ReactNode
  initialOrders: Order[]
}

export function InvestmentRealtimeProvider({
  children,
  initialOrders,
}: InvestmentRealtimeProviderProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const { data: session } = useSession()

  const supabase = createClient()
  supabase.realtime.setAuth(session?.supabaseAccessToken)

  const getOrderById = (id: number) => orders.find((m) => m.id === id)

  useEffect(() => {
    const channel = supabase
      .channel('order_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          filter: `user_id=eq.${session?.user.id}`,
          schema: 'public',
          table: 'order',
        },
        (payload) => {
          if (payload.eventType !== 'UPDATE') return
          const updatedOrder = payload.new as Order
          setOrders((prev) =>
            prev.map((ord) =>
              ord.id === updatedOrder.id ? { ...ord, ...updatedOrder } : ord,
            ),
          )
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session?.user.id, supabase])

  // Update orders when initialOrders change (shouldn't happen often)
  useEffect(() => setOrders(initialOrders), [initialOrders])

  return (
    <InvestmentRealtimeContext.Provider value={{ getOrderById, orders }}>
      {children}
    </InvestmentRealtimeContext.Provider>
  )
}

export function useInvestmentRealtime() {
  const context = useContext(InvestmentRealtimeContext)
  if (!context) {
    throw new Error(
      'useInvestmentRealtime must be used within InvestmentRealtimeProvider',
    )
  }
  return context
}
