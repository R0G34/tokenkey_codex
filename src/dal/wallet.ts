import 'server-only'

import { Tables, TablesUpdate } from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
import { verifySession } from './session'

export const selectWallet = async () => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('wallet')
    .select('*')
    .maybeSingle()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

export const insertWallet = async ({
  address,
  type,
  web3auth_user_info,
}: Pick<Tables<'wallet'>, 'address' | 'type' | 'web3auth_user_info'>) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { error, status } = await supabase.from('wallet').insert({
    address,
    type,
    user_id: session.user.id,
    web3auth_user_info,
  })
  // 23505 unique_violation
  if (error)
    if (error.code === '23505' || status === 409) return null
    else throw new Error('Database error', { cause: error.message })
}

export const deleteWallet = async () => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { error } = await supabase
    .from('wallet')
    .delete()
    .eq('user_id', session.user.id)
  if (error) throw new Error('Database error', { cause: error.message })
}

export const updateWallet = async (values: TablesUpdate<'wallet'>) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('wallet')
    .update(values)
    .eq('user_id', session.user.id)
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}
