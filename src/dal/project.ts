import 'server-only'

import { Tables } from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'

export const selectProjectByCode = async (code: Tables<'project'>['code']) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('project')
    .select('*')
    .neq('status', 'Cancelled')
    .eq('code', code.toUpperCase())
    .maybeSingle()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}
