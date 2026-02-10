import 'server-only'

import { Tables } from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
import { verifySession } from './session'

/**
 * Select secupay smart transaction by order ID (for current user)
 * Note: RLS policy handles user authorization via order ownership
 */
export const selectSecupaySmartTransactionByOrderId = async (
  orderId: Tables<'order'>['id'],
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)

  const { data, error } = await supabase
    .from('secupay_smart_transaction')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle()

  if (error) throw new Error('Database error', { cause: error.message })
  return data
}
