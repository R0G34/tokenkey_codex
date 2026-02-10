import 'server-only'

import { TablesUpdate } from '@/lib/supabase/types/database.types'
import { createAdminClient } from '@/utils/supabase/admin'

/**
 * Select secupay smart transaction by ID (STX_xxx) (admin/service role)
 */
export const adminUpdateAndSelectSecupaySmartTransactionById = async (
  smartTransactionId: string,
) => {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('secupay_smart_transaction')
    .select('*')
    .eq('id', smartTransactionId)
    .select()
    .single()

  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

/**
 * Select secupay smart transaction by order ID (admin/service role)
 *
 * Returns the pre-authorized transaction for an order, if one exists.
 */
export const adminSelectSecupayTransactionByOrderId = async (
  orderId: number,
) => {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('secupay_smart_transaction')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle()

  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

/**
 * Update secupay smart transaction (admin/service role)
 */
export const adminUpdateSecupaySmartTransaction = async (
  id: string,
  values: TablesUpdate<'secupay_smart_transaction'>,
) => {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('secupay_smart_transaction')
    .update(values)
    .eq('id', id)

  if (error) throw new Error('Database error', { cause: error.message })
}
