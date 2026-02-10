import 'server-only'

import { ORDER_PAYMENT_STATUS } from '@/app/[locale]/app/investments/constants'
import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
import { verifySession } from './session'

export const selectOrders = async () => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('order')
    .select('*, project(*)')
    .neq('payment_status', ORDER_PAYMENT_STATUS.SECUPAY_AUTHORIZATION_ERROR)
    .order('id')
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

export const selectOrderById = async (id: Tables<'order'>['id']) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('order')
    .select('*, project(*)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

export const insertOrderWithSelect = async (values: TablesInsert<'order'>) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('order')
    .insert(values)
    .select()
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

export const updateOrder = async (
  id: Tables<'order'>['id'],
  values: TablesUpdate<'order'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { error } = await supabase.from('order').update(values).eq('id', id)
  if (error) throw new Error('Database error', { cause: error.message })
}
