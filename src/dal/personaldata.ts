import 'server-only'

import { TablesInsert, TablesUpdate } from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
import { verifySession } from './session'

export const selectPersonalData = async () => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('personal_data')
    .select('*')
    .maybeSingle()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

export const updatePersonalData = async (
  values: TablesUpdate<'personal_data'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { error } = await supabase
    .from('personal_data')
    .update(values)
    .eq('user_id', session.user.id)
  if (error) throw new Error('Database error', { cause: error.message })
}

export const updatePersonalDataWithSelect = async (
  values: TablesUpdate<'personal_data'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('personal_data')
    .update(values)
    .eq('user_id', session.user.id)
    .select('*')
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

export const upsertPersonalDataWithSelect = async (
  values: TablesInsert<'personal_data'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('personal_data')
    .upsert(values)
    .eq('user_id', session.user.id)
    .select('*')
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}
