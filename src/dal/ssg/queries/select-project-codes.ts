import 'server-only'

import { createAdminClient } from '@/utils/supabase/admin'

export const selectProjectCodes = async () => {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('project')
    .select('code')
    .neq('status', 'Cancelled')
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}
