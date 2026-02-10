import 'server-only'

import { TablesUpdate } from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
import { cache } from 'react'
import { verifySession } from './session'

// https://nextjs.org/docs/app/building-your-application/caching#react-cache-function
export const verifyUser = cache(async () => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase.from('user').select('*').single()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
})

export const updateUser = async (values: TablesUpdate<'user'>) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { error } = await supabase
    .from('user')
    .update(values)
    .eq('id', session.user.id)
  if (error) throw new Error('Database error', { cause: error.message })
}

export const updateUserWithSelect = async (values: TablesUpdate<'user'>) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('user')
    .update(values)
    .eq('id', session.user.id)
    .select('*')
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}
