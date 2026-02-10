import 'server-only'

import { TablesInsert, TablesUpdate } from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
import { verifySession } from './session'

export const selectCompany = async () => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('company')
    .select('*')
    .maybeSingle()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

export const updateCompany = async (values: TablesUpdate<'company'>) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { error } = await supabase
    .from('company')
    .update(values)
    .eq('user_id', session.user.id)
  if (error) throw new Error('Database error', { cause: error.message })
}

export const upsertCompanyWithSelect = async (
  values: TablesInsert<'company'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('company')
    .upsert(values)
    .eq('user_id', session.user.id)
    .select('*')
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}
