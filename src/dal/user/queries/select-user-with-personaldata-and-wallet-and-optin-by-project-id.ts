import 'server-only'

import { verifySession } from '@/dal/session'
import { Tables } from '@/lib/supabase/types/database.types'
import { createClient } from '@/utils/supabase/server'
// eslint-disable-next-line no-restricted-imports
import { redirect } from 'next/navigation'

export const selectUserWithPersonalDataAndWalletAndOptinByProjectId = async (
  projectId: Tables<'project'>['id'],
) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase
    .from('user')
    .select('id, email, personal_data(*), wallet(*), optin:optin(*)')
    .eq('optin.project_id', projectId)
    .single()
  if (error) throw new Error('Database error', { cause: error.message })
  if (!data) redirect('/api/auth/signin')
  return data
}
