import 'server-only'

import { TablesUpdate } from '@/lib/supabase/types/database.types'
import { createAdminClient } from '@/utils/supabase/admin'

export const adminUpdatePersonalData = async (
  userId: string,
  values: TablesUpdate<'personal_data'>,
) => {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('personal_data')
    .update(values)
    .eq('user_id', userId)
  if (error) throw new Error('Database error', { cause: error.message })
}
