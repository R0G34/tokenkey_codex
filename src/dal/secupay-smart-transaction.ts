import 'server-only'

import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
import { verifySession } from './session'

/**
 * Insert a new secupay smart transaction
 */
export const insertSecupaySmartTransaction = async (
  values: TablesInsert<'secupay_smart_transaction'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { error } = await supabase
    .from('secupay_smart_transaction')
    .insert(values)
  if (error) throw new Error('Database error', { cause: error.message })
}

/**
 * Update secupay smart transaction
 */
export const updateSecupaySmartTransaction = async (
  id: Tables<'secupay_smart_transaction'>['id'],
  values: TablesUpdate<'secupay_smart_transaction'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { error } = await supabase
    .from('secupay_smart_transaction')
    .update(values)
    .eq('id', id)
  if (error) throw new Error('Database error', { cause: error.message })
}

/**
 * Select secupay smart transaction by order ID
 *
 * Returns the pre-authorized transaction for an order, if one exists.
 */
export const selectSecupayTransactionByOrderId = async (orderId: number) => {
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
