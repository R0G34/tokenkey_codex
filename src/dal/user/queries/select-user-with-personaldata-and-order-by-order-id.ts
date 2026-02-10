import 'server-only'

import { verifySession } from '@/dal/session'
import { Tables } from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
// eslint-disable-next-line no-restricted-imports
import { redirect } from 'next/navigation'

export const selectUserWithPersonalDataAndOrderByOrderId = async (
  orderId: Tables<'order'>['id'],
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('user')
    .select('*, personal_data(*), order!inner(*, project(*))')
    .eq('order.id', orderId)
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  if (!data) redirect('/api/auth/signin')

  return {
    ...data,
    // The query returns order as an array, extract the first element.
    order: data.order.length ? data.order[0] : null,
    personal_data: data.personal_data || null,
  }
}
