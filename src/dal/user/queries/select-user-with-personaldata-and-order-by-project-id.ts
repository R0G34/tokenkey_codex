import 'server-only'

import { verifySession } from '@/dal/session'
import { Tables } from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
// eslint-disable-next-line no-restricted-imports
import { redirect } from 'next/navigation'

export const selectUserWithPersonalDataAndOrderCountByProjectId = async (
  projectId: Tables<'project'>['id'],
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('user')
    .select('id, locale, personal_data(*), orders:order(count)')
    .eq('order.project_id', projectId)
    .neq('order.payment_status', 'secupay_authorization_error')
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  if (!data) redirect('/api/auth/signin')
  return data
}
