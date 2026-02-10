import 'server-only'

import { Tables } from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'

export const selectProjectTokenizedById = async (
  id: Tables<'project'>['id'],
) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('project')
    .select('*')
    .neq('status', 'Cancelled')
    .not('nyala_tokenized_asset_id', 'is', null)
    .eq('id', id)
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return data as Tables<'project'> & {
    nyala_tokenized_asset_id: NonNullable<
      Tables<'project'>['nyala_tokenized_asset_id']
    >
  }
}
