import 'server-only'

import { TablesInsert } from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
import { verifySession } from './session'

export const insertTransaction = async (
  values: TablesInsert<'transaction'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { error } = await supabase.from('transaction').insert(values)
  if (error) throw new Error('Database error', { cause: error.message })
}
