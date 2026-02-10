import 'server-only'

import { TablesInsert } from '@/lib/supabase/types/database.types'
import { parseExperience } from '@/utils/supabase/parse-experience'
import { createClient } from '@/utils/supabase/server'
import { verifySession } from './session'

export const upsertExperienceWithSelect = async (
  values: TablesInsert<'experience'>,
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('experience')
    .upsert(values)
    .eq('user_id', session.user.id)
    .select('*')
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return parseExperience(data)
}
