import 'server-only'

import { TablesInsert } from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
import { verifySession } from './session'

export const insertConcedusIdentLink = async (
  values: TablesInsert<'concedus_ident_link'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { error } = await supabase.from('concedus_ident_link').insert(values)
  if (error) throw new Error('Database error', { cause: error.message })
}
