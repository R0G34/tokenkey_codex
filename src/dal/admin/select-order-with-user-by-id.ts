import 'server-only'

import { Tables } from '@/lib/supabase/types/database.types'
import { createAdminClient } from '@/utils/supabase/admin'

export const adminSelectOrderWithUserById = async (
  id: Tables<'order'>['id'],
) => {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('order')
    .select(
      `
      *,
      user!inner(*, personalData:personal_data!inner(*)),
      project!inner(*)
      `,
    )
    .eq('id', id)
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  return data
}
