import 'server-only'

import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
import { verifySession } from './session'

export const insertOptinWithSelect = async (values: TablesInsert<'optin'>) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('optin')
    .insert(values)
    .select()
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}

export const updateOptin = async (
  id: Tables<'optin'>['id'],
  values: TablesUpdate<'optin'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { error } = await supabase.from('optin').update(values).eq('id', id)
  if (error) throw new Error('Database error', { cause: error.message })
}

export const updateOptinWithSelect = async (
  id: Tables<'optin'>['id'],
  values: TablesUpdate<'optin'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('optin')
    .update(values)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}
