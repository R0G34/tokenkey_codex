import 'server-only'

import { Tables, TablesUpdate } from '@/lib/supabase/types/database.types'
import { createAdminClient } from '@/utils/supabase/admin'

export const updateConcedusIdentLink = async (
  provider: Tables<'concedus_ident_link'>['kyc'],
  providerId: Tables<'concedus_ident_link'>['action_id'],
  values: TablesUpdate<'concedus_ident_link'>,
) => {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('concedus_ident_link')
    .update(values)
    .eq('kyc', provider)
    .eq('action_id', providerId)
  if (error) throw new Error('Database error', { cause: error.message })
}
