import 'server-only'

import { Tables, TablesUpdate } from '@/lib/supabase/types/database.types'
import { createAdminClient } from '@/utils/supabase/admin'

export const adminUpdateOrder = async (
  id: Tables<'order'>['id'],
  values: TablesUpdate<'order'>,
) => {
  const supabase = createAdminClient()
  const { error } = await supabase.from('order').update(values).eq('id', id)
  if (error) throw new Error('Database error', { cause: error.message })
}

export const adminSelectOrdersByStatus = async (
  complianceStatus: Tables<'order'>['compliance_status'] | null,
) => {
  const supabase = createAdminClient()
  const query = supabase.from('order').select('*')
  if (complianceStatus) query.eq('compliance_status', complianceStatus)
  else query.is('compliance_status', null)
  const { data, error } = await query
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}
